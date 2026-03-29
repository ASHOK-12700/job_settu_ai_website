import os
import google.generativeai as genai

def list_keys():
    keys = {}
    try:
        with open("../server/.env", "r") as f:
            for line in f:
                if "=" in line:
                    key, val = line.strip().split("=", 1)
                    if "API_KEY" in key:
                        keys[key] = val
                        print(f"Found {key}: {val[:10]}...")
    except Exception as e:
        print(f"Error: {e}")
        return

    # Test Gemini Key
    gemini_key = keys.get("GEMINI_API_KEY")
    if gemini_key:
        print(f"\nTesting GEMINI_API_KEY...")
        try:
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content("Hello")
            print(f"✅ SUCCESS! GEMINI_API_KEY is working.")
            with open("working_key_gemini.txt", "w") as out:
                out.write(gemini_key)
            return
        except Exception as e:
             print(f"❌ Failed Gemini: {e}")
    else:
        print("No GEMINI_API_KEY found.")

if __name__ == "__main__":
    list_keys()
