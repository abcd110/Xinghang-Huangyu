---
name: "doc-sync"
description: "Automatically updates project documentation when code changes. Invoke after modifying code, adding/deleting features, or when user asks to sync docs."
---

# Documentation Sync Skill

This skill ensures that project documentation stays synchronized with code changes. It automatically identifies documentation that needs updates and performs the necessary modifications.

## When to Invoke

**Invoke this skill IMMEDIATELY when:**
- Code has been modified (functions, classes, interfaces changed)
- New features have been added
- Existing features have been removed or deprecated
- API signatures have changed
- New systems or modules have been created
- User explicitly asks to sync/update documentation
- After completing a significant code change task

## Documentation Files to Update

The skill maintains the following documentation files:

| File | Purpose | When to Update |
|------|---------|----------------|
| `docs/ARCHITECTURE.md` | Project architecture | When structure, modules, or data flow changes |
| `docs/CORE_SYSTEMS.md` | Core system details | When systems are added/removed/modified |
| `docs/API_REFERENCE.md` | API documentation | When API methods change |
| `docs/DEVELOPMENT.md` | Development guide | When dev processes or standards change |
| `README.md` | Project overview | When features or setup changes |
| `docs/INDEX.md` | Documentation index | When new docs are added |

## Update Process

### Step 1: Identify Changes

Analyze what has changed in the codebase:
- New files created
- Files modified
- Files deleted
- Function signatures changed
- Type definitions updated
- New exports added

### Step 2: Determine Documentation Impact

For each change, determine which documentation needs updates:

```
Code Change Type          → Documentation to Update
─────────────────────────────────────────────────────
New system/module         → CORE_SYSTEMS.md, ARCHITECTURE.md
New API method            → API_REFERENCE.md
Modified API signature    → API_REFERENCE.md
New component             → ARCHITECTURE.md (directory structure)
New type/interface        → API_REFERENCE.md (type definitions)
New feature               → README.md, CORE_SYSTEMS.md
Removed feature           → All relevant docs
Architecture change       → ARCHITECTURE.md
Dev process change        → DEVELOPMENT.md
```

### Step 3: Update Documentation

For each affected documentation file:

1. **Read the current documentation**
2. **Identify sections that need updates**
3. **Make precise updates** (don't rewrite entire docs)
4. **Maintain consistency** with existing documentation style
5. **Update "last updated" dates**

### Step 4: Verify Consistency

Ensure all documentation is consistent:
- No conflicting information
- All cross-references are valid
- Code examples are accurate

## Update Templates

### New System Documentation

When adding a new system, add to `CORE_SYSTEMS.md`:

```markdown
## N. SystemName - 系统描述

### 概述

[系统功能概述]

### 核心结构

\`\`\`typescript
interface SystemState {
  // 状态属性
}

class SystemName {
  // 主要方法
}
\`\`\`

### 主要方法

| 方法 | 描述 | 返回值 |
|------|------|--------|
| `methodName()` | 描述 | 返回类型 |

### 使用流程

[流程图或说明]
```

### New API Method Documentation

When adding new API methods, add to `API_REFERENCE.md`:

```markdown
### methodName

方法描述。

\`\`\`typescript
methodName(param1: Type, param2?: Type): ReturnType
\`\`\`

**参数：**
- `param1` - 参数描述
- `param2` - 可选参数描述

**返回值：** 返回值描述

**示例：**

\`\`\`typescript
const { methodName } = useGameStore();
const result = methodName('value');
\`\`\`
```

### Architecture Update

When architecture changes, update `ARCHITECTURE.md`:

1. Update directory structure if files changed
2. Update architecture diagrams if module relationships changed
3. Update data flow diagrams if data flow changed
4. Update design patterns if new patterns introduced

## Best Practices

1. **Be Precise**: Only update what has actually changed
2. **Be Consistent**: Follow existing documentation style
3. **Be Complete**: Don't leave partial updates
4. **Be Timely**: Update docs immediately after code changes
5. **Be Accurate**: Verify all code examples work

## Example Workflow

```
User modifies code → Invoke doc-sync skill
                          │
                          ▼
                  Analyze code changes
                          │
                          ▼
                  Identify affected docs
                          │
                          ▼
                  ┌──────┴──────┐
                  │             │
                  ▼             ▼
           Update API      Update Core
           Reference       Systems
                  │             │
                  └──────┬──────┘
                         │
                         ▼
                  Verify consistency
                         │
                         ▼
                  Report updates made
```

## Language Requirements

- Documentation should be written in Chinese (中文) to match the project
- Code examples and technical terms remain in English
- Keep consistent with existing documentation language

## Error Handling

If documentation update fails:
1. Log the error and affected files
2. Continue with other documentation updates
3. Report all errors at the end
4. Suggest manual review if needed

---

*This skill ensures documentation remains a reliable source of truth for the project.*
