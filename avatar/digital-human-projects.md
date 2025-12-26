# 数字人项目调研（高频更新 & 高评价）

> 数据来源：GitHub Repositories API（检索时间：当前环境时间）。星标数与更新时间均取自接口实时返回的字段。

| 项目 | 方向/类型 | 关键特性 | Star 数 | 最近更新时间 (UTC) | 更新/社区观察 |
| --- | --- | --- | --- | --- | --- |
| [duixcom/Duix-Avatar](https://github.com/duixcom/Duix-Avatar) | 全流程数字人生成与克隆 | 离线视频生成、数字人克隆工具链，强调完全开源 | 11,987 | 2025-12-26T05:20:17Z | 更新非常活跃，仓库自述强调可离线生产，适合自建能力 |
| [duixcom/Duix-Mobile](https://github.com/duixcom/Duix-Mobile) | 移动端实时互动数字人 | 本地部署实时交互，端侧时延 <1.5s | 7,691 | 2025-12-26T05:21:16Z | 与 Duix-Avatar 同步频繁提交，聚焦低延迟体验 |
| [lipku/LiveTalking](https://github.com/lipku/LiveTalking) | 实时流式数字人 | 面向直播/实时场景的流式驱动方案 | 6,923 | 2025-12-26T03:14:25Z | 持续更新，适合实时交互/主播场景 |
| [KlingTeam/LivePortrait](https://github.com/KlingTeam/LivePortrait) | 图像驱动头像动画 | 高质量单帧驱动头像，生态插件多 | 17,510 | 2025-12-26T05:10:26Z | 高星标与近期频繁更新，ComfyUI 等插件活跃 |
| [OpenTalker/SadTalker](https://github.com/OpenTalker/SadTalker) | 音频驱动头像动画 | CVPR 2023，支持风格化单图说话 | 13,472 | 2025-12-26T02:29:22Z | 社区广泛使用，近期仍在维护与修复 |
| [facefusion/facefusion](https://github.com/facefusion/facefusion) | 数字人/换脸平台 | 面部替换与视频驱动，支持多后端 | 26,200 | 2025-12-26T06:39:15Z | 行业知名度高，提交活跃，周边插件丰富 |
| [anliyuan/Ultralight-Digital-Human](https://github.com/anliyuan/Ultralight-Digital-Human) | 轻量级实时数字人 | 面向移动端的轻量模型，可实时运行 | 2,364 | 2025-12-25T07:42:00Z | 更新频繁，适合移动端落地与优化研究 |

## 初步结论
- **活跃度**：以上项目在 GitHub `updated_at` 字段均显示近期开发活动，表明维护频率高。
- **评价（Star）**：均在 2k–26k 星之间，社区认可度高，尤其是 facefusion、LivePortrait 与 SadTalker。
- **应用侧重点**：覆盖离线生成、实时交互、移动端轻量化、图像/音频驱动多种链路，可按场景做进一步对比与 PoC。
- **可选跟进方向**：
  - 需要端侧/低时延：优先关注 **Duix-Mobile**、**LiveTalking**、**Ultralight-Digital-Human**。
  - 需要高保真头像动画：关注 **LivePortrait**、**SadTalker**。
  - 需要成熟生态/插件：关注 **facefusion**、**LivePortrait**。

## 8 卡 H100 可尝试的部署方案（示例）
> 面向一台 8x H100 服务器，假设已具备 CUDA 12+、Docker 24+、NVIDIA Container Toolkit、`conda`/`mamba` 或 `uv` 等 Python 环境管理工具。重点关注可离线或高性能场景，优先使用容器隔离依赖。

### Duix-Avatar（离线高保真生成）
- 推荐环境：Docker + `nvidia-container-toolkit`；镜像基于 PyTorch 2.3+ / CUDA 12.1；`FFmpeg` 6+。
- 资源建议：单作业 2–4 卡（H100），混合精度开启；若批量生成可 8 卡并行多个容器。
- 部署步骤（示例）：
  1) `git clone https://github.com/duixcom/Duix-Avatar.git && cd Duix-Avatar`
  2) 准备权重：按官方 `README` 下载模型权重到 `checkpoints/`。
  3) 构建镜像：`docker build -t duix-avatar:latest .`
  4) 运行推理：`docker run --gpus all -v $PWD:/workspace duix-avatar:latest python inference.py --config configs/demo.yaml --input assets/demo.mp4 --output outputs/`。
- 备注：关注 `configs/` 中分辨率与 batch size；如需多实例并发，用 `docker compose` 或 `bash` 启动多容器共享权重卷。

### LivePortrait（单帧驱动头像，生态成熟）
- 推荐环境：Docker（官方/社区镜像）或裸机 `conda`；PyTorch 2.3+，CUDA 12.1；`xformers` 加速。
- 资源建议：单卡即可，但可用 2–4 卡并行多会话；H100 可用 FP16/TF32 提速。
- 部署步骤：
  1) `git clone https://github.com/KlingTeam/LivePortrait.git && cd LivePortrait`
  2) `conda env create -f environment.yaml` 或使用 `docker-compose`（若官方提供）。
  3) 下载权重：执行官方脚本或手动放置到 `checkpoints/`。
  4) 推理示例：`python inference.py --source inputs/src.png --driving inputs/drive.mp4 --out outputs/out.mp4 --amp`。
- 备注：在 H100 上可尝试开启 `--fp16`、`--xformers`；如需流式接口，可在 `app/` 或 `server` 目录查找 FastAPI/Gradio 入口。

### LiveTalking（实时流式）
- 推荐环境：Docker；PyTorch 2.3+；需要 `ffmpeg` 与 WebRTC/RTMP 依赖（参考仓库文档）。
- 资源建议：单卡即可支撑 1080p/30fps；为容错可预留 2 卡。
- 部署步骤：
  1) `git clone https://github.com/lipku/LiveTalking.git && cd LiveTalking`
  2) 若提供 `Dockerfile`，执行 `docker build -t livetalking:latest .`；否则用 `conda` 安装 `requirements.txt`。
  3) 准备 TTS/ASR/LLM 接入（若需要端到端数字人管线）。
  4) 启动示例：`docker run --gpus all -p 7860:7860 -v $PWD:/workspace livetalking:latest python app.py --port 7860 --fp16`。
- 备注：关注推流协议（RTMP/WebRTC），确保服务器开放相应端口；如需多路并发，开启多个实例并用 Nginx 反向代理。

### SadTalker（音频驱动头像）
- 推荐环境：Docker 或 `conda`；PyTorch 2.2+；`ffmpeg`、`mediapipe` 依赖。
- 资源建议：单卡足够；批量渲染可 4–8 卡并行多进程。
- 部署步骤：
  1) `git clone https://github.com/OpenTalker/SadTalker.git && cd SadTalker`
  2) `conda env create -f environment.yaml && conda activate sadtalker`
  3) 下载 `checkpoints/`（官方脚本）
  4) 推理：`python inference.py --driven_audio examples/driven_audio.wav --source_image examples/source.png --result_dir outputs --enhancer gfpgan`。
- 备注：在 H100 上使用 `--fp16`；如需实时，结合低时延 TTS 并减少后处理。

### facefusion（换脸/数字人平台）
- 推荐环境：官方 Docker 镜像 `facefusion/facefusion:latest-cuda`；需要 `nvidia-container-toolkit`。
- 资源建议：单容器 1–2 卡即可；如需批量渲染或高分辨率，启动多容器并分配卡号。
- 部署步骤：
  1) `docker run --gpus all -p 3000:3000 -v $PWD/storage:/app/storage facefusion/facefusion:latest-cuda`。
  2) 访问 Web UI（默认 3000）；将素材放入挂载目录。
- 备注：H100 可开启 FP16；若需 API 化，可查看仓库的 CLI/HTTP 支持或自行包装 FastAPI。

### Ultralight-Digital-Human（端侧/轻量）
- 推荐环境：裸机 `conda`/`pip`；PyTorch 2.1+；若转换到 TensorRT，可使用 H100 进行离线编译与量化。
- 资源建议：训练/蒸馏可用 4–8 卡；推理单卡即可。
- 部署步骤：
  1) `git clone https://github.com/anliyuan/Ultralight-Digital-Human.git && cd Ultralight-Digital-Human`
  2) 安装依赖 `pip install -r requirements.txt`，或基于官方示例构建 Docker。
  3) 若有导出脚本，使用 `torch.onnx.export` + TensorRT 生成端侧引擎；在 H100 上测试吞吐/延迟。
  4) 推理示例：`python inference.py --input samples/source.png --audio samples/audio.wav --output outputs/out.mp4 --fp16`（依据仓库脚本调整）。
- 备注：可在 H100 上做量化/稀疏实验，验证端侧可行性；产出的 TensorRT 引擎可再移植至移动端 NPU/GPU。
