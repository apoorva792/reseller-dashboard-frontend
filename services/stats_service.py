from sqlalchemy.orm import Session
from models.user import Customer
from models.customer_balance import CustomerBalance
from models.wallet_transaction import WalletTransaction
from database.database import get_db
from datetime import datetime

class StatsService:
    @staticmethod
    def get_reseller_balance(customer_id: int, db: Session):
        balance_record = db.query(CustomerBalance).filter(CustomerBalance.customer_id == customer_id).first()
        if not balance_record:
            return {"message": "Balance not found", "currencies_balance": 0.00}

        return {
            "customer_id": customer_id,
            "currencies_balance": float(balance_record.currencies_balance)
        }
        
    @staticmethod
    def update_reseller_balance(customer_id: int, amount: float, transaction_type: str, description: str, db: Session):
        """
        Update a reseller's wallet balance
        
        Parameters:
        - customer_id: The ID of the customer
        - amount: The amount to add or subtract
        - transaction_type: "add" or "subtract"
        - description: A description of the transaction
        - db: Database session
        
        Returns:
        - The updated balance information
        """
        # Get or create balance record
        balance_record = db.query(CustomerBalance).filter(CustomerBalance.customer_id == customer_id).first()
        
        if not balance_record:
            # Create a new balance record
            balance_record = CustomerBalance(
                customer_id=customer_id,
                currencies_balance=0.0
            )
            db.add(balance_record)
        
        # Calculate new balance
        old_balance = float(balance_record.currencies_balance)
        new_balance = old_balance
        
        if transaction_type == "add":
            new_balance = old_balance + amount
        elif transaction_type == "subtract":
            if old_balance < amount:
                raise ValueError("Insufficient balance")
            new_balance = old_balance - amount
        else:
            raise ValueError("Invalid transaction type. Use 'add' or 'subtract'")
        
        # Update balance
        balance_record.currencies_balance = new_balance
        
        # Create transaction record
        transaction = WalletTransaction(
            customer_id=customer_id,
            amount=amount,
            transaction_type=transaction_type,
            description=description,
            balance_before=old_balance,
            balance_after=new_balance,
            created_at=datetime.now()
        )
        
        db.add(transaction)
        db.commit()
        
        return {
            "customer_id": customer_id,
            "old_balance": old_balance,
            "new_balance": new_balance,
            "transaction_id": transaction.id
        }
        
    @staticmethod
    def get_wallet_transactions(customer_id: int, transaction_type: str = None, page: int = 1, page_size: int = 20, db: Session = None):
        """
        Get wallet transaction history for a customer
        
        Parameters:
        - customer_id: The ID of the customer
        - transaction_type: Optional filter by transaction type ("add", "subtract", or None for all)
        - page: Page number for pagination
        - page_size: Number of items per page
        - db: Database session
        
        Returns:
        - List of transaction records
        """
        query = db.query(WalletTransaction).filter(WalletTransaction.customer_id == customer_id)
        
        if transaction_type:
            query = query.filter(WalletTransaction.transaction_type == transaction_type)
        
        # Order by most recent first
        query = query.order_by(WalletTransaction.created_at.desc())
        
        # Apply pagination
        total_count = query.count()
        transactions = query.offset((page - 1) * page_size).limit(page_size).all()
        
        return {
            "total_count": total_count,
            "page": page,
            "page_size": page_size,
            "transactions": [
                {
                    "id": t.id,
                    "amount": float(t.amount),
                    "transaction_type": t.transaction_type,
                    "description": t.description,
                    "balance_before": float(t.balance_before),
                    "balance_after": float(t.balance_after),
                    "created_at": t.created_at.isoformat()
                }
                for t in transactions
            ]
        } 