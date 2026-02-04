# Installing agentdev-suite for Codex

## Installation from Repository (For AI Assistants)

When instructed to install agentdev-suite, fetch this file and follow these instructions to install from the Git repository:

1. **Clone the repository**:
   ```bash
   mkdir -p ~/.codex/agentdev-suite
   cd ~/.codex/agentdev-suite
   git clone https://github.com/gongxh13/agentdev-suite.git .
   ```

2. **Update your AGENTS.md file**:
   Add the following section to your `~/.codex/AGENTS.md`:

   ```markdown
   ## agentdev-suite

   <EXTREMELY_IMPORTANT>
   You have access to agentdev-suite. RIGHT NOW run: `~/.codex/agentdev-suite/.codex/agentdev-suite-codex bootstrap` and follow instructions.
   </EXTREMELY_IMPORTANT>
   ```

## Verification
```bash
~/.codex/agentdev-suite/.codex/agentdev-suite-codex bootstrap
```

You should see skill listings and bootstrap instructions.
