// Native fetch is available in Node 18+

async function testEndpoint() {
    console.log("Testing Endpoint: http://localhost:5000/api/ai/gemini-placement-chat");

    try {
        const response = await fetch("http://localhost:5000/api/ai/gemini-placement-chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Hello, who are you?",
                conversationHistory: []
            }),
        });

        console.log("Status:", response.status);
        const data = await response.json();
        console.log("Response Body:", JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("Endpoint test error:", error);
    }
}

// Check if node is old and needs fetch polyfill
if (!globalThis.fetch) {
    console.log("Using node-fetch...");
    // Just run it, require should handle it if installed.
    // If not installed, we might need to rely on the fact that node 18+ has fetch.
    // We can assume the user environment has a recent node, or use http module.
} else {
    // native fetch
}

testEndpoint();
