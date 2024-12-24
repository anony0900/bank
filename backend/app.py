from flask import Flask, request, jsonify
import logging
import os
from flask_cors import CORS
from datetime import datetime
import random
import re
from validators import validate_email, validate_aadhar, validate_pan, validate_balance
from pymongo import MongoClient, errors


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow requests from all origins

# MongoDB URI for connection (ensure your credentials and cluster details are correct)
uri = "mongodb+srv://anony:atlas@cluster0.f18iy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a MongoDB client
client = MongoClient(uri)

# Access the 'bank' database
db = client["bank"]


collection1 = db["customer"]
collection2 = db["account"]


@app.route('/open_account', methods=['POST'])
def open_account():

    data = request.form
    files = request.files
    pancard_file = files.get('pancard_doc')
    aadhar_file = files.get('aadhar_doc')
    
    for file in [pancard_file, aadhar_file]:
        if not pancard_file or not aadhar_file:
            return jsonify({"error": "Missing required documents"}), 400
        elif not file or file.filename.split('.')[-1].lower() not in ['pdf', 'jpg']:
            return jsonify({"error": "Invalid document format. Only PDF and JPG are allowed."}), 400
    
    try:
        current_date = datetime.now().strftime('%d%H%M%S')
        customerid = f"{current_date}"



        # Create main uploads directory if it doesn't exist
        base_upload_dir = 'uploads'
        os.makedirs(base_upload_dir, exist_ok=True)

        customer_dir = os.path.join(base_upload_dir, customerid)
        os.makedirs(customer_dir, exist_ok=True)

        pancard_filename = f"pan_{pancard_file.filename}"
        aadhar_filename = f"aadhar_{aadhar_file.filename}"

        pancard_path = os.path.join(customer_dir, pancard_filename)
        aadhar_path = os.path.join(customer_dir, aadhar_filename)

        pancard_file.save(pancard_path)
        aadhar_file.save(aadhar_path)
        


        email = data['email']
        aadharcard = data['aadharcard']
        pancard = data['pancard']



        # Validate data
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        if not validate_aadhar(aadharcard):
            return jsonify({'error': 'Invalid Aadhar number'}), 400
        
        if not validate_pan(pancard):
            return jsonify({'error': 'Invalid PAN format'}), 400
        
        


        # for acount table
        account_type = data.get('accounttype')
        balance = float(data.get('balance', 0))

        # Validate balance based on account type
        is_valid_balance, balance_error = validate_balance(account_type, balance)
        if not is_valid_balance:
            return jsonify({"error": balance_error}), 400



        accountid = int(str(customerid)[::-1])
        branchid = data['branchid']
        accounttype = data['accounttype']
        accountnumber = datetime.now().strftime('%y%m%H%M%S')
        openingdate = datetime.now()
        balance = float(data['balance'])
        status = 'active'

        customer_values = ({
            "customerid":customerid,
            "firstname":data['firstname'], 
            "lastname":data['lastname'], 
            "dob":data['dob'], 
            "address":data['address'], 
            "phone":data['phone'], 
            "email":email, 
            "aadharcard":aadharcard,
            "pancard":pancard
        }
        )
        account_values = ({
           "accountid": accountid,
           "customerid": customerid,
           "branchid": branchid,
          "accounttype":  accounttype,
          "accountnumber":  accountnumber,
          "openingdate":  openingdate,
            "balance":balance,
         "status":   status
        }
        )
        
        collection1.insert_one(customer_values)
        collection2.insert_one(account_values)
        
        
        return jsonify({
            "message": "Account created successfully!",
            "customer_id": customerid,
            "accountnumber":accountnumber}), 201 
    
    except errors.ServerSelectionTimeoutError as err:
        # Handle connection timeout error (e.g., unable to connect to the server)
        return jsonify({"error": f"Database connection error: {err}"}), 500
    
    except errors.OperationFailure as err:
        # Handle operation failure (e.g., unauthorized, other MongoDB errors)
        return jsonify({"error": f"Database operation error: {err}"}), 500
    
    except Exception as err:
        print(f"Error details: {str(err)}")  # Add this for debugging
        return jsonify({"error": f"An unexpected error occurred: {str(err)}"}), 500
    
        print(f"Error details: {str(err)}")  # Add this for debugging
        return jsonify({"error": f"An unexpected error occurred: {str(err)}"}), 500
    

# Route to fetch account information based on customerid and accountnumber
@app.route('/get_details', methods=['POST'])
def get_account_info():
    try:
        data = request.get_json()
        customer_id = data.get('customerid')
        account_number = data.get('accountnumber')

        result = collection2.find_one({'customerid':customer_id,'accountnumber':account_number})

        if result:
            result['_id'] = str(result['_id'])  # Convert ObjectId to string
            
            return jsonify({"result":result}), 200
        else:
            return jsonify({'message': 'Customer not found'}), 404

    except Exception as e:
        logging.error(f"Error: {str(e)}")  # Log the error
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/get_name', methods=['POST'])
def get_name_info():
    try:
        data = request.get_json()
        customer_id = data.get('customerid')

        result = collection1.find_one({'customerid':customer_id})

        if result:
            result['_id'] = str(result['_id']) 
            
            return jsonify({"result_name":result}), 200
        else:
            return jsonify({'message': 'Customer Name not found'}), 404

    except Exception as e:
        logging.error(f"Error: {str(e)}")  # Log the error
        return jsonify({'message': f'Error: {str(e)}'}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)