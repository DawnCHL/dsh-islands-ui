# 宿主契约与部件标记

Islands UI 不再把宿主构建输出的哈希类名写进样式表或 DOM 查询。依赖分成三层，顺序固定：

1. **宿主契约**：`[data-slot="root"]`、`[data-slot="sidebar"]`、`[data-phase]`、`[data-conversation-scroll]`、`[data-composer-card]`、`[data-row-key^="session:"]`、`[data-shortcut-modal="settings"]` 等。属性与哈希无关，负责区域划分和主要定位。
2. **皮肤部件**：`src/host/runtime.js` 读取宿主类名的本地名（`-l6A3q_root` → `root`），按区域查表，写成 `data-islands-part="sidebar-root sidebar-collapsed"`。样式只写 `[data-islands-part~="sidebar-root"]`，`~=` 是整词匹配。
3. **宿主类名**：只在 `src/host/runtime.js` 的 `SIDEBAR_PARTS`、`HEADER_PARTS` 等表中出现，并且只写本地名。哈希段不进入任何选择器。

## 文件

| 文件 | 作用 |
|---|---|
| `src/host/runtime.js` | 契约字面量、本地名提取、区域/部件表、遍历器 |
| `src/host/caret.js` | 平滑输入光标控制器；只读 composer 契约，不读模板内部符号 |
| `src/host/footer.js` | 工作区底部 footer 控制器；折叠、拖拽高度、记忆、空态，发布 `data-islands-footer-*` 与 `--isl-footer-*` |
| `src/host/foot.js` | 轨道脚注测量；只读 `settings-area` 部件，把高度发布为 `--isl-foot-height` |
| `src/*.css` | 只读 `data-islands-part` 和宿主契约 |
| `src/60-peers.css` | 第三方插件适配，允许 `[class*=...]`，核心样式不读 |
| `src/31-caret.css` | 发送按钮强调色与光标绘制样式，读 `composer-primary` 部件 |
| `scripts/check-css.mjs` | 选择器门禁：作用域、部件名、属性白名单、禁止哈希类名/子串匹配 |
| `scripts/check-parts.mjs` | 表完整性：定义了没读、读了没定义、本地名格式 |
| `test/host-runtime.test.mjs` | 本地名提取和表的单元测试 |
| `test/foot-anchors.test.mjs` | 轨道锚点、访客归一化与测量模块的源码门禁 |

## 输入光标

平滑光标是按「功能」拆出去的模块：它是唯一会逐帧读 DOM 几何的逻辑，也是唯一需要判断「composer 结构是否还匹配」的地方。

- 依赖的宿主契约：`[data-composer-input]`（可编辑面）、`[data-input-scroll]`（滚动容器）、`[data-composer-card]`（外来光标检测的作用域）、`[data-composer-composing]` / `[data-composer-chip-selected]`（回退状态）。
- 自身标记：`data-islands-smooth-caret`（body，覆盖光标生效）、`data-islands-caret-active`（当前正在绘制的输入框）。
- 兼容判断只看钩子与外来光标：结构化探测失败 → `missing`，检测到其他光标插件 → `yielded`，两者都只关闭平滑光标本身，不影响皮肤。
- 不按版本号判断：`src/host/runtime.js` 的契约表就是唯一的版本判断依据。

## 运行时

`installParts()` 在插件启动时走一遍 `document.body`：

- 进入匹配 `within` 的区域；
- 读元素的 `classList`，把本地名查成部件名；
- 写 `data-islands-part`（多值空格分隔）；
- 之后由 `MutationObserver` 处理新挂载节点和 `class` 变化。

区域可以嵌套。子区域可以锚在父区域写出的部件上（例如 `settings-panel`、`settings-nav`、`settings-area`），遍历器写完父部件后会再检查一次区域锚点。

`parts` 会作用于区域内的所有后代，因此 `panel`、`card`、`section`、`header` 这类通用本地名不能直接放进 `parts`：DSH 的插件设置页也会使用这些类名。对话框外壳的座位改用 `rootParts` 只匹配直接子级，`close` 再锚在 `header` 区域里；`navCell`/`active` 等只在 `settings-nav` 子树内匹配。新增区域时优先选择更窄的锚点，而不是把通用名字广播给整棵子树。

## 工作区底部的共享槽位

`sidebar.footer.action` 是插件 footer 内容的共享槽位。islands-ui 把它从 48px 轨道挪到了**工作区岛底部**：宿主仍报告 `wide`（侧栏是展开态），而座位现在也确实是宽的（工作区列的宽度），所以宽栏插件不再需要挤进窄轨道。

宿主结构是 `footArea > footerActions（sidebar.footer.action）+ settingsArea（sidebar.settings）`。展开态把 `foot-area` 设为 `display: contents`，让两个子项各占一个网格位：

- `settings-area`：`grid-area: 4 / 1 / 6 / 2`，跨 settings/footer 两行、底部对齐，留在 48px 轨道底部（设置齿轮、账号头像仍在这里；更新入口锚定在轨道脚注上方）；
- `footer-actions`：`grid-area: 5 / 2`，工作区列的第 5 行（footer 行），在工作区岛内部；
- `region-area`：`grid-area: 3 / 2 / 5 / 3`，被 footer 挤压时保持内部滚动；
- `sidebar-root::after` 的岛屿卡片仍覆盖整列，footer 视觉上属于工作区岛。

**容器由皮肤负责**（`src/host/footer.js`）：

- 高度：`min-height: min(200px, max-height)`，默认自适应内容，`max-height` 为 `min(800px, 侧栏高 45%)`；矮窗口时下限自动让位给 45% 上限，不会压垮工作区。拖动 handle 上方 5px 的独立拖动条可在范围内调整，调整值写入 `localStorage`（`dsh-islands-ui:footer`），折叠/展开和下次打开窗口都按它恢复。
- handle 的 `aria-label` 跟随 `document.documentElement.lang`（zh → 底部栏，其他 → Footer），`aria-controls` 指向 footer 容器（无 id 时补 `isl-footer-seat`）；不设置 `title` 原生提示。
- 折叠：底部 20px handle 条可点击收起/展开；收起时 footer 只保留这条，工作区恢复全高。默认展开。调整高度从 handle 上方 5px 的独立拖动条进行（悬停/拖动时显示强调色细条），按钮本身只负责点击，两者热区不重叠。
- 滚动：内容超过当前高度时在 `footer-actions` 内滚动。
- 空态：槽位没有子项/文本时隐藏 footer 和 handle，工作区占满全高（presence-based；插件自己 `display:none` 的占位也算空）。
- 分隔与 handle：footer 与工作区之间用 20px 顶部留白分隔（不用 `border`）；handle 是覆盖整行留白的白底遮罩条（hover/拖动时整行圆角高亮），滚动内容不会从按钮两侧露出；折叠时它作为岛屿底盖，水平保持与展开相同的 8px 内缩（宽度不跳变），仅垂直内缩 1px 让卡片底边框可见，底部圆角用内圆角 `calc(var(--isl-radius-lg) - 1px)`；窄屏抽屉下 footer 上移 `--isl-gap`。工作区折叠（`data-islands-workspace-collapsed`）时 footer 和 handle 一起隐藏。
- 访客几何不再在展开态被改写；只保留 `sidebar-collapsed` 轨道的 36px tile（`src/20-sidebar.css`）。

访客契约（给插件作者）：footer 座位是宽的，按普通宽内容渲染即可；不要再假设 48px 轨道。注入到 `sidebar.footer.action` 的控件不需要自带图标来“缩成方块”，带上正常的标题/aria-label 即可。

不要在 `60-peers.css` 为某个 footer 插件写专用规则：座位几何由皮肤统一负责，按插件名加例外会让下一个插件重新出问题。

## 宿主改名时

- **只改哈希**：无需改动，规则继续命中。
- **改本地名**：部件写不上，对应规则安静地不生效；在 `src/host/runtime.js` 的对应区域表里改一行。
- **改稳定契约**：改 `HOST` 里的字面量，并确认 `scripts/check-css.mjs` 仍通过。
- **新增宿主部件**：在对应区域的 `parts` 表加一行本地名 → 部件名，在 CSS 里读新部件；`check:parts` 会拒绝“定义了没人读”的条目。

## 检查

```sh
node build.mjs
npm run check
```

`check` 依次运行构建产物是否过期、CSS 门禁、部件表门禁、单元测试和打包检查。宿主类名或 `[class*=...]` 出现在核心样式表里会让构建失败。

## 第三方插件

`60-peers.css` 里的规则只服务 dsh-better-sidebar 的底部工作台：它自己的 `data-dsh-*` 标记和内部类名。核心样式表不读这些标记；peer 改名时只影响这个文件。dsh-sidenote 的头部入口原本靠 `_5KEEsG_headerSide` 隐藏，这属于第三方内部类名，已从核心样式移除。
