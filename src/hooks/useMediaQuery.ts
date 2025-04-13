import { useState, useEffect } from "react";

/**
 * Custom hook that returns whether a media query matches the current viewport
 * @param query The media query to match against (e.g., "(max-width: 768px)")
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Set the initial match state
    setMatches(mediaQuery.matches);

    // Define the callback handler
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the event listener
    mediaQuery.addEventListener("change", handler);

    // Clean up
    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}
