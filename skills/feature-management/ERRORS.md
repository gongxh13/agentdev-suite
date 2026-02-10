# Error Handling

## Common Errors

### Project Directory Not Found
```
Error: Cannot determine project directory
Solution: Ensure running in project directory, or specify project path
```

### No Write Permission
```
Error: Cannot create features/ directory
Solution: Check directory permissions, or use project-appropriate alternative location
```

### Git Not Initialized
```
Warning: Project not using git, skipping commit step
Solution: Can continue, but recommended to initialize git repository
```

### GitHub CLI Not Installed
```
Error: GitHub CLI (gh) not installed for automatic PR creation
Solution: Install 'gh' CLI or use manual PR creation workflow
```

### No Changes to Commit
```
Error: No changes detected to commit for PR creation
Solution: Make sure feature development is complete and changes are staged
```

### Remote Repository Not Configured
```
Error: No remote repository configured for push
Solution: Add remote with 'git remote add origin <url>' or use existing remote
```

### Feature File Corrupted
```
Error: Feature JSON file corrupted
Solution: Backup and create new file, or manually repair
```

### Feature Already Claimed
```
Error: Feature "[feature-name]" already claimed by [user] on [date]
Options:
1. View claim details
2. Request to take over
3. Create new feature with different name
```

### Missing Required Documentation
```
Error: Missing required documentation for feature completion
Required: PR link (documentation.pr array must contain at least one URL)
At least one of: requirements, design, tests, or deployment arrays should be non-empty

Solution: Provide missing documentation links (can provide multiple) or search project for existing files
```

### Invalid URL Format
```
Error: Invalid URL format provided for documentation link
Solution: URLs must start with http:// or https://
```

## Best Practices

### For Developers
1. **Claim Early**: Claim feature immediately when planning starts
2. **Use Descriptive Names**: Feature names should be clear and specific
3. **Update Promptly**: Submit results immediately after completing development
4. **Add Documentation Links**: Provide relevant documentation and PR links
5. **Support Multiple Files**: Add multiple documentation files to appropriate arrays (requirements, design, tests, pr, deployment)
6. **Review Before PR**: Always review changes before creating PR
7. **Use Interactive PR Creation**: Take advantage of the interactive PR creation with confirmation at each step
8. **Provide Clear PR Descriptions**: Use the generated PR description template and customize as needed

### For Teams
1. **Unified Naming Convention**: Team uses consistent feature naming rules
2. **Regular Cleanup**: Periodically check and clean up expired claims
3. **Communication Coordination**: Timely communication when claim conflicts occur

## Important Notes

1. **Cross-Project Work**: Feature claims are bound to current project, switching projects requires re-claim
2. **No Central Server**: Claim information stored in local project, team needs to share repository
3. **Lightweight Design**: Only provides core functionality, no complex management interface
4. **Simple Location**: Uses standard `features/` directory structure for consistency
5. **User Control**: Critical operations require explicit user confirmation at each step

## Extension Suggestions

If more functionality is needed, consider:

1. **Team Synchronization**: Sync claim information through git
2. **Status Dashboard**: Simple status display
3. **Expiration Cleanup**: Automatically clean up expired claims
4. **Notification Integration**: Claim conflict notifications

**New in this version: Automatic PR Creation** with interactive user confirmation at each step.

This skill focuses on solving duplicate work problems in team development, improving collaboration efficiency through lightweight feature claim mechanisms, now enhanced with automated PR creation workflow.