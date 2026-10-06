import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

interface CollapsingHeaderProps {
  readonly title: string;
  /** Description and links; hidden while collapsed. */
  readonly details: ReactNode;
  /** Navigation (the tab list); hidden while collapsed. */
  readonly nav: ReactNode;
}

const COLLAPSE_AFTER_PIXELS = 120;
const EXPAND_BEFORE_PIXELS = 40;

/**
 * Fixed header that collapses to just the title once the page is scrolled.
 * A spacer of the expanded height keeps the page layout stable, so collapsing
 * never shifts content or fights the scroll position. While collapsed it
 * re-expands on hover or keyboard focus, or via the chevron button (touch).
 */
export function CollapsingHeader({
  title,
  details,
  nav,
}: CollapsingHeaderProps): ReactElement {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isPinnedOpen, setIsPinnedOpen] = useState<boolean>(false);
  const [expandedHeight, setExpandedHeight] = useState<number>(0);

  const isExpanded: boolean =
    !isScrolled || isHovered || isFocused || isPinnedOpen;

  useEffect(() => {
    function handleScroll(): void {
      setIsScrolled((wasScrolled) =>
        wasScrolled
          ? window.scrollY > EXPAND_BEFORE_PIXELS
          : window.scrollY > COLLAPSE_AFTER_PIXELS
      );
      if (window.scrollY <= EXPAND_BEFORE_PIXELS) setIsPinnedOpen(false);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track the expanded height for the spacer; ignore collapsed measurements.
  useEffect(() => {
    const panel: HTMLDivElement | null = panelRef.current;
    if (panel === null) return;
    const observer: ResizeObserver = new ResizeObserver(() => {
      if (!isScrolled) setExpandedHeight(panel.offsetHeight);
    });
    observer.observe(panel);
    return () => observer.disconnect();
  }, [isScrolled]);

  function handleBlur(event: FocusEvent<HTMLDivElement>): void {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocused(false);
    }
  }

  return (
    <div style={expandedHeight > 0 ? { height: expandedHeight } : undefined}>
      <header
        ref={panelRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className={`fixed inset-x-0 top-0 z-40 bg-linear-to-br from-brand-900 via-brand-700 to-brand-500 text-white ${
          isScrolled ? 'shadow-lg' : ''
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div
            className={`flex items-center justify-between gap-4 transition-[padding] duration-200 motion-reduce:transition-none ${
              isExpanded && !isScrolled ? 'pt-10' : 'py-2.5'
            }`}
          >
            <h1
              className={`font-bold tracking-tight transition-[font-size] duration-200 motion-reduce:transition-none ${
                isExpanded && !isScrolled ? 'text-4xl sm:text-5xl' : 'text-xl'
              }`}
            >
              {title}
            </h1>
            {isScrolled && (
              <button
                type="button"
                onClick={() => setIsPinnedOpen((current) => !current)}
                aria-expanded={isExpanded}
                aria-controls="header-details"
                aria-label={
                  isExpanded ? 'Collapse header' : 'Expand header and tabs'
                }
                className="flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-white/15"
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`size-5 transition-transform motion-reduce:transition-none ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            )}
          </div>
          <div
            id="header-details"
            className={`grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none ${
              isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden" inert={!isExpanded}>
              <div className="pb-0">
                {details}
                <div className="mt-4">{nav}</div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
