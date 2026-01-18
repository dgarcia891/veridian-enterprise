import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LostRevenueCalculator from '@/pages/LostRevenueCalculator';

// Mocks
window.HTMLElement.prototype.scrollIntoView = function () { };
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};
Element.prototype.hasPointerCapture = () => false;
Element.prototype.setPointerCapture = () => { };
Element.prototype.releasePointerCapture = () => { };

vi.mock('@/components/Navigation', () => ({
    default: () => <div data-testid="mock-nav">Navigation</div>
}));
vi.mock('@/components/Footer', () => ({
    default: () => <div data-testid="mock-footer">Footer</div>
}));

describe('Lost Revenue Calculator', () => {
    it('renders without crashing', () => {
        render(
            <MemoryRouter>
                <LostRevenueCalculator />
            </MemoryRouter>
        );
        expect(screen.getByText(/Lost Revenue Calculator/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Average Profit per Call/i)).toBeInTheDocument();
    });
});
