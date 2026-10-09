import {
  createLayoutPersistence,
  memoryAdapter,
  withFallback,
  type DashboardLayout,
  type LayoutPersistence,
} from '@richardmcquiston01/dashboard-widgets-toolkit';

import { localStorageAdapter } from './localStorageAdapter';

/**
 * The demo's starting layout: three pages. A layout without `pages` is one
 * implicit page, and the page bar shows only with two or more. Widgets no page
 * lists (the error demo) land on their home page, the first.
 */
export const PAGED_LAYOUT: DashboardLayout = {
  order: [],
  hidden: [],
  minimized: [],
  pages: [
    {
      key: 'overview',
      title: 'Overview',
      order: ['revenue', 'refunds', 'storage', 'status', 'policy'],
      hidden: [],
      minimized: [],
    },
    {
      key: 'sales',
      title: 'Sales & traffic',
      order: ['monthly', 'traffic', 'countries', 'low-stock'],
      hidden: [],
      minimized: [],
    },
    {
      key: 'catalog',
      title: 'Catalog',
      order: ['top-products', 'recent-orders', 'reviews'],
      hidden: [],
      minimized: [],
    },
  ],
};

/**
 * Layouts are kept in localStorage, with an in-memory copy behind it so the
 * dashboard still remembers changes for the session when storage is blocked.
 */
export const layoutPersistence: LayoutPersistence = createLayoutPersistence(
  withFallback(localStorageAdapter, memoryAdapter()),
  { onConflict: 'ask' }
);

export const LAYOUT_SCOPE = { dashboardKey: 'demo', userKey: 'guest' } as const;
