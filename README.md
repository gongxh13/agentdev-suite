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

### Method 3: Install from local source

```bash
git clone https://github.com/gongxh13/agentdev-suite.git
cd agentdev-suite
/plugin link .
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
   /agent-dev 我需要开发一个用户管理系统，请帮我分析需求
   ```

2. **Generate code from specifications**:
   ```
   /agent-dev 根据以下规格生成用户注册功能的代码：[规格描述]
   ```

3. **Create tests for existing code**:
   ```
   /agent-dev 为这个用户登录函数生成测试用例：[代码片段]
   ```

4. **Review code quality**:
   ```
   /agent-dev 请审查这段代码的质量并提出改进建议：[代码片段]
   ```

### Complete Workflow Example

```
/agent-dev 我需要开发一个REST API服务，包含用户注册、登录和资料管理功能。请帮我进行完整的开发工作流程。
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

## License

MIT License - see LICENSE file for details