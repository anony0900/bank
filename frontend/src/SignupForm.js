import React, { useState } from 'react';
import './App.css';
import Body from './Body';
import SuccessPage from './SuccessPage';
import { useNavigate } from 'react-router-dom';

const BRANCH_MAPPING = {
  '101': 'Downtown Branch',
  '102': 'Midtown Branch',
  '103': 'Uptown Branch',
  '104': 'West End Branch',
  '105': 'Eastside Branch',
  '106': 'North Park Branch',
  '107': 'Southgate Branch',
  '108': 'Riverfront Branch',
  '109': 'Lakeside Branch',
  '110': 'Hilltop Branch'
};


function SignupForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    dob: '',
    address: '',
    phone: '',
    email: '',
    aadharcard: '',
    pancard: '',
    accounttype: '',
    branchid: '',
    balance: '',
    pancard_doc: null,
    aadhar_doc: null
  });
  const [message, setMessage] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAadhar = (aadhar) => {
    return /^\d{12}$/.test(aadhar);
  };

  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 18;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let error = '';
    // Validate fields as they're being typed
    if (name === 'email' && value) {
      if (!validateEmail(value)) {
          error = 'Please enter a valid email address';
      }
    }
    else if (name === 'aadharcard' && value) {
        if (!validateAadhar(value)) {
            error = 'Aadhar card must be exactly 12 digits';
        }
    }
    else if (name === 'pancard' && value) {
        if (!validatePAN(value)) {
            error = 'PAN must be in format: ABCDE1234F';
        }
    }
    else if (name === 'dob' && value) {
      if (!validateAge(value)) {
          error = 'You must be at least 18 years old to open an account';
      }
    }
    else if (name === 'balance' && value) {
      const amount = parseFloat(value);
      if (formData.accounttype === 'savings' && amount < 1000) {
          error = 'Minimum initial deposit of ₹1000 is required for savings account';
      } else if (amount < 0) {
          error = 'Please enter a valid amount';
      }
    }
    else if (name === 'accounttype') {
        // Reset balance and error when switching account types
        setFormData(prevState => ({
            ...prevState,
            balance: ''
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            balance: ''
        }));
    }

    // Special handling for files
    if (files) {
      setFormData(prevState => ({
          ...prevState,
          [name]: files[0]
      }));
      return;
    }
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));

    // Update error state
    setErrors(prevErrors => ({
        ...prevErrors,
        [name]: error
    }));
  };
  const [errors, setErrors] = useState({
    email: '',
    aadharcard: '',
    pancard: '',
    dob: ''
  });


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    if (!validateAge(formData.dob)) {
      setErrors(prevErrors => ({
          ...prevErrors,
          dob: 'You must be at least 18 years old to open an account'
      }));
      setMessage('Please fix the validation errors before submitting.');
      return;
    }

    // Validate balance based on account type
    const balance = parseFloat(formData.balance);
    if (formData.accounttype === 'savings' && balance < 1000) {
        setErrors(prevErrors => ({
            ...prevErrors,
            balance: 'Minimum initial deposit of ₹1000 is required for savings account'
        }));
        setMessage('Please fix the validation errors before submitting.');
        return;
    }

    if (balance < 0) {
        setErrors(prevErrors => ({
            ...prevErrors,
            balance: 'Please enter a valid amount'
        }));
        setMessage('Please fix the validation errors before submitting.');
        return;
    }

    // Validate all fields before submission
    const validationErrors = {
      email: !validateEmail(formData.email) ? 'Invalid email address' : '',
      aadharcard: !validateAadhar(formData.aadharcard) ? 'Invalid Aadhar number' : '',
      pancard: !validatePAN(formData.pancard) ? 'Invalid PAN format' : ''
    };

    setErrors(validationErrors);

    // Check if there are any errors
    if (Object.values(validationErrors).some(error => error !== '')) {
        setMessage('Please fix the validation errors before submitting.');
        return;
    }

        
    // Convert aadhar to string and ensure PAN is uppercase
    const dataToSend = {
        ...formData,
        aadharcard: formData.aadharcard.toString(),
        pancard: formData.pancard.toUpperCase()
    };
    // Append all form data fields
    Object.keys(dataToSend).forEach(key => {
      formDataToSend.append(key, dataToSend[key]);
    });




    // Append all form data fields
    Object.keys(formData).forEach(key => {
      if (key === 'pancard_doc' || key === 'aadhar_doc') {
          if (formData[key]) {
              formDataToSend.append(key, formData[key]);
          }
      } else {
          formDataToSend.append(key, formData[key]);
      }
  });


    try {
      const response = await fetch('http://127.0.0.1:5000/open_account', {
        method: 'POST',
        body: formDataToSend
      });
      const data = await response.json();
      if (response.ok) {
          const accountTypeFormatted = formData.accounttype.charAt(0).toUpperCase() + formData.accounttype.slice(1);
          const branchName = BRANCH_MAPPING[formData.branchid];
          
          // Set account details for success page
          setAccountDetails({
            accountType: accountTypeFormatted,
            customerId: data.customer_id,
            accountId: data.accountnumber,
            branchName: branchName,
            balance: formData.balance
          });
          
          setShowSuccess(true);
          // Clear form
          setFormData({
              firstname: '',
              lastname: '',
              dob: '',
              address: '',
              phone: '',
              email: '',
              aadharcard: '',
              pancard: '',
              accounttype: '',
              branchid: '',
              balance: '',
              document: null
            });
      } else {
            setMessage(data.error || 'An error occurred');
        }
        // Log the response for debugging
        console.log('Server response:', data);
    } catch (error) {
        console.error('Error:', error);
        setMessage('An error occurred while creating the account.');
      }
  };


  return (
    <>
      {showSuccess ? (
        <SuccessPage 
          accountDetails={accountDetails}
          onClose={() => setShowSuccess(false)}
        />
      ) : (
        <Body 
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          formData={formData}
          errors={errors}
          message={message}
          BRANCH_MAPPING={BRANCH_MAPPING}
          navigate={navigate}
        />
      )}
    </>
  );
}

export default SignupForm;
