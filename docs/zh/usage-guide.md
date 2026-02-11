# 用户使用指南

本指南详细介绍如何使用 AgentDev Suite 进行实际项目开发，包括feature认领、开发流程、代码提交等完整工作流。

## 快速开始

### 1. 通过 `/using-agentdev-suite` 启动开发协调

要开始使用 AgentDev Suite 进行开发，请在对话开头使用 `/using-agentdev-suite` 前缀，以自动将您的请求路由到适当的协调工作流。

#### 传统软件开发示例
在您的 Claude Code 对话中，以 `/using-agentdev-suite` 前缀开始：
```
/using-agentdev-suite 我需要开发一个包含用户管理功能的REST API服务，包括注册、认证和资料管理
```

**工作流：**
1. `/using-agentdev-suite` 前缀触发核心协调技能
2. `coordinating-agent-development` 自动激活
3. `coordinating-agent-development` 检测传统指示器（`src/`、`tests/`、"API"、"service"）
4. 路由到 `traditional-development-coordination`
5. 协调具备动态智能体编排的智能工作流：
   - 分析任务类型（完整项目开发）
   - 选择最优智能体序列：PM → PO → Architect → Developer → Tester
   - 根据项目成熟度执行上下文适配的工作流

#### 技能项目开发示例
以 `/using-agentdev-suite` 前缀开始：
```
/using-agentdev-suite 创建一个用于财务分析工作流的技能项目，支持多个AI平台
```

**工作流：**
1. `/using-agentdev-suite` 前缀触发核心协调技能
2. `coordinating-agent-development` 自动激活
3. `coordinating-agent-development` 检测技能指示器（`skills/`、"skill project"、"multi-platform"）
4. 路由到 `skill-development-coordination`
5. 协调智能技能开发工作流：
   - 分析技能任务类型（完整技能项目）
   - 选择最优智能体/技能序列：Skill Requirements Analyst → Skill Architect → Skill Project Scaffolder → Skill Creator → Skill Tester
   - 执行具备渐进式披露优化的平台感知协调

## Feature开发工作流

AgentDev Suite 提供标准化的feature开发流程，确保代码质量和团队协作效率。此工作流集成了 **feature-management** 技能，以防止重复工作并自动化 PR 创建。

### 1. 概述

Feature通常存储在项目的 `features/` 目录中。每个feature都有自己的目录，其中包含一个 `feature.json` 文件，该文件包含有关feature状态、认领人、文档链接等的元数据。

完整的feature生命周期包括：
- **feature认领**：预留feature进行开发，防止重复工作
- **feature实现**：使用协调的智能体工作流进行开发
- **feature提交**：提交已完成的工作并创建拉取请求

### 2. feature认领流程

在开始开发之前，您应该认领feature以确保没有其他人正在处理它。

#### 使用 `/using-agentdev-suite` 进行feature认领
在对话开始时使用：
```
/using-agentdev-suite 帮我认领 feat-xxx
```

或使用自然语言：
```
/using-agentdev-suite 我想要开发用户认证系统
```

**执行过程：**
1. 系统检查feature是否已存在于 `features/{feature名称}/feature.json` 中
2. 如果未认领，则创建feature目录和 `feature.json` 文件，包含初始认领信息
3. 如果已认领，则显示冲突信息并提供选项

**关键点：**
- 模型技能调用存在不确定性。如果您发现没有进行feature认领，请停止并手动发送认领指令
- feature名称会被规范化（小写，连字符分隔）
- 认领信息包括：认领人、认领时间、状态

#### feature认领文件结构
认领后，会创建一个 `feature.json` 文件，结构如下：
```json
{
  "name": "feature-name",
  "title": "feature标题",
  "status": "claimed",
  "claimedBy": "current-user",
  "claimedAt": "2024-01-15T10:30:00.000Z",
  "completedAt": "",
  "documentation": {
    "requirements": [],
    "design": [],
    "tests": [],
    "pr": [],
    "deployment": [],
    "notes": ""
  }
}
```

### 3. feature实现流程

feature认领后，您可以使用协调的智能体工作流开始实现。

#### 使用 `/using-agentdev-suite` 进行feature实现
在对话开始时使用：
```
/using-agentdev-suite 帮我实现 feat-xxx
```

或描述您的需求：
```
/using-agentdev-suite 我需要实现用户认证，包括登录、注册和密码重置
```

**工作流：**
1. 系统检查feature认领状态（必须由您认领）
2. 根据项目类型激活适当的协调：
   - **传统软件**：路由到 `traditional-development-coordination`
   - **技能项目**：路由到 `skill-development-coordination`
3. 协调动态编排的智能体工作流
4. 遵循渐进式披露，根据需要加载指导

**注意：** 由于模型技能调用的不确定性，完整的开发周期可能不会自动完成。请监控进度并在需要时干预。

### 4. feature提交流程

完成开发后，您需要提交feature并创建拉取请求。

#### 使用 `/using-agentdev-suite` 进行feature提交
在对话开始时使用：
```
/using-agentdev-suite 帮我提交 feat-xxx
```

**执行过程：**
1. **验证**：检查 `feature.json` 中的必需文档：
   - PR 链接（`documentation.pr` 数组）必须至少包含一个 URL
   - 至少其中之一：requirements、design、tests 或 deployment 数组应非空
   - 如果缺失，主动搜索项目中的相关文件

2. **自动 PR 创建**（每一步都有用户确认的交互式流程）：
   - 创建feature分支（例如 `feature/feature名称`）
   - 使用语义化提交消息暂存并提交更改
   - 推送到远程仓库
   - 使用 GitHub CLI (`gh`) 创建拉取请求
   - 使用 PR URL 更新 `feature.json`

3. **平台支持**：
   - **GitHub**：通过 `gh` CLI 完全自动化支持
   - **其他平台（GitLab、Bitbucket）**：自动 PR 创建可能无效；您需要手动创建 PR 并将 URL 添加到 `feature.json`

#### 手动添加 PR 链接
如果自动 PR 创建失败或您使用不同的平台：
1. 通过平台的 Web 界面手动创建 PR
2. 将 PR URL 添加到 `feature.json` 中的 `documentation.pr` 数组：
   ```json
   "documentation": {
     "pr": ["https://github.com/owner/repo/pull/123"]
   }
   ```

### 5. Feature JSON 结构详情

`feature.json` 文件跟踪完整的feature生命周期：

```json
{
  "name": "user-authentication",           // 规范化的feature名称
  "title": "用户认证系统",                 // 人类可读的标题
  "status": "claimed",                     // unclaimed, claimed, completed, blocked
  "claimedBy": "alice-dev",                // GitHub 用户名或标识符
  "claimedAt": "2024-01-15T10:30:00.000Z", // ISO 时间戳
  "completedAt": "",                       // 完成前为空
  "documentation": {
    "requirements": [                      // 需求文档
      "https://example.com/docs/requirements.md"
    ],
    "design": [                            // 设计文档、架构图
      "https://example.com/docs/design.md"
    ],
    "tests": [                             // 测试计划、报告
      "https://example.com/docs/test-report.md"
    ],
    "pr": [                                // 拉取请求链接
      "https://github.com/owner/repo/pull/123"
    ],
    "deployment": [                        // 部署指南
      "https://example.com/docs/deployment.md"
    ],
    "notes": "额外的实现说明"
  }
}
```

### 6. 最佳实践和注意事项

1. **尽早认领**：规划开始时立即认领feature，防止冲突
2. **使用描述性名称**：feature名称应清晰具体
3. **及时更新**：完成开发后立即提交结果
4. **添加文档**：提供需求、设计、测试等相关文档链接
5. **监控自动化**：由于模型技能调用的不确定性，请监控自动化工作流并在停滞时干预
6. **团队协调**：通过 git 共享 `features/` 目录以实现团队可见性
7. **定期清理**：定期审查并清理过期或废弃的认领

### 7. 故障排除

**问题**：尽管使用了 `/using-agentdev-suite`，但feature认领没有发生
**解决方案**：手动发送认领指令：`/using-agentdev-suite 帮我认领 feat-xxx`

**问题**：非 GitHub 平台的自动 PR 创建失败
**解决方案**：手动创建 PR 并将 URL 添加到 `feature.json` 的 `documentation.pr` 数组

**问题**：缺少必需文档导致提交失败
**解决方案**：系统将搜索本地文件；提供 URL 或上传文档

**问题**：feature已被他人认领
**解决方案**：系统显示冲突详情；选择不同的feature名称或与认领人协调

