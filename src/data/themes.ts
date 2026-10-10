import {
  createTheme,
  type ThemeOptions,
  type ThemeTokens,
  type WidgetThemeStyles,
} from '@richardmcquiston01/dashboard-widgets-toolkit';

export type ThemePresetId =
  'toolkit' | 'brand' | 'forest' | 'sunset' | 'contrast' | 'custom';

export interface ThemePreset {
  readonly id: ThemePresetId;
  readonly label: string;
  readonly description: string;
}

export const THEME_PRESETS: readonly ThemePreset[] = [
  {
    id: 'brand',
    label: 'Brand blue',
    description: 'This demo’s own palette.',
  },
  {
    id: 'toolkit',
    label: 'Toolkit default',
    description: 'The built-in colors, with no theme applied.',
  },
  { id: 'forest', label: 'Forest', description: 'Greens with warm accents.' },
  { id: 'sunset', label: 'Sunset', description: 'Orange and violet.' },
  {
    id: 'contrast',
    label: 'High contrast',
    description: 'Black and white text, solid borders.',
  },
  {
    id: 'custom',
    label: 'Custom accent',
    description: 'Pick one color; links, focus and the first series follow it.',
  },
];

export const DEFAULT_ACCENT = '#0f5394';

export interface ThemeChoice {
  readonly presetId: ThemePresetId;
  readonly accent: string;
}

export const DEFAULT_THEME_CHOICE: ThemeChoice = {
  presetId: 'brand',
  accent: DEFAULT_ACCENT,
};

/** The scope attribute value: put it on an ancestor of the dashboard. */
export const THEME_SCOPE_NAME = 'demo';

type ThemeTokenSets = Pick<ThemeOptions, 'base' | 'light' | 'dark'>;

const PRESET_TOKENS: Readonly<
  Record<Exclude<ThemePresetId, 'toolkit' | 'custom'>, ThemeTokenSets>
> = {
  brand: {
    base: { radius: '12px' },
    light: {
      surface: '#ffffff',
      border: 'rgba(15, 83, 148, 0.16)',
      link: '#0f5394',
      meterTrack: '#d9e8f8',
      barTrack: '#e4edf8',
      series: ['#0f5394', '#f59e0b', '#14a38b', '#7c5cd6'],
    },
    dark: {
      surface: '#0d1b2e',
      border: 'rgba(134, 180, 230, 0.2)',
      link: '#86b4e6',
      meterTrack: '#123a66',
      barTrack: '#1b3150',
      series: ['#4f8fd6', '#ffb347', '#2dc4aa', '#a48cf0'],
    },
  },
  forest: {
    base: { radius: '10px' },
    light: {
      surface: '#fbfdfb',
      border: 'rgba(22, 84, 52, 0.18)',
      link: '#1b6b3f',
      focus: '#1b6b3f',
      meterTrack: '#d5ecdc',
      barTrack: '#e5f1e8',
      series: ['#1b6b3f', '#c77d0a', '#2a8fa8', '#8b5cc6'],
    },
    dark: {
      surface: '#0f1f16',
      border: 'rgba(140, 214, 170, 0.2)',
      link: '#8fd6aa',
      focus: '#8fd6aa',
      meterTrack: '#1b4a2f',
      barTrack: '#21382a',
      series: ['#4cb877', '#f0b24a', '#5fc0d8', '#b393e8'],
    },
  },
  sunset: {
    base: { radius: '14px' },
    light: {
      surface: '#fffdfb',
      border: 'rgba(158, 52, 20, 0.18)',
      link: '#b23a12',
      focus: '#b23a12',
      meterTrack: '#fde1d3',
      barTrack: '#f8e9e1',
      series: ['#c2410c', '#7c3aed', '#0e7490', '#ca8a04'],
    },
    dark: {
      surface: '#201312',
      border: 'rgba(255, 170, 130, 0.2)',
      link: '#ffb08a',
      focus: '#ffb08a',
      meterTrack: '#5a2412',
      barTrack: '#3a2420',
      series: ['#fb8a5a', '#b794f6', '#4fc3d8', '#f2c94c'],
    },
  },
  contrast: {
    base: { radius: '4px' },
    light: {
      surface: '#ffffff',
      text: '#000000',
      textSecondary: '#1f1f1f',
      textMuted: '#2e2e2e',
      border: '#000000',
      grid: '#6b6b6b',
      baseline: '#000000',
      link: '#0000c8',
      focus: '#0000c8',
      good: '#005a00',
      bad: '#b00000',
      meterTrack: '#cfd8ff',
      barTrack: '#dcdcdc',
    },
    dark: {
      surface: '#000000',
      text: '#ffffff',
      textSecondary: '#f0f0f0',
      textMuted: '#dcdcdc',
      border: '#ffffff',
      grid: '#9a9a9a',
      baseline: '#ffffff',
      link: '#8ab4ff',
      focus: '#ffd400',
      good: '#4ade80',
      bad: '#ff7b7b',
      meterTrack: '#1f2f6b',
      barTrack: '#2b2b2b',
    },
  },
};

function customTokens(accent: string): ThemeTokenSets {
  const lightTokens: ThemeTokens = {
    link: accent,
    focus: accent,
    meterTrack: `color-mix(in srgb, ${accent} 20%, white)`,
    series: [accent],
  };
  const lightened: string = `color-mix(in srgb, ${accent} 55%, white)`;
  const darkTokens: ThemeTokens = {
    link: lightened,
    focus: lightened,
    meterTrack: `color-mix(in srgb, ${accent} 35%, black)`,
    series: [lightened],
  };
  return { light: lightTokens, dark: darkTokens };
}

export type BuiltTheme =
  | { readonly ok: true; readonly styles: WidgetThemeStyles | null }
  | { readonly ok: false; readonly error: string };

/**
 * Turns the viewer's choice into CSS. "Toolkit default" returns no styles, so
 * nothing overrides the package. The caller checks `ok`; an invalid accent
 * comes back as an error that names the token and value.
 */
export function buildTheme(choice: ThemeChoice): BuiltTheme {
  if (choice.presetId === 'toolkit') {
    return { ok: true, styles: null };
  }
  const tokens: ThemeTokenSets =
    choice.presetId === 'custom'
      ? customTokens(choice.accent)
      : PRESET_TOKENS[choice.presetId];
  const result = createTheme({ name: THEME_SCOPE_NAME, ...tokens });
  return result.ok
    ? { ok: true, styles: result.value }
    : { ok: false, error: result.error };
}

const THEME_STORAGE_KEY = 'dwt-demo-color-theme';

export function readStoredThemeChoice(): ThemeChoice {
  try {
    const raw: string | null = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === null) return DEFAULT_THEME_CHOICE;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return DEFAULT_THEME_CHOICE;
    }
    const { presetId, accent } = parsed as Partial<ThemeChoice>;
    const knownPreset: boolean = THEME_PRESETS.some(
      (preset) => preset.id === presetId
    );
    return {
      presetId: knownPreset ? (presetId as ThemePresetId) : 'brand',
      accent: typeof accent === 'string' ? accent : DEFAULT_ACCENT,
    };
  } catch {
    return DEFAULT_THEME_CHOICE;
  }
}

export function storeThemeChoice(choice: ThemeChoice): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(choice));
  } catch (error: unknown) {
    console.warn('Could not save the color theme to localStorage.', error);
  }
}

/** Light-mode series colors, for the swatches beside each preset. */
export function presetSwatches(
  presetId: ThemePresetId,
  accent: string
): readonly string[] {
  if (presetId === 'toolkit') return ['#2a78d6', '#eb6834', '#1baf7a'];
  if (presetId === 'custom') return [accent];
  if (presetId === 'contrast') return ['#000000', '#0000c8', '#ffffff'];
  return (PRESET_TOKENS[presetId].light?.series ?? []).slice(0, 3);
}
