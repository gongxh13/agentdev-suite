# AgentDev Suite

A comprehensive agent development suite for Claude Code that covers the full software development lifecycle with intelligent agent collaboration.

## Overview

AgentDev Suite provides a complete set of tools and workflows for software development using intelligent agents. It integrates requirement analysis, development, testing, and deployment into a cohesive agent-driven workflow.

## Features

- **Requirement Analysis Agents**: AI-powered analysis and specification extraction
- **Development Agents**: Code generation, refactoring, and optimization
- **Testing Agents**: Automated test generation, execution, and validation
- **Collaboration Agents**: Multi-agent coordination and knowledge sharing
- **Lifecycle Management**: End-to-end development process automation

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

1. **Start a new agent development session**:
   ```
   /agent-dev I need to develop a user management system, please help me analyze requirements
   ```

2. **Generate code from specifications**:
   ```
   /agent-dev Generate code for user registration functionality based on the following specifications: [specification description]
   ```

3. **Create tests for existing code**:
   ```
   /agent-dev Generate test cases for this user login function: [code snippet]
   ```

4. **Review code quality**:
   ```
   /agent-dev Please review the quality of this code and provide improvement suggestions: [code snippet]
   ```

### Complete Workflow Example

```
/agent-dev I need to develop a REST API service with user registration, login, and profile management features. Please help me with a complete development workflow.
```

The agent will guide you through:
- Requirement analysis and specification
- Architecture design
- Code generation
- Test creation
- Code review
- Deployment planning

## Project Structure

```
agentdev-suite/
├── .claude-plugin/     # Claude plugin configuration
├── agents/            # Agent implementations
├── skills/           # Development skills and workflows
├── lib/              # Core libraries and utilities
├── commands/         # CLI commands
├── docs/             # Documentation
├── hooks/            # System hooks
├── tests/            # Test suites
├── .codex/           # Codex platform configuration
└── .opencode/        # OpenCode platform configuration
```

## Available Agents

- **RequirementAnalyzer**: Extracts and analyzes software requirements
- **CodeGenerator**: Generates code based on specifications
- **TestEngineer**: Creates and executes test cases
- **ReviewAgent**: Performs code reviews and quality checks
- **DeploymentAgent**: Handles deployment and configuration

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