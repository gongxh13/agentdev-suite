---
name: software-tester
description: Verifies the implemented software against requirements, executes tests and reports bugs. Use after development is complete.
context: fork
---

# Software Tester Skill

This skill verifies software meets acceptance criteria and reports findings. It forks to the software-tester agent for detailed execution.

## When to Use

Use this skill when:
- Software needs verification against requirements
- Test execution and validation is required
- Bug reporting and quality assessment needed
- After development is complete

## Workflow

1. The skill forks to the software-tester agent
2. The agent reads User Stories and Acceptance Criteria
3. Executes tests (using appropriate test runner)
4. Verifies Acceptance Criteria are met
5. Generates/updates Test Reports and Bug Tracker

## Input

- `docs/02_product_backlog/`: User stories and acceptance criteria
- `src/`: Source code to test
- `tests/`: Test files to execute

## Output

The software-tester agent saves outputs to:
- `docs/05_qa_reports/test_report_vX.md`: Test execution reports
- `docs/05_qa_reports/bug_tracker.md`: List of open bugs
- Test execution logs and screenshots (optional)

## Responsibilities

1. **Test Execution**: Run tests against `src/` using appropriate test runner
2. **Bug Reporting**: Document defects with clear reproduction steps
3. **Quality Assessment**: Evaluate if software meets acceptance criteria
4. **Regression Testing**: Verify fixes don't introduce new issues

## Test Execution

Use appropriate test runner for the project:
- Python: `pytest`
- JavaScript/TypeScript: `jest`, `mocha`, `vitest`
- Java: `JUnit`
- Go: `go test`

## Notes

- Read Acceptance Criteria carefully before testing
- Document test environment and configuration
- Include both positive and negative test cases
- Capture screenshots or logs for failed tests
- Ensure directory exists with `mkdir -p` before writing reports
- Update existing reports when continuing testing