---
title: RouterOS v7 从入门到精通完整指南
description: "基于 MikroTik 官方文档，系统整理 RouterOS v7 从新手入门到高级进阶的完整中文教程，涵盖安装配置、网络基础、NAT、防火墙、路由、QoS、VLAN 等核心知识点。"
pubDate: 2026-09-16
category: 网络路由
tags: [RouterOS, ROS, 软路由, MikroTik, 网络, 进阶]
---

> **参考资料**：本文内容基于 [MikroTik 官方文档](https://help.mikrotik.com/docs/)（RouterOS v7.5+），结合社区翻译版 [RouterOS 中文手册](https://mikrotik-doc-cn.readthedocs.io/) 整理。MikroTik 官方文档仅英文版，中文资源主要靠社区力量。v7 与 v6 差异较大，请注意版本区别。

---

## 一、RouterOS 是什么

RouterOS（简称 ROS）是 MikroTik 公司开发的独立操作系统，基于 Linux 内核运行，可以将普通 x86 PC 转变成专业级路由器，也可以运行在 MikroTik 自有硬件（RouterBOARD 系列）和虚拟机上。

### 核心特性

- **网络全家桶**：路由、NAT、DHCP、防火墙、QoS、WireGuard VPN、无线 AP、负载均衡、用户认证等，一套系统搞定
- **CLI + GUI 双支持**：命令行终端 + WinBox（Windows 专用）+ WebFig（网页管理）
- **免费许可**：90 天免费试用，L4（单设备）永久免费
- **架构轻量**：Linux 内核，资源占用低，96MB 内存即可运行

### 系统安装方式

| 平台 | 方式 |
|------|------|
| x86 PC | 安装到硬盘，类似普通 Linux 系统 |
| 虚拟机 | 下载 RouterOS `img` 镜像，VMware / Proxmox / VirtualBox 均可 |
| MikroTik 硬件 | ROS 预装，开机即用 |
| CHR（Cloud Hosted Router） | 在 AWS / GCP / 阿里云等云厂商上运行 |

---

## 二、新手入门（Getting Started）

### 2.1 首次配置流程

MikroTik 官方推荐的配置工作流分四步：

1. **连接** — 通过网线连接路由器的 LAN 口，使用 WinBox 连接默认 MAC 地址
2. **评估** — 查看当前配置，禁用不安全的服务（FTP、Telnet、WWW）
3. **获取互联网** — 配置 WAN 口 IP（DHCP 或静态）、设置默认路由
4. **配置局域网** — 创建 Bridge 接口、配置 IP 地址、开启 DHCP 服务器、设置 NAT

### 2.2 三种管理方式

- **WinBox**：Windows 下最推荐的图形工具，通过 MAC 地址或 IP 连接，支持拖拽配置、实时查看流量
- **WebFig**：浏览器访问 `http://<router-ip>:8728`，跨平台，功能与 WinBox 基本一致
- **CLI 终端**：`/ip address print`、`/ip route print` 等命令，适合脚本化和高级配置

> **提示**：v7 中命令行帮助使用 `F1` 键（v6 是 `?`）。

### 2.3 安全加固（必做）

1. 修改默认 admin 密码
2. 禁用不安全服务：telnet（23）、ftp（21）、www（80）
3. 启用安全服务：ssh（22）、winbox（8291 api-ssl（8729）
4. 添加管理 IP 白名单：`/ip service set telnet disabled=yes`
5. 定期备份配置并导出到外部存储

```bash
# 备份配置
/system backup save name="backup-$(date +%Y%m%d)"

# 导出配置到文件
/system backup export

# 导出加密配置文件
/export file="config-export"
```

---

## 三、网络基础配置

### 3.1 Bridge（桥接）

RouterOS 中 Bridge 是核心概念，用于将多个接口组合成一个虚拟二层接口，IP 地址配置在 Bridge 上而非物理接口上。

```bash
# 创建桥接
/bridge add name=bridge1

# 将 LAN 口加入桥
/bridge port add bridge=bridge1 interface=ether2-5

# 在桥接接口上分配 IP
/ip address add address=192.168.88.1/24 interface=bridge1
```

### 3.2 DHCP 服务器

```bash
# 启用 DHCP
/ip dhcp-server add interface=bridge1 name=dhcp1

# 自动配置（一条命令搞定）
/ip dhcp-server setup
# 会交互式询问：DHCP 地址范围、DNS 服务器、网关等
```

生成的典型 DHCP 配置：

```bash
/ip pool add name=dhcp_pool ranges=192.168.88.10-192.168.88.254
/ip dhcp-server set dhcp1 pool=dhcp_pool lease-time=1d
/ip dhcp-server network add address=192.168.88.0/24 gateway=192.168.88.1 dns-server=192.168.88.1
```

### 3.3 DNS 与网关

```bash
# 设置 DNS（用于 NAT 设备解析域名）
/ip dns set servers=1.1.1.1,8.8.8.8

# 添加默认路由（指向 WAN 口或 ISP 网关）
/ip route add dst-address=0.0.0.0/0 gateway=<WAN_GW_IP>
```

---

## 四、NAT 与端口转发

### 4.1 基础 MASQUERADE（SNAT）

让局域网通过 WAN 口共享上网：

```bash
/ip firewall nat add chain=postrouting out-interface=ether1 action=masquerade
```

### 4.2 端口转发（DNAT）

将外网端口映射到内网某个设备：

```bash
# 转发外网 8080 到内网 NAS 的 80 端口
/ip firewall nat add chain=prerouting action=dst-nat protocol=tcp dst-port=8080 to-ports=80 to-addresses=192.168.88.100
```

### 4.3 固定端口转发示例

```bash
# SSH 管理 — 将外网 2222 映射到内网 NAS 的 22
/ip firewall nat add chain=prerouting action=dst-nat protocol=tcp dst-port=2222 to-ports=22 to-addresses=192.168.88.100

# Web 管理 — 外网 8080 → 内网 NAS 80
/ip firewall nat add chain=prerouting action=dst-nat protocol=tcp dst-port=8080 to-ports=80 to-addresses=192.168.88.100
```

> ⚠️ **安全提醒**：公网暴露服务前务必确认目标设备安全性，建议设置 IP 白名单限制来源地址。

---

## 五、防火墙

### 5.1 包过滤架构

RouterOS 防火墙基于 `Connection Tracking`（连接跟踪），数据包从进来到达目标会经过 Chain 处理：

- **input chain**：目标地址是本路由器本身的数据包
- **forward chain**：经过路由器转发的数据包（LAN→WAN / WAN→LAN）
- **output chain**：路由器自身发出的数据包

### 5.2 安全包过滤（推荐配置）

遵循官方安全最佳实践，按顺序配置三条规则：

```bash
# 第1步：允许已建立和相关的连接（避免干扰正常通信）
/ip firewall filter add chain=input connection-state=established,related action=accept comment="allow-established"

# 第2步：主动访问的控制（你访问别人的连接）
/ip firewall filter add chain=output connection-state=new action=accept comment="allow-output"

# 第3步：RAW 防火墙处理不受 conntrack 影响的包（ICMP、不关联连接等）
/ip firewall raw add chain=prerouting action=drop connection-state=new invalid-connection-state=yes
```

剩余所有包默认被丢弃（input chain 和 forward chain 的默认策略应为 `drop`）。

### 5.3 常用规则示例

```bash
# 允许 Ping
/ip firewall filter add chain=input protocol=icmp action=accept

# 仅允许特定 IP 管理 SSH
/ip firewall filter add chain=input protocol=tcp dst-port=22 src-address=192.168.88.100 action=accept

# 限制 WAN 口输入（外部访问限制）
/ip firewall filter add chain=input in-interface=ether1 action=drop

# 允许内网访问外网
/ip firewall filter add chain=forward in-interface=bridge1 action=accept
/ip firewall filter add chain=forward in-interface=bridge1 connection-state=new action=accept
```

---

## 六、路由进阶

### 6.1 静态路由

```bash
# 添加静态路由
/ip route add dst-address=10.0.0.0/8 gateway=192.168.1.1 scope=30

# 查看路由表
/ip route print
/ip route print where disabled=no

# 标记路由（用于策略路由）
/ip route add dst-address=0.0.0.0/0 gateway=wan1 routing-mark=to-wan1
/ip route add dst-address=0.0.0.0/0 gateway=wan2 routing-mark=to-wan2
```

### 6.2 动态路由（BGP / OSPF）

#### BGP 配置示例

```bash
# 启用 BGP
/bgp setting set version=4

# 配置邻居
/bgp connection add out-area=0.0.0.0 remote-address=<BGP_PEER_IP> peer-type=external \
  AS=65001 my-as-number=65000 disabled=no

# 发布网段
/ip route check-network
```

> **v7 重要变更**：路由过滤器从 v6 的防火墙风格规则改为**声明式脚本语法**（`if-then-else`），默认未匹配的路由会被拒绝。

#### OSPF 配置示例

```bash
/ospf instance set default name=default
/ospf network add network=192.168.1.0/24 area=0
/ospf area add name=area-0 backbones=area-0
```

### 6.3 策略路由（PBR）

为特定流量指定不同出口：

```bash
# 标记流量
/ip firewall mangle add chain=prerouting dst-address=8.8.8.8 action=mark-routing \
  new-routing-mark=to-wan1

# 关联路由标记
/ip route add dst-address=0.0.0.0/0 gateway=wan1 routing-mark=to-wan1
```

---

## 七、QoS 流量管理

### 7.1 两级架构

1. **Mangle（标记分类）**：识别流量并打标记，不控制速率
2. **Queue Tree（队列限速）**：根据标记实施限速

### 7.2 PCQ（每连接队列）自动限流

最简单的方案，一键给所有用户均分带宽：

```bash
# 第一步：Mangle 标记每连接
/ip firewall mangle add chain=prerouting dst-type=local action=accept
/ip firewall mangle add chain=postrouting dst-type=local action=accept
/ip firewall mangle add chain=postrouting action=mark-connection \
  new-connection-mark=to-client-cc passthrough=yes
/ip firewall mangle add chain=prerouting action=mark-packet \
  new-packet-mark=to-client-pc passthrough=no connection-mark=to-client-cc \
  pcq-filter=to-client-cc pcq-rate=5000k pcq-classifier=both-all \
  pcq-limit=50 pcq-timeout=10m
/ip firewall mangle add chain=postrouting action=mark-connection \
  new-connection-mark=to-router-cc passthrough=yes
/ip firewall mangle add chain=postrouting action=mark-packet \
  new-packet-mark=to-router-pc passthrough=no connection-mark=to-router-cc \
  pcq-filter=to-router-cc pcq-rate=5000k pcq-classifier=both-all \
  pcq-limit=50 pcq-timeout=10m

# 第二步：Queue Tree 限速
/queue tree add name="to-client" parent=ether1 packet-mark=to-client-pc \
  max-limit=10M burst-limit=20M burst-time=30s priority=8
/queue tree add name="to-router" parent=ether1 packet-mark=to-router-pc \
  max-limit=5M burst-limit=10M burst-time=30s priority=8
```

---

## 八、VLAN 配置

### 8.1 基础 VLAN

```bash
# 创建 VLAN 接口
/ip address add address=192.168.10.1/24 interface=vlan-lan1
/ip address add address=192.168.20.1/24 interface=vlan-lan2

# 在 Bridge 端口上打 VLAN 标签
/bridge vlan add bridge=bridge1 vlan-ids=10 tagged=bridge1 untagged=ether2
/bridge vlan add bridge=bridge1 vlan-ids=20 tagged=bridge1 untagged=ether3
```

### 8.2 多 VLAN 隔离与互通

```bash
# VLAN 间隔离（默认隔离，相邻 VLAN 无法通信）
/bridge port set [find interface=ether2] pvid=10
/bridge port set [find interface=ether3] pvid=20

# 允许特定 VLAN 间通信
/ip firewall filter add chain=forward in-interface=vlan-lan1 \
  out-interface=vlan-lan2 action=accept
```

---

## 九、WireGuard VPN

### 9.1 基础配置

```bash
# 生成密钥对
/tool remote-api key generate

# 创建 WireGuard interface
/interface wireguard add name=wg0 listen-port=51820 private-key=<your-private-key>

# 添加对等方
/interface wireguard peers add interface=wg0 public-key=<peer-public-key> \
  allowed-address=10.88.0.2/32 persistent-keepalive=25s
```

### 9.2 注意事项

- **WireGuard 是三层协议**（IP 隧道），不能直接加到 Bridge VLAN 端口做二层扩展
- VPN 客户端通过三层路由访问内网，可配合 DHCP/Mangle 实现精细控制
- 性能优秀，适合低延迟场景

---

## 十、无线配置（AP）

### 10.1 基础 AP 配置

```bash
# 设置无线频道
/wireless registration-table set default frequency-mode=regulatory-domain

# 创建 SSID
/interface wireless add name=wlan1 interface=radio1 ssid=MyWiFi mode=ap-bridge \
  band=2ghz-b/g/n security-profile=default

# 在桥接模式下
/interface wireless set wlan1 bridge=bridge1
```

### 10.2 无线安全

```bash
# 启用 WPA2 密码保护
/wireless security-profiles set default supplicant-identity=MikroTik \
  wpa2-pre-shared-key=YourStrongPassword
```

---

## 十一、高级技巧

### 11.1 负载均衡（双 WAN）

```bash
# ECMP 等价多路径
/ip route add dst-address=0.0.0.0/0 gateway=wan1,wan2 scope=30

# 或者使用 mangle + 策略路由的更精细方案
```

### 11.2 Hotspot（用户认证）

```bash
/ip hotspot setup
# 交互式向导，生成完整的 Hotspot 配置
```

配合 User Manager v5 和 RADIUS 可以实现：
- PPPoE 认证
- 802.1X 认证（支持 EAP-TLS、EAP-TTLS、PEAP）
- 按流量计费

### 11.3 自动化脚本

```bash
# 简单脚本：监控在线状态
/system script add name=watcher source={
    :foreach i in=[/ip route find where dynamic=no and status=feed-down] do={
        /log warning message=("Route $i is down")
    }
}
```

---

## 十二、排错与调试

### 常用诊断命令

```bash
# 测试连通性
/tool mac-server ping <target-ip>

# 抓包分析
/ip packet sniffer set interface=all
/ip packet sniffer start

# 路由追踪
/tool traceroute <target-ip>

# 实时日志
/log print follow
```

### 常见故障排查

| 问题 | 排查步骤 |
|------|---------|
| 无法上网 | `ip route print` 确认默认路由，`ping` 测试 DNS 解析 |
| 内网不通外网 | 检查 NAT masquerade 规则，`ip firewall nat print` |
| WAN→内网不通 | 检查端口转发 + input/forward chain 放行规则 |
| 带宽满 | 使用 `queue tree print` 和 `ip firewall connection print` 分析流量 |

---

## 总结

RouterOS v7 的学习路径建议：

1. **入门**：WinBox 快速上手 → Bridge + DHCP + NAT → 能上网
2. **进阶**：防火墙规则 → 端口转发 → DNS → 安全加固
3. **高阶**：BGP/OSPF 动态路由 → QoS 限流 → VLAN → 策略路由
4. **专家**：WireGuard VPN → Hotspot 认证 → 负载均衡 → 自动化脚本

MikroTik 官方文档是英文的，推荐阅读顺序：

- **入门**：Getting Started → First Time Configuration → 安全建议
- **网络**：Bridge → IP Address → DHCP → NAT → Firewall
- **高级**：Routing → BGP/OSPF → QoS → VLAN → WireGuard

> **参考文档**：
> - [RouterOS 官方文档](https://help.mikrotik.com/docs/)
> - [CLI Reference](https://manual.mikrotik.com/docs/cli-reference/)
> - [RouterOS 中文社区版](https://mikrotik-doc-cn.readthedocs.io/)
