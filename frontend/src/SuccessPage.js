import React from 'react';
import './SuccessPage.css';

const SuccessPage = ({ accountDetails, onClose }) => {
    return (
        <div className="success-page-overlay">
            <div className="success-page-content">
                <div className="success-header">
                <svg 
                    className="success-icon" 
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M7 13l3 3 20-20"></path>
                </svg>
                    <h2>Account Created Successfully!</h2>
                </div>

                <div className="account-details">
                    <div className="detail-row">
                        <span className="label">Account Type:</span>
                        <span className="value">{accountDetails.accountType} Account</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Customer ID:</span>
                        <span className="value">{accountDetails.customerId}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Account Number:</span>
                        <span className="value">{accountDetails.accountId}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Branch:</span>
                        <span className="value">{accountDetails.branchName}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Initial Balance:</span>
                        <span className="value">₹{accountDetails.balance}</span>
                    </div>
                </div>

                <div className="success-footer">
                    <p className="thank-you-message">
                        Thank you for choosing our banking services!
                    </p>
                    <button className="close-button" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;