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
