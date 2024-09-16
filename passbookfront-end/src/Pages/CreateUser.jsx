import React, { useState } from 'react';
import { createUser } from '../Services/api';

const CreateUser = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', accountNumber: '', aadharCard: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData);
      alert('User created successfully');
      setFormData({ name: '', email: '', phone: '', accountNumber: '', aadharCard: '' });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container">
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" className='form-control mb-2' name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" className='form-control mb-2' name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="tel" className='form-control mb-2' name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <input type="text" className='form-control mb-2' name="accountNumber" placeholder="Account Number" value={formData.accountNumber} onChange={handleChange} required />
        <input type="text" className='form-control mb-2' name="aadharCard" placeholder="Aadhar Card" value={formData.aadharCard} onChange={handleChange} required />
        <button type="submit" className='btn btn-primary'>Create User</button>
      </form>
    </div>
  );
};

export default CreateUser;