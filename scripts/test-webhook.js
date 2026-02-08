
const crypto = require('crypto');

const WEBHOOK_URL = "http://localhost:54321/functions/v1/contentflow-webhook";
const WEBHOOK_SECRET = "test_secret"; // Matches default in function

function generateSignature(timestamp, body, secret) {
    const dataToSign = `${timestamp}.${body}`;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(dataToSign);
    return `sha256=${hmac.digest('hex')}`;
}

async function testWebhook() {
    console.log("Testing ContentFlow Webhook...");

    const payload = {
        event: "post.published",
        data: {
            id: "123e4567-e89b-12d3-a456-426614174000", // Valid UUID
            title: "Strict Test Blog Post",
            slug: "strict-test-blog-post", // Required
            content_html: "<p>This is strict content.</p>", // Required
            author: "Test Author"
        }
    };

    const body = JSON.stringify(payload);
    const timestamp = Math.floor(Date.now() / 1000); // Unix seconds
    const signature = generateSignature(timestamp, body, WEBHOOK_SECRET);

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
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = "sha256=invalid_hex";

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

// Run tests
(async () => {
    await testWebhook();
    await testInvalidSignature();
})();
