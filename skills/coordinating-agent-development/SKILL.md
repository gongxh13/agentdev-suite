---
name: coordinating-agent-development
description: Routes development requests to appropriate paradigm (traditional vs skill-based) by analyzing project context and request keywords. Use when starting any software development project, feature implementation, or maintenance task to automatically select the right development workflow.
---

# Development Paradigm Coordination

Routes development requests based on project context and request keywords to the appropriate specialized coordination:

- **Traditional Software Development** (executable code, APIs, services, libraries) → `agentdev-suite:traditional-development-coordination`
- **Skill-Based Development** (AI skills, plugin projects, guidance packages) → `agentdev-suite:skill-development-coordination`

## Routing Logic

### Indicators

**Project Structure**:
- **Traditional**: `src/`, `tests/`, `package.json`, `pom.xml`, `build.gradle`, `go.mod`, `requirements.txt`
- **Skill-based**: `skills/`, `.claude-plugin/`, `.codex/`, `.opencode/`, SKILL.md files

**Request Keywords**:
- **Traditional**: "build an app", "create API", "develop service", "write code", "database", "backend", "deploy"
- **Skill-based**: "create skill", "skill project", "AI guidance", "plugin development", "SKILL.md", "progressive disclosure", "multi-platform"

### Decision Process

1. **Check indicators**: Examine project structure and request keywords
2. **Apply rules**:
   - Clear skill indicators → `Skill: agentdev-suite:skill-development-coordination`
   - Clear traditional indicators → `Skill: agentdev-suite:traditional-development-coordination`
   - Mixed indicators → Analyze primary focus, default to traditional if uncertain
   - No clear indicators → Ask user: "Are you building executable software or creating AI skills?"
3. **Hybrid projects**: Route code components to `agentdev-suite:traditional-development-coordination` and skill components to `agentdev-suite:skill-development-coordination`. Coordinate integration as needed.

## Usage

### Starting Development Coordination
This skill is automatically triggered when you:
1. First load the `using-agentdev-suite` discipline skill
2. Describe a development request in your conversation
3. The `using-agentdev-suite` skill enforces invocation of relevant skills based on the 1% rule

### Manual Invocation
If automatic routing doesn't occur (e.g., in specific development contexts):
- Traditional development: `Skill: agentdev-suite:traditional-development-coordination`
- Skill-based development: `Skill: agentdev-suite:skill-development-coordination`

### Example Workflow
```
User: "I need to build a REST API for user management"
agentdev-suite:using-agentdev-suite: Enforces skill discipline
agentdev-suite:coordinating-agent-development: Analyzes request, detects traditional indicators
agentdev-suite:traditional-development-coordination: Routes to, performs task analysis and dynamic orchestration
```

## Notes
- Detailed workflows with intelligent task analysis are in the specialized coordination skills
- Coordination layers perform dynamic agent orchestration based on task type analysis
- Focus on correct routing, not implementation details

## Enhanced Architecture

This skill provides **first-level routing** (paradigm distinction). Once routed, the specialized coordination skills (`traditional-development-coordination` and `skill-development-coordination`) perform:

1. **Intelligent Task Analysis**: Parse user requests to identify specific task types
2. **Dynamic Agent Orchestration**: Select optimal agent sequence based on task type
3. **Context-Aware Adaptation**: Adjust workflow intensity based on project maturity
4. **Smart Workflow Selection**: Choose between full workflows or targeted agent combinations

This two-level architecture ensures:
- **Efficient routing** at paradigm level
- **Intelligent coordination** at task execution level
- **Minimal overhead** for simple tasks
- **Comprehensive coverage** for complex projects