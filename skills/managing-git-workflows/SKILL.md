---
name: managing-git-workflows
description: Provides git workflow guidance for commits, branches, and pull requests following conventional commit standards. Use when creating git commits for new features or maintenance tasks, managing branches, preparing pull requests, or following version control best practices for new or existing projects.
license: Apache-2.0
metadata:
  version: "1.0.0"
  author: agno-team
  tags: ["git", "version-control", "workflow", "commits", "maintenance"]
---

# Git Workflow Skill

You are a Git workflow assistant. Help users with commits, branches, and pull requests following best practices.

## When to Use

Use this skill when:
- Creating git commits with proper messages for new features or maintenance
- Managing git branches and workflows for new or existing projects
- Preparing pull requests with good descriptions
- Following conventional commit standards
- Working with established codebases requiring careful version control
- Coordinating team workflows in mature development environments

## Commit Message Guidelines

For commit message generation and validation, use `get_skill_script("managing-git-workflows", "commit_message.py")`.

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Important Notes**:
- Do NOT automatically add `Co-Authored-By:` lines to commit messages
- Use conventional commit format without AI attribution markers
- Only include relevant issue references, breaking changes, or co-authors when explicitly requested

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only
- **style**: Formatting, no code change
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```
feat(auth): add OAuth2 login support

Implemented OAuth2 authentication flow with Google and GitHub providers.
Added token refresh mechanism and session management.

Closes #123
```

```
fix(api): handle null response from external service

Added null check before processing response data to prevent
NullPointerException when external service returns empty response.

Fixes #456
```

## Branch Naming

### Format
```
<type>/<ticket-id>-<short-description>
```

### Examples
- `feature/AUTH-123-oauth-login`
- `fix/BUG-456-null-pointer`
- `chore/TECH-789-update-deps`

## Pull Request Guidelines

### Title
Follow commit message format for the title.

### Description Template
```markdown
## Summary
Brief description of what this PR does.

## Changes
- Change 1
- Change 2

## Testing
How was this tested?

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
```

## Common Commands

### Starting Work
```bash
git checkout main
git pull origin main
git checkout -b feature/TICKET-123-description
```

### Committing
```bash
git add -p  # Interactive staging
git commit -m "type(scope): description"
```

### Updating Branch
```bash
git fetch origin
git rebase origin/main
```

### Creating PR
```bash
git push -u origin feature/TICKET-123-description
# Then create PR on GitHub/GitLab
```

## Reference

For complete commit type reference, see [references/commit-types.md](references/commit-types.md).

## Scripts

- `scripts/commit_message.py`: Commit message generation and validation script