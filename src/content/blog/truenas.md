---
title: TrueNAS Scale 虚拟机安装 iStoreOS
description: TrueNAS Scale（Cobia / Dragonfish / Fangtooth 等版本）是基于 Linux 的 NAS 系统，内置 KVM / Incus 虚拟化。在不额外装 PVE /  的情况下，可以直接在 TrueNAS 里跑软路由系统做主路由 / 旁路由。
pubDate: 2025-07-12
category: 操作系统
tags: [truenas, linux, nas]
---

## 前言

TrueNAS Scale（Cobia / Dragonfish / Fangtooth 等版本）是基于 Linux 的 NAS 系统，内置 KVM / Incus 虚拟化。在不额外装 PVE /  的情况下，可以直接在 TrueNAS 里跑软路由系统做主路由 / 旁路由。

iStoreOS 是基于 OpenWrt 的国产路由系统，自带 iKuai 风格的 Web UI，对家用 / 小型办公场景非常实用。

本文记录在 TrueNAS Scale 上用 zvol + dd 把 iStoreOS 装到 KVM 虚拟机里的过程。

## 一、准备 iStoreOS 镜像

1. 到 [iStoreOS 官网](https://www.istoreos.com/) 下载 img.gz 格式的镜像
2. **推荐选 x86 efi 版本**（TrueNAS 主机一般是 x86_64）
3. 解压：

```bash
gunzip istoreos-x86_64-squashfs.img.gz
```

得到 `istoreos-x86_64-squashfs.img` 文件，上传到 TrueNAS 的某个数据集（比如 `/mnt/pool4/personal`）。

## 二、创建 Zvol

TrueNAS 的虚拟机磁盘用 **Zvol**（ZFS 卷）——ZFS 精简置备，比 qcow2 / raw 文件性能更好。

**Web UI 路径**：`Datasets → 选中一个池 → Add Zvol`

- **Name**: `istoreos`（自取，后续命令会用到）
- **Size**: `5 GiB`（iStoreOS 本身 < 1 GiB，5 GiB 留足余量；zvol 是精简分配，实际占用看写入）
- **Sparse**: ✅ 勾选（推荐，省空间）
- **Block size**: 默认 `16K`（多数场景够用）

创建完成后，zvol 路径类似 `/dev/zvol/pool4/istoreos`。

## 三、把 img 写入 zvol

⚠️ **重要**：这一步会把 zvol 整个覆盖。**确认你选对了 zvol 路径，不要写错。**

进入 TrueNAS Shell（Web UI → System Settings → Shell），执行：

```bash
# 1. 确认 zvol 存在
ls /dev/zvol/pool4
# 应该看到 istoreos 文件

# 2. dd 写入（替换路径为你自己的）
dd if=/mnt/pool4/personal/istoreos-x86_64-squashfs.img \
   of=/dev/zvol/pool4/istoreos bs=1M status=progress
```

`status=progress` 是 GNU coreutils 8.24+ 才有的参数，TrueNAS Scale 默认带。如果是老 TrueNAS，去掉这个参数即可。

写入完成后 `sync` 一下让缓存刷盘：

```bash
sync
```

## 四、创建虚拟机

**Web UI 路径**：`Virtualization → Add`

| 配置项 | 推荐值 |
|--------|--------|
| Name | `iStoreOS` |
| Description | 软路由（自填） |
| **Operating System** | Linux |
| **System Clock**: 选 `Local` 或 `UTC` 都行，iStoreOS 默认 UTC |
| **Boot Loader**: **UEFI**（**必须**，iStoreOS x86 efi 版只支持 UEFI 启动；不要选 SeaBIOS） |
| **CPU**: 1-2 核（家用 1 核够用，跑复杂插件可上 2 核） |
| **Memory Size**: 512 MB - 1 GB（iStoreOS 本身吃 256 MB，但插件多了建议 1 GB） |
| **Virtual Disks** | **删除**（dd 已写入 zvol，不需要新建虚拟磁盘） |

然后在 **Devices** Tab 里加磁盘：

- **Type**: Disk
- **Disk Type**: Raw File
- **Source**: 选刚才的 zvol `/dev/zvol/pool4/istoreos`
- **Boot Order**: ✅ 勾选
- **Mode**: AHCI（默认）

最后**Network**：

- **Type**: VirtIO（性能最好）或 E1000（兼容性好）
- **Adapter Type**: `Bridge` → 选你的物理网卡做 bridge

> **关于网络桥接**：如果你想让 iStoreOS 做**主路由**（接管 LAN），需要把 NAS 的物理网卡桥接到 iStoreOS；如果只是**旁路由**，选一个独立 VLAN 或独立网卡即可。

## 五、启动并配置

启动虚拟机后，从 VNC 控制台应该能看到 iStoreOS 启动日志。等 30 秒进入登录提示：

```
iStoreOS login:
```

默认账号：`root` / 密码：`password`。

进入后建议立即做 3 件事：

```bash
# 1. 修改默认密码
passwd

# 2. 查看 LAN IP（默认 192.168.100.1，但可能 DHCP 自动分配了别的）
ip addr show

# 3. 浏览器访问上一步看到的 IP，进入 iStoreOS Web 控制台
```

## 六、常见问题

### Q: 启动后 VNC 黑屏 / 一直重启？

99% 是 **Boot Loader 选错了**——必须选 **UEFI**，不能选 SeaBIOS。iStoreOS x86 efi 版默认 GPT 分区 + EFI 启动。

### Q: dd 写入后 zvol 提示 "permission denied"？

TrueNAS Shell 默认是 root 权限，应该不会。如果真碰到，检查：
- Shell 是否在正确权限下运行（System Settings → Shell 默认就是 root）
- 路径是否正确（zvol 路径是 `/dev/zvol/<poolname>/<zvolname>`）

### Q: 网络选 VirtIO 后 iStoreOS 识别不到网卡？

iStoreOS 默认驱动应该都支持。如果不行，换 E1000（兼容性最好）。

### Q: 想给虚拟机加第二块网卡（WAN + LAN）？

回到 VM → Devices → Add → Type: NIC → 选 WAN 物理网卡。

## 七、性能对比（参考）

TrueNAS Scale + iStoreOS + VirtIO 性能参考（同硬件）：

| 网卡模式 | 吞吐 | CPU 占用 |
|---------|------|----------|
| VirtIO | ~9.4 Gbps | < 5% |
| E1000 | ~3.5 Gbps | 10-15% |

**家用千兆宽带**选 VirtIO 足够；2.5G / 10G 网卡需要确认主板 / CPU 都支持 VT-d / IOMMU。

## 八、清理 / 备份

dd 写入的 zvol 是块设备，没有快照能力（ZFS zvol 可以 snapshot，但 iStoreOS 启动后是动态文件系统）。

**备份建议**：在 iStoreOS 内部用 `sysupgrade` 备份配置（保留 `/etc/config/`），重装后恢复即可。

## 九、完结

至此 iStoreOS 已经在 NAS 上跑起来了。整个流程最关键是 **dd 写入 + UEFI 启动**两个步骤，剩下都是常规 VM 配置。
