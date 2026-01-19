# Coding Agent 调研（可联网版）

本目录用于公司内部科普与横向对比。已在当前环境拉取目标仓库源码，下面基于各项目 README/文档梳理其**定位、设计思路、使用方式、配置方法**与**集成方式（含自部署模型/第三方 API）**。

## 仓库位置

| 项目 | 仓库地址 | 本地路径 |
| --- | --- | --- |
| Claude Code | https://github.com/anthropics/claude-code | `coding_agent/repos/claude-code` |
| Codex | https://github.com/openai/codex | `coding_agent/repos/codex` |
| Pi Mono (coding-agent) | https://github.com/badlogic/pi-mono | `coding_agent/repos/pi-mono` |
| OpenCode | https://github.com/opencode-ai/opencode | `coding_agent/repos/opencode` |
| Kimi CLI | https://github.com/MoonshotAI/kimi-cli | `coding_agent/repos/kimi-cli` |

## 1) Claude Code

**定位/设计思路**
- 终端内的代理式编码工具，支持自然语言执行代码理解、常规任务与 Git 工作流，并可在 IDE 或 GitHub 中 @claude 使用。【F:coding_agent/repos/claude-code/README.md†L1-L11】
- 通过插件系统扩展能力，插件包含命令、Agent、Hooks 与 MCP 服务器集成（.mcp.json）等结构化扩展点。【F:coding_agent/repos/claude-code/plugins/README.md†L1-L74】

**使用方式**
- 推荐安装方式：macOS/Linux 通过安装脚本或 Homebrew，Windows 通过 PowerShell 脚本或 Winget；安装后在项目目录运行 `claude`。【F:coding_agent/repos/claude-code/README.md†L13-L40】

**配置与扩展**
- 插件可通过 `/plugin` 安装，项目级配置在 `.claude/settings.json` 中管理。【F:coding_agent/repos/claude-code/plugins/README.md†L40-L52】
- 插件结构支持 MCP 服务器配置文件 `.mcp.json`，用于外部工具连接。【F:coding_agent/repos/claude-code/plugins/README.md†L54-L74】

**集成方式（自部署/三方 API）**
- README 本身未包含自部署模型或多供应商接入配置；当前以官方文档为准，需要进一步在官方文档确认模型接入方式与企业网关策略。【F:coding_agent/repos/claude-code/README.md†L1-L46】

**优势/不足（基于公开说明）**
- 优势：插件生态与工作流（命令/Agent/Hooks/MCP）清晰，适合企业规范化扩展。【F:coding_agent/repos/claude-code/plugins/README.md†L1-L74】
- 不足：仓库内未直接提供多供应商或自部署模型配置说明，需依赖官方文档进一步验证。【F:coding_agent/repos/claude-code/README.md†L1-L46】

## 2) Codex (OpenAI)

**定位/设计思路**
- OpenAI 出品的本地 CLI coding agent，可在终端运行，且支持 IDE 集成版本和云端 Codex Web。【F:coding_agent/repos/codex/README.md†L1-L13】

**使用方式**
- 安装：`npm install -g @openai/codex` 或 Homebrew 安装；安装后运行 `codex`。【F:coding_agent/repos/codex/README.md†L18-L33】
- 认证：可选择 ChatGPT 账号登录或 API Key 方式（详见官方文档）。【F:coding_agent/repos/codex/README.md†L35-L42】

**配置与扩展**
- 配置文件位于 `~/.codex/config.toml`，可配置 MCP 服务器等扩展能力，具体字段详见官方配置参考文档。【F:coding_agent/repos/codex/docs/config.md†L1-L13】
- Codex 支持“通知钩子（Notify）”等终端通知配置选项（同样在官方配置参考中）。【F:coding_agent/repos/codex/docs/config.md†L14-L22】

**集成方式（自部署/三方 API）**
- 仓库文档未提供自部署模型接入说明；API Key 接入需参考官方认证文档。【F:coding_agent/repos/codex/README.md†L35-L42】【F:coding_agent/repos/codex/docs/authentication.md†L1-L3】

**优势/不足（基于公开说明）**
- 优势：CLI/IDE/Web 形态齐全，官方文档体系完善。【F:coding_agent/repos/codex/README.md†L1-L46】
- 不足：多供应商或自部署模型配置未在仓库内直接给出，需依赖官方文档进一步验证。【F:coding_agent/repos/codex/docs/config.md†L1-L22】

## 3) Pi Mono (coding-agent)

**定位/设计思路**
- 终端型 coding agent，支持多模型与会话中切换模型，强调“轻量、可组合”。【F:coding_agent/repos/pi-mono/packages/coding-agent/README.md†L1-L27】

**使用方式**
- npm 安装或下载二进制运行；也支持从源码构建（二进制打包）。【F:coding_agent/repos/pi-mono/packages/coding-agent/README.md†L52-L94】

**配置与扩展**
- 支持 `AGENTS.md/CLAUDE.md` 项目上下文说明、`SYSTEM.md`/`APPEND_SYSTEM.md` 系统提示词覆盖或追加机制。【F:coding_agent/repos/pi-mono/packages/coding-agent/README.md†L598-L651】
- 支持 `~/.pi/agent/settings.json` 与 `<cwd>/.pi/settings.json` 进行全局/项目级配置合并，可配置默认模型、compaction、扩展等。【F:coding_agent/repos/pi-mono/packages/coding-agent/README.md†L773-L858】

**集成方式（自部署/三方 API）**
- 通过 `~/.pi/agent/models.json` 自定义 provider，可接入 Ollama、vLLM、LM Studio 等本地/自部署模型，并支持自定义 baseUrl 与 headers；内置支持 OpenAI/Anthropic/Google 等 API 规范（openai-responses、anthropic-messages 等）。【F:coding_agent/repos/pi-mono/packages/coding-agent/README.md†L654-L742】
- API key 支持 env、命令获取或明文配置，并可代理内置 provider 到自建网关。【F:coding_agent/repos/pi-mono/packages/coding-agent/README.md†L654-L742】

**优势/不足（基于公开说明）**
- 优势：对自部署模型与多供应商兼容性强，模型/配置可热更新，适合企业内网场景。【F:coding_agent/repos/pi-mono/packages/coding-agent/README.md†L654-L742】
- 不足：需要维护本地模型与 provider 配置，对运维/配置要求更高。【F:coding_agent/repos/pi-mono/packages/coding-agent/README.md†L654-L858】

## 4) OpenCode（已归档）

**定位/设计思路**
- OpenCode 是 Go 实现的终端 TUI AI 助手，具备多模型供应商、会话管理、工具执行与 LSP 等能力。【F:coding_agent/repos/opencode/README.md†L15-L44】
- **注意**：项目已归档并迁移到 Crush（Charm 团队），后续建议关注新仓库。【F:coding_agent/repos/opencode/README.md†L1-L7】

**使用方式**
- 支持脚本安装、Homebrew/AUR/Go install 等方式安装 CLI。【F:coding_agent/repos/opencode/README.md†L46-L77】

**配置与扩展**
- 配置文件路径：`$HOME/.opencode.json`、`$XDG_CONFIG_HOME/opencode/.opencode.json` 或本地 `./.opencode.json`。【F:coding_agent/repos/opencode/README.md†L79-L85】
- 支持自动压缩上下文（autoCompact）、配置 shell 路径与参数，以及 MCP 服务器配置。【F:coding_agent/repos/opencode/README.md†L87-L162】

**集成方式（自部署/三方 API）**
- 支持 OpenAI、Anthropic、Gemini、Bedrock、Groq、Azure OpenAI、OpenRouter 等 API，通过环境变量与 config 配置；并提供 `LOCAL_ENDPOINT` 用于自部署模型接入。【F:coding_agent/repos/opencode/README.md†L31-L126】

**优势/不足（基于公开说明）**
- 优势：多供应商支持面广、配置项齐全，具备 LSP 与工具执行等开发者友好功能。【F:coding_agent/repos/opencode/README.md†L31-L162】
- 不足：仓库已归档，后续维护需迁移到 Crush 生态，稳定性与更新节奏需重新评估。【F:coding_agent/repos/opencode/README.md†L1-L7】

## 5) Kimi CLI

**定位/设计思路**
- 终端 AI agent，支持代码读写、命令执行、网页搜索与任务规划，处于技术预览阶段。【F:coding_agent/repos/kimi-cli/README.md†L1-L18】

**使用方式**
- 通过官方文档完成安装与启动（README 指向 Getting Started 文档）。【F:coding_agent/repos/kimi-cli/README.md†L18-L22】

**配置与扩展**
- 支持 ACP（Agent Client Protocol），可在 Zed/JetBrains 等 IDE 中作为 ACP agent server 集成；配置示例为 `~/.config/zed/settings.json` 或 `~/.jetbrains/acp.json`。【F:coding_agent/repos/kimi-cli/README.md†L34-L66】
- 内置 MCP 支持，提供 `kimi mcp` 管理子命令；支持 ad-hoc MCP 配置文件并通过 `--mcp-config-file` 传入。【F:coding_agent/repos/kimi-cli/README.md†L76-L123】

**集成方式（自部署/三方 API）**
- README 未直接给出模型接入与 API key 配置，需在官方文档中进一步确认具体认证与企业集成方式。【F:coding_agent/repos/kimi-cli/README.md†L1-L123】

**优势/不足（基于公开说明）**
- 优势：ACP 与 MCP 让 IDE 与外部工具集成路径清晰，适合企业协作链路打通。【F:coding_agent/repos/kimi-cli/README.md†L34-L123】
- 不足：处于技术预览阶段，功能与稳定性仍需评估。【F:coding_agent/repos/kimi-cli/README.md†L13-L18】

## 横向对比（摘要）

| 维度 | Claude Code | Codex | Pi Mono | OpenCode | Kimi CLI |
| --- | --- | --- | --- | --- | --- |
| 交互形态 | CLI/IDE/GitHub | CLI/IDE/Web | CLI | CLI/TUI | CLI/ACP/IDE |
| 插件/工具扩展 | 插件+MCP | MCP | skills/扩展 + 自定义 provider | MCP + LSP | MCP + ACP |
| 自部署模型 | 文档待确认 | 文档待确认 | 支持（Ollama/vLLM/LM Studio 等） | 支持（LOCAL_ENDPOINT） | 文档待确认 |
| 多供应商 API | 文档待确认 | OpenAI 为主 | OpenAI/Anthropic/Google 等 | OpenAI/Anthropic/Gemini/Bedrock/Groq/OpenRouter 等 | 文档待确认 |
| 维护状态 | 活跃 | 活跃 | 活跃 | 已归档，迁移到 Crush | 技术预览 |

> 说明：表格中“文档待确认”代表仓库内 README 未给出明确信息，需进一步查阅官方文档或使用实测补齐。

## 后续建议

1. **补齐各项目官方文档细节**：尤其是 Claude Code、Codex、Kimi CLI 的认证与企业集成策略。
2. **基于真实项目实测**：统一任务集（新增功能、修复 bug、重构、编写测试）对比完成时间、失败率与可控性。
3. **企业落地评估**：重点评估权限控制、审计、数据出境、安全策略与自部署模型能力。
