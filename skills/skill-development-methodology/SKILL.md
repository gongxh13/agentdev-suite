---
name: skill-development-methodology
description: Use when developing new skill-based projects or extending existing skill ecosystems - provides comprehensive methodology for skill project development based on analysis of everything-claude-code and superpowers projects. Covers skill design principles, project structure, development workflow, multi-platform support, testing, and deployment.
---

# Skill Development Methodology

This skill provides a comprehensive methodology for developing skill-based projects, based on analysis of successful skill ecosystems. Use this when creating new skill projects, extending existing skill ecosystems, or learning skill development best practices.

## Overview

Skill-based projects extend AI capabilities through modular, self-contained packages that provide specialized knowledge, workflows, and tools. Unlike traditional software projects, skill projects focus on guiding AI behavior rather than writing executable code.

## Core Principles

### 1. Progressive Disclosure Design
- **Level 1: Metadata** (name + description) - Always in context (~100 words)
- **Level 2: SKILL.md body** - When skill triggers (<5k words)
- **Level 3: Bundled resources** - As needed by Claude (unlimited, executed without reading into context)

### 2. Concise is Key
The context window is a shared resource. Only add information Claude doesn't already have. Challenge each piece: "Does Claude really need this explanation?"

### 3. Appropriate Degrees of Freedom
- **High freedom**: Text-based instructions for creative tasks
- **Medium freedom**: Pseudocode or parameterized scripts
- **Low freedom**: Specific scripts for fragile, error-prone operations

### 4. Separation of Concerns
- **SKILL.md**: Core workflow and essential guidance
- **references/**: Detailed documentation loaded only when needed
- **scripts/**: Executable code for deterministic tasks
- **assets/**: Output templates and resources

### 5. Skill vs Agent Architecture Decision Framework

Based on analysis of everything-claude-code and official Claude Code documentation, this framework guides architectural decisions for skill-based projects:

#### Understanding Claude Code Components
- **Skill**: User-invocable functionality with SKILL.md and supporting files. Defines "what" the AI should do.
- **Agent (Subagent)**: Specialized execution environment with custom system prompt, tools, and model. Defines "where/how" the AI should execute.
- **context:fork**: Skill frontmatter field that runs skill in isolated subagent context.

#### Key Decision Principles

**When to design as Skill:**
1. **User workflow guidance**: Multi-step processes that guide users
2. **Coordination logic**: Routing, sequencing, or orchestrating multiple components
3. **Direct user interaction**: Skills invoked with `/command` syntax
4. **Knowledge reference**: Domain expertise, conventions, patterns
5. **Lightweight operations**: Read-only or minimal file operations

**When to use context:fork in Skill:**
1. **File-intensive operations**: Creating/modifying many files (project scaffolding, code generation)
2. **Performance isolation**: Prevent verbose output from polluting main context
3. **Error containment**: Isolate potentially failing operations
4. **Specialized execution**: Need specific agent tools or model

**When to create dedicated Agent:**
1. **Specialized execution environment**: Unique tool restrictions or model requirements
2. **Reusable coordination layer**: Multiple skills share same execution environment
3. **Persistent memory needs**: Cross-session learning capabilities
4. **Complex permission model**: Fine-grained tool access control

#### Architecture Patterns

**Pattern 1: Skill as Coordinator, Agent as Executor**
```
skill-coordination (user entry)
    ├── context:fork → agent-specialized (file operations)
    ├── context:fork → agent-specialized (data processing)
    └── inline execution (lightweight tasks)
```

**Pattern 2: Skill Chain (No context:fork restrictions)**
```
skill-entry (user input)
    ↓ Skill invocation
skill-processor (coordination)
    ↓ Skill invocation
skill-presenter (output)
```

**Pattern 3: Hybrid Pattern with Gateway**
```
skill-gateway (analyzes task)
    ├── If file-intensive → context:fork → agent-executor
    └── If lightweight → skill-inline-processor
```

#### Avoiding context:fork Limitations

The key limitation: **Skills with `context:fork` cannot directly invoke other skills**. Solutions:

1. **Gateway pattern**: Skill without fork analyzes and delegates to forked skill
2. **Agent coordination**: Create agent that can invoke multiple skills
3. **Workflow restructuring**: Move coordination logic to non-forked skill

#### Design Decision Flowchart

```
Analyze Component Requirement
    ↓
Need file operations? → Yes → Consider context:fork or Agent
    ↓ No
Need to coordinate other components? → Yes → Design as Skill (no fork)
    ↓ No
Direct user interaction? → Yes → Design as Skill
    ↓ No
Specialized execution environment? → Yes → Design as Agent
    ↓ No
Design as Skill with appropriate context setting
```

#### Example: PDF Processing System

**Skill layer (pdf-processor-coordination):**
```yaml
---
name: pdf-processor
description: Coordinate PDF processing operations
---

# PDF Processing Coordinator
Based on user request, delegate to appropriate processor:

- **Rotate/merge operations** (file-intensive): `Task: pdf-operations-agent`
- **Text extraction** (lightweight): Process inline
- **Batch processing** (performance): `context:fork → batch-processor`
```

**Agent layer (pdf-operations-agent):**
```markdown
---
name: pdf-operations-agent
description: Specialized PDF file operations
tools: ["Read", "Write", "Bash"]
model: haiku
---

# PDF Operations Specialist
Execute file-intensive PDF operations with error handling.
```

## Project Structure

### Standard Skill Project Layout
```
skill-project/
├── .claude-plugin/          # Claude Code configuration
│   ├── plugin.json         # Plugin metadata
│   └── marketplace.json    # Marketplace listing
├── .codex/                 # Codex platform configuration
│   └── INSTALL.md         # Codex installation instructions
├── .opencode/             # OpenCode platform configuration
│   └── INSTALL.md         # OpenCode installation instructions
├── skills/                # Shared skill library
│   ├── using-project/     # Entry point skill
│   ├── skill-creator/     # Skill creation guidance
│   ├── skill-project-scaffolder/ # Project scaffolding
│   └── [domain-skills]/   # Domain-specific skills
├── lib/                   # Shared utilities
├── templates/             # Project templates
└── tests/                # Test suites
```

### Individual Skill Structure
```
skill-name/
├── SKILL.md              # Required: YAML frontmatter + markdown instructions
├── scripts/              # Optional: Executable code (Python/Bash/etc.)
├── references/           # Optional: Detailed documentation
└── assets/              # Optional: Output templates and resources
```

## Skill Definition Guidelines

### Frontmatter Requirements
```yaml
---
name: skill-name
description: Use when [specific trigger conditions] - [clear skill purpose]. Must include all "when to use" information here.
---
```

### Description Best Practices
- Start with "Use when" to clearly define trigger conditions
- Include both what the skill does and specific contexts for use
- Be comprehensive - this is the primary triggering mechanism
- Keep under 200 words for optimal context usage

### Body Content Organization
1. **Overview**: Brief introduction to the skill's purpose
2. **Core Principles**: Foundational concepts and constraints
3. **Workflow**: Step-by-step guidance for using the skill
4. **Resources**: Description of bundled scripts, references, assets
5. **Examples**: Concrete usage scenarios

## Development Workflow

Skill development follows a structured 6-phase workflow aligned with `skill-development-coordination`. Each phase uses specialized skills designed specifically for skill-based projects.

### Phase 1: Skill Requirements Analysis
**Purpose**: Define skill ecosystem strategy, platform requirements, and skill specifications
**Recommended Skills**:
- `skill-requirements-analyst` (specialized for skill development)
- Focus on: skill ecosystem vision, platform requirements, skill relationships, progressive disclosure needs
**Outputs**: `docs/01_product_strategy/` and `docs/02_product_backlog/` with skill-specific documents

### Phase 2: Skill Architecture Design
**Purpose**: Design skill architecture, platform configurations, and progressive disclosure strategies
**Recommended Skills**:
- `skill-architect` (specialized for skill architecture)
- Focus on: multi-platform configurations, skill structure patterns, progressive disclosure design, testing strategy
**Outputs**: `docs/03_system_design/` with skill architecture documents

### Phase 3: Iterative Skill Development
**Purpose**: Create individual skills within the project
**Recommended Agent**:
- `skill-development-orchestrator` (coordinates skill creation and scaffolding operations)
- Focus on: Coordinating `skill-creator` for individual skills, `skill-project-scaffolder` for project structure, managing skill creation sequence
**Outputs**: Individual skills in `skills/` directory with proper structure, coordinated implementation

### Phase 4: Integration & Platform Testing
**Purpose**: Test complete skill ecosystem across target platforms
**Recommended Skills**:
- `skill-tester` (specialized for skill testing)
- Focus on: skill structure validation, platform compatibility testing, progressive disclosure verification, guidance quality assessment
**Outputs**: Test reports in `docs/05_qa_reports/`

### Phase 5: Packaging & Distribution
**Purpose**: Package skills and prepare for multi-platform distribution
**Recommended Skills**:
- `managing-git-workflows` (for version control)
- Skill packaging tools (package_skill.py)
- Focus on: multi-platform configuration, plugin marketplace preparation, distribution strategy
**Outputs**: Packaged skills ready for distribution

### Phase 6: Maintenance & Evolution
**Purpose**: Maintain and evolve skill ecosystem over time
**Recommended Skills**:
- Combination of above skills based on maintenance needs
- Focus on: skill updates, platform compatibility maintenance, progressive disclosure improvements
**Outputs**: Updated skill versions and documentation

## Multi-Platform Support

### Platform-Specific Configuration

#### Claude Code (`.claude-plugin/`)
```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "description": "Plugin description",
  "skills": ["./skills"],
  "commands": ["./commands"]
}
```

#### Codex (`.codex/`)
- `INSTALL.md`: Bootstrap instructions
- Agent registration in `~/.codex/AGENTS.md`

#### OpenCode (`.opencode/`)
- `INSTALL.md`: Installation instructions
- Plugin JavaScript files

### Shared Skill Library
- All platforms share the same `skills/` directory
- Platform-specific adaptations handled through installation scripts
- Consistent skill file format across platforms

## Testing and Quality Assurance

### Skill Validation
- **Structure check**: Verify required files and directories
- **Metadata validation**: Ensure proper frontmatter format
- **Content quality**: Check for clarity and completeness
- **Platform compatibility**: Test across target platforms

### Functional Testing
- **Workflow testing**: Verify skill triggers and guidance
- **Resource testing**: Validate scripts and references
- **Integration testing**: Test skill combinations
- **User scenario testing**: Real-world usage simulations

### Performance Considerations
- **Context efficiency**: Minimize token usage
- **Load time**: Optimize progressive disclosure
- **Platform performance**: Ensure smooth operation across platforms

## Deployment and Distribution

### Packaging
```bash
# Package skill for distribution
scripts/package_skill.py <skill-directory>

# Creates .skill file with:
# - Validated skill structure
# - All bundled resources
# - Proper metadata
```

### Distribution Channels
1. **Git repositories**: Direct installation from GitHub
2. **Plugin marketplaces**: Published listings
3. **Local development**: Source code installation
4. **Skill sharing**: .skill file exchange

### Version Management
- Semantic versioning for skill updates
- Backward compatibility considerations
- Migration guides for breaking changes

## Best Practices from Example Projects

### From everything-claude-code
- **Agent specialization**: Dedicated agents for specific tasks
- **Skill relationships**: Clear dependencies and combinations
- **Workflow coordination**: Multi-step processes with agent handoffs
- **Quality gates**: Validation at each development phase

### From superpowers
- **Skill discovery**: Clear entry points and navigation
- **Template libraries**: Reusable patterns and examples
- **Testing infrastructure**: Comprehensive validation suites
- **Documentation standards**: Consistent formatting and structure

## Common Pitfalls to Avoid

### ❌ Over-engineering
- Creating unnecessary abstraction layers
- Adding features without clear user needs
- Complex dependency graphs

### ❌ Context Bloat
- Including obvious information
- Duplicating content across files
- Failing to use progressive disclosure

### ❌ Platform Lock-in
- Assuming single-platform usage
- Ignoring platform-specific requirements
- Hardcoding platform assumptions

### ❌ Poor Documentation
- Vague skill descriptions
- Missing usage examples
- Incomplete reference documentation

## Getting Started

### Quick Start Template
```bash
# 1. Create project structure
Skill: skill-project-scaffolder

# 2. Add your first skill
Skill: skill-creator

# 3. Test and validate
./scripts/validate_skill.sh <skill-directory>

# 4. Package for distribution
./scripts/package_skill.py <skill-directory>
```

### Next Steps
1. **Analyze your use case**: What problems will skills solve?
2. **Design skill relationships**: How will skills work together?
3. **Implement core skills**: Start with entry points and foundational skills
4. **Test across platforms**: Verify compatibility with target platforms
5. **Iterate based on feedback**: Refine based on real usage

## Resources and References

### Essential Tools
- `skill-creator`: Guided skill creation
- `skill-project-scaffolder`: Multi-platform project setup
- Skill validation scripts
- Packaging utilities

### Reference Materials
- Claude's official skill authoring best practices
- Platform-specific documentation
- Example projects (everything-claude-code, superpowers)

### Community Resources
- Skill sharing platforms
- Development forums
- Contribution guidelines