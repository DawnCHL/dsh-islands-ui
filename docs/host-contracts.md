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
| `src/host/collapse.js` | 宿主折叠策略；区分用户折叠与自动折叠（纯函数，单测覆盖） |
| `src/host/compat-gate.js` | 兼容门禁状态机：等待外壳挂载、部件提交宽限、失败自愈与会话可见性（时钟、定时器、契约探针全部注入，单测覆盖） |
| `src/host/yield.js` | 运行时让位状态机：争抢侧栏时停止显示、按 500ms/1s/1.5s 梯度试探恢复、三次失败提示并放慢（时钟、定时器、折叠探针与提示回调全部注入，单测覆盖） |
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

- `settings-area`：`grid-area: 4 / 1 / 6 / 2`，跨 settings/footer 两行、底部对齐，留在 48px 轨道底部（账号 launcher 在这里；设置齿轮是皮肤自己的 `.isl-railSettings`，不在这个座位里；更新入口锚定在轨道脚注上方）；
  这是 48px 轨道列的脚注：账号是 36px 头像 tile，插件加到设置行里的入口由皮肤收成同一列 tile（`max-width:36px`、`flex-wrap:wrap`、`order:-1` 在账号上方；多图标组折成竖排胶囊，文字进无障碍树）。宿主仍报告 `wide=true`，这是有意的：皮肤不把插件的宽入口塞进更窄的座位，而是把入口折进轨道；需要宽内容的插件请用 `sidebar.footer.action`（工作区岛底部的宽座位）。
- `footer-actions`：`grid-area: 5 / 2`，工作区列的第 5 行（footer 行），在工作区岛内部；
- `region-area`：`grid-area: 3 / 2 / 5 / 3`，被 footer 挤压时保持内部滚动；
- `sidebar-root::after` 的岛屿卡片仍覆盖整列，footer 视觉上属于工作区岛。

**容器由皮肤负责**（`src/host/footer.js`）：

- 高度：默认贴合内容（自然高度 = 20px 顶部留白 + 内容 + 8px 底部内距）。座位的 `min-height` 由皮肤发布为 `--isl-footer-min = min(200px, 内容自然高度)`（也受 45% 上限约束），所以短内容不会被撑到 200px，恢复的手动高度也不会裁掉后来变高的内容；拖拽下限使用同一个值。`max-height` 为 `min(800px, 侧栏高 45%)`，矮窗口时下限自动让位给上限，不会压垮工作区。拖动 handle 上方 5px 的独立拖动条可在范围内调整，调整值写入 `localStorage`（`dsh-islands-ui:footer`，带版本号），折叠/展开和下次打开窗口都按它恢复。旧版本写入的 200px 下限值（无法与“未拖拽”区分）在升级后一次性迁移为自适应；版本化之后的 200px 拖拽高度会保留。
- 布局：footer 是 `flex-direction: column; flex-wrap: nowrap` 的纵向堆叠；直接访客 `min-width: 0; max-width: 100%; flex-shrink: 0`，横向溢出由座位裁掉。新增访客只会向下增加行，不会把原有内容横向挤出岛屿；内容超过座位高度时在内部纵向滚动，滚动条按左侧 rail 的方式隐藏。
- 存储高度：内容不超过 200px 且存储值等于内容下限时按自适应处理（等价于贴合内容）；内容高于下限时，存储值在下限处保持固定高度并内部滚动，不会因为 `auto` 回弹到完整内容高度。内容只比固定高度多 16px 以内时按内容高度渲染，避免为一条缝隙显示滚动条。
- handle 的 `aria-label` 跟随 `document.documentElement.lang`（zh → 底部栏，其他 → Footer），`aria-controls` 指向 footer 容器（无 id 时补 `isl-footer-seat`）；不设置 `title` 原生提示。
- 折叠：底部 20px handle 条可点击收起/展开；收起时 footer 只保留这条，工作区恢复全高。默认展开。调整高度从 handle 上方 5px 的独立拖动条进行（悬停/拖动时显示强调色细条），按钮本身只负责点击，两者热区不重叠。
- 滚动：内容超过当前高度时在 `footer-actions` 内滚动，滚动条按左侧 rail 的方式隐藏（`scrollbar-width: none`），滚轮/触控板仍可滚动。
- 空态：槽位没有子项/文本时隐藏 footer 和 handle，工作区占满全高（presence-based；插件自己 `display:none` 的占位也算空）。
- 分隔与 handle：footer 与工作区之间用 20px 顶部留白分隔（不用 `border`）；handle 是覆盖整行留白的白底遮罩条（hover/拖动时整行圆角高亮），滚动内容不会从按钮两侧露出；折叠时它作为岛屿底盖，水平保持与展开相同的 8px 内缩（宽度不跳变），仅垂直内缩 1px 让卡片底边框可见，底部圆角用内圆角 `calc(var(--isl-radius-lg) - 1px)`；窄屏抽屉下 footer 上移 `--isl-gap`。工作区折叠（`data-islands-workspace-collapsed`）时 footer 和 handle 一起隐藏。
- 访客几何在 `settings-area` 轨道座位里统一归一化（36px tile）；`footer-actions` 仍然是宽座位，不改访客几何。

访客契约（给插件作者）：footer 座位是宽的，按普通宽内容渲染即可；不要再假设 48px 轨道。注入到 `sidebar.footer.action` 的控件不需要自带图标来“缩成方块”，带上正常的标题/aria-label 即可。

不要在 `60-peers.css` 为某个 footer 插件写专用规则：座位几何由皮肤统一负责，按插件名加例外会让下一个插件重新出问题。

## 折叠：宿主保持展开，皮肤只隐藏工作区

`data-islands-workspace-collapsed` 是唯一的折叠真相；宿主在两种状态下都保持 `wide=true`，插件的 `wide=false` 分支不会出现：

- 皮肤隐藏工作区列（new-session、region-area、footer-actions、`::after` 岛屿卡片），把帧首列缩到 `--isl-rail-collapsed-width`（= `--isl-rail-width`，48px，与展开态轨道列同宽），`settings-area` 轨道脚注原样保留；
- 工作区 DOM 不卸载，**皮肤折叠路径**下会话列表滚动位置和侧栏宽度保留；原生 `⌘B` 由宿主 `toggleSidebar` 展开会回到默认 280（公开 layout 服务没有宽度 setter）；
- 宿主原生折叠（macOS 主 `⌘B` 走桌面桥、Windows 标题栏按钮）由 `native collapse conversion` 转换回皮肤折叠；转换由 `src/host/collapse.js` 的 `hostCollapseAction()` 决定：
  - 皮肤关闭 → 不接管；
  - drawer 模式 → 清掉皮肤折叠（drawer 自己拥有 workspace）；
  - `<1024px`、跨断点 resize、窄窗右栏打开等**自动折叠** → 只“折叠”（不会把用户折叠的工作区反过来展开），并把宿主重新展开；
  - 宽窗下没有上述上下文的折叠才是用户手势 → toggle；
- 关闭皮肤时同时清掉皮肤折叠和 `data-islands-animating`，宿主恢复原生折叠行为；
- 折叠时若焦点在工作区列内（不在轨道/topbar/settings 座位），焦点移到 topbar toggle 或轨道首页；topbar toggle 带 `aria-expanded` 和折叠/展开文案；
- `sidebar-collapsed` 的样式只用于 conversion 的那一帧（宿主不会常驻折叠）；
- 轨道图标在折叠态选中即展开工作区（`select()` 先 `toggleWorkspace()` 再 `selectPanel()`）。
- 另一侧也在争这个侧栏时（例如 ds-bot 的 Bot 模式要宿主收起侧栏），皮肤按 `src/host/yield.js` 让位而不是对着抢：3 秒内 `data-sidebar-collapsed` 出现 3 次即停止显示，达到阈值的那一次不再展开；侧栏稳定展开后按 500ms → 1s → 1.5s 试探恢复；连续三次失败改为每 30 秒试探一次，并在右下角提示「关闭皮肤 / 立即重试 / 取消」。让位本身不弹提示，状态与「立即重试」同时留在设置页。

## 皮肤关闭时

组件在运行中关闭皮肤后仍然挂载（门禁只负责冷启动不激活），所以样式才是唯一开关：

- 每个注入宿主槽位的皮肤根节点（顶栏、左侧栏、轨道按钮、模型选择器、页脚手柄与拖拽条、右栏按钮、固定会话区）都必须在 `body[data-islands-ui]` 之外有一条 `display: none` 基线规则，再由作用域内的规则重新显示；
- 只在作用域内写 `display` 的节点，关闭皮肤后会以默认排版浮在页面左上或输入框上方（左侧栏与模型选择器就是这样漏出来的）；
- 设置页与两种提示（兼容提示、让位提示）是例外：它们必须在皮肤关闭时可见。

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
