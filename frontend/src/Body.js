import React from 'react';

const Body = ({ 
    handleSubmit, 
    handleChange, 
    formData, 
    errors, 
    message, 
    BRANCH_MAPPING,
    navigate
}) => {
    return (
        
        
        <div className='container'>
            <h1>Welcome to NASA Bank!</h1>
            <h2>Please proceed with your account opening process</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="firstname">First Name</label>
                        <input
                            type="text"
                            id="firstname"
                            name="firstname"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname">Last Name</label>
                        <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dob">DOB</label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            onChange={handleChange}
                            className={errors.dob ? 'error' : ''}
                            required
                        />
                        {errors.dob && <span className="error-message">{errors.dob}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            required
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="aadharcard">Aadhar Card Number</label>
                        <input
                            type="number"
                            id="aadharcard"
                            name="aadharcard"
                            onChange={handleChange}
                            className={errors.aadharcard ? 'error' : ''}
                            maxLength="12"
                            required
                        />
                        {errors.aadharcard && <span className="error-message">{errors.aadharcard}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="pancard">Pan Card Number</label>
                        <input
                            type="text"
                            id="pancard"
                            name="pancard"
                            onChange={handleChange}
                            className={errors.pancard ? 'error' : ''}
                            maxLength="10"
                            required
                        />
                        {errors.pancard && <span className="error-message">{errors.pancard}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="document">Upload Documents</label>
                        <div className="document-upload-container">
                            <div className="document-upload-item">
                                <label>Pan Card</label>
                                <input
                                    type="file"
                                    id="document1"
                                    name="pancard_doc"
                                    accept=".pdf,.jpg"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="document-upload-item">
                                <label>Aadhar Card</label>
                                <input
                                    type="file"
                                    id="document2"
                                    name="aadhar_doc"
                                    accept=".pdf,.jpg"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="dropdown-group">
                        <label htmlFor="accounttype" className="required">Account Type</label>
                        <div className="radio-group">
                            <div className={`radio-item ${formData.accounttype === 'savings' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    id="savings"
                                    name="accounttype"
                                    value="savings"
                                    checked={formData.accounttype === 'savings'}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="savings">Savings</label>
                            </div>
                            <div className={`radio-item ${formData.accounttype === 'current' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    id="current"
                                    name="accounttype"
                                    value="current"
                                    checked={formData.accounttype === 'current'}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="current">Current</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="balance" className="required">
                            {formData.accounttype === 'savings' 
                                ? 'Initial Deposit (Min ₹1000)' 
                                : 'Initial Deposit Amount'}
                        </label>
                        <input
                            type="number"
                            id="balance"
                            name="balance"
                            value={formData.balance}
                            onChange={handleChange}
                            min={formData.accounttype === 'savings' ? "1000" : "0"}
                            required
                            className={errors.balance ? 'error' : ''}
                            placeholder={formData.accounttype === 'savings' 
                                ? 'Minimum ₹1000 required' 
                                : 'Enter deposit amount'}
                        />
                        {errors.balance && <span className="error-message">{errors.balance}</span>}
                    </div>

                    <div className="branch-container">
                        <label htmlFor="branchid" className="required">Branch</label>
                        <select
                            id="branchid"
                            name="branchid"
                            value={formData.branchid}
                            onChange={handleChange}
                            required
                            className="select-input"
                        >
                            <option value="">Select Branch</option>
                            {Object.entries(BRANCH_MAPPING).map(([id, name]) => (
                                <option key={id} value={id}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="button-container">
                    <button type="submit" onClick={() => navigate(-1)} className="back-button">Back</button>
                    <button type="reset" className="reset-button">Reset</button>
                    <button type="submit">Open Account</button>
                </div>
            </form>

            {message && (
                <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default Body;
