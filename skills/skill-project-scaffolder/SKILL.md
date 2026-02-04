---
name: skill-project-scaffolder
description: Use when creating or restructuring skill projects to support multiple AI platforms (Claude Code, OpenCode, Codex) with multi-platform architecture.
context: fork
---

# Skill Project Scaffolder

## Overview

Generate or restructure skill projects following multi-platform architecture for Claude Code, OpenCode, and Codex platforms. Creates proper directory structure, platform configurations, and testing framework.

## Scope & Responsibility

**This skill ONLY creates project structure and configuration.** It does NOT teach how to write skills.

- ✅ **DOES**: Generate platform configs, directory structure, testing framework
- ✅ **DOES**: Create proper multi-platform architecture
- ✅ **DOES**: Support new projects and migration of existing projects
- ❌ **DOES NOT**: Teach skill writing (see `skill-creator` skill)
- ❌ **DOES NOT**: Create skill content

## When to Use

### New Projects
- Starting a skill library from scratch
- Creating templates for team skill development
- Setting up standardized project structure

### Existing Project Migration
- Adding multi-platform support to single-platform projects
- Restructuring projects to follow multi-platform conventions
- Fixing incomplete or incorrect platform configurations

### Platform Expansion
- Adding Claude Code support to OpenCode/Codex projects
- Adding OpenCode support to Claude Code/Codex projects
- Adding Codex support to Claude Code/OpenCode projects

## Detailed Workflow

Copy this checklist and check off items as you complete them:

```
Task Progress:
- [ ] Step 1: Understand user requirements (new project? migration? platform expansion?)
- [ ] Step 2: Collect required information (project name, author, description, etc.)
- [ ] Step 3: Check for Git repository and confirm platform information
- [ ] Step 4: Run appropriate generator command with confirmed parameters
- [ ] Step 5: Verify generated project structure
- [ ] Step 6: Guide user through customization and next steps
```

### Step 1: Understand Requirements
Determine if user wants:
- **New project** from scratch (starting a skill library)
- **Migration** of existing project (adding multi-platform support)
- **Platform expansion** (adding support for new platforms to existing project)
- **Configuration fixes** (correcting incorrect platform configurations)

### Step 2: Collect Information
Gather these required parameters for the generator:
1. **Project name** (kebab-case, becomes directory name)
2. **Author name and email** (for platform configurations)
3. **Owner/username** (Git repository owner for platform URLs)
4. **Description** (project purpose and scope)
5. **Platform details** (via detection or manual input - see Step 3)

### Step 3: Platform Detection & Confirmation

#### Automatic Detection (Git Repository)
The script automatically detects Git repository information if available:
- **Platform detection** from remote URL (GitHub, GitCode, GitLab, Gitee, Bitbucket)
- **Owner and repository name** extraction from URL
- **Branch detection** (default: 'master' unless specified)

#### User Confirmation REQUIRED
When the script detects Git information, YOU (the model) MUST:

1. **Display detected values** clearly to the user:
   ```
   Detected git repository: https://github.com/owner/repo.git
     Platform: github
     Owner: owner
     Repository: repo
   ```

2. **Ask for explicit confirmation**:
   - "The script detected GitHub repository 'owner/repo'. Is this correct?"
   - Or: "The script detected [platform]/[owner]/[repo]. Is this correct?"

3. **Handle user response**:
   - **If user confirms** (says "yes", "correct", etc.): Proceed with generation using detected values
   - **If user denies** or wants different values: Use manual parameters or help user provide correct values
   - **If user is unsure**: Explain what each value means and why it matters for platform URLs

#### Manual Input (No Git Repository or User Correction)
If no Git repository is detected OR user wants different values, prompt for:
- **Platform** (github/gitcode/gitlab/gitee/bitbucket)
- **Owner/username**
- **Repository name**
- **Branch** (default: master)

#### Example Interaction Flow
**Git Repository Detected**: Display detected values and ask for confirmation.
**User Wants Changes**: Prompt for manual platform, owner, repository, and branch.
**No Git Repository**: Prompt for all platform information manually.

### Step 4: Execute Generation
Run appropriate command based on scenario:

#### New Project (from scratch)
```bash
# Basic (GitHub default)
node ./skills/skill-project-scaffolder/scripts/generate-project.js \
  "project-name" "Your Name" "email@example.com" "owner" "Description"

# With specific platform parameters
node ./skills/skill-project-scaffolder/scripts/generate-project.js \
  "project-name" "Your Name" "email@example.com" "owner" "Description" \
  --platform gitcode --repo repository-name --branch main
```

#### Update Existing Project (recommended)
```bash
# Update current project with missing platform configurations
node ./skills/skill-project-scaffolder/scripts/generate-project.js --update . \
  "Your Name" "email@example.com" "owner" "Description" --platform gitcode
```

#### Migration Scenarios
For complex migrations, see [Migration Guidance](#migration-guidance-for-existing-projects).

### Step 5: Verification
1. Navigate to generated/updated project: `cd project-name`
2. Run cross-platform validation: `npm test`
3. Check platform-specific configurations exist:
   - `.claude-plugin/` (plugin.json, marketplace.json)
   - `.codex/` (INSTALL.md, bootstrap files)
   - `.opencode/` (INSTALL.md, plugin)

### Step 6: Post-Generation Guidance
Guide user through these next steps:
1. **Customize platform configurations** with actual owner information
2. **Add actual skills** to the `skills/` directory
3. **Customize the `using-{project}` skill** with project-specific context
4. **Test on all target platforms** (Claude Code, OpenCode, Codex)
5. **Share with team** via Git repository

## Generated Project Structure

```
project-name/
├── skills/                    # Your skills (add SKILL.md files here)
│   └── using-project-name/   # Core workflow skill (auto-generated)
│       └── SKILL.md          # Skill usage discipline template
├── .claude-plugin/           # Claude Code configuration
│   ├── plugin.json          # Plugin metadata (complete format)
│   └── marketplace.json     # Marketplace listing (complete format)
├── .codex/                   # Codex platform support
│   ├── INSTALL.md           # Codex installation instructions
│   ├── project-name-bootstrap.md
│   └── project-name-codex    # Bootstrap script template
├── .opencode/                # OpenCode platform support
│   ├── INSTALL.md           # OpenCode installation instructions
│   └── plugins/             # OpenCode plugin
│       └── project-name.js  # Plugin template
├── tests/                    # Cross-platform test framework
│   ├── structure.test.js    # Node.js-based structure tests
│   ├── platform-validation.js
│   └── claude-code/         # Platform-specific tests
├── lib/                      # Shared utilities
├── hooks/                    # Session hooks
├── package.json             # Cross-platform package config
└── README.md                # Complete documentation with installation
```

## Using-{PROJECT_NAME} Core Skill

### Purpose
A `using-{PROJECT_NAME}` skill is automatically generated as a core workflow skill. This establishes mandatory skill discipline for your project:

- **1% rule**: If any skill has 1% chance of applying, it MUST be invoked
- **Precedence**: Skill check happens BEFORE any response or action
- **No opt-out**: No rationalization or skipping of applicable skills
- **Workflow enforcement**: Ensures consistent use of your project's skill library

### Auto-Generated Template
The generated `using-{PROJECT_NAME}/SKILL.md` contains:
1. **Core rules** for skill discipline (adapted for your project name)
2. **Skill workflow diagram** with decision flow
3. **Red flag table** of common rationalizations to avoid
4. **Skill priority** guidance (process skills before implementation)
5. **Customization notes** section with prompts for project-specific adaptation

### Required Customization
**IMPORTANT**: The auto-generated skill is a template. You MUST customize it for your specific {PROJECT_NAME} context:

1. **Project-specific context**: Explain what {PROJECT_NAME} is, its scope, and purpose
2. **Key workflows**: Describe the most important {PROJECT_NAME} workflows that skills enforce
3. **Skill categories**: List the main skill categories in {PROJECT_NAME} and their purposes
4. **Platform-specific guidance**: Add details about how {PROJECT_NAME} skills work on different platforms
5. **Common use cases**: Provide examples of typical {PROJECT_NAME} tasks and which skills apply
6. **Project-specific red flags**: Add rationalizations specific to {PROJECT_NAME} domain

### Integration with Platform Configurations
- **OpenCode plugin**: Automatically tries to load `using-{PROJECT_NAME}` skill content
- **Codex bootstrap**: References `using-{PROJECT_NAME}` as the core workflow skill
- **Claude Code**: Uses `Skill` tool to load `using-{PROJECT_NAME}` when starting conversations

## Platform Configuration Files

### Claude Code (`/.claude-plugin/`)
- `plugin.json`: Complete plugin metadata
- `marketplace.json`: Proper marketplace listing format

### OpenCode (`/.opencode/`)
- `INSTALL.md`: Platform-specific installation
- `plugins/project-name.js`: Plugin injection template

### Codex (`/.codex/`)
- `INSTALL.md`: Codex installation with AGENTS.md integration
- Bootstrap script and content files

### Customization Required
After generation, update platform configurations with your actual information:
- Update marketplace.json with owner details
- Customize OpenCode plugin for your skill library
- Edit Codex bootstrap with project-specific instructions

## Cross-Platform Support

### Testing Framework
- **Node.js tests** (`tests/structure.test.js`): Run on any platform
- **Platform-specific validation**: Checks each platform's config
- **No shell script dependencies**: Works on Windows, macOS, Linux

### Package Management
- `package.json` with platform-agnostic scripts
- Pure JavaScript/Node.js utilities
- Environment detection for platform-specific operations

## Migration Guidance for Existing Projects

### Assessment Checklist
1. **Current State**: Single-platform or partial multi-platform?
2. **Structure**: Existing `skills/` directory? Platform configs?
3. **Goals**: Which platforms to add? Full restructuring needed?

### Migration Approaches

#### For Single-Platform Projects
1. Generate new project structure alongside existing
2. Copy skills from existing `skills/` directory
3. Merge platform-specific configurations
4. Update `package.json` and dependencies

#### For Partial Multi-Platform
1. Compare generated structure with existing
2. Identify missing platform configurations
3. Add missing files from template
4. Update version synchronization

#### For Complete Restructuring
1. Backup existing project
2. Generate fresh structure
3. Migrate skills incrementally
4. Test each platform after migration

### Using --update Flag (Recommended)
For existing projects, use the simpler update approach:

```bash
# Navigate to existing project
cd /path/to/existing-skills

# Update with missing platform configurations
node /path/to/skill-project-scaffolder/scripts/generate-project.js --update . "Your Name" "your@email.com" "githubuser" "Description"

# Review added files
ls -la .claude-plugin .codex .opencode

# Test updated structure
npm test
```

**Update flag behavior:**
- Adds missing platform directories (`.claude-plugin`, `.codex`, `.opencode`)
- Generates missing configuration files (skips existing files)
- Preserves your existing skills and customizations
- Skips files that already exist

### Common Migration Issues
- **Version conflicts**: Sync versions across all platform configs
- **Path differences**: Adjust paths for Windows/macOS/Linux
- **Tool mappings**: Update for platform-specific tool differences
- **Testing gaps**: Add missing platform tests


## Quick Start

### Basic Commands

**New project (GitHub default):**
```bash
node ./skills/skill-project-scaffolder/scripts/generate-project.js \
  "project-name" "Your Name" "email@example.com" "owner" "Description"
```

**With platform parameters:**
```bash
node ./skills/skill-project-scaffolder/scripts/generate-project.js \
  "project-name" "Your Name" "email@example.com" "owner" "Description" \
  --platform gitcode --repo repository-name --branch main
```

**Update existing project:**
```bash
node ./skills/skill-project-scaffolder/scripts/generate-project.js --update . \
  "Your Name" "email@example.com" "owner" "Description" --platform gitcode
```

For detailed workflow including platform detection, user confirmation, and step-by-step guidance, see [Detailed Workflow](#detailed-workflow).

## Configuration Details

### Complete `marketplace.json` Format
The generated `.claude-plugin/marketplace.json` follows the complete format with proper owner information and plugins array.

### README Installation Section
Generated README includes complete installation instructions for all platforms (Claude Code, OpenCode, Codex).

## Testing

### Cross-Platform Validation
Generated projects include Node.js-based tests that validate structure and platform configurations:
- Skills directory and core workflow skill
- Complete marketplace.json format
- Platform-specific configuration files

### Testing Workflow
```bash
# Run structure tests
npm test

# Run platform-specific validation
npm run test:platforms

# Manual verification of JSON files
node -c .claude-plugin/plugin.json
node -c .claude-plugin/marketplace.json
```

Test on each target platform:
1. **Claude Code**: `claude plugin add ./ --dev`
2. **OpenCode**: Follow INSTALL.md instructions
3. **Codex**: Follow INSTALL.md instructions

## Quick Reference

| Task | Approach |
|------|----------|
| **New project** | Generate with template, add skills |
| **Add platform** | Compare with template, merge configs |
| **Fix configs** | Validate against complete format examples |
| **Test** | Run `npm test` for cross-platform validation |
| **Migrate** | Assess, generate template, incremental merge |

## Common Scenarios

### Adding New Platform to Existing Project
Generate a template and copy missing platform configurations.

### Fixing Incorrect Configurations
Generate fresh template and compare/merge configuration files.

### Team Skill Development Setup
1. Generate project structure
2. Customize platform configurations
3. Add team-specific skills
4. Update using-{project} skill with team workflows
5. Share via Git repository

## Troubleshooting

### Generated Files Missing
Check write permissions, disk space, and Node.js version (>=14.0.0).

### JSON Syntax Errors
```bash
node -c .claude-plugin/plugin.json
node -c .claude-plugin/marketplace.json
```

### Platform-Specific Issues
- **Claude Code**: Check permissions in `~/.claude/skills/`
- **OpenCode**: Verify symlinks in `~/.config/opencode/`
- **Codex**: Check AGENTS.md syntax and paths

### Test Failures
If `npm test` fails:
1. Check all required directories exist
2. Verify SKILL.md files have proper YAML frontmatter
3. Ensure marketplace.json has plugins array

## Best Practices

### Version Management
Keep versions synchronized across package.json, plugin.json, and marketplace.json.

### Skill Naming
- Use kebab-case for skill directories
- Frontmatter name should match directory name
- Description must start with "Use when..."

### Documentation
- Update README.md with project-specific information
- Keep INSTALL.md files current

### Testing
- Run tests after configuration changes
- Test on all target platforms

## Next Steps

After generating your project structure:

1. **Customize platform configurations** for your specific needs
2. **Add your actual skills** to the skills/ directory
3. **Customize using-{project} skill** with project context
4. **Test on all target platforms**
5. **Share with your team** via Git

Remember: The generated structure is a starting point. Customize it to fit your specific skill library needs.

## Related Skills

- `skill-creator`: How to write effective SKILL.md files following Claude's best practices
- `using-{PROJECT_NAME}`: Understanding multi-platform skill architecture
- `test-driven-development`: Testing methodology for skills

## Notes

- No shell script dependencies - works on Windows, macOS, Linux
- Generated files match multi-platform project standards
- Includes migration guidance for existing projects
- Platform-agnostic tests and utilities