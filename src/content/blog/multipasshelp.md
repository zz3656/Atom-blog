---
title: Multipass 使用笔记
description: "[!IMPORTANT] 本文出自悟空的日常抄录，未做任何修改仅用来存根记录。 原文链接：https://wkdaily.cpolar.cn/archives/multipass ```bash"
pubDate: 2025-07-12
category: 操作系统
tags: [linux, multipass, ubuntu]
---

> [!IMPORTANT]
>
> 本文出自悟空的日常抄录，未做任何修改仅用来存根记录。
>
> 原文链接：https://wkdaily.cpolar.cn/archives/multipass



# 简单使用

## 查看支持的系统镜像列表

```bash
multipass find
```

## ❤️ 新建和运行 ubuntu

> [!NOTE]
>
> multipass launch --name <虚拟机实例名称> <系统镜像名称(可选)>
>
> 举例，比如创建一个名为 vm1 的虚拟机实例，不写系统镜像这个参数，则表示最新版ubuntu 24.04

```bash
multipass launch --name vm1
```

## 以后如何调用虚拟机？

- 方法一 任务栏图标点击右键——Open Shell

![img](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/右键调用.jpg)

- 方法二 运行指定虚拟机实例名称即可

```bash
multipass shell vm1
```

## 如何换 国内 软件源 比如阿里云 Ubuntu 24.04 为例

```bash
sudo sed -i 's|http://archive.ubuntu.com/|http://mirrors.aliyun.com/|g' /etc/apt/sources.list.d/ubuntu.sources
```

或者手动修改 配置文件

```bash
nano /etc/apt/sources.list.d/ubuntu.sources
```

![img](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/sf.jpg)

## 然后更新软件源

```bash
sudo -i
apt update -y
apt upgrade -y
```

## 如何删除虚拟机实例（分三步）

```bash
# 停止 vm1

multipass stop vm1

# 删除 vm1

multipass delete vm1

# 清理回收

multipass purge

# 附加

# 停止全部虚拟机

multipass stop --all
```

## 查看虚拟机列表

```bash
# 查看虚拟机列表 包括其状态（正在运行、已经删除的、已经停止的、标记未知状态的）

multipass list
```

# 进阶使用

## 新建 4核心 4GB内存 300G虚拟磁盘的ubuntu 实例

```bash
multipass launch --name vm3 -c 4 -m 4G -d 300G
```

> [!NOTE]
>
> vm3 虚拟机名称
>
> -c 4 代表虚拟4核心 这个要根据实际CPU核心数确定 不能随便写 比如本身2核心的cpu是无法虚拟4核心的
>
> -m 4G 代表虚拟4GB内存
>
> -d 300G 代表分配虚拟磁盘300GB

## 设置桥接模式的网络

```bash
multipass set local.bridged-network=<name>

# 比如重命名以太网2为lan2

multipass set local.bridged-network=lan2
```

<name> 就是网口的名称 比如 以太网，但是最好重命名为英文，比如lan1、lan2

## 创建桥接模式的虚拟机vm4

```bash
multipass launch --name vm4 -c 4 -m 4G -d 300G --network bridged
```

### TVBox APK 下载地址 https://wkdaily.cpolar.cn/archives/free

### 视频里的脚本地址：https://github.com/wukongdaily/OrangePiShell

### ❤️ 扩展知识

可能有小伙伴会问 笔记本电脑没有 有线网卡。只有Wifi 应该如何桥接呢？有时候，windows 下的multipass 可能打印不出wifi网卡。比如 输入 multipass networks

遇到识别不出wifi 网卡的情况，其实还可以利用Hyper-V 管理器新建一个虚拟交换机。

> [!NOTE]
>
> 打开hyper-v管理器。点击【虚拟交换管理器】-【新建虚拟网络交换机】-【外部】-【创建】 然后你勾选一下你的 wifi 无线网卡，然后 名称的话 改成英文吧，比如 wifi 。这样应用之后，你再去打印multipass networks 就能识别wifi啦

## 如何使用RunMyNAS 编译iStoreNAS固件

```
# 同步项目到本地

git clone https://github.com/linkease/iStoreNAS.git

# 切换到该目录

cd iStoreNAS

# 执行项目 比如(参数  x86_64 or rk35xx or rk33xx)

./runmynas.sh x86_64
```

## 更多进阶Multipass用法可参考Geekhour的博客 4.1章节

https://geekhour.net/
