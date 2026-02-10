---
name: "pr-creator"
description: "Creates well-structured pull requests with proper titles, descriptions, and checklists. Invoke when user wants to create a PR or needs help with PR best practices."
---

# PR Creator

This skill helps create professional and informative pull requests.

## PR Components

### 1. Title
- Clear and concise
- Include issue/ticket number
- Use conventional commit format (optional)
- Examples:
  - `feat: add user authentication flow`
  - `fix: resolve memory leak in dashboard`
  - `refactor: simplify data fetching logic`

### 2. Description

#### Summary
- What changed and why
- Link to related issues/tickets
- Screenshots/GIFs for UI changes

#### Changes Made
- Bullet list of key changes
- Files modified
- Dependencies added/removed

#### Testing
- How to test the changes
- Test results
- Edge cases covered

#### Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Self-review completed
- [ ] No console errors

## PR Best Practices

1. **Keep PRs small and focused**
   - One feature/fix per PR
   - Easier to review
   - Faster to merge

2. **Provide context**
   - Link to requirements
   - Explain design decisions
   - Note any breaking changes

3. **Request appropriate reviewers**
   - Domain experts
   - Team members
   - Minimum 1-2 reviewers

4. **Respond to feedback promptly**
   - Address comments
   - Ask for clarification if needed
   - Update PR description if scope changes

## Types of PRs

- **Feature**: New functionality
- **Bugfix**: Fix for a bug
- **Hotfix**: Critical production fix
- **Refactor**: Code restructuring
- **Docs**: Documentation only
- **Test**: Test additions/updates
- **Chore**: Maintenance tasks

## Template

```markdown
## Description
Brief description of changes

## Related Issue
Fixes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed

## Screenshots (if applicable)
Add screenshots

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code
- [ ] I have made corresponding documentation changes
- [ ] My changes generate no new warnings
```