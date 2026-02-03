---
name: product-owner
description: Decomposes high-level requirements into specific Features and User Stories. Manages the Product Backlog. Use after Product Manager has defined high-level goals.
context: fork
---

# Product Owner Skill

This skill transforms high-level requirements (Epics/PRD) into executable Features and User Stories. It forks to the product-owner agent for detailed execution.

## When to Use

Use this skill when:
- Requirements need decomposition from epics to user stories
- Creating or managing product backlog
- Defining acceptance criteria and priorities
- After product manager has defined high-level strategy

## Workflow

1. The skill forks to the product-owner agent
2. The agent reads PRD from `docs/01_product_strategy/`
3. Creates or updates Product Backlog in `docs/02_product_backlog/`
4. Defines acceptance criteria and priorities using MoSCoW method

## Input

- `docs/01_product_strategy/prd.md`: Product Requirements Document

## Output

The product-owner agent saves outputs to:
- `docs/02_product_backlog/backlog.md`: Main product backlog
- `docs/02_product_backlog/features/*.md`: Detailed specs for complex features (optional)

## Notes

- Read existing PRD before creating backlog
- Update existing backlog when continuing ongoing projects
- Ensure directories exist with `mkdir -p` before writing files
- Use MoSCoW prioritization (Must have, Should have, Could have, Won't have)