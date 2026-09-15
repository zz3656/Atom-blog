---
title: 绿化大师环境盖伦下载机如何修改绝地求生默认游戏特效
description: 声明：本文非博主原创，方法和理论均来自网络。
pubDate: 2020-02-23
category: 工作笔记
tags: [无盘软件, 工作日志, 教程]
---

声明：本文非博主原创，方法和理论均来自网络。

> ⚠️ **内容时效性提醒**：本文写于 2020 年 2 月。当时的"无盘网吧 + 盖伦下载机 + 绿化大师 + 绝地求生"是网吧主流方案。2021 年后 PUBG 改名为《PUBG: BATTLEGROUNDS》，客户端配置路径、`GameUserSettings.ini` 位置都变更。盖伦无盘 / 绿化大师这类无盘方案 2020 年后基本退出市场。本文保留为**历史记录**，仅供参考，不建议按本文操作当前 PUBG。
> 
> 如果你需要 2026 年版的 PUBG / 网吧 / 云游戏运维内容，请等专门更新文章。

1 首先我们先在一台客户机提取我们已经设置好的游戏特效文件（方法就是正常进入游戏，然后设置你需要的特效等级就行），文件路径
```
C:/Users/Administrator/AppData/Local/TslGame/Saved/Config/WindowsNoEditor 
```
这个路径下的GameUserSettings这个名字的文件是绝地的配置文件
2 然后把这个配置文件拷贝到服务器上开机任务目录里
拷贝三分，改下名字

然后在目录里新建一个批处理文件并右键点编辑输入以下内容
```
del D:/网络游戏/绝地求生大逃杀/zhconfig/1_GameUserSettings.ini
del D:/网络游戏/绝地求生大逃杀/zhconfig/2_GameUserSettings.ini
del D:/网络游戏/绝地求生大逃杀/zhconfig/3_GameUserSettings.ini
del D:/网络游戏/绝地求生大逃杀/GameConfigSet.exe
rd D:/网络游戏/绝地求生大逃杀#zmjsq# /s/q
copy steam.bat D:/网络游戏/绝地求生大逃杀/ /y


XCOPY D:/维护软件/开机通道/绝地求生/1_GameUserSettings.ini D:/网络游戏/绝地求生大逃杀/zhconfig /s /e
XCOPY D:/维护软件/开机通道/绝地求生/2_GameUserSettings.ini D:/网络游戏/绝地求生大逃杀/zhconfig /s /e
XCOPY D:/维护软件/开机通道/绝地求生/3_GameUserSettings.ini D:/网络游戏/绝地求生大逃杀/zhconfig /s /e

```
请自行替换自己的客户机游戏路径（D:#网络游戏#绝地求生大逃杀）及服务器开机通道路径（D:#维护软件#开机通道#绝地求生）保存添加开机任务即可
注释：本批处理是博主在联系盖伦官方后索要的批处理基础上修改的
```
“del D:/网络游戏/绝地求生大逃杀/GameConfigSet.exe” 
```
删除绝地求生游戏运行时自动根据显卡型号配置特效的执行文件（实测：1060显卡本来是可以高特效流畅游戏的但是自动配置的特效却是最低）
```
“rd D:/网络游戏/绝地求生大逃杀/zmjsq# /s/q”
```
删除绝地求生游戏自带的追梦加速器文件夹（毕竟不是所有的网吧都用追梦加速器，如果是追梦加速器环境可删除本行。）
```
“copy steam.bat D:/网络游戏/绝地求生大逃杀/ /y”
```
复制steam.bat文件替换游戏目录文件（最新更新的版本里吃鸡游戏还是会自动启动追梦加速器的，我们从游戏目录里复制出来一份steam.bat文件并编辑删除“START zmjsq\ZsSteamjsq.exe”这一行把steam.bat文件保存到开机通道目录里）
至此，可以愉快的按照自己的设置好的特效愉快的吃鸡了。祝各位同僚工作顺利、财源广进！
