# validators.py
import re

def validate_email(email):
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(pattern, email) is not None

def validate_aadhar(aadhar):
    return len(str(aadhar)) == 12 and str(aadhar).isdigit()

def validate_pan(pan):
    pattern = r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
    return re.match(pattern, pan) is not None

def validate_balance(account_type, balance):
    if balance < 0:
        return False, "Please enter a valid amount"
    
    if account_type == 'savings' and balance < 1000:
        return False, "Minimum initial deposit of ₹1000 is required for savings account"
    
    return True, ""
