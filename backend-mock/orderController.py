from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Query
from fastapi.responses import JSONResponse
from typing import List, Optional
import json
from datetime import datetime, timedelta
import random
import csv
from io import StringIO

router = APIRouter()

# Mock data generator
def generate_mock_orders(count=50):
    statuses = ["shipped", "processing", "delivered", "pending", "paid", "cancelled", "awaiting-payment", "ticketed", "abnormal"]
    marketplaces = ["Amazon", "Flipkart", "Meesho", "Shopify", "Others"]
    
    orders = []
    for i in range(1, count + 1):
        order_date = datetime.now() - timedelta(days=random.randint(1, 60))
        status = random.choice(statuses)
        
        order = {
            "order_id": f"ORD-{100000 + i}",
            "marketplace": random.choice(marketplaces),
            "status": status,
            "amount": round(random.uniform(500, 15000), 2),
            "date_purchased": order_date.strftime("%Y-%m-%d"),
            "delivery_name": f"Customer {i}",
            "delivery_address": f"Address {i}, City, Country",
            "delivery_phone": f"+91 {random.randint(7000000000, 9999999999)}",
            "items": [
                {
                    "item_id": f"ITEM-{i}-1",
                    "product_name": f"Product {i}-1",
                    "quantity": random.randint(1, 5),
                    "price": round(random.uniform(100, 3000), 2)
                }
            ]
        }
        
        # Add more items for some orders
        if random.random() > 0.7:
            for j in range(2, random.randint(3, 6)):
                order["items"].append({
                    "item_id": f"ITEM-{i}-{j}",
                    "product_name": f"Product {i}-{j}",
                    "quantity": random.randint(1, 3),
                    "price": round(random.uniform(100, 3000), 2)
                })
        
        orders.append(order)
    
    return orders

# Pre-generate some mock orders
mock_orders = generate_mock_orders(100)

# Helper function to filter orders
def filter_orders(orders, from_date=None, to_date=None, order_search_item=None, source_option=None, status=None):
    filtered_orders = orders.copy()
    
    # Filter by status
    if status:
        filtered_orders = [order for order in filtered_orders if order["status"] == status]
    
    # Filter by marketplace (source)
    if source_option and source_option != "All":
        filtered_orders = [order for order in filtered_orders if order["marketplace"] == source_option]
    
    # Filter by date range
    if from_date and from_date.strip():
        try:
            from_datetime = datetime.strptime(from_date, "%Y-%m-%d")
            filtered_orders = [
                order for order in filtered_orders 
                if datetime.strptime(order["date_purchased"], "%Y-%m-%d") >= from_datetime
            ]
        except ValueError:
            # Skip date filtering if format is invalid
            pass
    
    if to_date and to_date.strip():
        try:
            to_datetime = datetime.strptime(to_date, "%Y-%m-%d")
            filtered_orders = [
                order for order in filtered_orders 
                if datetime.strptime(order["date_purchased"], "%Y-%m-%d") <= to_datetime
            ]
        except ValueError:
            # Skip date filtering if format is invalid
            pass
    
    # Filter by search term (across order ID or recipient name)
    if order_search_item and order_search_item.strip():
        search_term = order_search_item.lower()
        filtered_orders = [
            order for order in filtered_orders 
            if (search_term in order["order_id"].lower() or 
                search_term in order["delivery_name"].lower())
        ]
    
    return filtered_orders

# Helper function to paginate results
def paginate_orders(orders, page=1, page_size=20):
    total_count = len(orders)
    start_idx = (page - 1) * page_size
    end_idx = min(start_idx + page_size, total_count)  # Prevent out of bounds
    
    paginated_orders = orders[start_idx:end_idx]
    
    return {
        "orders": paginated_orders,
        "total_count": total_count
    }

@router.get('/orders/get-all-orders')
async def get_all_orders(
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
    order_search_item: Optional[str] = None,
    source_option: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    filtered_orders = filter_orders(
        mock_orders, 
        from_date, 
        to_date, 
        order_search_item, 
        source_option
    )
    return paginate_orders(filtered_orders, page, page_size)

@router.get('/orders/get-confirmed-orders')
async def get_confirmed_orders(
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
    order_search_item: Optional[str] = None,
    source_option: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    # Filter by confirmed status - we'll consider 'paid' as confirmed
    filtered_orders = filter_orders(
        mock_orders, 
        from_date, 
        to_date, 
        order_search_item, 
        source_option, 
        status="paid"
    )
    return paginate_orders(filtered_orders, page, page_size)

@router.get('/orders/get-unshipped-orders')
async def get_unshipped_orders(
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
    order_search_item: Optional[str] = None,
    source_option: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    filtered_orders = filter_orders(
        mock_orders, 
        from_date, 
        to_date, 
        order_search_item, 
        source_option, 
        status="processing"
    )
    return paginate_orders(filtered_orders, page, page_size)

@router.get('/orders/get-unpaid-orders')
async def get_unpaid_orders(
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
    order_search_item: Optional[str] = None,
    source_option: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    filtered_orders = filter_orders(
        mock_orders, 
        from_date, 
        to_date, 
        order_search_item, 
        source_option, 
        status="awaiting-payment"
    )
    return paginate_orders(filtered_orders, page, page_size)

@router.get('/orders/get-returned-orders')
async def get_returned_orders(
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
    order_search_item: Optional[str] = None,
    source_option: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    # Consider 'abnormal' as returned for this mock
    filtered_orders = filter_orders(
        mock_orders, 
        from_date, 
        to_date, 
        order_search_item, 
        source_option, 
        status="abnormal"
    )
    return paginate_orders(filtered_orders, page, page_size)

@router.get('/orders/get-cancelled-orders')
async def get_cancelled_orders(
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
    order_search_item: Optional[str] = None,
    source_option: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    filtered_orders = filter_orders(
        mock_orders, 
        from_date, 
        to_date, 
        order_search_item, 
        source_option, 
        status="cancelled"
    )
    return paginate_orders(filtered_orders, page, page_size)

@router.get('/orders/order/{order_id}')
async def get_order_by_id(order_id: str):
    # Find the order with the given ID
    for order in mock_orders:
        if order["order_id"] == order_id:
            return order
    
    # If no order is found, raise a 404 error
    raise HTTPException(status_code=404, detail=f"Order with ID {order_id} not found")

@router.post('/orders/upload')
async def upload_orders(file: UploadFile = File(...)):
    try:
        # Read the file content
        content = await file.read()
        
        # Process CSV file
        content_str = content.decode('utf-8')
        csv_reader = csv.DictReader(StringIO(content_str))
        
        # Validate CSV structure (just checking if we can read rows)
        rows = list(csv_reader)
        if not rows:
            raise HTTPException(status_code=422, detail="The uploaded CSV file is empty or has no valid rows")
        
        # Count of processed orders
        orders_processed = len(rows)
        
        # In a real implementation, you would save these orders to a database
        
        return {
            "status": "success",
            "orders_processed": orders_processed,
            "message": f"Successfully processed {orders_processed} orders from {file.filename}"
        }
    except UnicodeDecodeError:
        raise HTTPException(status_code=422, detail="The file is not a valid CSV or contains unsupported characters")
    except csv.Error as e:
        raise HTTPException(status_code=422, detail=f"CSV parsing error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process order file: {str(e)}")

# Legacy endpoint for compatibility
@router.get('/orders')
async def get_orders_legacy(
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
    order_search_item: Optional[str] = None,
    source_option: Optional[str] = None,
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    filtered_orders = filter_orders(
        mock_orders, 
        from_date, 
        to_date, 
        order_search_item, 
        source_option,
        status
    )
    return paginate_orders(filtered_orders, page, page_size) 