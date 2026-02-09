---
name: feature-management
description: Lightweight feature claim system to prevent duplicate work. Use when starting new development tasks to check if feature is already claimed, or submit execution results after completing tasks. Feature information stored in user project's features/ directory.
---

# Feature Claim Management Skill

You are AgentDev Suite's feature claim management assistant. Help users claim features in other projects to prevent team duplicate work. Feature claim information is stored in the `features/` directory of the user's current project.

## When to Use

Use this skill when:

- Checking if a feature is already claimed before starting a new development task
- Claiming a feature to prevent duplicate work by other team members
- Submitting execution results and documentation links after completing a task
- Resolving feature claim conflicts

## Core Principles

1. **Lightweight**: No complex configuration, real-time project status analysis
2. **Project Independent**: Feature information stored in user's current project, not in plugin directory
3. **Duplicate Prevention**: A feature can only be claimed by one user
4. **Simple Workflow**: Claim → Develop → Submit results

## Workflow

### 1. Natural Language Intent Recognition

First identify user intent, supporting three main operations:

**Claim Intent:**
- Keywords: "develop", "build", "create", "implement", "claim", "work on"
- Patterns: "I want to [develop/build] [feature]", "claim [feature] feature", "start [feature] development"
- Example: "I want to develop user authentication system" → Intent: claim, Feature: user-authentication

**Complete Intent:**
- Keywords: "complete", "deploy", "finished", "done", "completed", "PR"
- Patterns: "[feature] development completed", "[feature] deployed", "update PR link for [feature]"
- Example: "User authentication development completed, PR URL: https://..." → Intent: complete, Feature: user-authentication

**Status Intent:**
- Keywords: "status", "check", "view", "who", "working on"
- Patterns: "check status of [feature]", "who is developing [feature]", "[feature] claim status"
- Example: "Check payment gateway status" → Intent: status, Feature: payment-gateway

### 2. Feature Name Extraction

Extract feature name from user request:

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

### 3. Feature Claim Check

Check feature status in user's current project:

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

### 4. Claim Processing Logic

**Unclaimed Feature:**
```
1. Create feature claim file: features/{feature-name}/feature.json
2. Record claim information: claimant, time, status
3. Prompt user to start development
```

**Claimed Feature (Same User):**
```
1. Confirm current claim status
2. Prompt to continue development
3. Can update status to "in-progress"
```

**Claimed Feature (Different User):**
```
1. Display conflict warning
2. Show claim information: claimant, claim time
3. Provide options:
   - View details
   - Request to take over
   - Create feature with different name
```

### 5. Completion Submission

When feature development is completed:

```
0. Validate required fields in feature.json:
   - Check that all required documentation links are provided:
     * PR link (documentation.pr) is required
     * At least one of: requirements, design, tests, or deployment links should be provided
   - **If missing required fields, proactively search project for relevant documentation**:
     * Search for design documents: `**/*design*.md`, `**/design/`, `docs/*design*`
     * Search for test documents: `**/*test*.md`, `**/tests/`, `docs/*test*`
     * Search for requirements: `**/*requirements*.md`, `**/requirements/`, `docs/*requirements*`
     * Search for deployment: `**/*deploy*.md`, `**/deployment/`, `docs/*deploy*`
   - If still missing after search, do not allow submission and prompt user to provide them
1. Update feature status to "completed"
2. Record completion time
3. Add documentation links:
   - Requirements document
   - Design document
   - Test report
   - PR link
   - Deployment link
4. Create git commit (if project uses git)
```

## Implementation Guide

### Feature Claim Process

1. **Determine Project Directory:**
   - Use current working directory (`process.cwd()`)
   - This is the project the user is developing, not the plugin directory

2. **Extract Feature Name:**
   ```javascript
   // Extract feature name from user request
   function extractFeatureName(request) {
     // Pattern matching logic
     // 1. Check --name parameter
     // 2. Extract from request text
     // 3. Generate suggested name
   }
   ```

3. **Check Feature Status:**
   ```bash
   # Check feature claim file
   ls -la features/user-authentication/feature.json
   ```

4. **Create Claim File:**
   ```json
   {
     "name": "user-authentication",
     "title": "User Authentication System",
     "status": "claimed",
     "claimedBy": "current-username",
     "claimedAt": "2024-01-15T10:30:00.000Z",
     "completedAt": "",
     "documentation": {
       "requirements": "",
       "design": "",
       "tests": "",
       "pr": "",
       "deployment": "",
       "notes": ""
     }
   }
   ```

5. **Handle Conflict:**
   - Display claim details
   - Provide resolution options
   - Guide user selection

### Completion Submission Process

1. **Verify Claim Status:**
   - Ensure user has permission to update feature (claimedBy matches current user)
   - Check current feature status is "claimed" or "in-progress"

2. **Validate Required Fields:**
   - Before marking feature as completed, validate that required documentation fields are provided:
     * `documentation.pr` (PR link) is **required** - must be a non-empty URL
     * At least one of the following should be non-empty: `documentation.requirements`, `documentation.design`, `documentation.tests`, `documentation.deployment`
   - If missing required fields, prompt user to provide them and do not proceed with completion submission
   - Check that the provided links are valid URLs (start with http:// or https://)

3. **Find Documentation Links from Current Project (CRITICAL STEP):**
   - **When user doesn't provide specific links, proactively search the project for relevant documentation files**:

   **For `documentation.requirements` (需求文档):**
   - Search for: `**/*requirements*.md`, `**/requirements/**, `docs/*requirements*`, `**/spec*.md`, `**/user-stories*.md`
   - Check recent modified `.md` files in project root or `docs/` directory
   - Look for files containing "requirements", "spec", "specification", "user story"

   **For `documentation.design` (设计文档):**
   - Search for: `**/*design*.md`, `**/design/**, `docs/*design*`, `**/architecture*.md`, `**/diagram*`
   - Check for files with "design", "architecture", "diagram", "wireframe", "mockup" in filename
   - Look in `docs/design/`, `docs/architecture/`, or root-level design documents

   **For `documentation.tests` (测试文档):**
   - Search for: `**/*test*.md`, `**/tests/**, `**/*spec*.md`, `docs/*test*`, `**/testing/`
   - Look for test reports, test plans, coverage reports
   - Check recent test output files or test result summaries

   **For `documentation.deployment` (部署文档):**
   - Search for: `**/*deploy*.md`, `**/deployment/**, `docs/*deploy*`, `**/dockerfile*`, `**/docker-compose*`
   - Look for deployment guides, infrastructure docs, CI/CD configuration
   - Check for files with "deploy", "deployment", "infrastructure", "ci-cd"

   **Search Strategy - Look in Current Modified Files First:**
   1. **Check git diff for recently modified documentation files:**
      - `git diff --name-only HEAD~1 HEAD` (last commit changes)
      - `git status --porcelain` (current unstaged changes)
      - Look for `.md`, `.txt`, `.pdf`, `.docx` files that might be documentation
   2. **Examine current working directory for relevant files:**
      - Use `find . -name "*.md" -type f | head -20` to see markdown files
      - Check for files modified in the last 24 hours: `find . -type f -mtime -1 -name "*.md"`
      - Look in obvious locations: `docs/`, `documentation/`, `specs/`, `design/`, `tests/`
   3. **Analyze file content for relevance:**
      - For potential design files: `grep -l -i "design\|architecture\|diagram" *.md docs/*.md 2>/dev/null`
      - For test files: `grep -l -i "test\|spec\|coverage" *.md tests/*.md 2>/dev/null`
      - For requirements: `grep -l -i "requirement\|specification\|user story" *.md docs/*.md 2>/dev/null`
   4. **If files exist locally but not online:**
      - Prompt user to upload to appropriate service (GitHub, Confluence, Google Docs, etc.)
      - Ask for the URL after upload
      - If it's a local file path, convert to appropriate online reference

   **If no documentation files found:**
   - Prompt user to create minimal documentation before marking feature as completed
   - Suggest creating a simple markdown file with basic documentation
   - Document what was actually implemented in `documentation.notes` field

5. **Update Feature Information:**
   ```bash
   # Update status and documentation links
   {
     "status": "completed",
     "completedAt": "2024-01-20T15:45:00.000Z",
     "documentation": {
       "pr": "https://github.com/project/pr/123",
       "deployment": "https://app.example.com"
     }
   }
   ```

6. **Create Git Commit (Optional):**
   ```bash
   git add features/user-authentication/feature.json
   git commit -m "feat: complete user authentication feature development"
   ```


## Integration Examples

### Example 1: Start New Feature Development
**User:** "I need to build user authentication system"

**Agent Actions:**
1. Extract feature name: "user-authentication"
2. Check `features/user-authentication/feature.json`
3. If not claimed:
   - Create claim file
   - Display: "✓ Claimed 'User Authentication System' feature, now ready to start development"
4. If already claimed:
   - Display claim details and conflict options

### Example 2: Complete Feature Development
**User:** "User authentication development completed, PR URL: https://github.com/.../pull/123"

**Agent Actions:**
1. Extract feature name: "user-authentication"
2. Check claim status (ensure user has permission to update)
3. **Validate required fields:**
   - Check that `documentation.pr` is provided (from user message)
   - **If missing other documentation fields, proactively search project**:
     * **First check git diff for recently modified files**: `git diff --name-only HEAD~1 HEAD 2>/dev/null | grep -E '\.(md|txt|pdf|docx)$' || git status --porcelain 2>/dev/null | grep -E '\.(md|txt|pdf|docx)'`
     * **Search for design docs**: `find . -name "*design*.md" -type f 2>/dev/null | head -5` or check `docs/design/` directory
     * **Search for test docs**: `find . -path "./tests/*.md" -type f 2>/dev/null | head -5` or `find . -name "*test*.md" -type f 2>/dev/null | head -5`
     * **Search for requirements**: `find . -name "*requirements*.md" -type f 2>/dev/null | head -5` or check `docs/requirements/` directory
     * **Search for deployment**: `find . -name "*deploy*.md" -type f 2>/dev/null | head -5` or check `docs/deployment/` directory
   - If files found locally but not online, prompt user to upload and provide URLs
   - If no files found after search, prompt user to create minimal documentation
4. Update feature status to "completed"
5. Add PR link and completion time
6. Display: "✓ 'User Authentication System' marked as completed"

### Example 3: Conflict Resolution
**User:** "I want to develop payment gateway"

**Agent Actions:**
1. Extract feature name: "payment-gateway"
2. Check and find already claimed by "alice"
3. Display:
   ```
   Feature "payment-gateway" already claimed by alice on 2024-01-15

   Options:
   1. View claim details
   2. Request to take over from alice
   3. Create new feature (e.g., payment-gateway-v2)
   ```

## File Structure

### Standard Feature Claim File Location
```
User Project/
├── features/                # Feature claim directory
│   └── user-auth/          # Feature directory
│       └── feature.json    # Feature claim file (JSON format)
├── src/                     # Project source code
├── tests/                   # Test files
└── docs/                    # Project documentation
```

### Project Structure Discovery
If `features/` directory doesn't exist, analyze project structure to determine appropriate location:
- **Web applications**: Create `features/` in project root
- **Monorepo structures**: Create `features/` at appropriate package/app level
- **Library projects**: Create `features/` alongside `src/` or `lib/`
- **Microservices**: Create `features/` in service directory

## Error Handling

### Common Errors

**Project Directory Not Found:**
```
Error: Cannot determine project directory
Solution: Ensure running in project directory, or specify project path
```

**No Write Permission:**
```
Error: Cannot create features/ directory
Solution: Check directory permissions, or use project-appropriate alternative location
```

**Git Not Initialized:**
```
Warning: Project not using git, skipping commit step
Solution: Can continue, but recommended to initialize git repository
```

**Feature File Corrupted:**
```
Error: Feature JSON file corrupted
Solution: Backup and create new file, or manually repair
```

## Best Practices

### For Developers
1. **Claim Early**: Claim feature immediately when planning starts
2. **Use Descriptive Names**: Feature names should be clear and specific
3. **Update Promptly**: Submit results immediately after completing development
4. **Add Documentation Links**: Provide relevant documentation and PR links

### For Teams
1. **Unified Naming Convention**: Team uses consistent feature naming rules
2. **Regular Cleanup**: Periodically check and clean up expired claims
3. **Communication Coordination**: Timely communication when claim conflicts occur

## Important Notes

1. **Cross-Project Work**: Feature claims are bound to current project, switching projects requires re-claim
2. **No Central Server**: Claim information stored in local project, team needs to share repository
3. **Lightweight Design**: Only provides core functionality, no complex management interface
4. **Simple Location**: Uses standard `features/` directory structure for consistency

## Extension Suggestions

If more functionality is needed, consider:

1. **Team Synchronization**: Sync claim information through git
2. **Status Dashboard**: Simple status display
3. **Expiration Cleanup**: Automatically clean up expired claims
4. **Notification Integration**: Claim conflict notifications

This skill focuses on solving duplicate work problems in team development, improving collaboration efficiency through lightweight feature claim mechanisms.