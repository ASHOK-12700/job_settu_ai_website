import os

def list_keys():
    keys = {}
    try:
        with open("../server/.env", "r") as f:
            for line in f:
                if "API_KEY" in line and "=" in line:
                    key, val = line.strip().split("=", 1)
                    keys[key] = val
                    print(f"Found {key}: {val[:10]}...")
    except Exception as e:
        print(f"Error: {e}")
        return

    import openai
    for name, key_val in keys.items():
        print(f"\nTesting {name}...")
        try:
            client = openai.OpenAI(api_key=key_val)
            client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": "Hi"}],
                max_tokens=5
            )
            print(f"✅ SUCCESS! {name} is working.")
            # Save the working key
            with open("working_key.txt", "w") as out:
                out.write(key_val)
            return
        except Exception as e:
            print(f"❌ Failed: {e}")

if __name__ == "__main__":
    list_keys()
