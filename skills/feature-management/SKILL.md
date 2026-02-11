---
name: feature-management
description: Lightweight feature claim system to prevent duplicate work with automatic PR creation and multiple file support. Use when starting new development tasks to check if feature is already claimed, submitting execution results with multiple documentation files after completing tasks, or creating pull requests with interactive confirmation at each step. Feature information stored in user project's features/ directory with support for multiple documentation links per feature. Note: For git best practices and detailed commit guidelines, use managing-git-workflows skill.
---

# Feature Claim Management

Manage feature claims to prevent team duplicate work with automatic PR creation.

## Quick Start

**Basic workflow:** Claim → Develop → Submit → Create PR

**Key commands:**
- "I want to develop [feature]" - Claim a feature
- "[feature] development completed" - Submit results
- "Create PR for [feature]" - Create pull request with interactive confirmation

## Workflow Details

### Core Principles

1. **Lightweight**: No complex configuration, real-time project status analysis
2. **Project Independent**: Feature information stored in user's current project, not in plugin directory
3. **Duplicate Prevention**: A feature can only be claimed by one user
4. **User Control**: Critical operations require explicit user confirmation at each step
5. **Simple Workflow**: Claim → Develop → Submit results → Create PR

### Intent Recognition

#### Claim Intent
**Keywords**: "develop", "build", "create", "implement", "claim", "work on"
**Patterns**: "I want to [develop/build] [feature]", "claim [feature] feature", "start [feature] development"
**Example**: "I want to develop user authentication system" → Intent: claim, Feature: user-authentication

#### Complete Intent
**Keywords**: "complete", "deploy", "finished", "done", "completed", "PR"
**Patterns**: "[feature] development completed", "[feature] deployed", "update PR link for [feature]"
**Example**: "User authentication development completed, PR URL: https://..." → Intent: complete, Feature: user-authentication

#### PR Creation Intent
**Keywords**: "create pr", "open pr", "submit pr", "pull request", "merge request", "pr for"
**Patterns**: "create PR for [feature]", "open pull request for [feature]", "submit [feature] for review", "generate PR"
**Example**: "Create PR for user authentication feature" → Intent: pr-create, Feature: user-authentication

#### Status Intent
**Keywords**: "status", "check", "view", "who", "working on"
**Patterns**: "check status of [feature]", "who is developing [feature]", "[feature] claim status"
**Example**: "Check payment gateway status" → Intent: status, Feature: payment-gateway

### Feature Name Extraction

**Extraction Patterns:**
- "build/implement/create [feature]" → Extract feature name
- "feature [feature]" → Extract feature name
- "[feature] implementation/development" → Extract feature name
- "develop/complete/check [feature]" → Extract feature name
- Extract PR information from URL: "PR URL: https://github.com/owner/repo/pull/123" → Can associate with feature

**Examples:**
- "I need to build user authentication system" → "user-authentication"
- "Implement payment gateway" → "payment-gateway"
- "Create shopping cart feature" → "shopping-cart"
- "User authentication PR: https://github.com/..." → "user-authentication"

**Name Normalization:** Convert to lowercase, replace spaces with hyphens, remove special characters

### Feature Claim Check

**Primary Feature Location:**
- `features/{feature-name}/feature.json` (standard location - project features directory)

**Feature Status:**
- `unclaimed`: Not claimed, available
- `claimed`: Claimed, in development
- `completed`: Completed
- `blocked`: Blocked

**Project Structure Discovery:**
If the `features/` directory doesn't exist, analyze the project structure to determine the appropriate location:
1. Check common project patterns:
   - **Monorepo**: Look for `packages/`, `apps/`, `libs/` directories
   - **Standard web app**: Look for `src/`, `components/`, `pages/` directories
   - **API/service**: Look for `routes/`, `controllers/`, `services/` directories
   - **Library**: Look for `lib/`, `src/` directories
2. Based on the project structure, create or use appropriate feature location
3. If uncertain, create `features/` directory in project root as default

### Claim Processing Logic

#### Unclaimed Feature
```
1. Create feature claim file: features/{feature-name}/feature.json
2. Record claim information: claimant, time, status
3. Prompt user to start development
```

#### Claimed Feature (Same User)
```
1. Confirm current claim status
2. Prompt to continue development
3. Can update status to "in-progress"
```

#### Claimed Feature (Different User)
```
1. Display conflict warning
2. Show claim information: claimant, claim time
3. Provide options:
   - View details
   - Request to take over
   - Create feature with different name
```

### Multiple File Support

When working on a feature, you can add multiple files for each documentation type:

#### Adding Multiple Documentation Files
```
1. **Check Feature Status:**
   - Ensure feature exists and is claimed by current user
   - Check current feature status is "claimed" or "in-progress"

2. **Add Documentation Links:**
   - Add URLs to the appropriate arrays in the documentation section:
     * requirements: Requirements documents and specifications
     * design: Design documents, architecture diagrams, API specs
     * tests: Test plans, test reports, coverage reports
     * pr: Pull request links
     * deployment: Deployment guides, infrastructure docs

3. **Update Feature JSON:**
   - Add URLs to the appropriate arrays
   - All documentation fields support multiple entries as arrays
```

### Completion Submission

When feature development is completed:

```
1. Validate required fields in feature.json:
   - Check that all required documentation links are provided:
     * PR link (documentation.pr) array must contain at least one URL
     * At least one of: requirements, design, tests, or deployment arrays should be non-empty
   - **If missing required fields, proactively search project for relevant documentation**:
     * Search for design documents: `**/*design*.md`, `**/design/`, `docs/*design*`
     * Search for test documents: `**/*test*.md`, `**/tests/`, `docs/*test*`
     * Search for requirements: `**/*requirements*.md`, `**/requirements/`, `docs/*requirements*`
     * Search for deployment: `**/*deploy*.md`, `**/deployment/`, `docs/*deploy*`
   - If files found locally but not online, prompt user to upload and provide URLs
   - If still missing after search, do not allow submission and prompt user to provide them

2. Update feature status to "completed"
3. Record completion time in completedAt field
4. Add documentation links to appropriate arrays:
   - Requirements documents
   - Design documents
   - Test reports
   - PR links
   - Deployment guides
5. Create git commit (if project uses git)
```

### File Structure

#### Standard Feature Claim File Location
```
User Project/
├── features/                # Feature claim directory
│   └── user-auth/          # Feature directory
│       └── feature.json    # Main feature claim file (JSON format)
├── src/                     # Project source code
├── tests/                   # Test files
└── docs/                    # Project documentation
```

#### Recommended Output Directory Structure
For organized agent outputs that can be referenced in `feature.json` documentation links:
```
features/{feature-name}/
├── feature.json                    # Feature metadata (created by this skill)
├── product-management/             # PM/PO outputs
├── requirements-analysis/          # Requirements analyst outputs
├── architecture/                   # Architect outputs
├── development/                    # Developer outputs
├── testing/                        # Tester outputs
└── documentation/                  # General documentation
```
*Note: Detailed output structure and file naming conventions are defined in development coordination skills.*

#### Multiple File Support Options

**Simple Array Approach** (Recommended)
- All documentation links stored as arrays in `feature.json`
- Each documentation type (requirements, design, tests, pr, deployment) supports multiple entries
- Simple to manage, single file to track

### Feature JSON Structure
```json
{
  "name": "user-authentication",
  "title": "User Authentication System",
  "status": "claimed",
  "claimedBy": "current-username",
  "claimedAt": "2024-01-15T10:30:00.000Z",
  "completedAt": "",
  "documentation": {
    "requirements": [
      "https://example.com/docs/requirements-v1.md",
      "https://example.com/docs/requirements-v2.md"
    ],
    "design": [
      "https://example.com/docs/design/architecture-v1.png",
      "https://example.com/docs/design/api-spec-v1.md"
    ],
    "tests": [
      "https://example.com/docs/tests/test-plan-v1.md",
      "https://example.com/docs/tests/test-report-v1.md"
    ],
    "pr": [
      "https://github.com/owner/repo/pull/123",
      "https://github.com/owner/repo/pull/124"
    ],
    "deployment": [
      "https://example.com/docs/deployment/guide-v1.md",
      "https://example.com/docs/deployment/infrastructure-v1.md"
    ],
    "notes": "Additional implementation notes here"
  }
}
```

## Automatic PR Creation

### Key Design Principle: User Control
Every critical step requires explicit user confirmation before proceeding. The system suggests defaults but never proceeds without user approval.

### PR Creation Workflow

**Git Best Practices Reference**: For detailed commit message formatting, branch naming conventions, and PR guidelines, reference the `managing-git-workflows` skill.


#### 1. Check Git Status
- Verify the project uses git and has changes to commit
- Ask user: "I see uncommitted changes. Should I proceed with creating a PR?"

#### 2. Create Feature Branch (User Confirmation Required)
- Suggest branch name: `feature/{feature-name}` or `{feature-name}`
- Ask user: "Shall I create branch 'feature/user-authentication'? (Confirm or provide alternative name)"

#### 3. Stage and Commit Changes (User Confirmation Required)
- Show git diff summary of changes
- Suggest commit message: "feat: implement {feature-title}"
- Ask user: "Commit with message 'feat: implement User Authentication System'? (Confirm or provide alternative message)"

#### 4. Push to Remote (User Confirmation Required)
- Identify remote (usually 'origin')
- Ask user: "Push to 'origin/feature/user-authentication'? (Confirm or specify different remote)"

#### 5. Create Pull Request (User Confirmation Required)
- Suggest PR title: "feat: {feature-title}"
- Generate PR description from feature.json documentation
- Ask user: "Create PR with title 'feat: User Authentication System'? (Confirm or provide alternative title)"
- Ask user: "Target branch (default: 'main'):"
- Ask user: "Add labels? (e.g., 'feature', 'enhancement')"

#### 6. Update Feature Documentation
- Automatically add PR URL to `documentation.pr` array (supports multiple PR links)
- Mark feature status as "review" or keep as "completed" based on workflow

### Implementation Commands

#### Initialize PR Creation
```bash
# Check git status
git status
# Ask user: "Found X changed files. Proceed with PR creation? (yes/no)"
```

#### Branch Creation with Confirmation
```bash
# Suggest branch name
BRANCH_NAME="feature/user-authentication"
# Ask user: "Create branch '$BRANCH_NAME'? (yes/no/custom-name)"
# If confirmed:
git checkout -b $BRANCH_NAME
```

#### Commit with Confirmation
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

#### Push with Confirmation
```bash
# Ask user: "Push to remote 'origin'? (yes/no/custom-remote)"
git push origin $BRANCH_NAME
```

#### Create PR with Confirmation (GitHub CLI)
```bash
# Ask user for PR details
PR_TITLE="feat: User Authentication System"
PR_BODY="Implements user authentication system with login, registration, and password reset features."
# Ask user: "Create PR with title '$PR_TITLE'? (yes/no/custom-title)"
# Ask user: "Target branch? (default: main)"
# Ask user: "Add labels? (comma-separated)"
gh pr create --title "$PR_TITLE" --body "$PR_BODY" --base main --head "$BRANCH_NAME"
```

#### Update Feature File
```bash
# Get PR URL
PR_URL=$(gh pr view --json url -q '.url')
# Update feature.json - add PR URL to documentation.pr array
jq '.documentation.pr += ["'$PR_URL'\"]' features/user-authentication/feature.json > tmp.json && mv tmp.json features/user-authentication/feature.json
```

### Platform Support

#### GitHub
Use `gh` CLI (preferred):
```bash
gh pr create --title "feat: Feature Title" --body "PR description" --base main --head "feature/name"
```

#### GitLab
Use `glab` CLI:
```bash
glab mr create --title "feat: Feature Title" --description "PR description" --target-branch main
```

#### Bitbucket
Use API or `bb` CLI:
```bash
# Manual instructions provided
```

#### Generic Git
Manual PR creation instructions:
1. Visit repository website
2. Create new Pull Request/Merge Request
3. Source: `feature/{feature-name}`, Target: main
4. Use suggested title and description
5. Provide the PR URL to update feature.json

### Fallback Strategy

If automated PR creation fails or user prefers manual process:
1. Provide branch name and commit hash
2. Provide suggested PR title and description
3. Guide user to create PR manually through web interface
4. Ask user to provide PR URL afterward to update feature.json

### PR Description Template

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

## Error Handling and Best Practices

### Common Errors

#### Project Directory Not Found
```
Error: Cannot determine project directory
Solution: Ensure running in project directory, or specify project path
```

#### No Write Permission
```
Error: Cannot create features/ directory
Solution: Check directory permissions, or use project-appropriate alternative location
```

#### Git Not Initialized
```
Warning: Project not using git, skipping commit step
Solution: Can continue, but recommended to initialize git repository
```

#### GitHub CLI Not Installed
```
Error: GitHub CLI (gh) not installed for automatic PR creation
Solution: Install 'gh' CLI or use manual PR creation workflow
```

#### No Changes to Commit
```
Error: No changes detected to commit for PR creation
Solution: Make sure feature development is complete and changes are staged
```

#### Remote Repository Not Configured
```
Error: No remote repository configured for push
Solution: Add remote with 'git remote add origin <url>' or use existing remote
```

#### Feature File Corrupted
```
Error: Feature JSON file corrupted
Solution: Backup and create new file, or manually repair
```

#### Feature Already Claimed
```
Error: Feature "[feature-name]" already claimed by [user] on [date]
Options:
1. View claim details
2. Request to take over
3. Create new feature with different name
```

#### Missing Required Documentation
```
Error: Missing required documentation for feature completion
Required: PR link (documentation.pr array must contain at least one URL)
At least one of: requirements, design, tests, or deployment arrays should be non-empty

Solution: Provide missing documentation links (can provide multiple) or search project for existing files
```

#### Invalid URL Format
```
Error: Invalid URL format provided for documentation link
Solution: URLs must start with http:// or https://
```

### Best Practices

#### For Developers
1. **Claim Early**: Claim feature immediately when planning starts
2. **Use Descriptive Names**: Feature names should be clear and specific
3. **Update Promptly**: Submit results immediately after completing development
4. **Add Documentation Links**: Provide relevant documentation and PR links
5. **Support Multiple Files**: Add multiple documentation files to appropriate arrays (requirements, design, tests, pr, deployment)
6. **Review Before PR**: Always review changes before creating PR
7. **Use Interactive PR Creation**: Take advantage of the interactive PR creation with confirmation at each step
8. **Provide Clear PR Descriptions**: Use the generated PR description template and customize as needed

#### For Teams
1. **Unified Naming Convention**: Team uses consistent feature naming rules
2. **Regular Cleanup**: Periodically check and clean up expired claims
3. **Communication Coordination**: Timely communication when claim conflicts occur

### Important Notes

1. **Cross-Project Work**: Feature claims are bound to current project, switching projects requires re-claim
2. **No Central Server**: Claim information stored in local project, team needs to share repository
3. **Lightweight Design**: Only provides core functionality, no complex management interface
4. **Simple Location**: Uses standard `features/` directory structure for consistency
5. **User Control**: Critical operations require explicit user confirmation at each step

### Extension Suggestions

If more functionality is needed, consider:

1. **Team Synchronization**: Sync claim information through git
2. **Status Dashboard**: Simple status display
3. **Expiration Cleanup**: Automatically clean up expired claims
4. **Notification Integration**: Claim conflict notifications

**New in this version: Automatic PR Creation** with interactive user confirmation at each step.

This skill focuses on solving duplicate work problems in team development, improving collaboration efficiency through lightweight feature claim mechanisms, now enhanced with automated PR creation workflow.

## Usage Examples

For detailed usage examples, see [examples.md](examples.md) which includes:
- Starting new feature development
- Completing feature development with multiple files
- Conflict resolution scenarios
- Automatic PR creation step-by-step examples
- Documentation search examples
- Adding multiple intermediate files

