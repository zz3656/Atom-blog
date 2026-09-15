---
title: VPS 安装爱快
description: "**📢 本文已迁移到《[爱快(iKuai)软路由安装全指南：从实体机到虚拟机再到云主机](https://www.inte8.top/2026/04/30/ai-kuai-ikuai-ruan-lu-you-an-zhuang-quan-zhi-nan-cong-shi-ti-ji-dao-xu-ni-ji-z..."
pubDate: 2025-07-12
tags: [vps, ikuai, 爱快]
---

> **📢 本文已迁移到《[爱快(iKuai)软路由安装全指南：从实体机到虚拟机再到云主机](https://www.inte8.top/2026/04/30/ai-kuai-ikuai-ruan-lu-you-an-zhuang-quan-zhi-nan-cong-shi-ti-ji-dao-xu-ni-ji-zai-dao-yun-zhu-ji/)》**(2026-04-30 发布，完整版)。原文保留如下供参考。

---

### VPS安装爱快

###### 步骤1:下载爱快ISO并重命名为ikuai8.iso

```
wget https://www.ikuai8.com/download.php?n=/3.x/iso/iKuai8_x32_3.7.11_Build202403051040.iso -O ikuai8.iso
```

###### 步骤2: 挂载ISO镜像

```
sudo mount ikuai8.iso /mnt
```

###### 步骤3: 复制ISO镜像启动文件

```
sudo cp -rpf /mnt/boot /
```

###### 步骤4: 重启

```
reboot
```

###### 步骤5: 在腾讯云/阿里云的操作页面打开VNC界面: 登录/远程登录 --> VNC登录，正常ISO安装爱快系统

###### 步骤6: 进入控制台"开启外网访问WEB"

o、其他选项 --> 2、开启外网访问web
