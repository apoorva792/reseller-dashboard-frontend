from fastapi.middleware.cors import CORSMiddleware

def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:8080",
            "http://192.168.0.116:8080",
            "http://172.19.128.1:8080"
        ],
        allow_credentials=False,  # Set to False since we're not using credentials yet
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=[
            "Content-Type",
            "Accept",
            "Authorization",
            "X-Requested-With",
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Methods",
            "Access-Control-Allow-Headers",
        ],
        expose_headers=[
            "Content-Type",
            "Authorization",
        ],
        max_age=3600,  # Cache preflight requests for 1 hour
    ) 