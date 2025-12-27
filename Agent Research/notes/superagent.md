# superagent-ai/superagent (TypeScript/Node + multi-language SDK)

## Snapshot
- Latest commit: 2025-12-19.
- Focus: Hosted/multi-tenant agent proxy with SDKs and CLI for configuring model access, redaction, and telemetry.

## Architecture
- **Proxy server** (`proxy/node/src/server.js`) is an HTTP/HTTPS forwarder that injects config, telemetry, and redaction into LLM traffic. Supports multitenant mode with Redis caching for per-tenant model configs.
- **Redaction pipeline** (`redaction.js`) initializes sensitive pattern detectors and scrubs prompts/responses before egress.
- **Configuration management** (`config.js`) loads YAML or fetches configs via API in multitenant setups; telemetry webhooks are configurable per tenant.
- **CLI/SDK**: TypeScript CLI (`cli/src`) and SDK (`sdk/typescript/src`) expose agent/project management and strongly typed client helpers; Python SDK mirrors functionality for cross-language integration.
- Rust/Node split under `proxy/` hints at higher-performance proxy options while maintaining JS ergonomics.

## Execution & State Management
- Proxy server tracks request/response buffers, SSE accumulation, and response times; analytics are batched to a remote endpoint and optional Redis caches configs.
- Context is mostly per-request; no long-lived conversation state is stored server-side, aligning with gateway responsibilities.
- Multitenant flow fetches config on demand, caches in Redis with TTL, and falls back to defaults on failure to keep routing resilient.

## Tools, Memory, and Planning
- Tooling is externalized: proxy passes through tool-calling payloads rather than implementing agent logic itself.
- Redaction acts as a safety layer, ensuring secrets do not leak to providers; analytics/telemetry provide operational feedback loops.
- Planning/agent behavior is delegated to downstream providers or client-side orchestration; Superagent positions itself as an **infrastructure layer** rather than a runtime.

## Engineering Observations
- Production-oriented concerns (redaction, telemetry, caching, multitenancy) are first-class, contrasting with research-heavy runtimes.
- Node design keeps surface area small; reliance on environment variables and YAML/APIs makes deployments flexible but requires careful config hygiene.
- SDK + CLI story is strong, providing developer ergonomics even though core agent logic lives elsewhere.
