import {
  loadingWidgets,
  parseLayout,
  resolveWidgets,
  serializeLayout,
  EMPTY_LAYOUT,
  type DashboardLayout,
  type DashboardWidget,
} from '@richardmcquiston01/dashboard-widgets-toolkit';
import {
  Dashboard,
  WidgetSettingsProvider,
} from '@richardmcquiston01/dashboard-widgets-toolkit/react';
import { useCallback, useEffect, useState, type ReactElement } from 'react';

import { DonateCard } from './components/DonateCard';
import { Playground } from './components/Playground';
import { Section } from './components/Section';
import {
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

export function App(): ReactElement {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [localeIndex, setLocaleIndex] = useState<number>(0);
  const [layout, setLayout] = useState<DashboardLayout>(readStoredLayout);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [widgets, setWidgets] = useState<readonly DashboardWidget[]>(() =>
    loadingWidgets(widgetDefinitions)
  );

  const localeOption: LocaleOption = LOCALES[localeIndex] ?? LOCALES[0]!;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const loadWidgets = useCallback(async (): Promise<void> => {
    const context: ShopContext = {
      shopName: 'Demo Shop',
      currency: localeOption.currency,
      refreshCount,
    };
    // Simulate network latency so the loading placeholders are visible.
    await new Promise<void>((resolve) => setTimeout(resolve, 600));
    setWidgets(
      await resolveWidgets(widgetDefinitions, widgetProviders, context)
    );
  }, [localeOption.currency, refreshCount]);

  useEffect(() => {
    void loadWidgets();
  }, [loadWidgets]);

  function handleRefresh(): void {
    setWidgets(loadingWidgets(widgetDefinitions));
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
    'rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800';

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <header className="py-8">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          Live demo
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Dashboard Widgets Toolkit
        </h1>
        <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-400">
          Typed widget definitions, validated JSON payloads, per-viewer layout
          and accessible React renderers. Everything below is rendered by{' '}
          <code>@richardmcquiston01/dashboard-widgets-toolkit</code> with
          simulated data providers.
        </p>
        <p className="mt-3 flex flex-wrap gap-4 text-sm">
          <a
            className="text-indigo-600 underline dark:text-indigo-400"
            href="https://github.com/RichardMcQuiston01/dashboard-widgets-toolkit"
            target="_blank"
            rel="noopener noreferrer"
          >
            Package on GitHub
          </a>
          <a
            className="text-indigo-600 underline dark:text-indigo-400"
            href="https://github.com/RichardMcQuiston01/dashboard-widgets-toolkit-demo"
            target="_blank"
            rel="noopener noreferrer"
          >
            Demo source
          </a>
        </p>
      </header>

      <Section
        id="dashboard"
        title="Interactive dashboard"
        description="All seven widget kinds, plus an empty state and a provider that throws. Use each card's buttons to move, hide or minimise widgets; the layout is saved in this browser's localStorage."
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            Locale
            <select
              value={localeIndex}
              onChange={(event) => setLocaleIndex(Number(event.target.value))}
              className="rounded-md border border-slate-300 bg-white px-2 py-1.5 dark:border-slate-700 dark:bg-slate-900"
            >
              {LOCALES.map((option, index) => (
                <option key={option.locale} value={index}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className={buttonClass} onClick={handleRefresh}>
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
            onRetry={handleRefresh}
          />
        </WidgetSettingsProvider>
      </Section>

      <Section
        id="validation"
        title="Payload validation"
        description="Providers can return plain JSON, so a server can resolve widgets and a client can validate them. Edit the payload to see field-level errors."
      >
        <Playground />
      </Section>

      <Section
        id="usage"
        title="Use it in your app"
        description="Install the package, define widgets, register a provider per key, and render."
      >
        <pre className="overflow-x-auto rounded-md bg-slate-900 p-4 text-sm text-slate-100">
          <code>{`npm install @richardmcquiston01/dashboard-widgets-toolkit

import { defineWidget, resolveWidgets } from '@richardmcquiston01/dashboard-widgets-toolkit';
import { Dashboard } from '@richardmcquiston01/dashboard-widgets-toolkit/react';
import '@richardmcquiston01/dashboard-widgets-toolkit/styles.css';`}</code>
        </pre>
      </Section>

      <DonateCard />
    </div>
  );
}
