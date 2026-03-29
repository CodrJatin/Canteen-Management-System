from app import create_app

# Vercel looks for a variable named 'app' at the top level
app = create_app()

# This part only runs on your laptop (local dev)
if __name__ == "__main__":
    app.run(debug=True)