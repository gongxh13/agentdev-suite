# Usage Examples

## Example 1: Start New Feature Development

**User:** "I need to build user authentication system"

**Agent Actions:**
1. Extract feature name: "user-authentication"
2. Check `features/user-authentication/feature.json`
3. If not claimed:
   - Create claim file
   - Display: "✓ Claimed 'User Authentication System' feature, now ready to start development"
4. If already claimed:
   - Display claim details and conflict options

## Example 2: Complete Feature Development with Multiple Files

**User:** "User authentication development completed, PR URLs: https://github.com/.../pull/123, https://github.com/.../pull/124"

**Agent Actions:**
1. Extract feature name: "user-authentication"
2. Check claim status (ensure user has permission to update)
3. **Validate required fields:**
   - Check that `documentation.pr` array contains at least one URL (from user message, can add multiple)
   - **If missing other documentation fields, proactively search project for multiple files**:
     * **First check git diff for recently modified files**: `git diff --name-only HEAD~1 HEAD 2>/dev/null | grep -E '\.(md|txt|pdf|docx)$' || git status --porcelain 2>/dev/null | grep -E '\.(md|txt|pdf|docx)'`
     * **Search for design docs**: `find . -name "*design*.md" -type f 2>/dev/null | head -5` or check `docs/design/` directory
     * **Search for test docs**: `find . -path "./tests/*.md" -type f 2>/dev/null | head -5` or `find . -name "*test*.md" -type f 2>/dev/null | head -5`
     * **Search for requirements**: `find . -name "*requirements*.md" -type f 2>/dev/null | head -5` or check `docs/requirements/` directory
     * **Search for deployment**: `find . -name "*deploy*.md" -type f 2>/dev/null | head -5` or check `docs/deployment/` directory
   - If files found locally but not online, prompt user to upload and provide URLs (can provide multiple URLs for each type)
   - If no files found after search, prompt user to create minimal documentation
4. Update feature status to "completed"
5. **Add multiple documentation links to arrays:**
   - Add PR links to `documentation.pr` array
   - Add requirements, design, tests, deployment links to respective arrays
   - All documentation fields support multiple entries
6. Display: "✓ 'User Authentication System' marked as completed with multiple documentation files"

## Example 3: Conflict Resolution

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

## Example 4: Automatic PR Creation

**User:** "Create PR for user authentication feature"

**Agent Actions:**
1. Extract feature name: "user-authentication"
2. Check feature status and verify user has permission
3. **Start interactive PR creation with user confirmations:**

   **Step 1 - Initial Confirmation:**
   ```
   Ready to create PR for 'User Authentication System'?
   This will:
   1. Create branch 'feature/user-authentication'
   2. Commit current changes
   3. Push to remote
   4. Create Pull Request on GitHub

   Proceed? (yes/no)
   ```

   **Step 2 - Branch Creation (if user confirms):**
   ```
   Create branch 'feature/user-authentication'?
   Options: yes / no / enter-custom-name
   ```

   **Step 3 - Commit Changes:**
   ```
   Found 12 changed files. Stage all for commit? (yes/no/select-files)

   Suggested commit message: "feat: implement User Authentication System"
   Confirm or edit commit message:
   ```

   **Step 4 - Push to Remote:**
   ```
   Push to 'origin/feature/user-authentication'? (yes/no/custom-remote)
   ```

   **Step 5 - PR Creation:**
   ```
   PR title: "feat: User Authentication System" (confirm/edit)
   Target branch: main (confirm/edit)
   Labels: feature,enhancement (confirm/edit/add/remove)
   ```

   **Step 6 - Update Feature File:**
   ```
   PR created: https://github.com/owner/repo/pull/123
   Updated feature.json with PR link and set status to 'review'
   ```

4. If any step is rejected by user:
   - Provide alternative options
   - Allow manual override
   - Save progress for later continuation

## Example 5: Documentation Search

**User:** "Complete payment gateway feature"

**Agent Actions:**
1. Extract feature name: "payment-gateway"
2. Check claim status and permissions
3. **Search for missing documentation:**

   **For requirements:**
   ```bash
   find . -name "*requirements*.md" -type f 2>/dev/null | head -5
   grep -l -i "requirement\|specification\|user story" *.md docs/*.md 2>/dev/null
   ```

   **For design:**
   ```bash
   find . -name "*design*.md" -type f 2>/dev/null | head -5
   grep -l -i "design\|architecture\|diagram" *.md docs/*.md 2>/dev/null
   ```

   **For tests:**
   ```bash
   find . -path "./tests/*.md" -type f 2>/dev/null | head -5
   grep -l -i "test\|spec\|coverage" *.md tests/*.md 2>/dev/null
   ```

   **For deployment:**
   ```bash
   find . -name "*deploy*.md" -type f 2>/dev/null | head -5
   grep -l -i "deploy\|deployment\|infrastructure" *.md docs/*.md 2>/dev/null
   ```

4. If files found but not online URLs:
   - Prompt user to upload to appropriate service
   - Ask for URLs after upload
5. If no files found:
   - Prompt user to create minimal documentation
   - Suggest creating simple markdown files
6. Update feature status and documentation links

## Example 6: Adding Multiple Intermediate Files

**Scenario:** During feature development, you create multiple intermediate files (design docs, test plans, code files) and want to track them.

**Agent Actions:**
1. **Add multiple design documents:**
   - User provides: "Add design docs: architecture-v1.png, api-spec-v1.md"
   - Add URLs to `documentation.design` array:
     ```json
     "design": [
       "https://example.com/design/architecture-v1.png",
       "https://example.com/design/api-spec-v1.md",
       "https://example.com/design/wireframe-v1.pdf"
     ]
     ```

2. **Add multiple PR links over time:**
   - User provides: "Added another PR: https://github.com/.../pull/124"
   - Add to existing `documentation.pr` array:
     ```json
     "pr": [
       "https://github.com/owner/repo/pull/123",
       "https://github.com/owner/repo/pull/124"
     ]
     ```

3. **Add multiple test reports:**
   - User provides test report URLs
   - Add to `documentation.tests` array:
     ```json
     "tests": [
       "https://example.com/tests/unit-test-report.md",
       "https://example.com/tests/integration-test-report.md",
       "https://example.com/tests/performance-test-report.md"
     ]
     ```

4. **Validation ensures all arrays work correctly:**
   - All documentation fields are arrays, can contain multiple entries
   - Validation checks arrays for at least one entry where required
   - Search functionality finds multiple relevant files