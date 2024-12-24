CREATE TABLE IF NOT EXISTS customer (
    customerid VARCHAR(20) PRIMARY KEY,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    dob DATE,
    address VARCHAR(100),
    phone VARCHAR(15),
    email VARCHAR(50),
    aadharcard VARCHAR(12),
    pancard VARCHAR(10)
);

CREATE TABLE if not EXISTS account (
    accountid VARCHAR(20) PRIMARY KEY,
    customerid VARCHAR(20),
    branchid VARCHAR(5),
    accounttype VARCHAR(10),
    accountnumber VARCHAR(20),
    openingdate DATETIME,
    balance DECIMAL(10,2),
    status VARCHAR(10),
    FOREIGN KEY (customerid) REFERENCES customer(customerid),
    FOREIGN KEY (branchid) REFERENCES branch(branchid)
);

CREATE TABLE IF NOT EXISTS branch (
    branchid VARCHAR(5) PRIMARY KEY,
    branchname VARCHAR(50),
    address VARCHAR(100)
);

INSERT IGNORE INTO branch (branchid, branchname, address) VALUES
('101', 'Downtown Branch', 'Downtown Address'),
('102', 'Midtown Branch', 'Midtown Address'),
('103', 'Uptown Branch', 'Uptown Address'),
('104', 'West End Branch', 'West End Address'),
('105', 'Eastside Branch', 'Eastside Address'),
('106', 'North Park Branch', 'North Park Address'),
('107', 'Southgate Branch', 'Southgate Address'),
('108', 'Riverfront Branch', 'Riverfront Address'),
('109', 'Lakeside Branch', 'Lakeside Address'),
('110', 'Hilltop Branch', 'Hilltop Address')
