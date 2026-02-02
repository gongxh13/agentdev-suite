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

### For Claude Code Users

1. Install via Claude Code plugin marketplace:
   ```bash
   claude plugins install agentdev-suite
   ```

2. Or manually install from source:
   ```bash
   git clone https://github.com/your-username/agentdev-suite.git
   cd agentdev-suite
   claude plugins link .
   ```

## Quick Start

```bash
# Initialize a new agent development project
claude agentdev init my-project

# Analyze requirements
claude agentdev analyze requirements.txt

# Generate code with agents
claude agentdev generate component

# Run tests with testing agents
claude agentdev test
```

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

## License

MIT License - see LICENSE file for details