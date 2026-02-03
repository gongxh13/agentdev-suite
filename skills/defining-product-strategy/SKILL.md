---
name: defining-product-strategy
description: Defines product strategy, market analysis, and high-level requirements (Epics). Focuses on "Why" and "What". Use when starting new software projects, analyzing product requirements, defining market fit, creating product roadmaps, or documenting changes in existing projects.
context: fork
---

# Product Manager Skill

This skill provides product strategy and high-level requirements analysis. It forks to the product-manager agent for detailed execution.

## When to Use

Use this skill when:
- Starting a new software project
- Analyzing product requirements for new or existing projects
- Defining product strategy and market fit
- Creating high-level epics and scope
- Documenting changes and enhancements in established projects
- Updating project roadmaps based on new requirements

## Workflow

1. The skill forks to the product-manager agent
2. The agent analyzes the user request and existing documents
3. Creates or updates Product Requirements Document (PRD) in `docs/01_product_strategy/`
4. Ensures directory structure exists before writing

## Output

The product-manager agent saves outputs to:
- `docs/01_product_strategy/prd.md`: Product Requirements Document
- `docs/01_product_strategy/market_analysis.md`: Market research notes (optional)
- `docs/01_product_strategy/roadmap.md`: High-level roadmap (optional)

## Notes

- Always check for existing documents before creating new ones
- Update existing files when continuing ongoing projects
- Ensure directories exist with `mkdir -p` before writing files