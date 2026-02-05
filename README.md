# AgentDev Suite

A comprehensive multi-platform agent development suite for Claude Code, OpenCode, and Codex that provides intelligent agent collaboration across the full software development lifecycle.

## Overview

**AgentDev Suite** is a revolutionary agent-driven development framework that enables structured software development using specialized AI agents. It features a unique dual-paradigm coordination system that automatically routes development tasks to the appropriate workflow based on project context:

- **Traditional Software Development**: Executable code, APIs, services, libraries
- **Skill-Based Development**: AI skills, guidance packages, plugin projects

### Key Innovations

- **Paradigm-Based Routing**: Automatically detects project type and routes to specialized coordination
- **Multi-Platform Support**: Unified skill library for Claude Code, OpenCode, and Codex
- **Progressive Disclosure**: Efficient context management through three-level loading system
- **Agent Role Specialization**: 8 specialized agent roles for different development phases
- **Structured Collaboration**: Directory-based workspace for multi-agent coordination

## Architecture

AgentDev Suite follows a three-layer coordination architecture:

```
┌─────────────────────────────────────────────┐
│          Paradigm Coordination Layer        │
│  (coordinating-agent-development)          │
│  • Routes based on project indicators      │
│  • Traditional vs Skill-based detection    │
└────────────────┬────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼─────┐             ┌─────▼─────┐
│Traditional│             │ Skill-Based │
│Coordination│             │ Coordination │
│ Workflow  │             │  Workflow   │
└───┬──────┘             └─────┬──────┘
    │                         │
    └────────────┬────────────┘
                 │
       ┌─────────▼─────────┐
       │  Specialized      │
       │  Agent Roles      │
       │  (8 agents)       │
       └───────────────────┘
```

### 1. Paradigm Coordination Layer

**`coordinating-agent-development`** - The intelligent router that analyzes project context:
- **Project Structure Indicators**: `src/`, `tests/`, `package.json` (Traditional) vs `skills/`, `.claude-plugin/`, SKILL.md files (Skill-based)
- **Request Keywords**: "build an app", "create API" (Traditional) vs "create skill", "skill project" (Skill-based)
- **Decision Rules**: Clear indicators → corresponding coordination; Mixed → analyze focus; None → ask user

### 2. Specialized Coordination Workflows

#### Traditional Software Development (`traditional-development-coordination`)
Complete 6-phase workflow for executable software:
1. **Product Definition** (Product Manager)
2. **Requirement Decomposition** (Product Owner)
3. **Architecture Design** (Software Architect)
4. **Iterative Development** (Developer & Tester)
5. **Final Integration Testing**
6. **Delivery & Version Control**

#### Skill-Based Development (`skill-development-coordination`)
Structured workflow for AI skill projects:
1. **Project Strategy & Scope** (Skill Requirements Analyst)
2. **Skill Requirements & Design** (Skill Requirements Analyst)
3. **Skill Architecture & Platform Design** (Skill Architect)
4. **Iterative Skill Development** (Skill Creator, Skill Project Scaffolder)
5. **Integration & Platform Testing** (Skill Tester)
6. **Packaging & Distribution**

### 3. Specialized Agent Roles

#### Traditional Development Agents
- **`product-manager`**: Product strategy and high-level requirements analysis
- **`product-owner`**: Backlog management and user story decomposition
- **`software-architect`**: System architecture and technical design
- **`software-developer`**: Code implementation and unit testing
- **`software-tester`**: Quality verification and bug reporting

#### Skill Development Agents
- **`skill-requirements-analyst`**: Skill ecosystem strategy and requirements analysis
- **`skill-architect`**: Skill architecture and multi-platform configuration design
- **`skill-tester`**: Skill structure validation and platform compatibility testing

### 4. Core Development Tools

- **`skill-creator`**: Guided skill creation following Claude's best practices
- **`skill-project-scaffolder`**: Multi-platform project structure generation
- **`skill-development-methodology`**: Skill design principles and patterns
- **`traditional-development-methodology`**: Traditional development best practices
- **`managing-git-workflows`**: Version control with semantic commit guidelines

## Multi-Platform Support

AgentDev Suite supports three major AI development platforms with a unified skill library:

| Platform | Configuration | Installation Method |
|----------|---------------|---------------------|
| **Claude Code** | `.claude-plugin/` | Plugin system with marketplace |
| **OpenCode** | `.opencode/` | Plugin script with symlinks |
| **Codex** | `.codex/` | Bootstrap script integration |

All platforms share the same `skills/` directory, ensuring consistent behavior across environments.

## Installation

**Note:** Installation differs by platform and user type (AI assistant vs human).

### For AI Assistants

AI assistants can directly fetch installation instructions:

#### Codex
Tell Codex:
```
Fetch and follow instructions from https://raw.githubusercontent.com/gongxh13/agentdev-suite/refs/heads/main/.codex/INSTALL.md
```

#### OpenCode
Tell OpenCode:
```
Fetch and follow instructions from https://raw.githubusercontent.com/gongxh13/agentdev-suite/refs/heads/main/.opencode/INSTALL.md
```

#### Claude Code
Tell Claude Code:
```
Fetch and follow instructions from https://raw.githubusercontent.com/gongxh13/agentdev-suite/refs/heads/main/.claude-plugin/INSTALL.md
```

### For Human Users

#### Remote Installation (from Git repository)
Currently only Claude Code supports remote installation from Git repositories:

##### Claude Code

**Command Line:**
```bash
# Add Git repository as a marketplace
claude plugin marketplace add https://github.com/gongxh13/agentdev-suite.git
# Install the plugin from the added marketplace
claude plugin install agentdev-suite
```

**In Claude Code (slash commands):**
First, register the marketplace from the Git repository:
```
/plugin marketplace add https://github.com/gongxh13/agentdev-suite.git
```

Then install the plugin from this marketplace. Check the marketplace name with `/plugin marketplace list`:
```
/plugin install agentdev-suite@<marketplace-name>
```

*Example (if marketplace is named "agentdev-suite-marketplace"):*
```
/plugin install agentdev-suite@agentdev-suite-marketplace
```

#### Source Code Installation
Install from local source code:

##### Claude Code

**Command Line:**
```bash
# Add local directory as a marketplace
claude plugin marketplace add ./
# Install the plugin from the local marketplace
claude plugin install agentdev-suite
```

**In Claude Code (slash commands):**
First, register the local directory as a marketplace (with a name):
```
/plugin marketplace add ./ --name agentdev-suite-dev
```

Then install the plugin from this marketplace:
```
/plugin install agentdev-suite@agentdev-suite-dev
```

*If you don't specify a name, check the marketplace name with `/plugin marketplace list` and use `@<marketplace-name>` suffix.*

##### Codex
```bash
cp -r . ~/.codex/agentdev-suite
# Update ~/.codex/AGENTS.md with:
# ## agentdev-suite
# <EXTREMELY_IMPORTANT>
# You have access to agentdev-suite. RIGHT NOW run: ~/.codex/agentdev-suite/.codex/agentdev-suite-codex bootstrap
# </EXTREMELY_IMPORTANT>
```

##### OpenCode
```bash
git clone https://github.com/gongxh13/agentdev-suite.git ~/.config/opencode/agentdev-suite
mkdir -p ~/.config/opencode/plugins
ln -s ~/.config/opencode/agentdev-suite/.opencode/plugins/agentdev-suite.js ~/.config/opencode/plugins/agentdev-suite.js
mkdir -p ~/.config/opencode/skills
ln -s ~/.config/opencode/agentdev-suite/skills ~/.config/opencode/skills/agentdev-suite
```

## Getting Started

### 1. Load the Core Discipline Skill

Once installed, use the `Skill` tool to load the mandatory discipline skill:

```bash
# In Claude Code conversation
Skill: using-agentdev-suite
```

This skill enforces the "1% rule": if there's even a 1% chance a skill might apply, you MUST invoke it. It provides access to all other skills in the library.

### 2. Use the `/agent-dev` Command

The `/agent-dev` command triggers the complete development coordination system:

#### Traditional Software Development Example
```
/agent-dev I need to develop a REST API service with user management including registration, authentication, and profile management
```

**Workflow:**
1. `coordinating-agent-development` detects traditional indicators (`src/`, `tests/`, "API", "service")
2. Routes to `traditional-development-coordination`
3. Coordinates 6-phase workflow with specialized agents:
   - Product Manager creates PRD in `docs/01_product_strategy/`
   - Product Owner decomposes into user stories in `docs/02_product_backlog/`
   - Software Architect designs system in `docs/03_system_design/`
   - Developer implements features incrementally in `src/`
   - Tester validates each feature in `docs/05_qa_reports/`
   - Final integration testing and git commit

#### Skill Project Development Example
```
/agent-dev Create a skill project for financial analysis workflows with support for multiple AI platforms
```

**Workflow:**
1. `coordinating-agent-development` detects skill indicators (`skills/`, "skill project", "multi-platform")
2. Routes to `skill-development-coordination`
3. Coordinates skill development workflow:
   - Skill Requirements Analyst defines skill ecosystem in `docs/01_product_strategy/`
   - Skill Architect designs multi-platform configuration in `docs/03_system_design/`
   - Skill Project Scaffolder creates project structure with `.claude-plugin/`, `.codex/`, `.opencode/`
   - Skill Creator develops individual skills following best practices
   - Skill Tester validates platform compatibility

## Project Structure

```
agentdev-suite/
├── .claude-plugin/          # Claude Code plugin configuration
├── .codex/                  # Codex platform configuration
├── .opencode/               # OpenCode platform configuration
├── agents/                  # Specialized agent role definitions (8 agents)
├── skills/                  # Unified skill library (core)
│   ├── using-agentdev-suite/          # Mandatory discipline skill
│   ├── coordinating-agent-development/ # Paradigm routing skill
│   ├── traditional-development-coordination/ # Traditional workflow
│   ├── skill-development-coordination/ # Skill project workflow
│   ├── skill-creator/                 # Skill creation guidance
│   ├── skill-project-scaffolder/      # Multi-platform scaffolding
│   ├── skill-development-methodology/ # Skill design principles
│   ├── traditional-development-methodology/ # Development patterns
│   └── managing-git-workflows/        # Version control
├── commands/               # CLI command definitions
│   └── dev.md             # /agent-dev command
├── lib/                   # Core utilities
│   ├── skills-core.js     # Skill management tools
│   └── utils.js           # General utilities
├── docs/                  # Documentation
│   ├── api/              # API documentation
│   ├── en/               # English documentation
│   └── zh/               # Chinese documentation
├── hooks/                 # System hooks
│   └── session-start.sh  # Session initialization
├── tests/                 # Test suites
│   ├── structure.test.js # Project structure validation
│   ├── platform-validation.js # Multi-platform compatibility
│   └── skill-triggering/ # Skill activation tests
├── package.json           # Project configuration
└── LICENSE               # MIT License
```

## Workspace Structure

The suite uses a standardized directory structure for agent collaboration:

```
docs/
├── 01_product_strategy/    # Product Manager workspace (PRD, roadmap, market analysis)
├── 02_product_backlog/     # Product Owner workspace (user stories, features, backlog)
├── 03_system_design/       # Architect workspace (architecture, API specs, schemas)
├── 04_development/         # Developer workspace (technical notes, setup guides)
└── 05_qa_reports/          # Tester workspace (test reports, bug tracker, validation)

src/                       # Source code implementation
tests/                     # Test files
scripts/                   # Utility scripts (for skill projects)
templates/                 # Project templates (for skill projects)
```

## Progressive Disclosure Design

AgentDev Suite implements efficient context management through progressive disclosure:

1. **Level 1: Metadata** (Always loaded)
   - Skill `name` and `description` in YAML frontmatter
   - Used for skill triggering decisions

2. **Level 2: SKILL.md Body** (Loaded when triggered)
   - Core instructions and workflow definitions
   - Limited to essential information

3. **Level 3: Bundled Resources** (Loaded as needed)
   - Reference files, detailed documentation, examples
   - Accessed via explicit references from SKILL.md

This approach minimizes token usage while providing comprehensive guidance when needed.

## Development Principles

### Skill Design Best Practices
- **Clear triggers**: Description starts with "Use when" specifying exact conditions
- **Appropriate freedom**: Match instruction specificity to task fragility
- **Resource organization**: Separate SKILL.md, references, scripts, assets
- **Progressive disclosure**: Keep SKILL.md concise, move details to references

### Traditional Development Best Practices
- **Agent-first development**: Leverage specialized agents for each phase
- **Lifecycle coverage**: Complete coverage from requirements to deployment
- **Collaborative intelligence**: Multiple agents work through standardized workspace
- **Quality assurance**: Automated validation and testing at every stage
- **Iterative development**: Incremental feature implementation to manage complexity

## Testing

The project includes comprehensive test suites:

- **Structure Testing**: Validates project directory structure and configuration files
- **Platform Validation**: Checks multi-platform configuration completeness
- **Skill Triggering**: Verifies skill activation logic and progressive disclosure
- **Integration Testing**: Ensures agent coordination workflows function correctly

Run tests with:
```bash
npm test
```

## Contributing

We welcome contributions to AgentDev Suite! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines
- Follow existing patterns and directory structure
- Maintain multi-platform compatibility
- Implement progressive disclosure for new skills
- Add comprehensive tests for new functionality
- Update documentation accordingly

## Multilingual Support

AgentDev Suite provides documentation in multiple languages:

- **English**: This document (primary)
- **中文 (Chinese)**: [docs/zh/README.md](docs/zh/README.md)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Claude's official [Skill Authoring Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- Built with multi-platform compatibility as a core design principle
- Developed through iterative refinement with real-world usage feedback

---

**AgentDev Suite** - Revolutionizing AI-assisted software development through intelligent agent coordination and structured workflows.