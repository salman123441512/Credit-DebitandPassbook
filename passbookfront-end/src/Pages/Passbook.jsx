// Passbook.jsx
import React, { useEffect, useState } from 'react';
import { getTransactionsByAccountNumber } from '../Services/api';

const Passbook = ({ accountNumber }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionResponse = await getTransactionsByAccountNumber(accountNumber);
        setTransactions(transactionResponse.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        alert('Error fetching transactions');
      }
    };

    if (accountNumber) {
      fetchTransactions();
    }
  }, [accountNumber]);

  return (
    <>
      <h4>Passbook (Last 5 Transactions)</h4>
    <div className="mt-4 table table-responsive table-hover">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Transaction Type</th>
            <th>Amount</th>
            <th>Balance After Transaction</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{new Date(transaction.date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                <td>{new Date(transaction.date).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                <td>{transaction.type}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.newTotalAmount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default Passbook;
