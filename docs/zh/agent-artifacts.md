# 智能体产物目录结构

本文档基于 AgentDev Suite 中各智能体的实际规范，详细介绍每个智能体生成的产物，包括文件命名约定、目录结构和输出格式。

## 概述

AgentDev Suite 遵循标准化的产物组织系统，每个智能体在特定目录中生成输出，并采用一致的命名约定。系统支持两种上下文：

1. **功能开发**：处理特定功能时，产物组织在 `features/{功能名称}/` 下
2. **非功能任务**：处理一般任务时，产物组织在 `docs/agent-outputs/{任务ID}/` 下

## 核心智能体产物结构

### 传统开发智能体

#### 1. 产品经理 (`traditional-pm`)
- **角色缩写**：`pm`
- **文件命名约定**：`{YYYYMMDD-HHMMSS}-pm-{文档类型}.md`
- **输出目录**：
  - 功能开发：`features/{功能名称}/product-management/`
  - 非功能任务：`docs/agent-outputs/{任务ID}/product-management/`
- **示例文件**：
  - `20250210-103000-pm-prd.md` - 产品需求文档
  - `20250210-103500-pm-market-analysis.md` - 市场分析报告
  - `20250210-104000-pm-roadmap.md` - 产品路线图

#### 2. 产品负责人 (`traditional-po`)
- **角色缩写**：`po`
- **文件命名约定**：`{YYYYMMDD-HHMMSS}-po-{文档类型}.md`
- **输出目录**：
  - 功能开发：`features/{功能名称}/product-management/`（与产品经理共享）
  - 非功能任务：`docs/agent-outputs/{任务ID}/product-management/`（与产品经理共享）
- **示例文件**：
  - `20250210-103000-po-user-stories.md` - 用户故事集合
  - `20250210-103500-po-acceptance-criteria.md` - 验收标准
  - `20250210-104000-po-feature-list.md` - 功能清单

#### 3. 架构师 (`traditional-arch`)
- **角色缩写**：`arch`
- **文件命名约定**：`{YYYYMMDD-HHMMSS}-arch-{文档类型}.md`
- **输出目录**：
  - 功能开发：`features/{功能名称}/architecture/`
  - 非功能任务：`docs/agent-outputs/{任务ID}/architecture/`
- **示例文件**：
  - `20250210-103000-arch-architecture.md` - 系统架构设计
  - `20250210-103500-arch-api-spec.md` - API规范
  - `20250210-104000-arch-database-schema.md` - 数据模型
  - `20250210-104500-arch-diagrams/` - 架构图目录

#### 4. 开发者 (`traditional-dev`)
- **角色缩写**：无特定文件命名（输出源代码）
- **主要输出**：
  - `src/` 目录中的源代码
  - `tests/` 中遵循技术约束的技术特定测试文件
- **文档输出目录**：
  - 功能开发：`features/{功能名称}/development/`
  - 非功能任务：`docs/agent-outputs/{任务ID}/development/`
- **技术特定测试结构**：
  - **Python**：`tests/unit/`、`tests/integration/`、`test_*.py` 文件，80%+ 覆盖率
  - **Django**：`tests/`、`<app>/tests.py`、`test_*.py`，85%+ 覆盖率
  - **Java/Spring Boot**：`src/test/java/` 镜像主结构、`*Test.java`，70%+ 覆盖率
  - **Node.js/JavaScript**：`tests/`、`__tests__/`、`*.test.js` 或 `*.spec.js`，80%+ 覆盖率
  - **TypeScript**：`*.test.ts` 或 `*.spec.ts`，80%+ 覆盖率
  - **React**：`__tests__/`、`*.test.jsx`、`ComponentName.test.jsx`，85%+ 覆盖率
  - **Go**：`*_test.go` 与源文件并列，75%+ 覆盖率

#### 5. 质量保证工程师 (`traditional-qa`)
- **角色缩写**：`qa`
- **文件命名约定**：`{YYYYMMDD-HHMMSS}-qa-{文档类型}.md`
- **输出目录**：
  - 功能开发：`features/{功能名称}/testing/`
  - 非功能任务：`docs/agent-outputs/{任务ID}/testing/`
- **示例文件**：
  - `20250210-103000-qa-test-report.md` - 测试报告
  - `20250210-103500-qa-bug-list.md` - 缺陷报告
  - `20250210-104000-qa-security-validation.md` - 安全验证报告
- **测试自动化结构**：
  - `tests/e2e/` - 端到端测试（Playwright、Cypress、Selenium）
  - `tests/performance/` - 性能测试（JMeter、k6、Gatling、Locust）
  - `tests/security/` - 安全验证和渗透测试
  - `tests/test-results/` - 测试执行输出和报告
  - `tests/test-config/` - 测试环境和配置

#### 6. 运维工程师 (`traditional-ops`)
- **角色缩写**：`ops`
- **文件命名约定**：`{YYYYMMDD-HHMMSS}-ops-{文档类型}.md`
- **输出目录**：
  - 功能开发：`features/{功能名称}/operations/`
  - 非功能任务：`docs/agent-outputs/{任务ID}/operations/`
- **示例文件**：
  - `20250210-103000-ops-build-config.md` - 构建配置
  - `20250210-103500-ops-deployment-pipeline.md` - 部署流水线
  - `20250210-104000-ops-infrastructure.md` - 基础设施要求
  - `20250210-104500-ops-ci-cd.md` - CI/CD流水线配置
  - 构建脚本、Dockerfiles、部署清单

### 技能开发智能体

#### 7. 技能需求分析师 (`skill-ra`)
- **角色缩写**：`analyst`
- **文件命名约定**：`{YYYYMMDD-HHMMSS}-analyst-{文档类型}.md`
- **输出目录**：
  - 功能开发：`features/{功能名称}/requirements-analysis/`
  - 非功能任务：`docs/agent-outputs/{任务ID}/requirements-analysis/`
- **示例文件**：
  - `20250210-103000-analyst-skill-specs.md` - 技能规范
  - `20250210-103500-analyst-platform-analysis.md` - 平台兼容性分析
  - `20250210-104000-analyst-ecosystem-strategy.md` - 技能生态系统策略

#### 8. 技能架构师 (`skill-arch`)
- **角色缩写**：`arch`（与传统架构师相同）
- **文件命名约定**：`{YYYYMMDD-HHMMSS}-arch-{文档类型}.md`
- **输出目录**：
  - 功能开发：`features/{功能名称}/architecture/`（与传统架构师共享）
  - 非功能任务：`docs/agent-outputs/{任务ID}/architecture/`（与传统架构师共享）
- **示例文件**：
  - `20250210-103000-arch-skill-architecture.md` - 技能生态系统架构
  - `20250210-103500-arch-platform-configuration.md` - 多平台配置策略
  - `20250210-104000-arch-progressive-disclosure.md` - 渐进式披露设计
  - `20250210-104500-arch-skill-relationships.md` - 技能依赖关系和交互

#### 9. 技能开发工程师 (`skill-dev`)
- **角色缩写**：无特定文件命名（输出技能文件）
- **主要输出**：
  - `skills/` 目录中具有正确 SKILL.md 文件的技能
  - `.claude-plugin/`、`.codex/`、`.opencode/` 中的平台配置
  - `agents/` 目录中生成的智能体文件
- **实现结构**：
  ```
  项目名称/
  ├── .claude-plugin/          # Claude Code 平台配置
  ├── .codex/                 # Codex 平台配置
  ├── .opencode/             # OpenCode 平台配置
  ├── skills/                # 所有创建的技能，结构正确
  ├── agents/               # 生成的智能体文件
  ├── lib/                  # 共享工具
  └── tests/               # 测试基础设施
  ```

#### 10. 技能质量保证工程师 (`skill-qa`)
- **角色缩写**：`qa`（与传统质量保证工程师相同）
- **文件命名约定**：`{YYYYMMDD-HHMMSS}-qa-{文档类型}.md`
- **输出目录**：
  - 功能开发：`features/{功能名称}/testing/`（与传统质量保证工程师共享）
  - 非功能任务：`docs/agent-outputs/{任务ID}/testing/`（与传统质量保证工程师共享）
- **示例文件**：
  - `20250210-103000-qa-skill-test-report.md` - 技能测试报告
  - `20250210-103500-qa-platform-compatibility.md` - 平台兼容性结果
  - `20250210-104000-qa-structure-validation.md` - 技能结构验证结果

#### 11. 技能平台工程师 (`skill-platform`)
- **角色缩写**：`platform`
- **文件命名约定**：`{YYYYMMDD-HHMMSS}-platform-{文档类型}.md`
- **输出目录**：
  - 功能开发：`features/{功能名称}/platform/`
  - 非功能任务：`docs/agent-outputs/{任务ID}/platform/`
- **示例文件**：
  - `20250210-103000-platform-claude-code-config.md` - Claude Code 平台配置
  - `20250210-103500-platform-codex-config.md` - Codex 平台配置
  - `20250210-104000-platform-opencode-config.md` - OpenCode 平台配置
  - `20250210-104500-platform-deployment-process.md` - 技能部署过程文档
  - 平台配置文件（`.claude-plugin/`、`.codex/`、`.opencode/`）

## 完整项目结构示例

### 功能开发上下文
```
features/
└── 用户认证/                 # 功能名称
    ├── product-management/       # 产品经理和产品负责人输出
    │   ├── 20250210-103000-pm-prd.md
    │   ├── 20250210-103500-po-user-stories.md
    │   └── 20250210-104000-po-acceptance-criteria.md
    ├── architecture/             # 传统和技能架构师输出
    │   ├── 20250210-103000-arch-architecture.md
    │   ├── 20250210-103500-arch-api-spec.md
    │   └── 20250210-104000-arch-skill-architecture.md
    ├── requirements-analysis/    # 技能需求分析师输出
    │   └── 20250210-103000-analyst-skill-specs.md
    ├── development/              # 开发者技术文档
    │   └── 20250210-103000-dev-technical-notes.md
    ├── testing/                  # 质量保证测试报告
    │   ├── 20250210-103000-qa-test-report.md
    │   └── 20250210-103500-qa-skill-test-report.md
    ├── operations/               # 运维工程师输出
    │   └── 20250210-103000-ops-build-config.md
    └── platform/                 # 技能平台工程师输出
        └── 20250210-103000-platform-claude-code-config.md
```

### 非功能任务上下文
```
docs/
└── agent-outputs/
    └── 20250210-103000-任务描述/  # 任务ID（时间戳或描述）
        ├── product-management/
        ├── architecture/
        ├── requirements-analysis/
        ├── development/
        ├── testing/
        ├── operations/
        └── platform/
```

## 关键原则

### 1. 一致的命名约定
所有智能体生成的文档遵循模式：`{YYYYMMDD-HHMMSS}-{角色缩写}-{文档类型}.md`
- **YYYYMMDD-HHMMSS**：用于版本控制和排序的时间戳
- **角色缩写**：每个智能体角色的唯一标识符（pm、po、arch、qa、ops、analyst、platform）
- **文档类型**：表示文档用途的描述性名称（prd、user-stories、architecture、test-report 等）

### 2. 上下文感知的目录结构
- **功能开发**：产物组织在 `features/{功能名称}/` 下，便于追溯
- **一般任务**：产物组织在 `docs/agent-outputs/{任务ID}/` 下，用于临时工作
- **共享目录**：某些角色共享目录（产品经理/产品负责人、传统/技能架构师、传统/技能质量保证工程师）

### 3. 技术特定约束
- **开发测试**：遵循语言/框架特定的测试结构和覆盖率要求
- **质量保证自动化**：按测试领域（端到端、性能、安全）组织，具有工具特定的子目录
- **技能项目**：遵循渐进式披露结构，具有平台配置

### 4. 协作和可追溯性
- **输入/输出映射**：每个智能体从特定目录读取并向特定目录写入
- **阶段进展**：产物通过开发阶段流动，具有清晰的交接
- **跨角色协调**：共享目录促进相关角色之间的协作