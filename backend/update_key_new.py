import os

# Load API key from environment variable instead of storing it in code
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is not set. Please add it to your .env file.")

with open(".env", "w") as f:
    f.write(f"OPENAI_API_KEY={OPENAI_API_KEY}\n")
    f.write("RAG_EMBED_MODEL=all-MiniLM-L6-v2\n")
print("Updated .env with new key.")
