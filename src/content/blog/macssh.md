---
title: Mac SSH功能，配合 Vim 编辑器对编程十分有帮助
description: "本文整合自网络教程（原文链接：<https://blog.csdn.net/xcg132566/article/details/78797339>），并补充了 2026 年 macOS SSH / Vim 的现代实践。 macOS 内置 OpenSSH 客户端和 Vim 编辑器，无需额外安装就能远程管理 Linu..."
pubDate: 2025-07-12
category: 工作笔记
tags: [macos, linux, ssh]
---

## 前言

>本文整合自网络教程（原文链接：<https://blog.csdn.net/xcg132566/article/details/78797339>），并补充了 2026 年 macOS SSH / Vim 的现代实践。

macOS 内置 OpenSSH 客户端和 Vim 编辑器，无需额外安装就能远程管理 Linux 服务器。这套组合是程序员日常工作的"标配"——尤其在运维、远程开发、跨平台协作场景下。

本文从基础 SSH 连接讲起，覆盖 SSH 密钥认证、scp 文件传输、Vim 编辑器配置、SSH 高级用法（隧道 / 代理），形成完整的 macOS + Linux 远程开发工作流。

## 一、SSH 基础连接

### 1. 密码登录

```bash
ssh username@192.168.100.100
```

- `username`：远程主机的用户名
- `192.168.100.100`：远程主机 IP（或域名）
- 按提示输入密码即可登录

⚠️ **macOS 第一次连接陌生主机**会提示：

```
The authenticity of host '192.168.100.100' can't be established.
ED25519 key fingerprint is SHA256:xxxxxxxxxxx.
Are you sure you want to continue connecting (yes/no)?
```

输入 `yes` 后会写入 `~/.ssh/known_hosts`，下次连接不再提示。

### 2. 指定端口

SSH 默认端口是 22。如果服务器改了端口：

```bash
ssh -p 2222 username@192.168.100.100
```

### 3. 指定私钥登录

如果服务器配置了公钥认证：

```bash
ssh -i ~/.ssh/id_rsa username@192.168.100.100
```

### 4. 查看当前登录的用户

```bash
ssh user@server who
```

或者登录后用 `who` 命令查看当前所有登录用户。

## 二、SSH 公钥认证（免密码登录）

密码登录每次都要输入密码，**公钥认证**才是日常开发的方式——生成一对密钥，把公钥放到服务器，本地用私钥登录，全程免密。

### 1. 生成密钥对

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

**2026 年推荐用 ed25519**（比 RSA 更短、更快、更安全）。如果你还在用老 RSA：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

按提示设置：
- 文件路径：直接回车用默认 `~/.ssh/id_ed25519`
- 密码：建议**设一个密码**（passphrase）—— 即使私钥泄露，攻击者也需要密码才能用

### 2. 上传公钥到服务器

**方法 1：ssh-copy-id**（最方便）

```bash
ssh-copy-id username@192.168.100.100
```

输入密码一次，公钥自动追加到服务器的 `~/.ssh/authorized_keys`。

**方法 2：手动复制**

```bash
# macOS 本地
cat ~/.ssh/id_ed25519.pub | ssh username@192.168.100.100 \
  "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

**方法 3：直接编辑**

mac上：

```bash
cat ~/.ssh/id_ed25519.pub
# 复制输出内容

# 登录服务器后
ssh username@192.168.100.100
mkdir -p ~/.ssh
chmod 700 ~/.ssh
# 把公钥内容粘贴进去
echo "ssh-ed25519 AAAA... your_email@example.com" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

⚠️ **关键**：`~/.ssh` 必须是 `700` 权限，`authorized_keys` 必须是 `600`。否则 SSH 会拒绝使用公钥认证。

### 3. 测试免密登录

```bash
ssh username@192.168.100.100
# 不再要求输入密码
```

### 4. SSH Config 简化命令

如果你经常连多台服务器，可以配 `~/.ssh/config`：

```
Host myserver
    HostName 192.168.100.100
    User username
    Port 22
    IdentityFile ~/.ssh/id_ed25519

Host prod
    HostName prod.example.com
    User deploy
    Port 2222
    IdentityFile ~/.ssh/work_key
```

之后直接 `ssh myserver` 或 `ssh prod`，不用记 IP / 端口 / 用户名。

## 三、scp 文件传输

scp = SSH Copy，本质是在 SSH 加密通道上传输文件。

### 1. 下载：服务器 → 本地

```bash
scp username@servername:/path/filename /local/path
```

示例：

```bash
scp root@123.207.170.40:/root/test.txt /Users/mac/Desktop
# 把服务器的 /root/test.txt 下载到本地桌面
```

### 2. 上传：本地 → 服务器

```bash
scp /local/path/filename username@servername:/remote/path
```

示例：

```bash
scp /Users/mac/Desktop/test.txt root@123.207.170.40:/root/
```

### 3. 递归传输整个目录

加 `-r` 参数：

```bash
# 下载整个目录
scp -r root@server:/root/folder /local/

# 上传整个目录
scp -r ./local_folder root@server:/root/
```

### 4. 指定端口

```bash
scp -P 2222 file.txt user@server:/path
# ⚠️ scp 用大写 -P，ssh 用小写 -p
```

### 5. 保留文件属性

```bash
scp -p file.txt user@server:/path
# 保留时间戳、权限、属主等
```

### 6. 限速

```bash
scp -l 1000 file.txt user@server:/path
# 限制 1000 Kbit/s（用于慢速网络避免占满带宽）
```

## 四、Vim 编辑器基础

Vim 是 macOS / Linux 自带的文本编辑器，**所有 Unix-like 系统都有**。掌握 Vim 后，你在任何服务器上都能编辑文件。

### 1. 启动 Vim

```bash
vim filename
```

### 2. 三种模式

| 模式 | 进入方式 | 作用 |
|------|----------|------|
| **普通模式**（Normal） | 启动默认 / `Esc` | 移动光标、删除、复制、粘贴 |
| **插入模式**（Insert） | `i` / `a` / `o` | 输入文本 |
| **命令行模式**（Command） | `:` | 执行命令（保存、退出、查找等） |

### 3. 必备命令

**普通模式下**：

```
h j k l      左下上右（替代方向键，更快）
0           跳到行首
$           跳到行尾
gg          跳到文件首行
G           跳到文件末行
dd          删除当前行
yy          复制当前行
p           粘贴
/keyword    搜索关键字
n           下一个匹配
:N          跳到第 N 行
```

**命令行模式下**：

```
:w           保存
:q           退出
:wq          保存并退出
:q!          强制退出（不保存）
:set nu      显示行号
:%s/old/new/g  全局替换
```

### 4. .vimrc 配置

macOS 默认 `~/.vimrc`，Linux 也是 `~/.vimrc`：

```vim
" 显示行号
set number

" 语法高亮
syntax on

" 自动缩进
set autoindent
set smartindent

" Tab = 4 空格
set tabstop=4
set expandtab

" 显示当前模式
set showmode

" 搜索时忽略大小写
set ignorecase
set smartcase

" 中文编码
set encoding=utf-8
set fileencodings=utf-8,gbk,gb18030
```

### 5. Vim 常用插件

**Vundle / vim-plug / pack**：插件管理器

```vim
" ~/.vimrc 装 vim-plug
call plug#begin('~/.vim/plugged')
Plug 'vim-airline/vim-airline'
Plug 'preservim/nerdtree'
Plug 'tpope/vim-commentary'
call plug#end()
```

安装：`curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim`

然后 `:PlugInstall`。

⚠️ **服务器上慎用插件**：远程服务器的 Vim 没法装插件，只用基础命令就好。

## 五、SSH 高级用法

### 1. SSH 端口转发（隧道）

**本地转发**（本地访问远程服务）：

```bash
ssh -L 8080:remote-server:80 user@server
# 之后访问 localhost:8080 就像访问 remote-server:80
```

典型场景：在本地访问服务器的 MySQL / Redis / Web 服务（避开公网）。

**远程转发**（远程访问本地服务）：

```bash
ssh -R 8080:localhost:3000 user@server
# 服务器访问 localhost:8080 就是访问你本地的 :3000
```

典型场景：本地开发 Web 应用，让外部用户通过服务器访问。

**动态转发（SOCKS 代理）**：

```bash
ssh -D 1080 user@server
# 配置本地浏览器 / 应用走 SOCKS5 代理 localhost:1080
# 所有流量经 SSH 加密走服务器出去
```

⚠️ 这就是**跳板机**最简单实现——不推荐用来"翻墙"违反当地法规。

### 2. SSH 免密 + sudo

服务器端 `visudo`：

```
username ALL=(ALL) NOPASSWD: ALL
```

让 sudo 也免密。**慎用**——只在自己的开发机用。

### 3. ssh-agent 转发私钥

本地有私钥，但 SSH 到中间跳板机后还想用同一私钥连其他服务器：

```bash
ssh -A user@jumpserver
# 之后从 jumpserver 跳到目标服务器时直接用本地私钥
```

`ssh-agent` 会管理内存中的私钥，**私钥不会落到跳板机磁盘**。

macOS 上启用：

```bash
# 启动 ssh-agent（macOS 默认启用）
eval "$(ssh-agent -s)"

# 添加私钥（一次）
ssh-add ~/.ssh/id_ed25519
# 输入密码

# 之后 ssh-add -l 能看到已加载的密钥
```

⚠️ **2026 年 macOS Keychain 已经自动接管 ssh-agent**——只要 `~/.ssh/id_ed25519` 是 macOS Keychain 信任的私钥，第一次 `ssh` 就会自动询问是否保存到 Keychain，之后自动用。

### 4. SSH 多因素认证

服务器开 Google Authenticator / Yubikey：

```
/etc/pam.d/sshd 添加：
auth required pam_google_authenticator.so
```

macOS 客户端连接时多一步输 6 位 TOTP 码。

## 六、SSH 安全最佳实践

服务器端（`/etc/ssh/sshd_config`）：

```
# 禁用密码登录（强制公钥）
PasswordAuthentication no

# 禁用 root 直接登录
PermitRootLogin prohibit-password

# 限制尝试次数
MaxAuthTries 3

# 修改默认端口（防扫描）
Port 2222
```

客户端：
- ⚠️ **不要把私钥提交到 git**
- 给不同用途的服务器**用不同密钥**（work / personal / GitHub）
- 私钥密码（passphrase）一定要设
- 定期 `ssh-keygen -lf ~/.ssh/id_ed25519` 看本地有哪些密钥

`.gitignore` 加：

```
.ssh/id_*
```

（只忽略私钥，公钥 `*.pub` 可以提交）

## 七、常见问题

### Q: 连接提示 "Permission denied (publickey,password)"？

99% 是 `.ssh` 目录权限问题：

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 644 ~/.ssh/known_hosts
chmod 644 ~/.ssh/config
```

### Q: 配了公钥还是要输密码？

服务端 `sshd_config` 检查：

```bash
# 必须确认
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
```

重启 sshd：

```bash
sudo systemctl restart sshd
```

### Q: macOS 上 ssh-add 后重启要重新输密码？

macOS 上：

```bash
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
# 添加到 Keychain，重启不丢
```

### Q: SSH 经常断线？

服务端 `sshd_config` 加：

```
ClientAlive
Interval 60
ClientAliveCountMax 3
```

客户端 `~/.ssh/config` 加：

```
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

## 八、完结

macOS + SSH + Vim 是程序员**远程工作的三件套**：

- SSH 连接服务器（公钥认证免密登录）
- scp 传输文件
- Vim 编辑服务器文件（基础命令够用，复杂需求用 VSCode Remote）

把这套练到不查文档就能用，**远程运维能力**会有质的飞跃。

记住三个核心原则：
1. **永远用公钥认证**（别再用密码）
2. **私钥加密码 + 不入 git**
3. **服务器端禁用密码登录 + 改默认端口**
