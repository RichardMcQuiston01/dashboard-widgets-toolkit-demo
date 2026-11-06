/**
 * What each tab says about itself. The text opens in a dialog shortly after the
 * tab first shows (once per page load); the info button beside the tab's
 * controls opens it again.
 */
export interface TabIntro {
  readonly title: string;
  readonly description: string;
}

export const TAB_INTROS: Readonly<Record<string, TabIntro>> = {
  dashboard: {
    title: 'Interactive dashboard',
    description:
      "All seven widget types plus an empty state, on three pages (a page bar appears with two or more). Press Customize to move, hide or minimize widgets, add or rename pages and move a widget to another page; Sync status and Store policy are locked. While customizing, a card's Arrange icon has an Options\u2026 item for its title, width and what it asks its provider for (Store policy has no options: it is locked against them). The eye button opens a sortable, filterable list. Open Settings (the gear) to change the color theme, light or dark mode and locale, and to switch demo options on or off: Pages, Edit controls, Fill widgets, Error demo and Simulate outage. Layouts are saved through a storage adapter (localStorage here) and follow you across tabs. Switch on \u201cError demo\u201d to see a failing provider stay contained to one card. Each card says how old its data is and has a refresh button; switch on \u201cSimulate outage\u201d, then refresh Revenue, Refund rate or Revenue by month to see a failed refresh keep the last good data with a badge. Tables, bar lists and charts have download buttons (CSV, plus SVG and PNG for charts), the detail dialogs have a Download CSV button, and printing the page gives a clean report.",
  },
  builder: {
    title: 'Widget Builder',
    description:
      "An admin screen for making widgets without code. Each data source is described once in code (what it returns and what it can be asked for); the form below can only combine those choices. Pick a source, name the widget, then choose which of the source's options viewers get (and their defaults), add alternate views, set the width and lock, and watch the preview as you type. A change the source can't serve is refused with its reason. Saved widgets are kept in this browser as JSON and appear on the dashboard at the bottom, loaded through the same providers as the Interactive dashboard. Switch \u201cBuilding as\u201d to Viewer to see the same screen under a policy: two of the three sources, at most three widgets, and only some fields; the server\u2019s check refuses anything more, and you can try to cheat it.",
  },
};

/** Milliseconds after a tab shows before its introduction opens. */
export const INTRO_DELAY_MS = 700;
