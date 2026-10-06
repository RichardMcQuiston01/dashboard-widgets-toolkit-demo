import { useEffect, useState, type ReactElement } from 'react';

const SHOW_AFTER_PIXELS = 400;

/** Floating "jump to top" button, shown once the page has been scrolled. */
export function BackToTop(): ReactElement | null {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    function handleScroll(): void {
      setIsVisible(window.scrollY > SHOW_AFTER_PIXELS);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  function handleClick(): void {
    const prefersReducedMotion: boolean = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Jump to top of page"
      title="Jump to top"
      className="fixed bottom-5 left-5 z-50 flex size-11 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg transition-colors hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 dark:bg-brand-500 dark:hover:bg-brand-400"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
