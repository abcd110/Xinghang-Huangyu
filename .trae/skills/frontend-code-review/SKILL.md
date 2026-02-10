---
name: "frontend-code-review"
description: "Reviews frontend code for best practices, performance, accessibility, and React/Vue/Angular patterns. Invoke when user asks for code review, PR review, or before merging frontend changes."
---

# Frontend Code Review

This skill performs comprehensive code reviews for frontend projects.

## Review Areas

### 1. Code Quality
- Clean code principles
- Naming conventions
- Function/component size
- Code duplication
- Comments and documentation

### 2. Performance
- Unnecessary re-renders
- Memoization opportunities
- Lazy loading
- Bundle size concerns
- Image optimization

### 3. Accessibility (a11y)
- ARIA labels
- Keyboard navigation
- Color contrast
- Screen reader support
- Semantic HTML

### 4. Best Practices
- React hooks rules
- State management
- Props validation
- Error boundaries
- Security (XSS prevention)

### 5. Testing
- Test coverage
- Test quality
- Edge cases

## Review Process

1. Analyze the code structure
2. Check for anti-patterns
3. Identify performance bottlenecks
4. Verify accessibility compliance
5. Provide actionable feedback with examples

## Output Format

- ✅ **Good practices** found
- ⚠️ **Issues** with severity (high/medium/low)
- 💡 **Suggestions** for improvement
- 📚 **Examples** of better approaches