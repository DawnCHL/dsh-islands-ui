<div align="center">
  <img src="assets/icon-180.png" width="86" height="86" alt="Islands UI" />
  <h1>Islands UI</h1>
  <p><strong>A floating-island interface skin for DeepSeek Harness</strong></p>
  <p>Rounded islands · persistent rail · pinned-session shelf · adjustable accent</p>
  <p>
    <a href="https://www.npmjs.com/package/dsh-islands-ui"><img alt="npm" src="https://img.shields.io/npm/v/dsh-islands-ui?style=flat-square" /></a>
    <a href="https://github.com/DawnCHL/dsh-islands-ui"><img alt="GitHub" src="https://img.shields.io/badge/GitHub-DawnCHL%2Fdsh--islands--ui-3b3b3b?style=flat-square" /></a>
    <img alt="platform" src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-4f7cff?style=flat-square" />
  </p>
</div>

<p align="center">
  <img src="assets/all-panels.png" alt="Islands UI: rail, conversation, right sidebar and bottom panel" width="100%" />
</p>

Islands UI reorganizes the Harness three-column shell into a set of rounded islands floating on a solid canvas: a persistent icon rail, a separate workspace list, the conversation island, a right workbench and a bottom panel, separated by 5px canvas gaps and hairline borders. It does not touch sessions, settings or plugin logic — it only redraws the interface.

---

## Install

```bash
# Desktop profile (the default app profile)
dsh plugin --profile desktop add dsh-islands-ui

# Or the web profile used by a browser/remote setup
dsh plugin --profile web add dsh-islands-ui
```

Then refresh (`⌘R` / `Ctrl+R`). The skin is enabled by default. Turn it off at **Settings → Islands UI** to restore the stock appearance immediately; your preference and accent are kept.

> Requires DeepSeek Harness `0.2.2-rc.1` or newer within the `0.2.x` line. The package declares `dsh.bundle` + `dsh.client`, so `dsh plugin add` installs and mounts it without editing the profile by hand.

### Uninstall

```bash
dsh plugin --profile desktop remove dsh-islands-ui
```

---

## What it changes

| | Feature | Details |
| :---: | --- | --- |
| 🏝 | **Floating islands** | Canvas, conversation, workspace, right sidebar and bottom panel become separate rounded surfaces; flat, no drop shadows, separated by color and a 1px hairline |
| 🧭 | **Persistent rail** | Workspace / automation / plugins / pinned plugins / more; right-click or “…” opens the plugin pin menu |
| ⚙️ | **Settings page** | Settings → Islands UI: on/off, accent presets, custom color and follow-theme |
| 📌 | **Pinned shelf** | Pinned sessions stay in their workspace and are also aggregated between “New session” and “Workspace”; the group collapses |
| 🌙 | **Dark mode** | Full dark token set: near-black canvas, dark islands, translucent interaction layers |
| ⌨️ | **Shortcuts** | `⌘B`, `⌥⌘B`, `⌘,`, `⌘⇧M`; buttons show the current binding on hover |

The skin is a client-only style layer. Pinning helpers, the pinned shelf and the settings page are also implemented in the browser bundle; no host tool, service or session data is added.

---

## Design language

| Layer | Rule |
| --- | --- |
| Canvas | Solid `#f7f7f7` (dark `#0f1012`), opaque, no blur |
| Islands | White / dark-gray surfaces, 16–20px radius, 1px hairline, no shadows |
| Spacing | 5px between every island, including the bottom panel |
| Top bar | 40px window strip; macOS clears the traffic lights, Windows/Linux starts at 8px below the native title bar |
| Accent | Brand blue by default; purple / green / orange / pink / red presets or any custom color |

---

## Platform support

| Platform | Status |
| --- | --- |
| macOS | ✅ Tested |
| Windows | 🟡 Custom top bar, rail, settings gear, right-sidebar toggle and model picker adapted; **not tested on a physical Windows machine** |
| Linux | 🟡 Uses the same top bar and rail; **not tested** |

On Windows the native title bar stays in place and the custom strip sits below it; `--dsh-windows-titlebar-height` is respected. Linux follows native window decorations, which vary by desktop environment.

If you hit a title-bar, drag-region, window-button or layout issue, please open an [issue](https://github.com/DawnCHL/dsh-islands-ui/issues) with your OS version, window size and a screenshot.

---

## Screenshots

| New session | Workspace collapsed |
| :---: | :---: |
| ![New session](assets/new_session.png) | ![Workspace collapsed](assets/workspace-closed.png) |
| **Pinned and reveal** | **Settings · Islands UI** |
| ![Pinned and reveal](assets/pin-session.png) | ![Settings](assets/settings.png) |

---

## State

Stored in `localStorage`; clear these keys to reset:

| Key | Purpose |
| --- | --- |
| `dsh-islands-ui:enabled` | `1` / `0`, master switch |
| `dsh-islands-ui:accent` | Custom accent color; absent means follow theme |
| `dsh-islands-ui:pinned-collapsed` | Whether the pinned group is collapsed |
| `dsh-islands-ui:rail-pins` | Extra plugin ids pinned to the left rail |

---

## Development

```text
src/
  00-tokens.css        design tokens + --dsw-* aliases (single source of truth)
  10-shell.css         three-column shell → canvas + islands
  15-topbar.css        window top bar
  16-rail.css          left icon rail, plugin pin menu, settings gear
  20-sidebar.css       workspace island, pinned shelf, session row states
  30-conversation.css  conversation page, composer, top tool group
  40-settings.css      settings dialog and section shell
  45-model-picker.css  model / reasoning popover
  50-components.css    preference rows, switches, accent picker
  client.template.js   browser entry (React components + slot registrations)
build.mjs              inline src/*.css into client.js
client.js              built, self-contained artifact
scripts/check-package.mjs  pre-publish packaging checks
skin.json              theme-manager manifest
```

```bash
npm run build        # regenerate client.js after editing CSS or the template
npm run check        # verify the build is current and the package is publishable
npm run pack:check   # npm pack --dry-run
npm pack             # produce dsh-islands-ui-<version>.tgz
```

The module loader cannot read package files at runtime, so `client.js` must contain the full stylesheet. Always commit the rebuilt artifact.

### Package layout

| Path | Purpose |
| --- | --- |
| `index.js` | Host half; the skin has no host behavior, so this only keeps the bundle a valid profile row |
| `client.js` | Browser half: stylesheet injection, rail, pinned shelf, settings page and model picker |
| `cordis.patch.yml` | One `insert` row named `dsh-islands-ui` |
| `skin.json` | id, display name, accent, body attribute and wiring row for theme managers |
| `screenshots.json` | 1–8 repository-relative screenshots read by storefronts |
| `assets/` | Store icon and README screenshots |

---

## Publishing

See [docs/publishing.md](docs/publishing.md) for the full checklist. Short version:

```bash
npm login
npm run check
npm publish --access public
```

The package targets `https://registry.npmjs.org/` explicitly in `publishConfig`, so a local npm mirror (e.g. `registry.npmmirror.com`) cannot swallow the publish.

Store coverage:

- **npm** — canonical install source; [dsh-islands-ui](https://www.npmjs.com/package/dsh-islands-ui)
- **DSHHub** — discovers npm packages with a valid `dsh.bundle` manifest automatically
- **awesome-dsh-plugin / dsh-market** — submit the ready-to-copy `theme` entry in [docs/awesome-dsh-plugin.yml](docs/awesome-dsh-plugin.yml)
- **dsh-market Themes tab** — follows the `theme` category from awesome-dsh-plugin

---

## Compatibility

- The skin is a pure client style layer and does not replace session, settings or plugin data or behavior.
- Selectors depend on the current Harness build's CSS Module hashes (e.g. `PIRFFq_*`, `kB3qhq_*`, `JoiKIa_*`, `_77Pn0W_*`) and a few `data-*` hooks. A Harness upgrade or rebuild can change those class names and require a matching CSS update.
- Dark mode follows `data-ds-dark-theme`; the accent remaps `--dsw-alias-state-business-primary`, so it affects both the skin and native buttons.
- Windows uses `data-windows-titlebar` and `--dsh-windows-titlebar-height`; Linux currently follows native window decorations.
- `dsh.engines.dsh` / `engines.dsh` pin the tested line to `>=0.2.2-rc.1 <0.3.0-0`; `skin.json` gives theme managers the id, accent and mount row.

---

## Feedback

- Bugs / compatibility: [Issues](https://github.com/DawnCHL/dsh-islands-ui/issues)
- Improvements: PRs welcome
- Windows / Linux test reports especially welcome (screenshot + OS version + window size)

<p align="center"><sub>Made for DeepSeek Harness · Islands UI</sub></p>
