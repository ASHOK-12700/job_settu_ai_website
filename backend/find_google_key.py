def find_google_key():
    try:
        with open("../server/.env", "r") as f:
            for line in f:
                if "AIza" in line:
                    print(f"Found Candidate: {line.strip()[:20]}...")
                    # Save it
                    clean = line.strip().split("=", 1)[1] if "=" in line else line.strip()
                    with open("google_key.txt", "w") as out:
                        out.write(clean)
                    return
    except Exception as e:
        print(e)
    print("No AIza key found.")

if __name__ == "__main__":
    find_google_key()
