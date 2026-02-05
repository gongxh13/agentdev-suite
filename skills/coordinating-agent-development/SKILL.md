---
name: coordinating-agent-development
description: Routes development requests to appropriate paradigm (traditional vs skill-based) by analyzing project context and request keywords. Use when starting any software development project, feature implementation, or maintenance task to automatically select the right development workflow.
---

# Development Paradigm Coordination

Routes development requests based on project context and request keywords to the appropriate specialized coordination:

- **Traditional Software Development** (executable code, APIs, services, libraries) → `traditional-development-coordination`
- **Skill-Based Development** (AI skills, plugin projects, guidance packages) → `skill-development-coordination`

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
   - Clear skill indicators → `Skill: skill-development-coordination`
   - Clear traditional indicators → `Skill: traditional-development-coordination`
   - Mixed indicators → Analyze primary focus, default to traditional if uncertain
   - No clear indicators → Ask user: "Are you building executable software or creating AI skills?"
3. **Hybrid projects**: Route code components to `traditional-development-coordination` and skill components to `skill-development-coordination`. Coordinate integration as needed.

## Usage

### Automatic Routing
Use when starting any development task:
```
/agent-dev [development request]
```

### Manual Selection
If automatic routing fails:
- Traditional development: `Skill: traditional-development-coordination`
- Skill-based development: `Skill: skill-development-coordination`

## Notes
- Detailed workflows are in the specialized coordination skills
- Focus on correct routing, not implementation details