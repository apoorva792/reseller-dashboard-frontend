# Orders API Mock Server

This is a mock FastAPI server for testing the Orders functionality in your Dropship Nexus dashboard.

## Setup Instructions

1. Install the required Python packages:

```bash
pip install fastapi uvicorn python-multipart
```

2. Start the mock server:

```bash
cd backend-mock
python main.py
```

The server will start on http://localhost:8001

## Available Endpoints

- `GET /orders` - Get all orders with filtering options
- `GET /orders/{order_id}` - Get a specific order by ID
- `POST /orders/upload` - Upload orders via file upload

## API Documentation

Once the server is running, you can access the auto-generated Swagger docs at:

http://localhost:8001/docs

## Testing with the Frontend

The mock server provides 100 randomly generated orders. You can test:

1. Listing orders with different filters
2. Viewing order details
3. Uploading order files (any file format works for testing)

## Integration

Your frontend is already configured to work with this mock server. The `orderApi` in `src/lib/api.ts` is set up to connect to this backend on port 8001.

## Notes

- This is for development and testing purposes only
- The server has CORS enabled to allow requests from any origin
- No authentication is required for API calls in this mock 