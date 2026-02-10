# Feature Management Workflow

## Core Principles

1. **Lightweight**: No complex configuration, real-time project status analysis
2. **Project Independent**: Feature information stored in user's current project, not in plugin directory
3. **Duplicate Prevention**: A feature can only be claimed by one user
4. **User Control**: Critical operations require explicit user confirmation at each step
5. **Simple Workflow**: Claim → Develop → Submit results → Create PR

## Intent Recognition

### Claim Intent
**Keywords**: "develop", "build", "create", "implement", "claim", "work on"
**Patterns**: "I want to [develop/build] [feature]", "claim [feature] feature", "start [feature] development"
**Example**: "I want to develop user authentication system" → Intent: claim, Feature: user-authentication

### Complete Intent
**Keywords**: "complete", "deploy", "finished", "done", "completed", "PR"
**Patterns**: "[feature] development completed", "[feature] deployed", "update PR link for [feature]"
**Example**: "User authentication development completed, PR URL: https://..." → Intent: complete, Feature: user-authentication

### PR Creation Intent
**Keywords**: "create pr", "open pr", "submit pr", "pull request", "merge request", "pr for"
**Patterns**: "create PR for [feature]", "open pull request for [feature]", "submit [feature] for review", "generate PR"
**Example**: "Create PR for user authentication feature" → Intent: pr-create, Feature: user-authentication

### Status Intent
**Keywords**: "status", "check", "view", "who", "working on"
**Patterns**: "check status of [feature]", "who is developing [feature]", "[feature] claim status"
**Example**: "Check payment gateway status" → Intent: status, Feature: payment-gateway

## Feature Name Extraction

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

## Feature Claim Check

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

## Claim Processing Logic

### Unclaimed Feature
```
1. Create feature claim file: features/{feature-name}/feature.json
2. Record claim information: claimant, time, status
3. Prompt user to start development
```

### Claimed Feature (Same User)
```
1. Confirm current claim status
2. Prompt to continue development
3. Can update status to "in-progress"
```

### Claimed Feature (Different User)
```
1. Display conflict warning
2. Show claim information: claimant, claim time
3. Provide options:
   - View details
   - Request to take over
   - Create feature with different name
```

## Multiple File Support

When working on a feature, you can add multiple files for each documentation type:

### Adding Multiple Documentation Files
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

## Completion Submission

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

## File Structure

### Standard Feature Claim File Location
```
User Project/
├── features/                # Feature claim directory
│   └── user-auth/          # Feature directory
│       └── feature.json    # Main feature claim file (JSON format)
├── src/                     # Project source code
├── tests/                   # Test files
└── docs/                    # Project documentation
```

### Multiple File Support Options

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