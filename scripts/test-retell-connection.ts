import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const TEST_AGENT_ID = "agent_2df66bc30b17e2cbf174bf2f3b"; // AI Receptionist Agent ID

async function testRetellConnection() {
    console.log("🔍 Testing 'create-retell-call'...");

    try {
        const { data, error } = await supabase.functions.invoke("create-retell-call", {
            body: { agentId: TEST_AGENT_ID },
        });

        if (error) {
            console.error("❌ Invocation Error:");
            // Supabase error object usually has message/context
            if (typeof error === 'object') {
                console.error("Message:", error.message);
                console.error("Context:", error.context ? "Response Object Present" : "No Context");

                if (error.context && typeof error.context.text === 'function') {
                    try {
                        const text = await error.context.text();
                        console.error("Error Body:", text);
                    } catch (e) { console.error("Could not read error body"); }
                }
            } else {
                console.error(error);
            }
            return;
        }

        console.log("✅ Success!");
        console.log("Access Token:", data?.access_token ? "Present" : "Missing");

    } catch (err) {
        console.error("❌ Script Error:", err);
    }
}

testRetellConnection();
