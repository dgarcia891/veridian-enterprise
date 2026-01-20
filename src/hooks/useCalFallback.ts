import { useState, useEffect, useCallback } from "react";

/**
 * Hook to manage Cal.com loading state and fallback UI.
 * 
 * @returns {Object} object containing:
 * - showFallback: boolean - whether to show the fallback UI
 * - onCalLoaded: function - callback to call when Cal.com emits "linkReady" or "calendar_loaded"
 */
export const useCalFallback = (timeoutMs = 5000) => {
    const [showFallback, setShowFallback] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!isLoaded) {
            // Start timer to show fallback if not loaded in time
            timer = setTimeout(() => {
                setShowFallback(true);
            }, timeoutMs);
        }
        return () => clearTimeout(timer);
    }, [isLoaded, timeoutMs]);

    const onCalLoaded = useCallback(() => {
        setIsLoaded(true);
        setShowFallback(false);
    }, []);

    return { showFallback, onCalLoaded };
};
