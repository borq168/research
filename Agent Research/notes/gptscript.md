# gptscript-ai/gptscript (Go)

## Snapshot
- Latest commit: 2025-12-17.
- Purpose: Go-based DSL/runtime for chaining LLM tools, MCP providers, and user-defined programs with resumable state.

## Architecture
- Core engine (`pkg/engine/engine.go`) coordinates model calls and tool execution with a structured `State` (completion request, pending tool calls, results) and `Return` payloads (calls to run, final result).
- **Context propagation:** `Context` embeds tool metadata, agent grouping, parent linkage, and user-cancel channel; JSON marshaling uses a trimmed `CallContext` to avoid circular references.
- **Tool/agent model:** `types.Tool` and `types.Program` describe callable agents; `ToolMapping` allows hierarchical delegation (agent groups).
- **Runner layers:** `pkg/runner` orchestrates program execution; `pkg/mcp` integrates Model Context Protocol tools; `pkg/cli`/`pkg/sdkserver` expose command-line and gRPC interfaces.
- Caching, credential, and repository modules provide pluggable storage for prompts, models, and scripts.

## Execution & State Management
- Engine enforces a **max consecutive tool call** guard to prevent runaway loops; configurable via env var.
- Chat history is serialized (`ChatHistory`) for reproducibility; `CallContext` surfaces display text and parent call chains for observability.
- Cancellation propagates through `Context.OnUserCancel`, enabling user-initiated aborts mid-execution.
- Runtime separates **planning vs. action** by interpreting program steps into tool calls, collecting results, and re-entering the model with enriched context until `ErrChatFinish` or result.

## Tools, Memory, and Planning
- Tools span providers (OpenAI), credentials, context loaders, and custom binaries; MCPRunner hook lets external MCP tools participate as first-class citizens.
- State is persisted in the engine’s `State` struct (pending calls/results), allowing resumes and deterministic replay.
- Planning logic lives in DSL programs that map tasks to tool chains; engine enforces structure and prevents uncontrolled recursion.

## Engineering Observations
- Strong systems orientation (Go, explicit structs, env-driven limits) yields predictable resource usage for long-running agent workflows.
- Clear separation of **model interface**, **runtime manager**, and **tool runners** simplifies testing and alternative backends.
- Good telemetry hooks (`Counter`, `version`, `monitor`) hint at production readiness for observability.
