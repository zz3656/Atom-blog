---
title: 各云盘 VPS 写入 ROS 方法
description: "**📌 来源说明**：本文方法转载自「无线路由类」博客（2023-12-08），原方法适用于 RouterOS CHR 6.48.x，文中命令已更新到 7.x 适用版本。 RouterOS CHR（Cloud Hosted Router）是 MikroTik 官方推出的**云端版 RouterOS**，免费许可..."
pubDate: 2025-07-12
tags: [routeros, ros, 软路由]
---

> **📌 来源说明**：本文方法转载自「无线路由类」博客（2023-12-08），原方法适用于 RouterOS CHR 6.48.x，文中命令已更新到 7.x 适用版本。

## 前言

RouterOS CHR（Cloud Hosted Router）是 MikroTik 官方推出的**云端版 RouterOS**，免费许可，支持 x86_64 KVM 虚拟化。本地家用场景一般用不上 CHR（家用装实体机 / PVE 都更稳），但**云服务器 / VPS 上跑 RouterOS**，CHR 是唯一选择。

典型场景：
- VPS 上做软路由（异地组网、远程 VPN）
- 把 VPS 流量统一从 RouterOS 出口（旁路网关）
- 跨境 / 海外 VPS 跑 ROS 做策略路由

CHR 不是完整镜像，是一个**可写入裸盘的 img 文件**——所以要在 VPS 上先把系统"刷成 RouterOS"。

## 一、原理

CHR 的 img 文件结构：

```
[ MBR 分区表 ][---  64KB 空白  ---][--- RouterOS 主分区 ext4 ---]
                  ↑
              这个空白区是用来放"自动配置脚本"的位置
```

写入流程：
1. 在 VPS（Debian 12）上下载 CHR img
2. 挂载 img，把"自动配置网络"的脚本塞到 64KB 空白区
3. dd 把整个 img 写入 VPS 硬盘（/dev/vda）
4. 重启 → VPS 直接进入 RouterOS

## 二、前置准备

### 1. VPS 必须是 KVM 虚拟化

OpenVZ / LXC 虚拟化的 VPS **不支持**写入 CHR（无法访问底层磁盘）。买 VPS 时看清楚虚拟化类型：标"Full virtualization"或"KVM"才行。

判断方法（VPS 内部）：

```bash
# 如果输出包含 container / lxc -> 不支持
cat /proc/1/cgroup
# 输出类似 systemd / /docker/xxx -> 容器
# 输出类似 / -> 真机或 KVM
```

### 2. VPS 系统先装 Debian 12

CHR img 是**裸磁盘镜像**——必须先有个系统（Debian 12）来执行 dd 操作。重装系统时选 Debian 12 minimal 即可，**不要选 Ubuntu**（NetworkManager 会让 ens3 / eth0 命名变奇怪）。

### 3. 备份重要数据

dd 写入会**清空整个 VPS 硬盘**——这是不可逆操作。建议先备份 `/etc`、`/root/.ssh/` 等配置。

## 三、操作步骤

### 步骤 1：下载 CHR 镜像

```bash
wget https://download.mikrotik.com/routeros/7.15.2/chr-7.15.2.img.zip
```

⚠️ **版本号会变**。最新版本参考 [MikroTik Download 页面](https://mikrotik.com/download)，选 **Cloud Hosted Router** 类别下的 **Raw disk image**。

CHR 历史稳定版本推荐（截至 2026 年）：

| 版本 | 发布日期 | 备注 |
|------|----------|------|
| 7.15.2 | 2025-12 | 长期支持分支 |
| 7.16.x | 2026 Q1 | 当前最新 |
| 7.17.x | 2026 Q2 | 新功能分支 |

**建议选 7.15.x 或 7.16.x**——长期支持稳定版，避免小版本号引入新 bug。

### 步骤 2：解压并重命名

```bash
unzip chr-7.15.2.img.zip
mv chr-7.15.2.img chr.img
```

重命名是硬性要求——后面命令都引用 `chr.img`。

### 步骤 3：查看镜像 Start 值

```bash
fdisk -lu chr.img
```

输出类似：

```
Disk chr.img: 256 MiB, 268435456 bytes, 524288 sectors
Units: sectors of 1 * 512 = 512 bytes

Device     Boot StartCHS   EndCHS        Start   End     Sectors  Size Id Type
chr.imgp1 *  0,32,33     1023,32,28       34 524287   524254  256M 83 Linux
```

关键看 `Start` 列：**v6 是 1，v7 是 34**。

### 步骤 4：挂载镜像

**v6 镜像**：

```bash
mount -o loop,offset=512 chr.img /mnt
```

**v7 镜像**（Start=34）：

```bash
mount -o loop,offset=$((34*512)) chr.img /mnt
# 上面算出 offset=17408
# 实际不同版本 offset 可能不同，按 fdisk 输出算
```

⚠️ **offset 算法**：Start 值 × 512 字节。如果 Start=34，则 offset=17408。

如果你用 v7.15.2 镜像实测 offset=33571840 是常见值——以你 `fdisk` 输出的 Start 为准。

### 步骤 5：写入自动配置脚本

CHR 启动时会执行 64KB 空白区的 `autorun.scr` 脚本（RouterOS 配置格式）。我们提前塞进去一段 IP / 网关配置，避免重启后断网连不上。

```bash
mkdir -p /mnt/rw

# 自动获取当前 VPS 的 IP 和网关
ADDR0=`ip addr show ens3 | grep global | cut -d' ' -f 6 | head -n 1`
GATE0=`ip route list | grep default | cut -d' ' -f 3`

# 写入 RouterOS 自动配置脚本
echo "/ip address add address=$ADDR0 interface=[/interface ethernet find where name=ether1]
/ip route add gateway=$GATE0
" > /mnt/rw/autorun.scr

# 验证
cat /mnt/rw/autorun.scr
```

⚠️ **网卡名称要确认**：VPS 主流网卡是 `eth0` 或 `ens3`，AWS / Oracle Cloud 是 `ens3`，部分 VPS 是 `eth0`。用 `ifconfig` 或 `ip addr show` 查看实际网卡名替换。

### 步骤 6：卸载并准备写入

```bash
umount /mnt
# 强制 sync 缓存
sync
```

### 步骤 7：写入 VPS 硬盘

先看 VPS 硬盘路径：

```bash
fdisk -lu
```

典型输出：

```
Disk /dev/vda: 25 GiB, ...
```

⚠️ **必须是 `/dev/vda` 这种块设备**，不是 `/dev/sda1` 这种分区（分区只占一部分）。

写入：

```bash
dd if=chr.img bs=1024 of=/dev/vda && reboot
```

`bs=1024` 是块大小，写入速度大概 30-60 MB/s，整个 256MB 镜像大约 10-20 秒。

部分 VPS 不会自动重启，需要手动触发：

```bash
echo "b" > /proc/sysrq-trigger
```

`b` 是 SysRq 的"reboot"魔法键——比直接 `reboot` 更可靠。

## 四、连接验证

重启后等待 30-60 秒，CHR 应该启动完成。用 VPS 提供的 VNC / 控制台查看：

- 如果一切正常，会看到 RouterOS 启动日志，最后是登录提示
- 默认账号 `admin`，无密码（首次登录强制要求设置）

如果是远程 VPS，需要通过控制台的"Network Console"或 VNC 操作——**无法 SSH**（RouterOS 不支持 SSH 直连到 linux 网络栈）。

进入后：

```routeros
/ip address print
# 应该看到刚才自动设置的 IP

/ip route print
# 应该看到 default gateway

/tool ping 8.8.8.8 count=5
# 验证外网连通性
```

## 五、常见问题

### Q: dd 写完后重启，VPS 还是 Debian？

可能原因：
- VPS 不支持自定义镜像启动（部分 OpenVZ / LXC 虚拟化）
- dd 写错了盘（比如把 dd 写到了 `/dev/vda1` 而不是 `/dev/vda`）

### Q: 写完后启动卡在 "no such device"

通常是 offset 不对。重新算 offset（步骤 4）。

### Q: 启动后能登录但 ping 不通外网

`autorun.scr` 没生效（网卡名不对）。用 VNC 登录后手动配置 IP：

```routeros
/ip address add address=<VPS_IP> interface=ether1
/ip route add gateway=<VPS_GATEWAY>
```

### Q: 想保留 Debian 同时跑 RouterOS？

需要 KVM 双层嵌套（host 里跑 VM），性能损耗 10-20%。这种场景直接用 PVE / Proxmox 更合适，不推荐 CHR 嵌套。

## 六、CHR 许可

CHR 免费许可，但有 1 Mbps 上行限制。要解锁完整速度需要买 P1-P10 许可证（按月付费）。

如果只是做 VPN / 远程组网，1 Mbps 完全够用。如果是全量出口，建议直接用 PVE + RouterOS 实体镜像（不受 1 Mbps 限制）。

## 七、完结

CHR 在 VPS 上写入的核心是 **3 步**：

1. **下载 CHR img**（Raw disk image）
2. **mount + 写 autorun.scr**（关键，否则重启断网）
3. **dd 写入 + reboot**

整个流程 5 分钟内可完成，前提是 VPS 是 KVM 虚拟化。
