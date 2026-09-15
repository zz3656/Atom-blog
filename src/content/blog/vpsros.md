---
title: VPS 安装 ros 系统
description: "**📌 说明**：本文流程与同仓库《各云盘 VPS 写入 ROS 方法》(B8) 90% 重叠，差异点在于本文覆盖**双网卡场景**（VPS 既要访问外网又要被 LAN 设备访问）和**PVE 导入**的另一种实现路径。如果你只需要单网卡 VPS 装 ROS，看 B8 即可；本文针对多网卡 / PVE 场景。 ..."
pubDate: 2025-07-12
category: 操作系统
tags: [vps, ros, 软路由]
---

> **📌 说明**：本文流程与同仓库《各云盘 VPS 写入 ROS 方法》(B8) 90% 重叠，差异点在于本文覆盖**双网卡场景**（VPS 既要访问外网又要被 LAN 设备访问）和**PVE 导入**的另一种实现路径。如果你只需要单网卡 VPS 装 ROS，看 B8 即可；本文针对多网卡 / PVE 场景。

## 前言

VPS 装 RouterOS（ROS）有两种典型场景：

1. **单网卡**：VPS 自身作为 ROS 软路由，跑 VPN / 策略路由 / 远程组网
2. **双网卡**：VPS 作为旁路网关，把 LAN 流量引入 ROS（需要 eth0 公网 + eth1 私网）

本文流程与 B8 几乎一样，差异在 `autorun.scr` 里多配置一张网卡 + 多一条路由。

## 一、单网卡方案（快速版）

如果你的 VPS 只有 1 块网卡（绝大多数 VPS 都是这样），完整流程参考《各云盘 VPS 写入 ROS 方法》。这里给"快速版"——10 分钟可完成：

```bash
# 1. 安装 wget（如果 VPS 没装）
yum install wget -y   # CentOS
apt install wget -y   # Debian / Ubuntu

# 2. 下载并解压 CHR 镜像
wget https://download.mikrotik.com/routeros/6.45.8/chr-6.45.8.img.zip -O chr.img.zip
gunzip -c chr.img.zip > chr.img

# 3. 查 Start 值（v6 = 1，v7 = 34）
fdisk -lu chr.img

# 4. 挂载镜像（v6 用 512，v7 用 Start*512）
mount -o loop,offset=512 chr.img /mnt

# 5. 自动获取当前 IP / 网关
ADDR0=`ip addr show eth0 | grep global | cut -d' ' -f 6 | head -n 1`
GATE0=`ip route list | grep default | cut -d' ' -f 3`

# 6. 写入自动配置脚本
mkdir -p /mnt/rw
echo "/ip address add address=$ADDR0 interface=[/interface ethernet find where name=ether1]
/ip route add gateway=$GATE0
" > /mnt/rw/autorun.scr

# 7. 卸载 + 写盘 + 重启
umount /mnt
sync
dd if=chr.img bs=1024 of=/dev/vda && reboot   # 部分 VPS 用 /dev/sda
echo "b" > /proc/sysrq-trigger   # 如果不会自动重启
```

完成后等 30-60 秒，VPS 通过 VNC / 控制台进入 ROS 登录界面（admin 无密码）。

## 二、双网卡方案

**双网卡场景**：VPS 有 2 块网卡，eth0 接公网（WAN），eth1 接私网（LAN / 内网互联）。这种配置常见于：
- VPS 当作**远程 VPN 网关**（公司 LAN 通过 VPN 连接到 VPS）
- **异地组网**：VPS 在中间，把多个 LAN 桥接起来

### 1. 先查清楚两张网卡的 IP 段

```bash
ip addr show
# 典型输出:
# eth0: inet 196.10.68.24/24  (公网 IP)
# eth1: inet 10.0.87.152/8     (私网 IP)

ip route show
# default via 196.10.68.1 dev eth0   (默认路由走公网)
# 10.0.0.0/8 via 10.0.0.1 dev eth1  (私网路由)
```

### 2. 把两张网卡都配置到 autorun.scr

```bash
ADDR0=`ip addr show eth0 | grep global | cut -d' ' -f 6 | head -n 1`
ADDR1=`ip addr show eth1 | grep global | cut -d' ' -f 6 | head -n 1`
GATE0=`ip route list | grep default | cut -d' ' -f 3`
GATE1=`ip route list | grep '10.0.0.0/8' | cut -d' ' -f 9`

mkdir -p /mnt/rw
echo "/ip address add address=$ADDR0 interface=[/interface ethernet find where name=ether1]
/ip address add address=$ADDR1 interface=[/interface ethernet find where name=ether2]
/ip route add gateway=$GATE0
/ip route add dst-address=10.0.0.0/8 gateway=$GATE1
" > /mnt/rw/autorun.scr

cat /mnt/rw/autorun.scr   # 验证内容
```

### 3. 写盘

跟单网卡一样：

```bash
umount /mnt
sync
dd if=chr.img bs=1024 of=/dev/vda && reboot
```

ROS 启动后会自动给 ether1 和 ether2 配上 IP，公网 + 私网双栈打通。

## 三、PVE 导入（推荐）

如果你已经在用 **Proxmox VE**（PVE）管理 VPS / 虚拟机集群，PVE 装 ROS 比裸 dd 简单得多——

### 1. 上传镜像到 PVE

通过 PVE Web UI 上传，或者 scp 到 PVE 节点：

```bash
scp chr-7.14.3.img root@pve:/var/lib/vz/template/iso/
```

### 2. 创建 VM（VM ID = 104 例）

```bash
qm create 104 --name ros-chr --memory 1024 --net0 virtio,bridge=vmbr0 \
  --cores 2 --sockets 1 --ostype l26 --scsihw virtio-scsi-pci --scsi0 local-lvm:32
```

### 3. 导入磁盘到 VM

```bash
qm importdisk 104 /var/lib/vz/template/iso/chr-7.14.3.img local-lvm
```

⚠️ **注意**：原命令少了 `--importdisk` 参数后的 VM ID——上面命令已修正。原命令 `qm importdisk /var/lib/vz/template/iso/chr-7.14.3.img local-lvm` 会报参数错误。

### 4. 配置启动盘

```bash
qm set 104 --boot0 scsi0 --boot order=scsi0
qm start 104
```

VM 启动后会进入 ROS 登录界面。PVE 控制台直接 VNC 操作。

PVE 优势：
- 不用 dd 整盘，保留 PVE 自己的管理能力
- VM 可以快照（CHR 改配置前打个快照，改坏了能回滚）
- 网络配置更灵活（多个 bridge / VLAN 自由组合）

## 四、ROS 授权

ROS 是商业软件，**没有授权也能用**，但**默认 1 Mbps 上行限制**。

### 免费试用授权

CHR 提供**免费试用 license**，步骤：

1. 去 https://mikrotik.com/client 注册账号（要能收邮件）
2. 邮箱验证账号
3. 在 ROS 内 `System → License` 填入账号登录
4. 获得 60 天免费试用 license

### 试用 license 续期经验

**实测**：只要系统**不升级**（不改 RouterOS 版本），试用 license 可以一直用下去。但 RouterOS 7.x 后续小版本（如 7.14 → 7.15）会清掉试用 license，需要重新申请。

⚠️ 提醒：试用 license 期间功能完整，但 MikroTik 协议上是给你"60 天评估"。生产环境建议买正式 license（P1 起，约 $45 永久）。

## 五、CHR 性能 / 适用场景

CHR 适合：

- ✅ 单 VPS 跑 ROS（VPN / 远程组网）
- ✅ 测试 ROS 配置 / 学习
- ✅ 中小规模异地组网（< 100 节点）

CHR **不适合**：

- ❌ 大流量出口（1 Mbps 限制 + 性能损耗）
- ❌ 多 VPS 集群（每台都要单独刷系统）
- ❌ 容器化部署（CHR 是单 VM）

大流量场景用实体 RouterOS（hAP / RB / CCR 系列）或 PVE 装完整 ROS 镜像（不受 1 Mbps 限制）。

## 六、完结

VPS 装 ROS 的两种主流方案：
1. **裸 dd**（直接刷系统）—— 适合单 VPS 简单场景
2. **PVE 导入** —— 适合集群 / 多 VPS / 需快照场景

CHR 适合**测试和小规模生产**，大规模部署建议直接上 RouterOS 实体硬件。
