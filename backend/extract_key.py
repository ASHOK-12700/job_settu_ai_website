import os

def extract_key():
    try:
        with open("../server/.env", "r") as f:
            for line in f:
                if line.startswith("CHATBOT_OPENAI_API_KEY="):
                    key = line.strip().split("=", 1)[1]
                    with open("key.txt", "w") as out:
                        out.write(key)
                    print("Key extracted to key.txt")
                    return
                elif line.startswith("OPENAI_API_KEY="):
                    # Fallback
                    key = line.strip().split("=", 1)[1]
                    # We prefer chatbot key if available, so don't return yet unless it's the only one
                    # But the file is read sequentially.
                    pass
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    extract_key()
