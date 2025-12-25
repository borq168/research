# Claude Code 并行化与沙箱方向调研

## 背景与趋势
- 《Concurrent Local Coding Agents》强调：并行编码的核心瓶颈在于人的注意力与上下文切换成本，Git worktree + 本地 CLI 代理（Claude/Codex/Kimi 等）能兼顾低成本与高灵活性；同时需要类 PR 的 UI 来展示“需求（会话消息）+ 变更（git diff）”以降低审阅负担，避免多分支/多会话失忆。【R:xxchan_blog†L1-L140】【R:xxchan_blog†L141-L320】
- Claude Code 与 Cursor 2.0 都在尝试本地多代理/多工作区形态；社区开始把“并行 agent”与“沙箱（本地/云）”结合，既保证隔离又支持长时自动执行。

## 项目速览
### 1) Xuanwo/xlaude（Rust CLI）
- 将每个 git worktree 绑定到独立的 Claude/Codex 会话，自动创建/列举/清理工作区，读取 `~/.claude`/`~/.codex` 日志显示最新对话，支持 `agent` 命令配置与非交互批处理。【R:xlaude†L1-L120】【R:xlaude†L121-L210】
- 默认命令 `claude --dangerously-skip-permissions`，可用环境变量控制自动确认、非交互、配置目录、自动打开等，便于批量并发管理。【R:xlaude†L211-L340】

### 2) xxchan/AgentDev（Rust + Web UI）
- 在 xlaude 基础上强化“注意力管理”：用 worktree 驱动的 UI 同时展示 Session（用户消息为需求）与 git diff，减少并行会话失忆；支持 `agentdev wt exec` 在指定 worktree 中运行 dev 服务器、IDE、GH PR 等。【R:agentdev†L1-L120】【R:agentdev†L321-L460】
- Web UI 嵌入 session 抓取层，兼容 Kimi/Claude/Codex，具备 worktree 创建/合并/删除、命令执行、会话浏览等能力；保持 CLI 轻量同时提供浏览器体验。【R:agentdev†L461-L620】

### 3) frankbria/parallel-cc（TS + SQLite + E2B）
- 通过 wrapper 自动检测并行 Claude Code 会话，基于 `gtr` 创建隔离 worktree，SQLite 跟踪 session 与心跳，提供冲突预检、文件占用声明、AST 级冲突检测与 AI 自动修复建议，集成 MCP 供 Claude 查询状态。【R:parallel-cc†L1-L200】【R:parallel-cc†L201-L360】
- 提供 E2B 云沙箱模式：长时无监督执行（<=1h），压缩同步代码，支持 OAuth/API key、成本提示、Git Live 一键 push+PR；sandbox 任务可下载或直接远程合并。【R:parallel-cc†L361-L520】【R:parallel-cc†L521-L760】

### 4) nwiizo/ccswarm（Rust 多代理编排）
- Rust 工作区实现的多代理调度系统，默认通过 ACP WebSocket 与 Claude Code 连接；提供 ProactiveMaster 调度、模板系统、工作流 DAG、OpenTelemetry/Langfuse 追踪、长短期记忆、HITL 审批等，强调零开销并发与类型安全状态机。【R:ccswarm†L1-L200】【R:ccswarm†L201-L360】
- 支持多角色 agent（前端/后端/DevOps/QA/搜索/主控），Git worktree 管理、TUI 监控、自动生成应用与基准测试；适合本地并行+远程 Claude 结合的“多工位”场景。【R:ccswarm†L361-L560】【R:ccswarm†L561-L840】

### 5) DanEscher98/ai-agent-octopus（方法论 + Claude 技能包）
- “脑 + 触手”模型：Brain 负责架构/契约/TODO，Tentacle 在独立 worktree 内按 scope 实施，强制预提交检查（构建/测试/范围验证），通过 mailbox 异步沟通；适合多人/多会话并行并保持质量门禁。【R:octopus†L1-L180】【R:octopus†L181-L340】

### 6) carlsverre/kosho（Go CLI）
- 极简 worktree 管理器，强调“适合同时运行多个 Claude Code”；提供 `kosho run/list/prune` 与 hooks，自动在 `.kosho/worktrees` 下管理隔离目录，方便批量启动/回收代理工作区。【R:kosho†L1-L160】【R:kosho†L161-L260】

### 7) ObservedObserver/async-code（Next.js + Flask + Docker）
- 提供 Codex 风格 Web UI 管理多任务并行执行，容器化隔离每个任务；支持 Claude Code 等多代理对比、Git 克隆/提交/PR、一键自托管（docker-compose）。【R:async-code†L1-L120】【R:async-code†L121-L240】

### 8) devflowinc/uzi（Go CLI + tmux）
- 通过自动 worktree + tmux 会话为每个代理分配端口/进程，支持多代理并行、实时状态监控与 checkpoint/merge，面向本地自托管工作流。【R:uzi†L1-L120】

## 观察与未来方向
- **工作区即任务单元**：几乎所有方案把 git worktree 视为“agent 沙箱 + PR 单元”，并在 UI 或 CLI 中统一呈现需求（会话）与变更（diff），缓解并行导致的上下文丢失。【R:agentdev†L321-L460】【R:parallel-cc†L1-L200】
- **本地/云混合执行**：parallel-cc 把本地并行与 E2B 长时自动化结合，提示未来可以用低成本云沙箱跑危险或耗时任务，再通过 worktree 合并回本地。【R:parallel-cc†L361-L520】
- **协议与接口化**：ccswarm 基于 ACP 对接 Claude Code，多数项目提供 MCP/自定义 hook，使“多代理+多工作区”能被 IDE、监控或外部编排器消费，降低供应商锁定。【R:ccswarm†L1-L200】【R:parallel-cc†L1-L200】
- **质量与冲突治理**：Agent Octopus 的质量门禁、parallel-cc 的文件占用/AST 冲突检测和自动修复、AgentDev 的 UI 审阅思路，预示未来需要内置“并行风险雷达”（冲突预测、测试覆盖、合并建议）。【R:octopus†L181-L340】【R:parallel-cc†L201-L360】
- **注意力友好型 UX**：博客与 AgentDev 都强调“attention management”，优先设计轻量、低干扰的会话/任务聚合视图与一键执行入口，而非堆叠功能；未来可结合 pass@k/racing、自动评测与优选合并，减少人工筛选成本。【R:xxchan_blog†L1-L140】【R:agentdev†L461-L620】

## 结论
Claude Code 并行化的核心正在从“能否跑多个会话”演进到“如何安全、可观测、低成本地批量运行并自动合并”。Git worktree + 本地 CLI 仍是成本最低的基础设施，云沙箱（E2B 等）与 ACP/MCP 接口则为长时或隔离场景提供扩展性。下一步的机遇在于：统一的会话+diff 看板、自动冲突/质量预警、以及让云端/本地沙箱在相同工作区语义下可插拔互换。【R:parallel-cc†L361-L520】【R:ccswarm†L361-L560】

## 参考资料
- 【R:xxchan_blog】Concurrent Local Coding Agents 博客：https://xxchan.me/blog/2025-11-14-concurrent-local-coding-agents/index_en/
- 【R:xlaude】https://github.com/Xuanwo/xlaude
- 【R:agentdev】https://github.com/xxchan/AgentDev
- 【R:parallel-cc】https://github.com/frankbria/parallel-cc
- 【R:ccswarm】https://github.com/nwiizo/ccswarm
- 【R:octopus】https://github.com/DanEscher98/ai-agent-octopus
- 【R:kosho】https://github.com/carlsverre/kosho
- 【R:async-code】https://github.com/ObservedObserver/async-code
- 【R:uzi】https://github.com/devflowinc/uzi
