import {
  checkTheme,
  createTheme,
  themePresets,
  type ThemeOptions,
  type ThemeWarning,
  type WidgetThemeStyles,
} from '@richardmcquiston01/dashboard-widgets-toolkit';

export type ThemePresetId =
  'toolkit' | 'brand' | 'forest' | 'sunset' | 'contrast' | 'mono' | 'custom';

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
    description:
      'The toolkit’s highContrast preset: black and white, solid borders.',
  },
  {
    id: 'mono',
    label: 'Grayscale',
    description: 'The toolkit’s mono preset: chart series in grays, for print.',
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
  /** Tighter spacing and corners (the toolkit's compact preset). */
  readonly compact: boolean;
}

export const DEFAULT_THEME_CHOICE: ThemeChoice = {
  presetId: 'brand',
  accent: DEFAULT_ACCENT,
  compact: false,
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
    base: themePresets.highContrast.base ?? {},
    light: themePresets.highContrast.light ?? {},
    dark: themePresets.highContrast.dark ?? {},
  },
  mono: {
    base: themePresets.mono.base ?? {},
    light: themePresets.mono.light ?? {},
    dark: themePresets.mono.dark ?? {},
  },
};

/** Mixes `hex` with `other` (`amount` of `hex`, 0 to 1) into a `#rrggbb` string. */
function mixHex(hex: string, other: string, amount: number): string {
  const channels = (value: string): number[] =>
    [1, 3, 5].map((start) =>
      Number.parseInt(value.slice(start, start + 2), 16)
    );
  const first: number[] = channels(hex);
  const second: number[] = channels(other);
  const mixed: string = first
    .map((channel, index) =>
      Math.round(channel * amount + (second[index] ?? 0) * (1 - amount))
        .toString(16)
        .padStart(2, '0')
    )
    .join('');
  return `#${mixed}`;
}

/**
 * Tokens for one accent. The mixes are computed here, not with `color-mix()`,
 * so `checkTheme` can read them and flag a pale accent on a white card.
 */
function customTokens(accent: string): ThemeTokenSets {
  if (!/^#[0-9a-fA-F]{6}$/.test(accent)) {
    return { light: { link: accent, focus: accent, series: [accent] } };
  }
  const lightened: string = mixHex(accent, '#ffffff', 0.55);
  return {
    light: {
      link: accent,
      focus: accent,
      meterTrack: mixHex(accent, '#ffffff', 0.2),
      series: [accent],
    },
    dark: {
      link: lightened,
      focus: lightened,
      meterTrack: mixHex(accent, '#000000', 0.35),
      series: [lightened],
    },
  };
}

export type BuiltTheme =
  | {
      readonly ok: true;
      readonly styles: WidgetThemeStyles | null;
      /** Contrast and color-vision findings from `checkTheme`. */
      readonly warnings: readonly ThemeWarning[];
    }
  | { readonly ok: false; readonly error: string };

/** The compact preset's spacing, merged under the chosen palette. */
function withCompact(tokens: ThemeTokenSets, compact: boolean): ThemeTokenSets {
  if (!compact) return tokens;
  return {
    ...tokens,
    base: { ...(themePresets.compact.base ?? {}), ...(tokens.base ?? {}) },
  };
}

/**
 * Turns the viewer's choice into CSS and checks it. "Toolkit default" without
 * compact returns no styles, so nothing overrides the package. The caller
 * checks `ok`; an invalid accent comes back as an error that names the token
 * and value.
 */
export function buildTheme(choice: ThemeChoice): BuiltTheme {
  if (choice.presetId === 'toolkit' && !choice.compact) {
    return { ok: true, styles: null, warnings: [] };
  }
  const palette: ThemeTokenSets =
    choice.presetId === 'toolkit'
      ? {}
      : choice.presetId === 'custom'
        ? customTokens(choice.accent)
        : PRESET_TOKENS[choice.presetId];
  const result = createTheme({
    name: THEME_SCOPE_NAME,
    ...withCompact(palette, choice.compact),
  });
  return result.ok
    ? {
        ok: true,
        styles: result.value,
        warnings: checkTheme(result.value),
      }
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
    const { presetId, accent, compact } = parsed as Partial<ThemeChoice>;
    const knownPreset: boolean = THEME_PRESETS.some(
      (preset) => preset.id === presetId
    );
    return {
      presetId: knownPreset ? (presetId as ThemePresetId) : 'brand',
      accent: typeof accent === 'string' ? accent : DEFAULT_ACCENT,
      compact: compact === true,
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
  if (presetId === 'contrast' || presetId === 'mono') {
    return (
      PRESET_TOKENS[presetId].light?.series ?? ['#000000', '#0000cc', '#ffffff']
    ).slice(0, 3);
  }
  return (PRESET_TOKENS[presetId].light?.series ?? []).slice(0, 3);
}
