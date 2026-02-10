---
name: feature-management
description: Lightweight feature claim system to prevent duplicate work with automatic PR creation and multiple file support. Use when starting new development tasks to check if feature is already claimed, submitting execution results with multiple documentation files after completing tasks, or creating pull requests with interactive confirmation at each step. Feature information stored in user project's features/ directory with support for multiple documentation links per feature.
---

# Feature Claim Management

Manage feature claims to prevent team duplicate work with automatic PR creation.

## Quick Start

**Basic workflow:** Claim → Develop → Submit → Create PR

**Key commands:**
- "I want to develop [feature]" - Claim a feature
- "[feature] development completed" - Submit results
- "Create PR for [feature]" - Create pull request with interactive confirmation

## Reference Files

Load these files as needed for detailed guidance:

### [WORKFLOW.md](WORKFLOW.md)
Complete workflow details including:
- Intent recognition patterns
- Feature name extraction
- Claim processing logic
- Completion submission process
- File structure and JSON schema

### [PR_CREATION.md](PR_CREATION.md)
Automatic PR creation guide with:
- Interactive workflow with user confirmation at each step
- Platform-specific commands (GitHub, GitLab, Bitbucket)
- PR description templates
- Fallback strategies

### [EXAMPLES.md](EXAMPLES.md)
Usage examples for:
- Starting new feature development
- Completing feature development
- Conflict resolution
- Automatic PR creation
- Documentation search

### [ERRORS.md](ERRORS.md)
Error handling and best practices:
- Common error messages and solutions
- Developer and team best practices
- Important notes and limitations
- Extension suggestions

## When to Load Reference Files

- **For workflow details**: Load WORKFLOW.md when implementing feature claim logic
- **For PR creation**: Load PR_CREATION.md when creating pull requests
- **For examples**: Load EXAMPLES.md when unsure about specific use cases
- **For troubleshooting**: Load ERRORS.md when encountering errors or issues

