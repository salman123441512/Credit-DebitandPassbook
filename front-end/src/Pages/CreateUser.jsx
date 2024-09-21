import React, { useState } from 'react';
import { createUser } from '../Services/api';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    aadharCard: '',
    panCard: '',
    address: '',
    image: null // Set image to null initially to handle file input
  });

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      // Handle file input for image
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData(); // Using FormData to handle file upload
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('aadharCard', formData.aadharCard);
    formDataToSend.append('panCard', formData.panCard);
    formDataToSend.append('address', formData.address);
    
    if (formData.image) {
      formDataToSend.append('image', formData.image); // Append the image file only if it exists
    }

    try {
      const response = await createUser(formDataToSend); // Send the form data to the backend
      alert(`User created successfully! Account Number: ${response.data.accountNumber}`);
      setFormData({ name: '', email: '', phone: '', aadharCard: '', panCard: '', image: null, address: '' }); // Reset the form
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating user');
    }
  };

  return (
    <div className="container">
      <h2>Create User</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data"> {/* enctype for file upload */}
        <input
          type="text"
          className="form-control mb-2"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          className="form-control mb-2"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          className="form-control mb-2"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          className="form-control mb-2"
          name="aadharCard"
          placeholder="Aadhar Card"
          value={formData.aadharCard}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          className="form-control mb-2"
          name="panCard"
          placeholder="Pan Card"
          value={formData.panCard}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          className="form-control mb-2"
          name="image"
          onChange={handleChange}
          accept="image/*"
        />
        <input
          type="text"
          className="form-control mb-2"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-primary">Create User</button>
      </form>
    </div>
  );
};

export default CreateUser;
