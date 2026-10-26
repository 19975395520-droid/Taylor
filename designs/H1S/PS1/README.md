# 反制盾本地项目

从用户提供的 Figma Make 代码包迁移，保留原始主界面和资源；现增加双设备预览和手持响应式样式。

## 双设备预览

首页顶部按钮切换“反制盾（1920 × 1200）”与“手持（720 × 1600）”。设备内部使用真实 CSS 像素视口，外部按可用窗口等比缩放，右上角显示缩放比例。按钮仅用于设计预览，不进入产品界面；切换设备会重新加载内部页面并重置演示状态。

实际产品可直接打开 `/?device=shield` 或 `/?device=handheld`，去掉预览工具栏。此时按实际浏览器视口布局，手持样式在宽度不超过 800 CSS px 时启用。设备部署时应使用对应的有效内容视口，并确认系统缩放比例。

手持版采用地图、横向控制、告警列表的纵向结构；其他页面改为竖向阅读，宽表格可横向滚动。

- `src/DevicePreview.tsx`、`src/preview.css`：设备按钮、固定视口与等比预览。
- `src/handheld.css`：手持响应式布局。

## 启动

安装 Node.js 22.12+ 或 24 LTS，在本目录打开终端：

```powershell
npm install
npm run dev
```

浏览器访问 http://127.0.0.1:5173 。停止服务按 Ctrl+C。

```powershell
npx tsc --noEmit
npm run build
npm run preview
```

生产预览地址为 http://127.0.0.1:4173 。`dist/` 为构建产物，部署时需要 HTTP 静态服务器，不要直接双击 HTML。

## 用 Codex 修改

在 Codex 中将此文件夹添加为项目，再描述要修改的页面和行为。

- `src/App.tsx`：探测、历史、统计、白名单和设置页面，以及图标、示例数据与交互。
- `src/index.css`：完整原始样式，包含多轮样式覆盖；改动时检查后面的同名规则。
- `src/main.tsx`：React 入口。
- `public/`：图标和 PDF 说明书。
- `vite.config.ts`：本地构建及开发服务配置。

示例：“请调整探测页面右侧目标列表的宽度，保持其他页面布局不变。”

## 迁移范围与限制

原来的 Vite 配置依赖未提供的 `.figma/make/site.json` 和 Figma 预览环境。现改为标准 React + Tailwind CSS v4 + Vite 配置；HTML 设置中文语言、标题和本地 favicon。未引入 Figma 环境脚本。依赖版本范围沿用原始 package.json。

这是原始前端原型：目标、设备、网络地址等来自示例代码；未连接实际硬件或后端。部分按钮仅显示界面或确认提示，并未实现真实导出、升级或数据服务；页面状态主要保存在 React 内存中，刷新可能重置。界面文字“配置自动保存”不代表已实现持久化。这些行为按原包保留。

Figma 原链接： https://www.figma.com/make/QvkNbZEuxppLGHvGGVl1SV/

首次迁移时已通过浏览器访问 Figma Version 38 预览，查看五个默认页面，原始文件通过 SHA-256 校验。之后按用户要求增加双设备预览、调整入口并新增手持样式，原始 App.tsx、index.css 和 public 资源保留。尚未完成所有视口、弹窗和状态的自动像素比对。
