# Cross-project comparison

## Language trade-offs
- **Python (langgraph, autogen, swarm):** fastest iteration and rich LLM/tooling ecosystem; concurrency relies on asyncio + threads and benefits from transactional guards (langgraph) or explicit protocols (autogen). Swarm shows how minimal Python can be for quick demos but lacks durability.
- **Go (gptscript):** strict typing and goroutine-friendly execution make long-running agent graphs predictable; env-driven limits (e.g., max tool calls) and structured state simplify ops and replay.
- **TypeScript/Node (superagent):** excels as an integration/proxy layer; strong ecosystem for SDK/CLI tooling, redaction, and multitenancy, but agent reasoning is delegated to downstream providers.

## Architectural patterns
- **Graph or plan-first runtimes:** langgraph’s Pregel loop and gptscript’s engine enforce explicit control flow, retries, and checkpoints—good for production reproducibility.
- **Typed contracts and subscriptions:** autogen’s serializers, AgentType/Id, and topic-based subscriptions reduce implicit coupling; helpful when teams share agents across services.
- **Minimal orchestration:** swarm demonstrates a lean handoff loop where tool results can switch agents; great for experimentation but requires external robustness layers.
- **Infrastructure-first proxies:** superagent emphasizes perimeter concerns (config, redaction, multitenancy) rather than agent cognition, illustrating a complementary layer for securing LLM traffic.

## Commonalities
- Tool calls are JSON-schema driven across projects (OpenAI function calling or custom schema), often with retries and optional parallelism.
- Context threading is universal (history or context variables), but only langgraph/gptscript persist structured state for resume/replay.
- Observability hooks (debug tracing, telemetry counters) appear in all projects, though depth varies from simple prints (swarm) to structured counters (gptscript).

## Notable “benchmark” qualities
- **langgraph:** benchmark for deterministic, checkpointed agent graphs with strong retry/rollback semantics.
- **autogen:** benchmark for typed, event-driven multi-agent systems with extensible runtimes and serialized contracts.
- **gptscript:** benchmark for systems-level rigor in agent execution (env limits, structured state, MCP integration) suitable for ops-heavy workloads.
- **superagent:** benchmark for operational guardrails (redaction, multitenant config, telemetry) around agent deployments.

## Trend signals
- Movement toward **explicit control flow** (graphs/DSLs) to curb hallucinated plans.
- Growing importance of **operational layers** (redaction, caching, observability) as agents move into production.
- **Protocol/contract orientation** (serializers, schemas, MCP) is emerging to improve interoperability across ecosystems and languages.
