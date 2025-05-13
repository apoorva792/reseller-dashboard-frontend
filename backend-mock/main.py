from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import orderController

app = FastAPI(title="Dropship Nexus API Mock")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",  # Frontend dev server
        "http://127.0.0.1:8080",
        "http://192.168.0.116:8080",
        "*"  # Keep this temporarily for testing, remove in production
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Content-Type", 
        "Accept", 
        "Authorization", 
        "X-Requested-With"
    ],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Debug middleware to log requests
@app.middleware("http")
async def log_requests(request, call_next):
    print(f"\nIncoming request: {request.method} {request.url}")
    print("Headers:", request.headers)
    response = await call_next(request)
    print(f"Response status: {response.status_code}\n")
    return response

# Include routers
app.include_router(orderController.router, tags=["orders"])

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to Dropship Nexus API Mock Server"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True) 