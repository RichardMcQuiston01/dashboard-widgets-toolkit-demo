import {
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

interface CollapsingHeaderProps {
  readonly title: string;
  /** Description and links; hidden once the page is scrolled. */
  readonly details: ReactNode;
  /** Navigation (the tab list); always visible. */
  readonly nav: ReactNode;
}

const COLLAPSE_AFTER_PIXELS = 120;
const EXPAND_BEFORE_PIXELS = 40;

/**
 * Fixed header with the title and tabs always visible. Once the page is
 * scrolled, the title shrinks and the details (description and links) fold
 * away. A spacer of the expanded height keeps the page layout stable, so
 * collapsing never shifts content or fights the scroll position.
 */
export function CollapsingHeader({
  title,
  details,
  nav,
}: CollapsingHeaderProps): ReactElement {
  const panelRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [expandedHeight, setExpandedHeight] = useState<number>(0);

  useEffect(() => {
    function handleScroll(): void {
      // Hysteresis: different thresholds in each direction avoid flicker.
      setIsScrolled((wasScrolled) =>
        wasScrolled
          ? window.scrollY > EXPAND_BEFORE_PIXELS
          : window.scrollY > COLLAPSE_AFTER_PIXELS
      );
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track the expanded height for the spacer; ignore collapsed measurements.
  useEffect(() => {
    const panel: HTMLElement | null = panelRef.current;
    if (panel === null) return;
    const observer: ResizeObserver = new ResizeObserver(() => {
      if (!isScrolled) setExpandedHeight(panel.offsetHeight);
    });
    observer.observe(panel);
    return () => observer.disconnect();
  }, [isScrolled]);

  return (
    <div style={expandedHeight > 0 ? { height: expandedHeight } : undefined}>
      <header
        ref={panelRef}
        className={`fixed inset-x-0 top-0 z-40 bg-linear-to-br from-brand-900 via-brand-700 to-brand-500 text-white ${
          isScrolled ? 'shadow-lg' : ''
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h1
            className={`font-bold tracking-tight transition-[font-size,padding] duration-200 motion-reduce:transition-none ${
              isScrolled ? 'pt-2.5 text-xl' : 'pt-4 text-2xl sm:text-3xl'
            }`}
          >
            {title}
          </h1>
          <div
            className={`grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none ${
              isScrolled ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
            }`}
          >
            <div className="overflow-hidden" inert={isScrolled}>
              {details}
            </div>
          </div>
          <div className="mt-2">{nav}</div>
        </div>
      </header>
    </div>
  );
}
