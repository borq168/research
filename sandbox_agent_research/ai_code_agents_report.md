## AI Code Agents SDK

### 1. 仓库地址
[felixarntz/ai-code-agents](https://github.com/felixarntz/ai-code-agents)

### 2. 项目简介
AI Code Agents 是基于 Vercel AI SDK 的 TypeScript 框架，提供类型安全的工具与环境抽象，方便构建可在沙箱中执行代码的智能体（包含多代理/多环境场景）。【F:ai-code-agents/README.md†L1-L113】

### 3. 主要技术栈
- TypeScript + Vercel AI SDK + Zod，提供严格类型校验与跨模型支持。【F:ai-code-agents/README.md†L3-L13】【F:ai-code-agents/README.md†L14-L25】
- 环境实现包含 Docker、Node 本地文件系统、unsafe-local（开发用途）、mock 文件系统；规划对 E2B/Vercel 沙箱支持。【F:ai-code-agents/README.md†L59-L72】
- 工具层覆盖读写/删除/移动文件、运行命令等，按安全等级分组（readonly/basic/all）。【F:ai-code-agents/README.md†L73-L102】

### 4. 与 AI 编程 Agent 的结合方式
- 使用 `createEnvironment` 创建沙箱上下文（如 Docker 容器 ID 与工作目录），`createCodeAgent` 将 LLM、环境与工具绑定生成可迭代执行的代理。【F:ai-code-agents/README.md†L28-L53】
- 可同时挂载多个环境（前后端容器等），并按环境配置工具权限，适合多上下文协作。【F:ai-code-agents/README.md†L141-L168】
- 支持自定义工具配置与安全审批（如写文件需人工批准）。【F:ai-code-agents/README.md†L175-L200】

### 5. Sandbox 技术实现
- 环境抽象统一文件/命令接口，实际执行由具体实现（Docker、unsafe-local 等）完成，便于替换为更安全的远程沙箱（如 E2B）。【F:ai-code-agents/README.md†L59-L113】
- 安全等级：`readonly`（只读）、`basic`（读写但不删除/执行）、`all`（允许删除与命令），可降低 Agent 权限范围。【F:ai-code-agents/README.md†L97-L102】
- 计划中的 E2B/Vercel 沙箱使框架可直接连接云端隔离环境，减少本地主机暴露面。【F:ai-code-agents/README.md†L69-L72】

### 6. 关键模块说明（可配图/伪代码）
- `createEnvironment(kind, options)`: 生成具体执行环境实例（如 Docker 容器路径）。【F:ai-code-agents/README.md†L28-L37】【F:ai-code-agents/README.md†L141-L158】
- `createCodeAgent(config)`: 绑定模型、环境、可用工具、步长与日志回调，驱动代理循环。【F:ai-code-agents/README.md†L38-L53】【F:ai-code-agents/README.md†L114-L134】
- 工具集：`read_file`、`write_file`、`run_command` 等与安全级别绑定，可按环境粒度启用或禁用。【F:ai-code-agents/README.md†L73-L102】【F:ai-code-agents/README.md†L159-L170】

```mermaid
graph TD
    A[LLM (OpenAI/Anthropic/Gemini)] --> B[createCodeAgent]
    B --> C[工具路由]
    C --> D[环境抽象层]
    D --> E1[Docker 环境]
    D --> E2[Node/unsafe-local/mock]
    D --> E3[计划中的 E2B/Vercel 沙箱]
```

### 7. 使用示例
- 单环境代理（unsafe-local，基础读写权限）：
```ts
import { anthropic } from '@ai-sdk/anthropic'
import { createCodeAgent, createEnvironment } from 'ai-code-agents'
const environment = createEnvironment('unsafe-local', { directoryPath: '/path/to/project' })
const agent = createCodeAgent({
  model: anthropic('claude-sonnet-4.5'),
  environment,
  environmentToolsDefinition: 'basic',
  maxSteps: 15,
})
const result = await agent.generate({ prompt: 'Create a Python script that calculates fibonacci numbers' })
```
【F:ai-code-agents/README.md†L118-L139】
- 多环境（前端/后端两个 Docker 容器，差异化权限）：
```ts
const environments = {
  frontend: createEnvironment('docker', { containerId: 'frontend-container-id', directoryPath: '/app' }),
  backend: createEnvironment('docker', { containerId: 'backend-container-id', directoryPath: '/app' }),
}
const agent = createCodeAgent({
  model: openai('gpt-4'),
  environments,
  environmentToolsDefinition: { frontend: 'all', backend: 'basic' },
  maxSteps: 20,
})
```
【F:ai-code-agents/README.md†L141-L168】

### 8. 优点、缺点分析与适用场景
- 优点：环境抽象可插拔、工具类型与安全等级清晰、TypeScript 类型安全；支持多环境与步骤日志，方便审计。
- 缺点：当前内置沙箱以本地/Docker 为主，云端隔离需自行扩展；unsafe-local 缺乏隔离，生产需谨慎；依赖 Vercel AI SDK 生态。
- 适用场景：需要快速搭建具备文件/命令工具的编码 Agent 原型；在 Docker/CI 中运行的自动修复代理；希望后续接入云沙箱（E2B/Vercel）的团队。

### 9. 进一步调研建议或可拓展点
- 跟踪 E2B/Vercel 沙箱实现上线后与本地 Docker 的性能/安全对比。
- 为框架增加代码审计或“审批”插件，强化安全治理（结合 `needsApproval` 配置）。
- 探索与 MCP/IDE 插件集成的最小样例，评估多代理协作与上下文切换体验。
