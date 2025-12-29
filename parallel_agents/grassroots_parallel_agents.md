# 草根并行 Coding Agent 更新度速览（Claude Code / Codex / Kimi CLI）

> 聚焦更新频繁但不一定高 star 的社区项目，强调“能跑、敢试”而非大厂成熟度。数据抓取自 GitHub API（时间均为 UTC）。

## 入选标准
- **并行/隔离能力**：基于 git worktree、tmux、容器或 MCP 的多会话隔离，能同时跑 Claude Code、Codex、Kimi CLI 等。
- **更新节奏**：2025 年下半年仍有提交；以 `updated_at` 与最近 commit 佐证。
- **草根气质**：star < 1k，个人/小团队主导，快速迭代。

## 项目速览
### Xuanwo/xlaude（Rust CLI）
- **定位**：最小依赖的 worktree 协调器，自动把 Claude/Codex 会话与 git worktree 绑定；通过读取 `~/.claude`/`~/.codex` 自动附加 `resume`。更新活跃且功能逐步扩展（近期加入 Dashboard）。
- **并行策略**：每个 worktree = 独立 agent 命令；支持非交互模式 + shell 补全，方便脚本化批量开/收工位。
- **更新信号**：`updated_at=2025-12-28T14:00:30Z`；最近 commit `2025-11-17` "Add xlaude Dashboard"。【R:xlaude-meta】【R:xlaude-commit】
- **热度**：⭐️156 / 🍴19（低 star，但持续演进）。【R:xlaude-meta】
- **适用性**：需要极简、本地优先、可插 Codex 的个人/小团队；建议自加测试/冲突钩子。

### carlsverre/kosho（Go CLI）
- **定位**：轻量 worktree 管理器，核心只做创建/切换/清理；无 UI/沙箱，留给上层 agent 组合。
- **并行策略**：目录结构固定 `.kosho/<branch>`，便于批量分配 Claude/Codex 实例或 tmux 会话。
- **更新信号**：`updated_at=2025-12-14T04:47:02Z`；dependabot 仍在跟进依赖。【R:kosho-meta】
- **热度**：⭐️39 / 🍴3；草根、无重框架负担。【R:kosho-meta】
- **适用性**：想要“脚本拼装式”并行（自行接 Claude Code CLI / codex / aider），且需要最小学习成本。

### devflowinc/uzi（Go + tmux）
- **定位**：面向“多代理兵工厂”，自动分配 worktree、tmux pane、端口，并批量播报 agent 状态；强调本地并行开发体验。
- **并行策略**：一键生成多工位 + 启动命令，支持 checkpoint/merge；可塞 Claude Code、Codex、Cursor CLI 等命令行 agent。
- **更新信号**：`updated_at=2025-12-27T23:47:36Z`；最近 commit `2025-06-04`（文档调整）。【R:uzi-meta】【R:uzi-commit】
- **热度**：⭐️547 / 🍴23；虽然星数较高，但仍属草根运营、迭代快。【R:uzi-meta】
- **适用性**：需要批量跑本地 agent、兼顾端口/日志管理的黑客式团队；仍需自行加安全/质量护栏。

### better-slop/codex-swarm（Rust 多代理编排）
- **定位**：Rust 原生多代理 orchestrator，集成 Claude Code / Codex，通过 ACP/MCP 组织“主控 + 工作者”拓扑；文档强调类型状态与 channel 并发模式。
- **并行策略**：默认 worktree + YAML 拓扑生成子代理，支持自动 create/cleanup 与任务分发。
- **更新信号**：`updated_at=2025-12-03T01:31:20Z`；最近 commit `2025-09-21` 仍在改进架构文档。【R:codexswarm-meta】【R:codexswarm-commit】
- **热度**：⭐️1 / 🍴0，超低 star 但作者持续写作与重构，实验性强。【R:codexswarm-meta】
- **适用性**：想要“多模型、多任务”并行实验的高阶用户；需要自备监控/测试流水线。

### MoonshotAI/kimi-cli（Rust/TS 混合，官方）
- **定位**：Kimi 官方 CLI，支持 ACP、MCP、Zsh/IDE 集成；非典型草根，但能与上面工具组合形成多 agent 阵列（例如 kosho 分工位 + kimi-cli 绑定）。
- **并行策略**：可在每个 worktree 内启动独立的 Kimi 交互会话；支持 ssh/远端 host 配置。
- **更新信号**：`updated_at=2025-12-29T08:39:01Z`；最近 commit 增强 SSH host 支持。【R:kimi-meta】【R:kimi-commit】
- **热度**：官方项目，star 未列入“草根”排名，但保持高更新频率。【R:kimi-meta】
- **适用性**：需要引入 Kimi 模型参与并行协作时，可与 xlaude/kosho/uzi 组合以保持隔离。

## 观察与建议
- **结合方式**：用 kosho/xlaude 负责工位编排，再在工位内按需选择 Claude Code CLI、codex、kimi-cli；uzi 适合需要 tmux/端口自动化的重度并行；codex-swarm 则提供“主控-子代理”实验土壤。
- **缺口**：普遍缺少自动化质量闸（测试、lint、范围声明）与冲突检测，可参考 parallel-cc/AgentDev 方案自行加钩子。
- **选型指南**：
  - 想要极简：xlaude / kosho。
  - 要 tmux+批量启动：uzi。
  - 想做多代理实验：codex-swarm。
  - 需要 Kimi 能力：在以上工位里装 kimi-cli。

<!-- References -->
[R:xlaude-meta]: https://api.github.com/repos/Xuanwo/xlaude
[R:xlaude-commit]: https://api.github.com/repos/Xuanwo/xlaude/commits?per_page=1
[R:kosho-meta]: https://api.github.com/repos/carlsverre/kosho
[R:uzi-meta]: https://api.github.com/repos/devflowinc/uzi
[R:uzi-commit]: https://api.github.com/repos/devflowinc/uzi/commits?per_page=1
[R:codexswarm-meta]: https://api.github.com/repos/better-slop/codex-swarm
[R:codexswarm-commit]: https://api.github.com/repos/better-slop/codex-swarm/commits?per_page=1
[R:kimi-meta]: https://api.github.com/repos/MoonshotAI/kimi-cli
[R:kimi-commit]: https://api.github.com/repos/MoonshotAI/kimi-cli/commits?per_page=1
