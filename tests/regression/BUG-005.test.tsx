import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { describe, it, expect } from "vitest";

describe("BUG-005: Pricing Link Configuration", () => {
    it("should point to the standalone /pricing page, not an anchor", () => {
        render(
            <MemoryRouter>
                <Navigation />
            </MemoryRouter>
        );

        // Find the Pricing link
        // Find the Pricing link (it has role="menuitem" in this codebase)
        const pricingLinks = screen.getAllByRole("menuitem", { name: /pricing/i });
        const pricingLink = pricingLinks[0]; // Check the first one (Desktop)

        // It should exist
        expect(pricingLink).toBeInTheDocument();

        // The Href should be absolute /pricing, NOT /#pricing or #pricing
        // Note: React Router might render absolute paths, but checking the attribute value is safest.
        const href = pricingLink.getAttribute("href");

        // THE FAIL CONDITION: Current code has "/#pricing"
        // THE PASS CONDITION: We want "/pricing"
        expect(href).toBe("/pricing");
        expect(href).not.toContain("#");
    });
});
