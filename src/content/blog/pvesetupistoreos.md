---
title: PVE 安装 iStoreOS 手把手图文教程
description: 想必大家对梅林路由器系统很熟悉，我的主路由也是Netgear网件刷的梅林并安装几个好用的插件，一直稳定服役多年，iStoreOS系统同样也是梅林的开发团队制作，iStoreOS是基于Openwrt深度定制编译，加入了亲切的向导跟插件商店等功能，很适合我这种小白的一款多功能软路由系统。安装了PVE系统后，选择了安装...
pubDate: 2025-07-12
tags: [pve, istoreos, all in one]
---

# PVE安装iStoreOS手把手图文教程

![image-20240515015524901](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/image-20240515015524901.png)

## iStoreOS介绍 

想必大家对梅林路由器系统很熟悉，我的主路由也是Netgear网件刷的梅林并安装几个好用的插件，一直稳定服役多年，iStoreOS系统同样也是梅林的开发团队制作，iStoreOS是基于Openwrt深度定制编译，加入了亲切的向导跟插件商店等功能，很适合我这种小白的一款多功能软路由系统。安装了PVE系统后，选择了安装iStoreOS为旁路由，今天把安装过程分享给大家。

## 安装准备

iStoreOS固件需要自行下载：

关键字”KoolCenter 固件下载服务器”

进入下载页面

![img](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/63996307347c76656.png_orig.jpg)

intel AMD系统选择x86_64

![选择最近固件下载](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/639963280470b929.png_e1080.jpg)

选择最新固件下载

把下载好的istoreos-21.02.3-2022120718-x86-64-squashfs-combined.img.gz拖到pve root里并解压缩，我这里用的FinalShell操作

`gunzip istoreos-21.02.3-2022120718-x86-64-squashfs-combined.img.gz `

![解压缩后2.4GB](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/63996782239314914.png_e1080.jpg)

## 创建虚拟机

整个简要流程是按linux来设定一台虚拟机，最后再把下载的img挂载成[硬盘](https://www.smzdm.com/fenlei/yingpan/)。

![此处VM ID要记住待会要用](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/639969782258c5191.png_e1080.jpg)

此处VM ID要记住待会要用

![这里先随便选一个ISO待会要删除，linux 5.x核心](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/63995c77d355f2603.png_e1080.jpg)

这里先随便选一个ISO待会要删除，linux 5.x核心

![SCISI跟Single我也不清楚差别，随便选](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/639969cd712081059.png_e1080.jpg)

SCISI跟Single我也不清楚差别，随便选

![左边Disk删除](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/63996a0ed92922076.png_e1080.jpg)

左边Disk删除

![image-20240515020055170](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/image-20240515020055170.png)

CPU3～4都可以，选host，units给高优先1024

![内存看着适当给512～1024](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/63996a700d663823.png_e1080.jpg)

内存看着适当给512～1024

![VirtiO，如果有多网卡可以后面再加入PCI直通](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/63995c77d79074958.png_e1080.jpg)

VirtiO，如果有多网卡可以后面再加入PCI直通

![设定完别启动，到硬件里把iso移除“Detach”](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/63997cfde8b482348.png_e1080.jpg)

**进入PVE的shell里敲入如下把img转成挂载硬盘**

qm importdisk <你的VM ID> <img位置档名> <挂到local pve或是local-lvm> 

我的PVE已经删除了LVM所以是local，我建议挂载到 local, lvm维护起来坑比较多

**注意111改成自己的虚拟机ID号![PVE安装iStore手把手图文教程](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/74.png)** 

`qm importdisk **111** /root/istoreos-21.02.3-2022120718-x86-64-squashfs-combined.img local (或者local-lvm）`

操作正常会有如下讯息

```bash
importing disk '/root/istoreos-21.02.3-2022120718-x86-64-squashfs-combined.img' to VM 111 ...

transferred 471.6 MiB of 471.6 MiB (100.00%)

Successfully imported disk as 'unused0:local:111/vm-111-disk-0.raw'
```

会发现/var/lib/vz/images/111 下多了raw，PVE的local虚拟机都是放在这目录里，以后需要也可以手动备份

![硬件设定如上](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/63996db6a17e975.png_e1080.jpg)

硬件设定如上

![操作正常后到“启动BOOT”选项里设定优先启动](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/63996b30b07767617.png_e1080.jpg)

操作正常后到“启动BOOT”选项里设定优先启动

## 开机

在VM console里，看到开机正常启动成功

![iStoreOS顺利启动完成，按回车键](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/63996e250de218774.png_e1080.jpg)

iStoreOS顺利启动完成，按回车键

## 修改IP

启动完后默认这台软路由IP是192.168段的，我的内网是10.0.0.的需要改一下

`输入 quickstart`

![进入设定初始化](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/63996fb0899fb8290.png_e1080.jpg)

选择1修改需要的IP，记得在主路由DHCP分配固定IP给iStoreOS虚拟机

![设定成合适自己内网的IP](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/63997096719b28648.png_e1080.jpg)

设定成合适自己内网的IP

如果安装的是旧版iStore，输入quickstart修改IP选单会如下。 

要求输入root密码的话，预设是password

![这是旧版安装完画面](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/63996efe371c02877.png_e1080.jpg)

## 改好IP后，就可以进入网页界面

浏览器输入刚设定的IP

![预设密码password，记得后面修改下](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/6399721280dec9099.png_e1080.jpg)

预设密码password，记得后面修改下

![登入后主界面面板](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/63995c787abb59571.png_e1080.jpg)

登入后主界面面板

进入后首页是显示网络流量等基本讯息的仪表盘，左边是主功能菜单，基本跟Openwrt的差不多。

但可以在主菜单里发现有个**网络向导**，点进入有三种向导，对新手很方便地可以实现想要的功能，

![比起传统Openwrt多了向导](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/63995c78551da4615.png_e1080.jpg)

比起传统Openwrt多了向导

我选的是旁路由，基本输入几个值后一步到位

![输入旁路由IP等](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/63995c78ed7527767.png_e1080.jpg)

输入旁路由IP等

![PVE安装iStore手把手图文教程](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/63995c78f192732.png_e1080.jpg)

## iStore插件商店

同样跟向导一样适合新手的特色功能就是iStore了，里面提供了很多使用的插件，不需要自行去外部下载再安装，只需要点击就可以下载安装完成。

![PVE安装iStore手把手图文教程](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/639977ad81b47399.png_e1080.jpg)

![PVE安装iStore手把手图文教程](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/639977cae343e6389.png_e1080.jpg)

![PVE安装iStore手把手图文教程](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/639977d8c5b482429.png_e1080.jpg)

![PVE安装iStore手把手图文教程](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/639977e43facf1936.png_e1080.jpg)

![PVE安装iStore手把手图文教程](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/639977f4631455628.png_e1080.jpg)

## 手动安装插件部分

有些额外不可描述插件商店里就没有提供需要另外下载。需要的值友可以搜查关键字are u ok

我这里下载了adguardhome去广告插件

![PVE安装iStore手把手图文教程](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/639978562b3275129.png_e1080.jpg)

![安装完成后右上显示为绿色表示成功安装完成](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/6399785fd309d1777.png_e1080.jpg)

安装完成后右上显示为绿色表示成功安装完成

大致简单介绍了一下特色功能的部分，其他功能跟openwrt都差不多，值友们可以自行安装后研究，

最后别忘了更改root密码

![PVE安装iStore手把手图文教程](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/6399796ec9f0f4870.png_e1080.jpg)

## 总结

iStoreOS除了提供Openwrt的功能外，还内置了方便新手的向导跟插件功能，也是梅林固件受欢迎的功能之一，相信开发团队会继续推出更完善优化的版本造福我这样的小白玩家。

后面我会再实操去广告插件功能及效果，喜欢的值友可以关注下，谢谢
