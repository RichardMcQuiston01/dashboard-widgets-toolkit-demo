import {
  EMPTY_LAYOUT,
  optionValuesFromLayout,
  type WidgetDefinition,
} from '@richardmcquiston01/dashboard-widgets-toolkit';
import {
  Dashboard,
  WidgetSettingsProvider,
  useStoredLayout,
  useWidgets,
  type DetailLoader,
  type UseStoredLayoutResult,
} from '@richardmcquiston01/dashboard-widgets-toolkit/react';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
} from 'react';

import { BackToTop } from './components/BackToTop';
import { CollapsingHeader } from './components/CollapsingHeader';
import { DonateCard } from './components/DonateCard';
import { Footer } from './components/Footer';
import { ThemePicker } from './components/ThemePicker';
import { GearIcon, SettingsDialog } from './components/SettingsDialog';
import { Overview } from './components/Overview';
import { Playground } from './components/Playground';
import { Section } from './components/Section';
import { TabList, TabPanels, type TabDefinition } from './components/Tabs';
import { LAYOUT_SCOPE, PAGED_LAYOUT, layoutPersistence } from './data/layouts';
import {
  THEME_SCOPE_NAME,
  buildTheme,
  readStoredThemeChoice,
  storeThemeChoice,
  type BuiltTheme,
  type ThemeChoice,
} from './data/themes';
import {
  ERROR_DEMO_KEY,
  loadWidgetDetail,
  widgetDefinitions,
  widgetProviders,
  type ShopContext,
} from './data/widgets';

type Theme = 'light' | 'dark';

interface LocaleOption {
  readonly label: string;
  readonly locale: string;
  readonly currency: string;
}

const LOCALES: readonly LocaleOption[] = [
  { label: 'English (US) · USD', locale: 'en-US', currency: 'USD' },
  { label: 'English (UK) · GBP', locale: 'en-GB', currency: 'GBP' },
  { label: 'German · EUR', locale: 'de-DE', currency: 'EUR' },
  { label: 'Japanese · JPY', locale: 'ja-JP', currency: 'JPY' },
];

function initialTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

const TAB_IDS: readonly string[] = [
  'dashboard',
  'overview',
  'validation',
  'usage',
];

function readTabFromHash(): string {
  const hashValue: string = window.location.hash.replace('#', '');
  return TAB_IDS.includes(hashValue) ? hashValue : 'dashboard';
}

const noticeButtonClass: string =
  'rounded-md border border-brand-200 bg-white px-2 py-0.5 text-sm font-medium text-brand-700 hover:bg-brand-50 dark:border-brand-700 dark:bg-brand-900 dark:text-brand-100 dark:hover:bg-brand-800';

const STATUS_TEXT: Readonly<Record<UseStoredLayoutResult['status'], string>> = {
  loading: 'Loading your layout…',
  ready: 'Layout saved in this browser.',
  saving: 'Saving your layout…',
  error: 'Layout not saved.',
  conflict: 'Layout changed elsewhere.',
};

/** Shows what useStoredLayout reports: status, errors and other-tab changes. */
function StorageNotice({
  stored,
}: {
  readonly stored: UseStoredLayoutResult;
}): ReactElement {
  return (
    <div className="mb-4 space-y-2 text-sm" role="status" aria-live="polite">
      <p className="text-slate-600 dark:text-slate-400">
        {STATUS_TEXT[stored.status]}
        {stored.error !== null && (
          <span className="ml-1 text-rose-700 dark:text-rose-300">
            {stored.error} The dashboard keeps working with the layout in
            memory.
          </span>
        )}
      </p>
      {stored.remoteLayout !== null && (
        <p className="flex flex-wrap items-center gap-2">
          Layout changed in another tab. Use that version?
          <button
            type="button"
            className={noticeButtonClass}
            aria-label="Use the other tab's layout"
            onClick={() => stored.resolveRemote('use')}
          >
            ✓
          </button>
          <button
            type="button"
            className={noticeButtonClass}
            aria-label="Keep this tab's layout"
            onClick={() => stored.resolveRemote('ignore')}
          >
            X
          </button>
        </p>
      )}
      {stored.conflict !== null && (
        <p className="flex flex-wrap items-center gap-2">
          Someone else saved a different layout. Keep yours?
          <button
            type="button"
            className={noticeButtonClass}
            onClick={() => stored.resolveConflict('mine')}
          >
            Keep mine
          </button>
          <button
            type="button"
            className={noticeButtonClass}
            onClick={() => stored.resolveConflict('theirs')}
          >
            Use theirs
          </button>
        </p>
      )}
    </div>
  );
}

export function App(): ReactElement {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [localeIndex, setLocaleIndex] = useState<number>(0);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [themeChoice, setThemeChoice] = useState<ThemeChoice>(
    readStoredThemeChoice
  );
  const [editMode, setEditMode] = useState<'toggle' | 'always'>('toggle');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const stored: UseStoredLayoutResult = useStoredLayout({
    persistence: layoutPersistence,
    scope: LAYOUT_SCOPE,
    definitions: widgetDefinitions,
    defaultLayout: PAGED_LAYOUT,
  });
  const hasPages: boolean = (stored.layout.pages?.length ?? 0) > 1;
  const [activeTab, setActiveTab] = useState<string>(readTabFromHash);
  const [isFilled, setIsFilled] = useState<boolean>(true);
  const [showErrorDemo, setShowErrorDemo] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const activeDefinitions: readonly WidgetDefinition[] = useMemo(
    () =>
      widgetDefinitions
        .filter(({ key }) => showErrorDemo || key !== ERROR_DEMO_KEY)
        // Each definition sets `fill`; dropping it shows the default layout.
        .map(({ fill, ...rest }) => (isFilled ? { ...rest, fill } : rest)),
    [isFilled, showErrorDemo]
  );
  const builtTheme: BuiltTheme = useMemo(
    () => buildTheme(themeChoice),
    [themeChoice]
  );
  const localeOption: LocaleOption = LOCALES[localeIndex] ?? LOCALES[0]!;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Keep the context stable: a new value restarts loading. Each widget then
  // loads independently after the first render, so cards fill in one by one.
  const shopContext: ShopContext = useMemo(
    () => ({
      shopName: 'Demo Shop',
      currency: localeOption.currency,
      locale: localeOption.locale,
      refreshCount,
    }),
    [localeOption.currency, localeOption.locale, refreshCount]
  );
  // The option values each viewer chose live in the layout; this hands them
  // to the providers (and sends the defaults back after a Reset).
  const optionValues = useMemo(
    () =>
      optionValuesFromLayout(activeDefinitions, stored.layout, {
        overrideLocks: isAdmin,
      }),
    [activeDefinitions, stored.layout, isAdmin]
  );
  const { widgets, refresh } = useWidgets(
    activeDefinitions,
    widgetProviders,
    shopContext,
    { optionValues }
  );

  // The data behind each card's "View" button, loaded only when it is opened.
  const loadDetail: DetailLoader = useCallback(
    (definition, { signal }) =>
      loadWidgetDetail(definition.key, localeOption, signal),
    [localeOption]
  );

  function handleTabChange(tabId: string): void {
    setActiveTab(tabId);
    window.history.replaceState(null, '', `#${tabId}`);
  }

  useEffect(() => {
    function handleHashChange(): void {
      setActiveTab(readTabFromHash());
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  function handleRefresh(): void {
    setRefreshCount((count) => count + 1);
  }

  function handleThemeChange(next: ThemeChoice): void {
    setThemeChoice(next);
    storeThemeChoice(next);
  }

  function handleTogglePages(): void {
    stored.setLayout(hasPages ? EMPTY_LAYOUT : PAGED_LAYOUT);
  }

  const buttonClass: string =
    'rounded-md border border-brand-200 bg-white px-3 py-1.5 text-sm font-medium text-brand-700 shadow-sm hover:bg-brand-50 aria-pressed:border-brand-600 aria-pressed:bg-brand-600 aria-pressed:text-white dark:border-brand-700 dark:bg-brand-900 dark:text-brand-100 dark:hover:bg-brand-800';

  const tabs: readonly TabDefinition[] = [
    {
      id: 'dashboard',
      label: 'Interactive dashboard',
      panel: (
        <Section
          id="dashboard"
          title="Interactive dashboard"
          description="All seven widget kinds plus an empty state, on three pages (a page bar appears with two or more). Press Customize to move, hide or minimize widgets, add or rename pages and move a widget to another page; Sync status and Store policy are locked. While customizing, a card's Arrange icon has an Options… item for its title, width and what it asks its provider for (Store policy has no options: it is locked against them). The eye button opens a sortable, filterable list. Open Settings (the gear) to change the color theme, light or dark mode and locale. Layouts are saved through a storage adapter (localStorage here) and follow you across tabs. Switch on “Error demo” to see a failing provider stay contained to one card."
        >
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className={`${buttonClass} flex items-center gap-2`}
              aria-haspopup="dialog"
              onClick={() => setSettingsOpen(true)}
            >
              <GearIcon />
              Settings
            </button>
            <button
              type="button"
              className={buttonClass}
              onClick={handleRefresh}
            >
              Refresh data
            </button>
            <button
              type="button"
              className={buttonClass}
              aria-pressed={hasPages}
              onClick={handleTogglePages}
            >
              Pages: {hasPages ? 'on' : 'off'}
            </button>
            <button
              type="button"
              className={buttonClass}
              aria-pressed={editMode === 'toggle'}
              onClick={() =>
                setEditMode((current) =>
                  current === 'toggle' ? 'always' : 'toggle'
                )
              }
            >
              Edit controls:{' '}
              {editMode === 'toggle' ? 'behind Customize' : 'always shown'}
            </button>
            <button
              type="button"
              className={buttonClass}
              aria-pressed={isAdmin}
              onClick={() => setIsAdmin((current) => !current)}
            >
              Administrator: {isAdmin ? 'on' : 'off'}
            </button>
            <button
              type="button"
              className={buttonClass}
              aria-pressed={showErrorDemo}
              onClick={() => setShowErrorDemo((current) => !current)}
            >
              Error demo: {showErrorDemo ? 'on' : 'off'}
            </button>
            <button
              type="button"
              className={buttonClass}
              aria-pressed={isFilled}
              onClick={() => setIsFilled((current) => !current)}
            >
              Fill widgets: {isFilled ? 'on' : 'off'}
            </button>
          </div>
          <StorageNotice stored={stored} />
          <SettingsDialog
            open={settingsOpen}
            title="Settings"
            onClose={() => setSettingsOpen(false)}
          >
            <fieldset className="mb-5">
              <legend className="mb-2 text-sm font-semibold text-brand-700 dark:text-brand-200">
                Mode
              </legend>
              <div className="flex gap-4 text-sm">
                {(['light', 'dark'] as const).map((mode) => (
                  <label key={mode} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="color-mode"
                      value={mode}
                      checked={theme === mode}
                      onChange={() => setTheme(mode)}
                    />
                    {mode === 'light' ? 'Light' : 'Dark'}
                  </label>
                ))}
              </div>
            </fieldset>
            <ThemePicker
              choice={themeChoice}
              error={builtTheme.ok ? null : builtTheme.error}
              onChange={handleThemeChange}
            />
            <label className="mb-5 flex items-center gap-2 text-sm">
              Locale
              <select
                value={localeIndex}
                onChange={(event) => setLocaleIndex(Number(event.target.value))}
                className="rounded-md border border-brand-200 bg-white px-2 py-1.5 dark:border-brand-700 dark:bg-brand-900"
              >
                {LOCALES.map((option, index) => (
                  <option key={option.locale} value={index}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </SettingsDialog>
          {builtTheme.ok && builtTheme.styles !== null && (
            <style>{builtTheme.styles.css}</style>
          )}
          <div
            {...(builtTheme.ok && builtTheme.styles !== null
              ? { 'data-dwt-theme': THEME_SCOPE_NAME }
              : {})}
          >
            <WidgetSettingsProvider
              locale={localeOption.locale}
              linkTarget="_blank"
            >
              <Dashboard
                widgets={widgets}
                layout={stored.layout}
                onLayoutChange={stored.setLayout}
                defaultLayout={PAGED_LAYOUT}
                editMode={editMode}
                overrideLocks={isAdmin}
                onRetry={refresh}
                loadDetail={loadDetail}
              />
            </WidgetSettingsProvider>
          </div>
        </Section>
      ),
    },
    { id: 'overview', label: 'Overview', panel: <Overview /> },
    {
      id: 'validation',
      label: 'Payload validation',
      panel: (
        <Section
          id="validation"
          title="Payload validation"
          description="Providers can return plain JSON, so a server can resolve widgets and a client can validate them. Edit the payload to see field-level errors."
        >
          <Playground />
        </Section>
      ),
    },
    {
      id: 'usage',
      label: 'Use it in your app',
      panel: (
        <Section
          id="usage"
          title="Use it in your app"
          description="Install the package, define widgets, register a provider per key, store the layout and render."
        >
          <pre className="overflow-x-auto rounded-md bg-brand-900 p-4 text-sm text-brand-100">
            <code>{`npm install @richardmcquiston01/dashboard-widgets-toolkit

import { defineWidget, createLayoutPersistence, optionValuesFromLayout } from '@richardmcquiston01/dashboard-widgets-toolkit';
import { Dashboard, useWidgets, useStoredLayout } from '@richardmcquiston01/dashboard-widgets-toolkit/react';
import '@richardmcquiston01/dashboard-widgets-toolkit/styles.css';`}</code>
          </pre>
          <h3 className="mt-6 text-lg font-semibold text-brand-700 dark:text-brand-200">
            Declare options, lock a widget, store the layout
          </h3>
          <pre className="mt-2 overflow-x-auto rounded-md bg-brand-900 p-4 text-sm text-brand-100">
            <code>{`const topProducts = defineWidget({
  key: 'top-products',
  title: 'Most popular products',
  kind: 'TABLE',
  locked: { move: true }, // pinned; still hideable
  minWidth: 6, // viewers can resize it, but not below half the row
  options: [
    { key: 'limit', type: 'number', label: 'Rows', min: 3, max: 10, default: 5 },
    { key: 'order', type: 'sort', label: 'Order by', apply: 'client',
      columns: [{ key: 'c2', label: 'Sold' }], default: 'c2:desc' },
  ],
});

// Providers get the resolved options; only changed widgets reload.
const providers = {
  'top-products': (context, definition, { options }) => load(options.limit),
};
// Bring your own storage: an adapter has get, set, remove and subscribe.
const persistence = createLayoutPersistence(withFallback(localStorageAdapter, memoryAdapter()));
const stored = useStoredLayout({ persistence, scope, definitions, defaultLayout });

// The Options dialog saves each viewer's title, width and option values in
// the layout. This hands the chosen option values to the providers.
const optionValues = useMemo(
  () => optionValuesFromLayout(definitions, stored.layout),
  [stored.layout]
);
const { widgets } = useWidgets(definitions, providers, context, { optionValues });

<Dashboard
  widgets={widgets}
  layout={stored.layout}
  onLayoutChange={stored.setLayout}
  editMode="toggle"
/>`}</code>
          </pre>
        </Section>
      ),
    },
  ];

  return (
    <div>
      <CollapsingHeader
        title="Dashboard Widgets Toolkit"
        details={
          <div className="mt-1 flex flex-col gap-x-6 gap-y-1 text-sm sm:flex-row sm:items-baseline sm:justify-between">
            <p className="text-brand-100">
              Typed widgets, validated JSON payloads and accessible React
              renderers.
            </p>
            <p className="flex shrink-0 gap-4">
              <a
                className="font-medium text-accent-400 underline"
                href="https://github.com/RichardMcQuiston01/dashboard-widgets-toolkit"
                target="_blank"
                rel="noopener noreferrer"
              >
                Package on GitHub
              </a>
              <a
                className="font-medium text-accent-400 underline"
                href="https://github.com/RichardMcQuiston01/dashboard-widgets-toolkit-demo"
                target="_blank"
                rel="noopener noreferrer"
              >
                Demo source
              </a>
            </p>
          </div>
        }
        nav={
          <TabList
            tabs={tabs}
            activeId={activeTab}
            onChange={handleTabChange}
          />
        }
      />

      <main className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6">
        <TabPanels tabs={tabs} activeId={activeTab} />
      </main>

      <Footer />
      <BackToTop />
      <DonateCard />
    </div>
  );
}
