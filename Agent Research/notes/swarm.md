# openai/swarm (Python)

## Snapshot
- Latest commit: 2025-03-11.
- Goal: Minimal orchestrator for handing control among lightweight agents with OpenAI function/tool calls.

## Architecture
- Single-file core (`swarm/core.py`) wraps an `OpenAI` client and orchestrates agent turn-taking.
- Agents are data classes (`swarm/types.py`) exposing `instructions`, `model`, `functions`, `tool_choice`, and `parallel_tool_calls`—the runtime builds chat payloads from these attributes.
- Utility helpers (`util.py`) format functions to JSON schema (`function_to_json`), merge streamed chunks, and print debug traces.

## Execution & State Management
- **Turn loop** (`Swarm.run_and_stream`): streams a chat completion for the active agent, merges streaming deltas, appends to history, and inspects tool calls.
- **Tool dispatch** (`handle_tool_calls`): maps tool names to provided callables, injects `context_variables` when requested, and aggregates tool responses plus context updates.
- **Agent routing:** tools may return an `Agent` to switch control; the loop updates `active_agent` and continues, enabling graph-less, prompt-driven delegation.
- History is a simple list of messages; there is no checkpointing or persistent state beyond the in-memory conversation.

## Tools, Memory, and Planning
- Tools rely on OpenAI function calling; runtime strips hidden `context_variables` from tool schemas before sending to the model.
- Memory is conversational only; context variables are a mutable dict threaded through tool results and subsequent prompts.
- Planning is implicit: agent instructions + tool outputs drive control flow, making it quick to prototype but less deterministic than graph-based systems.

## Engineering Observations
- Very small surface area, easy to audit; good for demos and teaching agent handoff patterns.
- Lacks retry/checkpoint primitives—robustness must be layered on externally.
- Stream-first design shows how to fuse OpenAI streaming with tool execution while keeping code minimal.
