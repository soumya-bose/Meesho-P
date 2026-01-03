import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();

  const discountPercent = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product.id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/300x400?text=Product+Image";
          }}
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="wishlist-btn"
        >
          <Heart
            size={16}
            fill={isWishlisted ? "#ec4899" : "none"}
            color={isWishlisted ? "#ec4899" : "#4b5563"}
          />
        </button>

        {product.imageCount > 1 && (
          <div className="image-count-badge">
            +{product.imageCount - 1} More
          </div>
        )}
      </div>

      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>

        <div className="price-section">
          <span className="current-price">₹{product.price}</span>
          {product.mrp && (
            <>
              <span className="original-price">₹{product.mrp}</span>
              <span className="discount">{discountPercent}% off</span>
            </>
          )}
        </div>

        <div className="free-delivery">Free Delivery</div>

        <div className="rating-section">
          <div className="rating-badge">
            <span>{product.rating}</span>
            <span>★</span>
          </div>
          <span className="reviews-count">
            {product.reviews.toLocaleString()} Reviews
          </span>
          {product.isTrusted && <span className="trusted-badge">Trusted</span>}
        </div>
      </div>
    </div>
  );
};

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "https://benevolent-unicorn-186965.netlify.app/.netlify/functions";

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();
      console.log("Loaded products:", data);
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading products:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="homepage">
        <div className="header">
          <div className="header-content">
            <h1 className="header-title">Loading Products...</h1>
            <p className="header-subtitle">Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="homepage">
        <div className="header">
          <div className="header-content">
            <h1 className="header-title">Error Loading Products</h1>
            <p className="header-subtitle" style={{ color: "red" }}>
              {error}
            </p>
            <button
              onClick={loadProducts}
              style={{
                marginTop: "20px",
                padding: "12px 24px",
                background: "#9F2089",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      <div className="header">
        <div className="header-content">
          <h1 className="header-title">Products For You</h1>
          <p className="header-subtitle">{products.length}+ Products</p>
        </div>
      </div>

      <div className="products-container">
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="load-more-container">
        <button className="load-more-btn">Load More</button>
      </div>
    </div>
  );
};

export default Homepage;
