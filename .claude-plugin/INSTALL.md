# Installing agentdev-suite for Claude Code

## Installation from Repository (For AI Assistants)

When instructed to install agentdev-suite, fetch this file and follow these instructions to install from the Git repository:

### 1. Add the repository as a marketplace
```bash
claude plugin marketplace add https://github.com/gongxh13/agentdev-suite.git
```

### 2. Install the plugin
```bash
claude plugin install agentdev-suite
```

### 3. Verify Installation
```bash
claude plugin list | grep agentdev-suite
```

Should show agentdev-suite in the list.

**Note:** After installation, you may need to restart Claude Code for changes to take effect.

## Troubleshooting

### Plugin not appearing
Check installation steps:
```bash
# List marketplaces to see if repository was added
claude plugin marketplace list

# Try reinstalling
claude plugin uninstall agentdev-suite
# Note: Marketplace name may differ from plugin name
# Check marketplace list above for the correct name, then remove it
# claude plugin marketplace remove <marketplace-name>
claude plugin marketplace add https://github.com/gongxh13/agentdev-suite.git
claude plugin install agentdev-suite
```

### Marketplace format errors
Validate JSON:
```bash
node -c .claude-plugin/plugin.json
node -c .claude-plugin/marketplace.json
```

### Skill loading errors
Check SKILL.md files have proper YAML frontmatter.
