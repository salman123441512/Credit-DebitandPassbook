import React from 'react';

export default function Setting() {
  // Example user data (replace with actual user data from state or props)
  const user = {
    image: "https://via.placeholder.com/150", // Placeholder image (replace with actual URL)
    name: "Shushil Kumar",
    
    email: "admin@example.com",
    phone: "+1 234 567 890",
    totalAmount: "100,000" // Example amount
  };

  return (
    <div className="container mt-3" style={{ border: "2px solid blue", borderRadius: "10px", padding: "20px" }}>
      <div className="row">
        {/* Left Column for Image */}
        <div className="col-md-6">
          <div className="row mt-3">
            {/* Admin Image */}
            <div className="col-md-6 text-center">
              <img
                src={user.image}
                alt="Admin"
                style={{
                  height: "110px",
                  width: "110px",
                  border: "2px solid green",
                  borderRadius: "50%"
                }}
              />
            </div>

            {/* Admin Info */}
            <div className="col-md-6">
              <h4 className="mt-3">{user.name}</h4>
             
              <p>
                <i className="bi bi-envelope"></i> {user.email}
              </p>
              <p>
                <i className="bi bi-telephone"></i> {user.phone}
              </p>
              <p>
                <i className="bi bi-currency-rupee"></i> <b>{user.totalAmount}</b>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column for Additional Information */}
        <div className="col-md-6 text-center d-flex align-items-center">
          {/* Update Profile Button */}
          <button className="btn btn-primary" style={{ padding: "10px 20px", fontSize: "16px" }}>
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
