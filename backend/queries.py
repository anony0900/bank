# queries.py

# Customer related queries
insert_customer= """
    INSERT INTO customer (customerid, firstname, lastname, dob, address, phone, email, aadharcard, pancard) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

# Account related queries
insert_account = """
    INSERT INTO account (accountid, customerid, branchid, accounttype, 
                accountnumber, openingdate, balance, status)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
"""

fetch_info = """
    SELECT c.firstname, c.lastname, a.accounttype, a.balance, a.status
    FROM customer c
    JOIN account a ON c.customerid = a.customerid
    WHERE c.customerid = %s AND a.accountnumber = %s
"""
