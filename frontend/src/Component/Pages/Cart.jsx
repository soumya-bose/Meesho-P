import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/?login=true');
      return;
    }
    
    const userData = JSON.parse(savedUser);
    setUser(userData);
    loadCart(userData.id);
  }, [navigate]);

  const loadCart = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/cart?userId=${userId}`);
      setCartItems(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load cart:', err);
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/cart/${itemId}`);
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await axios.patch(`${API_URL}/cart/${item.id}`, {
        ...item,
        quantity: newQuantity
      });
      
      setCartItems(cartItems.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      ));
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const handleContinue = () => {
    navigate('/checkout');
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-page">
        <div className="cart-empty-container">
          <img 
            src="https://images.meesho.com/images/pow/empty-cart.webp" 
            alt="Empty Cart"
            className="empty-cart-image"
          />
          <h2>Your cart is empty</h2>
          <p>Just relax, let us help you find some first-class products</p>
          <button 
            className="start-shopping-btn"
            onClick={() => navigate('/')}
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div className="cart-steps">
          <div className="cart-step active">
            <div className="step-number">1</div>
            <div className="step-label">Cart</div>
          </div>
          <div className="cart-step">
            <div className="step-number">2</div>
            <div className="step-label">Address</div>
          </div>
          <div className="cart-step">
            <div className="step-number">3</div>
            <div className="step-label">Payment</div>
          </div>
          <div className="cart-step">
            <div className="step-number">4</div>
            <div className="step-label">Summary</div>
          </div>
        </div>
      </div>

      <div className="cart-content">
        <div className="cart-items-section">
          <h2 className="section-title">Product Details</h2>
          
          {cartItems.map(item => (
            <div key={item.id} className="cart-item-card">
              <div className="cart-item-left">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="cart-item-image"
                />
                
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <div className="cart-item-price">₹{item.price}</div>
                  <div className="cart-item-meta">
                    Size: {item.size} • Qty: {item.quantity}
                  </div>
                  
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                        className="qty-btn"
                      >
                        −
                      </button>
                      <span className="qty-display">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="remove-btn"
                    >
                      ✕ REMOVE
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="free-delivery-tag">Free Delivery</div>
            </div>
          ))}
        </div>

        <div className="cart-summary-section">
          <h3 className="summary-title">Price Details ({cartItems.length} Items)</h3>
          
          <div className="summary-row">
            <span>Total Product Price</span>
            <span>+ ₹{totalPrice}</span>
          </div>
          
          <div className="summary-total">
            <span>Order Total</span>
            <span>₹{totalPrice}</span>
          </div>
          
          <div className="summary-note">
            Clicking on 'Continue' will not deduct any money
          </div>
          
          <button 
            className="continue-btn"
            onClick={handleContinue}
          >
            Continue
          </button>
          
          <div className="safety-banner">
            <div className="safety-badge">Safe</div>
            <div className="safety-text">
              <div className="safety-title">Your Safety, Our Priority</div>
              <div className="safety-subtitle">
                We make sure that your package is safe at every point of contact
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
