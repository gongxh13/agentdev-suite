# AgentDev Suite

一个全面的Claude Code智能体开发套件，覆盖智能体协作的完整软件开发生命周期。

## 概述

AgentDev Suite提供了一套完整的工具和工作流，用于使用智能体进行软件开发。它将需求分析、开发、测试和部署集成到一个统一的智能体驱动工作流中。

## 功能特性

- **需求分析智能体**: AI驱动的分析和规格提取
- **开发智能体**: 代码生成、重构和优化
- **测试智能体**: 自动化测试生成、执行和验证
- **协作智能体**: 多智能体协调和知识共享
- **生命周期管理**: 端到端开发过程自动化

## 安装

### 方法1：通过市场安装（推荐）

1. 首先添加AgentDev Suite市场：
   ```bash
   /plugin marketplace add https://github.com/gongxh13/agentdev-suite
   ```

2. 然后从市场安装插件：
   ```bash
   /plugin install agentdev-suite@agentdev-suite-dev
   ```

### 方法2：直接从GitHub安装

```bash
/plugin install https://github.com/gongxh13/agentdev-suite
```

### 卸载

卸载插件：
```bash
/plugin uninstall agentdev-suite
```

移除市场：
```bash
/plugin marketplace remove agentdev-suite-dev
```

## 快速开始

插件安装后，你可以在Claude中使用`/agent-dev`命令访问智能体开发功能：

### 基本用法

1. **开始一个新的智能体开发会话**：
   ```
   /agent-dev 我需要开发一个用户管理系统，请帮我分析需求
   ```

2. **根据规格生成代码**：
   ```
   /agent-dev 根据以下规格生成用户注册功能的代码：[规格描述]
   ```

3. **为现有代码创建测试**：
   ```
   /agent-dev 为这个用户登录函数生成测试用例：[代码片段]
   ```

4. **审查代码质量**：
   ```
   /agent-dev 请审查这段代码的质量并提出改进建议：[代码片段]
   ```

### 完整工作流示例

```
/agent-dev 我需要开发一个REST API服务，包含用户注册、登录和资料管理功能。请帮我进行完整的开发工作流程。
```

智能体将引导你完成：
- 需求分析和规格制定
- 架构设计
- 代码生成
- 测试创建
- 代码审查
- 部署规划

## 项目结构

```
agentdev-suite/
├── .claude-plugin/     # Claude插件配置
├── agents/            # 智能体实现
├── skills/           # 开发技能和工作流
├── lib/              # 核心库和工具
├── commands/         # CLI命令
├── docs/             # 文档
├── hooks/            # 系统钩子
├── tests/            # 测试套件
├── .codex/           # Codex平台配置
└── .opencode/        # OpenCode平台配置
```

## 可用智能体

- **RequirementAnalyzer**: 提取和分析软件需求
- **CodeGenerator**: 根据规格生成代码
- **TestEngineer**: 创建和执行测试用例
- **ReviewAgent**: 执行自动化代码审查和质量检查
- **DeploymentAgent**: 处理部署规划和配置管理

## 开发贡献

为AgentDev Suite做贡献：

1. Fork仓库
2. 创建功能分支
3. 进行更改
4. 提交拉取请求

## 许可证

MIT许可证 - 详情见LICENSE文件