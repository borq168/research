# microsoft/autogen (Python)

## Snapshot
- Latest commit: 2025-10-04.
- Focus: Typed, multi-agent runtime with pluggable transports, factories, and tool-driven interactions; newer core is split into packages (e.g., `autogen-core`, `autogen-agentchat`).

## Architecture
- **Agent runtime protocol** (`_agent_runtime.py`) defines async messaging, publishing, and dynamic registration of factories/instances with explicit `AgentId`/`AgentType`.
- **BaseAgent** (`_base_agent.py`) supplies metadata, serializer registration (`handles` decorator), and subscription plumbing; subclasses declare event handlers via decorators and bind to runtime-provided IDs.
- **Routing & topics:** `_topic.py`, `_subscription.py`, and `_type_subscription.py` enable namespaced pub/sub plus type-prefixed dispatch for structured message flows.
- **Runtime implementations:** `_single_threaded_agent_runtime.py` runs agents in-process with cancellation tokens and task queues; factories in `_agent_instantiation.py` and `_agent_proxy.py` support proxied or remote agents.
- **Tooling & execution:** `tool_agent` package wraps function/tool invocation with JSON-serializable message types; `_function_utils.py` bridges Python callables into agent messages.
- **Memory & context:** `memory` and `model_context` modules manage state and model-facing context objects; `message_context` attaches metadata to handler invocations.

## Execution & State Management
- Agents process messages through `on_message_impl` (BaseAgent) with enforced type serializers, yielding strong typing for inter-agent contracts.
- **Subscriptions** attach handlers to topics or type prefixes; runtime delivers messages based on registered subscriptions, decoupling producers and consumers.
- **Cancellation & error handling:** `_cancellation_token.py` and rich exceptions (`exceptions.py`) support cooperative cancellation and detailed failure surfaces.
- **Serialization** (`_serialization.py`) ensures messages and events can travel across processes/transports while retaining type safety.

## Tools, Memory, and Planning
- Tools are first-class via the `tool_agent` layer, translating tool schemas to callable agents; supports tool result routing and validation.
- Memory utilities and `message_context` give handlers access to conversation history and runtime metadata; caching layers (`_cache_store.py`) available for model responses.
- Planning patterns emerge by composing specialized agents (planner, executor, critic) wired through topics, rather than hardcoding prompt-level plans.

## Engineering Observations
- Strong emphasis on **type safety and explicit contracts** (serializers, AgentType/Id), improving maintainability for complex multi-agent systems.
- Separation between **runtime**, **agent definitions**, and **tool adapters** keeps the core extensible (e.g., alternate runtimes or remote transports).
- Subscriptions provide a clean event-driven model, but require careful management of topic namespaces to avoid unintended fan-out.
