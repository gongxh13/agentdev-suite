---
name: skill-development-coordination
description: Coordinates skill-based project development workflows with specialized focus on skill creation, platform configuration, and skill ecosystem management. Use when developing AI skill projects, creating skill libraries, or extending skill ecosystems. Focuses on skill design principles, progressive disclosure, multi-platform support, and skill testing/deployment.
---

# Skill-Based Development Coordination

## Overview

This skill coordinates development workflows for skill-based projects that extend AI capabilities through modular, self-contained skill packages. Unlike traditional software development, skill projects focus on creating AI guidance, workflows, and knowledge packages rather than executable code.

## When to Use

Use this skill when:
- Developing new skill projects or skill libraries
- Creating individual skills for AI assistants
- Extending existing skill ecosystems
- Configuring multi-platform skill distributions
- Testing and deploying skill packages
- Managing skill dependencies and relationships

## Project Context Assessment

Before starting any skill development task, assess the project context:

### New Skill Project (Full Workflow)
Use when starting a complete skill project from scratch:
- No existing skill structure or minimal setup
- Requires multi-platform configuration
- Needs complete skill ecosystem design

### Existing Skill Project (Adaptive Workflow)
Use when working with established skill projects:
- Existing `skills/` directory present
- `.claude-plugin/`, `.codex/`, or `.opencode/` configurations exist
- Adding new skills or modifying existing ones

### Individual Skill Creation
Use when creating a single skill within an existing project:
- Focus on specific skill implementation
- Integration with existing skill library
- Testing and packaging individual skills

## Core Principles

1. **Progressive Disclosure**: Design skills with three-level loading (metadata → SKILL.md → resources)
2. **Context Efficiency**: Minimize token usage, avoid obvious information
3. **Platform Compatibility**: Support multiple AI platforms (Claude Code, Codex, OpenCode)
4. **Skill Relationships**: Manage dependencies and combinations between skills
5. **Quality Validation**: Verify skill structure, metadata, and functionality

## Workspace Structure

Skill projects use a standardized directory structure:

```
skill-project/
├── .claude-plugin/          # Claude Code configuration
├── .codex/                 # Codex platform configuration
├── .opencode/             # OpenCode platform configuration
├── skills/                # Skill library
│   ├── using-project/     # Entry point skill
│   ├── skill-creator/     # Skill creation guidance
│   ├── skill-project-scaffolder/ # Project scaffolding
│   └── [domain-skills]/   # Domain-specific skills
├── lib/                   # Shared utilities
├── templates/             # Project templates
└── tests/                # Test suites
```

Individual skill structure:
```
skill-name/
├── SKILL.md              # Required: YAML frontmatter + instructions
├── scripts/              # Optional: Executable code
├── references/           # Optional: Detailed documentation
└── assets/              # Optional: Output templates and resources
```

## Complete Skill Development Workflow

### Phase 1: Project Strategy & Scope (Product Manager)
- **Action**: Analyze requirements for skill project strategy
- **Recommended Agent**: `skill-requirements-analyst`
- **Context**: User request for skill development
- **Instruction**: "Analyze this skill development request. Create or update project strategy documents in `docs/01_product_strategy/`. Focus on skill ecosystem design, target platforms, and user scenarios."
- **Output**: `docs/01_product_strategy/skill_prd.md`, `platform_analysis.md`, `skill_roadmap.md`
- **Adaptation**: For individual skill creation, focus on skill purpose and integration points.

### Phase 2: Skill Requirements & Design (Product Owner)
- **Action**: Define skill specifications and design principles
- **Recommended Agent**: `skill-requirements-analyst` (continued from Phase 1)
- **Context**: Read `docs/01_product_strategy/`
- **Instruction**: "Read the strategy docs. Create or update skill specifications in `docs/02_product_backlog/`. Define skill relationships, progressive disclosure strategy, and platform requirements."
- **Output**: `docs/02_product_backlog/skill_specs.md`, `skill_relationships.md`, `platform_configs.md`
- **Adaptation**: For existing projects, reference current skill library and patterns.

### Phase 3: Skill Architecture & Platform Design (Skill Architect)
- **Action**: Design skill architecture and platform configurations
- **Recommended Agent**: `skill-architect`
- **Context**: Read `docs/01_product_strategy/` and `docs/02_product_backlog/`
- **Instruction**: "Design skill project architecture. Create or update technical design documents in `docs/03_system_design/`. Include multi-platform configuration strategy, skill structure patterns, and testing approach."
- **Output**: `docs/03_system_design/skill_architecture.md`, `platform_configuration.md`, `testing_strategy.md`
- **Adaptation**: Follow existing project conventions for platform configurations.

### Phase 4: Iterative Skill Development (Skill Developer & Tester)
- **Recommended Skills**: `skill-creator` (for individual skills), `skill-project-scaffolder` (for project structure)

**Strategy**: Use adaptive iteration based on project scope:
- **New skill projects**: Start with project scaffolding and platform setup
- **Existing projects**: Focus on individual skill implementation
- **Skill updates**: Modify existing skills with backward compatibility

**Action Loop**:
1. **Plan**: Assess project context and identify work items:
   - **New projects**: Setup project structure with `skill-project-scaffolder`
   - **Skill creation**: Use `skill-creator` for guided skill development
   - **Platform configuration**: Configure `.claude-plugin/`, `.codex/`, `.opencode/`

2. **Iterate**: For each skill or platform component:
   - **Develop**: Create or update skill components
     - **Instruction**: "Implement [Skill/Component Name]. Follow skill design principles and progressive disclosure. Reference existing patterns in `docs/03_system_design/`."
   - **Verify**: Test skill functionality and platform compatibility
     - **Instruction**: "Verify [Skill/Component Name]. Test skill structure, metadata, and platform configurations. Save test reports to `docs/05_qa_reports/`."

### Phase 5: Integration & Platform Testing
- **Action**: Test complete skill ecosystem across target platforms
- **Recommended Agent**: `skill-tester`
- **Instruction**: "Run comprehensive platform compatibility tests. Verify skill loading, progressive disclosure, and cross-platform consistency."
- **Output**: Integration test report in `docs/05_qa_reports/`
- **Adaptation**: Focus on platform-specific validation for configured platforms.

### Phase 6: Packaging & Distribution
- **Condition**: Only proceed if integration testing is successful
- **Action**: Package skills and prepare for distribution
- **Recommended Skill**: `managing-git-workflows` (for version control)
- **Instruction**:
  1. "Validate all skills meet packaging requirements."
  2. "Package skills using appropriate tools (`package_skill.py`)."
  3. "Update platform configurations for distribution."
  4. "Document installation and usage instructions."

## Skill Development Best Practices

### Skill Design
- **Clear triggers**: Description must start with "Use when" and specify exact conditions
- **Appropriate freedom**: Match instruction specificity to task fragility
- **Resource organization**: Separate SKILL.md, references, scripts, assets
- **Progressive disclosure**: Keep SKILL.md concise, move details to references

### Platform Compatibility
- **Multi-platform support**: Configure `.claude-plugin/`, `.codex/`, `.opencode/`
- **Shared skill library**: All platforms use same `skills/` directory
- **Platform-specific adaptations**: Handle through installation scripts
- **Testing**: Verify functionality across all target platforms

### Quality Assurance
- **Structure validation**: Check required files and directory structure
- **Metadata validation**: Ensure proper frontmatter format
- **Content quality**: Verify clarity, completeness, and accuracy
- **Platform testing**: Test installation and functionality on each platform

## Key Differences from Traditional Development

### Deliverables
- **Skill projects**: AI guidance packages (skills) with SKILL.md files
- **Traditional projects**: Executable code with source files

### Focus Areas
- **Skill projects**: Knowledge transfer, process guidance, AI assistance
- **Traditional projects**: Functionality, performance, reliability

### Testing Approach
- **Skill projects**: Validate guidance quality, structure, platform compatibility
- **Traditional projects**: Verify code execution, functionality, performance

### Deployment
- **Skill projects**: Plugin systems, skill libraries, platform configurations
- **Traditional projects**: Servers, containers, devices, package managers

## Available Specialized Skills

This coordination leverages these specialized skills designed specifically for skill development:

### Core Skill Development Skills
- `skill-creator`: Guided skill creation with best practices
- `skill-project-scaffolder`: Multi-platform project scaffolding
- `skill-development-methodology`: Skill development principles and patterns

### Skill-Specific Analysis & Design Skills
- `skill-requirements-analyst`: Skill requirements and ecosystem strategy analysis
- `skill-architect`: Skill architecture and platform configuration design
- `skill-tester`: Skill structure and platform compatibility testing

### Supporting Skills
- `managing-git-workflows`: Version control for skill projects
- `traditional-development-methodology`: Traditional development comparison (for reference)

## Common Use Cases

### New Skill Project Development
1. Analyze requirements and define skill ecosystem
2. Setup multi-platform project structure
3. Create core skills (entry point, creator, scaffolder)
4. Develop domain-specific skills
5. Test across platforms and package for distribution

### Individual Skill Creation
1. Define skill purpose and trigger conditions
2. Design progressive disclosure structure
3. Implement SKILL.md and bundled resources
4. Test skill functionality and integration
5. Package and integrate into existing project

### Skill Project Maintenance
1. Analyze existing skill library and configurations
2. Identify improvements or new skill needs
3. Implement changes with backward compatibility
4. Test platform compatibility
5. Update documentation and distribution

## Detection Logic for Skill Projects

This skill should be triggered when:
- User requests involve "skill development", "creating skills", "skill project"
- Existing project contains `skills/` directory
- Project has `.claude-plugin/`, `.codex/`, or `.opencode/` configurations
- Context involves AI guidance, knowledge packages, or plugin development

## Integration with Traditional Development

For hybrid projects containing both skills and traditional code:
1. Use `coordinating-agent-development` for overall coordination
2. Route to appropriate sub-coordination based on component type
3. Manage dependencies between skill and code components
4. Coordinate testing and deployment for both paradigms

## Troubleshooting

### Common Issues
- **Skill not triggering**: Check description starts with "Use when" and has clear conditions
- **Platform incompatibility**: Verify all platform configurations are properly set
- **Context bloat**: Review progressive disclosure design, move details to references
- **Packaging failures**: Validate skill structure meets packaging requirements

### Debugging Tips
- Check skill metadata (name and description) for triggering accuracy
- Verify platform-specific configuration files
- Review test reports in `docs/05_qa_reports/`
- Test skill loading and progressive disclosure behavior