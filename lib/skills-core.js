/**
 * Shared utilities for skill projects
 * Cross-platform compatible (Windows, macOS, Linux)
 */

const fs = require('fs');
const path = require('path');

/**
 * Extract YAML frontmatter from SKILL.md content
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content: content };

  const frontmatterStr = match[1];
  const body = match[2];
  const frontmatter = {};

  frontmatterStr.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
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
    console.error(`Error loading skill from ${skillPath}:`, error.message);
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
