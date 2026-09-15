---
title: RouterOS 7.X IPV6 设置
description: "RouterOS 7 开始 IPv6 包内置到主包，不再需要单独安装（RouterOS 6 时代 IPv6 是独立包 `ipv6-7.x.npk`，需要手动上传重启）。"
pubDate: 2025-07-12
category: 工作笔记
tags: [ros, routeros, 软路由]
---

## 前言

RouterOS 7 开始 IPv6 包内置到主包，不再需要单独安装（RouterOS 6 时代 IPv6 是独立包 `ipv6-7.x.npk`，需要手动上传重启）。

国内运营商（电信/联通/移动）从 2020 年起逐步在 PPPoE / DHCP 链路上启用 IPv6 PD（前缀委派），用户端拿到的通常是 `/60` 或 `/56` 前缀，可以切成多个 `/64` 给不同 VLAN / 局域网使用。

本文记录在 RouterOS 7.X 上启用 IPv6 的完整流程——从 WAN 拨号到 LAN 客户端能访问 IPv6 网站。

## 一、前置确认

配置前确认 3 件事：

1. **ISP 支持 IPv6 PD**：打电话给运营商或看光猫管理页的 WAN 侧是否有 IPv6 地址
2. **RouterOS 版本 ≥ 7.1**（早期 v7 有 IPv6 防火墙 bug）：`/system resource print` 看 version
3. **WAN 接口类型**：PPPoE / DHCP client / 静态，三种配置略有不同。本文以 PPPoE 为例

## 二、WAN 侧配置（DHCPv6 Client）

确保 RouterOS 已经能正常上网后，开启 IPv6 的 DHCPv6 客户端：

**Winbox 路径**：`IPv6 → DHCPv6 Client`

或命令行：

```routeros
/ipv6 dhcp-client add interface=pppoe-out1 pool-name=isp-pd \
 pool-prefix-length=64 add-default-route=yes request=prefix
```

参数说明：
- `interface=pppoe-out1`：你的 WAN 接口名
- `pool-name=isp-pd`：PD 拿到的前缀会存到这个 pool，后续 LAN 地址从这里取
- `pool-prefix-length=64`：每个 LAN 切 /64（最常用）
- `add-default-route=yes`：自动加 IPv6 默认路由
- `request=prefix`：只请求前缀，不请求 IA_NA（WAN 地址用 link-local）

执行后 `status` 应该是 `bound`，`prefix` 字段会显示类似 `2001:db8:1200::/56`（运营商分配的）。

## 三、给内网网卡分配 IPv6 地址

WAN 拿到前缀后，给 LAN bridge / ether 接口分配 IPv6：

**Winbox 路径**：`IPv6 → Addresses → +`

或命令行：

```routeros
/ipv6 address add address=::1/64 interface=bridge-lan \
 from-pool=isp-pd advertise=yes
```

关键参数：
- `from-pool=isp-pd`：从 PD pool 自动取地址
- `advertise=yes`：让 RouterOS 在 LAN 侧发送 Router Advertisement（RA），客户端可以走 SLAAC 自动配置
- `::1/64`：从 pool 拿到的前缀，主机位固定为 `::1`

## 四、配置 Router Advertisement（RA）

RA 告诉 LAN 上的主机"用什么前缀、用 SLAAC 还是 DHCPv6"。**没有 RA，主机即使拿到地址也没默认网关**。

**Winbox 路径**：`IPv6 → Neighbor Discovery`

或：

```routeros
/ipv6 nd set [find interface=bridge-lan] advertise-dns=yes \
 managed-address-configuration=no other-configuration=no \
 ra-interval=60s-200s ra-lifetime=1800s
```

参数说明：
- `managed-address-configuration=no`：客户端用 SLAAC 自配地址（推荐）
- `other-configuration=no`：客户端不需要去 DHCPv6 拿其他参数（DNS 用 RA 推送）
- `ra-interval=60s-200s`：RA 发送间隔（RFC 4861 推荐值）
- `ra-lifetime=1800s`：客户端默认路由有效期
- `advertise-dns=yes`：RA 里带上 DNS 服务器（v6-only 网络必须）

⚠️ **不要在 RA 里 disable**——禁了 RA 等于禁了整个 IPv6 内网。

## 五、DHCPv6 Server（可选）

如果你想让客户端从 DHCPv6 拿到**有状态地址**（不用 SLAAC），开 DHCPv6 server。但**大部分家用场景用 SLAAC 就够了**，可以跳过这一步。

```routeros
/ipv6 dhcp-server add name=dhcpv6-lan interface=bridge-lan \
 address-pool6=isp-pd lease-time=1h
```

## 六、防火墙（容易遗漏）

**这是 2026 年 RouterOS IPv6 配置最容易踩坑的地方**——很多人配完前面几步后能上网，但**忘了 IPv6 防火墙也是独立的 filter 表**。没有 IPv6 防火墙规则，每个 LAN 设备都直接暴露公网。

需要 3 组 filter 规则：

```routeros
/ipv6 firewall filter
# 1. 允许 established/related（回程流量）
add chain=input action=accept connection-state=established,related \
 comment="accept established/related"
add chain=forward action=accept connection-state=established,related \
 comment="accept established/related"

# 2. 允许 LAN 出网（限制 ICMPv6 不能全 drop）
add chain=input action=accept protocol=icmpv6 comment="accept ICMPv6"
add chain=forward action=accept protocol=icmpv6 comment="accept ICMPv6 forward"
add chain=forward action=accept in-interface=bridge-lan \
 comment="accept LAN to WAN"

# 3. drop invalid + default drop
add chain=input action=drop connection-state=invalid comment="drop invalid"
add chain=forward action=drop connection-state=invalid comment="drop invalid"
add chain=input action=drop comment="drop all other input"
add chain=forward action=drop comment="drop all other forward"
```

⚠️ **关键：ICMPv6 不能 drop**——Neighbor Discovery、DAD、Path MTU Discovery 都基于 ICMPv6。drop 了 ICMPv6 等于 drop 整个 IPv6。

## 七、MTU / MSS 调优（解决 IPv6 网页打不开）

按上面配完通常就能上网了，但**打开 IPv6 网站有时特别慢**——原因是 PMTUD 失败 + TCP MSS 没协商好。需要加 mangle 规则：

```routeros
/ipv6 firewall mangle
add chain=forward protocol=tcp tcp-flags=syn \
 tcp-mss=1201-1535 action=change-mss new-mss=clamp-to-pmtu \
 comment="clamp TCP MSS for IPv6 path MTU"
```

这条规则把所有出站 TCP SYN 包的 MSS 改成 `clamp-to-pmtu`（即根据路径 MTU 自动算）。不开的话，IPv6 包默认 MTU 1280 vs IPv4 1500，会触发分片，部分网站（特别是国内 CDN）会卡住。

## 八、验证

配置完后跑一遍检查：

```routeros
# 1. PD client 是否 bound
/ipv6 dhcp-client print
# 应该看到 status=bound, prefix=2001:db8:xxxx::/56

# 2. 内网地址是否分配
/ipv6 address print
# 应该看到 bridge-lan 上有一个 /64 地址

# 3. 防火墙规则是否生效
/ipv6 firewall filter print stats
# 看各条规则的 packets/bytes 是否在涨

# 4. 从 LAN 设备测 IPv6 连通性
# 浏览器访问 https://ipv6-test.com/ 或 http://test-ipv6.com/
# 期望：IPv6 地址出现 + 得分 ≥ 10/10

# 5. 测 IPv6 DNS
/tool traceroute 2001:4860:4860::8888
# 期望：能 ping 通 Google IPv6 DNS
```

如果哪一步卡住，按以下顺序排查：
1. PD client `searching` 状态 → ISP 不分配 PD
2. LAN 客户端没拿到地址 → 检查 RA 是否 enabled、interface 是否正确
3. 能 ping IP 但打不开网页 → MTU/MSS 问题
4. 某些网站能开某些不能 → 防火墙规则问题

## 九、完结

至此可以愉快地上 IPv6 了——打开浏览器访问 `https://ipv6.google.com/` 应该能直接连上。**建议**保留 `/ipv6 firewall filter print` 输出截图，方便对照。
