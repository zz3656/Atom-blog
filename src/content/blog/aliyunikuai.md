---
title: 阿里云/腾讯云 安装爱快系统步骤
description: "**📢 本文已迁移到《[阿里云腾讯云安装爱快系统步骤](https://www.inte8.top/2025/07/11/a-li-yun-teng-xun-yun-an-zhuang-ai-kuai-xi-tong-bu-zou/)》**(2025-07-11 发布，完整版)。原文保留如下供参考。"
pubDate: 2025-07-12
category: 工作笔记
tags: [阿里云, 爱快, 软路由]
---

> **📢 本文已迁移到《[阿里云腾讯云安装爱快系统步骤](https://www.inte8.top/2025/07/11/a-li-yun-teng-xun-yun-an-zhuang-ai-kuai-xi-tong-bu-zou/)》**(2025-07-11 发布，完整版)。原文保留如下供参考。

---

# 阿里云/腾讯云 安装爱快系统步骤


开始: 随便安装一个ubuntu系统

## 步骤1: 下载ISO安装包
x32位

```shell
wget https://www.ikuai8.com/download.php?n=/3.x/iso/iKuai8_x32_3.7.14_Build202408011011.iso -O ikuai8.iso
```

x64位

```shell
wget https://www.ikuai8.com/download.php?n=/3.x/iso/iKuai8_x64_3.7.14_Build202408011011.iso -O ikuai8.iso
```

## 步骤2: 挂载ISO镜像

```shell
 sudo mount ikuai8.iso /mnt
```

## 步骤3: 复制ISO镜像启动文件

```shell
sudo cp -rpf /mnt/boot /
```

## 步骤4:

```shell
reboot
```

##步骤5: 在腾讯云/阿里云的操作页面打开VNC界面: 登录/远程登录 --> VNC登录，正常ISO安装爱快系统
##步骤6: 进入控制台\"开启外网访问WEB\"
 o、其他选项 --> 2、开启外网访问web


#结束
