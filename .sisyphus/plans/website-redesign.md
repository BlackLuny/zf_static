# Zero Forwarder 产品官网重写

## Context

### Original Request
重写 Zero Forwarder 产品官网，要求 UI 更加现代化，简洁清新，没有 Bug，完美适配移动端。

### Interview Summary

**Key Discussions**:
- **设计风格**: 浅色主题（从暗色主题切换），简洁清新的现代 SaaS 风格
- **技术栈**: 保持纯 HTML/CSS/JS，不引入框架
- **主页结构**: 保持现有结构 + 添加4个新板块（定价、客户案例/评价、FAQ、联系/社区链接），使用占位内容
- **文档系统**: 重设计布局/导航，添加搜索功能，保留 marked.js 动态渲染
- **配色**: 交给设计判断，浅色基础，符合清新风格
- **移动端**: 汉堡菜单导航，完美响应式
- **验证**: Playwright 自动化测试
- **技术债务**: 清理 /docs/ 旧目录

**Research Findings**:
- 当前使用纯 HTML/CSS/JS，已有基础响应式
- 文档系统用 marked.js 动态渲染 15+ 篇 Markdown
- `/docs/` 旧目录存在技术债务需清理
- 导航栏/页脚代码在两个 HTML 文件中重复（本次不处理）

### Metis Review

**Identified Gaps** (addressed):
- **设计参考缺失**: 采用 Linear/Stripe 风格作为默认方向（简洁、留白、微妙阴影）
- **品牌色未定**: 保留现有蓝绿色调适配浅色主题（#0ea5e9 天蓝色）
- **搜索范围不明**: 定义为客户端标题过滤（简单 JS filter）
- **浏览器支持**: 现代浏览器 + Safari 14+，不支持 IE
- **断点未定**: 采用 375px / 768px / 1024px 标准断点
- **动效范围**: 仅 hover 微交互，无滚动动画

---

## Work Objectives

### Core Objective
将 Zero Forwarder 产品官网从暗色赛博风格重写为浅色清新现代风格，完善移动端适配，添加新内容板块，并通过 Playwright 自动化测试确保无 Bug。

### Concrete Deliverables
1. `index.html` - 完全重写的浅色主题主页
2. `styles.css` - 全新设计系统和样式
3. `script.js` - 移动端汉堡菜单等交互逻辑
4. `docs.html` - 重设计的文档门户（新布局/导航/搜索）
5. `docs-styles.css` - 文档页面专用样式
6. `docs-script.js` - 文档搜索功能
7. `tests/` - Playwright 测试套件

### Definition of Done
- [ ] 两个主要页面（主页、文档）完成浅色主题视觉重设计
- [ ] 主页包含4个新板块（定价/客户评价/FAQ/社区链接）
- [ ] 文档系统有新布局、导航和搜索功能
- [ ] 移动端汉堡菜单正常工作
- [ ] Playwright 测试全部通过
- [ ] `/docs/` 旧目录已清理
- [ ] 所有现有 #hash 锚点链接仍可正常跳转

### Must Have
- 浅色主题，清新现代设计风格
- 完美响应式（375px / 768px / 1024px 断点）
- 移动端汉堡菜单
- 4个新板块（占位内容）
- 文档搜索（标题过滤）
- Playwright 测试覆盖

### Must NOT Have (Guardrails)
- ❌ 添加构建工具、预处理器或打包器
- ❌ 编写实际营销文案（仅占位内容）
- ❌ 修改文档内容本身（仅修改展示层）
- ❌ 破坏现有 URL（保留 `/docs.html#section-name` 模式）
- ❌ 实现复杂搜索（无 Lunr.js、Algolia 等）
- ❌ 添加暗/亮模式切换
- ❌ 重构 HTML 模板重复问题（超出范围）
- ❌ 滚动动画或复杂动效
- ❌ 发明假的产品特性或功能描述

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO（需要新建）
- **User wants tests**: YES（Playwright 自动化测试）
- **Framework**: Playwright

### Playwright Test Coverage

**导航测试**:
- 所有导航链接可点击且跳转正确
- 汉堡菜单在移动端正常展开/收起
- 锚点链接滚动到正确位置

**响应式测试**:
- 375px (iPhone SE) 视口布局正确
- 768px (iPad) 视口布局正确
- 1024px+ (Desktop) 视口布局正确

**功能测试**:
- 文档搜索过滤正常工作
- 复制命令按钮功能正常
- Markdown 文档渲染正确

**Test Devices**:
- iPhone SE (375px) - 小屏幕
- iPhone 14 (390px) - 标准手机
- iPad (768px) - 平板
- Desktop (1440px) - 桌面

---

## Task Flow

```
Task 0 (环境准备)
    ↓
Task 1 (设计系统)
    ↓
Task 2 (主页重写) → Task 3 (移动端汉堡菜单)
    ↓
Task 4 (新板块添加)
    ↓
Task 5 (文档页重写) → Task 6 (文档搜索)
    ↓
Task 7 (旧代码清理)
    ↓
Task 8 (Playwright 测试)
    ↓
Task 9 (最终验证)
```

## Parallelization

| Group | Tasks | Reason |
|-------|-------|--------|
| A | 2, 5 | 主页和文档页可部分并行（共享设计系统后） |

| Task | Depends On | Reason |
|------|------------|--------|
| 1 | 0 | 设计系统需要先准备环境 |
| 2 | 1 | 主页需要设计系统完成 |
| 3 | 2 | 汉堡菜单需要主页结构存在 |
| 4 | 2 | 新板块需要主页基础结构 |
| 5 | 1 | 文档页需要设计系统 |
| 6 | 5 | 搜索需要文档页结构 |
| 7 | 4, 6 | 清理需要主功能完成后 |
| 8 | 7 | 测试需要所有功能完成 |
| 9 | 8 | 最终验证依赖测试 |

---

## TODOs

### - [ ] 0. 环境准备与 Playwright 初始化

**What to do**:
- 安装 Playwright 测试框架：`npm init -y && npm install -D @playwright/test`
- 安装浏览器：`npx playwright install chromium`
- 创建 `playwright.config.js` 配置文件
- 创建 `tests/` 目录和基础测试结构
- 验证 Playwright 可以运行

**Must NOT do**:
- 不要安装其他测试框架
- 不要配置 CI/CD（本地测试即可）

**Parallelizable**: NO (depends on nothing, first task)

**References**:

**Pattern References**:
- 无现有参考（新建测试环境）

**External References**:
- Playwright 官方文档: https://playwright.dev/docs/intro

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] 运行 `npm install -D @playwright/test` → 安装成功
- [ ] 运行 `npx playwright install chromium` → 浏览器安装成功
- [ ] 运行 `npx playwright test --help` → 显示帮助信息
- [ ] 创建示例测试并运行 `npx playwright test` → 测试通过

**Commit**: YES
- Message: `chore: initialize Playwright test environment`
- Files: `package.json`, `playwright.config.js`, `tests/`
- Pre-commit: `npx playwright test`

---

### - [ ] 1. 创建浅色主题设计系统

**What to do**:
- 定义 CSS 变量设计系统（颜色、字体、间距、圆角）
- 浅色主题配色方案：
  - 背景色：`#ffffff` (纯白) / `#f8fafc` (淡灰)
  - 文字色：`#1e293b` (深灰) / `#64748b` (次要)
  - 主强调色：`#0ea5e9` (天蓝)
  - 辅助强调色：`#06b6d4` (青色)
- 定义排版比例（h1-h6 尺寸）
- 定义组件状态（button hover, link focus）
- 定义阴影层级（subtle/medium/strong）
- 定义断点变量

**Must NOT do**:
- 不要使用 CSS 预处理器
- 不要创建过多变量（保持简洁）

**Parallelizable**: NO (depends on 0)

**References**:

**Pattern References**:
- `/Users/lulin/code/github/zf_static/styles.css:1-34` - 现有 CSS 变量结构（参考组织方式，但颜色需完全替换）

**External References**:
- Tailwind CSS 调色板参考: https://tailwindcss.com/docs/customizing-colors

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] Using playwright browser automation:
  - Navigate to: `file:///Users/lulin/code/github/zf_static/index.html`
  - Verify: 页面背景为白色/浅灰色
  - Verify: 文字清晰可读，对比度足够
  - Verify: 强调色（蓝色）按钮/链接可见
  - Screenshot: Save to `.sisyphus/evidence/task-1-design-system.png`

**Commit**: YES
- Message: `feat(design): create light theme design system with CSS variables`
- Files: `styles.css`
- Pre-commit: N/A (visual verification)

---

### - [ ] 2. 主页 Hero 和特性区域重写

**What to do**:
- 重写 Hero 区域（保留内容，更新设计）
  - 浅色背景 + 微妙渐变
  - 现代排版（大标题、清晰层次）
  - 更新按钮样式
- 重写特性展示区域（保留9个特性）
  - 卡片式设计 with subtle shadows
  - 网格布局保持响应式
  - 更新图标样式
- 重写文档目录区域
- 重写安装区域（终端组件保留，样式更新）
- 更新导航栏（浅色背景 + 毛玻璃效果）
- 更新页脚

**Must NOT do**:
- 不要修改文案内容
- 不要添加滚动动画
- 不要删除任何现有特性

**Parallelizable**: NO (depends on 1)

**References**:

**Pattern References**:
- `/Users/lulin/code/github/zf_static/index.html:1-231` - 现有 HTML 结构（保留语义结构，更新样式）
- `/Users/lulin/code/github/zf_static/styles.css:141-246` - 现有 Hero 样式（参考布局，颜色替换）

**External References**:
- Linear.app 设计风格参考（简洁、留白、微妙阴影）
- Stripe.com 按钮和卡片设计参考

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] Using playwright browser automation:
  - Navigate to: `file:///Users/lulin/code/github/zf_static/index.html`
  - Verify: Hero 区域浅色背景，文字清晰
  - Verify: 9个特性卡片全部显示，hover 有微交互
  - Verify: 终端组件可见，复制按钮可点击
  - Action: Click "复制" button
  - Verify: 命令已复制到剪贴板
  - Screenshot: Save to `.sisyphus/evidence/task-2-homepage-desktop.png`

**Commit**: YES
- Message: `feat(ui): redesign homepage with light theme`
- Files: `index.html`, `styles.css`
- Pre-commit: visual verification

---

### - [ ] 3. 移动端响应式与汉堡菜单

**What to do**:
- 实现汉堡菜单组件（HTML + CSS + JS）
  - 三横线图标（汉堡）
  - 点击展开全屏覆盖菜单
  - 菜单项垂直排列
  - 点击菜单项后自动关闭
  - ESC 键关闭菜单
- 完善响应式断点
  - 375px: 紧凑布局，汉堡菜单
  - 768px: 平板布局，部分调整
  - 1024px+: 桌面完整布局
- 确保所有元素在小屏幕上可用

**Must NOT do**:
- 不要使用 CSS 框架
- 不要添加复杂动画（简单淡入/滑入即可）
- 不要修改桌面端布局

**Parallelizable**: NO (depends on 2)

**References**:

**Pattern References**:
- `/Users/lulin/code/github/zf_static/styles.css:543-599` - 现有响应式规则（参考断点位置）
- `/Users/lulin/code/github/zf_static/script.js` - 现有 JS 交互逻辑（如有）

**External References**:
- 汉堡菜单最佳实践: https://web.dev/patterns/components/hamburger-menu

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] Using playwright browser automation:
  - Set viewport to: 375 x 667 (iPhone SE)
  - Navigate to: `file:///Users/lulin/code/github/zf_static/index.html`
  - Verify: 导航栏显示汉堡图标，隐藏文字链接
  - Action: Click hamburger icon
  - Verify: 全屏菜单展开，显示所有导航链接
  - Action: Click "产品特性" link
  - Verify: 菜单关闭，页面滚动到特性区域
  - Screenshot: Save to `.sisyphus/evidence/task-3-mobile-menu-open.png`

- [ ] Using playwright browser automation:
  - Set viewport to: 768 x 1024 (iPad)
  - Navigate to: `file:///Users/lulin/code/github/zf_static/index.html`
  - Verify: 特性卡片 2 列布局
  - Screenshot: Save to `.sisyphus/evidence/task-3-tablet-layout.png`

**Commit**: YES
- Message: `feat(mobile): implement hamburger menu and responsive breakpoints`
- Files: `index.html`, `styles.css`, `script.js`
- Pre-commit: visual verification on mobile viewport

---

### - [ ] 4. 新增主页板块（定价/评价/FAQ/社区）

**What to do**:
- 添加定价板块
  - 2-3 个定价卡片（占位内容）
  - 免费版 / Pro 版 / 企业版 结构
  - 功能对比列表
- 添加客户评价板块
  - 3-4 个评价卡片（占位内容）
  - 头像 + 姓名 + 公司 + 引用
- 添加 FAQ 板块
  - 5-6 个常见问题（占位内容）
  - 可折叠/展开交互
- 添加社区链接板块
  - GitHub / Discord / Email 等图标链接
  - 简洁布局

**Must NOT do**:
- 不要编写真实营销文案（使用 Lorem Ipsum 或通用占位）
- 不要添加过多板块
- 不要实现支付功能

**Parallelizable**: NO (depends on 2)

**References**:

**Pattern References**:
- `/Users/lulin/code/github/zf_static/index.html:42-136` - 现有特性网格布局（参考卡片设计）
- `/Users/lulin/code/github/zf_static/styles.css:248-324` - 现有卡片样式（参考阴影和 hover）

**External References**:
- Stripe 定价页面参考: https://stripe.com/pricing
- FAQ 折叠组件参考: https://web.dev/patterns/components/accordion

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] Using playwright browser automation:
  - Navigate to: `file:///Users/lulin/code/github/zf_static/index.html`
  - Scroll to: Pricing section
  - Verify: 2-3 个定价卡片可见
  - Scroll to: Testimonials section
  - Verify: 客户评价卡片可见
  - Scroll to: FAQ section
  - Action: Click first FAQ question
  - Verify: 答案展开显示
  - Scroll to: Community section
  - Verify: 社区图标链接可见
  - Screenshot: Save to `.sisyphus/evidence/task-4-new-sections.png`

**Commit**: YES
- Message: `feat(content): add pricing, testimonials, FAQ, and community sections`
- Files: `index.html`, `styles.css`, `script.js`
- Pre-commit: visual verification

---

### - [ ] 5. 文档页面布局重设计

**What to do**:
- 重写文档页面布局
  - 左侧固定导航栏（分类 + 文档列表）
  - 中间主内容区
  - 右侧目录（TOC）可选
- 更新浅色主题样式
  - 代码块浅色背景主题
  - 清晰的标题层次
  - 适当的留白
- 保留 marked.js 渲染逻辑
- 更新导航栏和页脚（与主页保持一致）

**Must NOT do**:
- 不要修改 Markdown 文档内容
- 不要更换 marked.js 库
- 不要改变文档 URL 结构

**Parallelizable**: YES (with 2, after 1)

**References**:

**Pattern References**:
- `/Users/lulin/code/github/zf_static/docs.html` - 现有文档页面结构
- `/Users/lulin/code/github/zf_static/docs-styles.css` - 现有文档样式
- `/Users/lulin/code/github/zf_static/docs-script.js` - 现有文档 JS 逻辑（保留渲染逻辑）

**External References**:
- Stripe 文档设计参考: https://docs.stripe.com/
- Prism.js 浅色主题: https://prismjs.com/

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] Using playwright browser automation:
  - Navigate to: `file:///Users/lulin/code/github/zf_static/docs.html`
  - Verify: 页面加载，浅色主题
  - Verify: 左侧导航栏可见，列出所有文档
  - Action: Click on a documentation link
  - Verify: 文档内容渲染正确
  - Verify: 代码块有语法高亮
  - Screenshot: Save to `.sisyphus/evidence/task-5-docs-desktop.png`

- [ ] Using playwright browser automation:
  - Set viewport to: 375 x 667 (Mobile)
  - Navigate to: `file:///Users/lulin/code/github/zf_static/docs.html`
  - Verify: 侧边栏收起或可通过按钮展开
  - Verify: 文档内容区域占满宽度
  - Screenshot: Save to `.sisyphus/evidence/task-5-docs-mobile.png`

**Commit**: YES
- Message: `feat(docs): redesign documentation layout with light theme`
- Files: `docs.html`, `docs-styles.css`, `docs-script.js`
- Pre-commit: verify markdown rendering works

---

### - [ ] 6. 文档搜索功能实现

**What to do**:
- 实现客户端搜索功能
  - 搜索输入框（固定在侧边栏顶部）
  - 按标题过滤文档列表
  - 实时过滤（输入即搜索）
  - 高亮匹配文字
- 空结果状态处理
- 键盘可访问性（Enter 搜索，ESC 清除）

**Must NOT do**:
- 不要实现全文搜索
- 不要引入搜索库（Lunr.js, Fuse.js 等）
- 不要添加服务端搜索

**Parallelizable**: NO (depends on 5)

**References**:

**Pattern References**:
- `/Users/lulin/code/github/zf_static/docs-script.js:20-111` - 现有文档列表数据（搜索的数据源）

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] Using playwright browser automation:
  - Navigate to: `file:///Users/lulin/code/github/zf_static/docs.html`
  - Action: Type "install" in search box
  - Verify: 只显示标题包含 "install" 的文档
  - Action: Clear search box
  - Verify: 所有文档重新显示
  - Action: Type "xyznonexistent"
  - Verify: 显示 "无结果" 提示
  - Screenshot: Save to `.sisyphus/evidence/task-6-docs-search.png`

**Commit**: YES
- Message: `feat(docs): implement client-side document title search`
- Files: `docs-script.js`, `docs-styles.css`
- Pre-commit: manual search test

---

### - [ ] 7. 清理旧代码和技术债务

**What to do**:
- 删除 `/docs/` 旧目录（已废弃的静态文档）
- 检查并删除未使用的 CSS 规则
- 检查并删除未使用的 JS 代码
- 验证所有外部链接指向正确（不依赖 /docs/）
- 更新 CLAUDE.md 如有必要

**Must NOT do**:
- 不要删除 `/markdown/` 目录（那是真正的文档源）
- 不要删除 `docs.html`（那是新的文档入口）
- 不要修改 git 历史

**Parallelizable**: NO (depends on 4, 6)

**References**:

**Pattern References**:
- `/Users/lulin/code/github/zf_static/docs/` - 待删除的旧目录

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] 运行: `ls -la /Users/lulin/code/github/zf_static/docs/` → 目录应该不存在
- [ ] Using playwright browser automation:
  - Navigate to: `file:///Users/lulin/code/github/zf_static/docs.html`
  - Verify: 文档系统正常工作（未因删除而损坏）

**Commit**: YES
- Message: `chore: remove deprecated /docs directory and unused code`
- Files: deleted `/docs/`, cleaned CSS/JS
- Pre-commit: verify docs.html still works

---

### - [ ] 8. Playwright 完整测试套件

**What to do**:
- 创建导航测试
  - 所有主页链接可点击
  - 锚点链接滚动正确
- 创建汉堡菜单测试
  - 移动端展开/收起
  - 菜单项点击后关闭
- 创建响应式布局测试
  - 375px 布局断言
  - 768px 布局断言
  - 1024px 布局断言
- 创建文档系统测试
  - Markdown 渲染正确
  - 搜索功能正常
- 创建视觉回归测试（可选）

**Must NOT do**:
- 不要测试外部服务
- 不要过度 mock
- 不要写不稳定的测试

**Parallelizable**: NO (depends on 7)

**References**:

**External References**:
- Playwright 测试文档: https://playwright.dev/docs/writing-tests
- Playwright 视口设置: https://playwright.dev/docs/emulation#viewport

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] 运行: `npx playwright test` → 所有测试通过
- [ ] 运行: `npx playwright test --reporter=html` → 生成测试报告
- [ ] 验证测试覆盖：
  - [ ] 导航链接测试 ≥ 5 个
  - [ ] 响应式断点测试 ≥ 3 个
  - [ ] 汉堡菜单测试 ≥ 2 个
  - [ ] 文档搜索测试 ≥ 3 个

**Commit**: YES
- Message: `test: add comprehensive Playwright test suite`
- Files: `tests/*.spec.js`
- Pre-commit: `npx playwright test`

---

### - [ ] 9. 最终验证与质量检查

**What to do**:
- 全设备手动验收
  - iPhone SE (375px)
  - iPhone 14 (390px)
  - iPad (768px)
  - Desktop (1440px)
- Lighthouse 性能检查（目标 ≥ 85）
- 可访问性检查（键盘导航、对比度）
- 验证所有现有 #hash 锚点仍可工作
- 验证 Markdown 图片宽度正确（参考 CLAUDE.md 要求）
- 跨浏览器检查（Chrome, Safari, Firefox）

**Must NOT do**:
- 不要引入新功能
- 不要做大范围修改（仅修复发现的问题）

**Parallelizable**: NO (depends on 8)

**References**:

**Documentation References**:
- `/Users/lulin/code/github/zf_static/CLAUDE.md` - Markdown 图片宽度要求

**Acceptance Criteria**:

**Manual Execution Verification:**
- [ ] Lighthouse 移动端分数 ≥ 85
- [ ] 所有 Playwright 测试通过
- [ ] 手动检查 4 个视口尺寸布局正确
- [ ] 验证 docs.html#section 锚点链接工作

**Commit**: YES
- Message: `chore: final polish and quality verification`
- Files: any minor fixes
- Pre-commit: `npx playwright test`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 0 | `chore: initialize Playwright test environment` | package.json, playwright.config.js, tests/ | `npx playwright test --help` |
| 1 | `feat(design): create light theme design system with CSS variables` | styles.css | visual |
| 2 | `feat(ui): redesign homepage with light theme` | index.html, styles.css | visual |
| 3 | `feat(mobile): implement hamburger menu and responsive breakpoints` | index.html, styles.css, script.js | mobile viewport test |
| 4 | `feat(content): add pricing, testimonials, FAQ, and community sections` | index.html, styles.css, script.js | visual |
| 5 | `feat(docs): redesign documentation layout with light theme` | docs.html, docs-styles.css, docs-script.js | verify markdown renders |
| 6 | `feat(docs): implement client-side document title search` | docs-script.js, docs-styles.css | search test |
| 7 | `chore: remove deprecated /docs directory and unused code` | deleted /docs/ | verify docs.html works |
| 8 | `test: add comprehensive Playwright test suite` | tests/*.spec.js | `npx playwright test` |
| 9 | `chore: final polish and quality verification` | fixes | full test run |

---

## Success Criteria

### Verification Commands
```bash
# 运行所有测试
npx playwright test  # Expected: All tests pass

# Lighthouse 检查 (需要启动本地服务器)
npx http-server -p 8080 &
npx lighthouse http://localhost:8080 --only-categories=performance --output=json | jq '.categories.performance.score'
# Expected: >= 0.85
```

### Final Checklist
- [ ] 所有 "Must Have" 已实现
- [ ] 所有 "Must NOT Have" 未违反
- [ ] Playwright 测试全部通过
- [ ] Lighthouse 移动端 ≥ 85 分
- [ ] 4 个视口尺寸验证通过
- [ ] 旧 /docs/ 目录已删除
- [ ] 所有现有 URL/锚点仍有效
