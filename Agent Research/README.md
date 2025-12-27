# Agent Research

This workspace captures a code-first survey of high-quality AI Agent implementations. Repositories were cloned into `Agent Research/repos` (ignored from version control) and reviewed directly from source. Structured notes live in `Agent Research/notes`.

## Scope

- **Research focus:** engineering patterns behind AI Agent runtimes (architecture, execution flow, tool/memory handling, language choices).
- **Method:** shallow clones (`--depth 1`) of active, starred, and well-documented projects, followed by source-level inspection of core runtime/modules instead of relying solely on README material.
- **Projects reviewed:**
  - `langchain-ai/langgraph` (Python graph-based agent runtime)
  - `microsoft/autogen` (Python typed multi-agent runtime)
  - `openai/swarm` (Python lightweight agent orchestrator)
  - `gptscript-ai/gptscript` (Go DSL/runtime for agentic tool graphs)
  - `superagent-ai/superagent` (TypeScript/Node proxy + SDK for hosted agents)

## Files

- `notes/*.md` — project-level research notes (architecture, execution, tool/memory design, engineering observations).
- `overview.md` — cross-project comparison, language trade-offs, and design takeaways.

All cloned repositories remain under `repos/` (ignored via `.gitignore`) to keep this repo light while preserving source-backed analysis.
