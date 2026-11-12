# Contributing

感谢参与 Islands UI。这个项目是纯客户端样式层，没有构建依赖，改动集中在 `src/` 的 CSS 和 `src/client.template.js`。

## 开发

```bash
# 1. 修改 src/*.css 或 src/client.template.js
# 2. 重新生成自包含的 client.js
npm run build

# 3. 校验构建是最新的，并且 npm 包内容完整
npm run check

# 4. 可选：看一下实际会发布哪些文件
npm pack --dry-run
```

`client.js` 是构建产物，但必须提交。DSH 的模块加载器运行时无法读取包内文件，样式必须内联在这个文件里；只改 CSS 不重新 build 会导致线上仍显示旧样式。

## 代码约定

- 设计变量集中在 `src/00-tokens.css`，不要在组件规则里硬编码颜色、圆角或间距。
- 选择器尽量复用 Harness 的 `data-*` 挂点；依赖 CSS Module 哈希类名时，在注释里写清它对应的页面和升级风险。
- 新增交互放 `src/client.template.js`，并保持纯客户端：不新增 host 服务、不读写会话数据、不发起网络请求。
- 颜色、间距、字号优先使用已有 token；新增 token 时同时补深色值。
- 动画遵循 `prefers-reduced-motion`。

## 提交

- 不要为每个小改动单独提交。把多轮改动合并成一次提交，并在 commit body 里用几条短句说明每一类改动。
- 提交前跑 `npm run check`，确认 `client.js` 已重新生成。
- 不要提交 `.DS_Store`、`node_modules/` 或本地打包的 `.tgz`。

示例：

```text
fix: 置顶项对齐与窄屏抽屉修复

- 置顶项标题与工作区会话行对齐，hover 时才显示操作按钮
- 窄屏保留 rail，工作区改为 home 按钮打开的抽屉
- 重新构建 client.js
```

## PR 检查清单

- [ ] `npm run check` 通过
- [ ] 修改了 `src/*.css` 或模板后，`client.js` 已重新构建并提交
- [ ] 深色模式下检查过选中、hover、边框和强调色
- [ ] 窄屏（<768px）和宽屏都检查过
- [ ] 没有引入本地绝对路径、`@local/...` 包名或调试日志
- [ ] 如果改了可见界面，附截图或录屏

## 兼容性

皮肤依赖 DSH 当前构建的 CSS Module 哈希类名和少量 `data-*` 挂点。DSH 升级后如果类名变化，需要同步更新 CSS，并在 PR 里注明测试过的 DSH 版本。发布包通过 `engines.dsh` / `dsh.compatibility.dsh` 声明兼容范围。

## 问题反馈

- Bug：使用 GitHub Issue 模板，附 DSH 版本、系统、窗口尺寸和截图。
- 安全问题：不要开公开 Issue，按 [SECURITY.md](SECURITY.md) 的流程处理。
