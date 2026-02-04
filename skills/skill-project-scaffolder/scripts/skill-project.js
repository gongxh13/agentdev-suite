#!/usr/bin/env node
/**
 * skill-project.js - Project structure validation for generated skill projects
 *
 * Validates that a generated skill project has the correct structure for
 * multi-platform support (Claude Code, OpenCode, Codex).
 */

const fs = require('fs');
const path = require('path');

// Platform URL patterns for validation
const PLATFORM_URL_PATTERNS = {
  github: {
    raw: /^https:\/\/raw\.githubusercontent\.com\/[^\/]+\/[^\/]+\/refs\/heads\/[^\/]+\/.+$/,
    clone: /^https:\/\/github\.com\/[^\/]+\/[^\/]+\.git$/,
    web: /^https:\/\/github\.com\/[^\/]+\/[^\/]+$/
  },
  gitcode: {
    raw: /^https:\/\/gitcode\.com\/[^\/]+\/[^\/]+\/raw\/[^\/]+\/.+$/,
    clone: /^https:\/\/gitcode\.com\/[^\/]+\/[^\/]+\.git$/,
    web: /^https:\/\/gitcode\.com\/[^\/]+\/[^\/]+$/
  },
  gitlab: {
    raw: /^https:\/\/gitlab\.com\/[^\/]+\/[^\/]+\/-\/raw\/[^\/]+\/.+$/,
    clone: /^https:\/\/gitlab\.com\/[^\/]+\/[^\/]+\.git$/,
    web: /^https:\/\/gitlab\.com\/[^\/]+\/[^\/]+$/
  },
  gitee: {
    raw: /^https:\/\/gitee\.com\/[^\/]+\/[^\/]+\/raw\/[^\/]+\/.+$/,
    clone: /^https:\/\/gitee\.com\/[^\/]+\/[^\/]+\.git$/,
    web: /^https:\/\/gitee\.com\/[^\/]+\/[^\/]+$/
  },
  bitbucket: {
    raw: /^https:\/\/bitbucket\.org\/[^\/]+\/[^\/]+\/raw\/[^\/]+\/.+$/,
    clone: /^https:\/\/bitbucket\.org\/[^\/]+\/[^\/]+\.git$/,
    web: /^https:\/\/bitbucket\.org\/[^\/]+\/[^\/]+$/
  }
};

// Helper function to detect platform from URL
function detectPlatformFromUrl(url) {
  if (!url) return null;

  for (const [platform, patterns] of Object.entries(PLATFORM_URL_PATTERNS)) {
    for (const pattern of Object.values(patterns)) {
      if (pattern.test(url)) {
        return platform;
      }
    }
  }
  return null;
}

// Helper function to validate URL against platform pattern
function validatePlatformUrl(url, platform, type) {
  if (!url || !platform || !type) return false;

  const platformPatterns = PLATFORM_URL_PATTERNS[platform];
  if (!platformPatterns || !platformPatterns[type]) {
    return false;
  }

  return platformPatterns[type].test(url);
}

// Check platform URLs in README.md
function checkPlatformUrlsInReadme(content, projectName, addCheck, addWarning) {
  // Extract URLs from README
  const urlRegex = /https?:\/\/[^\s<>"']+/g;
  const urls = content.match(urlRegex) || [];

  let hasPlatformUrl = false;
  let detectedPlatform = null;
  const platformUrls = {
    github: 0,
    gitcode: 0,
    gitlab: 0,
    gitee: 0,
    bitbucket: 0
  };

  // Count platform URLs
  urls.forEach(url => {
    const platform = detectPlatformFromUrl(url);
    if (platform) {
      hasPlatformUrl = true;
      platformUrls[platform] = (platformUrls[platform] || 0) + 1;
      if (!detectedPlatform) {
        detectedPlatform = platform;
      }
    }
  });

  // Check if README contains platform URLs
  addCheck('README.md platform URLs', hasPlatformUrl, 'README.md missing platform-specific URLs');

  if (hasPlatformUrl && detectedPlatform) {
    // Check for dual installation methods
    const hasRemoteInstallation = content.includes('Remote Installation');
    const hasLocalInstallation = content.includes('Local Installation');

    addCheck(`README.md ${detectedPlatform} platform URLs`, platformUrls[detectedPlatform] > 0,
      `README.md should contain ${detectedPlatform} platform URLs`);

    if (hasRemoteInstallation && hasLocalInstallation) {
      addCheck('README.md dual installation methods', true, 'README.md includes both remote and local installation methods');
    } else {
      addWarning('README.md installation methods', 'README.md should include both remote and local installation methods for each platform');
    }

    // Check for specific platform patterns
    const platformPattern = PLATFORM_URL_PATTERNS[detectedPlatform];
    if (platformPattern) {
      // Check for clone URL
      const hasCloneUrl = urls.some(url => platformPattern.clone.test(url));
      addCheck(`README.md ${detectedPlatform} clone URL`, hasCloneUrl,
        `README.md missing ${detectedPlatform} clone URL`);

      // Check for raw URL (for Codex/OpenCode installation)
      const hasRawUrl = urls.some(url => platformPattern.raw.test(url));
      addCheck(`README.md ${detectedPlatform} raw URL`, hasRawUrl,
        `README.md missing ${detectedPlatform} raw URL for remote installation`);
    }
  }
}

/**
 * Validate a generated skill project structure
 * @param {string} projectPath - Path to the project to validate
 * @param {string} projectName - Expected project name
 * @returns {object} Validation results
 */
function validateSkillProject(projectPath, projectName) {
  const results = {
    valid: true,
    errors: [],
    warnings: [],
    checks: []
  };

  const addCheck = (name, passed, message) => {
    results.checks.push({ name, passed, message });
    if (!passed) {
      results.valid = false;
      results.errors.push(`${name}: ${message}`);
    }
  };

  const addWarning = (name, message) => {
    results.warnings.push(`${name}: ${message}`);
  };

  console.log(`Validating skill project: ${projectName}`);
  console.log(`Project path: ${projectPath}`);
  console.log('='.repeat(60));

  // 1. Check skills directory exists
  const skillsDir = path.join(projectPath, 'skills');
  addCheck('skills directory', fs.existsSync(skillsDir), 'Missing skills directory');

  // 2. Check using-{PROJECT_NAME} skill exists
  const usingSkillPath = path.join(projectPath, 'skills', `using-${projectName}`, 'SKILL.md');
  addCheck(`using-${projectName} skill`, fs.existsSync(usingSkillPath), `Missing using-${projectName} skill`);

  if (fs.existsSync(usingSkillPath)) {
    const content = fs.readFileSync(usingSkillPath, 'utf8');
    addCheck(`using-${projectName} skill name`, content.includes(`name: using-${projectName}`), 'Skill missing correct name in frontmatter');
    addCheck(`using-${projectName} skill description`, content.includes('description: Use when'), 'Skill missing description starting with "Use when"');
  }

  // 3. Check README.md exists with installation instructions
  const readmePath = path.join(projectPath, 'README.md');
  addCheck('README.md', fs.existsSync(readmePath), 'Missing README.md');

  if (fs.existsSync(readmePath)) {
    const content = fs.readFileSync(readmePath, 'utf8');
    addCheck('README.md title', content.includes(`# ${projectName}`), 'README.md missing project title');
    addCheck('README.md installation section', content.includes('## Installation'), 'README.md missing Installation section');
    addCheck('README.md Claude Code instructions', content.includes('Claude Code'), 'README.md missing Claude Code installation instructions');

    // Check for platform URLs in README
    checkPlatformUrlsInReadme(content, projectName, addCheck, addWarning);
  }

  // 4. Check Claude Code configuration
  const pluginJsonPath = path.join(projectPath, '.claude-plugin', 'plugin.json');
  const marketplaceJsonPath = path.join(projectPath, '.claude-plugin', 'marketplace.json');

  addCheck('plugin.json', fs.existsSync(pluginJsonPath), 'Missing plugin.json');
  addCheck('marketplace.json', fs.existsSync(marketplaceJsonPath), 'Missing marketplace.json');

  if (fs.existsSync(pluginJsonPath)) {
    try {
      const plugin = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
      addCheck('plugin.json name', plugin.name === projectName, `plugin.json name mismatch: expected "${projectName}", got "${plugin.name}"`);
      addCheck('plugin.json version', plugin.version === '1.0.0', `plugin.json version mismatch: expected "1.0.0", got "${plugin.version}"`);

      // Check repository URL format
      if (plugin.repository) {
        const repoUrl = typeof plugin.repository === 'string' ? plugin.repository : plugin.repository.url;
        if (repoUrl) {
          const platform = detectPlatformFromUrl(repoUrl);
          addCheck('plugin.json repository URL format', platform !== null,
            `plugin.json repository URL does not match any known platform pattern: ${repoUrl}`);
        }
      }
    } catch (error) {
      addCheck('plugin.json valid JSON', false, `plugin.json is not valid JSON: ${error.message}`);
    }
  }

  if (fs.existsSync(marketplaceJsonPath)) {
    try {
      const marketplace = JSON.parse(fs.readFileSync(marketplaceJsonPath, 'utf8'));
      addCheck('marketplace.json plugins array', marketplace.plugins && Array.isArray(marketplace.plugins), 'marketplace.json missing plugins array');

      if (marketplace.plugins && marketplace.plugins.length > 0) {
        const plugin = marketplace.plugins[0];
        addCheck('marketplace.json plugin name', plugin.name === projectName, `marketplace.json plugin name mismatch: expected "${projectName}", got "${plugin.name}"`);
      }
    } catch (error) {
      addCheck('marketplace.json valid JSON', false, `marketplace.json is not valid JSON: ${error.message}`);
    }
  }

  // 5. Check platform installation guides
  const codexInstallPath = path.join(projectPath, '.codex', 'INSTALL.md');
  const opencodeInstallPath = path.join(projectPath, '.opencode', 'INSTALL.md');

  addCheck('.codex/INSTALL.md', fs.existsSync(codexInstallPath), 'Missing .codex/INSTALL.md');
  addCheck('.opencode/INSTALL.md', fs.existsSync(opencodeInstallPath), 'Missing .opencode/INSTALL.md');

  if (fs.existsSync(codexInstallPath)) {
    const content = fs.readFileSync(codexInstallPath, 'utf8');
    addCheck('.codex/INSTALL.md project name', content.includes(projectName), '.codex/INSTALL.md missing project name');
  }

  if (fs.existsSync(opencodeInstallPath)) {
    const content = fs.readFileSync(opencodeInstallPath, 'utf8');
    addCheck('.opencode/INSTALL.md project name', content.includes(projectName), '.opencode/INSTALL.md missing project name');
  }

  // 6. Check Codex bootstrap files
  const codexBootstrapScript = path.join(projectPath, '.codex', `${projectName}-codex`);
  const codexBootstrapContent = path.join(projectPath, '.codex', `${projectName}-bootstrap.md`);

  addCheck(`.codex/${projectName}-codex`, fs.existsSync(codexBootstrapScript), `Missing .codex/${projectName}-codex bootstrap script`);
  addCheck(`.codex/${projectName}-bootstrap.md`, fs.existsSync(codexBootstrapContent), `Missing .codex/${projectName}-bootstrap.md`);

  // 7. Check OpenCode plugin
  const opencodePlugin = path.join(projectPath, '.opencode', 'plugins', `${projectName}.js`);
  addCheck(`.opencode/plugins/${projectName}.js`, fs.existsSync(opencodePlugin), `Missing OpenCode plugin file`);

  if (fs.existsSync(opencodePlugin)) {
    const content = fs.readFileSync(opencodePlugin, 'utf8');
    addCheck('OpenCode plugin export', content.includes(`${projectName.replace(/-/g, '_')}Plugin`), 'OpenCode plugin missing export');
  }

  // 8. Check package.json
  const packageJsonPath = path.join(projectPath, 'package.json');
  addCheck('package.json', fs.existsSync(packageJsonPath), 'Missing package.json');

  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      addCheck('package.json name', packageJson.name === projectName, `package.json name mismatch: expected "${projectName}", got "${packageJson.name}"`);
      addCheck('package.json test script', packageJson.scripts && packageJson.scripts.test, 'package.json missing test script');
      addCheck('package.json validate script', packageJson.scripts && packageJson.scripts.validate, 'package.json missing validate script');
    } catch (error) {
      addCheck('package.json valid JSON', false, `package.json is not valid JSON: ${error.message}`);
    }
  }

  // 9. Check test files
  const structureTestPath = path.join(projectPath, 'tests', 'structure.test.js');
  const platformValidationPath = path.join(projectPath, 'tests', 'platform-validation.js');

  addCheck('tests/structure.test.js', fs.existsSync(structureTestPath), 'Missing tests/structure.test.js');
  addCheck('tests/platform-validation.js', fs.existsSync(platformValidationPath), 'Missing tests/platform-validation.js');

  // 10. Check shared libraries
  const skillsCorePath = path.join(projectPath, 'lib', 'skills-core.js');
  addCheck('lib/skills-core.js', fs.existsSync(skillsCorePath), 'Missing lib/skills-core.js');

  return results;
}

/**
 * Print validation results
 */
function printResults(results) {
  console.log('\nValidation Results:');
  console.log('='.repeat(60));

  results.checks.forEach((check, index) => {
    const status = check.passed ? '✓' : '✗';
    console.log(`${status} ${check.name}: ${check.message}`);
  });

  if (results.warnings.length > 0) {
    console.log('\nWarnings:');
    results.warnings.forEach(warning => {
      console.log(`⚠️  ${warning}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Overall: ${results.valid ? 'VALID' : 'INVALID'}`);
  console.log(`Checks passed: ${results.checks.filter(c => c.passed).length}/${results.checks.length}`);

  if (!results.valid && results.errors.length > 0) {
    console.log('\nErrors:');
    results.errors.forEach(error => {
      console.log(`❌ ${error}`);
    });
  }

  console.log('='.repeat(60));
  return results.valid;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  // Check for --help or -h flag
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node skill-project.js <project-path> <expected-project-name>

Validate Superpowers-style multi-platform skill project structure for Claude Code, OpenCode, and Codex.

Arguments:
  project-path         Path to the skill project to validate (absolute or relative)
  expected-project-name Expected project name in kebab-case (e.g., my-skill-library)

Options:
  --help, -h           Show this help message

What this validates:
  1. Basic project structure (skills directory, using-{project} skill)
  2. Claude Code configuration (.claude-plugin/plugin.json, marketplace.json)
  3. Codex platform support (.codex/INSTALL.md, bootstrap files)
  4. OpenCode platform support (.opencode/INSTALL.md, plugin)
  5. Package.json configuration with test scripts
  6. Test files (structure.test.js, platform-validation.js)
  7. Shared libraries (lib/skills-core.js)
  8. README.md platform URLs and installation instructions

Examples:
  # Validate a generated project
  node skill-project.js ./my-generated-project my-generated-project

  # Validate current directory
  node skill-project.js . my-skill-library

Exit codes:
  0 - Project structure is valid
  1 - Project structure has errors or missing required files

Note: This validation is based on Superpowers project structure standards.
`);
    process.exit(0);
  }

  if (args.length < 2) {
    console.error('Usage: node skill-project.js <project-path> <expected-project-name>');
    console.error('Use --help for detailed usage information');
    console.error('Example: node skill-project.js ./my-test-project my-test-project');
    process.exit(1);
  }

  const projectPath = path.resolve(args[0]);
  const projectName = args[1];

  if (!fs.existsSync(projectPath)) {
    console.error(`Error: Project path does not exist: ${projectPath}`);
    process.exit(1);
  }

  const results = validateSkillProject(projectPath, projectName);
  const isValid = printResults(results);

  process.exit(isValid ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  validateSkillProject,
  printResults
};