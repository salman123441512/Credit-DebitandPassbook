import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function Ticket() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch contact data
  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contactus');
      setContacts(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching data');
      setLoading(false);
    }
  };

  // Delete contact by ID
  const deleteContact = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/contactus/${id}`);
      // Refresh data after delete
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error('Error deleting contact', error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Define columns for the DataGrid
  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'subject', headerName: 'Subject', width: 200 },
    { field: 'message', headerName: 'Message', width: 500 },
    {
      field: 'action',
      headerName: 'Action',
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => deleteContact(params.row._id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <div className='mt-5 container-fluid' style={{ height: 500, width: '100%' }}>
        <h3 className='mb-3'>This is Your All Contactus Data</h3>
      <DataGrid
        rows={contacts}
        columns={columns}
        pageSize={10}
        getRowId={(row) => row._id}
        disableSelectionOnClick
        checkboxSelection={false}
      />
    </div>
  );
}
