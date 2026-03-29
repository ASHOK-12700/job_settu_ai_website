import os
from dotenv import load_dotenv
import openai

# Load env vars
load_dotenv()

key = os.environ.get("OPENAI_API_KEY")
print(f"DEBUG: Key found? {'Yes' if key else 'No'}")
if key:
    print(f"DEBUG: Key starts with: {key[:10]}...")

try:
    client = openai.OpenAI(api_key=key)
    print("DEBUG: Client initialized. Attempting request...")
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "Hello, are you working?"}],
        max_tokens=10
    )
    print("DEBUG: Success!")
    print("Response:", response.choices[0].message.content)

except Exception as e:
    print(f"DEBUG: Failed with error: {e}")
