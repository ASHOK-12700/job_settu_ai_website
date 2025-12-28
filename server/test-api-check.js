require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
    console.log("Testing OpenAI API...");
    console.log("Model: gpt-4o-mini");
    console.log("Key prefix:", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) : "None");

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Hello, are you working?" }],
            max_tokens: 50,
        });

        console.log("Success!");
        console.log("Response:", completion.choices[0].message.content);
    } catch (error) {
        console.error("Error testing OpenAI:");
        console.error(error.message);
        if (error.response) {
            console.error(error.response.data);
        }
    }
}

testOpenAI();
