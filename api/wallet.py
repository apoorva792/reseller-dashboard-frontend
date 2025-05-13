from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional
from pydantic import BaseModel

from database.database import get_db
from services.stats_service import StatsService
from services.auth_service import AuthService, oauth2_scheme
from models.customer_balance import CustomerBalance

router = APIRouter(
    prefix="/wallet",
    tags=["wallet"],
    responses={404: {"description": "Not found"}},
)

class WalletUpdateRequest(BaseModel):
    amount: float
    transaction_type: str  # "add" or "subtract"
    description: Optional[str] = None

@router.get("/balance", response_model=Dict)
async def get_wallet_balance(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Get the current wallet balance for the authenticated user
    """
    try:
        # Verify token and get user ID
        user_id = AuthService.get_current_user_id(token)
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        # Get user's wallet balance using the existing service
        balance_data = StatsService.get_reseller_balance(user_id, db)
        
        return {
            "success": True,
            "data": balance_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/update", response_model=Dict[str, Any])
async def update_wallet_balance(
    request: WalletUpdateRequest,
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
):
    """
    Update the wallet balance by adding or subtracting an amount
    """
    try:
        # Verify token and get user ID
        user_id = AuthService.get_current_user_id(token)
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        description = request.description or f"Wallet {request.transaction_type} of {request.amount}"
        
        # Update balance using the enhanced service
        result = StatsService.update_reseller_balance(
            customer_id=user_id,
            amount=request.amount,
            transaction_type=request.transaction_type,
            description=description,
            db=db
        )
        
        return {
            "success": True,
            "data": result,
            "message": f"Wallet balance {request.transaction_type}ed successfully"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/transactions", response_model=Dict[str, Any])
async def get_wallet_transactions(
    transaction_type: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Get wallet transaction history for the authenticated user
    """
    try:
        # Verify token and get user ID
        user_id = AuthService.get_current_user_id(token)
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        # Validate transaction_type if provided
        if transaction_type and transaction_type not in ["add", "subtract"]:
            raise HTTPException(
                status_code=400, 
                detail="Invalid transaction_type. Must be 'add', 'subtract', or omitted for all transactions."
            )
        
        # Get transaction history
        transactions = StatsService.get_wallet_transactions(
            customer_id=user_id,
            transaction_type=transaction_type,
            page=page,
            page_size=page_size,
            db=db
        )
        
        return {
            "success": True,
            "data": transactions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 