from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from database.db import init_db
from controllers.orderController import router as order_controller
from api.wallet import router as wallet_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan, title="Order Service")

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://192.168.0.116:8080",
        "*"  # Keep for development, remove in production
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
    max_age=3600,
)

# Debug middleware for logging requests
@app.middleware("http")
async def log_requests(request, call_next):
    print(f"\nIncoming request: {request.method} {request.url}")
    print("Headers:", request.headers)
    response = await call_next(request)
    print(f"Response status: {response.status_code}\n")
    return response

# Include order controller routes
app.include_router(order_controller)

# Include wallet API routes
app.include_router(wallet_router)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to Dropship Nexus Order Service API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True) 