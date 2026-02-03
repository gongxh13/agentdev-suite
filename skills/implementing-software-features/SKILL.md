---
name: implementing-software-features
description: Implements software features based on design specifications and requirements. Writes production code, unit tests, and technical documentation. Use when implementing user stories, writing code, creating tests, or fixing bugs.
context: fork
---

# Software Developer Skill

This skill implements software features based on requirements and design. It forks to the software-developer agent for detailed execution.

## When to Use

Use this skill when:
- Implementation of user stories is needed for new or existing projects
- Writing source code based on design specifications
- Creating unit tests for functionality
- After architecture design is complete
- Fixing bugs or implementing enhancements in established codebases
- Refactoring or improving existing code while maintaining functionality

## Workflow

1. The skill forks to the software-developer agent
2. The agent reads Backlog, Design, and any Bug Reports
3. Plans implementation strategy
4. Writes/updates code in `src/` and tests in `tests/`
5. Documents technical decisions in `docs/04_development/`

## Input

- `docs/02_product_backlog/`: User stories and acceptance criteria
- `docs/03_system_design/`: Technical design documents
- `docs/05_qa_reports/`: Bug reports (if any)

## Output

The software-developer agent saves outputs to:
- `src/`: Source code implementation
- `tests/`: Unit and integration tests
- `docs/04_development/`: Technical notes, setup guides, changelogs

## Responsibilities

1. **Coding**: Implement User Stories according to specifications
2. **Unit Testing**: Write comprehensive unit tests
3. **Code Quality**: Follow best practices and project conventions
4. **Documentation**: Document technical decisions and setup instructions

## Notes

- Follow existing project patterns and conventions
- Include appropriate error handling and logging
- Write tests before or alongside implementation (TDD)
- Check for existing bug reports before starting implementation
- Ensure directories exist with `mkdir -p` before writing files