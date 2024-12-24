// CustomerDetailsPage.js
import React from 'react';
import './CustomerDetailsPage.css';

const CustomerDetailsPage = ({ customerDetails,customerName, onClose }) => {
    return (
        <div className="success-page-overlay">
            <div className="success-page-content">
                <div className="success-header">
                    <h2>Customer's Details</h2>
                </div>

                <div className="account-details">
                    <div className="detail-row">
                        <span className="label">Name:</span>
                        <span className="value">{`${customerName.firstname} ${customerName.lastname}`}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Account Type:</span>
                        <span className="value">{customerDetails.accounttype || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Status:</span>
                        <span className="value">{customerDetails.status}</span>
                    </div>
                    <div className="detail-row">
                        <span className="label">Balance:</span>
                        <span className="value">₹{customerDetails.balance}</span>
                    </div>
                </div>

                <div className="success-footer">
                    <button className="close-button" type="submit" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailsPage;
