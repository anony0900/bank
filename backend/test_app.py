import pytest
from app import app
import os
import io
from unittest.mock import patch, MagicMock
from datetime import datetime

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def mock_db_connection():
    with patch('app.get_db_connection') as mock_conn:
        mock_cursor = MagicMock()
        mock_conn.return_value.cursor.return_value = mock_cursor
        yield mock_conn

@pytest.fixture
def sample_form_data():
    return {
        'email': 'test@example.com',
        'aadharcard': '123456789012',
        'pancard': 'ABCDE1234F',
        'firstname': 'John',
        'lastname': 'Doe',
        'dob': '1990-01-01',
        'address': '123 Test St',
        'phone': '1234567890',
        'branchid': 'BR001',
        'accounttype': 'savings',
        'balance': '5000'
    }

@pytest.fixture
def sample_files():
    pancard_content = b"fake pdf content"
    aadhar_content = b"fake pdf content"
    
    pancard_file = (io.BytesIO(pancard_content), "pancard.pdf")
    aadhar_file = (io.BytesIO(aadhar_content), "aadhar.pdf")
    
    return {
        'pancard_doc': pancard_file,
        'aadhar_doc': aadhar_file
    }

def test_open_account_success(client, mock_db_connection, sample_form_data, sample_files):
    """Test successful account creation"""
    with patch('app.validate_email', return_value=True), \
         patch('app.validate_aadhar', return_value=True), \
         patch('app.validate_pan', return_value=True), \
         patch('app.validate_balance', return_value=(True, None)), \
         patch('os.makedirs'), \
         patch('app.datetime') as mock_datetime:
        
        # Mock datetime to return consistent values
        mock_datetime.now.return_value = datetime(2024, 1, 1, 12, 0, 0)
        
        response = client.post(
            '/open_account',
            data={**sample_form_data, **sample_files},
            content_type='multipart/form-data'
        )
        
        assert response.status_code == 201
        response_data = response.get_json()
        assert "message" in response_data
        assert "customer_id" in response_data
        assert "accountnumber" in response_data
        assert response_data["message"] == "Account created successfully!"

def test_open_account_invalid_file_format(client, sample_form_data):
    """Test account creation with invalid file format"""
    invalid_files = {
        'pancard_doc': (io.BytesIO(b"fake content"), "pancard.txt"),
        'aadhar_doc': (io.BytesIO(b"fake content"), "aadhar.pdf")
    }
    
    response = client.post(
        '/open_account',
        data={**sample_form_data, **invalid_files},
        content_type='multipart/form-data'
    )
    
    assert response.status_code == 400
    assert b"Invalid document format" in response.data

def test_open_account_invalid_email(client, mock_db_connection, sample_form_data, sample_files):
    """Test account creation with invalid email"""
    with patch('app.validate_email', return_value=False):
        response = client.post(
            '/open_account',
            data={**sample_form_data, **sample_files},
            content_type='multipart/form-data'
        )
        
        assert response.status_code == 400
        assert b"Invalid email format" in response.data

def test_open_account_invalid_aadhar(client, mock_db_connection, sample_form_data, sample_files):
    """Test account creation with invalid Aadhar"""
    with patch('app.validate_email', return_value=True), \
         patch('app.validate_aadhar', return_value=False):
        
        response = client.post(
            '/open_account',
            data={**sample_form_data, **sample_files},
            content_type='multipart/form-data'
        )
        
        assert response.status_code == 400
        assert b"Invalid Aadhar number" in response.data

def test_open_account_invalid_pan(client, mock_db_connection, sample_form_data, sample_files):
    """Test account creation with invalid PAN"""
    with patch('app.validate_email', return_value=True), \
         patch('app.validate_aadhar', return_value=True), \
         patch('app.validate_pan', return_value=False):
        
        response = client.post(
            '/open_account',
            data={**sample_form_data, **sample_files},
            content_type='multipart/form-data'
        )
        
        assert response.status_code == 400
        assert b"Invalid PAN format" in response.data

def test_open_account_invalid_balance(client, mock_db_connection, sample_form_data, sample_files):
    """Test account creation with invalid balance"""
    with patch('app.validate_email', return_value=True), \
         patch('app.validate_aadhar', return_value=True), \
         patch('app.validate_pan', return_value=True), \
         patch('app.validate_balance', return_value=(False, "Invalid balance")):
        
        response = client.post(
            '/open_account',
            data={**sample_form_data, **sample_files},
            content_type='multipart/form-data'
        )
        
        assert response.status_code == 400
        assert b"Invalid balance" in response.data

def test_open_account_database_error(client, mock_db_connection, sample_form_data, sample_files):
    """Test account creation with database error"""
    with patch('app.validate_email', return_value=True), \
         patch('app.validate_aadhar', return_value=True), \
         patch('app.validate_pan', return_value=True), \
         patch('app.validate_balance', return_value=(True, None)), \
         patch('os.makedirs'):
        
        # Simulate database error
        mock_db_connection.return_value.cursor.side_effect = Exception("Database error")
        
        response = client.post(
            '/open_account',
            data={**sample_form_data, **sample_files},
            content_type='multipart/form-data'
        )
        
        assert response.status_code == 500
        assert b"Database error" in response.data