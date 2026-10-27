
## Git Automation Workflow

### Before Implementation
1. Read the existing feature spec and implementation plan.
2. Run `git status` and `git remote -v`.
3. Stop if unrelated uncommitted changes exist.
4. Create or switch to the appropriate feature branch.
5. Verify the active branch is not main or master.

### After Implementation
1. Invoke `test-writer` to generate automated tests.
2. Wait for completion.
3. Invoke `test-runner` to execute all required tests.
4. Continue only if all required tests pass.
5. Review `git status` and `git diff`.
6. Stage only intended feature files.
7. Run `git diff --cached --name-only`.
8. Verify no .env files, secrets, or unrelated files are staged.
9. Commit using:
   `git commit -m "feat: <feature-description>"`
10. Push using:
    `git push -u origin <feature-branch>`
11. Verify the push succeeded.

### Safety Rules
- Never commit or push when tests fail or are blocked.
- Never modify or stage .env files.
- Never commit secrets or credentials.
- Never force push.
- Never push directly to main or master.
- Never automatically merge branches.
- Stop if Git authentication fails.
