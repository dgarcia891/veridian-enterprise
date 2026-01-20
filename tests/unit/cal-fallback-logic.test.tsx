import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React, { useState, useEffect } from "react";
// Minimal reproduction of the logic we want to test
// We can't import the real components easily because they have complex deps (Cal, Router, etc)
// So we'll test the Logic Hook that we will ask Lovable to implement

const useCalFallback = () => {
    const [showFallback, setShowFallback] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!isLoaded) {
            timer = setTimeout(() => {
                setShowFallback(true);
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [isLoaded]);

    const onCalLoaded = () => {
        setIsLoaded(true);
        setShowFallback(false);
    };

    return { showFallback, onCalLoaded };
};

// Test Component using the hook
const TestComponent = () => {
    const { showFallback, onCalLoaded } = useCalFallback();
    return (
        <div>
            {showFallback && <div data-testid="fallback">Having trouble?</div>}
            <button onClick={onCalLoaded} data-testid="load-btn">Load</button>
        </div>
    );
};

describe("FR-005: Cal.com Loading Fallback Logic", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should not show fallback immediately", () => {
        render(<TestComponent />);
        expect(screen.queryByTestId("fallback")).toBeNull();
    });

    it("should show fallback after 5 seconds if not loaded", () => {
        render(<TestComponent />);

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(screen.getByTestId("fallback")).toBeInTheDocument();
    });

    it("should NOT show fallback if loaded before 5 seconds", () => {
        render(<TestComponent />);

        // Simulate load at 2 seconds
        act(() => {
            vi.advanceTimersByTime(2000);
            screen.getByTestId("load-btn").click();
        });

        // Advance past 5 seconds
        act(() => {
            vi.advanceTimersByTime(4000);
        });

        expect(screen.queryByTestId("fallback")).toBeNull();
    });
});
