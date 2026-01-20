import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAnalytics } from "@/hooks/useAnalytics";

/**
 * FR-005: Cal.com Booking Funnel Tracking
 * 
 * Tests verify that useAnalytics exports the required funnel tracking functions.
 * These tests will FAIL until the implementation is complete.
 */
describe("FR-005: Cal.com Booking Funnel Tracking", () => {
    describe("useAnalytics hook exports", () => {
        it("should export trackCalendarOpened function", () => {
            const { result } = renderHook(() => useAnalytics());
            expect(typeof result.current.trackCalendarOpened).toBe("function");
        });

        it("should export trackCalendarLoaded function", () => {
            const { result } = renderHook(() => useAnalytics());
            expect(typeof result.current.trackCalendarLoaded).toBe("function");
        });

        it("should export trackBookingCompleted function", () => {
            const { result } = renderHook(() => useAnalytics());
            expect(typeof result.current.trackBookingCompleted).toBe("function");
        });

        it("should export trackCalendarClosed function", () => {
            const { result } = renderHook(() => useAnalytics());
            expect(typeof result.current.trackCalendarClosed).toBe("function");
        });

        it("should export trackDateSelected function", () => {
            const { result } = renderHook(() => useAnalytics());
            expect(typeof result.current.trackDateSelected).toBe("function");
        });

        it("should export trackTimeSlotSelected function", () => {
            const { result } = renderHook(() => useAnalytics());
            expect(typeof result.current.trackTimeSlotSelected).toBe("function");
        });

        it("should export trackBookingFormOpened function", () => {
            const { result } = renderHook(() => useAnalytics());
            expect(typeof result.current.trackBookingFormOpened).toBe("function");
        });
    });
});
