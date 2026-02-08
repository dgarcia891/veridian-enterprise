
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";
import { encodeHex } from "https://deno.land/std@0.208.0/encoding/hex.ts";

const WEBHOOK_URL = "http://localhost:54321/functions/v1/contentflow-webhook";
const WEBHOOK_SECRET = "test_secret"; // Matches default in function

async function generateSignature(timestamp: number, body: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const dataToSign = `${timestamp}.${body}`;
    const signatureBytes = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(dataToSign)
    );
    // Convert buffer to hex string manually to avoid import issues in some environments if needed,
    // but here we use the std lib for the test script.
    return Array.from(new Uint8Array(signatureBytes))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function testWebhook() {
    console.log("Testing ContentFlow Webhook...");

    const payload = {
        event: "post.published",
        data: {
            id: "post_123",
            title: "Test Blog Post",
            content: "This is a test content from the webhook.",
            author: "Test Author"
        }
    };

    const body = JSON.stringify(payload);
    const timestamp = Date.now();
    const signature = await generateSignature(timestamp, body, WEBHOOK_SECRET);

    console.log(`Sending POST request to ${WEBHOOK_URL}`);
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Signature: ${signature}`);

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CFS-Timestamp": timestamp.toString(),
                "X-CFS-Signature": signature
            },
            body: body
        });

        console.log(`Response Status: ${response.status}`);
        const text = await response.text();
        console.log(`Response Body: ${text}`);

        if (response.ok) {
            console.log("✅ Success: Webhook accepted valid request");
        } else {
            console.error("❌ Failed: Webhook rejected valid request");
        }

    } catch (error) {
        console.error("❌ Error sending request:", error);
    }
}

async function testInvalidSignature() {
    console.log("\nTesting Invalid Signature...");
    const payload = { event: "post.ping" };
    const body = JSON.stringify(payload);
    const timestamp = Date.now();
    const signature = "invalid_signature_hex_string";

    const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CFS-Timestamp": timestamp.toString(),
            "X-CFS-Signature": signature
        },
        body: body
    });

    if (response.status === 401) {
        console.log("✅ Success: Webhook rejected invalid signature");
    } else {
        console.error(`❌ Failed: Expected 401, got ${response.status}`);
    }
}

await testWebhook();
await testInvalidSignature();
