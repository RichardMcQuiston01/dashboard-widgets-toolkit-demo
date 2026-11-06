import type { ReactElement } from 'react';

interface IconProps {
  readonly className?: string;
}

const COMMON = {
  viewBox: '0 0 24 24',
  width: 18,
  height: 18,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const;

/** Circular arrows: reload the data. */
export function RefreshIcon({ className }: IconProps): ReactElement {
  return (
    <svg {...COMMON} {...(className === undefined ? {} : { className })}>
      <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v5h-5" />
    </svg>
  );
}

/** An "i" in a circle: about this page. */
export function InfoIcon({ className }: IconProps): ReactElement {
  return (
    <svg {...COMMON} {...(className === undefined ? {} : { className })}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.6v.01" />
    </svg>
  );
}

/** A warning triangle: check a payload. */
export function CautionIcon({ className }: IconProps): ReactElement {
  return (
    <svg {...COMMON} {...(className === undefined ? {} : { className })}>
      <path d="M12 3.5 2.8 19.5h18.4L12 3.5ZM12 10v4.5M12 17.2v.01" />
    </svg>
  );
}
