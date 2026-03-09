import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Manages focus for SPA route transitions (WCAG 2.1 AA compliance).
 * Moves focus to the main content area on route change for screen reader users.
 */
export const useFocusOnRouteChange = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip focus management on initial page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Find the main content element and focus it
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      // Make it focusable temporarily if it's not
      const hadTabIndex = mainContent.hasAttribute("tabindex");
      if (!hadTabIndex) {
        mainContent.setAttribute("tabindex", "-1");
      }
      
      mainContent.focus({ preventScroll: true });
      
      // Remove tabindex if we added it
      if (!hadTabIndex) {
        // Use a small delay to ensure focus event fires
        setTimeout(() => {
          mainContent.removeAttribute("tabindex");
        }, 100);
      }
    }
  }, [location.pathname]);
};
