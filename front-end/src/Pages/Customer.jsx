// src/Customer.js
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Customer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users'); // Replace with your actual API
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Define columns for DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'accountNumber', headerName: 'Account Number', width: 200 },
    { field: 'totalAmount', headerName: 'Total Amount', width: 150 },
    {
      field: 'address',
      headerName: 'Address',
      width: 250,
      
    },
  ];

  return (
    <div className="container-fluid">
      <Box sx={{ height: 600, width: '100%', marginTop: 4 }}>
        <div className="d-flex justify-content-between mb-3">
          <h2>All Customers</h2>
          <Link to='/'><button className="btn btn-primary" style={{height:"50px",width:'150px'}}> + Create Account</button></Link> 
        </div>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <DataGrid
            rows={users.map((user, index) => ({ id: index + 1, ...user }))}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
          />
        )}
      </Box>
    </div>
  );
}
