# OpenClaw 项目结构与复杂度调研 + 详细开发方案（含浏览器插件形态）

> 目标：调研 OpenClaw 项目复杂度来源、核心能力来源，并给出一个“更轻量、少接入应用”的 Agent 产品开发方案（尽量复用 OpenClaw 的技术栈与经验），并明确插件化与可衍生能力。

## 1. OpenClaw 的整体结构与复杂度来源

### 1.1 从 README 观察到的“平台化”结构

OpenClaw 并不是一个“只有 Agent Loop + 工具”的单体工程，而是 **本地 Gateway 控制平面** + 多渠道接入 + 多终端节点 + 多能力工具平台：

- 单机 **Gateway** 作为控制平面，负责会话、渠道、工具、事件与控制 UI。它面向多渠道（WhatsApp/Telegram/Slack/Discord/Google Chat/Signal/iMessage 等）并带扩展渠道。README 的“Everything we built so far”显示了多个子系统和平台特性（多渠道、Voice/Canvas、WebChat、技能平台、自动化等）。【F:openclaw_research/sources/openclaw_README.md†L112-L224】
- OpenClaw 强调“多端/多节点”：macOS app、iOS/Android 节点、Canvas、WebChat、控制 UI 都是 Gateway 的客户端或节点能力的一部分。【F:openclaw_research/sources/openclaw_README.md†L138-L224】
- 它不仅有 Agent Loop，还有 **“工具平台 + 自动化 + 多渠道路由 + 安全/配对/认证”** 等大量工程化内容。【F:openclaw_research/sources/openclaw_README.md†L164-L214】

> 结论：OpenClaw 的复杂度主要来自“**平台级产品**”的要求，而不是 Agent Loop 本身。

### 1.2 Gateway 作为复杂度中心

OpenClaw 架构文档明确把 **Gateway** 作为单一控制平面：

- **单一长连接 Gateway** 管理所有消息渠道连接与会话，所有客户端（mac app / CLI / Web UI）与节点（iOS/Android/headless）都通过 WebSocket 连接到它。【F:openclaw_research/sources/openclaw_docs_concepts_architecture.md†L10-L38】
- Gateway 负责“统一协议 + 连接生命周期 + 事件流”，并且要求设备配对、token 鉴权、JSON Schema 校验等安全能力。【F:openclaw_research/sources/openclaw_docs_concepts_architecture.md†L24-L71】
- Gateway 还提供 canvas host，以及协议代码生成（TypeBox → JSON Schema → Swift 模型），这意味着跨端 SDK 协议维护也是复杂度来源。【F:openclaw_research/sources/openclaw_docs_concepts_architecture.md†L34-L90】

> 结论：复杂度中心在 **Gateway 控制平面 + 协议 + 多客户端**，而不是单一 Agent Loop。

### 1.3 Agent Runtime 的“工程化配置与生态”

OpenClaw 的 Agent 运行时并不是“纯 Agent Loop”，而是一个 **带工作区、技能、会话、工具治理的系统**：

- Agent 运行时来自 **pi-mono** 体系（嵌入式运行时），但会话管理、工具接入、发现等由 OpenClaw 自己实现。【F:openclaw_research/sources/openclaw_docs_concepts_agent.md†L6-L55】
- 强制的 workspace 结构与 bootstrap 文件注入（AGENTS.md、TOOLS.md、SOUL.md 等）使上下文管理成为系统能力，而非临时提示工程。【F:openclaw_research/sources/openclaw_docs_concepts_agent.md†L10-L49】
- skills 的三层加载机制（bundled / managed / workspace）意味着技能平台与工具治理是一级能力。【F:openclaw_research/sources/openclaw_docs_concepts_agent.md†L57-L67】
- 运行时支持队列模式、流式回复、块级流式等复杂机制（这通常是产品级体验需求）。【F:openclaw_research/sources/openclaw_docs_concepts_agent.md†L80-L106】

> 结论：OpenClaw 的“Agent Loop”是经过工程化封装的 runtime + workspace + 技能管理体系。

### 1.4 技术栈与依赖带来的复杂度

从依赖可看出 OpenClaw 在多渠道接入、协议、平台能力上投入巨大：

- 依赖包含 Telegram、Slack、Discord、WhatsApp（Baileys）、Signal、Line 等 SDK，意味着多渠道适配与维护是主要复杂度来源。【F:openclaw_research/sources/openclaw_package.json†L104-L170】
- 依赖 `@mariozechner/pi-agent-core`、`pi-ai`、`pi-coding-agent` 体系，说明核心 Agent 运行时与工具系统大量复用了 pi-agent 系列生态。【F:openclaw_research/sources/openclaw_package.json†L120-L134】

> 结论：**复杂度主要来自多渠道适配 + 跨端能力 + 工具/技能平台**。

---

## 2. “简单 Agent”与“业务化产品”之间的关键差距

对比 OpenClaw 的结构，简单 Agent 通常缺少以下工程化能力：

1. **控制平面（Gateway）**
   - 统一 WebSocket 协议、路由、鉴权、状态/会话管理、实时事件流。
   - 对多端（CLI、Web UI、移动端节点）提供标准化控制接口。
   - OpenClaw 通过 Gateway 统一接入渠道、客户端与节点，这是复杂度主因。【F:openclaw_research/sources/openclaw_docs_concepts_architecture.md†L10-L71】

2. **多渠道与多终端生态**
   - “业务需求”通常意味着接入各种真实渠道和多终端节点（macOS/iOS/Android/网页）。
   - OpenClaw 明确把渠道、节点、WebChat 作为核心能力的一部分。【F:openclaw_research/sources/openclaw_README.md†L138-L214】

3. **上下文/会话体系**
   - 工程上需要稳定的 session 存储、队列管理、流式输出与中断策略。
   - OpenClaw 的 session + queue + block streaming 体现了产品化“稳定可控体验”的要求。【F:openclaw_research/sources/openclaw_docs_concepts_agent.md†L80-L106】

4. **工具与技能平台**
   - 工具执行安全（沙盒）、技能加载/管理、配置治理是必须的系统能力。
   - OpenClaw 的 skills 三层体系说明“技能平台”是一级能力。【F:openclaw_research/sources/openclaw_docs_concepts_agent.md†L57-L67】

5. **运维与安全**
   - 配对、权限策略、token 鉴权、设备身份都是面向真实渠道的刚需。
   - OpenClaw 的 Gateway 协议专门强调 pairing + auth + token 校验。【F:openclaw_research/sources/openclaw_docs_concepts_architecture.md†L63-L75】

---

## 3. OpenClaw 的“核心能力”来源

综合文档与依赖可推断 OpenClaw 的核心能力来源主要有三部分：

1. **Gateway 控制平面 + 协议化工程**
   - 强化了“长期在线、事件驱动、WS 协议”的基础能力。通过 WebSocket 统一所有客户端与节点能力。【F:openclaw_research/sources/openclaw_docs_concepts_architecture.md†L10-L60】

2. **pi-agent/ pi-mono 运行时能力复用**
   - 通过依赖 `@mariozechner/pi-agent-core`、`pi-ai` 等实现强大 Agent Runtime 和工具基础能力。【F:openclaw_research/sources/openclaw_package.json†L120-L134】
   - 文档说明 OpenClaw 复用了 pi-mono 的模型/工具体系，但会话、工具接入由 OpenClaw 自己掌控。【F:openclaw_research/sources/openclaw_docs_concepts_agent.md†L69-L75】

3. **多渠道 + 多端节点 + 统一用户体验**
   - README 强调多渠道、多端节点与 Canvas/Voice/Tools 等用户体验能力，这些决定了整体工程规模和复杂度。【F:openclaw_research/sources/openclaw_README.md†L112-L214】

---

## 4. 详细开发方案（插件化 + 可衍生 + 浏览器插件）

> 核心原则：
> - **模块解耦**：Core 与扩展能力分层，保持可替换与可插拔。
> - **插件化边界清晰**：所有“渠道接入、浏览器数据采集、技能/工具”都以插件形式接入。
> - **可衍生**：同一 Core 能衍生出“浏览器插件版 / Web UI 版 / 多渠道版 / 轻量 CLI 版”。

### 4.1 总体架构分层（Core / Runtime / Plugins / Apps）

```
┌───────────────────────────────┐
│            Apps               │
│  Web UI / CLI / Browser Ext   │
└───────────────┬───────────────┘
                │ WS/HTTP
┌───────────────▼───────────────┐
│        Gateway Control Plane   │  ← 会话、协议、路由、鉴权
└───────────────┬───────────────┘
                │
┌───────────────▼───────────────┐
│        Agent Runtime Core      │  ← pi-mono/上下文/工具执行
└───────────────┬───────────────┘
                │
┌───────────────▼───────────────┐
│      Plugins / Extensions      │  ← 渠道、浏览器采集、工具包
└───────────────────────────────┘
```

**分层职责**：
- **Gateway**：统一协议、连接、路由、鉴权、事件流、配置管理。
- **Runtime Core**：Agent Loop、上下文管理、工具调用、会话存储。
- **Plugins**：渠道适配、浏览器插件数据采集、技能/工具组装。
- **Apps**：Web UI、CLI、浏览器插件（及未来多端应用）。

### 4.2 依赖与技术栈（建议与 OpenClaw 对齐）

**基础运行时**
- Node.js 22+ + TypeScript。
- JSON Schema + TypeBox（用于协议定义与生成）。
- WebSocket (ws/undici) + Express（控制面与 Web UI）。

**Agent Runtime（建议复用）**
- `@mariozechner/pi-agent-core`、`pi-ai`（与 OpenClaw 的 runtime 兼容思路一致）。【F:openclaw_research/sources/openclaw_package.json†L120-L134】

**浏览器插件方向建议依赖**
- 插件端：WebExtension API（Chrome/Edge/Firefox 兼容），必要时使用 `webextension-polyfill`。
- 与 Core 通信：
  - 浏览器插件 → 本地 Gateway：通过 `native messaging` 或 `ws://localhost`。
  - 或先通过一个“本地 companion”再转发到 Gateway。

### 4.3 项目结构建议（插件化目录）

```
repo/
  packages/
    core-gateway/        # WS/HTTP 控制平面
    runtime-core/        # Agent runtime + context/session
    plugin-sdk/          # 插件 API + 生命周期
    plugins/
      channel-slack/     # 渠道插件
      channel-telegram/
      browser-capture/   # 浏览器数据采集插件
      tool-pack-basic/   # 基础工具包
    apps/
      web-ui/            # Web 控制台 + WebChat
      cli/               # CLI 管理工具
      browser-extension/ # 浏览器插件（采集 UI + 数据）
  docs/
    architecture/
    plugins/
```

### 4.4 插件化设计（可插拔 + 可衍生）

**插件类型**：
- **Channel Plugin**：对接消息渠道（Slack/Telegram/邮件/企业IM）。
- **Browser Plugin**：采集 DOM、截图、Cookie/Session 信息（在用户授权前提下）。
- **Tool Pack**：工具集打包，例如“网页抓取工具包”“数据处理工具包”。

**插件 API 需要定义的关键点**：
- 生命周期：`register() / start() / stop()`。
- 接口：
  - 入站事件（消息、DOM 抽取结果、截图结果）。
  - 出站调用（发送消息、浏览器操作、工具调用）。
- 权限：明确插件可访问的工具/数据范围。

### 4.5 浏览器插件方案（针对登录后页面数据获取）

**目标**：在需要登录的网站中，获取页面 DOM、局部截图、甚至用户显式授权的结构化数据。

**设计要点**：
1. **插件端结构**
   - `content script`：注入 DOM，提取结构化数据。
   - `background service worker`：负责与 Gateway 通信。
   - `popup UI`：触发“采集/标注/上传”。

2. **通信方式**
   - 插件与本地 Gateway 建立 WebSocket 通道（推荐本地 WS + token）。
   - 或通过 companion app 执行安全桥接（浏览器更严格时可用）。

3. **数据能力**
   - DOM 结构：结构化提取（DOM tree / CSS selector / XPath）。
   - 截图：
     - `chrome.tabs.captureVisibleTab()` 截取可见窗口。
     - 复杂场景可由用户拖拽截图区域。
   - 附加元数据：URL、时间、页面标题、活动标签页。

4. **安全策略**
   - 用户显式授权域名列表。
   - 数据只在本地 Gateway 内处理，不默认上云。
   - 插件每次采集需要 UI 确认。

### 4.6 统一协议设计（支撑多形态衍生）

定义 **稳定协议层** 是可衍生的关键：
- `connect`：设备身份、token、capabilities。
- `agent.run`：发起一次 Agent 对话。
- `tool.invoke`：工具调用（含浏览器采集工具）。
- `event.*`：流式输出、状态变更。

协议一旦稳定，Core 之上就可以衍生多个版本：
- 仅 CLI 版
- Web UI 版
- 浏览器插件驱动版
- 多渠道扩展版

### 4.7 开发阶段拆解（更细）

#### Phase 1：Runtime Core（2-4 周）
- 对接 pi-agent runtime，支持基本工具调用。
- 实现 workspace / bootstrap 文件注入机制。
- Session JSONL/SQLite 存储。

#### Phase 2：Gateway 控制平面（3-5 周）
- WebSocket API（connect/run/health）。
- token + pairing 机制（最小可行）。
- 事件系统（streaming events / status）。

#### Phase 3：Browser Plugin MVP（3-4 周）
- 插件端（DOM + 截图）。
- Gateway 插件桥接。
- 定义 `browser.capture` / `browser.dom.extract` 工具。

#### Phase 4：Web UI/CLI（2-3 周）
- Web 控制台（对话 + 采集历史）。
- CLI（启动/健康检查/简单对话）。

#### Phase 5：渠道插件化（持续迭代）
- Slack/Telegram 插件作为首个渠道示例。
- 插件 SDK 固化，让后续渠道对接保持一致。

### 4.8 关键风险与策略

| 风险 | 说明 | 缓解策略 |
| --- | --- | --- |
| 浏览器插件权限风险 | 需要用户授权，且有隐私边界 | 明确授权域 + UI 提示 | 
| 多形态衍生难 | Core 与 UI/插件耦合过重 | 稳定协议层 + 插件 SDK | 
| 后续渠道对接复杂 | SDK 适配与认证成本 | 先固化插件模板 | 

---

## 5. 结论：你需要做的“额外工作”是什么？

对比 OpenClaw 的复杂度，**简单 Agent 到业务产品之间的额外工作**主要包括：

- **控制平面 + 协议设计**：不只是写 Agent Loop，而是要把系统变成“长期在线、可被多端访问”的服务。【F:openclaw_research/sources/openclaw_docs_concepts_architecture.md†L10-L71】
- **会话、队列、流式体验**：保证多轮对话的稳定、可中断、可恢复体验。【F:openclaw_research/sources/openclaw_docs_concepts_agent.md†L80-L106】
- **工具/技能平台化**：需要“可治理”的工具体系，而非 hardcode 工具集合。【F:openclaw_research/sources/openclaw_docs_concepts_agent.md†L57-L67】
- **多渠道与真实场景适配**：渠道 SDK + 认证 + 消息格式适配是大工程。【F:openclaw_research/sources/openclaw_package.json†L104-L170】
- **运维安全**：配对、token、权限、日志与诊断机制不可少。【F:openclaw_research/sources/openclaw_docs_concepts_architecture.md†L63-L75】

---

## 6. 建议的下一步动作

1. 先确定 **“最小闭环”**：Browser Plugin + Web UI（不接入外部渠道）。
2. 以 Gateway + Runtime 为核心，跑通采集 → Agent → 输出。
3. 在此基础上逐步固化插件 SDK，为后续渠道/能力扩展做准备。

---

## 7. 参考资料（来自 OpenClaw 仓库）

- OpenClaw README（整体能力与子系统）【F:openclaw_research/sources/openclaw_README.md†L112-L224】
- Gateway 架构文档（控制平面与协议）【F:openclaw_research/sources/openclaw_docs_concepts_architecture.md†L10-L90】
- Agent Runtime 文档（workspace/skills/session 体系）【F:openclaw_research/sources/openclaw_docs_concepts_agent.md†L6-L106】
- package.json（技术栈与依赖）【F:openclaw_research/sources/openclaw_package.json†L1-L206】
