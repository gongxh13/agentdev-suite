# Installing agentdev-suite for OpenCode

## Installation from Repository (For AI Assistants)

When instructed to install agentdev-suite, fetch this file and follow these instructions to install from the Git repository:

### 1. Clone Repository
```bash
git clone https://github.com/gongxh13/agentdev-suite.git ~/.config/opencode/agentdev-suite
```

### 2. Register the Plugin
```bash
mkdir -p ~/.config/opencode/plugins
ln -s ~/.config/opencode/agentdev-suite/.opencode/plugins/agentdev-suite.js ~/.config/opencode/plugins/agentdev-suite.js
```

### 3. Symlink Skills
```bash
mkdir -p ~/.config/opencode/skills
ln -s ~/.config/opencode/agentdev-suite/skills ~/.config/opencode/skills/agentdev-suite
```

## Verification
```bash
# Check plugin is registered
ls -la ~/.config/opencode/plugins/agentdev-suite.js

# Check skills are linked
ls -la ~/.config/opencode/skills/agentdev-suite
```

**Note:** After installation, you may need to restart OpenCode for changes to take effect.

## Tool Mapping for OpenCode
- `TodoWrite` → `update_plan`
- `Task` tool with subagents → Use OpenCode's subagent system (@mention)
- `Skill` tool → OpenCode's native `skill` tool
- `Read`, `Write`, `Edit`, `Bash` → Your native tools

## Troubleshooting

### Plugin not loading
Check OpenCode logs for errors:
```bash
journalctl -u opencode.service -f  # systemd
# or check ~/.config/opencode/logs/
```

### Skills not showing up
Verify symlinks:
```bash
ls -la ~/.config/opencode/skills/agentdev-suite
```

Should show link to repository skills directory.

### Platform differences
OpenCode has different tool names than Claude Code. The agentdev-suite plugin automatically handles tool mapping.
