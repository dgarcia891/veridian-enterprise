import { describe, it, expect } from 'vitest';
import { CALCOM_CONFIG } from '../../src/config/calcom';

describe('Consultation Link Regression Test (BUG-006)', () => {
    it('should use the correct Cal.com username and slug', () => {
        // The correct link provided by the user is https://cal.com/vesllc/ai3kdemocall
        // The current (broken) configuration uses username: "david-garcia-89"

        expect(CALCOM_CONFIG.username).toBe('vesllc');
        expect(CALCOM_CONFIG.eventSlug).toBe('ai3kdemocall');
        expect(CALCOM_CONFIG.bookingLink).toBe('vesllc/ai3kdemocall');
    });
});
