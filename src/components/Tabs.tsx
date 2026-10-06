import {
  useRef,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

export interface TabDefinition {
  readonly id: string;
  readonly label: string;
  readonly panel: ReactNode;
}

interface TabsProps {
  readonly tabs: readonly TabDefinition[];
  readonly activeId: string;
  readonly onChange: (tabId: string) => void;
}

interface TabPanelsProps {
  readonly tabs: readonly TabDefinition[];
  readonly activeId: string;
}

const tabId = (id: string): string => `tab-${id}`;
const panelId = (id: string): string => `panel-${id}`;

/**
 * Accessible tab list (WAI-ARIA tabs pattern: arrow keys, Home and End),
 * styled for the dark header banner.
 */
export function TabList({ tabs, activeId, onChange }: TabsProps): ReactElement {
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ): void {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft')
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    const nextTab: TabDefinition | undefined = tabs[nextIndex];
    if (nextTab === undefined) return;
    onChange(nextTab.id);
    tabRefs.current.get(nextTab.id)?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Demo sections"
      className="-mx-4 flex gap-1 overflow-x-auto border-b border-white/20 px-4 sm:mx-0 sm:px-0"
    >
      {tabs.map((tab, index) => {
        const isActive: boolean = tab.id === activeId;
        return (
          <button
            key={tab.id}
            ref={(element) => {
              if (element === null) tabRefs.current.delete(tab.id);
              else tabRefs.current.set(tab.id, element);
            }}
            id={tabId(tab.id)}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId(tab.id)}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`-mb-px shrink-0 border-b-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${
              isActive
                ? 'border-accent-400 text-white'
                : 'border-transparent text-brand-200 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/** Every panel stays mounted and is only hidden, so panel state survives. */
export function TabPanels({ tabs, activeId }: TabPanelsProps): ReactElement {
  return (
    <>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={panelId(tab.id)}
          role="tabpanel"
          aria-labelledby={tabId(tab.id)}
          hidden={tab.id !== activeId}
          className="pt-6"
        >
          {tab.panel}
        </div>
      ))}
    </>
  );
}
