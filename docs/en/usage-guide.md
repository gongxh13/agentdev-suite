# User Usage Guide

This guide provides detailed instructions on using AgentDev Suite for real project development, including feature claiming, development workflow, code submission, and other complete processes.

## Getting Started

### 1. Start Development Coordination with `/using-agentdev-suite`

To begin development with AgentDev Suite, start your conversation with the `/using-agentdev-suite` prefix to automatically route your request to the appropriate coordination workflow.

#### Traditional Software Development Example
In your Claude Code conversation, start with the `/using-agentdev-suite` prefix:
```
/using-agentdev-suite I need to develop a REST API service with user management including registration, authentication, and profile management
```

**Workflow:**
1. `/using-agentdev-suite` prefix triggers the core coordination skill
2. `coordinating-agent-development` is automatically activated
3. `coordinating-agent-development` detects traditional indicators (`src/`, `tests/`, "API", "service")
4. Routes to `traditional-development-coordination`
5. Coordinates intelligent workflow with dynamic agent orchestration:
   - Analyzes task type (complete project development)
   - Selects optimal agent sequence: PM → PO → Architect → Developer → Tester
   - Executes context-adapted workflow based on project maturity

#### Skill Project Development Example
Start with the `/using-agentdev-suite` prefix:
```
/using-agentdev-suite Create a skill project for financial analysis workflows with support for multiple AI platforms
```

**Workflow:**
1. `/using-agentdev-suite` prefix triggers the core coordination skill
2. `coordinating-agent-development` is automatically activated
3. `coordinating-agent-development` detects skill indicators (`skills/`, "skill project", "multi-platform")
4. Routes to `skill-development-coordination`
5. Coordinates intelligent skill development workflow:
   - Analyzes skill task type (complete skill project)
   - Selects optimal agent/skill sequence: Skill Requirements Analyst → Skill Architect → Skill Project Scaffolder → Skill Creator → Skill Tester
   - Executes platform-aware coordination with progressive disclosure optimization

## Feature Development Workflow

AgentDev Suite provides a standardized feature development workflow that ensures code quality and team collaboration efficiency. This workflow integrates with the **feature-management** skill to prevent duplicate work and automate PR creation.

### 1. Overview

Features are typically stored in the `features/` directory of your project. Each feature has its own directory with a `feature.json` file containing metadata about the feature's status, claimant, documentation links, and more.

The complete feature lifecycle includes:
- **Feature Claiming**: Reserve a feature for development to prevent duplicate work
- **Feature Implementation**: Develop the feature using coordinated agent workflows
- **Feature Submission**: Submit completed work and create pull requests

### 2. Feature Claiming Process

Before starting development, you should claim the feature to ensure no one else is working on it.

#### Using `/using-agentdev-suite` for Feature Claiming
Start your conversation with:
```
/using-agentdev-suite help me claim feat-xxx
```

Or use natural language:
```
/using-agentdev-suite I want to develop user authentication system
```

**What happens:**
1. The system checks if the feature already exists in `features/{feature-name}/feature.json`
2. If unclaimed, it creates the feature directory and `feature.json` file with initial claim information
3. If already claimed, it shows conflict information and offers options

**Key points:**
- Model skill invocation has uncertainty. If you see no feature claim happening, stop and manually send a claim command
- Feature names are normalized (lowercase, hyphen-separated)
- Claim information includes: claimant, claim time, status

#### Feature Claim File Structure
After claiming, a `feature.json` file is created with this structure:
```json
{
  "name": "feature-name",
  "title": "Feature Title",
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

### 3. Feature Implementation Process

Once a feature is claimed, you can start implementation using the coordinated agent workflows.

#### Using `/using-agentdev-suite` for Feature Implementation
Start your conversation with:
```
/using-agentdev-suite help me implement feat-xxx
```

Or describe what you need:
```
/using-agentdev-suite I need to implement user authentication with login, registration, and password reset
```

**Workflow:**
1. The system checks feature claim status (must be claimed by you)
2. Activates appropriate coordination based on project type:
   - **Traditional software**: Routes to `traditional-development-coordination`
   - **Skill projects**: Routes to `skill-development-coordination`
3. Coordinates intelligent agent workflows with dynamic orchestration
4. Follows progressive disclosure to load guidance as needed

**Note:** The full development cycle may not complete automatically due to model skill invocation uncertainty. Monitor progress and intervene if needed.

### 4. Feature Submission Process

After completing development, you need to submit the feature and create a pull request.

#### Using `/using-agentdev-suite` for Feature Submission
Start your conversation with:
```
/using-agentdev-suite help me submit feat-xxx
```

**What happens:**
1. **Validation**: Checks required documentation in `feature.json`:
   - PR link (`documentation.pr` array) must contain at least one URL
   - At least one of: requirements, design, tests, or deployment arrays should be non-empty
   - If missing, proactively searches project for relevant files

2. **Automatic PR Creation** (interactive with user confirmation at each step):
   - Creates feature branch (e.g., `feature/feature-name`)
   - Stages and commits changes with semantic commit message
   - Pushes to remote repository
   - Creates pull request using GitHub CLI (`gh`)
   - Updates `feature.json` with PR URL

3. **Platform Support**:
   - **GitHub**: Full automated support via `gh` CLI
   - **Other platforms (GitLab, Bitbucket)**: Automated PR creation may not work; you'll need to create PR manually and add the URL to `feature.json`

#### Manual PR Link Addition
If automatic PR creation fails or you're using a different platform:
1. Create the PR manually through your platform's web interface
2. Add the PR URL to the `documentation.pr` array in `feature.json`:
   ```json
   "documentation": {
     "pr": ["https://github.com/owner/repo/pull/123"]
   }
   ```

### 5. Feature JSON Structure Details

The `feature.json` file tracks the complete feature lifecycle:

```json
{
  "name": "user-authentication",           // Normalized feature name
  "title": "User Authentication System",   // Human-readable title
  "status": "claimed",                     // unclaimed, claimed, completed, blocked
  "claimedBy": "alice-dev",                // GitHub username or identifier
  "claimedAt": "2024-01-15T10:30:00.000Z", // ISO timestamp
  "completedAt": "",                       // Empty until completion
  "documentation": {
    "requirements": [                      // Requirements documents
      "https://example.com/docs/requirements.md"
    ],
    "design": [                            // Design documents, architecture diagrams
      "https://example.com/docs/design.md"
    ],
    "tests": [                             // Test plans, reports
      "https://example.com/docs/test-report.md"
    ],
    "pr": [                                // Pull request links
      "https://github.com/owner/repo/pull/123"
    ],
    "deployment": [                        // Deployment guides
      "https://example.com/docs/deployment.md"
    ],
    "notes": "Additional implementation notes"
  }
}
```

### 6. Best Practices and Notes

1. **Claim Early**: Claim features immediately when planning starts to prevent conflicts
2. **Use Descriptive Names**: Feature names should be clear and specific
3. **Update Promptly**: Submit results immediately after completing development
4. **Add Documentation**: Provide relevant documentation links for requirements, design, tests, etc.
5. **Monitor Automation**: Due to model skill invocation uncertainty, monitor automated workflows and intervene if they stall
6. **Team Coordination**: Share the `features/` directory through git for team visibility
7. **Regular Cleanup**: Periodically review and clean up expired or abandoned claims

### 7. Troubleshooting

**Issue**: Feature claim not happening despite using `/using-agentdev-suite`
**Solution**: Manually send claim command: `/using-agentdev-suite help me claim feat-xxx`

**Issue**: Automatic PR creation fails for non-GitHub platforms
**Solution**: Create PR manually and add URL to `feature.json` `documentation.pr` array

**Issue**: Missing required documentation preventing submission
**Solution**: The system will search for local files; provide URLs or upload documents

**Issue**: Feature already claimed by someone else
**Solution**: System shows conflict details; choose different feature name or coordinate with the claimant