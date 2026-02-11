# Skill Authoring Best Practices

This document consolidates official skill authoring best practices from Anthropic's documentation and internal guidelines. Always reference these principles when creating or updating skills.


## Skill Structure

### YAML Frontmatter Requirements

Every SKILL.md must begin with YAML frontmatter containing:

```yaml
name: skill-name
description: What the skill does and when to use it
```

**name field**:
- Maximum 64 characters
- Lowercase letters, numbers, and hyphens only
- Cannot contain XML tags or reserved words ("anthropic", "claude")
- Recommended: Use **gerund form** (verb + -ing) for clarity
  - Good: `processing-pdfs`, `analyzing-spreadsheets`
  - Avoid: vague names like `helper`, `utils`, `tools`

**description field**:
- Maximum 1024 characters, non-empty, no XML tags
- **Critical for skill selection**: Claude uses this to decide when to trigger the skill
- Include both what the skill does AND specific triggers/contexts for when to use it
- Always write in third person (the description is injected into the system prompt)
- Be specific and include key terms

**Examples of effective descriptions**:
- PDF Processing: "Extract text and tables from PDF files, fill forms, merge documents"
- Excel Analysis: "Analyze Excel spreadsheets, create pivot tables, generate charts"
- Git Commit Helper: "Generate descriptive commit messages by analyzing git diffs"



## Content Guidelines

### Avoid Time-Sensitive Information

Don't include information that will become outdated. Instead, use an "old patterns" section for historical context.

**Bad example** (time-sensitive):
```markdown
If you're doing this before August 2025, use the old API.
After August 2025, use the new API.
```

**Good example** (use "old patterns" section):
```markdown
## Current method
Use the v2 API endpoint: `api.example.com/v2/messages`

## Old patterns
<details>
<summary>Legacy v1 API (deprecated 2025-08)</summary>
The v1 API used: `api.example.com/v1/messages`
This endpoint is no longer supported.
</details>
```

### Use Consistent Terminology

Choose one term and use it throughout the skill:

**Good - Consistent**:
- Always "API endpoint"
- Always "field"
- Always "extract"

**Bad - Inconsistent**:
- Mix "API endpoint", "URL", "API route", "path"
- Mix "field", "box", "element", "control"
- Mix "extract", "pull", "get", "retrieve"


## Evaluation and Iteration

### Build Evaluations First

**Evaluation-driven development**:
1. **Identify gaps**: Run Claude on representative tasks without a skill. Document specific failures or missing context
2. **Create evaluations**: Build three scenarios that test these gaps
3. **Establish baseline**: Measure Claude's performance without the skill
4. **Write minimal instructions**: Create just enough content to address the gaps and pass evaluations
5. **Iterate**: Execute evaluations, compare against baseline, and refine

### Develop Skills Iteratively with Claude

Work with one instance of Claude ("Claude A") to create a skill that will be used by other instances ("Claude B"):

**Creating a new skill**:
1. Complete a task without a skill using normal prompting
2. Identify the reusable pattern from what you repeatedly provided
3. Ask Claude A to create a skill capturing this pattern
4. Review for conciseness and remove unnecessary explanations
5. Test on similar tasks with Claude B
6. Iterate based on observation

**Iterating on existing skills**:
1. Use the skill in real workflows with Claude B
2. Observe Claude B's behavior (struggles, successes, unexpected choices)
3. Return to Claude A for improvements based on observations
4. Review Claude A's suggestions
5. Apply and test changes
6. Repeat based on usage

### Observe How Claude Navigates Skills

Pay attention to how Claude actually uses skills in practice:
- **Unexpected exploration paths**: Does Claude read files in an unexpected order?
- **Missed connections**: Does Claude fail to follow references to important files?
- **Overreliance on certain sections**: If Claude repeatedly reads the same file, consider moving that content to SKILL.md
- **Ignored content**: If Claude never accesses a bundled file, it might be unnecessary

Iterate based on these observations rather than assumptions.

## Anti-Patterns to Avoid

### Avoid Offering Too Many Options

Don't present multiple approaches unless necessary:

**Bad example** (confusing):
```
"You can use pypdf, or pdfplumber, or PyMuPDF, or pdf2image, or..."
```

**Good example** (provide a default with escape hatch):
```
"Use pdfplumber for text extraction:
```python
import pdfplumber
```

For scanned PDFs requiring OCR, use pdf2image with pytesseract instead."
```

### Avoid Windows-Style Paths

Always use forward slashes in file paths, even on Windows:

- ✓ **Good**: `scripts/helper.py`, `reference/guide.md`
- ✗ **Avoid**: `scripts\helper.py`, `reference\guide.md`

### Avoid Assuming Tools Are Installed

Don't assume packages are available:

**Bad example** (assumes installation):
```
"Use the pdf library to process the file."
```

**Good example** (explicit about dependencies):
```
"Install required package: `pip install pypdf`

Then use it:
```python
from pypdf import PdfReader
reader = PdfReader("file.pdf")
```"
```

## Advanced: Skills with Executable Code

### Solve, Don't Punt

When writing scripts for skills, handle error conditions rather than punting to Claude:

**Good example** (handle errors explicitly):
```python
def process_file(path):
    """Process a file, creating it if it doesn't exist."""
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        # Create file with default content instead of failing
        print(f"File {path} not found, creating default")
        with open(path, 'w') as f:
            f.write('')
        return ''
    except PermissionError:
        # Provide alternative instead of failing
        print(f"Cannot access {path}, using default")
        return ''
```

**Bad example** (punt to Claude):
```python
def process_file(path):
    # Just fail and let Claude figure it out
    return open(path).read()
```

### Provide Utility Scripts

Even if Claude could write a script, pre-made scripts offer advantages:
- More reliable than generated code
- Save tokens (no need to include code in context)
- Save time (no code generation required)
- Ensure consistency across uses

### Create Verifiable Intermediate Outputs

For complex operations, use the "plan-validate-execute" pattern:
1. Create a plan in a structured format
2. Validate the plan with a script
3. Execute only after validation passes

**Why this pattern works**:
- Catches errors early before changes are applied
- Machine-verifiable with objective verification
- Reversible planning without touching originals
- Clear debugging with specific error messages

### Package Dependencies

Be aware of platform-specific limitations:
- **claude.ai**: Can install packages from npm and PyPI and pull from GitHub repositories
- **Anthropic API**: Has no network access and no runtime package installation

List required packages in your SKILL.md and verify they're available.

### MCP Tool References

If your skill uses MCP (Model Context Protocol) tools, always use fully qualified tool names to avoid "tool not found" errors:

**Format**: `ServerName:tool_name`

**Example**:
```
Use the BigQuery:bigquery_schema tool to retrieve table schemas.
Use the GitHub:create_issue tool to create issues.
```

## Technical Notes

### Token Budgets

Keep SKILL.md body under 500 lines for optimal performance. If content exceeds this, split into separate files using progressive disclosure patterns.

### Runtime Environment

Skills run in a code execution environment with filesystem access, bash commands, and code execution capabilities:

**How Claude accesses skills**:
1. **Metadata pre-loaded**: At startup, name and description from all skills' YAML frontmatter are loaded into system prompt
2. **Files read on-demand**: Claude uses bash Read tools to access SKILL.md and other files when needed
3. **Scripts executed efficiently**: Utility scripts can be executed via bash without loading full contents into context
4. **No context penalty for large files**: Reference files don't consume context tokens until actually read

## Checklist for Effective Skills

### Core Quality
- [ ] Description is specific and includes key terms
- [ ] Description includes both what the skill does AND when to use it
- [ ] SKILL.md body is under 500 lines
- [ ] Additional details are in separate files (if needed)
- [ ] No time-sensitive information (or in "old patterns" section)
- [ ] Consistent terminology throughout
- [ ] Examples are concrete, not abstract
- [ ] File references are one level deep
- [ ] Progressive disclosure used appropriately
- [ ] Workflows have clear steps

### Code and Scripts
- [ ] Scripts solve problems rather than punt to Claude
- [ ] Error handling is explicit and helpful
- [ ] No "voodoo constants" (all values justified)
- [ ] Required packages listed in instructions and verified as available
- [ ] Scripts have clear documentation
- [ ] No Windows-style paths (all forward slashes)
- [ ] Validation/verification steps for critical operations
- [ ] Feedback loops included for quality-critical tasks

### Testing
- [ ] At least three evaluations created
- [ ] Tested with Haiku, Sonnet, and Opus
- [ ] Tested with real usage scenarios
- [ ] Team feedback incorporated (if applicable)