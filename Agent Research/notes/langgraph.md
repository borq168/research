# langchain-ai/langgraph (Python)

## Snapshot
- Latest commit: 2025-12-18 (`--depth 1` clone).
- Purpose: Build stateful, multi-actor agent workflows as graphs with first-class checkpoints and retries.

## Architecture
- Core runtime built around **Pregel-style graph execution** (`langgraph/pregel/_runner.py`, `_loop.py`, `_executor.py`), where each node schedules tasks and commits writes through a checkpoint-aware scratchpad.
- State is tracked via **channels** and **writesets**; `langgraph/_internal/_scratchpad.py` buffers node outputs before commit, enabling rollback/retry semantics.
- Graph definition relies on typed node functions plus configuration constants (`langgraph/constants.py`, `langgraph/config.py`), feeding into a **PregelExecutableTask** abstraction (`langgraph/types.py`).
- Concurrency model mixes `asyncio` and thread executors; `FuturesDict` in `_runner.py` orchestrates completion callbacks and cancellation, while `_retry.py` centralizes retry policies.
- Extensibility: nodes can be remote (`langgraph/pregel/remote.py`), debugged (`debug.py`), or visualized (drawing helpers).

## Execution & State Management
- **Tick-based scheduler:** `_runner.PregelRunner.tick` coordinates task submission, waits on futures, and commits writes atomically; interruptions bubble up via `GraphInterrupt`/`GraphBubbleUp`.
- **Checkpointing:** `_checkpoint.py` plus `_internal/_future.py` allow resuming and deterministic replay; resumes leverage config keys like `CONFIG_KEY_SCRATCHPAD`.
- **Message flow:** tasks emit `Call` objects (`_algo.py`) that route to downstream nodes; skip/reraise lists filter tracebacks for clean error surfaces.

## Tools, Memory, and Planning
- Tooling piggybacks on LangChain’s tool abstractions (via langchain-core callbacks in `_runner.py`), letting nodes invoke external functions with retry policies.
- Memory handled through persisted channel values and scratchpad writes; state diffs are committed only after successful node execution, supporting transactional semantics.
- Planning emerges from explicit graph topology rather than implicit LLM prompts—developers define DAG/loop structures, making control flow inspectable and testable.

## Engineering Observations
- Strong emphasis on **deterministic orchestration** (transactional writes, exclusion of internal frames from tracebacks).
- Modular runtime layers separate **graph definition**, **execution**, and **persistence**, which makes it easy to swap storage/checkpoint backends without altering node logic.
- Async + thread pool integration provides flexibility for both CPU-bound tools and IO-heavy LLM calls, though it increases concurrency complexity.
