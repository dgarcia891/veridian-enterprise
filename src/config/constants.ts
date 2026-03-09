// Centralized configuration constants
// Move secrets to environment variables for production

export const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || "G-Z6B8376C8G";

export const RETELL_CHAT_AGENT_ID = import.meta.env.VITE_RETELL_CHAT_AGENT_ID || "agent_2df66bc30b17e2cbf174bf2f3b";
