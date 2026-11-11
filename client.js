/**
 * Browser half of the Islands UI skin.
 *
 * One job: publish the design-system stylesheet and a preference switch. The
 * stylesheet lives in src/*.css and is inlined by build.mjs — the module loader
 * has no filesystem access, so the built client.js is self-contained.
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-islands-ui',
  factory(require) {
    const React = require('react');
    const ReactDOM = require('react-dom');
    const h = React.createElement;
    const CSS = "/* ---- 00-tokens.css ---- */\n/* ==========================================================================\n   Islands UI · 00 tokens\n   One source of truth for the skin. Every rule below reads these variables,\n   so light/dark, radius, elevation and spacing are changed in one place.\n   `--dsw-*` aliases are re-pointed at the Islands scale so shipped components\n   inherit the new language without per-component overrides.\n   ========================================================================== */\n\nbody[data-islands-ui] {\n  /* Canvas: the unified background all islands float on. */\n  --isl-canvas: #f7f7f7;\n  --isl-canvas-veil: rgba(232, 234, 239, 0.72);\n  /* Island surfaces. */\n  --isl-surface: #ffffff;\n  --isl-surface-muted: #f3f5f8;\n  --isl-surface-sunken: #eceef3;\n  /* Hairlines: Islands uses tinted, very quiet borders. */\n  --isl-border-soft: rgba(17, 24, 39, 0.06);\n  --isl-border: rgba(17, 24, 39, 0.09);\n  --isl-border-strong: rgba(17, 24, 39, 0.14);\n  --isl-hover: rgba(17, 24, 39, 0.055);\n  --isl-active: rgba(17, 24, 39, 0.09);\n  /* Geometry. */\n  --isl-radius-xl: 20px;\n  --isl-radius-lg: 16px;\n  --isl-radius-md: 12px;\n  --isl-radius-sm: 8px;\n  --isl-gap: 5px;\n  --isl-topbar-height: 40px;\n  --isl-rail-collapsed-width: 56px;\n  --isl-rail-width: 48px;\n  /* Elevation: a hairline ring plus one soft, deep shadow. */\n  --isl-shadow-island: none;\n  --isl-shadow-float:\n    0 0 0 1px rgba(17, 24, 39, 0.05), 0 10px 24px -10px rgba(17, 24, 39, 0.14),\n    0 28px 64px -32px rgba(17, 24, 39, 0.3);\n\n  /* ---- DSH alias layer -------------------------------------------------- */\n  --dsw-alias-bg-base: var(--isl-surface);\n  --dsw-alias-bg-layer-1: var(--isl-surface);\n  --dsw-alias-bg-layer-2: var(--isl-surface);\n  --dsw-alias-bg-layer-3: var(--isl-surface-muted);\n  --dsw-alias-bg-overlay: var(--isl-surface);\n  --dsw-alias-bg-module-platform: var(--isl-surface-muted);\n  --dsw-alias-bg-multi-select: var(--isl-surface-muted);\n  --dsw-alias-bg-skeleton: rgba(17, 24, 39, 0.06);\n  --dsw-specific-sidebar-fill: var(--isl-surface);\n  --dsw-specific-input-major: var(--isl-surface);\n  --dsw-specific-selector: var(--isl-surface-muted);\n  --dsw-specific-tip: var(--isl-surface-muted);\n  --dsw-specific-bubble: var(--isl-surface-muted);\n  --dsw-specific-bubble-highlight: #eef1f6;\n  --dsw-specific-sidebar-nav-item-active: var(--isl-surface-muted);\n  --dsw-specific-sidebar-nav-item-active-accent: color-mix(\n    in srgb,\n    var(--dsw-alias-state-business-primary) 16%,\n    transparent\n  );\n  --dsw-specific-menu: color-mix(in srgb, var(--isl-surface) 90%, transparent);\n  --dsw-alias-menu-group-header-fill: color-mix(in srgb, var(--isl-surface-muted) 92%, transparent);\n  --dsw-alias-markdown-code-block: var(--isl-surface-muted);\n  --dsw-alias-markdown-code-block-banner: var(--isl-surface-muted);\n  --dsw-alias-markdown-inline-code: var(--isl-surface-muted);\n  --dsw-alias-markdown-tag: var(--isl-surface-muted);\n  --dsw-alias-settings-card-fill: color-mix(in srgb, var(--isl-surface-muted) 68%, var(--isl-surface));\n  --dsw-alias-settings-card-stroke: var(--isl-border-soft);\n  --dsw-alias-border-l1: var(--isl-border-soft);\n  --dsw-alias-border-l2: var(--isl-border-soft);\n  --dsw-alias-border-l3: var(--isl-border);\n  --dsw-alias-border-l4: var(--isl-border-strong);\n  --dsw-alias-interactive-bg-hover: var(--isl-hover);\n  --dsw-alias-interactive-bg-active: var(--isl-active);\n  --dsw-alias-interactive-bg-hover-solid: var(--isl-surface-muted);\n  --dsw-alias-button-elevated-fill: var(--isl-surface);\n  --dsw-alias-button-floating-fill: var(--isl-surface);\n  --dsw-alias-button-floating-hover: var(--isl-surface-muted);\n  --dsw-radius-xs: 6px;\n  --dsw-radius-sm: 8px;\n  --dsw-radius-md: 10px;\n  --dsw-radius-lg: 14px;\n  --dsw-radius-xl: 18px;\n  --dsw-radius-panel: 20px;\n  --dsw-menu-backdrop-filter: blur(18px) saturate(140%);\n  --dsw-mask-blur: blur(3px);\n  --dsw-alias-bg-mask-1: rgba(107, 114, 128, 0.3);\n  --dsw-alias-bg-mask-2: rgba(107, 114, 128, 0.18);\n\n  background-color: var(--isl-canvas) !important;\n}\n\n/* Elevation tokens are declared on `body, body *` by the shipped theme, so the\n   override has to be declared on descendants too, not only on body. */\nbody[data-islands-ui] * {\n  --dsw-elevation-stroke-color: var(--isl-border);\n  --dsw-elevation-stroke: 0 0 0 0.5px var(--isl-border);\n  --dsw-elevation-soft:\n    0 0 0 0.5px var(--isl-border), 0 6px 16px -6px rgba(17, 24, 39, 0.1),\n    0 18px 40px -24px rgba(17, 24, 39, 0.24);\n  --dsw-elevation-panel:\n    0 0 0 0.5px var(--isl-border), 0 8px 20px -8px rgba(17, 24, 39, 0.12),\n    0 24px 48px -28px rgba(17, 24, 39, 0.24);\n  --dsw-elevation-prominent:\n    0 0 0 0.5px var(--isl-border), 0 12px 28px -10px rgba(17, 24, 39, 0.16),\n    0 32px 64px -32px rgba(17, 24, 39, 0.3);\n  --dsw-shadow-lv1: 0 2px 4px rgba(17, 24, 39, 0.05);\n  --dsw-shadow-lv2: 0 4px 12px rgba(17, 24, 39, 0.06), 0 2px 8px rgba(17, 24, 39, 0.04);\n  --dsw-shadow-lv3:\n    0 0 1px rgba(17, 24, 39, 0.2), 0 12px 32px rgba(17, 24, 39, 0.08);\n}\n\n/* ---- Dark --------------------------------------------------------------- */\nbody[data-islands-ui][data-ds-dark-theme] {\n  --isl-canvas: #0f1012;\n  --isl-canvas-veil: rgba(15, 16, 18, 0.72);\n  --isl-surface: #1b1c1f;\n  --isl-surface-muted: #232428;\n  --isl-surface-sunken: #151619;\n  --isl-border-soft: rgba(255, 255, 255, 0.06);\n  --isl-border: rgba(255, 255, 255, 0.09);\n  --isl-border-strong: rgba(255, 255, 255, 0.16);\n  --isl-hover: rgba(255, 255, 255, 0.06);\n  --isl-active: rgba(255, 255, 255, 0.1);\n  --isl-shadow-island: none;\n  --isl-shadow-float:\n    0 0 0 1px rgba(0, 0, 0, 0.55), 0 12px 28px -12px rgba(0, 0, 0, 0.6),\n    0 32px 72px -36px rgba(0, 0, 0, 0.85);\n\n  --dsw-alias-bg-skeleton: rgba(255, 255, 255, 0.07);\n  --dsw-specific-bubble-highlight: #2a2c31;\n  --dsw-specific-menu: color-mix(in srgb, var(--isl-surface) 88%, transparent);\n  --dsw-alias-bg-mask-1: rgba(0, 0, 0, 0.55);\n  --dsw-alias-bg-mask-2: rgba(0, 0, 0, 0.32);\n}\n\nbody[data-islands-ui][data-ds-dark-theme] * {\n  --dsw-elevation-stroke-color: var(--isl-border);\n  --dsw-elevation-stroke: 0 0 0 0.5px var(--isl-border);\n  --dsw-elevation-soft:\n    0 0 0 0.5px var(--isl-border), 0 8px 20px -8px rgba(0, 0, 0, 0.55),\n    0 20px 44px -24px rgba(0, 0, 0, 0.7);\n  --dsw-elevation-panel:\n    0 0 0 0.5px var(--isl-border), 0 10px 24px -10px rgba(0, 0, 0, 0.55),\n    0 28px 56px -30px rgba(0, 0, 0, 0.75);\n  --dsw-elevation-prominent:\n    0 0 0 0.5px var(--isl-border), 0 14px 32px -12px rgba(0, 0, 0, 0.6),\n    0 36px 72px -36px rgba(0, 0, 0, 0.85);\n  --dsw-shadow-lv1: 0 2px 6px rgba(0, 0, 0, 0.35);\n  --dsw-shadow-lv2: 0 6px 16px rgba(0, 0, 0, 0.4);\n  --dsw-shadow-lv3: 0 0 1px rgba(0, 0, 0, 0.6), 0 16px 40px rgba(0, 0, 0, 0.45);\n}\n\n/* macOS ships a tinted, translucent sidebar. Islands wants an opaque canvas\n   instead, so the tint is replaced everywhere it is declared. */\nhtml[data-platform='darwin'] body[data-islands-ui],\nhtml[data-platform='darwin'] body[data-islands-ui][data-ds-dark-theme] {\n  --dsw-specific-menu: color-mix(in srgb, var(--isl-surface) 88%, transparent);\n  --dsw-alias-menu-group-header-fill: color-mix(in srgb, var(--isl-surface-muted) 94%, transparent);\n}\n\n/* ---- 10-shell.css ---- */\n/* ==========================================================================\n   Islands UI · 10 shell\n   The frame becomes a canvas; the three columns become detachable islands.\n   ========================================================================== */\n\nbody[data-islands-ui] .PIRFFq_frame {\n  /* The ocean is a solid surface, never the desktop showing through vibrancy. */\n  background: var(--isl-canvas);\n  padding: calc(var(--isl-topbar-height) + var(--isl-gap)) var(--isl-gap) var(--isl-gap);\n  /* Column gap only: the empty bottom track must not steal an extra row gap,\n     so the islands stay symmetric top and bottom. */\n  gap: 0 var(--isl-gap);\n}\n\n/* A real bottom panel (terminal, banner) still gets breathing room. */\nbody[data-islands-ui] .PIRFFq_bottomRow:has([data-slot='shell.bottom'] > *) {\n  margin-top: var(--isl-gap);\n}\n\n/* The closed right column is a zero-width track, but the grid still reserves a\n   gap beside it; pull the centre island over that gap so the canvas margin on\n   the right equals the margin on the left. */\nbody[data-islands-ui] .PIRFFq_frame[data-rightbar-collapsed] .PIRFFq_centerCol {\n  margin-right: calc(-1 * var(--isl-gap));\n}\n\n/* Center column: the conversation island. */\nbody[data-islands-ui] .PIRFFq_centerCol {\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  border-radius: var(--isl-radius-lg);\n  box-shadow: var(--isl-shadow-island);\n  overflow: hidden;\n}\n\n/* Shipped desktop rules paint the sidebar with a gradient and give the center\n   column a left hairline; both are removed so the canvas reads as one plane. */\n[data-platform='darwin'] body[data-islands-ui] .PIRFFq_frame {\n  background: var(--isl-canvas);\n}\n\n[data-platform='darwin'] body[data-islands-ui] .PIRFFq_frame:not([data-sidebar-drawer]) .PIRFFq_sidebarCol {\n  background: transparent;\n  border-right: 0;\n  backdrop-filter: none;\n}\n\nbody[data-islands-ui] .PIRFFq_sidebarCol {\n  background: transparent;\n  border-right: 0;\n}\n\n[data-platform='darwin'] body[data-islands-ui] .PIRFFq_centerCol,\nbody[data-islands-ui] .PIRFFq_centerCol {\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  border-left: 1px solid var(--isl-border-soft);\n}\n\nbody[data-islands-ui] .PIRFFq_mainPanel {\n  background: transparent;\n}\n\n/* Right workbench: only while a pane is open does the column render an island. */\nbody[data-islands-ui] .PIRFFq_rightbarCol {\n  background: transparent;\n}\n\nbody[data-islands-ui] .Dv5QdW_panel[data-sidebar-right-open]:not([data-sidebar-right-panel='fullscreen']) {\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  border-radius: var(--isl-radius-lg);\n  box-shadow: var(--isl-shadow-island);\n  overflow: clip;\n}\n\n/* Drawer mask on narrow windows: Islands keeps the veil light and blurred. */\nbody[data-islands-ui] .PIRFFq_drawerMask {\n  background: var(--dsw-alias-bg-mask-1);\n  backdrop-filter: var(--dsw-mask-blur);\n}\n\n/* The resize handle is invisible chrome; keep it grabbable but quiet. */\nbody[data-islands-ui] .PIRFFq_handle {\n  width: 10px;\n  margin-left: -5px;\n}\n\n/* Windows title bar keeps its native height; the frame padding already gives\n   the rounded content corner room, so only the radius is unified. */\n[data-windows-titlebar] body[data-islands-ui] .PIRFFq_centerCol {\n  border-radius: var(--isl-radius-lg);\n}\n\n[data-windows-titlebar] body[data-islands-ui] .PIRFFq_frame {\n  padding-top: var(--dsh-windows-titlebar-height);\n  background: var(--isl-canvas);\n}\n\n/* Collapsed sidebar on macOS drops the center column's left hairline; the\n   island keeps its outline regardless. */\n[data-platform='darwin'] body[data-islands-ui] [data-sidebar-collapsed] .PIRFFq_centerCol {\n  border-left: 1px solid var(--isl-border-soft);\n}\n\n/* ==========================================================================\n   Workbench panels (better-sidebar bottom dock + native right sidebar)\n   Both must read as independent islands, not as sheets pasted onto the\n   conversation island.\n   ========================================================================== */\n\n/* The bottom workbench reserves its height on the conversation column, not on\n   the inner panel, so the island itself shrinks and a canvas gap opens between\n   the two islands. */\nbody[data-islands-ui] #root [data-dsh-center-col] {\n  margin-bottom: 0;\n}\n\nbody[data-islands-ui] .PIRFFq_centerCol {\n  margin-bottom: var(--dsh-sidebar-height, 0px);\n  transition: margin-bottom var(--ds-transition-duration-slow) var(--ds-ease-in-out);\n}\n\nbody[data-islands-ui]:has([data-dsh-bottom-panel]:not([class*='Hidden'])) .PIRFFq_centerCol {\n  /* one gap above the panel and one below it */\n  margin-bottom: calc(var(--dsh-sidebar-height, 0px) + var(--isl-gap));\n}\n\nbody[data-islands-ui] [data-dsh-bottom-panel] {\n  box-sizing: border-box;\n  /* Align the panel with the conversation island edges and let the frame\n     padding provide the bottom gap, so every island shares one gap width. */\n  margin: 0;\n  bottom: var(--isl-gap);\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  border-radius: var(--isl-radius-lg);\n  box-shadow: none;\n  overflow: clip;\n}\n\n/* The native right sidebar keeps its own width preference, which can exceed\n   the track the frame grants; clamp it to the track so it never hangs over\n   the conversation island. */\nbody[data-islands-ui] .Dv5QdW_panel[data-sidebar-right-open]:not([data-sidebar-right-panel='fullscreen']) {\n  box-sizing: border-box;\n  width: 100% !important;\n  max-width: 100% !important;\n  min-width: 0;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  body[data-islands-ui] .PIRFFq_centerCol {\n    transition: none;\n  }\n}\n\n/* ==========================================================================\n   Independent workspace collapse\n   The DSH collapse swaps the whole sidebar render tree for its rail-only\n   variant. Instead the expanded rail stays mounted and only the workspace\n   column hides, so the left column never re-renders or re-flows.\n   ========================================================================== */\nbody[data-islands-ui][data-islands-workspace-collapsed] .PIRFFq_frame {\n  grid-template-columns:\n    var(--isl-rail-collapsed-width) minmax(0, 1fr)\n    var(--isl-rightbar-w, 0px) !important;\n}\n\nbody[data-islands-ui] .PIRFFq_frame[data-islands-animating] {\n  transition: grid-template-columns var(--ds-transition-duration-slow) var(--ds-ease-in-out);\n}\n\n/* ---- 15-topbar.css ---- */\n/* ==========================================================================\n   Islands UI · 15 top bar\n   A window-chrome strip above the three islands. It clears the macOS traffic\n   lights, hosts the workspace collapse control, and leaves the content area\n   completely free for the islands.\n   ========================================================================== */\n\n/* Registered even when the skin is off; the base rule keeps it out of the way. */\n.isl-topbar {\n  display: none;\n}\n\nbody[data-islands-ui] .isl-topbar {\n  position: fixed;\n  inset: 0 0 auto;\n  z-index: 30;\n  box-sizing: border-box;\n  display: flex;\n  align-items: flex-start;\n  gap: 6px;\n  height: var(--isl-topbar-height);\n  /* macOS centers the traffic lights in its 48px window-chrome band; the\n     controls follow that center (10 + 14 = 24), not the 40px bar's own. */\n  padding: 10px 10px 0 88px;\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 13px;\n  line-height: 20px;\n  /* The bar itself must never swallow clicks meant for controls that are\n     docked over it; only the toggle and the drag handle opt back in. */\n  pointer-events: none;\n  -webkit-app-region: no-drag;\n  user-select: none;\n}\n\n/* Left lead (traffic-light strip) and the centre of the bar are draggable;\n   both stop short of the docked controls so clicks keep working. */\nbody[data-islands-ui] .isl-topbarLead {\n  position: absolute;\n  inset: 0 auto 0 0;\n  width: 88px;\n  pointer-events: auto;\n  -webkit-app-region: drag;\n}\n\nbody[data-islands-ui] .isl-topbarDrag {\n  flex: 1;\n  align-self: stretch;\n  min-width: 0;\n  margin-right: 250px;\n  pointer-events: auto;\n  -webkit-app-region: drag;\n}\n\nbody[data-islands-ui] .isl-topbarToggle {\n  box-sizing: border-box;\n  flex: none;\n  display: grid;\n  place-items: center;\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  border: 0;\n  border-radius: var(--isl-radius-sm);\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  pointer-events: auto;\n  -webkit-app-region: no-drag;\n}\n\nbody[data-islands-ui] .isl-topbarToggle:hover {\n  background: var(--isl-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] .isl-topbarToggle:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: -2px;\n}\n\n@media (width <= 767px) {\n  body[data-islands-ui] .isl-topbar {\n    display: none;\n  }\n\n  body[data-islands-ui] .PIRFFq_frame {\n    padding-top: var(--isl-gap);\n  }\n}\n\n/* ---- 20-sidebar.css ---- */\n/* ==========================================================================\n   Islands UI · 20 sidebar\n   The expanded sidebar is one full-height island: a persistent icon rail on\n   the left and the workspace browser on the same surface. The island spans the\n   exact same top and bottom edges as the conversation island. Collapsed mode\n   keeps the shipped rail untouched.\n   ========================================================================== */\n\nbody[data-islands-ui] .kB3qhq_root {\n  background: transparent;\n}\n\n/* ---- Expanded: chrome rail + workspace island --------------------------- */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) {\n  display: grid;\n  grid-template-columns: var(--isl-rail-width) minmax(0, 1fr);\n  grid-template-rows: var(--isl-gap) auto minmax(0, 1fr) auto;\n  column-gap: var(--isl-gap);\n  padding: 0;\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  overflow: hidden;\n  position: relative;\n  isolation: isolate;\n}\n\n/* The workspace browser is the sidebar's only island. */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed)::after {\n  content: '';\n  position: absolute;\n  z-index: -1;\n  inset: 0 0 0 calc(var(--isl-rail-width) + var(--isl-gap));\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  border-radius: var(--isl-radius-lg);\n  box-shadow: var(--isl-shadow-island);\n  pointer-events: none;\n}\n\n/* The top band is a small breathing gap inside the sidebar column. */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_topStrip {\n  grid-area: 1 / 1 / 2 / -1;\n  height: 100%;\n  margin: 0;\n  padding: 0 4px 0 0;\n  justify-content: flex-end;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_logoRow {\n  grid-area: 2 / 1;\n  height: 36px;\n  margin: 0 0 6px;\n  padding: 0;\n  justify-content: center;\n  overflow: visible;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_brand {\n  justify-content: center;\n  overflow: visible;\n}\n\n/* The brand wordmark and build stamp belong to window chrome, not the rail. */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_brandName,\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_localBuildBrand {\n  display: none;\n}\n\nbody[data-islands-ui] .kB3qhq_brandMark {\n  width: 28px;\n  height: 28px;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_newSession {\n  grid-area: 2 / 2;\n  height: 36px;\n  margin: 0 6px 6px;\n  padding: 0 8px;\n  justify-content: flex-start;\n  border: 0;\n  border-radius: var(--isl-radius-md);\n  background: transparent;\n  box-shadow: none;\n  color: var(--dsw-alias-label-primary);\n  font-weight: 400;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_newSessionContent {\n  justify-content: flex-start;\n  width: 100%;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_newSession:hover {\n  background: var(--isl-hover);\n}\n\n/* The global panel list becomes the rail's primary navigation. */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_panelList {\n  grid-area: 3 / 1;\n  align-self: start;\n  align-items: center;\n  gap: 4px;\n  margin: 2px 0 0;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_panelRow {\n  width: 36px;\n  height: 36px;\n  justify-content: center;\n  padding: 0;\n  border: 0;\n  border-radius: var(--isl-radius-md);\n  background-clip: border-box;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_panelRow.kB3qhq_panelActive {\n  background: var(--dsw-specific-sidebar-nav-item-active-accent);\n  color: var(--dsw-alias-state-business-primary);\n}\n\n/* The label leaves the visual rail but stays in the accessibility tree. */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_panelTitle {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  clip: rect(0 0 0 0);\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n/* ---- Workspace browser: same surface, full height ----------------------- */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_regionArea {\n  grid-area: 3 / 2 / 5 / 3;\n  margin: 0;\n  padding: 0 4px 6px;\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  overflow: hidden;\n}\n\nbody[data-islands-ui] .kB3qhq_regionArea {\n  --dsh-session-list-edge-inset: 4px;\n}\n\nbody[data-islands-ui] .Kjh-qa_sectionHeader {\n  padding-inline: 8px;\n  margin-right: 0;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n  letter-spacing: 0.01em;\n}\n\nbody[data-islands-ui] .Kjh-qa_sectionLabel {\n  font-weight: 500;\n}\n\nbody[data-islands-ui] .Kjh-qa_list {\n  padding-bottom: 8px;\n}\n\nbody[data-islands-ui] .Kjh-qa_fade {\n  background: linear-gradient(to bottom, transparent, var(--isl-surface));\n}\n\nbody[data-islands-ui] .JoiKIa_sessionRow,\nbody[data-islands-ui] .JoiKIa_projectRow {\n  border-radius: var(--isl-radius-sm);\n  padding-inline: 8px;\n}\n\n/* ---- Rail foot: settings gear ------------------------------------------ */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_footArea {\n  grid-area: 4 / 1;\n  align-items: center;\n  margin-top: 6px;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_settingsArea,\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_footerActions {\n  width: auto;\n  align-items: center;\n  justify-content: center;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) ._77Pn0W_triggerRow {\n  width: 36px;\n  margin: 4px 0 2px;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) ._77Pn0W_trigger {\n  flex: none;\n  width: 36px;\n  height: 36px;\n  margin: 0;\n  padding: 0;\n  justify-content: center;\n  border-inline: 0;\n  border-radius: var(--isl-radius-md);\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) ._77Pn0W_triggerLabel {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  clip: rect(0 0 0 0);\n  white-space: nowrap;\n  overflow: hidden;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) ._77Pn0W_trigger:hover,\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) ._77Pn0W_trigger[aria-expanded='true'] {\n  background: var(--isl-hover);\n}\n\n/* Footer actions contributed next to Settings (account launcher, etc.). */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_footerActions button {\n  width: 36px;\n  height: 36px;\n  border-radius: var(--isl-radius-md);\n}\n\n/* ---- Collapsed rail ------------------------------------------------------ */\n/* Collapsing hides the workspace browser only; the rail keeps its own island. */\nbody[data-islands-ui] .kB3qhq_root.kB3qhq_collapsed {\n  /* The rail is chrome, not an island: it sits directly on the ocean. */\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  padding: 8px 10px 6px;\n  overflow: hidden;\n}\n\nbody[data-islands-ui] .kB3qhq_root.kB3qhq_collapsed .kB3qhq_topStrip {\n  height: 36px;\n  margin: 0;\n  padding: 0;\n  justify-content: center;\n}\n\nbody[data-islands-ui] .kB3qhq_collapsed .kB3qhq_newSession {\n  border-radius: var(--isl-radius-md);\n}\n\n@media (min-width: 768px) {\n  /* The window top bar owns the collapse control while the workspace is open;\n     the in-island toggle would duplicate it. */\n  html:not([data-windows-titlebar]) body[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_toggle {\n    display: none;\n  }\n\n  /* On macOS the shipped frame gives a collapsed sidebar zero width, hiding\n     the rail too. Restore one rail-wide track (right panel still closed). */\n  [data-platform='darwin'] body[data-islands-ui] .PIRFFq_frame[data-sidebar-collapsed][data-rightbar-collapsed] {\n    grid-template-columns: var(--isl-rail-collapsed-width) minmax(0, 1fr) 0 !important;\n  }\n\n  /* The rail itself is the expand control; do not reserve header space for the\n     floating seat and do not show a second expand button over the island. */\n  [data-platform='darwin'] body[data-islands-ui] .PIRFFq_frame[data-sidebar-collapsed] {\n    --dsh-frame-leading-clearance: 0px;\n  }\n\n  html:not([data-windows-titlebar]) body[data-islands-ui] .PIRFFq_leadingSeat {\n    display: none;\n  }\n}\n\n/* ---- Search / section chrome inside the island --------------------------- */\nbody[data-islands-ui] .Kjh-qa_searchExpanded {\n  border-color: var(--isl-border-soft);\n  background: var(--isl-surface-muted);\n  border-radius: var(--isl-radius-sm);\n}\n\nbody[data-islands-ui] .Kjh-qa_searchExpanded .Kjh-qa_searchButton:hover {\n  background: transparent;\n}\n\n/* ---- Narrow drawer ------------------------------------------------------- */\nbody[data-islands-ui] .PIRFFq_frame[data-sidebar-drawer] .PIRFFq_sidebarCol {\n  background: var(--isl-canvas);\n  border-right: 1px solid var(--isl-border-soft);\n  box-shadow: var(--isl-shadow-float);\n}\n\n/* ---- Account launcher (settings.launcher) --------------------------------\n   In this build the sidebar foot is the account menu rather than the bare\n   settings gear, so the same rail geometry applies to its trigger. */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_footArea .hjANda_root {\n  flex: none;\n  width: 36px;\n  margin-inline: 0;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_footArea .hjANda_anchor {\n  width: 36px;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_footArea .hjANda_trigger,\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_footArea .hjANda_trigger[data-signed-out='false']:not([data-collapsed='true']),\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_footArea .hjANda_trigger[data-signed-out='true']:not([data-collapsed='true']) {\n  width: 36px;\n  height: 36px;\n  padding: 0;\n  justify-content: center;\n  border-inline: 0;\n  border-radius: var(--isl-radius-md);\n  background-clip: border-box;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_footArea .hjANda_label {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  clip: rect(0 0 0 0);\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n/* ---- Independent workspace collapse ------------------------------------- */\n/* Hide the workspace island only; the rail keeps its expanded-layout DOM and\n   position, so nothing in the left column is re-rendered by the toggle. */\nbody[data-islands-ui][data-islands-workspace-collapsed] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_newSession,\nbody[data-islands-ui][data-islands-workspace-collapsed] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_regionArea,\nbody[data-islands-ui][data-islands-workspace-collapsed] .kB3qhq_root:not(.kB3qhq_collapsed)::after {\n  display: none !important;\n}\n\n/* ---- 30-conversation.css ---- */\n/* ==========================================================================\n   Islands UI · 30 conversation & composer\n   ========================================================================== */\n\nbody[data-islands-ui] .kiGsTW_root {\n  background: transparent;\n}\n\nbody[data-islands-ui] .kiGsTW_header {\n  border-bottom-color: var(--isl-border-soft);\n}\n\nbody[data-islands-ui] .kiGsTW_headerBlank {\n  border-bottom-color: transparent;\n}\n\nbody[data-islands-ui] .kiGsTW_scrollBody {\n  margin-right: 0;\n}\n\n/* Composer: the one element that should visibly float above the island. */\nbody[data-islands-ui] .JZLxKW_card {\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  box-shadow: none;\n}\n\nbody[data-islands-ui] .JZLxKW_cardWorkspaceTrigger:after {\n  border-radius: var(--dsw-radius-panel);\n  color: var(--isl-border-strong);\n}\n\nbody[data-islands-ui] .JZLxKW_notice {\n  border-radius: var(--isl-radius-md);\n  background: var(--isl-surface-muted);\n}\n\n/* Sticky composer seat fades into the island surface, not into a raw token. */\nbody[data-islands-ui] .kiGsTW_root[data-phase='active'] .kiGsTW_composerSeat,\nbody[data-islands-ui] .kiGsTW_embeddedBody[data-content-phase='active'] .kiGsTW_composerSeat {\n  background: linear-gradient(\n    180deg,\n    color-mix(in srgb, var(--isl-surface) 0%, transparent) 0px,\n    var(--isl-surface) 36px\n  );\n}\n\n/* Hero: a calmer, slightly tighter headline on the open island. */\nbody[data-islands-ui] ._8tPydW_headline {\n  letter-spacing: -0.01em;\n}\n\nbody[data-islands-ui] ._8tPydW_workspace {\n  border-radius: 999px;\n  background: var(--isl-surface-muted);\n}\n\nbody[data-islands-ui] ._8tPydW_workspace:hover {\n  background: var(--isl-hover);\n}\n\n/* Tool / turn cards keep their own hierarchy but gain island hairlines. */\nbody[data-islands-ui] .CuF05a_root {\n  border-color: var(--isl-border-soft);\n  background: var(--isl-surface-muted);\n}\n\nbody[data-islands-ui] .CuF05a_root:hover {\n  background: var(--isl-surface-sunken);\n}\n\n/* Header chips and breadcrumbs. */\nbody[data-islands-ui] .kiGsTW_crumb {\n  border-radius: var(--isl-radius-sm);\n}\n\n/* View tabs sit on the island as a quiet segmented row. */\nbody[data-islands-ui] .kiGsTW_viewTabs {\n  gap: 22px;\n}\n\nbody[data-islands-ui] .kiGsTW_tabActive:after {\n  border-radius: 999px;\n  height: 2px;\n}\n\n/* ==========================================================================\n   Header utilities live in the window bar\n   The three trailing controls (session tools, side panel, right panel) leave\n   the conversation island and dock at the bar's right edge, vertically aligned\n   with the workspace toggle on the left.\n   ========================================================================== */\n@media (min-width: 768px) {\n  html:not([data-windows-titlebar]) body[data-islands-ui] .kiGsTW_headerUtilities {\n    position: fixed;\n    top: 10px;\n    right: 41px; /* frame gap 5 + corner 28 + gap 8 */\n    z-index: 31;\n    height: 28px;\n    margin: 0;\n    align-items: center;\n  }\n\n  html:not([data-windows-titlebar]) body[data-islands-ui] .kiGsTW_headerCorner {\n    position: fixed;\n    top: 10px;\n    right: var(--isl-gap);\n    z-index: 31;\n    height: 28px;\n    margin: 0;\n    align-items: center;\n  }\n}\n\n/* ==========================================================================\n   Always-visible right sidebar toggle\n   The native header button unmounts while the panel is open and the panel\n   carries its own collapse control. The top bar owns one persistent toggle\n   instead, and closes through the native collapse action.\n   ========================================================================== */\n@media (min-width: 768px) {\n  html:not([data-windows-titlebar]) body[data-islands-ui] .isl-rightToggle {\n    position: fixed;\n    top: 10px;\n    right: var(--isl-gap);\n    z-index: 32;\n    box-sizing: border-box;\n    display: grid;\n    place-items: center;\n    width: 28px;\n    height: 28px;\n    padding: 0;\n    border: 0;\n    border-radius: var(--isl-radius-sm);\n    background: transparent;\n    color: var(--dsw-alias-label-secondary);\n    cursor: pointer;\n    pointer-events: auto;\n    -webkit-app-region: no-drag;\n  }\n\n  html:not([data-windows-titlebar]) body[data-islands-ui] .isl-rightToggle:hover,\n  html:not([data-windows-titlebar]) body[data-islands-ui] .isl-rightToggle[aria-pressed='true'] {\n    background: var(--isl-hover);\n    color: var(--dsw-alias-label-primary);\n  }\n\n  html:not([data-windows-titlebar]) body[data-islands-ui] .isl-rightToggle:focus-visible {\n    outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n    outline-offset: -2px;\n  }\n\n  /* The top bar owns open and close; the island's own expand/collapse\n     controls would duplicate it. */\n  html:not([data-windows-titlebar]) body[data-islands-ui] [data-sidebar-right-expand],\n  html:not([data-windows-titlebar]) body[data-islands-ui] [data-sidebar-right-toggle],\n  /* dsh-sidenote's own \"侧边\" header entry is covered by the toggle above. */\n  html:not([data-windows-titlebar]) body[data-islands-ui] ._5KEEsG_headerSide {\n    display: none !important;\n  }\n}\n\n/* ---- 40-settings.css ---- */\n/* ==========================================================================\n   Islands UI · 40 settings (and shared dialog surfaces)\n   The settings window is an island; its navigation is a recessed island.\n   ========================================================================== */\n\nbody[data-islands-ui] ._77Pn0W_overlay {\n  background: transparent;\n}\n\nbody[data-islands-ui] ._77Pn0W_mask {\n  background: var(--dsw-alias-bg-mask-1);\n  backdrop-filter: var(--dsw-mask-blur);\n}\n\nbody[data-islands-ui] ._77Pn0W_panel {\n  width: 860px;\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  border-radius: 24px;\n  box-shadow: var(--isl-shadow-float);\n  padding: 10px;\n  gap: 8px;\n  grid-template-columns: 188px minmax(0, 1fr);\n}\n\nbody[data-islands-ui] ._77Pn0W_navTitle {\n  padding: 12px 8px 4px 12px;\n  font-size: 15px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n}\n\nbody[data-islands-ui] ._77Pn0W_nav {\n  padding: 8px;\n  background: var(--isl-surface-muted);\n  border: 1px solid var(--isl-border-soft);\n  border-radius: var(--isl-radius-lg);\n}\n\nbody[data-islands-ui] ._77Pn0W_navList {\n  gap: 2px;\n}\n\nbody[data-islands-ui] ._77Pn0W_navCell {\n  height: 36px;\n  padding: 8px 10px;\n  border-radius: var(--isl-radius-md);\n  color: var(--dsw-alias-label-secondary);\n}\n\nbody[data-islands-ui] ._77Pn0W_navCell:hover {\n  background: var(--isl-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] ._77Pn0W_navCell._77Pn0W_active {\n  background: var(--isl-surface);\n  color: var(--dsw-alias-label-primary);\n  font-weight: 500;\n  box-shadow: 0 0 0 1px var(--isl-border-soft), 0 1px 2px rgba(17, 24, 39, 0.05);\n}\n\nbody[data-islands-ui] ._77Pn0W_header {\n  height: 48px;\n  padding: 6px 6px 0 8px;\n}\n\nbody[data-islands-ui] ._77Pn0W_options {\n  padding: 0 16px 20px 6px;\n}\n\nbody[data-islands-ui] ._77Pn0W_close {\n  border-radius: var(--isl-radius-sm);\n}\n\n/* Settings cards (models, account, plugins) become nested islands. */\nbody[data-islands-ui] ._77Pn0W_options [class*='_card'] {\n  border-radius: var(--isl-radius-lg);\n}\n\nbody[data-islands-ui] ._77Pn0W_options [class*='_section'] {\n  border-radius: var(--isl-radius-md);\n}\n\n/* The general-page rows keep their separators but at island quietness. */\nbody[data-islands-ui] [data-slot='settings.general.item'] > * {\n  border-bottom-color: var(--isl-border-soft);\n}\n\nbody[data-islands-ui] [data-slot='settings.general.item']:last-child > * {\n  border-bottom: 0;\n}\n\n/* Dialogs opened from settings (confirmations, pickers). */\nbody[data-islands-ui] [role='dialog'] {\n  border-radius: var(--isl-radius-xl);\n}\n\n/* Account page hero cards. */\nbody[data-islands-ui] .XGmX4q_card {\n  border-radius: var(--isl-radius-lg);\n}\n\nbody[data-islands-ui] ._7lc4_a_balanceCard {\n  border-radius: var(--isl-radius-lg);\n  border: 1px solid var(--isl-border-soft);\n  background: var(--isl-surface-muted);\n}\n\n/* ---- 45-model-picker.css ---- */\n/* ==========================================================================\n   Islands UI · 45 composer model picker\n   Trigger chip + model list + reasoning slider, in the Islands language.\n   ========================================================================== */\n\nbody[data-islands-ui] .isl-model {\n  position: relative;\n  min-width: 0;\n}\n\nbody[data-islands-ui] .isl-modelTrigger {\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  max-width: 260px;\n  height: 28px;\n  padding: 0 8px;\n  border: 1px solid transparent;\n  border-radius: 999px;\n  background: var(--isl-surface-muted);\n  color: var(--dsw-alias-label-primary);\n  font-size: 13px;\n  line-height: 20px;\n  cursor: pointer;\n  transition: background-color 0.12s var(--ds-ease-in-out);\n}\n\nbody[data-islands-ui] .isl-modelTrigger:hover:not(:disabled) {\n  background: var(--isl-surface-sunken);\n}\n\nbody[data-islands-ui] .isl-modelTrigger:disabled {\n  opacity: 0.55;\n  cursor: default;\n}\n\nbody[data-islands-ui] .isl-modelTrigger:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: 1px;\n}\n\nbody[data-islands-ui] .isl-modelIcon {\n  display: var(--dsh-composer-model-icon-display, none);\n  flex: none;\n  color: var(--dsw-alias-label-secondary);\n}\n\nbody[data-islands-ui] .isl-modelName {\n  display: var(--dsh-composer-model-text-display, inline);\n  min-width: 0;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\nbody[data-islands-ui] .isl-modelEffort {\n  display: var(--dsh-composer-model-text-display, inline);\n  flex-shrink: 1000;\n  min-width: 0;\n  color: var(--dsw-alias-label-caption);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\nbody[data-islands-ui] .isl-modelChevron {\n  display: inline-flex;\n  flex: none;\n  color: var(--dsw-alias-label-caption);\n  transition: transform 0.12s var(--ds-ease-in-out);\n}\n\nbody[data-islands-ui] .isl-modelChevron.is-open {\n  transform: rotate(180deg);\n}\n\n/* ---- Menu ---------------------------------------------------------------- */\nbody[data-islands-ui] .isl-modelMenu {\n  position: fixed;\n  z-index: 1100;\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  max-height: min(460px, calc(100vh - 24px));\n  padding: 6px;\n  border: 1px solid var(--isl-border-soft);\n  border-radius: var(--isl-radius-lg);\n  background: var(--isl-surface);\n  box-shadow: var(--isl-shadow-float);\n  color: var(--dsw-alias-label-primary);\n  font-size: 13px;\n  line-height: 20px;\n  overflow-y: auto;\n  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);\n  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);\n}\n\nbody[data-islands-ui] .isl-modelPaneHead {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  padding: 0 4px 6px;\n}\n\nbody[data-islands-ui] .isl-modelMenuTitle {\n  padding: 2px 4px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\nbody[data-islands-ui] .isl-modelBack {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 24px;\n  height: 24px;\n  padding: 0;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n}\n\nbody[data-islands-ui] .isl-modelBack:hover {\n  background: var(--isl-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] .isl-modelBackIcon {\n  display: inline-flex;\n  transform: rotate(90deg);\n}\n\nbody[data-islands-ui] .isl-modelGroups {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\nbody[data-islands-ui] .isl-modelGroup + .isl-modelGroup {\n  margin-top: 6px;\n}\n\nbody[data-islands-ui] .isl-modelGroupName {\n  padding: 6px 8px 2px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11px;\n  line-height: 16px;\n}\n\nbody[data-islands-ui] .isl-modelOption {\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n  min-height: 34px;\n  padding: 6px 8px;\n  border: 0;\n  border-radius: var(--isl-radius-md);\n  background: transparent;\n  color: inherit;\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n\nbody[data-islands-ui] .isl-modelOption:hover {\n  background: var(--isl-hover);\n}\n\nbody[data-islands-ui] .isl-modelOption.is-selected {\n  background: var(--isl-surface-muted);\n}\n\nbody[data-islands-ui] .isl-modelOptionName {\n  flex: 1;\n  min-width: 0;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\nbody[data-islands-ui] .isl-modelCheck {\n  display: inline-flex;\n  flex: none;\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] .isl-modelEmpty {\n  padding: 10px 8px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n}\n\n/* ---- Reasoning effort ---------------------------------------------------- */\nbody[data-islands-ui] .isl-effortPopup {\n  position: relative;\n  padding: 9px 10px 8px;\n  text-align: center;\n}\n\nbody[data-islands-ui] .isl-effortReset {\n  position: absolute;\n  top: 5px;\n  right: 5px;\n  display: grid;\n  place-items: center;\n  width: 24px;\n  height: 24px;\n  padding: 0;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  cursor: pointer;\n}\n\nbody[data-islands-ui] .isl-effortReset:hover:not(:disabled) {\n  background: var(--isl-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] .isl-effortReset:disabled {\n  opacity: 0.4;\n  cursor: default;\n}\n\nbody[data-islands-ui] .isl-effortName {\n  color: var(--dsw-alias-state-business-primary);\n  font-size: 18px;\n  line-height: 24px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n}\n\nbody[data-islands-ui] .isl-effortModel {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  max-width: 100%;\n  margin-top: 1px;\n  padding: 1px 6px;\n  border: 0;\n  border-radius: var(--isl-radius-sm);\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 13px;\n  line-height: 18px;\n  cursor: pointer;\n}\n\nbody[data-islands-ui] .isl-effortModel:hover {\n  background: var(--isl-hover);\n  color: var(--dsw-alias-label-secondary);\n}\n\nbody[data-islands-ui] .isl-effortModelName {\n  min-width: 0;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\nbody[data-islands-ui] .isl-effortModelChevron {\n  display: inline-flex;\n  flex: none;\n  color: inherit;\n  transform: rotate(-90deg);\n}\n\nbody[data-islands-ui] .isl-effortSliderWrap {\n  position: relative;\n  margin: 7px 2px 0;\n}\n\nbody[data-islands-ui] .isl-effortSlider {\n  -webkit-appearance: none;\n  appearance: none;\n  display: block;\n  width: 100%;\n  height: 24px;\n  margin: 0;\n  padding: 0;\n  background: transparent;\n  cursor: pointer;\n}\n\nbody[data-islands-ui] .isl-effortSlider::-webkit-slider-runnable-track {\n  height: 20px;\n  border-radius: 999px;\n  background: linear-gradient(\n    90deg,\n    var(--dsw-alias-state-business-primary) 0\n      calc(12px + (100% - 24px) * var(--isl-ratio, 0)),\n    var(--isl-surface-sunken) calc(12px + (100% - 24px) * var(--isl-ratio, 0)) 100%\n  );\n}\n\nbody[data-islands-ui] .isl-effortSlider::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  appearance: none;\n  box-sizing: border-box;\n  width: 24px;\n  height: 24px;\n  margin-top: -2px;\n  border: 0;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow:\n    0 1px 4px rgba(17, 24, 39, 0.22),\n    0 0 0 0.5px rgba(17, 24, 39, 0.06);\n}\n\nbody[data-islands-ui] .isl-effortSlider:focus-visible {\n  outline: none;\n}\n\nbody[data-islands-ui] .isl-effortSlider:focus-visible::-webkit-slider-thumb {\n  box-shadow:\n    0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary) 26%, transparent),\n    0 1px 4px rgba(17, 24, 39, 0.22);\n}\n\nbody[data-islands-ui] .isl-effortDots {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0 12px;\n  pointer-events: none;\n}\n\nbody[data-islands-ui] .isl-effortDot {\n  width: 4px;\n  height: 4px;\n  border-radius: 50%;\n  background: var(--isl-border-strong);\n}\n\nbody[data-islands-ui] .isl-effortDot.is-filled {\n  background: rgba(255, 255, 255, 0.55);\n}\n\nbody[data-islands-ui] .isl-modelError {\n  margin: 8px 8px 2px;\n  padding: 6px 8px;\n  border-radius: var(--isl-radius-sm);\n  background: var(--dsw-alias-interactive-bg-hover-danger);\n  color: var(--dsw-alias-state-error-primary);\n  font-size: 11px;\n  line-height: 16px;\n}\n\n/* ---- 50-components.css ---- */\n/* ==========================================================================\n   Islands UI · 50 shared components\n   Small, reusable pieces used by the skin's own surfaces. All values come from\n   the token layer, so nothing here is page-specific.\n   ========================================================================== */\n\n/* ---- Preference row (rendered into settings.general.item) ---------------- */\nbody[data-islands-ui] .isl-prefRow,\n.isl-prefRow {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 24px;\n  padding: 16px 0;\n  border-bottom: 0.5px solid var(--dsw-alias-border-l2);\n  color: var(--dsw-alias-label-primary);\n  font-size: 14px;\n  line-height: 20px;\n}\n\nbody[data-islands-ui] .isl-prefRow:last-child,\n.isl-prefRow:last-child {\n  border-bottom: 0;\n}\n\n.isl-prefText {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  min-width: 0;\n}\n\n.isl-prefTitle {\n  color: var(--dsw-alias-label-primary);\n  font-size: 14px;\n  line-height: 20px;\n}\n\n.isl-prefDesc {\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n/* ---- Switch -------------------------------------------------------------- */\n.isl-switch {\n  position: relative;\n  flex: none;\n  width: 38px;\n  height: 22px;\n  padding: 0;\n  border: 0;\n  border-radius: 999px;\n  cursor: pointer;\n  background: var(--dsw-alias-bg-layer-3);\n  box-shadow: inset 0 0 0 1px var(--dsw-alias-border-l2);\n  transition: background-color 0.15s var(--ds-ease-in-out);\n}\n\n.isl-switch[aria-checked='true'] {\n  background: var(--dsw-alias-state-business-primary);\n  box-shadow: none;\n}\n\n.isl-switch:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: 2px;\n}\n\n.isl-switchThumb {\n  position: absolute;\n  top: 3px;\n  left: 3px;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow: 0 1px 2px rgba(17, 24, 39, 0.25);\n  transition: transform 0.15s var(--ds-ease-in-out);\n}\n\n.isl-switch[aria-checked='true'] .isl-switchThumb {\n  transform: translateX(16px);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .isl-switch,\n  .isl-switchThumb {\n    transition: none;\n  }\n}\n\n/* ---- Popover / menu materials ------------------------------------------- */\nbody[data-islands-ui] [data-menu-material] {\n  border-radius: var(--isl-radius-lg);\n  border: 1px solid var(--isl-border-soft);\n  box-shadow: var(--isl-shadow-float);\n}\n\nbody[data-islands-ui] [role='dialog'],\nbody[data-islands-ui] [role='menu'],\nbody[data-islands-ui] [role='listbox'] {\n  border-radius: var(--isl-radius-lg);\n}\n\n/* ---- Scrollbars ---------------------------------------------------------- */\nbody[data-islands-ui] ::-webkit-scrollbar-thumb {\n  border-radius: 999px;\n}\n\n/* ---- Focus --------------------------------------------------------------- */\nbody[data-islands-ui] :focus-visible {\n  outline-offset: 1px;\n}";

    const ATTRIBUTE = 'data-islands-ui';
    const STORAGE_KEY = 'dsh-islands-ui:enabled';
    const WORKSPACE_ATTR = 'data-islands-workspace-collapsed';
    let animateTimer;

    /** Copy for the preference row; the row is the only user-facing string. */
    const COPY = {
      zh: {
        title: 'Islands 界面',
        description: '悬浮岛屿式布局：圆角面板、常驻左侧导航栏与独立的工作区列表。关闭后立即恢复默认外观。',
        topbarToggle: '折叠或展开工作区',
        openRight: '打开侧边栏',
        closeRight: '关闭侧边栏',
        models: '选择模型',
        effort: '推理等级',
        back: '返回',
        noEffort: '该模型没有可调推理等级',
        reset: '恢复默认',
        loading: '加载中…',
        pick: '选择模型',
        empty: '没有可用模型',
        failed: '切换失败',
      },
      en: {
        title: 'Islands interface',
        description:
          'Floating-island layout with rounded panels, a persistent rail and an islanded workspace list. Turn off to return to the default look immediately.',
        topbarToggle: 'Collapse or expand the workspace',
        openRight: 'Open side panel',
        closeRight: 'Close side panel',
        models: 'Select model',
        effort: 'Reasoning',
        back: 'Back',
        noEffort: 'This model has no adjustable reasoning level',
        reset: 'Reset to default',
        loading: 'Loading…',
        pick: 'Select model',
        empty: 'No models available',
        failed: 'Selection failed',
      },
    };

    let localeService;
    let layoutService;
    let modelDirectories;
    const listeners = new Set();

    function readStored() {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored === null ? true : stored === '1';
      } catch {
        return true;
      }
    }

    let enabled = readStored();

    function syncAttribute() {
      const body = document.body;
      if (body === null) return;
      if (enabled) body.setAttribute(ATTRIBUTE, '');
      else body.removeAttribute(ATTRIBUTE);
    }

    function subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }

    function getSnapshot() {
      return enabled;
    }

    function setEnabled(next) {
      enabled = next === true;
      try {
        window.localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
      } catch {
        /* private mode: the choice still applies for this page. */
      }
      syncAttribute();
      for (const listener of listeners) listener();
    }

    function useEnabled() {
      return React.useSyncExternalStore(subscribe, getSnapshot);
    }

    function useLocale() {
      return React.useSyncExternalStore(
        (listener) => (localeService === undefined ? () => {} : localeService.subscribe(listener)),
        () => (localeService === undefined ? 'en' : localeService.getSnapshot().active),
      );
    }

    /** Sidebar glyph for the window bar (divider on the left, workspace rail). */
    function PanelGlyph() {
      return h(
        'svg',
        { width: 16, height: 16, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': true },
        h('rect', {
          x: 2.5,
          y: 3.5,
          width: 15,
          height: 13,
          rx: 3,
          stroke: 'currentColor',
          strokeWidth: 1.5,
        }),
        h('path', { d: 'M7.5 4v12', stroke: 'currentColor', strokeWidth: 1.5 }),
      );
    }

    /** Mirror glyph for the right sidebar toggle (divider on the right). */
    function RightPanelGlyph() {
      return h(
        'svg',
        { width: 16, height: 16, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': true },
        h('rect', {
          x: 2.5,
          y: 3.5,
          width: 15,
          height: 13,
          rx: 3,
          stroke: 'currentColor',
          strokeWidth: 1.5,
        }),
        h('path', { d: 'M12.5 4v12', stroke: 'currentColor', strokeWidth: 1.5 }),
      );
    }

    /** Small glyphs used by the composer model picker. */
    function ModelGlyph() {
      return h(
        'svg',
        { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('rect', { x: 1.5, y: 1.5, width: 13, height: 13, rx: 4, stroke: 'currentColor', strokeWidth: 1.3 }),
        h('path', { d: 'M5 9.5 6.8 6l1.7 3.5L10.2 6 12 9.5', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      );
    }

    function CheckGlyph() {
      return h(
        'svg',
        { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'm3.5 8.5 3 3 6-6.5', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      );
    }

    function ChevronGlyph() {
      return h(
        'svg',
        { width: 12, height: 12, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'm4 6 4 4 4-4', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      );
    }

    function ResetGlyph() {
      return h(
        'svg',
        { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'M3.5 6.5A5 5 0 1 1 3 9.5', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }),
        h('path', { d: 'M3 3.5v3h3', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      );
    }

    const EMPTY_MENU_STATE = Object.freeze({ current: null, groups: [], status: 'idle', retainedEffort: undefined, error: null });

    function modelIn(groups, selection) {
      for (const group of groups) {
        if (group.id !== selection.provider) continue;
        const model = group.models.find((entry) => entry.id === selection.model);
        if (model !== undefined) return model;
      }
      return undefined;
    }

    /**
     * Composer model + reasoning picker. Replaces the shipped two-level menu:
     * the trigger is a chip, the menu opens straight onto the model list, and
     * reasoning effort lives on a stepped slider.
     */
    function ModelPicker({ sessionId, locked }) {
      const active = useLocale() ?? 'en';
      const copy = String(active).toLowerCase().startsWith('zh') ? COPY.zh : COPY.en;
      const directory = React.useMemo(() => {
        try {
          return modelDirectories !== undefined && sessionId !== undefined
            ? modelDirectories.directoryFor(sessionId)
            : null;
        } catch {
          return null;
        }
      }, [sessionId]);
      const subscribe = React.useCallback(
        (listener) => (directory === null ? () => {} : directory.store.subscribe(listener)),
        [directory],
      );
      const getSnapshot = React.useCallback(
        () => (directory === null ? EMPTY_MENU_STATE : directory.store.getSnapshot()),
        [directory],
      );
      const state = React.useSyncExternalStore(subscribe, getSnapshot);
      const [open, setOpen] = React.useState(false);
      const [position, setPosition] = React.useState(null);
      const [pane, setPane] = React.useState('effort');
      const [draft, setDraft] = React.useState(null);
      const [busy, setBusy] = React.useState(false);
      const [error, setError] = React.useState('');
      const rootRef = React.useRef(null);
      const triggerRef = React.useRef(null);
      const panelRef = React.useRef(null);

      React.useEffect(() => {
        if (directory !== null) directory.load().catch(() => {});
      }, [directory]);

      const current = state.current ?? null;
      const groups = Array.isArray(state.groups) ? state.groups : [];
      const reasoning = current !== null && directory !== null ? directory.catalog.reasoningFor(current) : undefined;
      const efforts = Array.isArray(reasoning?.efforts) ? reasoning.efforts : [];
      const effective = current?.reasoningEffort ?? reasoning?.defaultEffort;
      const effortName = efforts.find((level) => level.id === effective)?.name ?? state.retainedEffort;
      const modelName = current === null
        ? state.status === 'loading' ? copy.loading : copy.pick
        : modelIn(groups, current)?.name ?? current.model;

      const close = () => {
        setOpen(false);
        setError('');
        setDraft(null);
      };

      const openMenu = () => {
        if (locked || directory === null) return;
        const rect = triggerRef.current?.getBoundingClientRect();
        if (rect === undefined) return;
        setPosition({
          bottom: Math.max(8, window.innerHeight - rect.top + 8),
          right: Math.max(8, window.innerWidth - rect.right),
          width: Math.min(300, window.innerWidth - 24),
        });
        setPane('effort');
        setDraft(null);
        setError('');
        setOpen(true);
        directory.load().catch(() => {});
      };

      React.useEffect(() => {
        if (!open) return;
        const onDown = (event) => {
          if (rootRef.current?.contains(event.target) === true) return;
          if (panelRef.current?.contains(event.target) === true) return;
          close();
        };
        const onKey = (event) => {
          if (event.key !== 'Escape') return;
          event.stopPropagation();
          close();
        };
        document.addEventListener('mousedown', onDown, true);
        document.addEventListener('keydown', onKey, true);
        return () => {
          document.removeEventListener('mousedown', onDown, true);
          document.removeEventListener('keydown', onKey, true);
        };
      }, [open]);

      const choose = (selection, stayOpen = false) => {
        if (directory === null || busy) return;
        setBusy(true);
        setError('');
        directory
          .select(selection)
          .then((result) => {
            setBusy(false);
            if (result.ok) {
              if (stayOpen) {
                setPane('effort');
                setDraft(null);
              } else {
                close();
              }
            } else {
              setError(result.error?.message ?? copy.failed);
            }
          })
          .catch((problem) => {
            setBusy(false);
            setError(String(problem?.message ?? problem));
          });
      };

      const chooseEffort = (effortId) => {
        if (directory === null || current === null || busy) return;
        setDraft(effortId);
        setBusy(true);
        setError('');
        directory
          .select({ provider: current.provider, model: current.model, reasoningEffort: effortId })
          .then((result) => {
            setBusy(false);
            if (!result.ok) setError(result.error?.message ?? copy.failed);
          })
          .catch((problem) => {
            setBusy(false);
            setError(String(problem?.message ?? problem));
          });
      };

      const sliderId = draft ?? effective;
      const sliderIndex = Math.max(0, efforts.findIndex((level) => level.id === sliderId));
      const percent = efforts.length > 1 ? Math.round((sliderIndex / (efforts.length - 1)) * 100) : 0;

      const trigger = h(
        'button',
        {
          ref: triggerRef,
          type: 'button',
          className: 'isl-modelTrigger',
          'aria-haspopup': 'menu',
          'aria-expanded': open,
          'aria-label': modelName,
          title: effortName === undefined ? modelName : `${modelName} · ${effortName}`,
          disabled: locked || directory === null,
          onClick: () => (open ? close() : openMenu()),
        },
        h('span', { className: 'isl-modelIcon' }, h(ModelGlyph)),
        h('span', { className: 'isl-modelName' }, modelName),
        effortName === undefined ? null : h('span', { className: 'isl-modelEffort' }, effortName),
        h('span', { className: 'isl-modelChevron' + (open ? ' is-open' : '') }, h(ChevronGlyph)),
      );

      const modelPane = h(
        React.Fragment,
        null,
        h(
          'div',
          { className: 'isl-modelPaneHead' },
          h(
            'button',
            {
              type: 'button',
              className: 'isl-modelBack',
              title: copy.back,
              'aria-label': copy.back,
              onClick: () => setPane('effort'),
            },
            h('span', { className: 'isl-modelBackIcon' }, h(ChevronGlyph)),
          ),
          h('span', { className: 'isl-modelMenuTitle' }, copy.models),
        ),
        h(
          'div',
          { className: 'isl-modelGroups' },
          groups.length === 0
            ? h('div', { className: 'isl-modelEmpty' }, state.status === 'loading' ? copy.loading : copy.empty)
            : groups.map((group) =>
                h(
                  'div',
                  { className: 'isl-modelGroup', key: group.id },
                  h('div', { className: 'isl-modelGroupName' }, group.name),
                  group.models.map((model) => {
                    const selected = current !== null && current.provider === group.id && current.model === model.id;
                    return h(
                      'button',
                      {
                        type: 'button',
                        role: 'menuitemradio',
                        'aria-checked': selected,
                        className: 'isl-modelOption' + (selected ? ' is-selected' : ''),
                        key: model.id,
                        onClick: () => choose({ provider: group.id, model: model.id }, true),
                      },
                      h('span', { className: 'isl-modelOptionName' }, model.name),
                      selected ? h('span', { className: 'isl-modelCheck' }, h(CheckGlyph)) : null,
                    );
                  }),
                ),
              ),
        ),
      );

      const ratio = efforts.length > 1 ? sliderIndex / (efforts.length - 1) : 0;

      const effortPane = h(
        React.Fragment,
        null,
        h(
          'div',
          { className: 'isl-effortPopup' },
          h(
            'button',
            {
              type: 'button',
              className: 'isl-effortReset',
              title: copy.reset,
              'aria-label': copy.reset,
              disabled: reasoning?.defaultEffort === undefined,
              onClick: () => chooseEffort(reasoning?.defaultEffort),
            },
            h(ResetGlyph),
          ),
          h('div', { className: 'isl-effortName' }, effortName ?? ''),
          h(
            'button',
            { type: 'button', className: 'isl-effortModel', onClick: () => setPane('model'), title: copy.models },
            h('span', { className: 'isl-effortModelName' }, modelName),
            h('span', { className: 'isl-effortModelChevron' }, h(ChevronGlyph)),
          ),
          efforts.length > 1
            ? h(
                'div',
                { className: 'isl-effortSliderWrap' },
                h('input', {
                  type: 'range',
                  className: 'isl-effortSlider',
                  min: 0,
                  max: Math.max(0, efforts.length - 1),
                  step: 1,
                  value: sliderIndex,
                  'aria-label': copy.effort,
                  style: { '--isl-ratio': String(ratio) },
                  onChange: (event) => setDraft(efforts[Number(event.target.value)]?.id),
                  onPointerUp: () => {
                    if (draft !== null && draft !== effective) chooseEffort(draft);
                  },
                  onKeyUp: () => {
                    if (draft !== null && draft !== effective) chooseEffort(draft);
                  },
                }),
                h(
                  'div',
                  { className: 'isl-effortDots', 'aria-hidden': true },
                  efforts.map((level, index) =>
                    h('span', {
                      key: level.id,
                      className: 'isl-effortDot' + (index <= sliderIndex ? ' is-filled' : ''),
                    }),
                  ),
                ),
              )
            : h('div', { className: 'isl-modelEmpty' }, copy.noEffort),
        ),
      );

      const panel = open && position !== null
        ? ReactDOM.createPortal(
            h(
              'div',
              {
                ref: panelRef,
                className: 'isl-modelMenu',
                role: 'menu',
                style: { right: position.right, bottom: position.bottom, width: position.width },
              },
              pane === 'model' ? modelPane : effortPane,
              error === '' ? null : h('div', { className: 'isl-modelError' }, error),
            ),
            document.body,
          )
        : null;

      return h('div', { className: 'isl-model', ref: rootRef }, trigger, panel);
    }

    /** Live open/closed state of the native right sidebar, read from its attribute. */
    function useRightPanelOpen() {
      const [open, setOpen] = React.useState(false);
      React.useEffect(() => {
        const read = () => setOpen(document.querySelector('.Dv5QdW_panel[data-sidebar-right-open]') !== null);
        read();
        const observer = new MutationObserver(read);
        observer.observe(document.body, {
          subtree: true,
          attributes: true,
          attributeFilter: ['data-sidebar-right-open'],
        });
        return () => observer.disconnect();
      }, []);
      return open;
    }

    /** Always-visible right sidebar toggle; drives the native open/collapse actions. */
    function RightPanelToggle() {
      const open = useRightPanelOpen();
      const active = useLocale() ?? 'en';
      const copy = String(active).toLowerCase().startsWith('zh') ? COPY.zh : COPY.en;
      const label = open ? copy.closeRight : copy.openRight;
      return h(
        'button',
        {
          type: 'button',
          className: 'isl-rightToggle',
          'aria-label': label,
          title: label,
          'aria-pressed': open,
          onClick: () => {
            const selector = open
              ? '[data-sidebar-right-toggle]'
              : '[data-sidebar-right-expand]';
            const target = document.querySelector(selector);
            if (target !== null) target.click();
          },
        },
        h(RightPanelGlyph),
      );
    }

    /**
     * Collapse the workspace island without asking DSH to swap the sidebar for
     * its rail-only render tree. The expanded rail stays mounted, the workspace
     * column is hidden, and the frame track shrinks to the rail width.
     */
    function toggleWorkspace() {
      const frame = document.querySelector('.PIRFFq_frame');
      if (frame !== null && frame.hasAttribute('data-sidebar-collapsed')) {
        layoutService?.toggleSidebar();
        document.body.removeAttribute(WORKSPACE_ATTR);
        return;
      }
      const collapsed = document.body.hasAttribute(WORKSPACE_ATTR);
      if (collapsed) document.body.removeAttribute(WORKSPACE_ATTR);
      else document.body.setAttribute(WORKSPACE_ATTR, '');
      if (frame !== null) {
        frame.setAttribute('data-islands-animating', '');
        window.clearTimeout(animateTimer);
        animateTimer = window.setTimeout(() => {
          frame.removeAttribute('data-islands-animating');
        }, 360);
      }
    }

    /** Window chrome strip above the islands; owns the workspace toggle. */
    function IslandsTopBar() {
      const active = useLocale() ?? 'en';
      const copy = String(active).toLowerCase().startsWith('zh') ? COPY.zh : COPY.en;
      return h(
        'header',
        { className: 'isl-topbar' },
        h('div', { className: 'isl-topbarLead', 'aria-hidden': true }),
        h(
          'button',
          {
            type: 'button',
            className: 'isl-topbarToggle',
            'aria-label': copy.topbarToggle,
            title: copy.topbarToggle,
            onClick: () => toggleWorkspace(),
          },
          h(PanelGlyph),
        ),
        h('div', { className: 'isl-topbarDrag', 'aria-hidden': true }),
        h(RightPanelToggle),
      );
    }

    /** One settings row: label + description on the left, switch on the right. */
    function IslandsPreferenceRow() {
      const on = useEnabled();
      const active = useLocale() ?? 'en';
      const copy = String(active).toLowerCase().startsWith('zh') ? COPY.zh : COPY.en;
      return h(
        'div',
        { className: 'isl-prefRow' },
        h(
          'div',
          { className: 'isl-prefText' },
          h('div', { className: 'isl-prefTitle' }, copy.title),
          h('div', { className: 'isl-prefDesc' }, copy.description),
        ),
        h(
          'button',
          {
            type: 'button',
            role: 'switch',
            className: 'isl-switch',
            'aria-checked': on,
            'aria-label': copy.title,
            title: copy.title,
            onClick: () => setEnabled(!on),
          },
          h('span', { className: 'isl-switchThumb' }),
        ),
      );
    }

    return {
      inject: ['slots', 'locale', 'layout'],
      apply(ctx) {
        localeService = ctx.locale;
        layoutService = ctx.layout;
        syncAttribute();

        ctx.effect(() => {
          if (document.body !== null && !document.body.hasAttribute(ATTRIBUTE) && readStored()) {
            document.body.setAttribute(ATTRIBUTE, '');
          }
          const tag = document.createElement('style');
          tag.dataset.plugin = '@local/dsh-islands-ui';
          tag.dataset.pluginCss = '@local/dsh-islands-ui/islands.css';
          tag.textContent = CSS;
          document.head.appendChild(tag);
          return () => {
            tag.remove();
            document.body?.removeAttribute(ATTRIBUTE);
          };
        }, 'dsh-islands-ui: stylesheet');

        ctx.effect(() => {
          const root = document.documentElement;
          const column = document.querySelector('.PIRFFq_rightbarCol');
          if (column === null) return;
          const observer = new ResizeObserver((entries) => {
            const width = entries[0]?.contentRect.width ?? 0;
            root.style.setProperty('--isl-rightbar-w', `${Math.round(width)}px`);
          });
          observer.observe(column);
          return () => {
            observer.disconnect();
            root.style.removeProperty('--isl-rightbar-w');
          };
        }, 'dsh-islands-ui: rightbar width');

        ctx.slots.inject('shell.overlay', () =>
          ctx.slots.register({ name: 'shell.overlay', id: 'islands-topbar', order: -100 }, IslandsTopBar),
        );

        ctx.inject(['slots', 'modelDirectories'], (scope) => {
          modelDirectories = scope.modelDirectories;
          // Single slots render the lowest priority; a negative priority shadows
          // the shipped selector without colliding with it.
          scope.slots.inject('conversation.input.model', () =>
            scope.slots.register({ name: 'conversation.input.model', priority: -1 }, ModelPicker),
          );
        });

        // Take the workspace shortcut over at the shortcut service layer: fixed
        // input listeners run before the catalog dispatch, so the DSH
        // sidebar.left.toggle never swaps in its rail-only render tree.
        ctx.inject(['shortcuts'], (scope) => {
          const off = scope.shortcuts.observeFixedInput((input) => {
            if (input.type !== 'keydown') return;
            if (!document.body.hasAttribute(ATTRIBUTE)) return;
            const gesture = input.gesture;
            if (gesture.code !== 'KeyB' || gesture.repeat || gesture.composing) return;
            if (!(gesture.meta || gesture.control) || gesture.alt || gesture.shift) return;
            const modal = input.context?.modal;
            if (modal !== null && modal !== undefined && modal !== 'sidebar') return;
            // Desktop delivers the platform's primary chord through the native
            // keyboard bridge, bypassing fixed input. Let that path collapse the
            // DSH and let the frame observer below convert it; intercepting both
            // would toggle twice. The secondary chord is handled here.
            const runtime = scope.shortcuts.runtime;
            const platform = scope.shortcuts.platform;
            const nativeOwned =
              runtime === 'desktop' &&
              ((platform === 'macos' && gesture.meta && !gesture.control) ||
                (platform !== 'macos' && gesture.control && !gesture.meta));
            if (nativeOwned) return;
            input.consume();
            toggleWorkspace();
          });
          scope.effect(() => off, 'dsh-islands-ui: workspace collapse shortcut');
        });

        // The native primary chord reaches DSH's own sidebar collapse before any
        // fixed listener. Convert that collapse into our workspace collapse
        // immediately (and restore the expanded sidebar render tree) so the
        // old rail never stays on screen.
        ctx.effect(() => {
          let observer;
          let timer;
          const fix = () => {
            const frame = document.querySelector('.PIRFFq_frame');
            if (frame === null || !frame.hasAttribute('data-sidebar-collapsed')) return;
            const wasCollapsed = document.body.hasAttribute(WORKSPACE_ATTR);
            if (wasCollapsed) document.body.removeAttribute(WORKSPACE_ATTR);
            else document.body.setAttribute(WORKSPACE_ATTR, '');
            layoutService?.toggleSidebar();
          };
          const attach = () => {
            const frame = document.querySelector('.PIRFFq_frame');
            if (frame === null) {
              timer = window.setTimeout(attach, 200);
              return;
            }
            fix();
            observer = new MutationObserver(fix);
            observer.observe(frame, { attributes: true, attributeFilter: ['data-sidebar-collapsed'] });
          };
          attach();
          return () => {
            window.clearTimeout(timer);
            observer?.disconnect();
          };
        }, 'dsh-islands-ui: native collapse conversion');

        ctx.slots.inject('settings.general.item', () =>
          ctx.slots.register(
            { name: 'settings.general.item', id: 'islands-ui', order: 13 },
            IslandsPreferenceRow,
          ),
        );
      },
    };
  },
});
