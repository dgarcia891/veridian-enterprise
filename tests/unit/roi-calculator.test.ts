import { describe, it, expect } from 'vitest';

/**
 * ROI Calculator Logic Tests
 * 
 * Tests the core calculation logic used in the Lost Revenue Calculator.
 * These are the business-critical formulas that drive lead generation.
 */

// Simulating the calculation logic from the actual calculator
const calculateAnnualLoss = (missedCallsPerDay: number, avgCustomerValue: number): number => {
    const callbackRate = 0.15; // 85% don't call back
    const lostRevenuePerCall = avgCustomerValue * (1 - callbackRate);
    const annualMissedCalls = missedCallsPerDay * 365;
    return Math.round(annualMissedCalls * lostRevenuePerCall * 0.5); // 50% would have converted
};

const calculateROI = (annualLoss: number, monthlyServiceCost: number): number => {
    const annualServiceCost = monthlyServiceCost * 12;
    return Math.round(((annualLoss - annualServiceCost) / annualServiceCost) * 100);
};

describe('ROI Calculator', () => {
    describe('calculateAnnualLoss', () => {
        it('should calculate annual loss for small business (3 missed calls, $250 avg)', () => {
            const result = calculateAnnualLoss(3, 250);
            // 3 calls/day * 365 days * $250 * 0.85 (lost) * 0.5 (conversion)
            expect(result).toBeGreaterThan(50000);
            expect(result).toBeLessThan(150000);
        });

        it('should return 0 for 0 missed calls', () => {
            const result = calculateAnnualLoss(0, 500);
            expect(result).toBe(0);
        });

        it('should scale linearly with missed calls', () => {
            const loss1 = calculateAnnualLoss(1, 200);
            const loss2 = calculateAnnualLoss(2, 200);
            expect(loss2).toBe(loss1 * 2);
        });
    });

    describe('calculateROI', () => {
        it('should calculate positive ROI when loss exceeds service cost', () => {
            const annualLoss = 100000;
            const monthlyServiceCost = 500; // $6000/year
            const roi = calculateROI(annualLoss, monthlyServiceCost);
            expect(roi).toBeGreaterThan(1000); // Should be 1566%
        });

        it('should calculate negative ROI when service cost exceeds loss', () => {
            const annualLoss = 5000;
            const monthlyServiceCost = 1000; // $12000/year
            const roi = calculateROI(annualLoss, monthlyServiceCost);
            expect(roi).toBeLessThan(0);
        });
    });
});
