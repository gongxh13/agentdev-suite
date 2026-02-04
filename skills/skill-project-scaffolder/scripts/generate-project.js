#!/usr/bin/env node
/**
 * generate-project.js - Cross-platform skill project generator
 *
 * Generates multi-platform skill projects for Claude Code, OpenCode, and Codex.
 * Works on Windows, macOS, and Linux.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);

// Check for --help or -h flag
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node generate-project.js [options] <project-name> <author-name> <author-email> <github-user> <description>

Generate multi-platform skill projects for Claude Code, OpenCode, and Codex.

Options:
  --update, -u [directory]    Update existing project (default: current directory)
  --platform <platform>        Git platform: github, gitcode, gitlab, gitee, bitbucket (default: github)
  --repo <repository>          Repository name (default: project-name)
  --branch <branch>            Branch name (default: master)
  --help, -h                   Show this help message

Positional arguments:
  project-name                 Project name in kebab-case (e.g., my-skill-library)
  author-name                  Author full name
  author-email                 Author email address
  github-user                  GitHub/GitLab username
  description                  Project description

Examples:
  # New project with GitHub defaults
  node generate-project.js "my-project" "John Doe" "john@example.com" "johndoe" "My skill library"

  # New project with specific platform
  node generate-project.js "my-project" "John Doe" "john@example.com" "johndoe" "My skill library" --platform gitcode

  # Update existing project
  node generate-project.js --update . "my-project" "John Doe" "john@example.com" "johndoe" "My skill library"

  # Update with specific platform
  node generate-project.js --update . "my-project" "John Doe" "john@example.com" "johndoe" "My skill library" --platform gitcode

Platform detection:
  If in a Git repository, script will automatically detect platform, owner, and repository.
  You will be prompted to confirm detected values before generation.
`);
  process.exit(0);
}

// Platform URL patterns mapping
const PLATFORM_URL_PATTERNS = {
  github: {
    raw: 'https://raw.githubusercontent.com/{owner}/{repo}/refs/heads/{branch}/{path}',
    clone: 'https://github.com/{owner}/{repo}.git',
    web: 'https://github.com/{owner}/{repo}',
    rawDomain: 'raw.githubusercontent.com'
  },
  gitcode: {
    raw: 'https://gitcode.com/{owner}/{repo}/raw/{branch}/{path}',
    clone: 'https://gitcode.com/{owner}/{repo}.git',
    web: 'https://gitcode.com/{owner}/{repo}',
    rawDomain: 'gitcode.com'
  },
  gitlab: {
    raw: 'https://gitlab.com/{owner}/{repo}/-/raw/{branch}/{path}',
    clone: 'https://gitlab.com/{owner}/{repo}.git',
    web: 'https://gitlab.com/{owner}/{repo}',
    rawDomain: 'gitlab.com'
  },
  gitee: {
    raw: 'https://gitee.com/{owner}/{repo}/raw/{branch}/{path}',
    clone: 'https://gitee.com/{owner}/{repo}.git',
    web: 'https://gitee.com/{owner}/{repo}',
    rawDomain: 'gitee.com'
  },
  bitbucket: {
    raw: 'https://bitbucket.org/{owner}/{repo}/raw/{branch}/{path}',
    clone: 'https://bitbucket.org/{owner}/{repo}.git',
    web: 'https://bitbucket.org/{owner}/{repo}',
    rawDomain: 'bitbucket.org'
  }
};

// Default platform
const DEFAULT_PLATFORM = 'github';

// Helper functions for platform detection and URL generation
function detectPlatformFromGitRemote(remoteUrl) {
  if (!remoteUrl) return null;

  const url = remoteUrl.toLowerCase();
  if (url.includes('github.com')) return 'github';
  if (url.includes('gitcode.com')) return 'gitcode';
  if (url.includes('gitlab.com')) return 'gitlab';
  if (url.includes('gitee.com')) return 'gitee';
  if (url.includes('bitbucket.org')) return 'bitbucket';

  return null;
}

function parseGitRemoteUrl(remoteUrl) {
  if (!remoteUrl) return { owner: null, repo: null };

  // Remove .git suffix and protocol prefixes
  let cleanUrl = remoteUrl.replace(/\.git$/, '');
  cleanUrl = cleanUrl.replace(/^(https?:\/\/|git@)/, '');
  cleanUrl = cleanUrl.replace(/:/, '/'); // Convert git@github.com:user/repo to github.com/user/repo

  // Extract owner and repo from URL - simpler approach
  const parts = cleanUrl.split('/');
  if (parts.length >= 2) {
    // Last part is repo, second last is owner
    const repo = parts.pop(); // Remove and get last element
    const owner = parts.pop(); // Remove and get second last element
    return { owner, repo };
  }

  return { owner: null, repo: null };
}

function generatePlatformUrl(platform, type, params) {
  const platformPatterns = PLATFORM_URL_PATTERNS[platform] || PLATFORM_URL_PATTERNS[DEFAULT_PLATFORM];
  if (!platformPatterns[type]) {
    throw new Error(`URL type "${type}" not supported for platform "${platform}"`);
  }

  let url = platformPatterns[type];
  for (const [key, value] of Object.entries(params)) {
    url = url.replace(`{${key}}`, value);
  }
  return url;
}

function getGitUrls(platform, owner, repo, branch) {
  const platformPatterns = PLATFORM_URL_PATTERNS[platform] || PLATFORM_URL_PATTERNS[DEFAULT_PLATFORM];

  return {
    raw: generatePlatformUrl(platform, 'raw', { owner, repo, branch, path: '' }).replace('/{path}', ''),
    clone: generatePlatformUrl(platform, 'clone', { owner, repo }),
    web: generatePlatformUrl(platform, 'web', { owner, repo }),
    rawDomain: platformPatterns.rawDomain
  };
}

function detectGitInfo() {
  try {
    // Check if we're in a git repository
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'pipe' });

    // Get remote URL
    const remoteUrl = execSync('git remote get-url origin', { stdio: 'pipe' }).toString().trim();

    const platform = detectPlatformFromGitRemote(remoteUrl);
    const { owner, repo } = parseGitRemoteUrl(remoteUrl);

    return {
      platform,
      owner,
      repo,
      remoteUrl,
      detected: true
    };
  } catch (error) {
    return {
      platform: null,
      owner: null,
      repo: null,
      remoteUrl: null,
      detected: false
    };
  }
}

let UPDATE_MODE = false;
let PROJECT_DIR = null;
let argIndex = 0;

// Check for --update flag
if (args[0] === '--update' || args[0] === '-u') {
  UPDATE_MODE = true;
  argIndex = 1;
  // Next argument could be project directory
  if (args.length > 1 && !args[1].startsWith('--')) {
    PROJECT_DIR = args[1];
    argIndex = 2;
  } else {
    PROJECT_DIR = process.cwd();
  }
}

// Parse named arguments
let platform = DEFAULT_PLATFORM;
let repoName = null;
let branch = 'master';

for (let i = argIndex; i < args.length; i++) {
  if (args[i] === '--platform' && i + 1 < args.length) {
    platform = args[i + 1].toLowerCase();
    i++;
  } else if (args[i] === '--repo' && i + 1 < args.length) {
    repoName = args[i + 1];
    i++;
  } else if (args[i] === '--branch' && i + 1 < args.length) {
    branch = args[i + 1];
    i++;
  }
}

const PROJECT_NAME = args[argIndex] || 'my-skill-library';
const AUTHOR_NAME = args[argIndex + 1] || 'Your Name';
const AUTHOR_EMAIL = args[argIndex + 2] || 'your@email.com';
const GITHUB_USER = args[argIndex + 3] || 'yourusername';
const DESCRIPTION = args[argIndex + 4] || 'A collection of skills for AI coding assistants';

// Determine owner and repo
let owner = GITHUB_USER;
let repo = repoName || PROJECT_NAME;

// Try to detect git info if not provided
const gitInfo = detectGitInfo();
if (gitInfo.detected) {
  console.log(`Detected git repository: ${gitInfo.remoteUrl}`);
  console.log(`  Platform: ${gitInfo.platform || 'Unknown'}`);
  console.log(`  Owner: ${gitInfo.owner || 'Unknown'}`);
  console.log(`  Repository: ${gitInfo.repo || 'Unknown'}`);
  console.log('');

  // Use detected values if not explicitly provided
  if (!repoName && gitInfo.repo) {
    repo = gitInfo.repo;
  }
  if (gitInfo.owner) {
    owner = gitInfo.owner;
  }
  if (gitInfo.platform && platform === DEFAULT_PLATFORM) {
    platform = gitInfo.platform;
  }
}

console.log(`Generating multi-platform skill project: ${PROJECT_NAME}`);
console.log(`Author: ${AUTHOR_NAME} <${AUTHOR_EMAIL}>`);
console.log(`Platform: ${platform}`);
console.log(`Owner: ${owner}`);
console.log(`Repository: ${repo}`);
console.log(`Branch: ${branch}`);
console.log(`Description: ${DESCRIPTION}`);
console.log('');

// Get platform URLs
const gitUrls = getGitUrls(platform, owner, repo, branch);
console.log(`Git URLs:`);
console.log(`  Clone: ${gitUrls.clone}`);
console.log(`  Web: ${gitUrls.web}`);
console.log(`  Raw: ${gitUrls.raw}`);
console.log('');

// Determine project directory
let projectDir;
if (UPDATE_MODE) {
  projectDir = PROJECT_DIR || process.cwd();
  console.log(`Update mode: targeting existing project at ${projectDir}`);
} else {
  projectDir = path.join(process.cwd(), PROJECT_NAME);
}

if (!UPDATE_MODE && fs.existsSync(projectDir)) {
  console.error(`Error: Directory ${PROJECT_NAME} already exists`);
  console.error('Use --update flag to update an existing project.');
  process.exit(1);
}

// Directories to create
const directories = [
  `skills/using-${PROJECT_NAME}`,
  '.claude-plugin',
  '.codex',
  '.opencode/plugins',
  'lib',
  'hooks',
  'tests/claude-code',
  'tests/opencode',
  'tests/skill-triggering'
];

console.log(UPDATE_MODE ? 'Updating project structure...' : 'Creating project structure...');
directories.forEach(dir => {
  // Skip using-{PROJECT_NAME} skill directory in update mode (existing project may have its own workflow skill)
  if (UPDATE_MODE && dir === `skills/using-${PROJECT_NAME}`) {
    return;
  }
  const fullPath = path.join(projectDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`  Created directory: ${dir}`);
  }
});

// Helper function to merge README.md content in update mode
function mergeReadme(existingContent, newContent, projectName) {
  // If no existing content, return new content
  if (!existingContent || existingContent.trim() === '') {
    return newContent;
  }

  // Extract installation section from new README content
  const newLines = newContent.split('\n');
  let installStart = -1;
  let installEnd = -1;

  // Find "## Installation" section in new content
  for (let i = 0; i < newLines.length; i++) {
    if (newLines[i].match(/^##\s+Installation/)) {
      installStart = i;
      // Find end of installation section (next ## section or end)
      for (let j = i + 1; j < newLines.length; j++) {
        if (newLines[j].match(/^##\s+/) && !newLines[j].match(/^##\s+Installation/)) {
          installEnd = j;
          break;
        }
      }
      if (installEnd === -1) {
        installEnd = newLines.length;
      }
      break;
    }
  }

  // If no installation section found in new content, return existing
  if (installStart === -1) {
    return existingContent;
  }

  const newInstallContent = newLines.slice(installStart, installEnd).join('\n');

  // Process existing content - replace or add installation section
  const lines = existingContent.split('\n');
  let existingInstallStart = -1;
  let existingInstallEnd = -1;

  // Find "## Installation" or "## 安装" section in existing content
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^##\s+(Installation|安装)/)) {
      existingInstallStart = i;
      // Find end of this section
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].match(/^##\s+/)) {
          existingInstallEnd = j;
          break;
        }
      }
      if (existingInstallEnd === -1) {
        existingInstallEnd = lines.length;
      }
      break;
    }
  }

  // Check if existing README already has multi-platform content
  const hasMultiPlatform = existingContent.includes('OpenCode') || existingContent.includes('Codex') || existingContent.includes('Multi-Platform Support');

  if (hasMultiPlatform) {
    // Already has multi-platform content, keep existing
    console.log(`  Existing README.md already has multi-platform content, keeping as-is`);
    return existingContent;
  }

  if (existingInstallStart !== -1) {
    // Replace existing installation section with new one
    lines.splice(existingInstallStart, existingInstallEnd - existingInstallStart, newInstallContent);
    return lines.join('\n');
  } else {
    // No installation section found, add it before "## Quick Start" or at the end
    let insertionPoint = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^##\s+Quick Start/)) {
        insertionPoint = i;
        break;
      }
    }
    if (insertionPoint === -1) {
      insertionPoint = lines.length;
    }

    lines.splice(insertionPoint, 0, '', newInstallContent);
    return lines.join('\n');
  }
}

// Helper function to write files with proper line endings
function writeFile(filePath, content) {
  const fullPath = path.join(projectDir, filePath);
  if (UPDATE_MODE && fs.existsSync(fullPath)) {
    // Special handling for README.md in update mode - merge content
    if (filePath === 'README.md') {
      try {
        const existingContent = fs.readFileSync(fullPath, 'utf8');
        const mergedContent = mergeReadme(existingContent, content, PROJECT_NAME);
        fs.writeFileSync(fullPath, mergedContent, 'utf8');
        console.log(`  Merged content into existing: ${filePath}`);
      } catch (error) {
        console.log(`  Error merging ${filePath}, skipping: ${error.message}`);
        return;
      }
    } else {
      console.log(`  File already exists, skipping: ${filePath}`);
    }
    return;
  }
  // Ensure parent directory exists
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content, 'utf8');
}

// 1. .gitignore
writeFile('.gitignore', `node_modules/
.DS_Store
*.log
*.tmp
.env
*.orig
*.bak
`);

// 2. package.json
writeFile('package.json', JSON.stringify({
  name: PROJECT_NAME,
  version: "1.0.0",
  description: DESCRIPTION,
  main: "lib/skills-core.js",
  scripts: {
    test: "node tests/structure.test.js",
    "test:structure": "node tests/structure.test.js",
    "test:platforms": "node tests/platform-validation.js",
    validate: "npm test"
  },
  keywords: ["skills", "claude-code", "opencode", "codex", "ai-assistants"],
  author: `${AUTHOR_NAME} <${AUTHOR_EMAIL}>`,
  license: "MIT",
  repository: {
    type: "git",
    url: gitUrls.clone
  },
  engines: {
    node: ">=14.0.0"
  }
}, null, 2));

// 3. README.md
const codexRawUrl = generatePlatformUrl(platform, 'raw', { owner, repo, branch, path: '.codex/INSTALL.md' });
const opencodeRawUrl = generatePlatformUrl(platform, 'raw', { owner, repo, branch, path: '.opencode/INSTALL.md' });
const claudeRawUrl = generatePlatformUrl(platform, 'raw', { owner, repo, branch, path: '.claude-plugin/INSTALL.md' });

writeFile('README.md', `# ${PROJECT_NAME}

${DESCRIPTION}

## Installation

**Note:** Installation differs by platform and user type (AI assistant vs human).

### For AI Assistants

AI assistants can directly fetch installation instructions:

#### Codex
Tell Codex:
\`\`\`
Fetch and follow instructions from ${codexRawUrl}
\`\`\`

#### OpenCode
Tell OpenCode:
\`\`\`
Fetch and follow instructions from ${opencodeRawUrl}
\`\`\`

#### Claude Code
Tell Claude Code:
\`\`\`
Fetch and follow instructions from ${claudeRawUrl}
\`\`\`

### For Human Users

#### Remote Installation (from Git repository)
Currently only Claude Code supports remote installation from Git repositories:

##### Claude Code

**Command Line:**
\`\`\`bash
# Add Git repository as a marketplace
claude plugin marketplace add ${gitUrls.clone}
# Install the plugin from the added marketplace
claude plugin install ${PROJECT_NAME}
\`\`\`

**In Claude Code (slash commands):**
First, register the marketplace from the Git repository:
\`\`\`
/plugin marketplace add ${gitUrls.clone}
\`\`\`

Then install the plugin from this marketplace. Check the marketplace name with \`/plugin marketplace list\`:
\`\`\`
/plugin install ${PROJECT_NAME}@<marketplace-name>
\`\`\`

*Example (if marketplace is named "${PROJECT_NAME}-marketplace"):*
\`\`\`
/plugin install ${PROJECT_NAME}@${PROJECT_NAME}-marketplace
\`\`\`

#### Source Code Installation
Install from local source code:

##### Claude Code

**Command Line:**
\`\`\`bash
# Add local directory as a marketplace
claude plugin marketplace add ./
# Install the plugin from the local marketplace
claude plugin install ${PROJECT_NAME}
\`\`\`

**In Claude Code (slash commands):**
First, register the local directory as a marketplace (with a name):
\`\`\`
/plugin marketplace add ./ --name ${PROJECT_NAME}-dev
\`\`\`

Then install the plugin from this marketplace:
\`\`\`
/plugin install ${PROJECT_NAME}@${PROJECT_NAME}-dev
\`\`\`

*If you don't specify a name, check the marketplace name with \`/plugin marketplace list\` and use \`@<marketplace-name>\` suffix.*

##### Codex
\`\`\`bash
cp -r . ~/.codex/${PROJECT_NAME}
# Update ~/.codex/AGENTS.md with:
# ## ${PROJECT_NAME}
# <EXTREMELY_IMPORTANT>
# You have access to ${PROJECT_NAME}. RIGHT NOW run: ~/.codex/${PROJECT_NAME}/.codex/${PROJECT_NAME}-codex bootstrap
# </EXTREMELY_IMPORTANT>
\`\`\`

##### OpenCode
\`\`\`bash
git clone ${gitUrls.clone} ~/.config/opencode/${PROJECT_NAME}
mkdir -p ~/.config/opencode/plugins
ln -s ~/.config/opencode/${PROJECT_NAME}/.opencode/plugins/${PROJECT_NAME}.js ~/.config/opencode/plugins/${PROJECT_NAME}.js
mkdir -p ~/.config/opencode/skills
ln -s ~/.config/opencode/${PROJECT_NAME}/skills ~/.config/opencode/skills/${PROJECT_NAME}
\`\`\`

## Using Skills

Once installed, use the \`Skill\` tool to load the core workflow skill:

\`\`\`bash
# In Claude Code conversation
Skill: using-${PROJECT_NAME}
\`\`\`

This skill establishes mandatory skill discipline for using ${PROJECT_NAME} and provides access to all other skills in the library.

## The Core Workflow Skill

The project includes a \`using-${PROJECT_NAME}\` skill that establishes mandatory skill discipline:

- **1% rule**: If any skill has 1% chance of applying, it MUST be invoked
- **Precedence**: Skill check happens BEFORE any response or action
- **No opt-out**: No rationalization or skipping of applicable skills
- **Workflow enforcement**: Ensures consistent use of ${PROJECT_NAME} skill library

## Adding Your Skills

1. Add your skill directories to the \`skills/\` folder
2. Each skill should have a \`SKILL.md\` file with YAML frontmatter:
   \`\`\`yaml
   ---
   name: skill-name
   description: Use when [trigger condition]
   ---
   \`\`\`
3. Test your project structure: \`npm test\`

## Project Structure

\`\`\`
${PROJECT_NAME}/
├── skills/                    # Your skills (add SKILL.md files here)
│   └── using-${PROJECT_NAME}/   # Core workflow skill (auto-generated)
├── .claude-plugin/           # Claude Code configuration
├── .codex/                   # Codex platform support
├── .opencode/                # OpenCode platform support
├── tests/                    # Cross-platform test framework
├── lib/                      # Shared utilities
├── hooks/                    # Session hooks
└── package.json              # Cross-platform package config
\`\`\`

## Testing

Run cross-platform validation:

\`\`\`bash
npm test                    # Basic structure tests
npm run test:platforms      # Platform-specific validation
\`\`\`

## Customization

This is a scaffolded project structure. Customize platform-specific files based on your needs:

- \`.claude-plugin/marketplace.json\`: Update owner information
- \`.opencode/plugins/${PROJECT_NAME}.js\`: Customize OpenCode plugin
- \`.codex/${PROJECT_NAME}-codex\` and \`.codex/${PROJECT_NAME}-bootstrap.md\`: Customize Codex bootstrap
- \`skills/using-${PROJECT_NAME}/SKILL.md\`: Add project-specific context and workflows

Refer to established skill projects for complete examples.
`);

// 4. Using-${PROJECT_NAME} skill (core workflow skill)
writeFile(`skills/using-${PROJECT_NAME}/SKILL.md`, `---
name: using-${PROJECT_NAME}
description: Use when starting any conversation with ${PROJECT_NAME} - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying questions
---

<EXTREMELY-IMPORTANT>
If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill.

IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.

This is not negotiable. This is not optional. You cannot rationalize your way out of this.
</EXTREMELY-IMPORTANT>

## How to Access Skills

**In Claude Code:** Use the \`Skill\` tool. When you invoke a skill, its content is loaded and presented to you—follow it directly. Never use the Read tool on skill files.

**In other environments:** Check your platform's documentation for how skills are loaded.

# Using Skills

## The Rule

**Invoke relevant or requested skills BEFORE any response or action.** Even a 1% chance a skill might apply means that you should invoke the skill to check. If an invoked skill turns out to be wrong for the situation, you don't need to use it.

\`\`\`dot
digraph skill_flow {
    "User message received" [shape=doublecircle];
    "Might any skill apply?" [shape=diamond];
    "Invoke Skill tool" [shape=box];
    "Announce: 'Using [skill] to [purpose]'" [shape=box];
    "Has checklist?" [shape=diamond];
    "Create TodoWrite todo per item" [shape=box];
    "Follow skill exactly" [shape=box];
    "Respond (including clarifications)" [shape=doublecircle];

    "User message received" -> "Might any skill apply?";
    "Might any skill apply?" -> "Invoke Skill tool" [label="yes, even 1%"];
    "Might any skill apply?" -> "Respond (including clarifications)" [label="definitely not"];
    "Invoke Skill tool" -> "Announce: 'Using [skill] to [purpose]'";
    "Announce: 'Using [skill] to [purpose]'" -> "Has checklist?";
    "Has checklist?" -> "Create TodoWrite todo per item" [label="yes"];
    "Has checklist?" -> "Follow skill exactly" [label="no"];
    "Create TodoWrite todo per item" -> "Follow skill exactly";
}
\`\`\`

## Red Flags

These thoughts mean STOP—you're rationalizing:

| Thought | Reality |
|---------|---------|
| "This is just a simple question" | Questions are tasks. Check for skills. |
| "I need more context first" | Skill check comes BEFORE clarifying questions. |
| "Let me explore the codebase first" | Skills tell you HOW to explore. Check first. |
| "I can check git/files quickly" | Files lack conversation context. Check for skills. |
| "Let me gather information first" | Skills tell you HOW to gather information. |
| "This doesn't need a formal skill" | If a skill exists, use it. |
| "I remember this skill" | Skills evolve. Read current version. |
| "This doesn't count as a task" | Action = task. Check for skills. |
| "The skill is overkill" | Simple things become complex. Use it. |
| "I'll just do this one thing first" | Check BEFORE doing anything. |
| "This feels productive" | Undisciplined action wastes time. Skills prevent this. |
| "I know what that means" | Knowing the concept ≠ using the skill. Invoke it. |

## Skill Priority

When multiple skills could apply, use this order:

1. **Process skills first** (brainstorming, debugging) - these determine HOW to approach the task
2. **Implementation skills second** (frontend-design, mcp-builder) - these guide execution

"Let's build X" → brainstorming first, then implementation skills.
"Fix this bug" → debugging first, then domain-specific skills.

## Skill Types

**Rigid** (TDD, debugging): Follow exactly. Don't adapt away discipline.

**Flexible** (patterns): Adapt principles to context.

The skill itself tells you which.

## User Instructions

Instructions say WHAT, not HOW. "Add X" or "Fix Y" doesn't mean skip workflows.

## Customization Notes for ${PROJECT_NAME}

**AUTO-GENERATED TEMPLATE - REVIEW AND CUSTOMIZE FOR YOUR SPECIFIC PROJECT**

This skill provides the core discipline framework for your project. You **must** customize it to make it effective for ${PROJECT_NAME}.

### Why Customize?
The generic template ensures skill discipline, but project-specific context makes it actionable. Without customization, users won't know:
- What ${PROJECT_NAME} actually does
- Which skills are most important for your workflows
- How to apply skills to your specific tasks

### How to Customize
Replace all instances of \`${PROJECT_NAME}\` with your actual project name throughout this file. Then enhance these sections:

1. **Project-specific context**: Explain what ${PROJECT_NAME} is and its scope
   \`\`\`markdown
   ## Project Context
   ${PROJECT_NAME} is a [describe purpose: e.g., "collection of skills for AI-assisted web development"]. It focuses on [key areas: e.g., "React components, API design, testing"].

   **Scope**: [What's included/excluded]
   **Users**: [Who uses these skills]
   **Goals**: [Primary objectives]
   \`\`\`

2. **Key workflows**: Describe the most important ${PROJECT_NAME} workflows that skills enforce
   \`\`\`markdown
   ## Key Workflows
   - **Feature Development**: Brainstorming → TDD → Implementation → Review
   - **Bug Fixing**: Systematic debugging → Root cause analysis → Fix → Verification
   - **Code Review**: Security review → Code quality review → Performance review
   \`\`\`

3. **Skill categories**: List the main skill categories in ${PROJECT_NAME} and their purposes
   \`\`\`markdown
   ## Skill Categories
   - **Process Skills** (brainstorming, debugging, planning): Determine HOW to approach tasks
   - **Implementation Skills** (frontend-design, mcp-builder): Guide execution of specific tasks
   - **Quality Skills** (testing, security-review, code-review): Ensure quality and security
   \`\`\`

4. **Platform-specific guidance**: Add details about how ${PROJECT_NAME} skills work on different platforms
   \`\`\`markdown
   ## Platform Support
   - **Claude Code**: Skills loaded via \`Skill: ${PROJECT_NAME}/using-${PROJECT_NAME}\`
   - **OpenCode**: Skills available via native skill tool
   - **Codex**: Use \`~/.codex/${PROJECT_NAME}/.codex/${PROJECT_NAME}-codex use-skill\`
   \`\`\`

5. **Common use cases**: Provide examples of typical ${PROJECT_NAME} tasks and which skills apply
   \`\`\`markdown
   ## Common Use Cases
   - "Add a new React component" → brainstorming → frontend-design → tdd
   - "Fix API authentication bug" → systematic-debugging → security-review
   - "Optimize database query" → planning → database-reviewer
   \`\`\`

### Customization Checklist
- [ ] Replace all \`${PROJECT_NAME}\` references with your actual project name
- [ ] Add project context section after "User Instructions"
- [ ] Enhance key workflows with your actual development processes
- [ ] List your actual skill categories and purposes
- [ ] Add platform-specific details relevant to your users
- [ ] Provide real use cases from your project
- [ ] Test the customized skill by invoking it in a conversation

### Quick Start Example
For a quick customization, replace this entire "Customization Notes" section with:

\`\`\`markdown
## Project Context
${PROJECT_NAME} is a skill library for [your purpose]. It helps with [primary activities].

## Key Workflows
1. [Your workflow 1]
2. [Your workflow 2]

## Skill Categories
- **Category 1**: [Description]
- **Category 2**: [Description]

## Platform Notes
[Your platform specifics]

## Common Tasks
- "[Task description]" → [skill1] → [skill2]
\`\`\`

Remember: The goal of using-${PROJECT_NAME} is to establish mandatory skill discipline for **your specific project** conversations. Generic templates are ignored; customized skills are followed.
`);

// 5. Claude Code plugin.json (complete format)
writeFile('.claude-plugin/plugin.json', JSON.stringify({
  name: PROJECT_NAME,
  description: DESCRIPTION,
  version: "1.0.0",
  author: {
    name: AUTHOR_NAME,
    email: AUTHOR_EMAIL
  },
  homepage: gitUrls.web,
  repository: gitUrls.clone,
  license: "MIT",
  keywords: ["skills", "claude-code", "best-practices"]
}, null, 2));

// 6. Claude Code marketplace.json (complete format)
writeFile('.claude-plugin/marketplace.json', JSON.stringify({
  name: `${PROJECT_NAME}-dev`,
  description: `Development marketplace for ${PROJECT_NAME} skills library`,
  owner: {
    name: AUTHOR_NAME,
    email: AUTHOR_EMAIL
  },
  plugins: [
    {
      name: PROJECT_NAME,
      description: DESCRIPTION,
      version: "1.0.0",
      source: "./",
      author: {
        name: AUTHOR_NAME,
        email: AUTHOR_EMAIL
      }
    }
  ]
}, null, 2));

// 7. Codex INSTALL.md
writeFile('.codex/INSTALL.md', `# Installing ${PROJECT_NAME} for Codex

## Installation from Repository (For AI Assistants)

When instructed to install ${PROJECT_NAME}, fetch this file and follow these instructions to install from the Git repository:

1. **Clone the repository**:
   \`\`\`bash
   mkdir -p ~/.codex/${PROJECT_NAME}
   cd ~/.codex/${PROJECT_NAME}
   git clone ${gitUrls.clone} .
   \`\`\`

2. **Update your AGENTS.md file**:
   Add the following section to your \`~/.codex/AGENTS.md\`:

   \`\`\`markdown
   ## ${PROJECT_NAME}

   <EXTREMELY_IMPORTANT>
   You have access to ${PROJECT_NAME}. RIGHT NOW run: \`~/.codex/${PROJECT_NAME}/.codex/${PROJECT_NAME}-codex bootstrap\` and follow instructions.
   </EXTREMELY_IMPORTANT>
   \`\`\`

## Verification
\`\`\`bash
~/.codex/${PROJECT_NAME}/.codex/${PROJECT_NAME}-codex bootstrap
\`\`\`

You should see skill listings and bootstrap instructions.

**Note:** After installation, you may need to restart your Codex application for changes to take effect.
`);

// 8. Codex bootstrap script
writeFile(`.codex/${PROJECT_NAME}-codex`, `#!/usr/bin/env node
/**
 * ${PROJECT_NAME} bootstrap script for Codex
 * Multi-platform skill structure
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const homeDir = os.homedir();
const projectSkillsDir = path.join(homeDir, '.codex', '${PROJECT_NAME}', 'skills');
const personalSkillsDir = path.join(homeDir, '.codex', 'skills');
const bootstrapFile = path.join(homeDir, '.codex', '${PROJECT_NAME}', '.codex', '${PROJECT_NAME}-bootstrap.md');

const command = process.argv[2] || 'bootstrap';

if (command === 'bootstrap') {
  // Show bootstrap instructions
  if (fs.existsSync(bootstrapFile)) {
    const content = fs.readFileSync(bootstrapFile, 'utf8');
    console.log(content);
  } else {
    console.log(\`# ${PROJECT_NAME} Bootstrap\`);
    console.log(\`\\nInstallation complete. Skills available in: \${projectSkillsDir}\`);
  }

  // List available skills
  console.log('\\n## Available Skills');
  if (fs.existsSync(projectSkillsDir)) {
    const skills = fs.readdirSync(projectSkillsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    if (skills.length > 0) {
      console.log(\`\\n${PROJECT_NAME} skills:\`);
      skills.forEach(skill => console.log(\`  - ${PROJECT_NAME}:\${skill}\`));
    }
  }

  console.log(\`\\n## Tool Mapping\`);
  console.log(\`- \\\`TodoWrite\\\` → \\\`update_plan\\\` (your planning/task tracking tool)\`);
  console.log(\`- \\\`Task\\\` tool with subagents → Use Codex collab \\\`spawn_agent\\\` + \\\`wait\\\` when available\`);
  console.log(\`- \\\`Subagent\\\` / \\\`Agent\\\` tool mentions → Map to \\\`spawn_agent\\\` (collab)\`);
  console.log(\`- \\\`Skill\\\` tool → \\\`~/.codex/${PROJECT_NAME}/.codex/${PROJECT_NAME}-codex use-skill\\\` command\`);
  console.log(\`- \\\`Read\\\`, \\\`Write\\\`, \\\`Edit\\\`, \\\`Bash\\\` → Your native tools\`);

  console.log(\`\\n## Skills location\`);
  console.log(\`- ${PROJECT_NAME} skills: ~/.codex/${PROJECT_NAME}/skills/\`);
  console.log(\`- Personal skills: ~/.codex/skills/ (override ${PROJECT_NAME} when names match)\`);
} else if (command === 'use-skill') {
  const skillName = process.argv[3];
  if (!skillName) {
    console.error('Usage: use-skill <skill-name>');
    process.exit(1);
  }

  const skillPath = path.join(projectSkillsDir, skillName, 'SKILL.md');
  if (!fs.existsSync(skillPath)) {
    console.error(\`Skill not found: \${skillName}\`);
    process.exit(1);
  }

  const content = fs.readFileSync(skillPath, 'utf8');
  console.log(content);
} else if (command === 'list') {
  if (fs.existsSync(projectSkillsDir)) {
    const skills = fs.readdirSync(projectSkillsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(\`${PROJECT_NAME} skills:\`);
    skills.forEach(skill => console.log(\`  - \${skill}\`));
  } else {
    console.log('No skills found');
  }
} else {
  console.log(\`Usage: \${process.argv[1]} [command]\`);
  console.log('Commands:');
  console.log('  bootstrap      - Show bootstrap instructions');
  console.log('  use-skill <name> - Load a specific skill');
  console.log('  list          - List available skills');
}
`);

// 9. Codex bootstrap content
writeFile(`.codex/${PROJECT_NAME}-bootstrap.md`, `<EXTREMELY_IMPORTANT>
You have ${PROJECT_NAME}.

**Tool for running skills:**
- \`~/.codex/${PROJECT_NAME}/.codex/${PROJECT_NAME}-codex use-skill <skill-name>\`

**Tool Mapping for Codex:**
When skills reference tools you don't have, substitute your equivalent tools:
- \`TodoWrite\` → \`update_plan\` (your planning/task tracking tool)
- \`Task\` tool with subagents → Use Codex collab \`spawn_agent\` + \`wait\` when available; if collab is disabled, state that and proceed sequentially
- \`Subagent\` / \`Agent\` tool mentions → Map to \`spawn_agent\` (collab) or sequential fallback when collab is disabled
- \`Skill\` tool → \`~/.codex/${PROJECT_NAME}/.codex/${PROJECT_NAME}-codex use-skill\` command (already available)
- \`Read\`, \`Write\`, \`Edit\`, \`Bash\` → Use your native tools with similar functions

**Skills naming:**
- ${PROJECT_NAME} skills: \`${PROJECT_NAME}:skill-name\` (from ~/.codex/${PROJECT_NAME}/skills/)
- Personal skills: \`skill-name\` (from ~/.codex/skills/)
- Personal skills override ${PROJECT_NAME} skills when names match

**Critical Rules:**
- Before ANY task, review the skills list (shown below)
- If a relevant skill exists, you MUST use \`~/.codex/${PROJECT_NAME}/.codex/${PROJECT_NAME}-codex use-skill\` to load it
- Announce: "I've read the [Skill Name] skill and I'm using it to [purpose]"
- Skills with checklists require \`update_plan\` todos for each item
- NEVER skip mandatory workflows (brainstorming before coding, TDD, systematic debugging)

**Skills location:**
- ${PROJECT_NAME} skills: ~/.codex/${PROJECT_NAME}/skills/
- Personal skills: ~/.codex/skills/ (override ${PROJECT_NAME} when names match)

IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.
</EXTREMELY_IMPORTANT>
`);

// 10. OpenCode INSTALL.md
writeFile('.opencode/INSTALL.md', `# Installing ${PROJECT_NAME} for OpenCode

## Installation from Repository (For AI Assistants)

When instructed to install ${PROJECT_NAME}, fetch this file and follow these instructions to install from the Git repository:

### 1. Clone Repository
\`\`\`bash
git clone ${gitUrls.clone} ~/.config/opencode/${PROJECT_NAME}
\`\`\`

### 2. Register the Plugin
\`\`\`bash
mkdir -p ~/.config/opencode/plugins
ln -s ~/.config/opencode/${PROJECT_NAME}/.opencode/plugins/${PROJECT_NAME}.js ~/.config/opencode/plugins/${PROJECT_NAME}.js
\`\`\`

### 3. Symlink Skills
\`\`\`bash
mkdir -p ~/.config/opencode/skills
ln -s ~/.config/opencode/${PROJECT_NAME}/skills ~/.config/opencode/skills/${PROJECT_NAME}
\`\`\`

## Verification
\`\`\`bash
# Check plugin is registered
ls -la ~/.config/opencode/plugins/${PROJECT_NAME}.js

# Check skills are linked
ls -la ~/.config/opencode/skills/${PROJECT_NAME}
\`\`\`

**Note:** After installation, you may need to restart OpenCode for changes to take effect.

## Tool Mapping for OpenCode
- \`TodoWrite\` → \`update_plan\`
- \`Task\` tool with subagents → Use OpenCode's subagent system (@mention)
- \`Skill\` tool → OpenCode's native \`skill\` tool
- \`Read\`, \`Write\`, \`Edit\`, \`Bash\` → Your native tools

## Troubleshooting

### Plugin not loading
Check OpenCode logs for errors:
\`\`\`bash
journalctl -u opencode.service -f  # systemd
# or check ~/.config/opencode/logs/
\`\`\`

### Skills not showing up
Verify symlinks:
\`\`\`bash
ls -la ~/.config/opencode/skills/${PROJECT_NAME}
\`\`\`

Should show link to repository skills directory.

### Platform differences
OpenCode has different tool names than Claude Code. The ${PROJECT_NAME} plugin automatically handles tool mapping.
`);

// 11. Claude Code INSTALL.md
writeFile('.claude-plugin/INSTALL.md', `# Installing ${PROJECT_NAME} for Claude Code

## Installation from Repository (For AI Assistants)

When instructed to install ${PROJECT_NAME}, fetch this file and follow these instructions to install from the Git repository:

### 1. Add the repository as a marketplace
\`\`\`bash
claude plugin marketplace add ${gitUrls.clone}
\`\`\`

### 2. Install the plugin
\`\`\`bash
claude plugin install ${PROJECT_NAME}
\`\`\`

### 3. Verify Installation
\`\`\`bash
claude plugin list | grep ${PROJECT_NAME}
\`\`\`

Should show ${PROJECT_NAME} in the list.

**Note:** After installation, you may need to restart Claude Code for changes to take effect.


## Troubleshooting

### Plugin not appearing
Check installation steps:
\`\`\`bash
# List marketplaces to see if repository was added
claude plugin marketplace list

# Try reinstalling
claude plugin uninstall ${PROJECT_NAME}
# Note: Marketplace name may differ from plugin name
# Check marketplace list above for the correct name, then remove it
# claude plugin marketplace remove <marketplace-name>
claude plugin marketplace add ${gitUrls.clone}
claude plugin install ${PROJECT_NAME}
\`\`\`

### Marketplace format errors
Validate JSON:
\`\`\`bash
node -c .claude-plugin/plugin.json
node -c .claude-plugin/marketplace.json
\`\`\`

### Skill loading errors
Check SKILL.md files have proper YAML frontmatter.
`);

// 12. OpenCode plugin template
writeFile(`.opencode/plugins/${PROJECT_NAME}.js`, `/**
 * ${PROJECT_NAME} plugin for OpenCode.ai
 *
 * Injects ${PROJECT_NAME} bootstrap context via system prompt transform.
 * Skills are discovered via OpenCode's native skill tool from symlinked directory.
 */

import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple frontmatter extraction (avoid dependency on skills-core for bootstrap)
const extractAndStripFrontmatter = (content) => {
  const match = content.match(/^---\\n([\\s\\S]*?)\\n---\\n([\\s\\S]*)\$/);
  if (!match) return { frontmatter: {}, content };

  const frontmatterStr = match[1];
  const body = match[2];
  const frontmatter = {};

  for (const line of frontmatterStr.split('\\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']\$/g, '');
      frontmatter[key] = value;
    }
  }

  return { frontmatter, content: body };
};

// Normalize a path: trim whitespace, expand ~, resolve to absolute
const normalizePath = (p, homeDir) => {
  if (!p || typeof p !== 'string') return null;
  let normalized = p.trim();
  if (!normalized) return null;
  if (normalized.startsWith('~/')) {
    normalized = path.join(homeDir, normalized.slice(2));
  } else if (normalized === '~') {
    normalized = homeDir;
  }
  return path.resolve(normalized);
};

export const ${PROJECT_NAME.replace(/-/g, '_')}Plugin = async ({ client, directory }) => {
  const homeDir = os.homedir();
  const projectSkillsDir = path.resolve(__dirname, '../../skills');
  const envConfigDir = normalizePath(process.env.OPENCODE_CONFIG_DIR, homeDir);
  const configDir = envConfigDir || path.join(homeDir, '.config/opencode');

  // Helper to generate bootstrap content
  const getBootstrapContent = () => {
    // Try to load using-${PROJECT_NAME} skill
    const usingSkillPath = path.join(projectSkillsDir, 'using-${PROJECT_NAME}', 'SKILL.md');
    let skillContent = null;
    if (fs.existsSync(usingSkillPath)) {
      const fullContent = fs.readFileSync(usingSkillPath, 'utf8');
      const { content } = extractAndStripFrontmatter(fullContent);
      skillContent = content;
    }

    const toolMapping = \`**Tool Mapping for OpenCode:**
When skills reference tools you don't have, substitute OpenCode equivalents:
- \\\`TodoWrite\\\` → \\\`update_plan\\\`
- \\\`Task\\\` tool with subagents → Use OpenCode's subagent system (@mention)
- \\\`Skill\\\` tool → OpenCode's native \\\`skill\\\` tool
- \\\`Read\\\`, \\\`Write\\\`, \\\`Edit\\\`, \\\`Bash\\\` → Your native tools

**Skills location:**
${PROJECT_NAME} skills are in \\\`\${configDir}/skills/${PROJECT_NAME}/\\\`
Use OpenCode's native \\\`skill\\\` tool to list and load skills.\`;

    if (skillContent) {
      return \`<EXTREMELY_IMPORTANT>
You have ${PROJECT_NAME}.

**IMPORTANT: The using-${PROJECT_NAME} skill content is included below. It is ALREADY LOADED - you are currently following it. Do NOT use the skill tool to load "using-${PROJECT_NAME}" again - that would be redundant.**

\${skillContent}

\${toolMapping}
</EXTREMELY_IMPORTANT>\`;
    } else {
      return \`<EXTREMELY_IMPORTANT>
You have ${PROJECT_NAME} skills.

\${toolMapping}
</EXTREMELY_IMPORTANT>\`;
    }
  };

  return {
    // Use system prompt transform to inject bootstrap (fixes agent reset bug)
    'experimental.chat.system.transform': async (_input, output) => {
      const bootstrap = getBootstrapContent();
      if (bootstrap) {
        (output.system ||= []).push(bootstrap);
      }
    }
  };
};
`);

// 13. Cross-platform structure tests (Pure Node.js - no Jest dependency)
writeFile('tests/structure.test.js', `const fs = require('fs');
const path = require('path');

/**
 * Simple structure validation for skill projects
 * Pure Node.js - no Jest dependency
 */

function validateStructure() {
  const projectRoot = path.resolve(__dirname, '..');
  const results = [];

  // 1. Check skills directory
  const skillsDir = path.join(projectRoot, 'skills');
  if (!fs.existsSync(skillsDir)) {
    results.push({ test: 'has skills directory', passed: false, error: 'Missing skills directory' });
  } else {
    results.push({ test: 'has skills directory', passed: true });
  }

  // 2. Check using-${PROJECT_NAME} skill
  const usingSkillPath = path.join(projectRoot, 'skills/using-${PROJECT_NAME}/SKILL.md');
  if (!fs.existsSync(usingSkillPath)) {
    results.push({ test: 'has using-${PROJECT_NAME} skill', passed: false, error: 'Missing using-${PROJECT_NAME}/SKILL.md' });
  } else {
    try {
      const content = fs.readFileSync(usingSkillPath, 'utf8');
      const hasName = content.includes('name: using-${PROJECT_NAME}');
      const hasDescription = content.includes('description: Use when starting any conversation with ${PROJECT_NAME}');

      if (!hasName || !hasDescription) {
        results.push({
          test: 'has using-${PROJECT_NAME} skill',
          passed: false,
          error: 'SKILL.md missing required frontmatter'
        });
      } else {
        results.push({ test: 'has using-${PROJECT_NAME} skill', passed: true });
      }
    } catch (err) {
      results.push({
        test: 'has using-${PROJECT_NAME} skill',
        passed: false,
        error: \`Error reading SKILL.md: \${err.message}\`
      });
    }
  }

  // 3. Check platform directories
  const platforms = [
    { name: 'Claude Code', path: '.claude-plugin' },
    { name: 'Codex', path: '.codex' },
    { name: 'OpenCode', path: '.opencode' }
  ];

  platforms.forEach(platform => {
    const platformPath = path.join(projectRoot, platform.path);
    if (!fs.existsSync(platformPath)) {
      results.push({
        test: \`has \${platform.name} configuration\`,
        passed: false,
        error: \`Missing \${platform.path} directory\`
      });
    } else {
      results.push({
        test: \`has \${platform.name} configuration\`,
        passed: true
      });
    }
  });

  // 4. Check package.json
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    results.push({ test: 'has package.json', passed: false, error: 'Missing package.json' });
  } else {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const hasRequired = pkg.name && pkg.version && pkg.description;
      results.push({
        test: 'has package.json',
        passed: hasRequired,
        error: hasRequired ? undefined : 'package.json missing required fields'
      });
    } catch (err) {
      results.push({
        test: 'has package.json',
        passed: false,
        error: \`Invalid JSON in package.json: \${err.message}\`
      });
    }
  }

  // 5. Check lib directory
  const libDir = path.join(projectRoot, 'lib');
  if (!fs.existsSync(libDir)) {
    results.push({ test: 'has lib directory', passed: false, error: 'Missing lib directory' });
  } else {
    results.push({ test: 'has lib directory', passed: true });
  }

  return results;
}

// Run validation
const results = validateStructure();

// Display results
console.log(\`=== ${PROJECT_NAME} Project Structure Validation ===\\n\`);

let allPassed = true;
results.forEach(result => {
  const status = result.passed ? '✅ PASS' : '❌ FAIL';
  console.log(\`\${status}: \${result.test}\`);
  if (!result.passed && result.error) {
    console.log(\`   Error: \${result.error}\`);
    allPassed = false;
  }
});

console.log('\\n' + '='.repeat(50));
if (allPassed) {
  console.log('✅ All structure tests passed!');
  process.exit(0);
} else {
  console.log('❌ Some structure tests failed.');
  process.exit(1);
}
`);

// 14. Platform validation tests
writeFile('tests/platform-validation.js', `const fs = require('fs');
const path = require('path');

/**
 * Cross-platform validation for skill project structure
 * Works on Windows, macOS, and Linux
 */

function validateClaudeCode() {
  const pluginPath = path.join(__dirname, '..', '.claude-plugin', 'plugin.json');
  const marketplacePath = path.join(__dirname, '..', '.claude-plugin', 'marketplace.json');

  if (!fs.existsSync(pluginPath)) {
    return { platform: 'Claude Code', valid: false, error: 'Missing plugin.json' };
  }

  if (!fs.existsSync(marketplacePath)) {
    return { platform: 'Claude Code', valid: false, error: 'Missing marketplace.json' };
  }

  const installPath = path.join(__dirname, '..', '.claude-plugin', 'INSTALL.md');
  if (!fs.existsSync(installPath)) {
    return { platform: 'Claude Code', valid: false, error: 'Missing INSTALL.md' };
  }

  try {
    const plugin = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));
    const marketplace = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));

    const errors = [];

    if (!plugin.name || plugin.name !== '${PROJECT_NAME}') {
      errors.push('plugin.json name mismatch');
    }

    if (!marketplace.plugins || !Array.isArray(marketplace.plugins)) {
      errors.push('marketplace.json missing plugins array');
    }

    // Check INSTALL.md content
    const installContent = fs.readFileSync(installPath, 'utf8');
    if (!installContent.includes('${PROJECT_NAME}')) {
      errors.push('INSTALL.md missing project name');
    }

    if (errors.length > 0) {
      return { platform: 'Claude Code', valid: false, error: errors.join(', ') };
    }

    return { platform: 'Claude Code', valid: true };
  } catch (error) {
    return { platform: 'Claude Code', valid: false, error: \`JSON parse error: \${error.message}\` };
  }
}

function validateOpenCode() {
  const installPath = path.join(__dirname, '..', '.opencode', 'INSTALL.md');
  const pluginPath = path.join(__dirname, '..', '.opencode', 'plugins', '${PROJECT_NAME}.js');

  if (!fs.existsSync(installPath)) {
    return { platform: 'OpenCode', valid: false, error: 'Missing INSTALL.md' };
  }

  if (!fs.existsSync(pluginPath)) {
    return { platform: 'OpenCode', valid: false, error: 'Missing plugin file' };
  }

  try {
    const installContent = fs.readFileSync(installPath, 'utf8');
    if (!installContent.includes('${PROJECT_NAME}')) {
      return { platform: 'OpenCode', valid: false, error: 'INSTALL.md missing project name' };
    }

    // Check plugin file has minimum content
    const pluginContent = fs.readFileSync(pluginPath, 'utf8');
    if (!pluginContent.includes('${PROJECT_NAME.replace(/-/g, '_')}Plugin')) {
      return { platform: 'OpenCode', valid: false, error: 'Plugin missing export' };
    }

    return { platform: 'OpenCode', valid: true };
  } catch (error) {
    return { platform: 'OpenCode', valid: false, error: \`Read error: \${error.message}\` };
  }
}

function validateCodex() {
  const installPath = path.join(__dirname, '..', '.codex', 'INSTALL.md');
  const bootstrapScriptPath = path.join(__dirname, '..', '.codex', '${PROJECT_NAME}-codex');
  const bootstrapContentPath = path.join(__dirname, '..', '.codex', '${PROJECT_NAME}-bootstrap.md');

  if (!fs.existsSync(installPath)) {
    return { platform: 'Codex', valid: false, error: 'Missing INSTALL.md' };
  }

  if (!fs.existsSync(bootstrapScriptPath)) {
    return { platform: 'Codex', valid: false, error: 'Missing bootstrap script' };
  }

  if (!fs.existsSync(bootstrapContentPath)) {
    return { platform: 'Codex', valid: false, error: 'Missing bootstrap content' };
  }

  try {
    const installContent = fs.readFileSync(installPath, 'utf8');
    if (!installContent.includes('${PROJECT_NAME}')) {
      return { platform: 'Codex', valid: false, error: 'INSTALL.md missing project name' };
    }

    // Check bootstrap script has shebang
    const scriptContent = fs.readFileSync(bootstrapScriptPath, 'utf8');
    if (!scriptContent.startsWith('#!/usr/bin/env node')) {
      return { platform: 'Codex', valid: false, error: 'Bootstrap script missing shebang' };
    }

    // Check bootstrap content has required markers
    const bootstrapContent = fs.readFileSync(bootstrapContentPath, 'utf8');
    if (!bootstrapContent.includes('<EXTREMELY_IMPORTANT>')) {
      return { platform: 'Codex', valid: false, error: 'Bootstrap content missing required markers' };
    }

    return { platform: 'Codex', valid: true };
  } catch (error) {
    return { platform: 'Codex', valid: false, error: \`Read error: \${error.message}\` };
  }
}

function runValidation() {
  console.log('Validating multi-platform project structure...\\n');

  const results = [
    validateClaudeCode(),
    validateOpenCode(),
    validateCodex()
  ];

  let allValid = true;
  results.forEach(result => {
    const status = result.valid ? '✓' : '✗';
    console.log(\`\${status} \${result.platform}: \${result.valid ? 'Valid' : result.error}\`);
    if (!result.valid) allValid = false;
  });

  console.log('\\n' + (allValid ? 'All platform configurations are valid.' : 'Some platform configurations need attention.'));
  return allValid;
}

// Run validation if called directly
if (require.main === module) {
  const success = runValidation();
  process.exit(success ? 0 : 1);
}

module.exports = {
  validateClaudeCode,
  validateOpenCode,
  validateCodex,
  runValidation
};
`);

// 15. Shared skills core library
writeFile('lib/skills-core.js', `/**
 * Shared utilities for skill projects
 * Cross-platform compatible (Windows, macOS, Linux)
 */

const fs = require('fs');
const path = require('path');

/**
 * Extract YAML frontmatter from SKILL.md content
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\\n([\\s\\S]*?)\\n---\\n([\\s\\S]*)\$/);
  if (!match) return { frontmatter: {}, content: content };

  const frontmatterStr = match[1];
  const body = match[2];
  const frontmatter = {};

  frontmatterStr.split('\\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']\$/g, '');
      frontmatter[key] = value;
    }
  });

  return { frontmatter, content: body };
}

/**
 * Load a skill from SKILL.md file
 */
function loadSkill(skillPath) {
  try {
    const content = fs.readFileSync(skillPath, 'utf8');
    return extractFrontmatter(content);
  } catch (error) {
    console.error(\`Error loading skill from \${skillPath}:\`, error.message);
    return null;
  }
}

/**
 * List available skills in a directory
 */
function listSkills(skillsDir) {
  if (!fs.existsSync(skillsDir)) {
    return [];
  }

  return fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

/**
 * Validate SKILL.md file structure
 */
function validateSkillFile(skillPath) {
  if (!fs.existsSync(skillPath)) {
    return { valid: false, error: 'File does not exist' };
  }

  const content = fs.readFileSync(skillPath, 'utf8');
  const { frontmatter } = extractFrontmatter(content);

  const errors = [];
  if (!frontmatter.name) errors.push('Missing name in frontmatter');
  if (!frontmatter.description) errors.push('Missing description in frontmatter');
  if (frontmatter.description && !frontmatter.description.startsWith('Use when')) {
    errors.push('Description should start with "Use when..."');
  }

  return {
    valid: errors.length === 0,
    errors: errors,
    frontmatter: frontmatter
  };
}

module.exports = {
  extractFrontmatter,
  loadSkill,
  listSkills,
  validateSkillFile
};
`);

// 16. Session start hook
writeFile('hooks/session-start.sh', `#!/usr/bin/env bash
# Session start hook for ${PROJECT_NAME}
# Runs when Claude Code starts a new session in this project

echo "=== ${PROJECT_NAME} Session Start ==="
echo "Project: ${PROJECT_NAME}"
echo "Skills available in: skills/ directory"
echo "================================"

# Customize based on your needs

echo "=== ${PROJECT_NAME} Session Start ==="
echo "Project: ${PROJECT_NAME}"
echo "Skills available in: skills/ directory"
echo "================================"
`);

// Make hook executable (cross-platform approach)
const hookPath = path.join(projectDir, 'hooks/session-start.sh');
fs.chmodSync(hookPath, 0o755);

console.log('');
console.log('='.repeat(60));
if (UPDATE_MODE) {
  console.log(`Multi-platform skill project updated: ${projectDir}`);
  console.log('='.repeat(60));
  console.log('');
  console.log('Update summary:');
  console.log('  Missing platform configurations have been added.');
  console.log('  Existing files were preserved (not overwritten).');
  console.log('');
  console.log('Next steps:');
  console.log(`1. Review added files in ${projectDir}/`);
  console.log('2. Customize platform configurations as needed:');
  console.log('   - .claude-plugin/marketplace.json (update owner info)');
  console.log(`   - .opencode/plugins/${PROJECT_NAME}.js (customize based on your needs)`);
  console.log(`   - .codex/${PROJECT_NAME}-codex and .codex/${PROJECT_NAME}-bootstrap.md (customize based on your needs)`);
  console.log('3. Ensure your skills are in the skills/ directory');
  console.log('4. Test the updated project structure:');
  console.log(`   cd ${projectDir}`);
  console.log('   npm test');
  console.log('   npm run test:platforms');
  console.log('5. Update README.md with your specific information');
  console.log('');
  console.log('Platform configurations added:');
} else {
  console.log(`Multi-platform skill project created: ${PROJECT_NAME}`);
  console.log('='.repeat(60));
  console.log('');
  console.log('Next steps:');
  console.log(`1. Review generated files in ${PROJECT_NAME}/`);
  console.log('2. Customize platform configurations:');
  console.log('   - .claude-plugin/marketplace.json (update owner info)');
  console.log(`   - .opencode/plugins/${PROJECT_NAME}.js (customize based on your needs)`);
  console.log(`   - .codex/${PROJECT_NAME}-codex and .codex/${PROJECT_NAME}-bootstrap.md (customize based on your needs)`);
  console.log('3. Add your skills to the skills/ directory');
  console.log('4. Test the project structure:');
  console.log(`   cd ${PROJECT_NAME}`);
  console.log('   npm test');
  console.log('   npm run test:platforms');
  console.log('5. Update README.md with your specific information');
  console.log('');
  console.log('Platform configurations generated:');
}
console.log('  ✅ Claude Code: Complete plugin.json, marketplace.json, and INSTALL.md');
console.log('  ✅ OpenCode: INSTALL.md and plugin template');
console.log('  ✅ Codex: Complete INSTALL.md, bootstrap script, and bootstrap content');
console.log('  ✅ README.md: Complete installation instructions and project documentation');
console.log('  ✅ Cross-platform tests: Node.js-based validation');
console.log('');
console.log('Note: This is a scaffolded project structure.');
console.log('Customize platform-specific files based on your needs.');
console.log('='.repeat(60));