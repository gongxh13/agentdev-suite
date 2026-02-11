# Automatic PR Creation

## Key Design Principle: User Control
Every critical step requires explicit user confirmation before proceeding. The system suggests defaults but never proceeds without user approval.

## PR Creation Workflow

**Git Best Practices Reference**: For detailed commit message formatting, branch naming conventions, and PR guidelines, reference the `managing-git-workflows` skill.

**Key rule**: Never automatically add `Co-Authored-By:` to commit messages.

### 1. Check Git Status
- Verify the project uses git and has changes to commit
- Ask user: "I see uncommitted changes. Should I proceed with creating a PR?"

### 2. Create Feature Branch (User Confirmation Required)
- Suggest branch name: `feature/{feature-name}` or `{feature-name}`
- Ask user: "Shall I create branch 'feature/user-authentication'? (Confirm or provide alternative name)"

### 3. Stage and Commit Changes (User Confirmation Required)
- Show git diff summary of changes
- Suggest commit message: "feat: implement {feature-title}"
- Ask user: "Commit with message 'feat: implement User Authentication System'? (Confirm or provide alternative message)"

### 4. Push to Remote (User Confirmation Required)
- Identify remote (usually 'origin')
- Ask user: "Push to 'origin/feature/user-authentication'? (Confirm or specify different remote)"

### 5. Create Pull Request (User Confirmation Required)
- Suggest PR title: "feat: {feature-title}"
- Generate PR description from feature.json documentation
- Ask user: "Create PR with title 'feat: User Authentication System'? (Confirm or provide alternative title)"
- Ask user: "Target branch (default: 'main'):"
- Ask user: "Add labels? (e.g., 'feature', 'enhancement')"

### 6. Update Feature Documentation
- Automatically add PR URL to `documentation.pr` array (supports multiple PR links)
- Mark feature status as "review" or keep as "completed" based on workflow

## Implementation Commands

### Initialize PR Creation
```bash
# Check git status
git status
# Ask user: "Found X changed files. Proceed with PR creation? (yes/no)"
```

### Branch Creation with Confirmation
```bash
# Suggest branch name
BRANCH_NAME="feature/user-authentication"
# Ask user: "Create branch '$BRANCH_NAME'? (yes/no/custom-name)"
# If confirmed:
git checkout -b $BRANCH_NAME
```

### Commit with Confirmation
```bash
# Show changes
git diff --stat
# Ask user: "Commit these changes? (yes/no)"
# If yes:
git add .
# Ask for commit message
COMMIT_MSG="feat: implement User Authentication System"
# Ask user: "Use commit message '$COMMIT_MSG'? (yes/no/custom-message)"
git commit -m "$COMMIT_MSG"
```

### Push with Confirmation
```bash
# Ask user: "Push to remote 'origin'? (yes/no/custom-remote)"
git push origin $BRANCH_NAME
```

### Create PR with Confirmation (GitHub CLI)
```bash
# Ask user for PR details
PR_TITLE="feat: User Authentication System"
PR_BODY="Implements user authentication system with login, registration, and password reset features."
# Ask user: "Create PR with title '$PR_TITLE'? (yes/no/custom-title)"
# Ask user: "Target branch? (default: main)"
# Ask user: "Add labels? (comma-separated)"
gh pr create --title "$PR_TITLE" --body "$PR_BODY" --base main --head "$BRANCH_NAME"
```

### Update Feature File
```bash
# Get PR URL
PR_URL=$(gh pr view --json url -q '.url')
# Update feature.json - add PR URL to documentation.pr array
jq '.documentation.pr += ["'$PR_URL'"]' features/user-authentication/feature.json > tmp.json && mv tmp.json features/user-authentication/feature.json
```

## Platform Support

### GitHub
Use `gh` CLI (preferred):
```bash
gh pr create --title "feat: Feature Title" --body "PR description" --base main --head "feature/name"
```

### GitLab
Use `glab` CLI:
```bash
glab mr create --title "feat: Feature Title" --description "PR description" --target-branch main
```

### Bitbucket
Use API or `bb` CLI:
```bash
# Manual instructions provided
```

### Generic Git
Manual PR creation instructions:
1. Visit repository website
2. Create new Pull Request/Merge Request
3. Source: `feature/{feature-name}`, Target: main
4. Use suggested title and description
5. Provide the PR URL to update feature.json

## Fallback Strategy

If automated PR creation fails or user prefers manual process:
1. Provide branch name and commit hash
2. Provide suggested PR title and description
3. Guide user to create PR manually through web interface
4. Ask user to provide PR URL afterward to update feature.json

## PR Description Template

```markdown
## Summary
Implements [feature-title] with [key functionality].

## Changes
- [Change 1]
- [Change 2]
- [Change 3]

## Documentation
- Design: [link to design doc]
- Tests: [link to test results]
- Deployment: [link to deployment guide]

## Feature Claim
This feature was claimed and developed as part of the feature management system.
```