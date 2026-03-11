# 《星航荒宇》文档索引

欢迎查阅《星航荒宇》项目文档。本文档索引帮助您快速找到所需信息。

## 文档概览

| 文档 | 描述 | 适用对象 |
|------|------|----------|
| [README.md](../README.md) | 项目概述与快速开始 | 所有用户 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 项目架构设计 | 开发者 |
| [CORE_SYSTEMS.md](./CORE_SYSTEMS.md) | 核心系统详解 | 开发者、策划 |
| [API_REFERENCE.md](./API_REFERENCE.md) | API参考文档 | 开发者 |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | 开发指南 | 开发者 |

## 快速导航

### 我想了解游戏

- 游戏特色与玩法 → [README.md - 核心系统](../README.md#核心系统)
- 世界观设定 → [世界观设定](../../世界观设定/《星航荒宇》世界观设定.md)
- 游戏截图 → [README.md - 游戏截图](../README.md#游戏截图)

### 我想开始开发

- 环境配置 → [DEVELOPMENT.md - 环境配置](./DEVELOPMENT.md#1-环境配置)
- 项目启动 → [README.md - 快速开始](../README.md#快速开始)
- 代码规范 → [DEVELOPMENT.md - 代码规范](./DEVELOPMENT.md#4-代码规范)

### 我想了解架构

- 整体架构 → [ARCHITECTURE.md - 架构设计](./ARCHITECTURE.md#架构设计)
- 目录结构 → [ARCHITECTURE.md - 项目目录结构](./ARCHITECTURE.md#项目目录结构)
- 数据流设计 → [ARCHITECTURE.md - 数据流设计](./ARCHITECTURE.md#数据流设计)

### 我想了解系统

- 系统概览 → [CORE_SYSTEMS.md](./CORE_SYSTEMS.md)
- 玩家系统 → [CORE_SYSTEMS.md - Player](./CORE_SYSTEMS.md#2-player---玩家系统)
- 战斗系统 → [CORE_SYSTEMS.md - BattleSystem](./CORE_SYSTEMS.md#20-battlesystem---战斗系统)
- 芯片系统 → [CORE_SYSTEMS.md - ChipSystem](./CORE_SYSTEMS.md#5-chipsystem---芯片系统)
- 基因系统 → [CORE_SYSTEMS.md - GeneSystem](./CORE_SYSTEMS.md#6-genesystem---基因系统)

### 我想查找API

- API总览 → [API_REFERENCE.md](./API_REFERENCE.md)
- 玩家API → [API_REFERENCE.md - 玩家系统API](./API_REFERENCE.md#2-玩家系统api)
- 背包API → [API_REFERENCE.md - 背包系统API](./API_REFERENCE.md#3-背包系统api)
- 战斗API → [API_REFERENCE.md - 战斗系统API](./API_REFERENCE.md#20-战斗系统api)
- Toast提示 → [API_REFERENCE.md - Toast提示系统API](./API_REFERENCE.md#22-toast提示系统api)

### 我想添加新功能

- 开发流程 → [DEVELOPMENT.md - 开发流程](./DEVELOPMENT.md#3-开发流程)
- 组件开发 → [DEVELOPMENT.md - 组件开发指南](./DEVELOPMENT.md#5-组件开发指南)
- 系统开发 → [DEVELOPMENT.md - 系统开发指南](./DEVELOPMENT.md#6-系统开发指南)

### 我想调试问题

- 调试技巧 → [DEVELOPMENT.md - 调试技巧](./DEVELOPMENT.md#8-调试技巧)
- 常见问题 → [DEVELOPMENT.md - 常见问题](./DEVELOPMENT.md#10-常见问题)

### 我想优化性能

- 性能优化 → [DEVELOPMENT.md - 性能优化](./DEVELOPMENT.md#9-性能优化)
- 架构优化 → [ARCHITECTURE.md - 性能优化策略](./ARCHITECTURE.md#性能优化策略)

### 我想部署项目

- Web部署 → [ARCHITECTURE.md - 部署流程](./ARCHITECTURE.md#部署流程)
- 移动端构建 → [README.md - 移动端构建](../README.md#移动端构建)

## 按角色查看

### 策划/设计师

推荐阅读顺序：
1. [README.md](../README.md) - 了解项目整体
2. [CORE_SYSTEMS.md](./CORE_SYSTEMS.md) - 了解各系统设计
3. [世界观设定](../../世界观设定/《星航荒宇》世界观设定.md) - 了解世界观

### 前端开发者

推荐阅读顺序：
1. [README.md](../README.md) - 快速开始
2. [ARCHITECTURE.md](./ARCHITECTURE.md) - 理解架构
3. [DEVELOPMENT.md](./DEVELOPMENT.md) - 开发规范
4. [API_REFERENCE.md](./API_REFERENCE.md) - API参考

### 后端/全栈开发者

推荐阅读顺序：
1. [ARCHITECTURE.md](./ARCHITECTURE.md) - 理解整体架构
2. [CORE_SYSTEMS.md](./CORE_SYSTEMS.md) - 理解核心系统
3. [API_REFERENCE.md](./API_REFERENCE.md) - API参考

### 新加入成员

推荐阅读顺序：
1. [README.md](../README.md) - 项目概述
2. [ARCHITECTURE.md - 项目目录结构](./ARCHITECTURE.md#项目目录结构) - 了解代码组织
3. [DEVELOPMENT.md - 环境配置](./DEVELOPMENT.md#1-环境配置) - 搭建开发环境
4. [DEVELOPMENT.md - 代码规范](./DEVELOPMENT.md#4-代码规范) - 了解编码规范

## 自定义技能

项目包含多个自定义技能，用于辅助开发：

| 技能 | 描述 |
|------|------|
| `doc-sync` | 自动同步文档，代码变更后更新相关文档 |
| `frontend-code-review` | 前端代码审查 |
| `frontend-design` | 前端设计辅助 |
| `game-ui-button-design` | 游戏UI按钮设计 |
| `pr-creator` | PR创建器 |
| `scifi-ui-refactor` | 科幻UI重构 |
| `svg` | SVG处理技能 |
| `webapp-testing` | Web应用测试 |

### 使用技能

只需在对话中提及相关关键词即可触发技能：
- "更新文档" / "同步文档" → 触发 `doc-sync`
- "代码审查" / "review" → 触发 `frontend-code-review`
- "测试" → 触发 `webapp-testing`

## 文档更新

文档最后更新时间：2026年3月

如发现文档问题或有改进建议，请联系项目维护者。

---

*返回 [项目主页](../README.md)*
