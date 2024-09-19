import React, { useEffect, useState } from 'react';
import { getTransactionsByAccountNumber } from '../Services/api';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

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

  const columns = [
    { field: 'date', headerName: 'Date', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'time', headerName: 'Time', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'type', headerName: 'Transaction Type', width: 200, headerAlign: 'center', align: 'center' },
    { field: 'amount', headerName: 'Amount', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'newTotalAmount', headerName: 'Balance After Transaction', width: 250, headerAlign: 'center', align: 'center' },
  ];

  // Transform the data to match the structure required by DataGrid
  const rows = transactions.map((transaction, index) => {
    // Ensure transaction.date is in a valid format
    const date = new Date(transaction.date);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', transaction.date);
      return null;
    }

    return {
      id: index, // Unique key
      date: date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }),
      time: date.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
      type: transaction.type,
      amount: transaction.amount,
      newTotalAmount: transaction.newTotalAmount,
    };
  }).filter(row => row !== null); // Filter out invalid rows

  return (
    <Paper >
      <h4>Passbook (Last 5 Transactions)</h4>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10} // Show 10 rows per page
        rowsPerPageOptions={[10, 25, 50]} // Options for rows per page
        pagination
        autoHeight
        sx={{
          border: 0,
          '& .MuiDataGrid-cell': {
            textAlign: 'center' // Align the cell content to center
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
            textAlign: 'center', // Align the header text to center
          }
        }}
      />
    </Paper>
  );
};

export default Passbook;
