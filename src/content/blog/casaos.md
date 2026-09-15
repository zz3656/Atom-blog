---
title: 从零开始安装 CasaOS 保姆级教程
description: "原文出自[**NAS/Docker折腾系列 篇二：从零开始安装CasaOS保姆级教程**](https://post.smzdm.com/p/a607edoe/pic_3/)，作者只是在原文基础上踩坑的地方补充添加了点自己的想法以完善此教程。本站为个人博客站点，此文仅做为安装记录备用。如果侵权请联系本站下架！"
pubDate: 2025-07-12
category: 操作系统
tags: [nas, casaos, 教程]
---

# 从零开始安装CasaOS保姆级教程

![Home | CasaOS Wiki](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/casaos_logo_hd.svg)

## **1.Debian基础安装**

原文出自[**NAS/Docker折腾系列 篇二：从零开始安装CasaOS保姆级教程**](https://post.smzdm.com/p/a607edoe/pic_3/)，作者只是在原文基础上踩坑的地方补充添加了点自己的想法以完善此教程。本站为个人博客站点，此文仅做为安装记录备用。如果侵权请联系本站下架！

​      本次折腾的小主机/虚拟机都是x86架构的，基于易用性、稳定性等考虑，我选择了*Debian 12 x64*作为宿主系统。为了避免因网络问题造成的安装缓慢和失败，建议下载[完整安装iso](https://cdimage.debian.org/debian-cd/current/amd64/iso-dvd/)。

使用[Ventoy工具](https://www.ventoy.net/cn/index.html)或你喜欢的其他方式引导到iso，我们就来到了安装界面**↓**：

![1.jpg](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/1.jpg)

接下来就是我绕的第一个远路：先安装英文系统，避免由于*安装不完全*导致的**中文乱码**现象。

![2.jpg](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/2.jpg)

选择English/English，回车后依次选择other-Asia-China，接着在Configure Locales界面连续回车，直到进入**↓**网络配置步骤，填写自己想要的主机名（即这台设备在网络上显示的名字)：

![3.jpg](https://www.inte8.top/upload/3.jpg)

接下来就是重点项目——**root根密码**的设定，重复输入两次即可完成。

注意！！在这里**强烈建议**设定一个复杂但记得住的root密码，在日常使用中则采用*普通用户+SU提权*的方式，实现安全隔离。

![4.jpg](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/4.jpg)

接下来就是设置*首个普通用户*的全称和用户名，在设定了root密码的情况下，系统会禁用root用户的创建和登录，这个普通用户就是你登录主机的方式。因为是演示，我设定了temp作为首个普通用户的名称**↓**

![](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/5.webp)

以及temp用户的密码**↓**

![](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/6.webp)

接着就是给系统[硬盘](https://www.smzdm.com/fenlei/yingpan/)分区，我的选择是将整块硬盘分给Debian使用**↓**

![7.webp](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/7.webp)![8.png](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/8.png)

同时将所有文件放在同一分区**↓**

![9.webp](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/9.webp)

安装程序自动分区后，勾选确认并继续**↓**

![10.webp](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/10.webp)

![11.jpg](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/11.jpg)

经过一段时间读条后，Debian的安装来到第二阶段**↓**

![12.jpg](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/12.jpg)

![13.webp](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/13.webp)

这两步都是apt包管理器的选项，分别询问是否使用额外的安装媒体或者网络源，为了避免网络环境带来的缓慢甚至失败，这里我第二次绕路：全部选否，等系统正式安装完毕后再进行更新

接下来就到了软件包组件选择，其中前面带有*...*标识的是不同的桌面环境，也就是图形界面，因为CasaOS本身就是图形管理页面，为了避免不必要的系统开销，我选择不安装桌面环境（就是Debian自己的图形管理界面）**↓**

![](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/14.webp)经过另一轮读条后，Debian 12安装完毕，按提示重启后进入命令行界面**↓**

![image-20240515023109431](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/image-20240515023109431.png)

![image-20240515023145724](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/image-20240515023145724.png)

## **2.Debian进阶设置**

原文出处从这里开始不太一样，我自己稍作修改并记录一下。等到debian12安装完毕后，先不要移除引导设备（默认的完整版dian12DVD软件源都是从引导设备安装）。首先先在本机上登录普通用户或者root用户，安装文本编辑工具。

```bash
su
#回车后输入你的root密码
sudo apt install nano curl sudo
sudo nano /etc/network/interfaces
#iface ens18 inet dhcp  
#注释掉iface开头这一行并记录网卡名字或者直接把dhcp改为static也行
iface ens18 inet static
address 172.16.254.250
netmask 255.255.0.0
gateway 172.16.254.254
#以上三项对应IP 子网掩码 网关
iface ens18 inet6 auto
#倘若需要开启Ipv6自行加入此行
```

修改完以后按ctrl+x保存 先按Y 再回车就可以了

更改软件源，不管你是国内还是境外理论上只要是完整包debian12安装的都需要更改软件源。因为原来的根本就更新不了软件。

```bash
sudo nano /etc/apt/sources.list
```

腾云源

```bash
deb https://mirrors.tencent.com/debian/ bookworm main non-free non-free-firmware contrib
deb-src https://mirrors.tencent.com/debian/ bookworm main non-free non-free-firmware contrib
deb https://mirrors.tencent.com/debian-security/ bookworm-security main
deb-src https://mirrors.tencent.com/debian-security/ bookworm-security main
deb https://mirrors.tencent.com/debian/ bookworm-updates main non-free non-free-firmware contrib
deb-src https://mirrors.tencent.com/debian/ bookworm-updates main non-free non-free-firmware contrib
deb https://mirrors.tencent.com/debian-backports/ bookworm-backports main non-free non-free-firmware contrib
deb-src https://mirrors.tencent.com/debian-backports/ bookworm-backports main non-free non-free-firmware contrib
```

debian官方源（软件较新，但是国内环境更新贼慢）

```bash
deb http://deb.debian.org/debian bookworm main non-free non-free-firmware contrib
deb http://deb.debian.org/debian bookworm-updates main non-free non-free-firmware contrib
deb http://deb.debian.org/debian bookworm-proposed-updates main non-free non-free-firmware contrib
deb http://deb.debian.org/debian bookworm-backports main non-free non-free-firmware contrib
deb http://deb.debian.org/debian bookworm-backports-sloppy main non-free non-free-firmware contrib
deb-src http://deb.debian.org/debian bookworm main non-free non-free-firmware contrib
deb-src http://deb.debian.org/debian bookworm-updates main non-free non-free-firmware contrib
deb-src http://deb.debian.org/debian bookworm-proposed-updates main non-free non-free-firmware contrib
deb-src http://deb.debian.org/debian bookworm-backports main non-free non-free-firmware contrib
deb-src http://deb.debian.org/debian bookworm-backports-sloppy main non-free non-free-firmware contrib
```

根据自己情况修改适当的自己的软件源，完事ctrl+x保存。之后依次执行如下代码。

```bash
sudo apt update
sudo apt -y upgrade
sudo reboot
```

重启之后先在本机登录查看一下IP地址是否更改成功，查看命令。

```bash
ip add show
```

成功以后就可以用你自己喜欢的shell工具登录了，因为我们没有修改opensshserver.所以只能用普通用户登录。

```bash
su
#先给普通用户提权，回车以后提示输入密码。这个密码为root用户密码
sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target
#禁用debian系统休眠
systemctl status sleep.target
#查看是否关闭成功
```

关闭成功后会有如下提示

![image-20240515023243065](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/image-20240515023243065.png)

接着我们来将Debian的系统语言改为中文，执行

```bash
sudo dpkg-reconfigure locales
```

来打开本地化配置功能，原文建议“找到*en_US.UTF-8 UTF-8*后用空格键取消星号勾选，再拉到列表末端选中*zh_CN.UTF-8 UTF-8*，”实际操作不取消*en_US.UTF-8 UTF-8*勾选也不影响下面步骤，回车后选中**zh_CN.UTF-8**，回车并等待执行**↓**

![3-jqfz.jpg](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/image-20240515023305231.png)

![image-20240515023342336](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/image-20240515023342336.png)

中文配置完毕后，执行

```bash
sudo reboot
```

## **3.CasaOS的一键化安装**

得益于[作者](https://github.com/IceWhaleTech/CasaOS)的辛勤劳作，CasaOS的安装可谓是一键式傻瓜化脚本，根据[官网](https://casaos.io/)的提示，我们只需要*su提权*后，执行一行命令就可以开始了。

```bash
curl -fsSL https://get.casaos.io | sudo bash
```

![image-20240515023431741](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/image-20240515023431741.png)

![image-20240515023454172](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/image-20240515023454172.png)

![image-20240515023514702](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/image-20240515023514702.png)

在casaOS安装完毕后，我们还有一个可选项：开启docker的IPv6功能，可以参考什么值得买站内大佬文章链接：https://post.smzdm.com/p/am82870d/

在Debian系统本身获得了v6地址的前提下，我们执行

```bash
nano /etc/docker/daemon.json
```

后，贴入命令并保存

```bash
{ "ipv6": true, "fixed-cidr-v6": "fe80::/64", "experimental": true, "ip6tables": true }
```

最后执行一遍

```bash
sudo service docker restart
```

重启docker网络，让刚刚修改的配置生效。

![image-20240515023549105](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/image-20240515023549105.png)

最后的最后，关掉PowerShell窗口，在浏览器输入小主机的IP地址，欢迎来到CasaOS带来的Docker![image-20240515023602699](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/image-20240515023602699.png)
