import {
  parseLayout,
  serializeLayout,
  EMPTY_LAYOUT,
  type DashboardLayout,
  type WidgetDefinition,
} from '@richardmcquiston01/dashboard-widgets-toolkit';
import {
  Dashboard,
  WidgetSettingsProvider,
  useWidgets,
  type DetailLoader,
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
import { Overview } from './components/Overview';
import { Playground } from './components/Playground';
import { Section } from './components/Section';
import { TabList, TabPanels, type TabDefinition } from './components/Tabs';
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

const LAYOUT_STORAGE_KEY = 'dwt-demo-layout';

function readStoredLayout(): DashboardLayout {
  try {
    return parseLayout(window.localStorage.getItem(LAYOUT_STORAGE_KEY));
  } catch {
    return EMPTY_LAYOUT;
  }
}

function storeLayout(layout: DashboardLayout): void {
  try {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, serializeLayout(layout));
  } catch (error: unknown) {
    console.warn('Could not save the dashboard layout to localStorage.', error);
  }
}

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

export function App(): ReactElement {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [localeIndex, setLocaleIndex] = useState<number>(0);
  const [layout, setLayout] = useState<DashboardLayout>(readStoredLayout);
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
  const { widgets, refresh } = useWidgets(
    activeDefinitions,
    widgetProviders,
    shopContext
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

  function handleLayoutChange(next: DashboardLayout): void {
    setLayout(next);
    storeLayout(next);
  }

  function handleResetLayout(): void {
    handleLayoutChange(EMPTY_LAYOUT);
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
          description="All seven widget kinds plus an empty state. Switch on “Error demo” to add a widget whose provider intentionally fails and see how failures stay contained to one card. Use each card's buttons to move, hide or minimize widgets, and the eye button to open a sortable, filterable list; the layout is saved in this browser's localStorage. Each card loads on its own, so they fill in one by one."
        >
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
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
              onClick={handleResetLayout}
            >
              Reset layout
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
            <button
              type="button"
              className={buttonClass}
              onClick={() =>
                setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
              }
            >
              Theme: {theme}
            </button>
          </div>
          <WidgetSettingsProvider
            locale={localeOption.locale}
            linkTarget="_blank"
          >
            <Dashboard
              widgets={widgets}
              layout={layout}
              onLayoutChange={handleLayoutChange}
              onRetry={refresh}
              loadDetail={loadDetail}
            />
          </WidgetSettingsProvider>
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
          description="Install the package, define widgets, register a provider per key, and render."
        >
          <pre className="overflow-x-auto rounded-md bg-brand-900 p-4 text-sm text-brand-100">
            <code>{`npm install @richardmcquiston01/dashboard-widgets-toolkit

import { defineWidget, resolveWidgets } from '@richardmcquiston01/dashboard-widgets-toolkit';
import { Dashboard } from '@richardmcquiston01/dashboard-widgets-toolkit/react';
import '@richardmcquiston01/dashboard-widgets-toolkit/styles.css';`}</code>
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
