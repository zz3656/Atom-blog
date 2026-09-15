---
title: Typora + PicGo-Core + GitHub 实现图片上传到 GitHub
description: "由于我的电脑有`nodejs`环境，所以我使用的是`npm`命令安装`picgo`, 命令如下："
pubDate: 2025-07-12
category: 工作笔记
tags: [typora, 文本编辑, picgo]
---

# Typora + PicGo-Core + Github 实现图片上传到Github

## 下载PicGo-Core

由于我的电脑有`nodejs`环境，所以我使用的是`npm`命令安装`picgo`, 命令如下：



```
npm install picgo -g
```

安装完成后，检查命令行输出, 记录下红色框内的路径。

[![img](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/2024/05/15/e6298d432fc318cd2de3f9b741d73dee-image-20201105201730919-3dc062.png)](https://cdn.jsdelivr.net/gh/jxiaow/cdn-images@latest/blog-images/image-20201105201730919.png)

输入命令查看版本，如果有输出则添加成功。

```
picgo -``v
```

## 安装github-plus

官方提供的github上传图库不好用，安装一款新的上传插件`github-plus`, 命令行执行：



```
picgo install github-plus
```

[![img](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/2024/05/15/dba85b9fb03c7c2ce576ba97dcbaf1a8-image-20201105223054898-a8d7a4.png)](https://cdn.jsdelivr.net/gh/jxiaow/cdn-images@latest/blog-images/image-20201105223054898.png)

安装成功后会有提示。

## Typora图像设置

在`Typora`中配置图像上传信息。

### 设置PicGo的配置信息

[![img](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/2024/05/15/7a48bd7fb3fe1888cce9d8ac1ad583a8-image-20201105223720354-868070.png)](https://cdn.jsdelivr.net/gh/jxiaow/cdn-images@latest/blog-images/image-20201105223720354.png)

如上图所示，分为2个步骤：

1. **上传服务**选择`PicGo-Core(command line)`

2. 打开配置文件，在打开的配置文件，添加相关信息。

   

   ```
   {
    "picBed": {
      "uploader": "githubPlus",
      "current": "githubPlus",
      "githubPlus": {
        "branch": "master",// 仓库分支
        "customUrl": "https://cdn.jsdelivr.net/gh/jxiaow/cdn-images@latest", // 访问的自定义url
        "origin": "github", // 存放的图片类型
        "repo": "jxiaow/cdn-images", // 存放图片的仓库
        "path": "blog-images",// 存放图片的仓库目录下的文件夹
        "token": "" // 访问github的仓库的token, 不知道怎么设置的自行百度
      }
    },
    "picgoPlugins": {
      "picgo-plugin-github-plus": true // 启用github-plus插件
    },
    "picgo-plugin-github-plus": {
      "lastSync": "2020-11-05 07:54:47"
    }
   }
   ```

   ### 测试配置

   根据上述配置完毕后我们需要进行测试链接是否成功，在测试之前还要进行如图所示的修改：
   [![img](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/2024/05/15/cc200be8704e802b2e1d3dfc8f05064c-image-20201105224420441-30183d.png)](https://cdn.jsdelivr.net/gh/jxiaow/cdn-images@latest/blog-images/image-20201105224420441.png)

3. **上传服务**修改为`Custom Command`

4. 自定义命令 ： `picgo upload`

5. 点击验证图片上传选项

6. 如果显示验证成功，则表示配置完成。

[![img](https://cdn.jsdelivr.net/gh/zz3656/picgo@main/img/2024/05/15/2a5c7d4e49ceff95bbf86687bc4ca86d-image-20201105225415181-9a13e3.png)](https://cdn.jsdelivr.net/gh/jxiaow/cdn-images@latest/blog-images/image-20201105225415181.png)

## 图片上传

将图片拖入Typora中，然后在图片单击右键，图片上传即可。

## 安装文件重命名插件 [picgo-plugin-rename-file](https://github.com/liuwave/picgo-plugin-rename-file)

`picgo-plugin-rename-file` 插件可以帮我们安装一定的规则将文件进行重命名，具体设置请看github。

输入一下命令安装:



```
picgo install rename-file
```

安装完成后，打开`picgo`的配置文件`C:\Users\xxx\.picgo\config.json`末尾最后一个大括号前添加一下信息即可。



```
,
"picgo-plugin-rename-file": {
    "format": "{y}/{m}/{d}/{hash}-{origin}-{rand:6}"
}
```

## 添加水印

***注意：此插件目前会导致文件上传重命名插件不生效\***

插件地址: [picgo-plugin-watermark](https://github.com/Dec-F/picgo-plugin-watermark) ，`watermark`插件可以帮我们在上传图片的时候添加水印。

安装命令：



```
picgo install watermark
```

安装成功后，`C:\Users\xxx\.picgo\config.json`末尾最后一个大括号前添加一下信息即可。



```
,
"picgo-plugin-watermark": { // 以下配置信息参考插件地址说明
    "text": "jxiaow", // 水印名称
    "fontSize": 18, // 水印字体大小
    "position":"rm" // 水印位置
},
```

**注意：**由于这个插件安装过程中需要下载字体，会导致下载特别慢，尽可能使用代理。
