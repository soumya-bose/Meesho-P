import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeleteAccount = () => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || '';

  const handleDeleteAccount = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      navigate('/');
      return;
    }

    setIsDeleting(true);

    try {
      // Delete user
      await axios.delete(`${API_URL}/users/${user.id}`);
      
      // Delete user's cart items
      const cartResponse = await axios.get(`${API_URL}/cart?userId=${user.id}`);
      const cartItems = cartResponse.data;
      
      for (const item of cartItems) {
        await axios.delete(`${API_URL}/cart/${item.id}`);
      }
      
      // Clear localStorage
      localStorage.removeItem('user');
      
      // Redirect to home
      navigate('/');
    } catch (err) {
      console.error('Failed to delete account:', err);
      alert('Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="delete-account-page">
      <div className="delete-account-container">
        <h1 className="delete-account-title">Delete Account</h1>
        
        <div className="delete-account-warning">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#f43397"/>
          </svg>
          
          <div className="warning-text">
            <h2>Are you sure you want to delete your account?</h2>
            <p>You will not be able to access your personal data including your old orders, saved addresses, payment methods etc.</p>
          </div>
        </div>

        <div className="delete-account-info">
          <h3>What will happen:</h3>
          <ul>
            <li>All your personal information will be permanently deleted</li>
            <li>Your order history will be removed</li>
            <li>Saved addresses and payment methods will be deleted</li>
            <li>You won't be able to track your existing orders</li>
            <li>Your wishlist items will be lost</li>
          </ul>
        </div>

        <div className="delete-account-actions">
          <button 
            className="cancel-delete-btn"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
          
          <button 
            className="confirm-delete-btn"
            onClick={() => setShowConfirmation(true)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete My Account'}
          </button>
        </div>

        {showConfirmation && (
          <div className="confirmation-modal">
            <div className="confirmation-content">
              <h3>Final Confirmation</h3>
              <p>This action cannot be undone. Are you absolutely sure?</p>
              
              <div className="confirmation-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowConfirmation(false)}
                  disabled={isDeleting}
                >
                  No, Keep My Account
                </button>
                
                <button 
                  className="delete-btn"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Forever'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAccount;
