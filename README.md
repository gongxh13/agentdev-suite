# AgentDev Suite

A comprehensive agent development suite for Claude Code that covers the full software development lifecycle with intelligent agent collaboration.

## Overview

AgentDev Suite provides a complete set of tools and workflows for software development using intelligent agents. It integrates requirement analysis, development, testing, and deployment into a cohesive agent-driven workflow.

## Features

- **Team Role Coordination**: Product Manager, Product Owner, Architect, Developer, Tester role coordination
- **Structured Workflow**: 6-phase development process from requirements to delivery
- **Directory-Based Workspace**: Standardized workspace structure for agent collaboration
- **Iterative Development**: Incremental feature implementation with testing
- **Quality Assurance**: Automated validation and testing at every stage

## Installation

### Method 1: Install via Marketplace (Recommended)

1. First, add the AgentDev Suite marketplace:
   ```bash
   /plugin marketplace add https://github.com/gongxh13/agentdev-suite
   ```

2. Then install the plugin from the marketplace:
   ```bash
   /plugin install agentdev-suite@agentdev-suite-dev
   ```

### Method 2: Install directly from GitHub

```bash
/plugin install https://github.com/gongxh13/agentdev-suite
```

### Uninstallation

To uninstall the plugin:
```bash
/plugin uninstall agentdev-suite
```

To remove the marketplace:
```bash
/plugin marketplace remove agentdev-suite-dev
```

## Quick Start

Once the plugin is installed, you can use the `/agent-dev` command in Claude to access agent development capabilities:

### Basic Usage

1. **Start a complete software development project**:
   ```
   /agent-dev I need to develop a user management system with registration, login, and profile management
   ```
   This initiates the full 6-phase workflow with specialized agent coordination.

2. **Coordinate specific development phases**:
   ```
   /agent-dev We have requirements defined, please help with architecture design and implementation
   ```
   The agent will continue from the current phase based on existing workspace documents.

3. **Get help with iterative development**:
   ```
   /agent-dev I need to implement the authentication module from the backlog
   ```
   Focuses on specific feature implementation with developer-tester coordination.

4. **Manage version control and delivery**:
   ```
   /agent-dev The project is complete, please help with final testing and git commit
   ```
   Handles final integration testing and version control workflow.

### Complete Workflow Example

```
/agent-dev I need to develop a REST API service with user registration, login, and profile management features. Please coordinate the full development team.
```

The agent will coordinate the 6-phase workflow:

1. **Product Definition**: Product Manager analyzes requirements, creates PRD in `docs/01_product_strategy/`
2. **Requirement Decomposition**: Product Owner breaks down into user stories in `docs/02_product_backlog/`
3. **Architecture Design**: Software Architect creates technical design in `docs/03_system_design/`
4. **Iterative Development**: Developer and Tester implement features incrementally with testing
5. **Final Integration**: Comprehensive testing across all implemented features
6. **Delivery**: Version control with semantic commit messages using git-workflow

## Project Structure

```
agentdev-suite/
├── .claude-plugin/     # Claude plugin configuration
├── agents/            # Agent role implementations
├── skills/           # Development skills and workflows
│   ├── agent-dev/    # Main coordination skill (6-phase workflow)
│   ├── git-workflow/ # Version control skill
│   └── [role-skills] # Individual role skills (PM, PO, Architect, etc.)
├── commands/         # CLI commands (/agent-dev)
├── docs/             # Documentation
└── tests/            # Test suites
```

## Available Agent Roles

The `/agent-dev` command coordinates these specialized agent roles:

- **Product Manager**: Product strategy and high-level requirements analysis
- **Product Owner**: Backlog management and user story decomposition
- **Software Architect**: System architecture and technical design
- **Software Developer**: Code implementation and unit testing
- **Software Tester**: Quality verification and bug reporting
- **Git Workflow**: Version control with semantic commit guidelines

## Workspace Structure

The suite uses a standardized directory structure for agent collaboration:

```
docs/
├── 01_product_strategy/    # Product Manager workspace (PRD, roadmap)
├── 02_product_backlog/     # Product Owner workspace (user stories, backlog)
├── 03_system_design/       # Architect workspace (architecture, APIs, schemas)
├── 04_development/         # Developer workspace (technical notes, setup)
└── 05_qa_reports/          # Tester workspace (test reports, bug tracker)

src/                       # Source code implementation
tests/                     # Test files
```

## Development

To contribute to AgentDev Suite:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Multilingual Support

AgentDev Suite provides documentation in multiple languages:

- **English**: This document (primary)
- **中文 (Chinese)**: [docs/zh/README.md](docs/zh/README.md)

## License

MIT License - see LICENSE file for details