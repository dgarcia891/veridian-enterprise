// Cal.com Configuration
// Update these values with your Cal.com account details
export const CALCOM_CONFIG = {
  // Your Cal.com username (from your Cal.com URL: cal.com/YOUR_USERNAME)
  username: "your-cal-username",
  
  // Your event type slug (from the event URL: cal.com/username/EVENT_SLUG)
  eventSlug: "consultation",
  
  // Full booking link (constructed automatically)
  get bookingLink() {
    return `${this.username}/${this.eventSlug}`;
  },
};

// Theme configuration to match your site
export const CALCOM_THEME = {
  theme: "dark" as const,
  hideEventTypeDetails: false,
  layout: "month_view" as const,
};
