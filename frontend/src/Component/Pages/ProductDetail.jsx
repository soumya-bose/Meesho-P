import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [showAddedPopup, setShowAddedPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:3001';

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      setProduct(response.data);
      
      // প্রথম available size select করো
      if (response.data.sizes && response.data.sizes.length > 0) {
        setSelectedSize(response.data.sizes[0]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to load product:', err);
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      navigate('/?login=true');
      return;
    }

    try {
      // Check if product already exists in cart
      const existingCartResponse = await axios.get(
        `${API_URL}/cart?userId=${user.id}&productId=${product.id}&size=${selectedSize}`
      );

      if (existingCartResponse.data.length > 0) {
        // Update quantity
        const existingItem = existingCartResponse.data[0];
        await axios.patch(`${API_URL}/cart/${existingItem.id}`, {
          quantity: existingItem.quantity + 1
        });
      } else {
        // Add new item
        const cartItem = {
          id: Date.now().toString(),
          userId: user.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: selectedSize,
          quantity: 1,
          addedAt: new Date().toISOString()
        };
        await axios.post(`${API_URL}/cart`, cartItem);
      }

      setShowAddedPopup(true);
      setTimeout(() => setShowAddedPopup(false), 2000);
      
      // Reload header to update cart count
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const handleBuyNow = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      navigate('/?login=true');
      return;
    }

    await handleAddToCart();
    setTimeout(() => {
      navigate('/cart');
    }, 500);
  };

  if (loading) {
    return (
      <div className="loading" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '20px',
        color: '#666'
      }}>
        Loading product...
      </div>
    );
  };

  if (!product) {
    return (
      <div className="loading" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        gap: '20px'
      }}>
        <h2 style={{fontSize: '24px', color: '#666'}}>Product not found</h2>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '12px 32px',
            background: '#9F2089',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-images">
          <div className="main-image">
            <img 
              src={product.image} 
              alt={product.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x800?text=Product+Image';
              }}
            />
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="price-section">
            <span className="current-price">₹{product.price}</span>
            {product.mrp && (
              <>
                <span className="original-price">₹{product.mrp}</span>
                <span className="discount-badge">{discount}% OFF</span>
              </>
            )}
          </div>

          <div className="rating-section">
            <div className="rating-badge">
              <span>{product.rating}</span>
              <span>★</span>
            </div>
            <span className="reviews-text">
              {product.reviews.toLocaleString()} Ratings, {product.reviews.toLocaleString()} Reviews
            </span>
          </div>

          <div className="free-delivery-banner">
            Free Delivery
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="size-selector">
              <h3>Select Size</h3>
              <div className="size-options">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    <div>{size}</div>
                    <div className="size-price">₹{product.price}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="product-highlights">
            <div className="highlights-header">
              <h3>Product Highlights</h3>
              <button className="copy-btn">COPY</button>
            </div>

            <div className="highlights-grid">
              {product.occasion && (
                <div className="highlight-item">
                  <div className="highlight-label">Occasion</div>
                  <div className="highlight-value">{product.occasion}</div>
                </div>
              )}
              {product.dupattaColor && (
                <div className="highlight-item">
                  <div className="highlight-label">Dupatta Color</div>
                  <div className="highlight-value">{product.dupattaColor}</div>
                </div>
              )}
              {product.fit && (
                <div className="highlight-item">
                  <div className="highlight-label">Fit/ Shape</div>
                  <div className="highlight-value">{product.fit}</div>
                </div>
              )}
              {product.stitchType && (
                <div className="highlight-item">
                  <div className="highlight-label">Stitch Type</div>
                  <div className="highlight-value">{product.stitchType}</div>
                </div>
              )}
            </div>
          </div>

          <div className="action-buttons">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              Add to Cart
            </button>
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {showAddedPopup && (
        <div className="added-popup">
          <div className="added-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Added to Cart!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;