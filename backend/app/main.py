from fastapi import FastAPI

app = FastAPI(
    title="Cortex API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "Welcome to Cortex API 🚀",
        "status": "Running"
    }