/**
 * agentdev-suite plugin for OpenCode.ai
 *
 * Injects agentdev-suite bootstrap context via system prompt transform.
 * Skills are discovered via OpenCode's native skill tool from symlinked directory.
 */

import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple frontmatter extraction (avoid dependency on skills-core for bootstrap)
const extractAndStripFrontmatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content };

  const frontmatterStr = match[1];
  const body = match[2];
  const frontmatter = {};

  for (const line of frontmatterStr.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
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

export const agentdev_suitePlugin = async ({ client, directory }) => {
  const homeDir = os.homedir();
  const projectSkillsDir = path.resolve(__dirname, '../../skills');
  const envConfigDir = normalizePath(process.env.OPENCODE_CONFIG_DIR, homeDir);
  const configDir = envConfigDir || path.join(homeDir, '.config/opencode');

  // Helper to generate bootstrap content
  const getBootstrapContent = () => {
    // Try to load using-agentdev-suite skill
    const usingSkillPath = path.join(projectSkillsDir, 'using-agentdev-suite', 'SKILL.md');
    let skillContent = null;
    if (fs.existsSync(usingSkillPath)) {
      const fullContent = fs.readFileSync(usingSkillPath, 'utf8');
      const { content } = extractAndStripFrontmatter(fullContent);
      skillContent = content;
    }

    const toolMapping = `**Tool Mapping for OpenCode:**
When skills reference tools you don't have, substitute OpenCode equivalents:
- \`TodoWrite\` → \`update_plan\`
- \`Task\` tool with subagents → Use OpenCode's subagent system (@mention)
- \`Skill\` tool → OpenCode's native \`skill\` tool
- \`Read\`, \`Write\`, \`Edit\`, \`Bash\` → Your native tools

**Skills location:**
agentdev-suite skills are in \`${configDir}/skills/agentdev-suite/\`
Use OpenCode's native \`skill\` tool to list and load skills.`;

    if (skillContent) {
      return `<EXTREMELY_IMPORTANT>
You have agentdev-suite.

**IMPORTANT: The using-agentdev-suite skill content is included below. It is ALREADY LOADED - you are currently following it. Do NOT use the skill tool to load "using-agentdev-suite" again - that would be redundant.**

${skillContent}

${toolMapping}
</EXTREMELY_IMPORTANT>`;
    } else {
      return `<EXTREMELY_IMPORTANT>
You have agentdev-suite skills.

${toolMapping}
</EXTREMELY_IMPORTANT>`;
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
