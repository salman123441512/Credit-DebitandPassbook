import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create a new user
export const createUser = (userData) => axios.post(`${API_URL}/users`, userData);

// Get user details by account number
export const getUserByAccountNumber = (accountNumber) => axios.get(`${API_URL}/users/${accountNumber}`);

// Update amount for user and add the transaction to passbook
export const updateAmount = (accountNumber, data) => axios.put(`${API_URL}/users/${accountNumber}/update-amount`, data);

// Get the last 5 transactions for the user's passbook
export const getTransactionsByAccountNumber = (accountNumber) => axios.get(`${API_URL}/users/${accountNumber}/transactions`);
