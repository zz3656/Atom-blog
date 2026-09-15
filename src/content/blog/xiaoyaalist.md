---
title: 小雅 alist 整合脚本
description: 感谢DDSRem技术大佬贡献的整合脚本
pubDate: 2025-07-12
category: 工作笔记
tags: [小雅alist, alist, 家庭影院]
---

# 小雅alist整合脚本

感谢DDSRem技术大佬贡献的整合脚本

原文出处：https://blog.ddsrem.com/archives/alist-xiaoya

![image-20240531074844687](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/2024/05/31/48a4ab8aa94579c4e78f55c6cfd45b75-image-20240531074844687-36d4c3.png)

![img](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/2024/05/31/fb7818f800c6ddf5c430f91244a7a471-image-5c46fa.png)

![img](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/2024/05/31/e550189f0b42c58a97d883f3e0bc6f70-image-1-f7dae5.png)

![img](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/2024/05/31/8981d50b084e66ce5de8845bc38c36dc-image-2-ca9212.png)

## main.sh



> [!NOTE]
> 整合安装脚本，内置所有相关软件的安装。

### 使用

shell

```shell
01bash -c "$(curl --insecure -fsSL https://ddsrem.com/xiaoya_install.sh)"
```

**备用地址**

shell

```shell
01bash <(curl --insecure -fsSL https://ddsrem.com/xiaoya/all_in_one.sh)
```

shell

```shell
01bash <(curl --insecure -fsSL https://fastly.jsdelivr.net/gh/DDS-Derek/xiaoya-alist@latest/all_in_one.sh)
```

shell

```shell
01bash <(curl --insecure -fsSL https://raw.githubusercontent.com/DDS-Derek/xiaoya-alist/master/all_in_one.sh)
```

shell

```shell
01bash -c "$(curl --insecure -fsSL https://fastly.jsdelivr.net/gh/DDS-Derek/xiaoya-alist@latest/main.sh)"
```

shell

```shell
01bash -c "$(curl --insecure -fsSL https://raw.githubusercontent.com/DDS-Derek/xiaoya-alist/master/main.sh)"
```

### 功能列表

> [!NOTE]
> 数字代表先选x，再选x，再选x
>
> PS: 2 2 8代表先选2，再选2，最后选8

**普通功能**

shell

```shell
01020304050607080910111213141516171819202122232425262728293031323334353637383940414243444546474849505152535455565758———————————————————————————————————————安装———————————————————————————————————————
安装 小雅Alist -> 1 1
安装 小雅Alist-TVBox -> 5 1
安装/更新 小雅助手（xiaoyahelper）-> 4 1
安装 Onelist -> 6 1
安装 Portainer -> 7 1 1
安装 Emby全家桶（一键） -> 2 1
安装 Jellyfin全家桶（一键） -> 3 1
安装 Resilio-Sync（单独） -> 2 5 1
安装 Auto_Symlink -> 7 2 1
——————————————————————————————Emby手动全家桶配置————————————————————————————————————
单独 下载并解压 全部元数据 -> 2 2 1
单独 解压 全部元数据 -> 2 2 2
单独 下载 all.mp4 -> 2 2 3
单独 解压 all.mp4 -> 2 2 4
解压 all.mp4 的指定元数据目录【非全部解压】-> 2 2 5
单独 下载 config.mp4 -> 2 2 6
单独 解压 config.mp4 -> 2 2 7
单独 下载 pikpak.mp4 -> 2 2 8
单独 解压 pikpak.mp4 -> 2 2 9
选择 下载器【aria2/wget】-> 2 2 10
单独 安装Emby（可选择版本，支持官方，amilys，lovechen）-> 2 3
立即 同步小雅Emby的config目录 -> 2 6
单独 创建/删除 同步定时更新任务 -> 2 7
图形化编辑 emby_config.txt -> 2 8
————————————————————————————Jellyfin手动全家桶配置——————————————————————————————————
单独 下载并解压 全部元数据 -> 3 2 1
单独 解压 全部元数据 -> 3 2 2
单独 下载 all_jf.mp4 -> 3 2 3
单独 解压 all_jf.mp4 -> 3 2 4
解压 all_jf.mp4 的指定元数据目录【非全部解压】-> 3 2 5
单独 下载 config_jf.mp4 -> 3 2 6
单独 解压 config_jf.mp4 -> 3 2 7
单独 下载 PikPak_jf.mp4 -> 3 2 8
单独 解压 PikPak_jf.mp4 -> 3 2 9
选择 下载器【aria2/wget】-> 3 2 10
单独 安装Jellyfin-> 3 3
———————————————————————————————————————更新———————————————————————————————————————
更新 小雅Alist-TVBox -> 5 2
更新 小雅Alist -> 1 2
更新 Resilio-Sync（单独） -> 2 5 2
更新 Onelist -> 6 2
更新 Portainer -> 7 1 2
更新 Auto_Symlink -> 7 2 2
———————————————————————————————————————卸载———————————————————————————————————————
卸载 小雅Alist -> 1 3
卸载 Emby全家桶 -> 2 9
卸载 卸载Jellyfin全家桶 -> 3 4
卸载 Resilio-Sync（单独） -> 2 5 3
卸载 小雅助手（xiaoyahelper）-> 4 3
卸载 小雅Alist-TVBox -> 5 3
卸载 Onelist -> 6 3
卸载 Portainer -> 7 1 3
卸载 Auto_Symlink -> 7 2 3
——————————————————————————————————————系统工具——————————————————————————————————————
查看系统磁盘挂载 -> 7 3
———————————————————————————————————————其他———————————————————————————————————————
一次性运行 小雅助手（xiaoyahelper）-> 4 2
```

**高级功能**

shell

```shell
0102030405Docker启动容器名称设置 -> 8 1
是否开启容器运行额外参数添加 -> 8 2
重置脚本配置 -> 8 3
开启/关闭 磁盘容量检测 -> 8 4
开启/关闭 小雅连通性检测 -> 8 5
```

## 相关地址



https://github.com/DDS-Derek/xiaoya-alist

小雅官方 [Telegram](https://t.me/xiaoyaliu00) 交流群

## 通用兼容性测试报告



| 系统名称        | main.sh | emby_config_editor.sh |
| --------------- | ------- | --------------------- |
| CentOS 7.9      | ✅       | ✅                     |
| CentOS 8.4      | ✅       | ✅                     |
| CentOS 8 Stream | ✅       | ✅                     |
| CentOS 9 Stream | ✅       | ✅                     |
| Debian 10.3     | ✅       | ✅                     |
| Debian 11.3     | ✅       | ✅                     |
| Debian 12.0     | ✅       | ✅                     |
| Ubuntu 18.04    | ✅       | ✅                     |
| Ubuntu 20.04    | ✅       | ✅                     |
| Ubuntu 22.04    | ✅       | ✅                     |
| Fedora 31       | ✅       | ✅                     |
| Fedora 32       | ✅       | ✅                     |
| AlmaLinux 9     | ✅       | ✅                     |
| RockyLinux 8.6  | ✅       | ✅                     |
| Arch Linux      | ✅       | ✅                     |
| openSUSE 15.4   | ✅       | ✅                     |
| FreeBSD         | ✅       | ✅                     |
| EulerOS         | ✅       | ✅                     |
| Amazon Linux    | ✅       | ✅                     |
| Alpine          | ✅       | ✅                     |
| UnRaid          | ✅       | ✅                     |
| OpenMediaVault  | ✅       | ✅                     |
| QNAP            | ✅       | ✅                     |
| OpenWRT         | ✅       | ✅                     |
| Synology        | ✅       | ✅                     |
| TrueNAS CORE    | ✅       | ✅                     |
| TrueNAS SCALE   | ✅       | ✅                     |
| UGREEN          | ✅       | ✅                     |
| LibreELEC       | ❌       | ❌                     |

## 免责声明



- 请勿将 小雅系列软件 用于商业用途。

- 请勿将 小雅系列软件 用于任何违反法律法规的行为。

- 本仓库所有脚本均基于官方脚本制作，使用请自行承担数据损失但不限于此的风险。

  

## 小雅周边工具集合



- [CatVod](https://pcoof.com/git/https://github.com/catvod/CatVodOpen): 猫影视
- [Xiaoya-convert](https://github.com/ypq123456789/xiaoya-convert): 自动批量将阿里云盘分享链接转换为小雅`alishare_list.txt`中的格式
- [Xiaoyahelper](https://github.com/DDS-Derek/xiaoya-alist/tree/master/xiaoyahelper): 一劳永逸的小雅转存清理工具
- [Alist-TVBox](https://hub.docker.com/r/haroldli/alist-tvbox): 一个基于`AList`和`xiaoya`的`TVBox`管理工具
- [`strm`文件生成](https://xiaoyaliu.notion.site/strm-2c8d136ceb37445fb6c0222eafb966ce): 小雅官方提供的一键生成`strm`文件脚本

##
