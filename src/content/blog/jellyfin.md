---
title: Jellyfin 解决封面乱码和字幕乱码
description: "**封面乱码**"
pubDate: 2025-07-12
category: 操作系统
tags: [nas, jellyfin, 家庭影院]
---

# jellyfin解决封面乱码和字幕乱码

**封面乱码**

第一种 (不推荐，容器更新后会失效)

1.进入docker bash

```
apt update
apt install fonts-noto-cjk-extra
```

2.重启docker jellyfin

3.删除封面，重新扫描媒体库即可。

第二种(推荐，不会随着容器更新而失效)

1.创建一个新的挂载路径fonts/dejavu 指向容器内路径 /usr/share/fonts/truetype/dejavu

```
容器内有以下字体文件，这些字体是不支持中文显示的，我们要把这些字体替换掉
DejaVuSans-Bold.ttf
DejaVuSans.ttf
DejaVuSansMono-Bold.ttf
DejaVuSansMono.ttf
DejaVuSerif-Bold.ttf
DejaVuSerif.ttf
```

2.去网上下一个自己喜欢的风格并且支持简体中文的字体，比如这个：
https://github.com/notofonts/noto-cjk/releases

3.在字体文件中选一个复制6份，重命名为以上文件名，然后将这几个字体复制进fonts/dejavu目录

4.重启docker jellyfin，删除封面，重新扫描媒体库即可。

------

**字幕乱码**

1.挂载路径下的config中创建fonts文件夹

2.下载字体包 [Noto Sans SC woff2](https://raw.githubusercontent.com/CodePlayer/webfont-noto/master/release/NotoSansCJKsc-hinted-standard.zip)

3.解压包，将 NotoSansCJKsc-Medium.woff2 放入fonts目录

4.切换到控制台-->播放-->勾选启用备用字体，填入路径/config/fonts路径，保存即可。

![file](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/241c98b6bf3b.png)
