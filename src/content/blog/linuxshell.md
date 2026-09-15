---
title: 科技Lion一键脚本：Linux服务器运维工具箱 监控管理建站一个脚本全搞定
description: 本文源自科技lion博客，仅记录个人使用。感谢大佬分享！
pubDate: 2025-07-12
category: 操作系统
tags: [linux, shell, 教程]
---

# 科技lion一键 脚本  Linux服务器运维工具箱 监控管理建站一个脚本全搞定！

本文源自科技lion博客，仅记录个人使用。感谢大佬分享！

原文链接：https://blog.kejilion.pro/kejilion-sh/

![img](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/20241005171947.png)



科技Lion的Shell脚本工具是一款全能脚本工具箱，使用shell脚本编写。专为Linux服务器监控、测试和管理而设计。无论您是初学者还是经验丰富的用户，该工具都能为您提供便捷的解决方案。集成了独创的Docker管理功能，让您轻松管理容器化应用；LNMP建站解决方案能帮助您快速搭建网站，站点优化，防御，备份还原迁移一应俱全；并且整合了各类系统工具面板的安装及使用，使系统维护变得更加简单。我们的目标是成为全网最优秀的VPS一键脚本工具，为用户提供高效、便捷的科技支持。



## 使用方法

### 安装基础组件

**Debian/Ubuntu**

```
apt update -y && apt install -y curl
```

**CentOS/RedHat/Fedora/AlmaLinux/Rocky Linux**

```
yum update && yum install -y curl
```

**Alpine Linux**

```
apk update && apk add curl
```



### 运行脚本

```
bash <(curl -sL kejilion.sh)
```





## **脚本主界面**

脚本全面支持Ubuntu、Debian，Cent OS和Alpine Linux系统

只要执行命令自动获取最新版本

![img](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/20241005183921.png)

## 主要功能

#### **docker管理器**

轻松安装管理你的docker容器，无需安装任何可视化面板。操作优雅直觉！

#### **LDNMP建站**

LDNMP建站系统，超凡的快速建站方案，多站共存都是一键搞定。站点管理防护优化一应俱全。

#### **面板工具集合**

集合了时下流行的VPS面板应用程序，一键快速搭建。安装完成即可使用。安装后动态管理已安装的面板应用。

#### **系统工具集合**

集合了对Linux各项系统管理等基础操作，方便小伙伴优雅使用。调整VPS参数不需要记住繁琐命令，一键搞定。

#### **更多功能**

还有更多功能等待着大家自己发掘。欢迎提供宝贵意见，希望一键化脚本工具越来越强大。帮助小伙伴们使用VPS管理VPS。
