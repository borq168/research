# Coding Agent 调研目录与结论草案

> 说明：已在当前环境联网拉取 GitHub 仓库到本地 `coding_agent/repos/`，后续调研将基于本地 README 与文档进行整理。

## 目录结构

```
coding_agent/
  README.md               # 本文档：调研目录与结论草案
  repos/                  # 已克隆的代码库位置
```

## 主题清单（面向公司内部科普）

1. **Coding Agent 的定义与核心能力**
   - 代码生成、修复、测试、重构、代码搜索、项目理解、变更摘要
2. **典型产品与生态对比**
   - Claude Code、Codex、Pi Mono（coding-agent）、OpenCode、Kimi CLI
3. **架构与设计思路**
   - 工具调用（Tools）/ 代理循环（Agent Loop）
   - 本地环境执行与沙箱隔离
   - 记忆机制与上下文压缩
4. **使用方式与交互形态**
   - CLI 模式、IDE 插件、Web/桌面应用
5. **配置方式与可扩展性**
   - 模型选择、提示词模板、工具权限控制
6. **部署与集成**
   - 自部署模型接入
   - 第三方 API（OpenAI/Anthropic/Moonshot 等）接入
7. **优势/不足与适用场景**
   - 研发效率、学习曲线、稳定性与安全性
8. **企业落地与治理**
   - 访问控制、审计、合规、数据安全

## 仓库清单（已克隆）

| 主题 | 目标仓库 | 说明 | 本地路径 |
| --- | --- | --- | --- |
| Claude Code | https://github.com/anthropics/claude-code | 官方 CLI 工具 | `coding_agent/repos/claude-code` |
| Codex | https://github.com/openai/codex | OpenAI 的 Codex CLI/SDK | `coding_agent/repos/codex` |
| Pi Mono (coding-agent) | https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent | 轻量化 agent 组件 | `coding_agent/repos/pi-mono` |
| OpenCode | https://github.com/opencode-ai/opencode | 开源代码助理 | `coding_agent/repos/opencode` |
| Kimi CLI | https://github.com/MoonshotAI/kimi-cli | Moonshot 的 CLI 工具 | `coding_agent/repos/kimi-cli` |

> 已完成克隆，后续建议：对 README、docs、示例配置与源码逐仓库解读并补齐结论表。

## 联网验证结果（成功）

- `git clone --depth 1 https://github.com/anthropics/claude-code.git`
- `git clone --depth 1 https://github.com/openai/codex.git`
- `git clone --depth 1 https://github.com/badlogic/pi-mono.git`
- `git clone --depth 1 https://github.com/opencode-ai/opencode.git`
- `git clone --depth 1 https://github.com/MoonshotAI/kimi-cli.git`

## 调研要点与输出模版

> 以下为“待源码验证”的调研模板，可直接用于后续补全细节。

### 1) Claude Code
- **定位与优势**
  - 与 Claude 模型生态深度绑定，强调高质量代码理解与多轮协作
- **可能的设计思路**
  - 强工具化：文件读写、命令执行、变更总结
  - 追求稳健的变更控制与可解释性输出
- **使用方式**
  - CLI 交互、任务驱动式对话
- **配置与集成**
  - API Key、组织/项目范围配置
  - 支持与 Anthropic API 对接
- **可能的不足**
  - 对生态外模型支持较弱

### 2) Codex
- **定位与优势**
  - OpenAI 生态代码能力、配套 CLI/SDK
- **设计思路**
  - 强调“IDE 外”的自动化开发体验
  - 可能具备审计日志、指令链等工程化特性
- **使用方式**
  - CLI + 任务式工作流
- **配置与集成**
  - OpenAI API Key、模型版本选择
  - 可与自建代理层结合
- **可能的不足**
  - 对企业内网或自部署模型需要额外适配

### 3) Pi Mono (coding-agent)
- **定位与优势**
  - 轻量组件化，适合二次开发或嵌入业务系统
- **设计思路**
  - 模块化：模型、工具、执行器可替换
- **使用方式**
  - 作为 SDK/包集成在业务中
- **配置与集成**
  - 指定模型与工具接口
  - 可能对自部署模型更友好

### 4) OpenCode
- **定位与优势**
  - 开源协作，支持社区扩展
- **设计思路**
  - 注重可配置性与透明度
- **使用方式**
  - CLI/本地运行
- **配置与集成**
  - 环境变量 + 配置文件
  - 可插拔模型供应商
- **可能的不足**
  - 相对商业产品，易受社区维护节奏影响

### 5) Kimi CLI
- **定位与优势**
  - Moonshot 生态 CLI 工具，中文体验较强
- **设计思路**
  - 面向多轮对话与命令式交互
- **使用方式**
  - CLI
- **配置与集成**
  - Kimi API Key
  - 可能支持本地/自建代理网关

## 调研结果（基于本地 README/文档）

> 说明：以下内容来自本地仓库文档，重点区分“模型能力（模型/供应商/推理能力）”与“工具能力（运行、集成、自动化/外部工具等）”。

### Claude Code

- **模型能力**
  - 仓库 README 未直接给出可选模型或自定义提供方配置入口（需依赖官方文档）。【F:coding_agent/repos/claude-code/README.md†L1-L41】
- **工具能力 / 集成**
  - 插件系统支持自定义命令、代理、Hooks 与 MCP 服务器，扩展能力由插件提供。【F:coding_agent/repos/claude-code/plugins/README.md†L1-L33】
  - 插件结构支持 commands/agents/skills/hooks 与 `.mcp.json` 外部工具配置，便于团队扩展与共享。【F:coding_agent/repos/claude-code/plugins/README.md†L83-L100】

### Codex CLI

- **模型能力**
  - CLI 支持多提供方与模型选择：可通过 `--provider` 指定 OpenAI、OpenRouter、Azure、Gemini、Ollama、Mistral、DeepSeek、xAI、Groq 等兼容 OpenAI API 的提供方，并通过环境变量设置各提供方 API key/base URL。【F:coding_agent/repos/codex/codex-cli/README.md†L64-L122】
  - 默认模型为 `o4-mini`，可通过 `--model` 或配置覆盖；支持 OpenAI Responses API 可用模型。【F:coding_agent/repos/codex/codex-cli/README.md†L497-L499】
- **工具能力 / 集成**
  - CLI 提供审批模式与沙箱执行：Suggest/Auto Edit/Full Auto 不同权限，并在 Full Auto 中网络禁用与工作目录隔离。【F:coding_agent/repos/codex/codex-cli/README.md†L166-L199】
  - 支持在 `~/.codex/config.toml` 配置 MCP 服务器以接入外部工具。【F:coding_agent/repos/codex/docs/config.md†L9-L15】

### Pi Mono (coding-agent)

- **模型能力**
  - 支持自定义提供方与模型注册：通过 `~/.pi/agent/models.json` 配置本地模型/代理（如 Ollama、vLLM、LM Studio）与多 API 协议，并支持自定义 headers、代理与鉴权策略。【F:coding_agent/repos/pi-mono/packages/coding-agent/README.md†L654-L739】
- **工具能力 / 集成**
  - 内置 `read/write/edit/bash` 等默认工具，支持 `--tools` 启用只读工具（grep/find/ls）用于安全审查场景。【F:coding_agent/repos/pi-mono/packages/coding-agent/README.md†L1314-L1335】
  - 提供 SDK 与 RPC 模式用于嵌入业务系统或跨语言集成，支持自定义工具、扩展与技能发现等能力。【F:coding_agent/repos/pi-mono/packages/coding-agent/README.md†L1343-L1383】
  - 设计上明确“不使用 MCP/子代理”，强调可观测性与自行扩展工具的路径。【F:coding_agent/repos/pi-mono/packages/coding-agent/README.md†L1405-L1424】

### OpenCode

- **模型能力**
  - 支持多提供方（OpenAI、Anthropic、Gemini、Bedrock、Groq、Azure、OpenRouter），并支持本地模型（`LOCAL_ENDPOINT`）。【F:coding_agent/repos/opencode/README.md†L30-L33】【F:coding_agent/repos/opencode/README.md†L92-L116】
  - 配置文件允许对不同 agent 指定模型与 token 上限（如 coder/task/title）。【F:coding_agent/repos/opencode/README.md†L137-L155】
- **工具能力 / 集成**
  - 具备命令执行/文件搜索/修改等工具能力，并提供 LSP 集成、会话管理与 SQLite 存储等工程化能力。【F:coding_agent/repos/opencode/README.md†L34-L43】
  - 配置支持 MCP 服务器接入外部工具与上下文。【F:coding_agent/repos/opencode/README.md†L161-L168】
  - 仓库已归档并迁移到新项目 Crush，后续调研可转向该项目以跟踪最新实现。【F:coding_agent/repos/opencode/README.md†L1-L8】

### Kimi CLI

- **模型能力**
  - 仓库 README 未明确列出可选模型与自定义模型配置方式（需依赖官方文档）。【F:coding_agent/repos/kimi-cli/README.md†L1-L24】
- **工具能力 / 集成**
  - CLI 具备读/写/执行命令与抓取网页等能力，并可自动规划与调整行动；适合通用文本处理的“工具调用型”场景。【F:coding_agent/repos/kimi-cli/README.md†L8-L12】
  - 支持 ACP 协议进行 IDE/编辑器集成（Zed/JetBrains 等），并提供 MCP 服务器管理与 ad-hoc 配置。【F:coding_agent/repos/kimi-cli/README.md†L32-L83】【F:coding_agent/repos/kimi-cli/README.md†L88-L136】

## 建议的对比维度（后续补齐）

1. **功能面**：代码生成、重构、测试、搜索、文档
2. **扩展性**：工具接口、插件、SDK
3. **集成能力**：自部署模型、三方 API、企业网关
4. **安全与治理**：审计、权限、隔离、数据出境
5. **使用体验**：指令范式、上下文保持、故障恢复

## 通用文本处理能力（待源码验证）

> 针对“coding agent 是否可泛化为通用文本处理工具”的补充调研维度。

### 基础能力（通用文本任务）

- **文本生成与改写**：摘要、润色、翻译、格式转换、模板填充
- **信息抽取与结构化**：实体识别、字段抽取、要点归纳、表格化输出
- **文本对齐与比对**：差异对比、版本合并、变更说明生成
- **知识问答与检索结合**：RAG 适配、引用与溯源、长文档阅读
- **批处理与自动化**：批量文档处理、规则化输出校验

> **区分提示**：上述“基础能力”主要取决于模型本身（推理、语言覆盖、长上下文），而“批处理/自动化/检索联动”等能力往往依赖工具链与集成方式（文件/命令/搜索/MCP/SDK）。【F:coding_agent/repos/pi-mono/packages/coding-agent/README.md†L1314-L1383】【F:coding_agent/repos/codex/codex-cli/README.md†L166-L199】

### 嵌入到定制化场景/环境的能力

- **工具与插件框架**：是否支持自定义工具、调用企业内部 API
- **权限与隔离**：细粒度权限控制、执行范围限制、敏感数据处理
- **上下文管理**：多文档、长会话、项目级记忆与压缩策略
- **可编排性**：工作流/链式调用、任务队列、并发执行
- **可观测性与治理**：审计日志、指标、失败重试与回滚
- **可移植性**：部署到本地/私有云/容器化环境的难易度

### 建议输出形式（补齐时）

1. **对比表**：每个工具在“基础能力/嵌入能力”上的支持度与方式
2. **场景案例**：如客服 FAQ 归档、合同/需求文档结构化、研发周报自动化
3. **集成清单**：需要的 API Key、代理网关、模型部署方式

## 下一步行动

1. 继续深入阅读各 repo 的 docs/示例配置并补齐对比表
2. 结合公司场景输出“使用方式 + 配置方法 + 典型场景”的落地建议
3. 汇总优势/劣势与推荐落地路径
