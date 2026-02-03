---
name: coordinating-agent-development
description: Coordinates software development workflows with specialized agent roles (product-manager, product-owner, software-architect, software-developer, software-tester). Supports both new project development and existing project maintenance. Use when developing new features, maintaining existing codebases, fixing bugs, or coordinating multi-agent development tasks.
---

# Agent Development Suite

## Overview

This skill provides flexible software development lifecycle coordination using specialized agent roles. It combines theoretical best practices with concrete implementation workflows for both new project development and existing project maintenance with agent collaboration.

## When to Use

Use this skill when:
- Developing new software features or projects end-to-end
- Maintaining and modifying existing codebases
- Coordinating multiple specialized agents (PM, PO, Architect, Developer, Tester)
- Following structured development processes for new or existing projects
- Managing complex development tasks with iterative approach
- Fixing bugs or implementing small changes in established projects

## Project Context Assessment

Before starting any development task, assess the project context:

### New Project Development (Full Workflow)
Use when starting from scratch or implementing major new features:
- No existing codebase or minimal structure
- Requires complete requirements analysis and architecture design
- Follow full 6-phase development workflow

### Existing Project Maintenance (Adaptive Workflow)
Use when working with established codebases:
- Existing `src/`, `tests/`, `package.json`, etc. present
- Making bug fixes, small features, or improvements
- Skip unnecessary phases based on project maturity:
  - **Mature project**: Start at Phase 4 (Iterative Development)
  - **Partial documentation**: Start at earliest missing phase
  - **Established patterns**: Follow existing conventions and architecture

### Decision Criteria
1. Check for existing files: `src/`, `tests/`, `package.json`, `docs/`
2. Evaluate project maturity and documentation completeness
3. Determine appropriate starting phase based on needs
4. Adapt workflow to match project context

## Core Principles

1. **Agent-First Development**: Leverage appropriate specialized agents for each development phase
2. **Lifecycle Coverage**: Complete coverage from requirements to deployment
3. **Collaborative Intelligence**: Multiple agents work together through standardized workspace
4. **Quality Assurance**: Automated validation and testing at every stage
5. **Iterative Development**: Manage complexity with incremental feature implementation

## Workspace Structure

We use a standardized directory structure for collaboration. Ensure agents save their outputs to these specific folders:

- **PM Workspace**: `docs/01_product_strategy/`
- **PO Workspace**: `docs/02_product_backlog/`
- **Architect Workspace**: `docs/03_system_design/`
- **Dev Workspace**: `src/` (Code), `tests/` (Tests), `docs/04_development/` (Tech Notes)
- **QA Workspace**: `docs/05_qa_reports/`

## Complete Development Workflow

### Phase 1: Product Definition (Product Manager)
- **Action**: Analyze user request for product strategy
- **Context**: Pass the user's initial request
- **Instruction**: "Analyze this request. Create or update the Product Requirements Document (PRD) and other strategy docs in `docs/01_product_strategy/`. Ensure the directory exists."
- **Output**: `docs/01_product_strategy/prd.md`, `market_analysis.md`, `roadmap.md`
- **Existing Project Adaptation**: Skip this phase if project already has clear goals and established codebase. For maintenance tasks, document changes in existing PRD or create lightweight change request.

### Phase 2: Requirement Decomposition (Product Owner)
- **Action**: Break down high-level requirements into user stories
- **Context**: Read `docs/01_product_strategy/`
- **Instruction**: "Read the strategy docs in `docs/01_product_strategy/`. Create or update the detailed Product Backlog and User Stories in `docs/02_product_backlog/`. Ensure the directory exists."
- **Output**: `docs/02_product_backlog/backlog.md`, `features/*.md`
- **Existing Project Adaptation**: For maintenance tasks, create focused user stories for specific changes. Reference existing code patterns and constraints. Skip comprehensive backlog creation for small changes.

### Phase 3: Architecture Design (Software Architect)
- **Action**: Design system architecture based on requirements
- **Context**: Read `docs/01_product_strategy/` and `docs/02_product_backlog/`
- **Instruction**: "Read the PRD and Backlog. Create or update Technical Design documents in `docs/03_system_design/`. Ensure the directory exists."
- **Output**: `docs/03_system_design/architecture.md`, `api_spec.md`, `database_schema.md`
- **Existing Project Adaptation**: Reference existing architecture and patterns. For maintenance tasks, document design decisions incrementally rather than creating comprehensive architecture docs. Follow established technology stack and conventions.

### Phase 4: Iterative Development (Developer & Tester)

**Strategy**: Use adaptive iteration based on project context:
- **New projects**: Start with full backlog and design review
- **Existing projects**: Begin with code analysis and existing test suite review
- **Maintenance tasks**: Focus on specific changes while preserving existing functionality
- **Complex features**: **DO NOT** attempt to build everything in one go. Use iterative approach to manage context window and complexity.

**Action Loop**:
1. **Plan**: Assess project context and identify work items:
   - **New projects**: Review Backlog (`docs/02_product_backlog/`) and Design (`docs/03_system_design/`)
   - **Existing projects**: Analyze existing codebase, test suite, and documentation
   - **Maintenance**: Review specific change requests or bug reports
   Identify distinct Features, Modules, or Changes to implement.
2. **Iterate**: For each Feature/Module in the list:
   - **Develop**: Implement **ONLY** the specific feature or change
     - **Instruction**: "Implement **ONLY** the [Feature/Change Name]. For new projects, read `docs/03_system_design/` for architectural guidance. For existing projects, follow established patterns and conventions. Save code to `src/`."
   - **Verify**: Test the specific feature or change
     - **Instruction**: "Verify **ONLY** the [Feature/Change Name]. Run tests (including existing test suite for regression testing) and save the report to `docs/05_qa_reports/`."
   - **Handle Bugs**: If bugs are found, fix them immediately before moving to next feature
   - **Commit (Optional)**: Use `managing-git-workflows` skill to commit this specific feature if it passes tests

### Phase 5: Final Integration & Acceptance
- **Action**: Once all features/changes are implemented and verified individually
- **Instruction**: Run full regression test suite to ensure no regressions were introduced
- **Output**: Final test report in `docs/05_qa_reports/`
- **Existing Project Adaptation**: Focus on regression testing to preserve existing functionality. For maintenance tasks, ensure backward compatibility and minimal disruption.

### Phase 6: Delivery & Version Control
- **Condition**: Only proceed if Final Integration Testing is successful
- **Action**: Use the `managing-git-workflows` skill to commit the final artifacts
- **Instruction**:
  1. "Stage all changes in the workspace (`git add .`)."
  2. "Consult the `managing-git-workflows` skill to generate a Semantic Commit Message based on the features/changes implemented."
  3. "Execute `git commit -m '...'` with the generated message."
- **Existing Project Adaptation**: Use appropriate commit types (fix, chore, refactor) for maintenance tasks. Follow existing branch naming conventions and workflow.

## Handling Feedback Loops (Bugs)

- **Monitor**: Check the latest report in `docs/05_qa_reports/`
- **If Bugs Found**:
  1. Call developer to fix identified bugs
  2. **Instruction**: "Read the latest report in `docs/05_qa_reports/` and fix identified bugs in `src/`."
  3. After fixes, call tester again for verification
- **Success**: When tests pass, proceed to next step

## Data Passing Strategy

- **Directory-Based**: Agents read from upstream directories and write to their own dedicated workspace directories
- **Persistence**: Check for existing files and update/append when continuing ongoing tasks
- **Consistency**: Maintain standardized directory structure across all agents

## Best Practices

### For Requirement Analysis
- Always extract acceptance criteria for each requirement
- Validate requirements against existing system constraints
- Prioritize using MoSCoW method (Must have, Should have, Could have, Won't have)

### For Code Implementation
- Follow existing project patterns and conventions
- Include appropriate error handling and logging
- Generate corresponding test files
- Document public APIs and interfaces

### For Testing
- Aim for comprehensive test coverage
- Include unit, integration, and end-to-end tests
- Test edge cases and error conditions
- Validate performance requirements

### For Collaboration
- Maintain shared context through directory-based workspace
- Use standardized communication formats
- Document agent decisions and rationale
- Implement feedback loops for quality-critical tasks

## Checklist for Project Coordination

Copy this checklist when coordinating a software development project:

```
Software Development Progress:
- [ ] Phase 1: Product Definition (Product Manager)
- [ ] Phase 2: Requirement Decomposition (Product Owner)
- [ ] Phase 3: Architecture Design (Software Architect)
- [ ] Phase 4: Iterative Development:
  - [ ] Feature 1: Development & Testing
  - [ ] Feature 2: Development & Testing
  - [ ] Feature 3: Development & Testing
- [ ] Phase 5: Final Integration Testing
- [ ] Phase 6: Delivery & Version Control
```

## Available Specialized Skills

This suite coordinates these specialized skills:
- `defining-product-strategy`: Product strategy and high-level requirements
- `decomposing-requirements`: Backlog management and user stories
- `designing-system-architecture`: System architecture design
- `implementing-software-features`: Code implementation
- `testing-software-quality`: Testing and quality verification
- `managing-managing-git-workflowss`: Git operations and commit guidelines

## Common Use Cases

### New Feature Development
1. Analyze requirements with Product Manager
2. Decompose into user stories with Product Owner
3. Design architecture with Software Architect
4. Implement features iteratively with Developer
5. Verify with Tester
6. Final integration and delivery

### Bug Fix Workflow
1. Reproduce and analyze bug
2. Identify root cause
3. Generate fix with Developer
4. Test fix with Tester
5. Validate no regressions introduced

### Refactoring Process
1. Analyze code quality
2. Design refactoring strategy
3. Execute refactoring
4. Validate with tests
5. Ensure backward compatibility

## Configuration

Agents can be configured through:
- Directory-based workspace structure
- Standardized file formats and templates
- Project-specific conventions in `docs/` directories

## Troubleshooting

### Common Issues
- **Agent coordination failures**: Check directory structure and file permissions
- **Missing context**: Verify upstream directories contain required documents
- **Workspace issues**: Ensure directories exist with `mkdir -p` before writing

### Debugging Tips
- Check agent outputs in respective workspace directories
- Verify file formats and naming conventions
- Review test reports in `docs/05_qa_reports/`

## Integration

AgentDev Suite integrates with:
- Version control systems through `managing-git-workflows` skill
- CI/CD pipelines through standardized test outputs
- Project management through structured documentation

## Using the `/agent-dev` Command

The `/agent-dev` command activates this skill for complete software development coordination:

```
/agent-dev I need to develop a [project description] - please coordinate the full team
```

This will initiate the complete 6-phase development workflow with specialized agent coordination.