from datetime import datetime
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from models.ordersReal import Order
from typing import Optional, Dict, List

def get_order_with_products(order_id: int, db: Session):
    order = db.query(Order)\
              .options(joinedload(Order.products))\
              .filter(Order.orders_id == order_id)\
              .first()

    if not order:
        return None

    return {
        "order_id": order.orders_id,
        "order_serial": order.orders_serial,
        "buyer_id": order.orders_buyer_id,
        "seller_id": order.orders_seller_id,
        "status": order.orders_status,
        "date_purchased": order.date_purchased,
        "china_process": order.china_process,
        "products": [
            {
                "product_id": p.product_id,
                "po_id": p.po_id,
                "model": p.product_model,
                "quantity": p.product_quantity,
                "price": float(p.product_price),
                "final_price": float(p.final_price),
                "name": p.pd_name,
            }
            for p in order.products
        ]
    }
    
def get_unpaid_orders(
    user_id: int,
    db: Session,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    page_no: Optional[int] = 0,
    number_rows: Optional[int] = 20,
):
    query = db.query(Order).options(joinedload(Order.products))
    
    # Special case for user_id 0 - don't filter by buyer_id
    if user_id != 0:
        query = query.filter(Order.orders_buyer_id == user_id)
        
    query = query.filter(Order.orders_status_payment == "PU")

    if from_date:
        query = query.filter(Order.date_purchased >= from_date)
    if to_date:
        query = query.filter(Order.date_purchased <= to_date)

    query = query.order_by(Order.date_purchased.desc())

    if number_rows:
        query = query.offset(page_no * number_rows).limit(number_rows)

    orders = query.all()

    result = []
    for order in orders:
        products = order.products
        quantity = sum(p.product_quantity for p in products)
        result.append({
            "order_id": order.orders_id,
            "order_serial": order.orders_serial,
            "date_purchased": order.date_purchased,
            "status": order.orders_status,
            "status_payment": order.orders_status_payment,
            "total_quantity": quantity,
            "products": [
                {
                    "product_id": p.product_id,
                    "quantity": p.product_quantity,
                    "price": float(p.product_price),
                    "final_price": float(p.final_price),
                    "model": p.product_model,
                    "po_id": p.po_id
                } for p in products
            ]
        })

    return {
        "total_count": len(result),
        "page": page_no + 1,
        "page_size": number_rows,
        "orders": result
    }
    
def get_buyer_wait_for_confirm_orders(
    db: Session,
    user_id: int,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    order_search_item: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
    source_option: Optional[str] = "ALL",
    store_by: Optional[str] = "last_modified"
):
    order_status = ['OS', 'OB']
    order_status_payment = 'PD'
    order_status_shipping = 'SS'

    query = db.query(Order).options(joinedload(Order.products))
    
    # Special case for user_id 0 - don't filter by buyer_id
    if user_id != 0:
        query = query.filter(Order.orders_buyer_id == user_id)
        
    query = query.filter(Order.orders_status.in_(order_status))\
        .filter(Order.orders_status_payment == order_status_payment)\
        .filter(Order.orders_status_shipping == order_status_shipping)

    if from_date:
        query = query.filter(Order.date_purchased >= from_date)
    if to_date:
        query = query.filter(Order.date_purchased <= to_date)
    if order_search_item:
        like_val = f"%{order_search_item}%"
        query = query.filter(
            (Order.amazon_order_id == order_search_item) |
            (Order.orders_serial == order_search_item) |
            (Order.delivery_name.ilike(like_val))
        )
    if source_option and source_option != "ALL":
        query = query.filter(Order.source == int(source_option))

    sort_map = {
        "date": Order.date_purchased.asc(),
        "datedesc": Order.date_purchased.desc(),
        "price": (Order.currency_value + Order.orders_shipping_fee).asc(),
        "pricedesc": (Order.currency_value + Order.orders_shipping_fee).desc(),
        "orderid": Order.orders_serial.asc(),
        "orderiddesc": Order.orders_serial.desc(),
        "last_modified": Order.last_modified.desc()
    }
    query = query.order_by(sort_map.get(store_by, Order.last_modified.desc()))

    total_count = query.count()
    orders = query.offset((page - 1) * page_size).limit(page_size).all()

    result = []
    for order in orders:
        products = order.products
        quantity = sum(p.product_quantity for p in products)

        result.append({
            "order_id": order.orders_id,
            "order_serial": order.orders_serial,
            "date_purchased": order.date_purchased,
            "status": order.orders_status,
            "status_payment": order.orders_status_payment,
            "status_shipping": order.orders_status_shipping,
            "total_quantity": quantity,
            "products": [
                {
                    "product_id": p.product_id,
                    "quantity": p.product_quantity,
                    "price": float(p.product_price),
                    "final_price": float(p.final_price),
                    "model": p.product_model,
                    "po_id": p.po_id
                }
                for p in products
            ]
        })

    return {
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
        "orders": result
    }


def get_return_or_dispute_orders(
    db: Session,
    user_id: int,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    order_search_item: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
    source_option: Optional[str] = "ALL",
    store_by: Optional[str] = "last_modified"
):
    status_return = ['RA', 'RR', 'RC', 'RS', 'RD']
    status_dispute = ['DP', 'DD']

    query = db.query(Order).options(joinedload(Order.products))
    
    # Special case for user_id 0 - don't filter by buyer_id
    if user_id != 0:
        query = query.filter(Order.orders_buyer_id == user_id)
        
    query = query.filter(
            (Order.orders_status_return.in_(status_return)) |
            (Order.orders_status_dispute.in_(status_dispute))
        )

    if from_date:
        query = query.filter(Order.date_purchased >= from_date)
    if to_date:
        query = query.filter(Order.date_purchased <= to_date)
    if order_search_item:
        like = f"%{order_search_item}%"
        query = query.filter(
            or_(
                Order.amazon_order_id == order_search_item,
                Order.orders_serial == order_search_item,
                Order.delivery_name.ilike(like)
            )
        )
    if source_option != "ALL":
        query = query.filter(Order.source == int(source_option))

    sort_map = {
        "date": Order.date_purchased.asc(),
        "datedesc": Order.date_purchased.desc(),
        "price": (Order.currency_value + Order.orders_shipping_fee).asc(),
        "pricedesc": (Order.currency_value + Order.orders_shipping_fee).desc(),
        "orderid": Order.orders_serial.asc(),
        "orderiddesc": Order.orders_serial.desc(),
        "last_modified": Order.last_modified.desc()
    }
    query = query.order_by(sort_map.get(store_by, Order.last_modified.desc()))

    total_count = query.count()
    orders = query.offset((page - 1) * page_size).limit(page_size).all()

    results = []
    for order in orders:
        products = order.products
        quantity = sum(p.product_quantity for p in products)

        results.append({
            "order_id": order.orders_id,
            "order_serial": order.orders_serial,
            "date_purchased": order.date_purchased,
            "status": order.orders_status,
            "status_return": order.orders_status_return,
            "status_dispute": order.orders_status_dispute,
            "total_quantity": quantity,
            "products": [
                {
                    "product_id": p.product_id,
                    "quantity": p.product_quantity,
                    "price": float(p.product_price),
                    "final_price": float(p.final_price),
                    "model": p.product_model,
                    "po_id": p.po_id
                } for p in products
            ]
        })

    return {
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
        "orders": results
    }
    
def get_orders_for_combined_payment(  # Awaiting payment
    db: Session,
    user_id: int,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    order_search_item: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
    source_option: Optional[str] = "ALL",
    store_by: Optional[str] = "last_modified"
):
    order_status = ['OS', 'OB']
    order_status_payment = 'PU'
    order_status_dispute = ['DN', 'AD', 'DD']

    query = db.query(Order).options(joinedload(Order.products))
    
    # Special case for user_id 0 - don't filter by buyer_id
    if user_id != 0:
        query = query.filter(Order.orders_buyer_id == user_id)
        
    query = query.filter(Order.orders_status.in_(order_status)) \
        .filter(Order.orders_status_payment == order_status_payment) \
        .filter(Order.orders_status_dispute.in_(order_status_dispute))

    if from_date:
        query = query.filter(Order.date_purchased >= from_date)
    if to_date:
        query = query.filter(Order.date_purchased <= to_date)
    if order_search_item:
        like_val = f"%{order_search_item}%"
        query = query.filter(
            or_(
                Order.amazon_order_id == order_search_item,
                Order.orders_serial == order_search_item,
                Order.delivery_name.ilike(like_val)
            )
        )
    if source_option != "ALL":
        query = query.filter(Order.source == int(source_option))

    # Sorting
    sort_map = {
        "date": Order.date_purchased.asc(),
        "datedesc": Order.date_purchased.desc(),
        "price": (Order.currency_value + Order.orders_shipping_fee).asc(),
        "pricedesc": (Order.currency_value + Order.orders_shipping_fee).desc(),
        "orderid": Order.orders_serial.asc(),
        "orderiddesc": Order.orders_serial.desc(),
        "last_modified": Order.last_modified.desc()
    }
    query = query.order_by(sort_map.get(store_by, Order.last_modified.desc()))

    total_count = query.count()
    orders = query.offset((page - 1) * page_size).limit(page_size).all()

    result = []
    for order in orders:
        products = order.products
        quantity = sum(p.product_quantity for p in products)

        result.append({
            "order_id": order.orders_id,
            "order_serial": order.orders_serial,
            "date_purchased": order.date_purchased,
            "status": order.orders_status,
            "status_payment": order.orders_status_payment,
            "status_dispute": order.orders_status_dispute,
            "total_quantity": quantity,
            "products": [
                {
                    "product_id": p.product_id,
                    "quantity": p.product_quantity,
                    "price": float(p.product_price),
                    "final_price": float(p.final_price),
                    "model": p.product_model,
                    "po_id": p.po_id
                } for p in products
            ]
        })

    return {
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
        "orders": result
    }
    
def get_cancelled_orders(
    db: Session,
    user_id: int,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    order_search_item: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
    source_option: Optional[str] = "ALL",
    store_by: Optional[str] = "last_modified"
):
    query = db.query(Order).options(joinedload(Order.products))
    
    # Special case for user_id 0 - don't filter by buyer_id
    if user_id != 0:
        query = query.filter(Order.orders_buyer_id == user_id)
        
    query = query.filter(Order.orders_status == "OC")  # Cancelled

    if from_date:
        query = query.filter(Order.date_purchased >= from_date)
    if to_date:
        query = query.filter(Order.date_purchased <= to_date)
    if order_search_item:
        like_val = f"%{order_search_item}%"
        query = query.filter(
            (Order.amazon_order_id == order_search_item) |
            (Order.orders_serial == order_search_item) |
            (Order.delivery_name.ilike(like_val))
        )
    if source_option and source_option != "ALL":
        query = query.filter(Order.source == int(source_option))

    sort_map = {
        "date": Order.date_purchased.asc(),
        "datedesc": Order.date_purchased.desc(),
        "price": (Order.currency_value + Order.orders_shipping_fee).asc(),
        "pricedesc": (Order.currency_value + Order.orders_shipping_fee).desc(),
        "orderid": Order.orders_serial.asc(),
        "orderiddesc": Order.orders_serial.desc(),
        "last_modified": Order.last_modified.desc()
    }
    query = query.order_by(sort_map.get(store_by, Order.last_modified.desc()))

    total_count = query.count()
    orders = query.offset((page - 1) * page_size).limit(page_size).all()

    results = []
    for order in orders:
        products = order.products
        quantity = sum(p.product_quantity for p in products)

        results.append({
            "order_id": order.orders_id,
            "order_serial": order.orders_serial,
            "date_purchased": order.date_purchased,
            "status": order.orders_status,
            "total_quantity": quantity,
            "products": [
                {
                    "product_id": p.product_id,
                    "quantity": p.product_quantity,
                    "price": float(p.product_price),
                    "final_price": float(p.final_price),
                    "model": p.product_model,
                    "po_id": p.po_id
                }
                for p in products
            ]
        })

    return {
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
        "orders": results
    }
def get_buyer_wait_for_shipping_orders(
    db: Session,
    user_id: int,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    order_search_item: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
    source_option: Optional[str] = "ALL",
    store_by: Optional[str] = "last_modified"
):
    order_status = ['OS', 'OB']
    order_status_payment = 'PD'
    order_status_shipping = ['SU', 'SP']

    query = db.query(Order).options(joinedload(Order.products))
    
    # Special case for user_id 0 - don't filter by buyer_id
    if user_id != 0:
        query = query.filter(Order.orders_buyer_id == user_id)
        
    query = query.filter(Order.orders_status.in_(order_status)) \
        .filter(Order.orders_status_payment == order_status_payment) \
        .filter(Order.orders_status_shipping.in_(order_status_shipping))

    if from_date:
        query = query.filter(Order.date_purchased >= from_date)
    if to_date:
        query = query.filter(Order.date_purchased <= to_date)
    if order_search_item:
        like_val = f"%{order_search_item}%"
        query = query.filter(
            or_(
                Order.amazon_order_id == order_search_item,
                Order.orders_serial == order_search_item,
                Order.delivery_name.ilike(like_val)
            )
        )
    if source_option != "ALL":
        query = query.filter(Order.source == int(source_option))

    sort_map = {
        "date": Order.date_purchased.asc(),
        "datedesc": Order.date_purchased.desc(),
        "price": (Order.currency_value + Order.orders_shipping_fee).asc(),
        "pricedesc": (Order.currency_value + Order.orders_shipping_fee).desc(),
        "orderid": Order.orders_serial.asc(),
        "orderiddesc": Order.orders_serial.desc(),
        "last_modified": Order.last_modified.desc()
    }
    query = query.order_by(sort_map.get(store_by, Order.last_modified.desc()))

    total_count = query.count()
    orders = query.offset((page - 1) * page_size).limit(page_size).all()

    result = []
    for order in orders:
        products = order.products
        quantity = sum(p.product_quantity for p in products)

        result.append({
            "order_id": order.orders_id,
            "order_serial": order.orders_serial,
            "date_purchased": order.date_purchased,
            "status": order.orders_status,
            "status_payment": order.orders_status_payment,
            "status_shipping": order.orders_status_shipping,
            "total_quantity": quantity,
            "products": [
                {
                    "product_id": p.product_id,
                    "quantity": p.product_quantity,
                    "price": float(p.product_price),
                    "final_price": float(p.final_price),
                    "model": p.product_model,
                    "po_id": p.po_id
                }
                for p in products
            ]
        })

    return {
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
        "orders": result
    }

    
def get_all_orders_for_user(
    db: Session,
    user_id: int,
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    order_search_item: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
    source_option: Optional[str] = "ALL",
    store_by: Optional[str] = "last_modified"
) -> Dict:
    query = db.query(Order).options(joinedload(Order.products))
    
    # Special case for user_id 0 - don't filter by buyer_id
    if user_id != 0:
        query = query.filter(Order.orders_buyer_id == user_id)

    if from_date:
        query = query.filter(Order.date_purchased >= from_date)
    if to_date:
        query = query.filter(Order.date_purchased <= to_date)
    if order_search_item:
        like = f"%{order_search_item}%"
        query = query.filter(
            or_(
                Order.amazon_order_id == order_search_item,
                Order.orders_serial == order_search_item,
                Order.delivery_name.ilike(like)
            )
        )
    if source_option and source_option != "ALL":
        query = query.filter(Order.source == int(source_option))

    sort_map = {
        "date": Order.date_purchased.asc(),
        "datedesc": Order.date_purchased.desc(),
        "price": (Order.currency_value + Order.orders_shipping_fee).asc(),
        "pricedesc": (Order.currency_value + Order.orders_shipping_fee).desc(),
        "orderid": Order.orders_serial.asc(),
        "orderiddesc": Order.orders_serial.desc(),
        "last_modified": Order.last_modified.desc()
    }
    query = query.order_by(sort_map.get(store_by, Order.date_purchased.desc()))

    total_count = query.count()
    orders = query.offset((page - 1) * page_size).limit(page_size).all()

    results = []
    for order in orders:
        products = order.products
        quantity = sum(p.product_quantity for p in products)
        results.append({
            "order_id": order.orders_id,
            "order_serial": order.orders_serial,
            "date_purchased": order.date_purchased,
            "status": order.orders_status,
            "status_payment": order.orders_status_payment,
            "status_shipping": order.orders_status_shipping,
            "status_return": order.orders_status_return,
            "status_dispute": order.orders_status_dispute,
            "total_quantity": quantity,
            "products": [
                {
                    "product_id": p.product_id,
                    "quantity": p.product_quantity,
                    "price": float(p.product_price),
                    "final_price": float(p.final_price),
                    "model": p.product_model,
                    "po_id": p.po_id
                } for p in products
            ]
        })

    return {
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
        "orders": results
    } 