/**
 * Browser half of the Islands UI skin.
 *
 * One job: publish the design-system stylesheet and a preference switch. The
 * stylesheet lives in src/*.css and is inlined by build.mjs — the module loader
 * has no filesystem access, so the built client.js is self-contained.
 */
window.__ModuleLoader__.load({
  id: 'dsh-islands-ui',
  factory(require) {
    const React = require('react');
    const ReactDOM = require('react-dom');
    const h = React.createElement;
    const CSS = "/* ---- 00-tokens.css ---- */\n/* ==========================================================================\n   Islands UI · 00 tokens\n   One source of truth for the skin. Every rule below reads these variables,\n   so light/dark, radius, elevation and spacing are changed in one place.\n   `--dsw-*` aliases are re-pointed at the Islands scale so shipped components\n   inherit the new language without per-component overrides.\n   ========================================================================== */\n\nbody[data-islands-ui] {\n  /* Canvas: the unified background all islands float on. */\n  --isl-canvas: #f7f7f7;\n  --isl-canvas-veil: rgba(232, 234, 239, 0.72);\n  /* Island surfaces. */\n  --isl-surface: #ffffff;\n  --isl-surface-muted: #f3f5f8;\n  --isl-surface-sunken: #eceef3;\n  /* Hairlines: Islands uses tinted, very quiet borders. */\n  --isl-border-soft: rgba(17, 24, 39, 0.06);\n  --isl-border: rgba(17, 24, 39, 0.09);\n  --isl-border-strong: rgba(17, 24, 39, 0.14);\n  --isl-hover: rgba(17, 24, 39, 0.055);\n  --isl-active: rgba(17, 24, 39, 0.09);\n  --isl-accent: #4176e6;\n  /* Geometry. */\n  --isl-radius-xl: 20px;\n  --isl-radius-lg: 16px;\n  --isl-radius-md: 12px;\n  --isl-radius-sm: 8px;\n  --isl-gap: 5px;\n  --isl-topbar-height: 40px;\n  /* Extra chrome above the app top bar (the Windows title bar). */\n  --isl-chrome-top: 0px;\n  --isl-rail-collapsed-width: 56px;\n  --isl-rail-width: 48px;\n  /* Elevation: a hairline ring plus one soft, deep shadow. */\n  --isl-shadow-island: none;\n  --isl-shadow-float:\n    0 0 0 1px rgba(17, 24, 39, 0.05), 0 10px 24px -10px rgba(17, 24, 39, 0.14),\n    0 28px 64px -32px rgba(17, 24, 39, 0.3);\n\n  /* ---- DSH alias layer -------------------------------------------------- */\n  --dsw-alias-bg-base: var(--isl-surface);\n  --dsw-alias-bg-layer-1: var(--isl-surface);\n  --dsw-alias-bg-layer-2: var(--isl-surface);\n  --dsw-alias-bg-layer-3: var(--isl-surface-muted);\n  --dsw-alias-bg-overlay: var(--isl-surface);\n  --dsw-alias-bg-module-platform: var(--isl-surface-muted);\n  --dsw-alias-bg-multi-select: var(--isl-surface-muted);\n  --dsw-alias-bg-skeleton: rgba(17, 24, 39, 0.06);\n  --dsw-specific-sidebar-fill: var(--isl-surface);\n  --dsw-specific-input-major: var(--isl-surface);\n  --dsw-specific-selector: var(--isl-surface-muted);\n  --dsw-specific-tip: var(--isl-surface-muted);\n  --dsw-specific-bubble: var(--isl-surface-muted);\n  --dsw-specific-bubble-highlight: #eef1f6;\n  --dsw-specific-sidebar-nav-item-active: var(--isl-surface-muted);\n  --dsw-specific-sidebar-nav-item-active-accent: color-mix(\n    in srgb,\n    var(--dsw-alias-state-business-primary) 16%,\n    transparent\n  );\n  --dsw-specific-menu: color-mix(in srgb, var(--isl-surface) 90%, transparent);\n  --dsw-alias-menu-group-header-fill: color-mix(in srgb, var(--isl-surface-muted) 92%, transparent);\n  --dsw-alias-markdown-code-block: var(--isl-surface-muted);\n  --dsw-alias-markdown-code-block-banner: var(--isl-surface-muted);\n  --dsw-alias-markdown-inline-code: var(--isl-surface-muted);\n  --dsw-alias-markdown-tag: var(--isl-surface-muted);\n  --dsw-alias-settings-card-fill: color-mix(in srgb, var(--isl-surface-muted) 68%, var(--isl-surface));\n  --dsw-alias-settings-card-stroke: var(--isl-border-soft);\n  --dsw-alias-border-l1: var(--isl-border-soft);\n  --dsw-alias-border-l2: var(--isl-border-soft);\n  --dsw-alias-border-l3: var(--isl-border);\n  --dsw-alias-border-l4: var(--isl-border-strong);\n  --dsw-alias-interactive-bg-hover: var(--isl-hover);\n  --dsw-alias-interactive-bg-active: var(--isl-active);\n  --dsw-alias-interactive-bg-hover-solid: var(--isl-surface-muted);\n  --dsw-alias-button-elevated-fill: var(--isl-surface);\n  --dsw-alias-button-floating-fill: var(--isl-surface);\n  --dsw-alias-button-floating-hover: var(--isl-surface-muted);\n  --dsw-radius-xs: 6px;\n  --dsw-radius-sm: 8px;\n  --dsw-radius-md: 10px;\n  --dsw-radius-lg: 14px;\n  --dsw-radius-xl: 18px;\n  --dsw-radius-panel: 20px;\n  --dsw-menu-backdrop-filter: blur(18px) saturate(140%);\n  --dsw-mask-blur: blur(3px);\n  --dsw-alias-bg-mask-1: rgba(107, 114, 128, 0.3);\n  --dsw-alias-bg-mask-2: rgba(107, 114, 128, 0.18);\n\n  background-color: var(--isl-canvas) !important;\n}\n\n/* Elevation tokens are declared on `body, body *` by the shipped theme, so the\n   override has to be declared on descendants too, not only on body. */\nbody[data-islands-ui] * {\n  --dsw-elevation-stroke-color: var(--isl-border);\n  --dsw-elevation-stroke: 0 0 0 0.5px var(--isl-border);\n  --dsw-elevation-soft:\n    0 0 0 0.5px var(--isl-border), 0 6px 16px -6px rgba(17, 24, 39, 0.1),\n    0 18px 40px -24px rgba(17, 24, 39, 0.24);\n  --dsw-elevation-panel:\n    0 0 0 0.5px var(--isl-border), 0 8px 20px -8px rgba(17, 24, 39, 0.12),\n    0 24px 48px -28px rgba(17, 24, 39, 0.24);\n  --dsw-elevation-prominent:\n    0 0 0 0.5px var(--isl-border), 0 12px 28px -10px rgba(17, 24, 39, 0.16),\n    0 32px 64px -32px rgba(17, 24, 39, 0.3);\n  --dsw-shadow-lv1: 0 2px 4px rgba(17, 24, 39, 0.05);\n  --dsw-shadow-lv2: 0 4px 12px rgba(17, 24, 39, 0.06), 0 2px 8px rgba(17, 24, 39, 0.04);\n  --dsw-shadow-lv3:\n    0 0 1px rgba(17, 24, 39, 0.2), 0 12px 32px rgba(17, 24, 39, 0.08);\n}\n\n/* ---- Dark --------------------------------------------------------------- */\nbody[data-islands-ui][data-ds-dark-theme] {\n  --isl-canvas: #0f1012;\n  --isl-canvas-veil: rgba(15, 16, 18, 0.72);\n  --isl-surface: #1b1c1f;\n  --isl-surface-muted: #232428;\n  --isl-surface-sunken: #151619;\n  --isl-border-soft: rgba(255, 255, 255, 0.06);\n  --isl-border: rgba(255, 255, 255, 0.09);\n  --isl-border-strong: rgba(255, 255, 255, 0.16);\n  --isl-hover: rgba(255, 255, 255, 0.06);\n  --isl-active: rgba(255, 255, 255, 0.1);\n  --isl-shadow-island: none;\n  --isl-shadow-float:\n    0 0 0 1px rgba(0, 0, 0, 0.55), 0 12px 28px -12px rgba(0, 0, 0, 0.6),\n    0 32px 72px -36px rgba(0, 0, 0, 0.85);\n\n  --dsw-alias-bg-skeleton: rgba(255, 255, 255, 0.07);\n  --dsw-specific-bubble-highlight: #2a2c31;\n  --dsw-specific-menu: color-mix(in srgb, var(--isl-surface) 88%, transparent);\n  --dsw-alias-bg-mask-1: rgba(0, 0, 0, 0.55);\n  --dsw-alias-bg-mask-2: rgba(0, 0, 0, 0.32);\n}\n\nbody[data-islands-ui][data-ds-dark-theme] * {\n  --dsw-elevation-stroke-color: var(--isl-border);\n  --dsw-elevation-stroke: 0 0 0 0.5px var(--isl-border);\n  --dsw-elevation-soft:\n    0 0 0 0.5px var(--isl-border), 0 8px 20px -8px rgba(0, 0, 0, 0.55),\n    0 20px 44px -24px rgba(0, 0, 0, 0.7);\n  --dsw-elevation-panel:\n    0 0 0 0.5px var(--isl-border), 0 10px 24px -10px rgba(0, 0, 0, 0.55),\n    0 28px 56px -30px rgba(0, 0, 0, 0.75);\n  --dsw-elevation-prominent:\n    0 0 0 0.5px var(--isl-border), 0 14px 32px -12px rgba(0, 0, 0, 0.6),\n    0 36px 72px -36px rgba(0, 0, 0, 0.85);\n  --dsw-shadow-lv1: 0 2px 6px rgba(0, 0, 0, 0.35);\n  --dsw-shadow-lv2: 0 6px 16px rgba(0, 0, 0, 0.4);\n  --dsw-shadow-lv3: 0 0 1px rgba(0, 0, 0, 0.6), 0 16px 40px rgba(0, 0, 0, 0.45);\n}\n\n/* Windows keeps its native title bar above the app top bar. */\nhtml[data-windows-titlebar] body[data-islands-ui] {\n  --isl-chrome-top: var(--dsh-windows-titlebar-height, 32px);\n}\n\n/* User-selected accent: remap the business tokens everywhere. */\nbody[data-islands-ui][data-islands-accent],\nbody[data-islands-ui][data-islands-accent] * {\n  --dsw-alias-state-business-primary: var(--isl-accent);\n  --dsw-alias-state-business-tertiary: color-mix(in srgb, var(--isl-accent) 16%, transparent);\n}\n\n/* macOS ships a tinted, translucent sidebar. Islands wants an opaque canvas\n   instead, so the tint is replaced everywhere it is declared. */\nhtml[data-platform='darwin'] body[data-islands-ui],\nhtml[data-platform='darwin'] body[data-islands-ui][data-ds-dark-theme] {\n  --dsw-specific-menu: color-mix(in srgb, var(--isl-surface) 88%, transparent);\n  --dsw-alias-menu-group-header-fill: color-mix(in srgb, var(--isl-surface-muted) 94%, transparent);\n}\n\n/* ---- 10-shell.css ---- */\n/* ==========================================================================\n   Islands UI · 10 shell\n   The frame becomes a canvas; the three columns become detachable islands.\n   ========================================================================== */\n\nbody[data-islands-ui] .PIRFFq_frame {\n  /* The ocean is a solid surface, never the desktop showing through vibrancy. */\n  background: var(--isl-canvas);\n  padding: calc(var(--isl-chrome-top) + var(--isl-topbar-height) + var(--isl-gap)) var(--isl-gap) var(--isl-gap);\n  /* Column gap only: the empty bottom track must not steal an extra row gap,\n     so the islands stay symmetric top and bottom. */\n  gap: 0 var(--isl-gap);\n}\n\n/* A real bottom panel (terminal, banner) still gets breathing room. */\nbody[data-islands-ui] .PIRFFq_bottomRow:has([data-slot='shell.bottom'] > *) {\n  margin-top: var(--isl-gap);\n}\n\n/* The closed right column is a zero-width track, but the grid still reserves a\n   gap beside it; pull the centre island over that gap so the canvas margin on\n   the right equals the margin on the left. */\nbody[data-islands-ui] .PIRFFq_frame[data-rightbar-collapsed] .PIRFFq_centerCol {\n  margin-right: calc(-1 * var(--isl-gap));\n}\n\n/* Center column: the conversation island. */\nbody[data-islands-ui] .PIRFFq_centerCol {\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  border-radius: var(--isl-radius-lg);\n  box-shadow: var(--isl-shadow-island);\n  overflow: hidden;\n}\n\n/* Shipped desktop rules paint the sidebar with a gradient and give the center\n   column a left hairline; both are removed so the canvas reads as one plane. */\n[data-platform='darwin'] body[data-islands-ui] .PIRFFq_frame {\n  background: var(--isl-canvas);\n}\n\n[data-platform='darwin'] body[data-islands-ui] .PIRFFq_frame:not([data-sidebar-drawer]) .PIRFFq_sidebarCol {\n  background: transparent;\n  border-right: 0;\n  backdrop-filter: none;\n}\n\nbody[data-islands-ui] .PIRFFq_sidebarCol {\n  background: transparent;\n  border-right: 0;\n}\n\n[data-platform='darwin'] body[data-islands-ui] .PIRFFq_centerCol,\nbody[data-islands-ui] .PIRFFq_centerCol {\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  border-left: 1px solid var(--isl-border-soft);\n}\n\nbody[data-islands-ui] .PIRFFq_mainPanel {\n  background: transparent;\n}\n\n/* Right workbench: only while a pane is open does the column render an island. */\nbody[data-islands-ui] .PIRFFq_rightbarCol {\n  background: transparent;\n}\n\nbody[data-islands-ui] .Dv5QdW_panel[data-sidebar-right-open]:not([data-sidebar-right-panel='fullscreen']) {\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  border-radius: var(--isl-radius-lg);\n  box-shadow: var(--isl-shadow-island);\n  overflow: clip;\n}\n\n/* Drawer mask on narrow windows: Islands keeps the veil light and blurred. */\nbody[data-islands-ui] .PIRFFq_drawerMask {\n  background: var(--dsw-alias-bg-mask-1);\n  backdrop-filter: var(--dsw-mask-blur);\n}\n\n/* The shell overlay layer is where the rail and window top bar live. In\n   drawer mode it must paint above the drawer mask (70) and the drawer (71),\n   otherwise the persistent rail disappears under the open workspace drawer. */\n@media (width <= 767px) {\n  body[data-islands-ui] .PIRFFq_overlayLayer {\n    z-index: 72;\n  }\n}\n\n/* The resize handle is invisible chrome; keep it grabbable but quiet. */\nbody[data-islands-ui] .PIRFFq_handle {\n  width: 10px;\n  margin-left: -5px;\n}\n\n/* The shell computes the right handle's inline `left` from the frame's\n   border-box width, but its absolute containing block is the padded grid area\n   and the panel itself sits inside the right padding. That shifts the handle\n   two gaps to the right — wholly inside the right island. Cancel the frame's\n   horizontal padding so the strip straddles the right island's left edge\n   (covering the whole canvas gap plus 5px of the panel) like the left one. */\nbody[data-islands-ui] .PIRFFq_handle[data-side='rightbar'] {\n  margin-left: calc(-5px - 2 * var(--isl-gap));\n}\n\n/* Windows title bar keeps its native height; the frame padding already gives\n   the rounded content corner room, so only the radius is unified. */\n[data-windows-titlebar] body[data-islands-ui] .PIRFFq_centerCol {\n  border-radius: var(--isl-radius-lg);\n}\n\n[data-windows-titlebar] body[data-islands-ui] .PIRFFq_frame {\n  background: var(--isl-canvas);\n}\n\n/* Collapsed sidebar on macOS drops the center column's left hairline; the\n   island keeps its outline regardless. */\n[data-platform='darwin'] body[data-islands-ui] [data-sidebar-collapsed] .PIRFFq_centerCol {\n  border-left: 1px solid var(--isl-border-soft);\n}\n\n/* ==========================================================================\n   Workbench panels (better-sidebar bottom dock + native right sidebar)\n   Both must read as independent islands, not as sheets pasted onto the\n   conversation island.\n   ========================================================================== */\n\n/* The bottom workbench reserves its height on the conversation column, not on\n   the inner panel, so the island itself shrinks and a canvas gap opens between\n   the two islands. */\nbody[data-islands-ui] #root [data-dsh-center-col] {\n  margin-bottom: 0;\n}\n\nbody[data-islands-ui] .PIRFFq_centerCol {\n  margin-bottom: var(--dsh-sidebar-height, 0px);\n  transition: margin-bottom var(--ds-transition-duration-slow) var(--ds-ease-in-out);\n}\n\nbody[data-islands-ui]:has([data-dsh-bottom-panel]:not([class*='Hidden'])) .PIRFFq_centerCol {\n  /* one gap above the panel and one below it */\n  margin-bottom: calc(var(--dsh-sidebar-height, 0px) + var(--isl-gap));\n}\n\nbody[data-islands-ui] [data-dsh-bottom-panel] {\n  box-sizing: border-box;\n  /* Align the panel with the conversation island edges and let the frame\n     padding provide the bottom gap, so every island shares one gap width. */\n  margin: 0;\n  bottom: var(--isl-gap);\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  border-radius: var(--isl-radius-lg);\n  box-shadow: none;\n  /* The rounded island clips its content, but NOT the height-drag strip: the\n     strip must reach into the canvas gap above the panel to be reachable\n     there. Clip the body instead (below), so the strip can overhang. */\n  overflow: visible;\n}\n\n/* Keep the island's rounded content edge with the panel's own clipping gone:\n   the body carries the radius, while the absolute resize strip and the close\n   control stay outside this clip. */\nbody[data-islands-ui] [data-dsh-bottom-panel] > [class*='panelBody'] {\n  overflow: clip;\n  border-radius: calc(var(--isl-radius-lg) - 1px);\n}\n\n/* The host centers its strip on the panel's top border (`top: -4px;\n   height: 8px`), which was right before the skin opened a canvas gap between\n   the conversation island and the panel. Anchor the 10px strip to that gap\n   instead: 5px above the border box top (the whole gap) and 5px inside the\n   panel, matching the side handles' straddle. `top` is relative to the panel's\n   padding box, hence the extra 1px border compensation. */\nbody[data-islands-ui] [data-dsh-bottom-panel] > [class*='bottomResize'] {\n  top: calc(-1px - var(--isl-gap));\n  height: 10px;\n}\n\n/* The native right sidebar keeps its own width preference, which can exceed\n   the track the frame grants; clamp it to the track so it never hangs over\n   the conversation island. */\nbody[data-islands-ui] .Dv5QdW_panel[data-sidebar-right-open]:not([data-sidebar-right-panel='fullscreen']) {\n  box-sizing: border-box;\n  width: 100% !important;\n  max-width: 100% !important;\n  min-width: 0;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  body[data-islands-ui] .PIRFFq_centerCol {\n    transition: none;\n  }\n}\n\n/* ==========================================================================\n   Independent workspace collapse\n   The DSH collapse swaps the whole sidebar render tree for its rail-only\n   variant. Instead the expanded rail stays mounted and only the workspace\n   column hides, so the left column never re-renders or re-flows.\n   ========================================================================== */\n\n/* The right column must keep its own track while the workspace is collapsed.\n   Pin it to 0 only while the right pane is closed; when it opens, use the\n   pane's PREFERRED width (published by the client). Reading the current\n   column width here deadlocks: it is 0 while closed, so opening the pane\n   could never grow the track, and the panel's `width: 100%` clamp would keep\n   it at two border pixels. The fallback keeps the pane visible even before\n   the width source has been located. */\nbody[data-islands-ui][data-islands-workspace-collapsed]\n  .PIRFFq_frame:not(\n    :has(.Dv5QdW_panel[data-sidebar-right-open]:not([data-sidebar-right-panel='fullscreen']))\n  ) {\n  grid-template-columns:\n    var(--isl-rail-collapsed-width) minmax(0, 1fr) 0 !important;\n}\n\nbody[data-islands-ui][data-islands-workspace-collapsed]\n  .PIRFFq_frame:has(\n    .Dv5QdW_panel[data-sidebar-right-open]:not([data-sidebar-right-panel='fullscreen'])\n  ) {\n  grid-template-columns:\n    var(--isl-rail-collapsed-width) minmax(0, 1fr)\n    var(--isl-rightbar-w, max(300px, 45vw)) !important;\n}\n\nbody[data-islands-ui] .PIRFFq_frame[data-islands-animating] {\n  transition: grid-template-columns var(--ds-transition-duration-slow) var(--ds-ease-in-out);\n}\n\n/* ---- 15-topbar.css ---- */\n/* ==========================================================================\n   Islands UI · 15 top bar\n   A window-chrome strip above the three islands. It clears the macOS traffic\n   lights, hosts the workspace collapse control, and leaves the content area\n   completely free for the islands.\n   ========================================================================== */\n\n/* Registered even when the skin is off; the base rule keeps it out of the way. */\n.isl-topbar {\n  display: none;\n}\n\nbody[data-islands-ui] .isl-topbar {\n  position: fixed;\n  inset: var(--isl-chrome-top) 0 auto;\n  z-index: 30;\n  box-sizing: border-box;\n  display: flex;\n  align-items: flex-start;\n  gap: 6px;\n  height: var(--isl-topbar-height);\n  /* macOS centers the traffic lights in its 48px window-chrome band; the\n     controls follow that center (10 + 14 = 24), not the 40px bar's own. */\n  padding: 10px 10px 0 8px;\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 13px;\n  line-height: 20px;\n  /* The bar itself must never swallow clicks meant for controls that are\n     docked over it; only the toggle and the drag handle opt back in. */\n  pointer-events: none;\n  -webkit-app-region: no-drag;\n  user-select: none;\n}\n\n/* Left lead (traffic-light strip) and the centre of the bar are draggable;\n   both stop short of the docked controls so clicks keep working. */\n/* The 88px lead exists only for the macOS traffic lights. */\nbody[data-islands-ui] .isl-topbarLead {\n  display: none;\n}\n\nhtml[data-platform='darwin'] body[data-islands-ui] .isl-topbar {\n  padding-left: 88px;\n}\n\nhtml[data-platform='darwin'] body[data-islands-ui] .isl-topbarLead {\n  position: absolute;\n  inset: 0 auto 0 0;\n  display: block;\n  width: 88px;\n  pointer-events: auto;\n  -webkit-app-region: drag;\n}\n\nbody[data-islands-ui] .isl-topbarDrag {\n  flex: 1;\n  align-self: stretch;\n  min-width: 0;\n  margin-right: 250px;\n  pointer-events: auto;\n  -webkit-app-region: drag;\n}\n\nbody[data-islands-ui] .isl-topbarToggle {\n  box-sizing: border-box;\n  flex: none;\n  display: grid;\n  place-items: center;\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  border: 0;\n  border-radius: var(--isl-radius-sm);\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  pointer-events: auto;\n  -webkit-app-region: no-drag;\n}\n\nbody[data-islands-ui] .isl-topbarToggle:hover {\n  background: var(--isl-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] .isl-topbarToggle:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: -2px;\n}\n\n/* Narrow desktop: the top bar remains the window chrome (drag strip + right\n   panel toggle), but the rail's home button owns the workspace drawer. The\n   chrome must paint above the drawer mask (70) and the drawer (71). */\n@media (width <= 767px) {\n  body[data-islands-ui] .isl-topbar {\n    z-index: 72;\n  }\n\n  body[data-islands-ui] .isl-topbarToggle {\n    display: none;\n  }\n\n  body[data-islands-ui] .isl-topbarDrag {\n    margin-right: 40px;\n  }\n}\n\n/* ---- 16-rail.css ---- */\n/* ==========================================================================\n   Islands UI · 16 left rail\n   Workspace / automation / plugins, user-pinned plugin entries, and a\n   context menu for the remaining panels.\n   ========================================================================== */\n\nbody[data-islands-ui] .isl-rail {\n  display: none;\n}\n\nbody[data-islands-ui] .isl-rail {\n  position: fixed;\n  top: calc(var(--isl-chrome-top) + var(--isl-topbar-height) + 10px);\n  left: var(--isl-gap);\n  z-index: 25;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 4px;\n  width: var(--isl-rail-width);\n  pointer-events: auto;\n}\n\nbody[data-islands-ui] .isl-railBtn {\n  box-sizing: border-box;\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 36px;\n  height: 36px;\n  padding: 0;\n  border: 0;\n  border-radius: var(--isl-radius-md);\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  transition:\n    background-color 0.12s var(--ds-ease-in-out),\n    color 0.12s var(--ds-ease-in-out);\n}\n\nbody[data-islands-ui] .isl-railBtn:hover {\n  background: var(--isl-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] .isl-railBtn.is-active {\n  background: var(--isl-active);\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] .isl-railBtn:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: -2px;\n}\n\nbody[data-islands-ui] .isl-railDivider {\n  width: 24px;\n  height: 1px;\n  margin: 2px 0;\n  background: var(--isl-border-soft);\n}\n\n/* ---- Plugin pin menu -------------------------------------------------- */\nbody[data-islands-ui] .isl-railMenu {\n  position: fixed;\n  z-index: 35;\n  box-sizing: border-box;\n  width: 240px;\n  padding: 6px;\n  border: 1px solid var(--isl-border-soft);\n  border-radius: var(--isl-radius-md);\n  background: var(--isl-surface);\n  box-shadow: var(--isl-shadow-float);\n  color: var(--dsw-alias-label-primary);\n  font-size: 13px;\n  line-height: 20px;\n}\n\nbody[data-islands-ui] .isl-railMenuTitle {\n  padding: 4px 8px 6px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11px;\n  line-height: 16px;\n}\n\nbody[data-islands-ui] .isl-railMenuRow {\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n  min-height: 34px;\n  padding: 5px 8px;\n  border: 0;\n  border-radius: var(--isl-radius-sm);\n  background: transparent;\n  color: inherit;\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n\nbody[data-islands-ui] .isl-railMenuRow:hover {\n  background: var(--isl-hover);\n}\n\nbody[data-islands-ui] .isl-railMenuIcon {\n  display: inline-flex;\n  flex: none;\n  color: var(--dsw-alias-label-secondary);\n}\n\nbody[data-islands-ui] .isl-railMenuText {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  gap: 1px;\n  min-width: 0;\n}\n\nbody[data-islands-ui] .isl-railMenuLabel {\n  min-width: 0;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\nbody[data-islands-ui] .isl-railMenuSub {\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 10px;\n  line-height: 14px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\nbody[data-islands-ui] .isl-railMenuPin {\n  display: inline-flex;\n  flex: none;\n  color: var(--dsw-alias-label-tertiary);\n  opacity: 0.35;\n}\n\nbody[data-islands-ui] .isl-railMenuPin.is-pinned {\n  color: var(--dsw-alias-state-business-primary);\n  opacity: 1;\n}\n\nbody[data-islands-ui] .isl-railEmpty {\n  padding: 8px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n}\n\n/* Settings gear pinned above the account avatar. */\nbody[data-islands-ui] .isl-railSettings {\n  display: none;\n}\n\nbody[data-islands-ui] .isl-railSettings {\n  position: fixed;\n  left: calc(var(--isl-gap) + (var(--isl-rail-width) - 36px) / 2);\n  bottom: 56px;\n  z-index: 26;\n  display: grid;\n  place-items: center;\n}\n\n/* Narrow desktop: the rail is the persistent navigation; the workspace is a\n   drawer opened from its home button. Both the rail and its menus must sit\n   above the drawer (71) and the drawer mask (70). */\n@media (width <= 767px) {\n  body[data-islands-ui] .isl-rail {\n    z-index: 72;\n  }\n\n  body[data-islands-ui] .isl-railSettings {\n    z-index: 72;\n  }\n\n  body[data-islands-ui] .isl-railMenu {\n    z-index: 1100;\n  }\n}\n\n/* ---- 20-sidebar.css ---- */\n/* ==========================================================================\n   Islands UI · 20 sidebar\n   The expanded sidebar is one full-height island: a persistent icon rail on\n   the left and the workspace browser on the same surface. The island spans the\n   exact same top and bottom edges as the conversation island. Collapsed mode\n   keeps the shipped rail untouched.\n   ========================================================================== */\n\nbody[data-islands-ui] .kB3qhq_root {\n  background: transparent;\n}\n\n/* ---- Expanded: chrome rail + workspace island --------------------------- */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) {\n  display: grid;\n  grid-template-columns: var(--isl-rail-width) minmax(0, 1fr);\n  grid-template-rows: var(--isl-gap) auto minmax(0, 1fr) auto;\n  column-gap: var(--isl-gap);\n  padding: 0;\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  overflow: hidden;\n  position: relative;\n  isolation: isolate;\n}\n\n/* The workspace browser is the sidebar's only island. */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed)::after {\n  content: '';\n  position: absolute;\n  z-index: -1;\n  inset: 0 0 0 calc(var(--isl-rail-width) + var(--isl-gap));\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  border-radius: var(--isl-radius-lg);\n  box-shadow: var(--isl-shadow-island);\n  pointer-events: none;\n}\n\n/* The top band is a small breathing gap inside the sidebar column. */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_topStrip {\n  grid-area: 1 / 1 / 2 / -1;\n  height: 100%;\n  margin: 0;\n  padding: 0 4px 0 0;\n  justify-content: flex-end;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_logoRow {\n  grid-area: 2 / 1;\n  height: 36px;\n  margin: 0 0 6px;\n  padding: 0;\n  justify-content: center;\n  overflow: visible;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_brand {\n  justify-content: center;\n  overflow: visible;\n}\n\n/* The brand wordmark and build stamp belong to window chrome, not the rail. */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_brandName,\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_localBuildBrand {\n  display: none;\n}\n\nbody[data-islands-ui] .kB3qhq_brandMark {\n  width: 28px;\n  height: 28px;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_newSession {\n  grid-area: 2 / 2;\n  height: 36px;\n  margin: 0 6px 6px;\n  padding: 0 8px;\n  justify-content: flex-start;\n  border: 0;\n  border-radius: var(--isl-radius-md);\n  background: transparent;\n  box-shadow: none;\n  color: var(--dsw-alias-label-primary);\n  font-weight: 400;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_newSessionContent {\n  justify-content: flex-start;\n  width: 100%;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_newSession:hover {\n  background: var(--isl-hover);\n}\n\n/* The global panel list becomes the rail's primary navigation. */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_panelList {\n  grid-area: 3 / 1;\n  align-self: start;\n  align-items: center;\n  gap: 4px;\n  margin: 2px 0 0;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_panelRow {\n  width: 36px;\n  height: 36px;\n  justify-content: center;\n  padding: 0;\n  border: 0;\n  border-radius: var(--isl-radius-md);\n  background-clip: border-box;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_panelRow.kB3qhq_panelActive {\n  background: var(--dsw-specific-sidebar-nav-item-active-accent);\n  color: var(--dsw-alias-state-business-primary);\n}\n\n/* The label leaves the visual rail but stays in the accessibility tree. */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_panelTitle {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  clip: rect(0 0 0 0);\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n/* ---- Workspace browser: same surface, full height ----------------------- */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_regionArea {\n  grid-area: 3 / 2 / 5 / 3;\n  margin: 0;\n  padding: 0 4px 6px;\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  overflow: hidden;\n}\n\nbody[data-islands-ui] .kB3qhq_regionArea {\n  --dsh-session-list-edge-inset: 4px;\n}\n\nbody[data-islands-ui] .Kjh-qa_sectionHeader {\n  padding-inline: 8px;\n  margin-right: 0;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n  letter-spacing: 0.01em;\n}\n\nbody[data-islands-ui] .Kjh-qa_sectionLabel {\n  font-weight: 500;\n}\n\nbody[data-islands-ui] .Kjh-qa_list {\n  padding-bottom: 8px;\n}\n\nbody[data-islands-ui] .Kjh-qa_fade {\n  background: linear-gradient(to bottom, transparent, var(--isl-surface));\n}\n\nbody[data-islands-ui] .JoiKIa_sessionRow,\nbody[data-islands-ui] .JoiKIa_projectRow {\n  border-radius: var(--isl-radius-sm);\n  padding-inline: 8px;\n}\n\n/* ---- Rail foot: settings gear ------------------------------------------ */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_footArea {\n  grid-area: 4 / 1;\n  align-items: center;\n  margin-top: 6px;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_settingsArea,\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_footerActions {\n  width: auto;\n  align-items: center;\n  justify-content: center;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) ._77Pn0W_triggerRow {\n  width: 36px;\n  margin: 4px 0 2px;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) ._77Pn0W_trigger {\n  flex: none;\n  width: 36px;\n  height: 36px;\n  margin: 0;\n  padding: 0;\n  justify-content: center;\n  border-inline: 0;\n  border-radius: var(--isl-radius-md);\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) ._77Pn0W_triggerLabel {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  clip: rect(0 0 0 0);\n  white-space: nowrap;\n  overflow: hidden;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) ._77Pn0W_trigger:hover,\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) ._77Pn0W_trigger[aria-expanded='true'] {\n  background: var(--isl-hover);\n}\n\n/* Footer actions contributed next to Settings (account launcher, etc.). */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_footerActions button {\n  width: 36px;\n  height: 36px;\n  border-radius: var(--isl-radius-md);\n}\n\n/* ---- Collapsed rail ------------------------------------------------------ */\n/* Collapsing hides the workspace browser only; the rail keeps its own island. */\nbody[data-islands-ui] .kB3qhq_root.kB3qhq_collapsed {\n  /* The rail is chrome, not an island: it sits directly on the ocean. */\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  padding: 8px 10px 6px;\n  overflow: hidden;\n}\n\nbody[data-islands-ui] .kB3qhq_root.kB3qhq_collapsed .kB3qhq_topStrip {\n  height: 36px;\n  margin: 0;\n  padding: 0;\n  justify-content: center;\n}\n\nbody[data-islands-ui] .kB3qhq_collapsed .kB3qhq_newSession {\n  border-radius: var(--isl-radius-md);\n}\n\n/* The window top bar / rail own the collapse controls; the in-island toggle\n   would duplicate them at every width. */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_toggle {\n  display: none;\n}\n\n@media (min-width: 768px) {\n  /* On macOS the shipped frame gives a collapsed sidebar zero width, hiding\n     the rail too. Restore one rail-wide track (right panel still closed). */\n  [data-platform='darwin'] body[data-islands-ui] .PIRFFq_frame[data-sidebar-collapsed][data-rightbar-collapsed] {\n    grid-template-columns: var(--isl-rail-collapsed-width) minmax(0, 1fr) 0 !important;\n  }\n\n  /* The rail itself is the expand control; do not reserve header space for the\n     floating seat and do not show a second expand button over the island. */\n  [data-platform='darwin'] body[data-islands-ui] .PIRFFq_frame[data-sidebar-collapsed] {\n    --dsh-frame-leading-clearance: 0px;\n  }\n}\n\n/* The window chrome and the rail own the sidebar controls; the floating seat\n   is redundant (and at narrow widths would sit under the traffic lights). */\nbody[data-islands-ui] .PIRFFq_leadingSeat {\n  display: none;\n}\n\n/* ---- Search / section chrome inside the island --------------------------- */\nbody[data-islands-ui] .Kjh-qa_searchExpanded {\n  border-color: var(--isl-border-soft);\n  background: var(--isl-surface-muted);\n  border-radius: var(--isl-radius-sm);\n}\n\nbody[data-islands-ui] .Kjh-qa_searchExpanded .Kjh-qa_searchButton:hover {\n  background: transparent;\n}\n\n/* ---- Narrow drawer ------------------------------------------------------- */\n/* Below the top bar's breakpoint the workspace becomes an overlay drawer. It\n   starts at the frame's content top (below the top bar and its 5px gap) and\n   leaves the window's 5px canvas margin on the left; the workspace card inside\n   keeps the right/bottom 5px so the drawer still reads as an island. */\nbody[data-islands-ui] .PIRFFq_frame[data-sidebar-drawer] .PIRFFq_sidebarCol {\n  top: calc(var(--isl-chrome-top) + var(--isl-topbar-height) + var(--isl-gap));\n  bottom: 0;\n  left: var(--isl-gap);\n  background: var(--isl-canvas);\n  border-right: 0;\n  box-shadow: var(--isl-shadow-float);\n}\n\nbody[data-islands-ui] .PIRFFq_frame[data-sidebar-drawer] .kB3qhq_root::after {\n  inset: 0 var(--isl-gap) var(--isl-gap) calc(var(--isl-rail-width) + var(--isl-gap));\n}\n\n/* The sidebar's grid track is zero in drawer mode, but its column gap remains;\n   shift the conversation island right by the persistent rail so the closed\n   drawer leaves the rail visible and the island keeps its 5px gap. */\nbody[data-islands-ui] .PIRFFq_frame[data-sidebar-drawer] .PIRFFq_centerCol {\n  margin-left: var(--isl-rail-width);\n}\n\n/* ---- Account launcher (settings.launcher) --------------------------------\n   In this build the sidebar foot is the account menu rather than the bare\n   settings gear, so the same rail geometry applies to its trigger. */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_footArea .hjANda_root {\n  flex: none;\n  width: 36px;\n  margin-inline: 0;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_footArea .hjANda_anchor {\n  width: 36px;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_footArea .hjANda_trigger,\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_footArea .hjANda_trigger[data-signed-out='false']:not([data-collapsed='true']),\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_footArea .hjANda_trigger[data-signed-out='true']:not([data-collapsed='true']) {\n  width: 36px;\n  height: 36px;\n  padding: 0;\n  justify-content: center;\n  border-inline: 0;\n  border-radius: var(--isl-radius-md);\n  background-clip: border-box;\n}\n\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_footArea .hjANda_label {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  clip: rect(0 0 0 0);\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n/* ---- Independent workspace collapse ------------------------------------- */\n/* Hide the workspace island only; the rail keeps its expanded-layout DOM and\n   position, so nothing in the left column is re-rendered by the toggle. */\nbody[data-islands-ui][data-islands-workspace-collapsed] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_newSession,\nbody[data-islands-ui][data-islands-workspace-collapsed] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_regionArea,\nbody[data-islands-ui][data-islands-workspace-collapsed] .kB3qhq_root:not(.kB3qhq_collapsed)::after {\n  display: none !important;\n}\n\n/* ---- Custom rail replaces the shipped brand + panel icon column ---------- */\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_logoRow,\nbody[data-islands-ui] .kB3qhq_root:not(.kB3qhq_collapsed) .kB3qhq_panelList {\n  display: none !important;\n}\n\n/* ---- Aggregate pinned sessions ------------------------------------------ */\n.isl-pinnedHost {\n  display: block;\n  flex: none;\n}\n\n.isl-pinned {\n  display: none;\n  padding: 2px 4px 0;\n}\n\nbody[data-islands-ui] .isl-pinned {\n  display: block;\n}\n\n/* Pinned rows stay in place in their workspace groups and are also collected\n   in the aggregate block above. The original row keeps a subtle tint. */\nbody[data-islands-ui] .JoiKIa_pinIndicator {\n  color: var(--dsw-alias-state-business-primary);\n}\n\nbody[data-islands-ui] .JoiKIa_sessionRow:has(.JoiKIa_pinIndicator) {\n  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 6%, transparent);\n}\n\nbody[data-islands-ui] .JoiKIa_sessionRow:has(.JoiKIa_pinIndicator):hover {\n  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 10%, transparent);\n}\n\n.isl-pinnedHead {\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  width: 100%;\n  height: 32px;\n  padding: 0 6px;\n  border: 0;\n  border-radius: var(--isl-radius-sm);\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  font: inherit;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 20px;\n  text-align: left;\n  cursor: pointer;\n}\n\n/* Collapsible header mirrors the quiet workspace section header: colour only. */\n.isl-pinnedHead:hover {\n  background: transparent;\n  color: var(--dsw-alias-label-primary);\n}\n\n.isl-pinnedChevron {\n  display: inline-flex;\n  flex: none;\n  color: var(--dsw-alias-label-tertiary);\n  transform: rotate(-90deg);\n  transition: transform 0.12s var(--ds-ease-in-out);\n}\n\n.isl-pinned[data-open] .isl-pinnedChevron {\n  transform: rotate(0deg);\n}\n\n.isl-pinnedTitle {\n  min-width: 0;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.isl-pinnedCount {\n  margin-left: auto;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11px;\n  font-weight: 400;\n}\n\n.isl-pinnedList {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n  padding: 1px 0 3px;\n}\n\n.isl-pinnedRow {\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  width: 100%;\n  height: 32px;\n  padding: 0 8px 0 34px;\n  border: 0;\n  border-radius: var(--isl-radius-sm);\n  background: transparent;\n  color: var(--dsw-alias-label-primary);\n  font: inherit;\n  font-size: 14px;\n  line-height: 20px;\n  text-align: left;\n  cursor: pointer;\n}\n\n.isl-pinnedRow:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.isl-pinnedName {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n\n/* Hover marquee: clip the ellipsis, fade both edges as the title crawls. */\n.isl-pinnedRow:hover .isl-pinnedName {\n  text-overflow: clip;\n}\n\n.isl-pinnedRow .isl-pinnedName[data-scrolled] {\n  mask-image: linear-gradient(90deg, #0000, #000 12px);\n}\n\n.isl-pinnedRow .isl-pinnedName[data-clipped] {\n  mask-image: linear-gradient(270deg, #0000, #000 12px);\n}\n\n.isl-pinnedRow .isl-pinnedName[data-scrolled][data-clipped] {\n  mask-image: linear-gradient(90deg, #0000, #000 12px calc(100% - 12px), #0000);\n}\n\n.isl-pinnedRow:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: -2px;\n}\n\n.isl-pinnedPinBtn,\n.isl-pinnedLocate {\n  display: none;\n  place-items: center;\n  flex: none;\n  width: 24px;\n  height: 24px;\n  margin-left: 4px;\n  padding: 0;\n  border: 0;\n  border-radius: var(--isl-radius-xs, 6px);\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  cursor: pointer;\n  transition:\n    background-color 0.12s var(--ds-ease-in-out),\n    color 0.12s var(--ds-ease-in-out);\n}\n\n.isl-pinnedRow:hover .isl-pinnedPinBtn,\n.isl-pinnedRow:focus-within .isl-pinnedPinBtn,\n.isl-pinnedPinBtn:focus-visible,\n.isl-pinnedRow:hover .isl-pinnedLocate,\n.isl-pinnedRow:focus-within .isl-pinnedLocate,\n.isl-pinnedLocate:focus-visible {\n  display: grid;\n}\n\n.isl-pinnedPinBtn:hover,\n.isl-pinnedLocate:hover {\n  background: transparent;\n  color: var(--dsw-alias-label-primary);\n}\n\n.isl-pinnedPinBtn:focus-visible,\n.isl-pinnedLocate:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: -2px;\n}\n\n/* Brief highlight on the session the locate action focuses. */\nbody[data-islands-ui] .JoiKIa_sessionRow.isl-located {\n  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent) !important;\n}\n\n/* ---- 30-conversation.css ---- */\n/* ==========================================================================\n   Islands UI · 30 conversation & composer\n   ========================================================================== */\n\nbody[data-islands-ui] .kiGsTW_root {\n  background: transparent;\n}\n\nbody[data-islands-ui] .kiGsTW_header {\n  border-bottom-color: var(--isl-border-soft);\n}\n\nbody[data-islands-ui] .kiGsTW_headerBlank {\n  border-bottom-color: transparent;\n}\n\nbody[data-islands-ui] .kiGsTW_scrollBody {\n  margin-right: 0;\n}\n\n/* Composer: the one element that should visibly float above the island. */\nbody[data-islands-ui] .JZLxKW_card {\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  box-shadow: none;\n}\n\nbody[data-islands-ui] .JZLxKW_cardWorkspaceTrigger:after {\n  border-radius: var(--dsw-radius-panel);\n  color: var(--isl-border-strong);\n}\n\nbody[data-islands-ui] .JZLxKW_notice {\n  border-radius: var(--isl-radius-md);\n  background: var(--isl-surface-muted);\n}\n\n/* Sticky composer seat fades into the island surface, not into a raw token. */\nbody[data-islands-ui] .kiGsTW_root[data-phase='active'] .kiGsTW_composerSeat,\nbody[data-islands-ui] .kiGsTW_embeddedBody[data-content-phase='active'] .kiGsTW_composerSeat {\n  background: linear-gradient(\n    180deg,\n    color-mix(in srgb, var(--isl-surface) 0%, transparent) 0px,\n    var(--isl-surface) 36px\n  );\n}\n\n/* Hero: a calmer, slightly tighter headline on the open island. */\nbody[data-islands-ui] ._8tPydW_headline {\n  letter-spacing: -0.01em;\n}\n\nbody[data-islands-ui] ._8tPydW_workspace {\n  border-radius: 999px;\n  background: var(--isl-surface-muted);\n}\n\nbody[data-islands-ui] ._8tPydW_workspace:hover {\n  background: var(--isl-hover);\n}\n\n/* Tool / turn cards keep their own hierarchy but gain island hairlines. */\nbody[data-islands-ui] .CuF05a_root {\n  border-color: var(--isl-border-soft);\n  background: var(--isl-surface-muted);\n}\n\nbody[data-islands-ui] .CuF05a_root:hover {\n  background: var(--isl-surface-sunken);\n}\n\n/* Header chips and breadcrumbs. */\nbody[data-islands-ui] .kiGsTW_crumb {\n  border-radius: var(--isl-radius-sm);\n}\n\n/* View tabs sit on the island as a quiet segmented row. */\nbody[data-islands-ui] .kiGsTW_viewTabs {\n  gap: 22px;\n}\n\nbody[data-islands-ui] .kiGsTW_tabActive:after {\n  border-radius: 999px;\n  height: 2px;\n}\n\n/* ==========================================================================\n   Header utilities live in the window bar\n   The three trailing controls (session tools, side panel, right panel) leave\n   the conversation island and dock at the bar's right edge, vertically aligned\n   with the workspace toggle on the left.\n   ========================================================================== */\n@media (min-width: 768px) {\n  body[data-islands-ui] .kiGsTW_headerUtilities {\n    position: fixed;\n    top: calc(var(--isl-chrome-top) + 10px);\n    right: 41px; /* frame gap 5 + corner 28 + gap 8 */\n    z-index: 31;\n    height: 28px;\n    margin: 0;\n    align-items: center;\n  }\n\n  body[data-islands-ui] .kiGsTW_headerCorner {\n    position: fixed;\n    top: calc(var(--isl-chrome-top) + 10px);\n    right: var(--isl-gap);\n    z-index: 31;\n    height: 28px;\n    margin: 0;\n    align-items: center;\n  }\n}\n\n/* ==========================================================================\n   Always-visible right sidebar toggle\n   The native header button unmounts while the panel is open and the panel\n   carries its own collapse control. The top bar owns one persistent toggle\n   instead, and closes through the native collapse action. It applies at every\n   width: the narrow top bar keeps the same control.\n   ========================================================================== */\nbody[data-islands-ui] .isl-rightToggle {\n  position: fixed;\n  top: calc(var(--isl-chrome-top) + 10px);\n  right: var(--isl-gap);\n  z-index: 32;\n  box-sizing: border-box;\n  display: grid;\n  place-items: center;\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  border: 0;\n  border-radius: var(--isl-radius-sm);\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  pointer-events: auto;\n  -webkit-app-region: no-drag;\n}\n\nbody[data-islands-ui] .isl-rightToggle:hover,\nbody[data-islands-ui] .isl-rightToggle[aria-pressed='true'] {\n  background: var(--isl-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] .isl-rightToggle:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: -2px;\n}\n\n/* The top bar owns open and close; the island's own expand/collapse\n   controls would duplicate it. */\nbody[data-islands-ui] [data-sidebar-right-expand] {\n  /* Keep the native expand button's box in the layout even though the top\n     bar's toggle paints over it. Other header plugins anchor to this\n     button's rect (dsh-better-sidebar's blank-session dock fallback does),\n     and `display: none` collapses that rect to 0x0, sending them to the\n     top-left corner where they collide with the workspace toggle. */\n  visibility: hidden !important;\n  pointer-events: none !important;\n}\n\nbody[data-islands-ui] [data-sidebar-right-toggle],\n/* dsh-sidenote's own \"侧边\" header entry is covered by the toggle above. */\nbody[data-islands-ui] ._5KEEsG_headerSide {\n  display: none !important;\n}\n\n/* ---- 40-settings.css ---- */\n/* ==========================================================================\n   Islands UI · 40 settings (and shared dialog surfaces)\n   The settings window is an island; its navigation is a recessed island.\n   ========================================================================== */\n\nbody[data-islands-ui] ._77Pn0W_overlay {\n  background: transparent;\n}\n\nbody[data-islands-ui] ._77Pn0W_mask {\n  background: var(--dsw-alias-bg-mask-1);\n  backdrop-filter: var(--dsw-mask-blur);\n}\n\nbody[data-islands-ui] ._77Pn0W_panel {\n  width: 860px;\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n  border-radius: 24px;\n  box-shadow: var(--isl-shadow-float);\n  padding: 10px;\n  gap: 8px;\n  grid-template-columns: 188px minmax(0, 1fr);\n}\n\nbody[data-islands-ui] ._77Pn0W_navTitle {\n  padding: 8px 8px 6px;\n  font-size: 15px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n}\n\n/* The navigation mirrors the workspace list: no recessed panel, quiet rows. */\nbody[data-islands-ui] ._77Pn0W_nav {\n  padding: 4px;\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n}\n\nbody[data-islands-ui] ._77Pn0W_navList {\n  gap: 2px;\n}\n\nbody[data-islands-ui] ._77Pn0W_navCell {\n  height: 32px;\n  padding: 6px 8px;\n  border-radius: var(--isl-radius-sm);\n  color: var(--dsw-alias-label-secondary);\n  font-size: 13px;\n  line-height: 18px;\n  gap: 8px;\n}\n\nbody[data-islands-ui] ._77Pn0W_navCell:hover {\n  background: var(--isl-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] ._77Pn0W_navCell._77Pn0W_active {\n  background: var(--isl-active);\n  color: var(--dsw-alias-label-primary);\n  font-weight: 500;\n  box-shadow: none;\n}\n\nbody[data-islands-ui] ._77Pn0W_navIcon {\n  width: 16px;\n  height: 16px;\n}\n\nbody[data-islands-ui] ._77Pn0W_navIcon svg {\n  width: 100%;\n  height: 100%;\n}\n\nbody[data-islands-ui] ._77Pn0W_header {\n  height: 48px;\n  padding: 6px 6px 0 8px;\n}\n\nbody[data-islands-ui] ._77Pn0W_options {\n  padding: 0 8px 16px;\n  background: transparent;\n}\n\nbody[data-islands-ui] ._77Pn0W_close {\n  border-radius: var(--isl-radius-sm);\n}\n\n/* Cards stay white; separation comes from hairlines, not fills. */\nbody[data-islands-ui] ._77Pn0W_options [class*='_card'] {\n  border-radius: var(--isl-radius-lg);\n  background: var(--isl-surface);\n  border-color: var(--isl-border-soft);\n}\n\nbody[data-islands-ui] ._77Pn0W_options [class*='_section'] {\n  border-radius: var(--isl-radius-md);\n  background: transparent;\n}\n\n/* The general-page rows keep their separators but at island quietness. */\nbody[data-islands-ui] [data-slot='settings.general.item'] > * {\n  border-bottom-color: var(--isl-border-soft);\n}\n\nbody[data-islands-ui] [data-slot='settings.general.item']:last-child > * {\n  border-bottom: 0;\n}\n\n/* Dialogs opened from settings (confirmations, pickers). */\nbody[data-islands-ui] [role='dialog'] {\n  border-radius: var(--isl-radius-xl);\n}\n\n/* Account page hero cards. */\nbody[data-islands-ui] .XGmX4q_card {\n  border-radius: var(--isl-radius-lg);\n  background: var(--isl-surface);\n  border: 1px solid var(--isl-border-soft);\n}\n\nbody[data-islands-ui] ._7lc4_a_balanceCard {\n  border-radius: var(--isl-radius-lg);\n  border: 1px solid var(--isl-border-soft);\n  background: var(--isl-surface);\n}\n\n/* ---- 45-model-picker.css ---- */\n/* ==========================================================================\n   Islands UI · 45 composer model picker\n   Trigger chip + model list + reasoning slider, in the Islands language.\n   ========================================================================== */\n\nbody[data-islands-ui] .isl-model {\n  position: relative;\n  min-width: 0;\n}\n\nbody[data-islands-ui] .isl-modelTrigger {\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  max-width: 260px;\n  height: 28px;\n  padding: 0 8px;\n  border: 1px solid transparent;\n  border-radius: 999px;\n  background: var(--isl-surface-muted);\n  color: var(--dsw-alias-label-primary);\n  font-size: 13px;\n  line-height: 20px;\n  cursor: pointer;\n  transition: background-color 0.12s var(--ds-ease-in-out);\n}\n\nbody[data-islands-ui] .isl-modelTrigger:hover:not(:disabled) {\n  background: var(--isl-surface-sunken);\n}\n\nbody[data-islands-ui] .isl-modelTrigger:disabled {\n  opacity: 0.55;\n  cursor: default;\n}\n\nbody[data-islands-ui] .isl-modelTrigger:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: 1px;\n}\n\nbody[data-islands-ui] .isl-modelIcon {\n  display: var(--dsh-composer-model-icon-display, none);\n  flex: none;\n  color: var(--dsw-alias-label-secondary);\n}\n\nbody[data-islands-ui] .isl-modelName {\n  display: var(--dsh-composer-model-text-display, inline);\n  min-width: 0;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\nbody[data-islands-ui] .isl-modelEffort {\n  display: var(--dsh-composer-model-text-display, inline);\n  flex-shrink: 1000;\n  min-width: 0;\n  color: var(--dsw-alias-label-caption);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\nbody[data-islands-ui] .isl-modelChevron {\n  display: inline-flex;\n  flex: none;\n  color: var(--dsw-alias-label-caption);\n  transition: transform 0.12s var(--ds-ease-in-out);\n}\n\nbody[data-islands-ui] .isl-modelChevron.is-open {\n  transform: rotate(180deg);\n}\n\n/* ---- Menu ---------------------------------------------------------------- */\nbody[data-islands-ui] .isl-modelMenu {\n  position: fixed;\n  z-index: 1100;\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  max-height: min(460px, calc(100vh - 24px));\n  padding: 6px;\n  border: 1px solid var(--isl-border-soft);\n  border-radius: var(--isl-radius-lg);\n  background: var(--isl-surface);\n  box-shadow: var(--isl-shadow-float);\n  color: var(--dsw-alias-label-primary);\n  font-size: 13px;\n  line-height: 20px;\n  overflow-y: auto;\n  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);\n  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);\n}\n\nbody[data-islands-ui] .isl-modelPaneHead {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  padding: 0 4px 6px;\n}\n\nbody[data-islands-ui] .isl-modelMenuTitle {\n  padding: 2px 4px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\nbody[data-islands-ui] .isl-modelBack {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 24px;\n  height: 24px;\n  padding: 0;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n}\n\nbody[data-islands-ui] .isl-modelBack:hover {\n  background: var(--isl-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] .isl-modelBackIcon {\n  display: inline-flex;\n  transform: rotate(90deg);\n}\n\nbody[data-islands-ui] .isl-modelGroups {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\nbody[data-islands-ui] .isl-modelGroup + .isl-modelGroup {\n  margin-top: 6px;\n}\n\nbody[data-islands-ui] .isl-modelGroupName {\n  padding: 6px 8px 2px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11px;\n  line-height: 16px;\n}\n\nbody[data-islands-ui] .isl-modelOption {\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n  min-height: 34px;\n  padding: 6px 8px;\n  border: 0;\n  border-radius: var(--isl-radius-md);\n  background: transparent;\n  color: inherit;\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n\nbody[data-islands-ui] .isl-modelOption:hover {\n  background: var(--isl-hover);\n}\n\nbody[data-islands-ui] .isl-modelOption.is-selected {\n  background: var(--isl-surface-muted);\n}\n\nbody[data-islands-ui] .isl-modelOptionName {\n  flex: 1;\n  min-width: 0;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\nbody[data-islands-ui] .isl-modelCheck {\n  display: inline-flex;\n  flex: none;\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] .isl-modelEmpty {\n  padding: 10px 8px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n}\n\n/* ---- Reasoning effort ---------------------------------------------------- */\nbody[data-islands-ui] .isl-effortPopup {\n  position: relative;\n  padding: 9px 10px 8px;\n  text-align: center;\n}\n\nbody[data-islands-ui] .isl-effortReset {\n  position: absolute;\n  top: 5px;\n  right: 5px;\n  display: grid;\n  place-items: center;\n  width: 24px;\n  height: 24px;\n  padding: 0;\n  border: 0;\n  border-radius: 50%;\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  cursor: pointer;\n}\n\nbody[data-islands-ui] .isl-effortReset:hover:not(:disabled) {\n  background: var(--isl-hover);\n  color: var(--dsw-alias-label-primary);\n}\n\nbody[data-islands-ui] .isl-effortReset:disabled {\n  opacity: 0.4;\n  cursor: default;\n}\n\nbody[data-islands-ui] .isl-effortName {\n  color: var(--dsw-alias-state-business-primary);\n  font-size: 18px;\n  line-height: 24px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n}\n\nbody[data-islands-ui] .isl-effortModel {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  max-width: 100%;\n  margin-top: 1px;\n  padding: 1px 6px;\n  border: 0;\n  border-radius: var(--isl-radius-sm);\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 13px;\n  line-height: 18px;\n  cursor: pointer;\n}\n\nbody[data-islands-ui] .isl-effortModel:hover {\n  background: var(--isl-hover);\n  color: var(--dsw-alias-label-secondary);\n}\n\nbody[data-islands-ui] .isl-effortModelName {\n  min-width: 0;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\nbody[data-islands-ui] .isl-effortModelChevron {\n  display: inline-flex;\n  flex: none;\n  color: inherit;\n  transform: rotate(-90deg);\n}\n\nbody[data-islands-ui] .isl-effortSliderWrap {\n  position: relative;\n  margin: 7px 2px 0;\n}\n\nbody[data-islands-ui] .isl-effortSlider {\n  -webkit-appearance: none;\n  appearance: none;\n  display: block;\n  width: 100%;\n  height: 24px;\n  margin: 0;\n  padding: 0;\n  background: transparent;\n  cursor: pointer;\n}\n\nbody[data-islands-ui] .isl-effortSlider::-webkit-slider-runnable-track {\n  height: 20px;\n  border-radius: 999px;\n  background: linear-gradient(\n    90deg,\n    var(--dsw-alias-state-business-primary) 0\n      calc(12px + (100% - 24px) * var(--isl-ratio, 0)),\n    var(--isl-surface-sunken) calc(12px + (100% - 24px) * var(--isl-ratio, 0)) 100%\n  );\n}\n\nbody[data-islands-ui] .isl-effortSlider::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  appearance: none;\n  box-sizing: border-box;\n  width: 24px;\n  height: 24px;\n  margin-top: -2px;\n  border: 0;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow:\n    0 1px 4px rgba(17, 24, 39, 0.22),\n    0 0 0 0.5px rgba(17, 24, 39, 0.06);\n}\n\nbody[data-islands-ui] .isl-effortSlider:focus-visible {\n  outline: none;\n}\n\nbody[data-islands-ui] .isl-effortSlider:focus-visible::-webkit-slider-thumb {\n  box-shadow:\n    0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary) 26%, transparent),\n    0 1px 4px rgba(17, 24, 39, 0.22);\n}\n\nbody[data-islands-ui] .isl-effortDots {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0 12px;\n  pointer-events: none;\n}\n\nbody[data-islands-ui] .isl-effortDot {\n  width: 4px;\n  height: 4px;\n  border-radius: 50%;\n  background: var(--isl-border-strong);\n}\n\nbody[data-islands-ui] .isl-effortDot.is-filled {\n  background: rgba(255, 255, 255, 0.55);\n}\n\nbody[data-islands-ui] .isl-modelError {\n  margin: 8px 8px 2px;\n  padding: 6px 8px;\n  border-radius: var(--isl-radius-sm);\n  background: var(--dsw-alias-interactive-bg-hover-danger);\n  color: var(--dsw-alias-state-error-primary);\n  font-size: 11px;\n  line-height: 16px;\n}\n\n/* ---- 50-components.css ---- */\n/* ==========================================================================\n   Islands UI · 50 shared components\n   Small, reusable pieces used by the skin's own surfaces. All values come from\n   the token layer, so nothing here is page-specific.\n   ========================================================================== */\n\n/* ---- Preference row (rendered into settings.general.item) ---------------- */\nbody[data-islands-ui] .isl-prefRow,\n.isl-prefRow {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 24px;\n  padding: 16px 0;\n  border-bottom: 0.5px solid var(--dsw-alias-border-l2);\n  color: var(--dsw-alias-label-primary);\n  font-size: 14px;\n  line-height: 20px;\n}\n\nbody[data-islands-ui] .isl-prefRow:last-child,\n.isl-prefRow:last-child {\n  border-bottom: 0;\n}\n\n.isl-prefText {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  min-width: 0;\n}\n\n.isl-prefTitle {\n  color: var(--dsw-alias-label-primary);\n  font-size: 14px;\n  line-height: 20px;\n}\n\n.isl-prefDesc {\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n/* ---- Switch -------------------------------------------------------------- */\n.isl-switch {\n  position: relative;\n  flex: none;\n  width: 38px;\n  height: 22px;\n  padding: 0;\n  border: 0;\n  border-radius: 999px;\n  cursor: pointer;\n  background: var(--dsw-alias-bg-layer-3);\n  box-shadow: inset 0 0 0 1px var(--dsw-alias-border-l2);\n  transition: background-color 0.15s var(--ds-ease-in-out);\n}\n\n.isl-switch[aria-checked='true'] {\n  background: var(--dsw-alias-state-business-primary);\n  box-shadow: none;\n}\n\n.isl-switch:focus-visible {\n  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));\n  outline-offset: 2px;\n}\n\n.isl-switchThumb {\n  position: absolute;\n  top: 3px;\n  left: 3px;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow: 0 1px 2px rgba(17, 24, 39, 0.25);\n  transition: transform 0.15s var(--ds-ease-in-out);\n}\n\n.isl-switch[aria-checked='true'] .isl-switchThumb {\n  transform: translateX(16px);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .isl-switch,\n  .isl-switchThumb {\n    transition: none;\n  }\n}\n\n/* ---- Popover / menu materials ------------------------------------------- */\nbody[data-islands-ui] [data-menu-material] {\n  border-radius: var(--isl-radius-lg);\n  border: 1px solid var(--isl-border-soft);\n  box-shadow: var(--isl-shadow-float);\n}\n\nbody[data-islands-ui] [role='dialog'],\nbody[data-islands-ui] [role='menu'],\nbody[data-islands-ui] [role='listbox'] {\n  border-radius: var(--isl-radius-lg);\n}\n\n/* ---- Scrollbars ---------------------------------------------------------- */\nbody[data-islands-ui] ::-webkit-scrollbar-thumb {\n  border-radius: 999px;\n}\n\n/* ---- Focus --------------------------------------------------------------- */\nbody[data-islands-ui] :focus-visible {\n  outline-offset: 1px;\n}\n\n/* ---- Dedicated settings page ------------------------------------------- */\n.isl-settingsPage {\n  box-sizing: border-box;\n  max-width: 760px;\n  padding: 4px 8px 24px;\n}\n\n.isl-settingsPageHead {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n\n.isl-settingsPageLogo {\n  display: inline-flex;\n  flex: none;\n}\n\n.isl-settingsPageHeadText {\n  min-width: 0;\n}\n\n.isl-settingsPageTitle {\n  color: var(--dsw-alias-label-primary);\n  font-size: 15px;\n  font-weight: 600;\n  line-height: 22px;\n}\n\n.isl-settingsPageDesc {\n  margin-top: 4px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.isl-settingsPage .isl-prefRow:first-of-type {\n  margin-top: 12px;\n}\n\n.isl-accentPicker {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\n.isl-accentSwatch {\n  box-sizing: border-box;\n  width: 24px;\n  height: 24px;\n  padding: 0;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 50%;\n  background-clip: padding-box;\n  cursor: pointer;\n  transition:\n    transform 0.12s var(--ds-ease-in-out),\n    box-shadow 0.12s var(--ds-ease-in-out);\n}\n\n.isl-accentSwatch:hover {\n  transform: scale(1.08);\n}\n\n.isl-accentSwatch.is-selected {\n  box-shadow:\n    0 0 0 2px var(--dsw-alias-bg-base),\n    0 0 0 3.5px var(--dsw-alias-label-primary);\n}\n\n.isl-accentSwatch.is-default {\n  background: linear-gradient(135deg, #ffffff 0 47%, #c4c8ce 47% 53%, #1b1c1f 53% 100%);\n}\n\n.isl-accentCustom {\n  position: relative;\n  display: grid;\n  place-items: center;\n  width: 24px;\n  height: 24px;\n  border: 1px dashed var(--dsw-alias-border-l3);\n  border-radius: 50%;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n}\n\n.isl-accentCustom::before {\n  content: '+';\n  font-size: 14px;\n  line-height: 1;\n}\n\n.isl-accentCustom input {\n  position: absolute;\n  inset: -4px;\n  width: 32px;\n  height: 32px;\n  opacity: 0;\n  cursor: pointer;\n}\n\n\n/* ---- Compatibility notice ------------------------------------------------\n   Rendered while the skin is OFF, so nothing here may rely on the `--isl-*`\n   scale or on `body[data-islands-ui]`. Every custom property carries a\n   fallback and every color comes from the public DSH theme tokens. */\n\n.isl-compatToast {\n  position: fixed;\n  right: 16px;\n  bottom: 16px;\n  z-index: 2000;\n  box-sizing: border-box;\n  display: flex;\n  align-items: flex-start;\n  gap: 6px;\n  width: min(380px, calc(100vw - 32px));\n  padding: 12px 10px 12px 14px;\n  border: 1px solid rgba(224, 160, 24, 0.5);\n  border-left: 3px solid #e0a018;\n  border-radius: var(--isl-radius-lg, 16px);\n  background: var(--dsw-alias-bg-overlay, #ffffff);\n  color: var(--dsw-alias-label-primary, #1f2328);\n  box-shadow: 0 14px 36px -14px rgba(0, 0, 0, 0.35);\n  font-size: 13px;\n  line-height: 19px;\n  cursor: pointer;\n  opacity: 0;\n  transform: translateY(10px);\n  transition:\n    opacity 0.16s ease,\n    transform 0.16s ease;\n}\n\n.isl-compatToast.is-visible {\n  opacity: 1;\n  transform: none;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .isl-compatToast {\n    transition: none;\n  }\n}\n\n.isl-compatToastBody {\n  flex: 1;\n  min-width: 0;\n}\n\n.isl-compatToastTitle {\n  font-weight: 600;\n}\n\n.isl-compatToastText {\n  margin-top: 2px;\n  color: var(--dsw-alias-label-secondary, #555b63);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.isl-compatToastAction {\n  margin-top: 6px;\n  color: #a86b00;\n  font-size: 12px;\n  font-weight: 600;\n}\n\n.isl-compatToastClose {\n  flex: none;\n  width: 22px;\n  height: 22px;\n  padding: 0;\n  border: 0;\n  border-radius: 6px;\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary, #737a82);\n  font-size: 16px;\n  line-height: 1;\n  cursor: pointer;\n}\n\n.isl-compatToastClose:hover {\n  background: var(--dsw-alias-interactive-bg-hover, rgba(17, 24, 39, 0.06));\n  color: var(--dsw-alias-label-primary, #1f2328);\n}\n\n/* The settings-page warning bar. */\n.isl-compatBanner {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  margin: 12px 0 4px;\n  padding: 12px 14px;\n  border: 1px solid rgba(224, 160, 24, 0.45);\n  border-radius: var(--isl-radius-lg, 16px);\n  background: rgba(240, 180, 41, 0.14);\n  background: color-mix(in srgb, #f0b429 14%, transparent);\n  color: var(--dsw-alias-label-primary, #1f2328);\n  font-size: 13px;\n  line-height: 20px;\n}\n\n.isl-compatBannerIcon {\n  flex: none;\n  display: inline-flex;\n  margin-top: 1px;\n  color: #b47400;\n}\n\n.isl-compatBannerText {\n  flex: 1;\n  min-width: 0;\n}\n\n.isl-compatBannerTitle {\n  font-weight: 600;\n}\n\n.isl-compatBannerBody,\n.isl-compatBannerHint {\n  margin-top: 2px;\n  color: var(--dsw-alias-label-secondary, #555b63);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.isl-compatBannerHint {\n  margin-top: 6px;\n}\n\n.isl-compatBannerList {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 4px;\n  margin-top: 6px;\n  color: var(--dsw-alias-label-secondary, #555b63);\n  font-size: 12px;\n}\n\n.isl-compatAnchor {\n  padding: 0 4px;\n  border-radius: 4px;\n  background: rgba(17, 24, 39, 0.06);\n  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;\n  font-size: 11px;\n}\n\n.isl-compatBannerAction {\n  flex: none;\n  align-self: flex-start;\n  padding: 5px 10px;\n  border: 1px solid rgba(224, 160, 24, 0.5);\n  border-radius: 8px;\n  background: transparent;\n  color: #8a5a00;\n  font: inherit;\n  font-size: 12px;\n  cursor: pointer;\n}\n\n.isl-compatBannerAction:hover {\n  background: rgba(240, 180, 41, 0.18);\n}\n\n.isl-compatForced {\n  margin: 8px 0 0;\n  color: var(--dsw-alias-label-tertiary, #737a82);\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.isl-switch:disabled {\n  opacity: 0.45;\n  cursor: not-allowed;\n}\n\n/* The notice renders while the skin is off, so darkness is read straight from\n   the host theme attribute its own stylesheet uses. */\nbody[data-ds-dark-theme] .isl-compatBannerIcon {\n  color: #e8b451;\n}\n\nbody[data-ds-dark-theme] .isl-compatBannerAction {\n  border-color: rgba(240, 180, 41, 0.45);\n  color: #f2c879;\n}\n\nbody[data-ds-dark-theme] .isl-compatBannerAction:hover {\n  background: rgba(240, 180, 41, 0.16);\n}\n\nbody[data-ds-dark-theme] .isl-compatAnchor {\n  background: rgba(255, 255, 255, 0.08);\n}\n\nbody[data-ds-dark-theme] .isl-compatToastAction {\n  color: #f0c274;\n}";

    const ATTRIBUTE = 'data-islands-ui';
    const STORAGE_KEY = 'dsh-islands-ui:enabled';
    const WORKSPACE_ATTR = 'data-islands-workspace-collapsed';
    /** Escape hatch, session scoped so the next launch re-runs the check. */
    const FORCE_KEY = 'dsh-islands-ui:force';
    /**
     * Layout anchors every Islands rule is written against. They do not exist
     * when `apply()` runs (the shell mounts afterwards), so the gate waits for
     * the frame and only then decides whether this build still matches.
     */
    const REQUIRED_ANCHORS = ['.PIRFFq_frame', '.PIRFFq_centerCol'];
    const SIDEBAR_COLUMN = '.PIRFFq_sidebarCol';
    const SIDEBAR_ROOT = '.kB3qhq_root';
    /** No shell content at all after this long: the build is unusable. */
    const COMPAT_TIMEOUT_MS = 6000;
    /** Content mounted but the frame anchor never showed up: rename, not slowness. */
    const COMPAT_CONTENT_GRACE_MS = 1200;
    let animateTimer;
    let skinRegistrar = null;
    let activated = false;
    let compatState = { status: 'checking', missing: [], forced: false };
    const compatListeners = new Set();

    /** Copy for the preference row; the row is the only user-facing string. */
    const COPY = {
      zh: {
        title: 'Islands 界面',
        description: '悬浮岛屿式布局：圆角面板、常驻左侧导航栏与独立的工作区列表。关闭后立即恢复默认外观。',
        topbarToggle: '折叠或展开工作区',
        openRight: '打开侧边栏',
        closeRight: '关闭侧边栏',
        workspace: '工作区',
        pinned: '置顶',
        untitled: '未命名会话',
        locate: '定位到会话',
        unpin: '取消置顶',
        schedules: '自动化任务',
        plugins: '插件',
        settings: '设置',
        more: '更多插件',
        railTitle: '显示在左侧栏',
        noExtras: '暂无其他插件',
        pin: '固定到左侧栏',
        enable: '启用 Islands 界面',
        enableDesc: '关闭后立即恢复 DSH 默认外观，设置会保留。',
        accent: '强调色',
        accentDesc: '用于选中状态、滑块、发送按钮等。',
        accentDefault: '跟随主题',
        accentCustom: '自定义颜色',
        models: '选择模型',
        effort: '推理等级',
        back: '返回',
        noEffort: '该模型没有可调推理等级',
        reset: '恢复默认',
        loading: '加载中…',
        pick: '选择模型',
        empty: '没有可用模型',
        failed: '切换失败',
        compatTitle: 'Islands UI 已自动关闭',
        compatBody: '当前 DSH 构建的界面结构与插件不匹配，皮肤已回退到默认外观，以免出现双栏重叠或控件遮挡。',
        compatView: '查看插件设置',
        compatMissing: '缺失的界面锚点',
        compatBannerTitle: '皮肤已自动停用：界面结构不匹配',
        compatBannerBody:
          'Islands UI 的样式写在当前 DSH 构建的类名和结构上。升级后的 DSH 改掉了这些锚点，浮岛布局、原生导航隐藏和工作区折叠都会失效，因此插件没有启用皮肤，DSH 保持默认外观。',
        compatFix: '处理方式：把 Islands UI 更新到适配当前 DSH 的版本，或回退 DSH。若确认界面正常，可临时强制启用（下次启动会重新检测）。',
        compatForce: '仍然启用',
        compatForced: '已强制启用，本次会话跳过自动检测。',
        compatDismiss: '关闭提示',
      },
      en: {
        title: 'Islands interface',
        description:
          'Floating-island layout with rounded panels, a persistent rail and an islanded workspace list. Turn off to return to the default look immediately.',
        topbarToggle: 'Collapse or expand the workspace',
        openRight: 'Open side panel',
        closeRight: 'Close side panel',
        workspace: 'Workspace',
        pinned: 'Pinned',
        untitled: 'Untitled session',
        locate: 'Reveal in workspace',
        unpin: 'Unpin session',
        schedules: 'Automation',
        plugins: 'Plugins',
        settings: 'Settings',
        more: 'More plugins',
        railTitle: 'Show in the left rail',
        noExtras: 'No other plugins',
        pin: 'Pin to the left rail',
        enable: 'Enable Islands UI',
        enableDesc: 'Turn off to restore the default appearance immediately; your settings are kept.',
        accent: 'Accent color',
        accentDesc: 'Used for selected states, sliders, the send button and more.',
        accentDefault: 'Follow theme',
        accentCustom: 'Custom color',
        models: 'Select model',
        effort: 'Reasoning',
        back: 'Back',
        noEffort: 'This model has no adjustable reasoning level',
        reset: 'Reset to default',
        loading: 'Loading…',
        pick: 'Select model',
        empty: 'No models available',
        failed: 'Selection failed',
        compatTitle: 'Islands UI turned itself off',
        compatBody:
          'This DSH build no longer matches the plugin, so the skin fell back to the default look instead of overlapping panels.',
        compatView: 'Open plugin settings',
        compatMissing: 'Missing interface anchors',
        compatBannerTitle: 'Skin disabled: interface structure changed',
        compatBannerBody:
          'Islands UI styles itself against the class names and structure of the DSH build it ships for. This build changed those anchors, so the island layout, the hidden native navigation and the workspace collapse would all break. The skin therefore stayed off and DSH keeps its default look.',
        compatFix:
          'Update Islands UI to a release that matches this DSH build, or roll DSH back. If the interface looks fine, you can enable it anyway for this session.',
        compatForce: 'Enable anyway',
        compatForced: 'Enabled manually; automatic detection is skipped for this session.',
        compatDismiss: 'Dismiss',
      },
    };

    let localeService;
    let layoutService;
    let slotsService;
    let shortcutsService;
    let uiWorkspaceService;
    let workspacesService;
    let modelDirectories;
    const RAIL_PIN_KEY = 'dsh-islands-ui:rail-pins';
    const ACCENT_KEY = 'dsh-islands-ui:accent';
    const DEFAULT_ACCENT = '#4176e6';
    const ACCENT_PRESETS = ['#4176e6', '#7c5cff', '#1f9d63', '#e07a2e', '#d94f8a', '#d64545'];
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

    function shortcutKeys(id, fallback = '') {
      try {
        const row = shortcutsService?.catalog?.getSnapshot?.().find((value) => value.id === id);
        const keys = row?.keys;
        if (Array.isArray(keys) && keys.length > 0) {
          const mac =
            document.documentElement.getAttribute('data-platform') === 'darwin' ||
            /Mac/i.test(navigator.platform ?? '');
          return keys.join(mac ? '' : '+');
        }
      } catch {
        /* ignore */
      }
      return fallback;
    }

    function withShortcut(label, id, fallback = '') {
      const keys = shortcutKeys(id, fallback);
      return keys === '' ? label : `${label} (${keys})`;
    }

    function useEnabled() {
      return React.useSyncExternalStore(subscribe, getSnapshot);
    }

    function setCompat(next) {
      compatState = next;
      for (const listener of compatListeners) listener();
    }

    function subscribeCompat(listener) {
      compatListeners.add(listener);
      return () => compatListeners.delete(listener);
    }

    function getCompatSnapshot() {
      return compatState;
    }

    function useCompat() {
      return React.useSyncExternalStore(subscribeCompat, getCompatSnapshot);
    }

    function currentCopy() {
      try {
        return String(localeService?.getSnapshot?.().active ?? 'en').toLowerCase().startsWith('zh')
          ? COPY.zh
          : COPY.en;
      } catch {
        return COPY.en;
      }
    }

    function isForced() {
      try {
        return window.sessionStorage.getItem(FORCE_KEY) === '1';
      } catch {
        return false;
      }
    }

    /** Which anchors of the running DSH build are gone. */
    function missingAnchors() {
      const missing = REQUIRED_ANCHORS.filter((selector) => document.querySelector(selector) === null);
      // A sidebar column without its root class means the sidebar was rebuilt
      // under another name; the skin would render a second rail beside it.
      if (document.querySelector(SIDEBAR_COLUMN) !== null && document.querySelector(SIDEBAR_ROOT) === null) {
        missing.push(SIDEBAR_ROOT);
      }
      return missing;
    }

    function readAccent() {
      try {
        const stored = window.localStorage.getItem(ACCENT_KEY);
        return stored !== null && /^#[0-9a-f]{6}$/iu.test(stored) ? stored : null;
      } catch {
        return null;
      }
    }

    function applyAccent(color) {
      const body = document.body;
      if (body === null) return;
      if (color === null) {
        body.removeAttribute('data-islands-accent');
        body.style.removeProperty('--isl-accent');
      } else {
        body.setAttribute('data-islands-accent', '');
        body.style.setProperty('--isl-accent', color);
      }
    }

    function storeAccent(color) {
      try {
        if (color === null) window.localStorage.removeItem(ACCENT_KEY);
        else window.localStorage.setItem(ACCENT_KEY, color);
      } catch {
        /* private mode: keep the session choice. */
      }
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

    function readRailPins() {
      try {
        const raw = window.localStorage.getItem(RAIL_PIN_KEY);
        const parsed = raw === null ? [] : JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
      } catch {
        return [];
      }
    }

    function writeRailPins(pins) {
      try {
        window.localStorage.setItem(RAIL_PIN_KEY, JSON.stringify(pins));
      } catch {
        /* private mode: keep the session pins only. */
      }
    }

    function HouseGlyph() {
      return h('svg', { width: 18, height: 18, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'M3 8.6 10 3l7 5.6V16a1 1 0 0 1-1 1h-4v-4.5H8V17H4a1 1 0 0 1-1-1V8.6Z', stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round' }));
    }

    function ClockGlyph() {
      return h('svg', { width: 18, height: 18, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': true },
        h('circle', { cx: 10, cy: 10, r: 7, stroke: 'currentColor', strokeWidth: 1.5 }),
        h('path', { d: 'M10 6.2V10l2.6 1.6', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' }));
    }

    function PluginsGlyph() {
      return h('svg', { width: 18, height: 18, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': true },
        h('rect', { x: 3, y: 3, width: 6, height: 6, rx: 1.6, stroke: 'currentColor', strokeWidth: 1.4 }),
        h('rect', { x: 11, y: 3, width: 6, height: 6, rx: 1.6, stroke: 'currentColor', strokeWidth: 1.4 }),
        h('rect', { x: 3, y: 11, width: 6, height: 6, rx: 1.6, stroke: 'currentColor', strokeWidth: 1.4 }),
        h('path', { d: 'M14 11v6M11 14h6', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }));
    }

    function PlugGlyph() {
      return h('svg', { width: 17, height: 17, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'M7 3v4M13 3v4M5 7h10v3a5 5 0 0 1-10 0V7ZM10 15v3', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }));
    }

    function EllipsisGlyph() {
      return h('svg', { width: 18, height: 18, viewBox: '0 0 20 20', fill: 'currentColor', 'aria-hidden': true },
        h('circle', { cx: 5, cy: 10, r: 1.4 }),
        h('circle', { cx: 10, cy: 10, r: 1.4 }),
        h('circle', { cx: 15, cy: 10, r: 1.4 }));
    }

    function GearGlyph() {
      return h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true },
        h('circle', { cx: 12, cy: 12, r: 3, stroke: 'currentColor', strokeWidth: 1.6 }),
        h('path', {
          d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      );
    }

    /**
     * Best effort selection of one settings section once the dialog is up. The
     * settings navigation has no service of its own, so the row is matched by
     * its label inside the dialog and simply skipped when it is not there.
     */
    function revealSettingsSection(label) {
      if (typeof label !== 'string' || label === '') return;
      let attempts = 0;
      const tick = () => {
        attempts += 1;
        const scope = document.querySelector('[role="dialog"]') ?? document;
        const cells = [
          ...scope.querySelectorAll('button, a, [role="tab"], [role="option"], [class*="navCell"]'),
        ];
        const target = cells.find((cell) => (cell.textContent ?? '').trim() === label);
        if (target instanceof HTMLElement) {
          target.click();
          return;
        }
        if (attempts < 12) window.setTimeout(tick, 120);
      };
      window.setTimeout(tick, 140);
    }

    function openSettings(options) {
      const section = options?.section;
      // The account launcher owns the Settings row; clicking that row is the
      // reliable path on desktop (configurable shortcuts go through the native
      // keyboard bridge, so a synthetic keydown never reaches them).
      const trigger = document.querySelector('.kB3qhq_footArea button[aria-haspopup="menu"]');
      if (trigger instanceof HTMLElement) {
        trigger.click();
        window.setTimeout(() => {
          const item = [
            ...document.querySelectorAll('[role="menu"] [role="menuitem"], [role="menu"] [role="menuitemradio"], [role="menu"] button, [role="menu"] a'),
          ].find((element) => /设置|Settings|偏好|Preferences/i.test(element.textContent ?? ''));
          if (item instanceof HTMLElement) item.click();
          revealSettingsSection(section);
        }, 60);
        return;
      }
      try {
        const row = (shortcutsService?.catalog?.getSnapshot?.() ?? []).find(
          (value) => value.id === 'settings.open' && value.binding !== null && value.binding !== undefined,
        );
        if (row?.binding !== undefined) {
          const modifiers = new Set(row.binding.modifiers ?? []);
          window.dispatchEvent(
            new KeyboardEvent('keydown', {
              code: row.binding.code,
              key: ',',
              metaKey: modifiers.has('meta'),
              ctrlKey: modifiers.has('control'),
              altKey: modifiers.has('alt'),
              shiftKey: modifiers.has('shift'),
              bubbles: true,
              cancelable: true,
            }),
          );
        }
      } catch {
        /* ignore */
      }
      revealSettingsSection(section);
    }

    function LocateGlyph() {
      return h('svg', { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('circle', { cx: 8, cy: 8, r: 4, stroke: 'currentColor', strokeWidth: 1.3 }),
        h('path', { d: 'M8 1.5v2.2M8 12.3v2.2M1.5 8h2.2M12.3 8h2.2', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round' }));
    }

    function defaultPinIcon() {
      try {
        const entries = slotsService?.entriesOfSlot?.('contextMenu.icon') ?? [];
        const entry =
          entries.find((value) => value.options?.key === 'workspace.unpin') ??
          entries.find((value) => value.options?.key === 'workspace.pin');
        if (entry?.component !== undefined) return h(entry.component, { size: 14 });
      } catch {
        /* fall back to the local glyph */
      }
      return h(PinGlyph);
    }

    function revealPinnedSession(sessionId, title) {
      const projectRows = () => [...document.querySelectorAll('.JoiKIa_projectRow')];
      const stateOf = (row) =>
        row.getAttribute('aria-expanded') ??
        row.querySelector('[aria-expanded]')?.getAttribute('aria-expanded');
      const expanded = (row) => stateOf(row) === 'true';
      const toggle = (row) => {
        const chevron = row.querySelector('.JoiKIa_chevron');
        if (chevron instanceof HTMLElement) chevron.click();
        else row.click();
      };

      // Expand every workspace briefly so the target session exists in the DOM.
      for (const row of projectRows()) {
        if (!expanded(row)) toggle(row);
      }

      window.setTimeout(() => {
        const candidates = [...document.querySelectorAll('.JoiKIa_sessionRow')].filter((row) =>
          (row.textContent ?? '').includes(title),
        );
        if (candidates.length === 0) return;
        const row = candidates[0];

        // The owner is the nearest preceding Workspace row; nested ancestors stay open.
        let owner = null;
        for (const project of projectRows()) {
          if ((project.compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0) owner = project;
        }

        for (const project of projectRows()) {
          const keep = project === owner || project.contains(owner);
          if (keep) {
            if (!expanded(project)) toggle(project);
          } else if (expanded(project)) {
            toggle(project);
          }
        }

        window.setTimeout(() => {
          row.scrollIntoView({ block: 'center', behavior: 'smooth' });
          if (!row.hasAttribute('tabindex')) row.setAttribute('tabindex', '-1');
          row.focus({ preventScroll: true });
          row.classList.add('isl-located');
          window.setTimeout(() => row.classList.remove('isl-located'), 1400);
        }, 140);
      }, 180);
    }

    function PinGlyph() {
      return h('svg', { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'M6 2v4L4 8v1.5h3.2V14l.8 1 .8-1V9.5H12V8l-2-2V2', stroke: 'currentColor', strokeWidth: 1.3, strokeLinejoin: 'round' }));
    }

    /**
     * Left rail: workspace home, automation, plugins, user-pinned plugins and
     * a context menu for the rest.
     */
    function IslandsRail({ usePanelInfo }) {
      const active = usePanelInfo((info) => info.activePanelId ?? null);
      const [pins, setPins] = React.useState(readRailPins);
      const [open, setOpen] = React.useState(false);
      const [position, setPosition] = React.useState(null);
      const railRef = React.useRef(null);
      const menuRef = React.useRef(null);
      const lang = useLocale() ?? 'en';
      const copy = String(lang).toLowerCase().startsWith('zh') ? COPY.zh : COPY.en;

      const allEntries = (() => {
        try {
          return (slotsService?.entriesOfSlot('sidebar.panellist') ?? []).map((entry) => ({
            id: entry.options.id,
            order: entry.options.order ?? 0,
            label: typeof entry.options.label === 'function' ? entry.options.label() : entry.options.label,
            registrant: entry.registrant,
            component: entry.component,
          }));
        } catch {
          return [];
        }
      })();

      const byId = new Map(allEntries.map((entry) => [entry.id, entry]));
      const entries = allEntries.filter((entry) => entry.id !== 'plugins' && entry.id !== 'schedules');
      const pinned = pins.filter((id) => entries.some((entry) => entry.id === id));

      const iconFor = (id, size) => {
        const entry = byId.get(id);
        if (entry?.component !== undefined) {
          try {
            return h(entry.component, { size, active: active === id });
          } catch {
            /* fall back to the generic glyph */
          }
        }
        if (id === 'schedules') return h(ClockGlyph);
        if (id === 'plugins') return h(PluginsGlyph);
        return h(PlugGlyph);
      };

      React.useEffect(() => {
        if (!open) return;
        const onDown = (event) => {
          if (railRef.current?.contains(event.target) === true) return;
          if (menuRef.current?.contains(event.target) === true) return;
          setOpen(false);
        };
        const onKey = (event) => {
          if (event.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onDown, true);
        document.addEventListener('keydown', onKey, true);
        return () => {
          document.removeEventListener('mousedown', onDown, true);
          document.removeEventListener('keydown', onKey, true);
        };
      }, [open]);

      const openMenu = (anchor) => {
        const rect = (anchor ?? railRef.current)?.getBoundingClientRect();
        if (!rect) return;
        setPosition({ left: rect.right + 8, top: Math.min(rect.top, window.innerHeight - 260) });
        setOpen(true);
      };

      const togglePin = (id) => {
        const next = pins.includes(id) ? pins.filter((value) => value !== id) : [...pins, id];
        setPins(next);
        writeRailPins(next);
      };

      const select = (id) => {
        // The home button is the workspace drawer's opener in the narrow
        // layout; on desktop it returns to the conversation as before.
        if (id === null) {
          const frame = document.querySelector('.PIRFFq_frame');
          if (frame !== null && frame.hasAttribute('data-sidebar-drawer')) {
            layoutService?.toggleSidebar();
            return;
          }
        }
        layoutService?.selectPanel(id);
      };

      const button = (id, label, glyph, extraClass) =>
        h(
          'button',
          {
            type: 'button',
            className: 'isl-railBtn' + (active === id ? ' is-active' : '') + (extraClass ? ` ${extraClass}` : ''),
            title: label,
            'aria-label': label,
            'aria-pressed': active === id,
            'data-rail-id': id ?? 'workspace',
            onClick: () => select(id),
          },
          glyph,
        );

      const menu = open && position !== null
        ? ReactDOM.createPortal(
            h(
              'div',
              {
                ref: menuRef,
                className: 'isl-railMenu',
                role: 'menu',
                style: { left: position.left, top: position.top },
              },
              h('div', { className: 'isl-railMenuTitle' }, copy.railTitle),
              entries.length === 0
                ? h('div', { className: 'isl-railEmpty' }, copy.noExtras)
                : entries.map((entry) =>
                    h(
                      'button',
                      {
                        type: 'button',
                        key: entry.id,
                        className: 'isl-railMenuRow',
                        role: 'menuitemcheckbox',
                        'aria-checked': pins.includes(entry.id),
                        onClick: () => togglePin(entry.id),
                      },
                      h('span', { className: 'isl-railMenuIcon' }, iconFor(entry.id, 16)),
                      h(
                        'span',
                        { className: 'isl-railMenuText' },
                        h('span', { className: 'isl-railMenuLabel' }, entry.label ?? entry.id),
                        entry.registrant === undefined
                          ? null
                          : h('span', { className: 'isl-railMenuSub' }, entry.registrant),
                      ),
                      h(
                        'span',
                        {
                          className: 'isl-railMenuPin' + (pins.includes(entry.id) ? ' is-pinned' : ''),
                          title: copy.pin,
                        },
                        h(PinGlyph),
                      ),
                    ),
                  ),
            ),
            document.body,
          )
        : null;

      return h(
        'nav',
        {
          ref: railRef,
          className: 'isl-rail',
          'aria-label': copy.workspace,
          onContextMenu: (event) => {
            event.preventDefault();
            openMenu(event.currentTarget);
          },
        },
        button(null, copy.workspace, h(HouseGlyph)),
        button('schedules', copy.schedules, iconFor('schedules', 18)),
        button('plugins', copy.plugins, iconFor('plugins', 18)),
        pinned.map((id) => {
          const entry = entries.find((value) => value.id === id);
          const label = entry?.registrant === undefined ? entry?.label ?? id : `${entry?.label ?? id} · ${entry.registrant}`;
          return button(id, label, iconFor(id, 18));
        }),
        h('div', { className: 'isl-railDivider', 'aria-hidden': true }),
        h(
          'button',
          {
            type: 'button',
            className: 'isl-railBtn is-more' + (open ? ' is-active' : ''),
            title: copy.more,
            'aria-label': copy.more,
            'aria-haspopup': 'menu',
            'aria-expanded': open,
            onClick: (event) => {
              if (open) setOpen(false);
              else openMenu(event.currentTarget);
            },
          },
          h(EllipsisGlyph),
        ),
        menu,
      );
    }

    function IslandsRailSettings() {
      const lang = useLocale() ?? 'en';
      const copy = String(lang).toLowerCase().startsWith('zh') ? COPY.zh : COPY.en;
      return h(
        'button',
        {
          type: 'button',
          className: 'isl-railBtn isl-railSettings',
          title: withShortcut(copy.settings, 'settings.open'),
          'aria-label': withShortcut(copy.settings, 'settings.open'),
          onClick: openSettings,
        },
        h(GearGlyph),
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
        const onOpen = () => openMenu();
        window.addEventListener('islands:model-open', onOpen);
        return () => window.removeEventListener('islands:model-open', onOpen);
      }, [openMenu]);

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
          title: withShortcut(
            effortName === undefined ? modelName : `${modelName} · ${effortName}`,
            'islands.model.open',
            /Mac/i.test(navigator.platform ?? '') ? '⌘⇧M' : 'Ctrl+Shift+M',
          ),
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
        // The pane can mount already open (restored layout), in which case no
        // attribute mutation for its open state is ever observed. Watch for
        // insertion too, not only later attribute flips.
        observer.observe(document.getElementById('root') ?? document.body, {
          subtree: true,
          childList: true,
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
          'aria-label': withShortcut(label, 'sidebar.right.toggle'),
          title: withShortcut(label, 'sidebar.right.toggle'),
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
      if (frame !== null && frame.hasAttribute('data-sidebar-drawer')) {
        // Narrow layout: the workspace is a drawer, owned by DSH's native
        // narrow expansion state. The rail's home button and the shortcut both
        // open/close it here.
        layoutService?.toggleSidebar();
        return;
      }
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
            'aria-label': withShortcut(copy.topbarToggle, 'sidebar.left.toggle'),
            title: withShortcut(copy.topbarToggle, 'sidebar.left.toggle'),
            onClick: () => toggleWorkspace(),
          },
          h(PanelGlyph),
        ),
        h('div', { className: 'isl-topbarDrag', 'aria-hidden': true }),
        h(RightPanelToggle),
      );
    }

    function IslandsLogo({ size = 30 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 64 64', fill: 'none', 'aria-hidden': true },
        h('rect', { width: 64, height: 64, rx: 16, fill: '#0f1115' }),
        h('rect', { x: 10, y: 10, width: 44, height: 44, rx: 11, fill: '#22252b' }),
        h('rect', { x: 16, y: 16, width: 14, height: 32, rx: 6, fill: '#4176e6' }),
        h('rect', { x: 34, y: 16, width: 14, height: 14, rx: 6, fill: '#f5f7fa' }),
        h('rect', { x: 34, y: 34, width: 14, height: 14, rx: 6, fill: '#7aaaff' }),
      );
    }

    /** One pinned row: hover reveals unpin + locate, and a clipped title marquees. */
    function PinnedRow({ session, copy, pinIcon }) {
      const titleRef = React.useRef(null);
      const frameRef = React.useRef(0);
      const revealingRef = React.useRef(false);
      const id = session.id ?? session.sessionId;
      const title = String(session.title ?? '').trim() || copy.untitled;

      React.useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

      const place = (left, range) => {
        const element = titleRef.current;
        if (element === null) return;
        if (typeof element.scrollTo === 'function') element.scrollTo({ left, behavior: 'instant' });
        else element.scrollLeft = left;
        if (left > 0) element.dataset.scrolled = '';
        else delete element.dataset.scrolled;
        if (left < range) element.dataset.clipped = '';
        else delete element.dataset.clipped;
      };

      const enter = (event) => {
        if (event?.pointerType === 'touch') return;
        if (titleRef.current === null || revealingRef.current) return;
        revealingRef.current = true;
        cancelAnimationFrame(frameRef.current);
        // Measure after hover has laid out the two action buttons; otherwise
        // the title still has its resting width and the marquee never starts.
        frameRef.current = requestAnimationFrame(() => {
          const element = titleRef.current;
          if (element === null) return;
          const range = element.scrollWidth - element.clientWidth;
          if (range <= 8) return;
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            place(range, range);
            return;
          }
          let previous;
          let position = 0;
          const step = (now) => {
            position += previous === undefined ? 0 : (now - previous) * 0.03;
            previous = now;
            place(Math.min(position, range), range);
            if (position < range) frameRef.current = requestAnimationFrame(step);
          };
          frameRef.current = requestAnimationFrame(step);
        });
      };

      const leave = () => {
        revealingRef.current = false;
        cancelAnimationFrame(frameRef.current);
        place(0, 0);
      };

      return h(
        'div',
        {
          className: 'isl-pinnedRow',
          role: 'button',
          tabIndex: 0,
          title,
          onClick: () => uiWorkspaceService?.openSession(id),
          onKeyDown: (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            uiWorkspaceService?.openSession(id);
          },
          onPointerEnter: enter,
          onPointerLeave: leave,
        },
        h('span', { className: 'isl-pinnedName', ref: titleRef }, title),
        h(
          'button',
          {
            type: 'button',
            className: 'isl-pinnedPinBtn',
            title: copy.unpin,
            'aria-label': copy.unpin,
            onClick: (event) => {
              event.stopPropagation();
              workspacesService?.unpinSession?.(id).catch?.(() => {});
            },
          },
          pinIcon,
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'isl-pinnedLocate',
            title: copy.locate,
            'aria-label': copy.locate,
            onClick: (event) => {
              event.stopPropagation();
              revealPinnedSession(id, title);
            },
          },
          h(LocateGlyph),
        ),
      );
    }

    /**
     * Aggregate pinned sessions above the workspace groups. The block lives
     * in a host div inserted before the DSH workspace list, so it participates
     * in the sidebar flow while rendering as React through a portal.
     */
    function IslandsPinnedSection({ useWorkspaces, useSessions }) {
      const pinnedIds = useWorkspaces((state) => state.pinnedSessionIds ?? []);
      const sessions = useSessions((state) => state.byId ?? {});
      const [host, setHost] = React.useState(null);
      const [collapsed, setCollapsed] = React.useState(() => {
        try {
          return window.localStorage.getItem('dsh-islands-ui:pinned-collapsed') === '1';
        } catch {
          return false;
        }
      });
      const lang = useLocale() ?? 'en';
      const copy = String(lang).toLowerCase().startsWith('zh') ? COPY.zh : COPY.en;

      React.useEffect(() => {
        let current = null;
        const attach = () => {
          const header = document.querySelector('.Kjh-qa_sectionHeader');
          const tree = document.querySelector('.Kjh-qa_treeBody') ?? document.querySelector('.Kjh-qa_list');
          const target = header?.parentElement ?? tree?.parentElement;
          if (target === null || target === undefined) return;
          let anchor = target.querySelector(':scope > .isl-pinnedHost');
          if (anchor === null || !anchor.isConnected) {
            anchor = document.createElement('div');
            anchor.className = 'isl-pinnedHost';
          }
          // Sit between the New Session row and the Workspace section header.
          if (header !== null && header !== undefined) {
            if (anchor.nextElementSibling !== header) target.insertBefore(anchor, header);
          } else if (tree !== null && tree !== undefined) {
            if (anchor.nextElementSibling !== tree) target.insertBefore(anchor, tree);
          } else {
            target.appendChild(anchor);
          }
          if (current !== anchor) {
            current = anchor;
            setHost(anchor);
          }
        };
        attach();
        const timer = window.setInterval(attach, 800);
        return () => {
          window.clearInterval(timer);
          current?.remove();
        };
      }, []);

      const rows = pinnedIds.map((id) => sessions[id]).filter((session) => session !== undefined);
      const pinIcon = defaultPinIcon();
      if (host === null || rows.length === 0) return null;

      const toggle = () => {
        const next = !collapsed;
        setCollapsed(next);
        try {
          window.localStorage.setItem('dsh-islands-ui:pinned-collapsed', next ? '1' : '0');
        } catch {
          /* ignore */
        }
      };

      return ReactDOM.createPortal(
        h(
          'div',
          { className: 'isl-pinned', 'data-open': collapsed ? undefined : '' },
          h(
            'button',
            {
              type: 'button',
              className: 'isl-pinnedHead',
              'aria-expanded': !collapsed,
              title: copy.pinned,
              onClick: toggle,
            },
            h('span', { className: 'isl-pinnedChevron' }, h(ChevronGlyph)),
            h('span', { className: 'isl-pinnedTitle' }, copy.pinned),
            h('span', { className: 'isl-pinnedCount' }, String(rows.length)),
          ),
          collapsed
            ? null
            : h(
                'div',
                { className: 'isl-pinnedList' },
                rows.map((session) =>
                  h(PinnedRow, {
                    key: session.id ?? session.sessionId,
                    session,
                    copy,
                    pinIcon,
                  }),
                ),
              ),
        ),
        host,
      );
    }

    function WarningGlyph() {
      return h(
        'svg',
        { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'M8 2.4 14.2 13H1.8L8 2.4Z', stroke: 'currentColor', strokeWidth: 1.4, strokeLinejoin: 'round' }),
        h('path', { d: 'M8 6.4v3', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }),
        h('circle', { cx: 8, cy: 11.3, r: 0.9, fill: 'currentColor' }),
      );
    }

    /** Amber bar at the top of the Islands page explaining the auto-disable. */
    function CompatibilityBanner({ copy, compat, onForce }) {
      if (compat.status !== 'missing') return null;
      return h(
        'div',
        { className: 'isl-compatBanner', role: 'alert' },
        h('span', { className: 'isl-compatBannerIcon' }, h(WarningGlyph)),
        h(
          'div',
          { className: 'isl-compatBannerText' },
          h('div', { className: 'isl-compatBannerTitle' }, copy.compatBannerTitle),
          h('div', { className: 'isl-compatBannerBody' }, copy.compatBannerBody),
          h(
            'div',
            { className: 'isl-compatBannerList' },
            h('span', null, `${copy.compatMissing}:`),
            compat.missing.map((selector) => h('code', { key: selector, className: 'isl-compatAnchor' }, selector)),
          ),
          h('div', { className: 'isl-compatBannerHint' }, copy.compatFix),
        ),
        h('button', { type: 'button', className: 'isl-compatBannerAction', onClick: onForce }, copy.compatForce),
      );
    }

    /**
     * Turn the skin on only when the build still matches the stylesheet.
     *
     * The plugin's own chrome is plain React and keeps rendering no matter what
     * DSH does, while every layout rule is keyed to the shipped class names. A
     * renamed anchor therefore yields a half-skinned, overlapping UI instead of
     * a clean fallback, so a mismatched build stays on the untouched default.
     */
    function startCompatibilityGate() {
      let frameHandle = null;
      let settled = false;
      let retries = 0;
      let contentSeenAt = null;
      const startedAt = Date.now();

      const stop = () => {
        if (frameHandle !== null) cancelAnimationFrame(frameHandle);
        frameHandle = null;
      };

      const fail = (missing) => {
        if (settled) return;
        settled = true;
        stop();
        setCompat({ status: 'missing', missing, forced: false });
        console.warn('[islands-ui] interface anchors missing; the skin stayed off:', missing);
        // Someone who already switched the skin off does not need a popup; the
        // settings page still carries the explanation.
        if (readStored()) showCompatibilityToast();
      };

      const pass = () => {
        if (settled) return;
        settled = true;
        stop();
        setCompat({ status: 'ok', missing: [], forced: false });
        activate();
      };

      const settle = () => {
        frameHandle = null;
        if (settled) return;
        const missing = missingAnchors();
        if (missing.length === 0) {
          pass();
          return;
        }
        // Siblings can mount a frame after the frame element itself.
        retries += 1;
        if (retries < 4) {
          frameHandle = requestAnimationFrame(settle);
          return;
        }
        fail(missing);
      };

      const watch = () => {
        frameHandle = null;
        if (settled) return;
        if (document.querySelector(REQUIRED_ANCHORS[0]) !== null) {
          settle();
          return;
        }
        // Anything rendered into the app root means the shell mounted; if the
        // frame anchor is still absent after a grace period it was renamed,
        // and waiting for the hard timeout would only delay the notice.
        const root = document.getElementById('root') ?? document.body;
        if (contentSeenAt === null && root !== null && root.childElementCount > 0) {
          contentSeenAt = Date.now();
        }
        if (contentSeenAt !== null && Date.now() - contentSeenAt > COMPAT_CONTENT_GRACE_MS) {
          fail(missingAnchors());
          return;
        }
        if (Date.now() - startedAt > COMPAT_TIMEOUT_MS) {
          fail(missingAnchors());
          return;
        }
        frameHandle = requestAnimationFrame(watch);
      };

      frameHandle = requestAnimationFrame(watch);
      return stop;
    }

    function activate() {
      if (activated || skinRegistrar === null) return;
      activated = true;
      syncAttribute();
      applyAccent(readAccent());
      try {
        skinRegistrar();
      } catch (error) {
        console.warn('[islands-ui] failed to mount the skin', error);
        document.body?.removeAttribute(ATTRIBUTE);
      }
    }

    function forceEnable() {
      try {
        window.sessionStorage.setItem(FORCE_KEY, '1');
      } catch {
        /* private mode: the choice still applies for this page. */
      }
      setCompat({ status: 'ok', missing: [], forced: true });
      activate();
    }

    /**
     * Plain-DOM toast: it must work while the shell is in an unknown state, so
     * it is appended to `body`, styled by the always-injected stylesheet and
     * removed without React.
     */
    function showCompatibilityToast() {
      if (document.body === null) return;
      const copy = currentCopy();
      const host = document.createElement('div');
      host.className = 'isl-compatToast';
      host.setAttribute('role', 'status');
      host.setAttribute('aria-live', 'polite');
      host.tabIndex = 0;
      host.title = copy.compatView;

      const body = document.createElement('div');
      body.className = 'isl-compatToastBody';
      const title = document.createElement('div');
      title.className = 'isl-compatToastTitle';
      title.textContent = copy.compatTitle;
      const text = document.createElement('div');
      text.className = 'isl-compatToastText';
      text.textContent = copy.compatBody;
      const action = document.createElement('div');
      action.className = 'isl-compatToastAction';
      action.textContent = copy.compatView;
      body.append(title, text, action);

      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'isl-compatToastClose';
      close.setAttribute('aria-label', copy.compatDismiss);
      close.textContent = '\u00d7';

      let timer = null;
      let closed = false;
      const dismiss = () => {
        if (closed) return;
        closed = true;
        if (timer !== null) window.clearTimeout(timer);
        host.classList.remove('is-visible');
        window.setTimeout(() => host.remove(), 200);
      };

      const openSection = () => {
        dismiss();
        openSettings({ section: 'Islands UI' });
      };

      timer = window.setTimeout(dismiss, 5000);
      close.addEventListener('click', (event) => {
        event.stopPropagation();
        dismiss();
      });
      host.addEventListener('click', openSection);
      host.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openSection();
      });

      host.append(body, close);
      document.body.append(host);
      requestAnimationFrame(() => host.classList.add('is-visible'));
    }

    /** Islands settings page: skin switch + accent color. */
    function IslandsSettingsPage() {
      const on = useEnabled();
      const compat = useCompat();
      const lang = useLocale() ?? 'en';
      const copy = String(lang).toLowerCase().startsWith('zh') ? COPY.zh : COPY.en;
      const blocked = compat.status === 'missing';
      const [accent, setAccent] = React.useState(readAccent);
      const chooseAccent = (color) => {
        setAccent(color);
        applyAccent(color);
        storeAccent(color);
      };
      return h(
        'div',
        { className: 'isl-settingsPage' },
        h(
          'div',
          { className: 'isl-settingsPageHead' },
          h('span', { className: 'isl-settingsPageLogo' }, h(IslandsLogo, { size: 30 })),
          h(
            'div',
            { className: 'isl-settingsPageHeadText' },
            h('div', { className: 'isl-settingsPageTitle' }, copy.title),
            h('div', { className: 'isl-settingsPageDesc' }, copy.description),
          ),
        ),
        h(CompatibilityBanner, { copy, compat, onForce: forceEnable }),
        compat.forced ? h('div', { className: 'isl-compatForced' }, copy.compatForced) : null,
        h(
          'div',
          { className: 'isl-prefRow' },
          h(
            'div',
            { className: 'isl-prefText' },
            h('div', { className: 'isl-prefTitle' }, copy.enable),
            h('div', { className: 'isl-prefDesc' }, copy.enableDesc),
          ),
          h(
            'button',
            {
              type: 'button',
              role: 'switch',
              className: 'isl-switch',
              'aria-checked': on,
              'aria-label': copy.enable,
              title: blocked ? copy.compatBannerTitle : copy.enable,
              disabled: blocked,
              onClick: () => setEnabled(!on),
            },
            h('span', { className: 'isl-switchThumb' }),
          ),
        ),
        h(
          'div',
          { className: 'isl-prefRow' },
          h(
            'div',
            { className: 'isl-prefText' },
            h('div', { className: 'isl-prefTitle' }, copy.accent),
            h('div', { className: 'isl-prefDesc' }, copy.accentDesc),
          ),
          h(
            'div',
            { className: 'isl-accentPicker' },
            h('button', {
              type: 'button',
              className: 'isl-accentSwatch is-default' + (accent === null ? ' is-selected' : ''),
              title: copy.accentDefault,
              'aria-label': copy.accentDefault,
              'aria-pressed': accent === null,
              onClick: () => chooseAccent(null),
            }),
            ACCENT_PRESETS.map((color) =>
              h('button', {
                type: 'button',
                key: color,
                className:
                  'isl-accentSwatch' + (accent !== null && accent.toLowerCase() === color.toLowerCase() ? ' is-selected' : ''),
                style: { background: color },
                title: color,
                'aria-label': color,
                'aria-pressed': accent !== null && accent.toLowerCase() === color.toLowerCase(),
                onClick: () => chooseAccent(color),
              }),
            ),
            h(
              'label',
              { className: 'isl-accentCustom', title: copy.accentCustom },
              h('input', {
                type: 'color',
                value: accent ?? DEFAULT_ACCENT,
                'aria-label': copy.accentCustom,
                onChange: (event) => chooseAccent(event.target.value),
              }),
            ),
          ),
        ),
      );
    }

    function IslandsSectionIcon({ size = 16 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('rect', { x: 1.5, y: 1.5, width: 5.5, height: 5.5, rx: 1.6, stroke: 'currentColor', strokeWidth: 1.3 }),
        h('rect', { x: 9, y: 1.5, width: 5.5, height: 5.5, rx: 1.6, stroke: 'currentColor', strokeWidth: 1.3 }),
        h('rect', { x: 1.5, y: 9, width: 5.5, height: 5.5, rx: 1.6, stroke: 'currentColor', strokeWidth: 1.3 }),
        h('rect', { x: 9, y: 9, width: 5.5, height: 5.5, rx: 1.6, stroke: 'currentColor', strokeWidth: 1.3 }),
      );
    }

    return {
      inject: ['slots', 'locale', 'layout'],
      apply(ctx) {
        ctx.inject(['uiWorkspace', 'workspaces'], (scope) => {
          uiWorkspaceService = scope.uiWorkspace;
          workspacesService = scope.workspaces;
        });

        pluginCtx = ctx;
        localeService = ctx.locale;
        layoutService = ctx.layout;
        slotsService = ctx.slots;
        applyAccent(readAccent());

        ctx.effect(() => {
          const tag = document.createElement('style');
          tag.dataset.plugin = 'dsh-islands-ui';
          tag.dataset.pluginCss = 'dsh-islands-ui/islands.css';
          tag.textContent = CSS;
          document.head.appendChild(tag);
          return () => {
            tag.remove();
            document.body?.removeAttribute(ATTRIBUTE);
          };
        }, 'dsh-islands-ui: stylesheet');

        // Everything below turns the chrome on, so it runs only after the gate
        // has confirmed this build still matches the stylesheet.
        const registerSkinChrome = (ctx) => {
          ctx.effect(() => {
            const root = document.documentElement;
            let panel = null;
            let styleObserver = null;
            let mountObserver = null;
            let locateFrame = null;
            let retryTimer = null;

            // Publish the right pane's PREFERRED width, not the width the column
            // currently has. The column is 0 while the pane is closed (and while
            // the independent workspace collapse pins the right track), so a
            // measurement-based value can never recover after the pane opens:
            // the track would stay 0 and the panel clamp would keep it hidden.
            // The panel itself always carries its resolved width in
            // `--dsh-sidebar-width` (and its inline width), even while closed.
            const publish = () => {
              if (panel === null) return;
              const value = (panel.style.getPropertyValue('--dsh-sidebar-width') || panel.style.width || '').trim();
              if (value !== '') root.style.setProperty('--isl-rightbar-w', value);
            };

            const watch = (next) => {
              if (next === panel) return;
              styleObserver?.disconnect();
              styleObserver = null;
              panel = next;
              if (panel === null) return;
              styleObserver = new MutationObserver(publish);
              styleObserver.observe(panel, { attributes: true, attributeFilter: ['style'] });
              publish();
            };

            const locate = () => {
              locateFrame = null;
              const next = document.querySelector('.Dv5QdW_panel');
              watch(next);
              if (next === null) return;
              mountObserver?.disconnect();
              mountObserver = null;
              if (retryTimer !== null) {
                clearTimeout(retryTimer);
                retryTimer = null;
              }
            };

            const scheduleLocate = () => {
              if (locateFrame !== null) return;
              locateFrame = requestAnimationFrame(locate);
            };

            locate();
            // The client applies before the shell mounts, so the first query can
            // miss the right pane. Watch until it appears (bounded: a profile
            // without the right pane must not keep a document-wide observer).
            if (panel === null && document.body !== null) {
              mountObserver = new MutationObserver(scheduleLocate);
              mountObserver.observe(document.body, { childList: true, subtree: true });
              retryTimer = setTimeout(() => {
                mountObserver?.disconnect();
                mountObserver = null;
                retryTimer = null;
              }, 10_000);
            }

            return () => {
              if (locateFrame !== null) cancelAnimationFrame(locateFrame);
              if (retryTimer !== null) clearTimeout(retryTimer);
              mountObserver?.disconnect();
              styleObserver?.disconnect();
              root.style.removeProperty('--isl-rightbar-w');
            };
          }, 'dsh-islands-ui: rightbar width');

          ctx.slots.inject('shell.overlay', () =>
            ctx.slots.register({ name: 'shell.overlay', id: 'islands-topbar', order: -100 }, IslandsTopBar),
          );

          ctx.slots.inject('shell.overlay', () =>
            ctx.slots.register({ name: 'shell.overlay', id: 'islands-rail', order: -90 }, IslandsRail),
          );

          ctx.slots.inject('shell.overlay', () =>
            ctx.slots.register({ name: 'shell.overlay', id: 'islands-rail-settings', order: -89 }, IslandsRailSettings),
          );

          ctx.slots.inject('shell.overlay', () =>
            ctx.slots.register({ name: 'shell.overlay', id: 'islands-pinned', order: -88 }, IslandsPinnedSection),
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
            shortcutsService = scope.shortcuts;

            ctx.effect(
              () => {
                try {
                  return scope.shortcuts.register({
                    id: 'islands.model.open',
                    label: () => 'Model picker',
                    defaults: {
                      'desktop:macos': { code: 'KeyM', modifiers: ['primary', 'shift'] },
                      'desktop:windows': { code: 'KeyM', modifiers: ['primary', 'shift'] },
                      'desktop:linux': { code: 'KeyM', modifiers: ['primary', 'shift'] },
                    },
                    regions: ['page', 'editable'],
                    modals: [],
                    resolve: () => ({
                      status: 'handled',
                      run: () => window.dispatchEvent(new CustomEvent('islands:model-open')),
                    }),
                  });
                } catch (error) {
                  console.warn('[islands-ui] model picker shortcut unavailable', error);
                  return undefined;
                }
              },
              'dsh-islands-ui: model picker shortcut',
            );

            if (typeof scope.shortcuts.observeFixedInput !== 'function') return;
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
          // old rail never stays on screen. Drawer mode is different: its open
          // state is native, and the independent desktop collapse must never hide
          // the drawer's workspace, so entering the drawer clears that attribute.
          ctx.effect(() => {
            let observer;
            let timer;
            const fix = () => {
              const frame = document.querySelector('.PIRFFq_frame');
              if (frame === null) return;
              if (frame.hasAttribute('data-sidebar-drawer')) {
                document.body.removeAttribute(WORKSPACE_ATTR);
                return;
              }
              if (!frame.hasAttribute('data-sidebar-collapsed')) return;
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
              observer.observe(frame, {
                attributes: true,
                attributeFilter: ['data-sidebar-collapsed', 'data-sidebar-drawer'],
              });
            };
            attach();
            return () => {
              window.clearTimeout(timer);
              observer?.disconnect();
            };
          }, 'dsh-islands-ui: native collapse conversion');
        };
        skinRegistrar = () => registerSkinChrome(ctx);

        ctx.slots.inject('settings.section', () =>
          ctx.slots.register(
            { name: 'settings.section', id: 'islands-ui', order: 30, label: 'Islands UI' },
            IslandsSettingsPage,
          ),
        );

        ctx.slots.inject('settings.section.icon', () =>
          ctx.slots.register({ name: 'settings.section.icon', id: 'islands-ui' }, IslandsSectionIcon),
        );

        if (isForced()) {
          setCompat({ status: 'ok', missing: [], forced: true });
          activate();
          return;
        }
        ctx.effect(() => startCompatibilityGate(), 'dsh-islands-ui: compatibility gate');      },
    };
  },
});
