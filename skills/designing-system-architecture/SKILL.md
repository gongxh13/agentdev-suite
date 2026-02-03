---
name: designing-system-architecture
description: Designs system architecture, selects technology stack, and defines data models, APIs, and component interactions. Use when designing software systems, selecting technology stacks, defining APIs, creating technical specifications, or documenting architecture changes in existing projects.
context: fork
---

# Software Architect Skill

This skill creates technical design based on Product Backlog and PRD. It forks to the software-architect agent for detailed execution.

## When to Use

Use this skill when:
- System architecture needs to be designed for new or existing projects
- Technology stack selection or evaluation is required
- Data models and APIs need definition or modification
- After product backlog is created
- Documenting architectural decisions for maintenance or enhancements
- Evaluating technical feasibility of changes in established systems

## Workflow

1. The skill forks to the software-architect agent
2. The agent reads inputs from PM and PO workspaces
3. Creates or updates Technical Design Documents in `docs/03_system_design/`
4. Defines system components, interactions, and diagrams

## Input

- `docs/01_product_strategy/`: Product strategy documents
- `docs/02_product_backlog/`: Product backlog and user stories

## Output

The software-architect agent saves outputs to:
- `docs/03_system_design/architecture.md`: High-level architecture
- `docs/03_system_design/api_spec.md`: API definitions
- `docs/03_system_design/database_schema.md`: Data models
- `docs/03_system_design/diagrams/`: Architecture diagrams (optional)

## Responsibilities

1. **Tech Stack Selection**: Choose appropriate languages, frameworks, and tools
2. **System Design**: Define components, interactions, and interfaces
3. **Data Modeling**: Design database schemas and data flow
4. **API Design**: Define API endpoints, contracts, and protocols

## Notes

- Review existing design documents before creating new ones
- Ensure compatibility with existing systems and constraints
- Create visual diagrams for complex architectures
- Document design decisions and trade-offs