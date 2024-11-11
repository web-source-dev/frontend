import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';

const ViewData = () => {
  const [users, setUsers] = useState([]);
  
  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users from the backend API
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`);
        setUsers(response.data); // Load users with their initial `isAllowed` status
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Handle checkbox change to show/hide QR code and update database
  const handleCheckboxChange = async (userId, isChecked) => {
    try {
      // Update the user data in the database with the new `isAllowed` status
      await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, { isAllowed: isChecked });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isAllowed: isChecked } : user
        )
      );
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="view-data-container">
      <h1>All Users</h1>
      <div className="user-list">
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="user-card">
              {/* Status Text */}
              <div
                className={`status-text ${user.isAllowed ? 'active' : 'inactive'}`}
              >
                {user.isAllowed ? 'Active' : 'Inactive'}
              </div>
              
              <div className="flex-jfha">
                <h3>{user.name}</h3>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <p>Address: {user.address}</p>

                {/* Checkbox to toggle QR code visibility */}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={user.isAllowed} // Checkbox reflects initial state from backend
                    onChange={(e) => handleCheckboxChange(user._id, e.target.checked)}
                  />
                  <span>Show QR Code</span>
                </label>
              </div>
              
              {/* Show QR Code only if isAllowed is true */}
              {user.isAllowed && (
                <div className="qr-code">
                  <QRCodeCanvas
                    // Dynamically set the URL with the user's ID
                    value={`${process.env.REACT_APP_API_URL}/user/${user._id}`} // Use dynamic base URL from environment variable
                    size={70}
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No users available.</p>
        )}
      </div>
    </div>
  );
};

export default ViewData;
