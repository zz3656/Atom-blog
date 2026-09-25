---
title: DrawThings 完全使用指南：苹果设备本地 AI 绘画利器
description: "DrawThings 完全使用指南：在 iPhone、iPad、Mac 上本地运行 Stable Diffusion / Flux 等扩散模型，离线生成 AI 图像与视频"
pubDate: 2026-09-25
category: 技术教程
tags: [DrawThings, AI绘画, Stable Diffusion, Apple Silicon]
---

# DrawThings 完全使用指南：苹果设备本地 AI 绘画利器

> **最后更新**：2026-09-25
> **官方网站**：[drawthings.ai](https://drawthings.ai/)
> **官方 Wiki**：[wiki.drawthings.ai](https://wiki.drawthings.ai/)
> **App Store**：[Draw Things: Offline AI Art](https://apps.apple.com/us/app/draw-things-offline-ai-art/id6444050820)

---

## 一、什么是 DrawThings？

**DrawThings** 是一款面向 Apple 生态的**免费、离线、开源** AI 图像与视频生成应用。它支持在 **iPhone、iPad 和 Mac** 上本地运行 Stable Diffusion、Flux.1、SDXL、HiDream、Wan 2.2 等主流扩散模型，整个推理过程完全在本机完成——**无需联网、无需订阅、无任何内容审查或次数限制**。

### 1.1 核心特性

| 特性 | 说明 |
|------|------|
| 🆓 **完全免费** | App Store 免费下载，无内购、无订阅 |
| 🔒 **离线运行** | 所有计算在本地完成，**数据不上传任何服务器**，隐私友好 |
| 🚫 **零审查** | 不存在任何内容过滤器，使用上完全自由 |
| 🎨 **多模态生成** | 文生图（txt2img）、图生图（img2img）、局部重绘（inpainting）、扩展画布（outpainting）、视频生成 |
| 🧩 **高级能力** | 支持 ControlNet、LoRA 训练与导入、模型融合、风格模板 |
| ⚡ **深度优化** | 针对 Apple Silicon 的 Metal、Core ML、ANE（神经网络引擎）做了极致优化 |

### 1.2 支持的模型

**图像模型**

- Stable Diffusion 1.5 / 2.0 / XL（SDXL）
- Flux.1 / Flux.2
- HiDream
- Kwai Kolors
- SD3 Medium / 3.5
- Wan 2.2
- Qwen Image
- Z Image
- ERNIE Image

**视频模型**

- LTX-2 / 2.3
- Wan 2.1
- Hunyuan Video

> 💡 **新手推荐**：内存吃紧的设备优先选 **HiDream** 或 **SDXL**；高级用户可用 **Flux.1** 配合 LoRA 和 ControlNet。

---

## 二、硬件与性能

### 2.1 设备要求

| 平台 | 最低要求 | 推荐配置 |
|------|----------|----------|
| **Mac** | Apple Silicon M1 | M2 Pro / M3 / M4 / M5，**16GB+ 内存** |
| **iPhone** | iPhone 12 及以上（A14 及以上） | iPhone 15 Pro / 16 Pro |
| **iPad** | M1 及以上 iPad | M2 / M4 iPad Pro |

### 2.2 加速技术

DrawThings 充分利用 Apple Silicon 的硬件特性：

- **Metal** — Apple 的 GPU 加速 API
- **Core ML** — Apple 的机器学习框架
- **ANE（Apple Neural Engine）** — 神经网络引擎，提供额外算力
- **Metal FlashAttention 2.5** — 配合 Neural Accelerators，M5 比 M4 性能提升 **4.6×**
- **8-bit 量化模型** — 在 M4 上可获得最高 **1.8×** 提速

> ⚠️ **性能注意**：旧款 iPhone 生成一张 512×512 图像可能需要约 1 分钟；M 系列 Mac 由于统一内存架构（RAM 即 VRAM），可灵活加载大模型。

### 2.3 模型存储路径

模型下载后默认存储在：

**Mac**
```
~/Library/Containers/Draw Things/Data/Documents/Models/
```

**iOS**
应用沙盒内的 `Models/` 目录，可通过 Files App 访问。

---

## 三、安装与快速开始

### 3.1 安装应用

前往 App Store 搜索 **"Draw Things: Offline AI Art"** 下载安装。整个安装过程不到一分钟，无任何账号注册要求。

### 3.2 首次启动

1. 打开应用，进入主界面
2. **下载基础模型**：在模型下拉菜单中选择一个基础模型（推荐 **SDXL Hyper** 或 **HiDream**），点击下载按钮
3. 等待模型下载完成（首次通常需要 2–10 GB 流量）
4. 完成后即可开始生成

### 3.3 第一次生成（Quick Start）

最简单的三步流程：

1. **输入提示词（Prompt）**：在文本框中输入画面描述，例如：`a cute cat sitting on a windowsill, soft sunlight, cinematic`
2. **调整核心参数**：
   - **Steps（步数）**：20–30（标准区间）
   - **CFG Scale**：4.5–7（典型区间，数值越高越贴合提示词）
   - **Resolution（分辨率）**：512×768（速度优先）/ 1024×1024（质量优先）
3. 点击 **Generate**，等待出图

> 🎯 **技巧**：调整完所有参数后，可保存为「Configuration」，下次一键复用（包含模型、LoRA、ControlNet、Steps、CFG、采样器等全部参数）。

---

## 四、核心参数详解

### 4.1 关键参数表

| 参数 | 推荐范围 | 作用 |
|------|----------|------|
| **Steps** | 20–30 | 迭代步数，越多越精细但越慢 |
| **CFG Scale** | 4.5–7 | 提示词引导强度，过高会出现过饱和 |
| **Resolution** | 512–1024 | 输出尺寸，大幅影响速度与显存 |
| **Sampler** | Euler / DPM++ 2M | 采样算法，影响收敛速度与风格 |
| **Seed** | 随机 | 随机种子，相同时可复现结果 |

### 4.2 提示词（Prompt）编写

#### 4.2.1 基本结构

一个高质量的提示词通常包含：

```
主体 + 动作/姿态 + 场景/背景 + 风格 + 光照 + 镜头/构图 + 画质词
```

**示例**：

```
a young woman with long silver hair, standing in a rainy neon city,
looking over her shoulder, cyberpunk style, dramatic rim lighting,
cinematic composition, ultra-detailed, 8k, sharp focus
```

#### 4.2.2 常用质量词

```
masterpiece, best quality, ultra-detailed, 8k, sharp focus,
cinematic lighting, photorealistic, intricate details
```

#### 4.2.3 负面提示词（Negative Prompt）

打开 **Prompt 面板 → 切换到 Negative Prompt**，用于排除不希望出现的元素：

```
lowres, bad anatomy, bad hands, text, error, missing fingers,
extra digit, fewer digits, cropped, worst quality, low quality,
jpeg artifacts, signature, watermark, username, blurry
```

### 4.3 提示词编写进阶

- **权重重载**：使用 `(关键词:1.2)` 提升权重，`(关键词:0.8)` 降低权重
- **分层描述**：从主体到背景分层写，避免长句堆叠
- **避免否定词**：用「Negative Prompt」表达否定，提示词中不要写「no xxx」
- **参考模板**：在 `Style Templates` 菜单中有官方与社区维护的模板可直接套用

---

## 五、高级功能

### 5.1 ControlNet 基础

**ControlNet** 通过额外的图像输入（如线稿、深度图、边缘图）来精确控制生成结果。

#### 5.1.1 支持类型

- **Canny** — 边缘图，控制构图轮廓
- **Depth** — 深度图，控制空间层次
- **Pose** — 姿态图，控制人物动作
- **Lineart** — 线稿图，控制线条风格

#### 5.1.2 使用步骤

1. 在右侧 ControlNet 面板点击 **Add ControlNet**
2. 选择类型（Canny / Depth / Pose 等）
3. 上传参考图或绘制草图
4. 调整 **Control Weight**（0.5–1.5 推荐）
5. 配合提示词生成

> 💡 **优化 ControlNet**：DrawThings 官方云端下载菜单提供专为 Apple Silicon 优化的 ControlNet 版本，比通用 Diffusers / Stability AI 转换版速度更快。

### 5.2 LoRA 使用与训练

**LoRA（Low-Rank Adaptation）** 是一种轻量微调技术，可以用少量资源训练特定角色、风格或概念。

#### 5.2.1 安装 LoRA

**方式一：云端下载**

模型下拉菜单中选择 **LoRA → Cloud Download**，从官方列表中挑选。

**方式二：本地导入**

把 `.safetensors` 文件放入 Models 目录，重启应用后即可在 LoRA 列表中找到。

#### 5.2.2 训练自己的 LoRA

DrawThings **原生支持本地 LoRA 训练**，基于 PEFT（Parameter-Efficient Fine-Tuning）：

1. 进入 **Training** 模式
2. 选择基础模型（推荐 SDXL、Flux.1 [dev]、Kwai Kolors、SD3 Medium 3.5）
3. 准备数据集（建议 10–30 张同一主题的高质量图片）
4. 设置训练参数：
   - **Learning Rate**：1e-4 到 5e-5
   - **Steps**：1000–3000
   - **Batch Size**：根据显存调整
   - **Network Rank**：常用 16 / 32 / 64
5. 开始训练，结束后自动保存为 `.safetensors`

> 🔥 **BYOL（Bring Your Own LoRA）**：1.20250523.0 版本后提供 **20GB 私有云存储**，可上传、备份、分享自定义 LoRA。

### 5.3 模型融合（Model Merging）

把多个模型的权重按比例混合，生成新风格的混合模型。

1. 进入 **Models** 页面 → **Merge Models**
2. 选择 2–3 个基础模型
3. 调整混合比例（0.0–1.0 滑块）
4. 输入新模型名称，点击 **Merge**

### 5.4 局部重绘（Inpainting）

用于修改画面中的特定区域：

1. 进入 **Inpainting** 模式
2. 用画笔涂抹需要重绘的区域（生成蒙版）
3. 输入新内容的提示词
4. 点击 Generate

**典型场景**：换脸、修复瑕疵、修改服装、去除水印。

### 5.5 扩展画布（Outpainting）

把图像向四周延伸：

1. 切换到 **Outpainting**
2. 调整扩展方向与距离
3. 提示词描述扩展区域的内容
4. 生成

适合为竖图补全横向场景，或反向扩展。

### 5.6 图生图（img2img）

上传参考图，按强度（Strength）参数控制与原图的相似度：

- **Strength 0.3–0.5**：保留构图，只改风格
- **Strength 0.6–0.8**：参考布局，但大幅变化
- **Strength 0.9+**：几乎只参考色调

### 5.7 视频生成

DrawThings 已支持**文生视频 / 图生视频**：

- 支持模型：**LTX-2 / 2.3、Wan 2.1、Hunyuan Video**
- 流程与图像类似，但需要更多显存与时间
- 适合短片段（4 秒起）

---

## 六、性能优化与提速

### 6.1 如何让生成更快

| 优化手段 | 提速幅度 |
|----------|----------|
| 升级到 M4 / M5 芯片 | 4–5× |
| 使用 **8-bit 量化模型** | 1.5–1.8× |
| 启用 **ANE 加速**（在设置中开启） | 1.3–1.5× |
| 降低 **Steps** 到 15–20 | 1.3–1.5× |
| 降低分辨率到 512×768 | 2–3× |
| 关闭 ControlNet 和 LoRA | 1.2–1.5× |

### 6.2 不同设备的合理预期

| 设备 | 512×512 / 20 steps | 1024×1024 / 30 steps |
|------|---------------------|----------------------|
| iPhone 12 | ~60 秒 | 不可行 |
| iPhone 15 Pro | ~15 秒 | ~60 秒 |
| M1 Mac（16GB） | ~10 秒 | ~30 秒 |
| M4 Pro Mac（48GB） | ~3 秒 | ~10 秒 |
| M5 Max Mac | < 1 秒 | ~3 秒 |

> 数据为大致量级，实际取决于模型、Steps 与量化精度。

---

## 七、实用技巧与最佳实践

### 7.1 配置管理

把常用模型 + LoRA + 参数组合保存为**预设（Configurations）**，切换场景时一键加载，避免每次手动调节。

### 7.2 种子（Seed）策略

- 找到满意结果后**记录 Seed**，便于微调提示词后再生成同构图
- 在 `Generation History` 中可一键复制 Seed
- 同 Seed + 同参数 = 同结果

### 7.3 图生图做风格迁移

把真实照片转为动漫、油画、像素风等：

1. 上传原图
2. Strength 调到 0.4–0.6
3. 提示词写目标风格，例如 `studio ghibli style, watercolor`

### 7.4 多 ControlNet 组合

可同时叠加多个 ControlNet（如 Canny + Depth），精准控制构图与空间关系。

### 7.5 高清放大（Hires Fix）

DrawThings 内置 **Hires Fix** 功能，先生成低分辨率，再放大重绘细节：

1. 启用 **Hires Fix**
2. 设置放大倍数（1.5× / 2×）
3. 设置 Hires Steps（10–15 即可）

---

## 八、常见问题（FAQ）

### Q1：模型必须联网下载吗？

模型文件本身需要从云端下载一次，但下载完成后**完全离线运行**，包括 LoRA 训练也无需联网。

### Q2：能生成 NSFW 内容吗？

**没有任何内容过滤器**，完全由用户自行决定使用方式。

### Q3：会消耗很多电量吗？

会。AI 推理是重负载计算，建议插电使用 Mac，或在 iPhone 上提前充好电。

### Q4：与 ComfyUI、Stable Diffusion WebUI 相比如何？

| 工具 | 平台 | 优势 |
|------|------|------|
| **DrawThings** | 仅 Apple 生态 | 极简、零配置、Apple Silicon 深度优化 |
| **ComfyUI** | 全平台 | 节点式工作流、高度灵活、社区生态丰富 |
| **SD WebUI (A1111)** | 全平台 | 插件生态成熟、用户基数大 |
| **DiffusionBee** | 仅 macOS | 类似 DrawThings，但更新已停滞 |

> DrawThings 提供了 **Local Server 模式**，可在 Mac 上启动 API 服务，配合 ComfyUI 等外部工具调用。

### Q5：模型放在哪里？

Mac 默认 `~/Library/Containers/Draw Things/Data/Documents/Models/`，可手动放入 `.safetensors` 文件后重启应用加载。

### Q6：如何备份自定义 LoRA？

- 方式一：拷贝 `Models/LoRA/` 目录
- 方式二：使用 v1.20250523.0+ 的 **BYOL** 私有云存储（20GB）

---

## 九、推荐工作流

### 9.1 角色一致性插画

1. 训练或下载目标角色的 LoRA
2. 用 **HiDream / Flux.1** 作基础模型
3. 加入 LoRA，权重 0.6–0.8
4. 用 ControlNet **Pose** 锁定动作
5. 用 ControlNet **Depth** 锁定空间层次
6. 启用 **Hires Fix** 出 1024×1024+ 大图

### 9.2 照片转插画

1. 上传原图到 img2img
2. Strength = 0.45
3. 提示词：`studio ghibli style, watercolor, soft lighting`
4. Negative：`photorealistic, 3d, modern`
5. 生成后再用 img2img 微调

### 9.3 产品概念图

1. 用 **Canny ControlNet** 描出产品轮廓
2. 提示词描述材质、光照、背景
3. CFG = 5.5，Steps = 25
4. 启用 Hires Fix 放大到 2K

---

## 十、结语

DrawThings 是目前 **Apple 生态下体验最完整、上手门槛最低** 的本地 AI 绘画工具。凭借对 Metal / ANE 的极致优化，它在 M 系列芯片上的表现甚至优于许多通用 Stable Diffusion 客户端；而开源、零审查、零订阅的定位，也让创作者拥有最大自由度。

如果你是：

- 🍎 **Apple 用户**，想零门槛体验本地 AI 绘画 → DrawThings 是首选
- 🎨 **创作者**，希望完全掌控数据与作品 → 离线 + 无审查特性无可替代
- 🛠️ **极客 / 开发者**，需要本地 LoRA 训练 + API 服务 → BYOL 与 Local Server 模式足够用

> ⭐ **小贴士**：建议从 **SDXL 或 HiDream** 起步练手，熟悉后再切换到 **Flux.1** 玩 LoRA 和 ControlNet。

---

## 参考资料

- [DrawThings 官方网站](https://drawthings.ai/)
- [DrawThings 官方 Wiki](https://wiki.drawthings.ai/)
- [App Store 下载](https://apps.apple.com/us/app/draw-things-offline-ai-art/id6444050820)
- [Engineering @ Draw Things — Metal FlashAttention 2.5](https://engineering.drawthings.ai/p/metal-flashattention-2-0-pushing-forward-on-device-inference-training-on-apple-silicon-fe8aac1ab23c)
- [Quick Start Wiki](https://wiki.drawthings.ai/wiki/Quick_Start)
- [ControlNet Basics](https://wiki.drawthings.ai/wiki/ControlNet_Basics)
- [LoRA Training](https://wiki.drawthings.ai/wiki/LoRA_Training)
- [Prompting Basics](https://wiki.drawthings.ai/wiki/Prompting_Base_Model_Basics)