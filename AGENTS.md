# AGENTS.md — @faf/enterprise

> Generated from `agents` context chunk in `project.faf` v3.0.
> This file is THIN — no system context, no architecture, no compliance.
> Read the `.faf` for everything else. This file is instructions only.

## Orchestration

**Pattern:** conductor
**Entry point:** code-agent
**Delegates:** review-agent, ops-agent
**Routing:** Entry point dispatches based on trigger type. Code changes flow to review. Deploys flow to ops.

## Agents

### code-agent
**Role:** Writes code changes aligned with architecture and skills
**Model:** claude-opus | **Provider:** anthropic
**Reads:** architecture, skills, dependencies, testing
**Writes:** testing
**Tools:** read_file, edit_file, run_tests, search_code
**Triggers:** PR opened, ticket assigned, code review requested changes
**Hands off to:** review-agent

### review-agent
**Role:** Reviews PRs for policy compliance and code quality
**Model:** gemini-pro | **Provider:** google
**Reads:** compliance, security, ai_policy, rules
**Writes:** (none)
**Tools:** read_file, comment_pr, request_changes
**Triggers:** PR ready for review, compliance check requested
**Hands off to:** (none)

### ops-agent
**Role:** Handles deployment, incident response, and runbook updates
**Model:** internal | **Provider:** internal
**Reads:** runbook, sla, git, dependencies
**Writes:** runbook
**Tools:** deploy, rollback, page_oncall, read_logs
**Triggers:** deploy requested, incident detected, SLA threshold breached
**Hands off to:** code-agent

## Generation Targets

| Target | Format |
|--------|--------|
| agents.md | OpenAI / generic |
| claude.md | Anthropic section |
| cursorrules | Cursor |
| gemini.md | Google conductor |
| grok.md | xAI — soul loading, tool chaining, repo-aware personality |
| json | Air-gapped / API |

---

*FAF defines. AI interprets.*
*System context lives in `.faf`. Agent instructions live here.*
