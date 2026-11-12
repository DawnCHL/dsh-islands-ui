# 发布与商店收录

这份文档只覆盖 `dsh-islands-ui` 自身的发布流程。发布前先在仓库根执行一次完整校验：

```bash
npm run check
npm pack --dry-run
```

`npm run check` 会检查包名、`dsh.bundle`、`cordis.patch.yml` 的 row name、`client.js` 是否是最新构建、`skin.json`、截图、图标以及 `files[]` 是否遗漏关键文件。

## 1. 发布到 npm

```bash
npm login
npm whoami                 # 确认登录的是准备发布该包的账号
npm publish --access public
```

包内 `publishConfig.registry` 已固定为 `https://registry.npmjs.org/`。本机 npm 配置指向 `registry.npmmirror.com` 也没关系，`publishConfig` 会覆盖它；npmmirror 是只读镜像，不能直接发布。

发布后确认：

```bash
npm view dsh-islands-ui version
npm view dsh-islands-ui dist.tarball
```

## 2. 本地安装验证

不发布也可以先用 `npm pack` 产物做一次真实安装验证：

```bash
npm pack                         # 生成 dsh-islands-ui-1.0.0.tgz
dsh plugin --profile desktop add /绝对路径/dsh-islands-ui-1.0.0.tgz
```

安装后刷新页面，确认：

- 左侧栏、浮岛布局、置顶聚合、设置页和模型弹层都正常；
- **设置 → Islands UI** 的开关、强调色和折叠状态可用；
- 刷新/重启后仍然生效。

需要回退到本地 link 开发时：

```bash
dsh plugin --profile desktop remove dsh-islands-ui
dsh plugin --profile desktop add /Users/bye/Documents/deepseek-harness/default-workspace/islands-ui
```

## 3. DSHHub

DSHHub（<https://dshpluginhub.ai>）会自动发现 npm 上带合法 `dsh.bundle` manifest 的包，不需要额外提交。发布后：

1. 等下一次同步，或在 Hub 里搜索 `dsh-islands-ui`；
2. 用 GitHub App 认领条目，之后可以在 dashboard 修改展示文案；
3. 如果长时间没有被发现，检查 `dsh.bundle.patch` 是否存在、`cordis.patch.yml` 的 row name 是否等于包名。

## 4. awesome-dsh-plugin / dsh-market

dsh-market 的插件目录和「主题」Tab 都读取 <https://awesome-dsh-plugin.com> 的目录。收录方式是向 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) 提一个只新增一个文件的 PR：

```text
data/plugins/DawnCHL__dsh-islands-ui.yml
```

内容直接复制仓库里的 [awesome-dsh-plugin.yml](awesome-dsh-plugin.yml)。注意：

- 文件名必须是 `<owner>__<repo>.yml`；
- `url` 必须和 GitHub 仓库完全一致；
- 分类用 `theme`（主题/皮肤类必须放这里，才会进 dsh-market 的「主题」Tab）；
- `description.en` 必填，描述里如果有英文冒号加空格要用引号；
- 不要在 yml 里写 `npm:` 字段，目录会从 registry 自动关联；
- 仓库需要加 GitHub topic `dsh-plugin`，且仓库创建满 1 天；
- 截图已经在仓库根的 `screenshots.json` 里声明，不需要再往 awesome 仓库提交截图。

合并后网站会自动重建，dsh-market 下一次拉取目录时即可看到。

## 5. 发布检查清单

- [ ] `npm run check` 通过
- [ ] `npm pack --dry-run` 的 `files` 包含 `client.js`、`cordis.patch.yml`、`skin.json`、`screenshots.json`、`assets/`、`locale/`
- [ ] `package.json` 的 `repository` 指回 `github.com/DawnCHL/dsh-islands-ui`
- [ ] `cordis.patch.yml` 的 row name 是 `dsh-islands-ui`
- [ ] `client.js` 已重新构建并提交
- [ ] `skin.json` 的 `package` / `wiring.id` 与包名、row id 一致
- [ ] 本地 tarball 安装、刷新、重启均正常
- [ ] npm 发布后 `npm view dsh-islands-ui version` 正确
- [ ] awesome-dsh-plugin PR 只新增 `data/plugins/DawnCHL__dsh-islands-ui.yml`

## 6. 版本与回滚

后续发版只改 `package.json` 的 `version`，在 `CHANGELOG.md` 记录改动，然后重复第 1 步。npm 不允许覆盖同版本；发布错了就发一个更高的补丁版本。

如果新版本在本地验证时出问题：

```bash
npm pack --dry-run                 # 先看包内容
dsh plugin --profile desktop remove dsh-islands-ui
dsh plugin --profile desktop add /Users/bye/Documents/deepseek-harness/default-workspace/islands-ui
```

这样会回到仓库目录的 link 安装，继续改代码即可；确认修复后再重新 `npm pack` / 发布。
