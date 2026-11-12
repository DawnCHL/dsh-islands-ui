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
    const CSS = '__ISLANDS_CSS__';

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

    function openSettings() {
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

    /** Islands settings page: skin switch + accent color. */
    function IslandsSettingsPage() {
      const on = useEnabled();
      const lang = useLocale() ?? 'en';
      const copy = String(lang).toLowerCase().startsWith('zh') ? COPY.zh : COPY.en;
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
              title: copy.enable,
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

        localeService = ctx.locale;
        layoutService = ctx.layout;
        slotsService = ctx.slots;
        syncAttribute();
        applyAccent(readAccent());

        ctx.effect(() => {
          if (document.body !== null && !document.body.hasAttribute(ATTRIBUTE) && readStored()) {
            document.body.setAttribute(ATTRIBUTE, '');
          }
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

        ctx.slots.inject('settings.section', () =>
          ctx.slots.register(
            { name: 'settings.section', id: 'islands-ui', order: 30, label: 'Islands UI' },
            IslandsSettingsPage,
          ),
        );

        ctx.slots.inject('settings.section.icon', () =>
          ctx.slots.register({ name: 'settings.section.icon', id: 'islands-ui' }, IslandsSectionIcon),
        );
      },
    };
  },
});
