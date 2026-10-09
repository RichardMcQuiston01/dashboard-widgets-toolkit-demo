import type {
  StorageAdapter,
  StoredValue,
} from '@richardmcquiston01/dashboard-widgets-toolkit';

/**
 * A StorageAdapter over window.localStorage. This is consumer code, so it may
 * touch the browser; the toolkit only defines the contract. Failures come back
 * as results with a code and a message that names the key.
 */
export const localStorageAdapter: StorageAdapter = {
  get(key) {
    try {
      const value: string | null = window.localStorage.getItem(key);
      return Promise.resolve({
        ok: true,
        value: value === null ? null : { value },
      });
    } catch (cause: unknown) {
      return Promise.resolve({
        ok: false,
        code: 'unavailable',
        error: `Could not read "${key}" from localStorage: ${String(cause)}`,
      });
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return Promise.resolve({ ok: true, value: { value } });
    } catch (cause: unknown) {
      const isFull: boolean =
        cause instanceof DOMException && cause.name === 'QuotaExceededError';
      return Promise.resolve({
        ok: false,
        code: isFull ? 'quota' : 'unavailable',
        error: `Could not write "${key}" to localStorage: ${String(cause)}`,
      });
    }
  },
  remove(key) {
    try {
      window.localStorage.removeItem(key);
      return Promise.resolve({ ok: true, value: null });
    } catch (cause: unknown) {
      return Promise.resolve({
        ok: false,
        code: 'unavailable',
        error: `Could not remove "${key}" from localStorage: ${String(cause)}`,
      });
    }
  },
  // Other tabs, through the storage event.
  subscribe(key, onChange) {
    function handleStorage(event: StorageEvent): void {
      if (event.key !== key) return;
      const stored: StoredValue | null =
        event.newValue === null ? null : { value: event.newValue };
      onChange(stored);
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  },
};
