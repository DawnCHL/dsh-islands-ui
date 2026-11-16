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
| `src/*.css` | 只读 `data-islands-part` 和宿主契约 |
| `src/60-peers.css` | 第三方插件适配，允许 `[class*=...]`，核心样式不读 |
| `src/31-caret.css` | 发送按钮强调色与光标绘制样式，读 `composer-primary` 部件 |
| `scripts/check-css.mjs` | 选择器门禁：作用域、部件名、属性白名单、禁止哈希类名/子串匹配 |
| `scripts/check-parts.mjs` | 表完整性：定义了没读、读了没定义、本地名格式 |
| `test/host-runtime.test.mjs` | 本地名提取和表的单元测试 |

## 输入光标

平滑光标是唯一按「功能」拆出去的模块，因为它是唯一会逐帧读 DOM 几何的逻辑，也是唯一需要判断「composer 结构是否还匹配」的地方。

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
