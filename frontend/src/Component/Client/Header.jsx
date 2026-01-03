import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { BsCart } from "react-icons/bs";
import axios from 'axios';
import cod from "../../assets/cod.svg";
import returns from "../../assets/returns.svg";
import lowestPrice from "../../assets/lowest-price.svg";
import SignUpModal from "../Admin/SignUpModal";




export default function Header({ children }) {

  const navigate = useNavigate();

        const cardRowRef = useRef(null);

        const [searchQuery, setSearchQuery] = useState("");
        const [searchResults, setSearchResults] = useState([]);
        const [showSearchResults, setShowSearchResults] = useState(false);
        const [allProducts, setAllProducts] = useState([]);
        const searchRef = useRef(null);


          /*New State*/ 
          const [showMenu, setShowMenu] = useState(false);
          const [showSignUp, setShowSignUp] = useState(false);
          const [user, setUser] = useState(null);
          const [showSuccessPopup, setShowSuccessPopup] = useState(false);
           const [cartCount, setCartCount] = useState(0); 


           const API_URL = import.meta.env.VITE_API_URL || '';

             useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      loadCartCount(userData.id); 
    }
  }, []);

            // Check if user is logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

// 🔍 ALL PRODUCTS LOAD FOR SEARCH
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setAllProducts(response.data);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };
  fetchProducts();
}, []);


// Click outside handler
useEffect(() => {
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSearchResults(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);


   useEffect(() => {
  // Check if redirected from product page for login
  const params = new URLSearchParams(window.location.search);
  if (params.get('login') === 'true') {
    setShowSignUp(true);
    // Clean URL
    window.history.replaceState({}, '', '/');
  }
}, []);


useEffect(() => {
  const handleCartUpdate = () => {
    const user = localStorage.getItem('user');
    if (user) {
      loadCartCount(JSON.parse(user).id);
    }
  };

  window.addEventListener('cartUpdated', handleCartUpdate);
  
  return () => {
    window.removeEventListener('cartUpdated', handleCartUpdate);
  };
}, []);

  const loadCartCount = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/cart?userId=${userId}`);
      const totalCount = response.data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalCount);
    } catch (err) {
      console.error('Failed to load cart count:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowMenu(false);
  };



  // Search function
const handleSearch = (query) => {
  setSearchQuery(query);
  
  if (query.trim().length === 0) {
    setSearchResults([]);
    setShowSearchResults(false);
    return;
  }

  // Filter products based on search query
  const filtered = allProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase())
  );
  
  setSearchResults(filtered);
  setShowSearchResults(true);
};

// Handle product click
const handleProductClick = (productId) => {
  setShowSearchResults(false);
  setSearchQuery("");
  navigate(`/product/${productId}`);
};


const scrollRight = () => {
  cardRowRef.current.scrollBy({
    left: 248,
    behavior: "smooth",
  });
};

        
  return (
  /*====================
        WRAPPER DIV
  ====================== */

    <div className="header-wrapper">
  
    <header className="navbar">
      <div className="header-container">

        {/* Logo */}
        <div className="logo">
          <img
            width={150}
            src="https://www.meesho.com/assets/svgicons/meeshoLogo.svg"
            alt="meesho logo"
          />
        </div>

        
       {/* Search Bar */}
<div className="search-bar" ref={searchRef} style={{position: 'relative'}}>
  <IoSearch />
  <input
    className="search-items"
    placeholder="Try Saree, Kurti or Search by Product Code"
    type="text"
    value={searchQuery}
    onChange={(e) => handleSearch(e.target.value)}
    onFocus={() => searchQuery && setShowSearchResults(true)}
  />
  
  {/* Search Results Dropdown */}
  {showSearchResults && searchResults.length > 0 && (
    <div style={{
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      marginTop: '8px',
      maxHeight: '400px',
      overflowY: 'auto',
      zIndex: 1000
    }}>
      {searchResults.map((product) => (
        <div
          key={product.id}
          onClick={() => handleProductClick(product.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            cursor: 'pointer',
            borderBottom: '1px solid #f0f0f0'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'cover',
              borderRadius: '4px',
              marginRight: '12px'
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '14px',
              color: '#333',
              marginBottom: '4px'
            }}>
              {product.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px', fontWeight: '600' }}>
                ₹{product.price}
              </span>
              <span style={{
                fontSize: '12px',
                color: '#999',
                textDecoration: 'line-through'
              }}>
                ₹{product.mrp}
              </span>
              <span style={{
                fontSize: '12px',
                color: '#03a685',
                fontWeight: '600'
              }}>
                {Math.round((1 - product.price / product.mrp) * 100)}% OFF
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
  
  {/* No Results */}
  {showSearchResults && searchQuery && searchResults.length === 0 && (
    <div style={{
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      marginTop: '8px',
      padding: '24px',
      textAlign: 'center',
      zIndex: 1000
    }}>
      <div style={{ fontSize: '16px', color: '#666' }}>
        No products found
      </div>
    </div>
  )}
</div>

        {/* Right Menu */}
        <div className="nav-right">
          <span className="nav-link">Become a Supplier</span>
          <div className="empty-div"></div>

          <span className="nav-link">Investor Relations</span>
          <div className="empty-div"></div>


<div 
  className="profile-tab"
  onMouseEnter={() => setShowMenu(true)}
  onMouseLeave={() => setShowMenu(false)}
>
  <svg viewBox="0 0 24 24" className="profile-icon" width="20" height="20">
    <g clipPath="url(#user_svg__a)">
      <path d="M15.316 13.016c1.512-1.058 2.516-2.797 2.516-4.784A5.835 5.835 0 0 0 12 2.4a5.835 5.835 0 0 0-5.832 5.832 5.79 5.79 0 0 0 2.517 4.784C4.343 14.291 1.2 17.996 1.2 22.37v.022c0 .896.843 1.609 1.825 1.609h17.95c.983 0 1.825-.713 1.825-1.61v-.02c0-4.375-3.143-8.08-7.484-9.354ZM7.853 8.232a4.148 4.148 0 0 1 8.294 0 4.148 4.148 0 0 1-8.294 0Zm13.122 14.083H3.025a.245.245 0 0 1-.14-.032c.054-4.45 4.126-8.057 9.115-8.057 4.99 0 9.05 3.596 9.115 8.057a.245.245 0 0 1-.14.032Z" fill="#9F2089"></path>
    </g>
  </svg>
  <span className="profile-text">Profile</span>

  {showMenu && (
    <div className="dropdown-menu">
      <div className="menu-header">
        <div className="user-greeting">
          Hello {user ? user.name : 'User'}
        </div>
        {user && user.phone && (
          <div className="user-phone">+91 {user.phone}</div>
        )}
        <div className="menu-subtitle">
          {user ? 'Manage your account' : 'To access your Meesho account'}
        </div>
        {!user && (
          <button 
            className="signup-button"
            onClick={() => {
              setShowSignUp(true);
              setShowMenu(false);
            }}
          >
            Sign Up
          </button>
        )}
      </div>

      <div className="menu-divider"></div>

<div 
  className="menu-item" 
  onClick={() => {
    if (!user) {
      setShowSignUp(true);
      setShowMenu(false);
    } else {
      console.log('My Orders clicked');
      setShowMenu(false);
    }
  }}
>
  <svg viewBox="0 0 28 28" width="20" height="20" className="menu-icon">
    <g clipPath="url(#orders_svg__a)" fill="#333">
      <path d="M20.032 10.89c.227 0 .418.19.418.418v10.811c0 .228-.19.418-.418.418H7.89a.422.422 0 0 1-.417-.418V11.308c0-.228.19-.418.418-.418h12.14Zm0-1.473H7.89A1.89 1.89 0 0 0 6 11.308v10.811C6 23.154 6.846 24 7.89 24h12.142a1.89 1.89 0 0 0 1.89-1.89V11.308a1.902 1.902 0 0 0-1.89-1.89Z"></path>
      <path d="M13.961 5a4.87 4.87 0 0 0-4.873 4.864v2.84h.009c.019.39.333.704.732.704a.736.736 0 0 0 .731-.723V9.864a3.404 3.404 0 0 1 3.401-3.401 3.398 3.398 0 0 1 3.401 3.401v2.812c.01.399.333.722.732.722.389 0 .712-.313.731-.703h.01V9.864A4.875 4.875 0 0 0 13.96 5Z"></path>
    </g>
  </svg>
  <span>My Orders</span>
</div>

      {user && (
        <>
          <div className="menu-divider"></div>
          <div className="menu-item" onClick={handleLogout}>
            <span>Logout</span>
          </div>
        </>
      )}

      <div className="menu-divider"></div>

      <div 
  className="menu-item" 
  onClick={() => {
    navigate('/delete-account');
    setShowMenu(false);
  }}
>
  <span>Delete Account</span>
</div>
    </div>
  )}
</div>

 {/* ✅ Cart with Count Badge */}
            <div 
              className="nav-item cart-container" 
              onClick={() => {
                const user = localStorage.getItem('user');
                if (!user) {
                  setShowSignUp(true);
                } else {
                  navigate('/cart');
                }
              }}
            >
              <div style={{position: 'relative'}}>
                <BsCart />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </div>
              <span>Cart</span>
            </div>
        </div>
      </div>


{/* ================= 
        SUBHEADER 
    ================= */}

      <div className="subheader-scroll">
        <div className="subheader">
          <div className="subheader-list-item">

              {/* list-------1 */}
              <div className="subheader-item">
                           <span className="subheader-text">Popular</span>
                   <div className="has-dropdown">
                      <div className="dropdown-list">
                           <div>
                              <span className="dropdown-title">Featured On Meesho</span>
                           </div>
                              <a href="https://www.meesho.com/smartphones/pl/3y5b"><p>Smartphones</p></a>
                              <a href="https://www.meesho.com/top-brands/pl/3u77"><p>Top Brands</p></a>
                              <a href="https://www.meesho.com/shimla-apples/pl/6myd"><p>Shimla Apples</p></a>
                      </div>
              
      


                      <div className="dropdown-list">
                            <div>
                                <span className="dropdown-title">All Popular</span>
                            </div>
                                <a href="/jewellery/pl/9tx"> <p>Jewellery</p> </a>
                                <a href="/men-fashion/pl/1iue"><p>Men Fashion</p></a>
                                <a href="/kids-clothing/pl/9ok"><p>Kids</p></a>
                                <a href="/footwear/pl/15mz"><p>Footwear</p></a>
                                <a href="/beauty-products/pl/9on"><p>Beauty & Personal Care</p></a>
                                <a href="/grocery/pl/66zl"><p>Grocery</p></a>
                                <a href="/electronic-accessories/pl/6717"><p>Electronics</p></a>
                                <a href="/women-innerwear/pl/1mzg"><p>Innerwear & Nightwear</p></a>
                                <a href="/kitchen-utility/pl/66zv"><p>Kitchen & Appliances</p></a>
                                <a href="/bags/pl/8dy"><p>Bags & Luggage</p></a>
                                <a href="/personal-care-wellness/pl/66zi"><p>Healthcare</p></a>
                                <a href="/stationery/pl/1j49"><p>Stationery & Office Supplies</p></a>
                                <a href="/car-bike-accessories/pl/66zp"><p>Bike & Car</p></a>
                                <a href="/furniture/pl/67d4"><p>Furniture</p></a>
                        </div>
                  </div>
              </div>

{/* list-------2 */}
<div className="subheader-item">
  <span className="subheader-text">Kurti, Saree & Lehenga</span>

  <div className="has-dropdown">

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Sarees</span>
      </div>
      <a href="https://www.meesho.com/sarees/pl/3iy"><p>All Sarees</p></a>
      <a href="https://www.meesho.com/georgette-sarees/pl/3m1"><p>Georgette Sarees</p></a>
      <a href="https://www.meesho.com/chiffon-saree/pl/1ocy"><p>Chiffon Sarees</p></a>
      <a href="https://www.meesho.com/cotton-sarees/pl/3jh"><p>Cotton Sarees</p></a>
      <a href="https://www.meesho.com/super-net-saree/pl/4cq"><p>Net Sarees</p></a>
      <a href="https://www.meesho.com/silk-sarees/pl/3j4"><p>Silk Sarees</p></a>
      <a href="https://www.meesho.com/sarees-new-collection/pl/2kn"><p>New Collection</p></a>
      <a href="https://www.meesho.com/bridal-lehenga-store/pl/1ilu"><p>Bridal Sarees</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Kurtis</span>
      </div>
      <a href="https://www.meesho.com/women-kurtis/pl/3j0"><p>All Kurtis</p></a>
      <a href="https://www.meesho.com/anarkali-kurtis/pl/4pn"><p>Anarkali Kurtis</p></a>
      <a href="https://www.meesho.com/women-rayon-kurtis/pl/1n49"><p>Rayon Kurtis</p></a>
      <a href="https://www.meesho.com/pure-cotton-kurtis/pl/87h"><p>Cotton Kurtis</p></a>
      <a href="https://www.meesho.com/regular-kurtis/pl/4ys"><p>Straight Kurtis</p></a>
      <a href="https://www.meesho.com/knee-length-kurtis/pl/4uz"><p>Long Kurtis</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Kurta Sets</span>
      </div>
      <a href="https://www.meesho.com/men-kurta-sets/pl/1oqs"><p>All Kurta Sets</p></a>
      <a href="https://www.meesho.com/kurta-palazzo-set/pl/889"><p>Kurta Palazo Sets</p></a>
      <a href="/kurta-pant-set/pl/88k"><p>Kurta Pant Sets</p></a>
      <a href="/sharara-sets/pl/1gzz"><p>Sharara Sets</p></a>
      <a href="/anarkali-dresses/pl/1hb8"><p>Anarkali Kurta Sets</p></a>
      <a href="/kurta-pant-set/pl/88k"><p>Cotton Kurta Sets</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Dupatta Sets</span>
      </div>
      <a href="/unstitched-dupatta-sets/pl/12bb"><p>All Dupatta Sets</p></a>
      <a href="/cotton-kurta/pl/4j7"><p>Cotton Sets</p></a>
      <a href="/rayon-dupattas/pl/9t5"><p>Rayon Sets</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Suits & Dress Material</span>
      </div>
      <a href="/traditional-dress-material/pl/4oo"><p>All Dress Materials</p></a>
      <a href="/pakistani-suits-dress-material/pl/52u"><p>Pakistani Dress Materials</p></a>
      <a href="/cotton-silk-dress-material/pl/4j9"><p>Cotton Dress Materials</p></a>
      <a href="/traditional-dress-material/pl/4oo"><p>Patiala Dress Materials</p></a>
      <a href="/banarasi-silk-dress-material/pl/4h8"><p>Banarasi Dress Materials</p></a>
      <a href="/party-women-suits-dress-materials/pl/3on"><p>Party Wear Dress Materials</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Lehengas</span>
      </div>
      <a href="/lehengas/pl/316"><p>All Lehengas</p></a>
      <a href="/lehengas-favourite/pl/61qa"><p>Shoppers Favourite</p></a>
      <a href="/trending-lehengas/pl/61qb"><p>Trending Lehengas</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Blouses</span>
      </div>
      <a href="/blouses/pl/315"><p>All Blouses</p></a>
      <a href="/blouses-favourite/pl/6m6h"><p>Shopping Favourite</p></a>
      <a href="/blouses-for-women/pl/1j1m"><p>Trending Blouses</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Gowns</span>
      </div>
      <a href="/ethnic-dresses/pl/8bi"><p>All Gowns</p></a>
      <a href="/gowns-favourite/pl/61qg"><p>Shoppers Favourite</p></a>
      <a href="/unstitched-gowns/pl/5jy"><p>Trending Gowns</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Other Ethnic Wear</span>
      </div>
      <a href="/traditional-skirts/pl/7kp"><p>Ethnic Skirts & Bottomwear</p></a>
      <a href="/jackets-and-shrugs/pl/1bq"><p>Ethnic Jackets & Shrugs</p></a>
      <a href="/muslimwear/pl/674d"><p>Islamic Fashion</p></a>
      <a href="/petticoats/pl/3ui"><p>Petticoats</p></a>
      <a href="/unstitched-blouse-piece/pl/51k"><p>Blouse Pieces</p></a>
      <a href="/dupattas/pl/3lz"><p>Dupattas</p></a>
    </div>

  </div>
</div>


{/* list-------3 */}
<div className="subheader-item">

  <span className="subheader-text">Women Western</span>

  <div className="has-dropdown">

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Topwear</span>
      </div>
      <a href="/tops-ladies/pl/3ja"><p>Tops & Tunics</p></a>
      <a href="/western-wear-women/pl/4aus"><p>All Topwear</p></a>
      <a href="/dresses-women/pl/4ah"><p>Dresses</p></a>
      <a href="/women-tshirts/pl/1le4"><p>T-shirts</p></a>
      <a href="/gowns-women/pl/3l9"><p>Gowns</p></a>
      <a href="/women-tops-bottom-sets/pl/19f"><p>Tops & Bottom Sets</p></a>
      <a href="/branded-shirts/pl/1lep"><p>Shirts</p></a>
      <a href="/knee-length-jumpsuits/pl/5ad"><p>Jumpsuits</p></a>
      <a href="/women-topwear-trends/pl/40w0"><p>New Trends</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Bottom Wear</span>
      </div>
      <a href="/bottom-western-wear-women/pl/4auu"><p>All Bottomwear</p></a>
      <a href="/regular-fit-jeans-jeggings/pl/3ant"><p>Jeans & Jeggings</p></a>
      <a href="/palazzo-pants/pl/3jb"><p>Palazzos</p></a>
      <a href="/womens-trousers/pl/3no"><p>Trousers & Pants</p></a>
      <a href="/leggings-women/pl/3mt"><p>Leggings</p></a>
      <a href="/shorts-skirts/pl/1ro4"><p>Shorts & Skirts</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Winterwear</span>
      </div>
      <a href="/jackets-women/pl/3tcy"><p>Jackets</p></a>
      <a href="/sweatshirts-women/pl/8hf"><p>Sweatshirts</p></a>
      <a href="/sweaters-women/pl/8jb"><p>Sweaters</p></a>
      <a href="/shrugs-capes-ponchos/pl/3si"><p>Capes, Shrug & Ponchos</p></a>
      <a href="/coats/pl/405b"><p>Coats</p></a>
      <a href="/waistcoats/pl/a5h"><p>Blazers & Waistcoats</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Plus Size</span>
      </div>
      <a href="/plus-size-dresses-gowns/pl/40ws"><p>Plus Size - Dresses & Gowns</p></a>
      <a href="/plus-size-tops-tees/pl/40zt"><p>Plus Size - Tops & Tees</p></a>
      <a href="/bottomwear/pl/1jhg"><p>Plus size - Bottomwear</p></a>
    </div>

  </div>
</div>

{/* list-------4 */}
<div className="subheader-item">

  <span className="subheader-text">Lingerie</span>

  <div className="has-dropdown">

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Innerwear</span>
      </div>
      <a href="/women-innerwear-bra/pl/1i56"><p>Women Bra</p></a>
      <a href="/panty-liners/pl/9nl"><p>Women Panties</p></a>
      <a href="/lingerie-women/pl/3vn"><p>Other Innerwear</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Sleepwear</span>
      </div>
      <a href="/night-suits-women/pl/3jw"><p>Women Nightsuits</p></a>
      <a href="/nightdresses-women/pl/3nm"><p>Women Nightdress</p></a>
      <a href="/short-nighty-nightdress/pl/360"><p>Other Sleepwear</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Sports Wear</span>
      </div>
      <a href="/women-active-bottomwear/pl/35i"><p>Sports Bottomwear</p></a>
      <a href="/sports-bra/pl/5u9"><p>Sports Bra</p></a>
      <a href="/women-sportswear-top-bottom-sets/pl/1rqk"><p>Top & Bottom Sets</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Maternity Wear</span>
      </div>
      <a href="/maternity-maternity-kurtis/pl/168x"><p>Kurti & Topwear</p></a>
      <a href="/feeding-maternity-bras/pl/9sh"><p>Feeding Bras</p></a>
      <a href="/maternity-bottomwear-women/pl/xs9"><p>Briefs & Bottomwear</p></a>
    </div>

  </div>
</div>


{/* list-------5 */}
<div className="subheader-item">

  <span className="subheader-text">Kids & Toys</span>

  <div className="has-dropdown">

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Kids Clothing</span>
      </div>
      <a href="/girls-clothing/pl/4079"><p>Girls</p></a>
      <a href="/boys-clothes/pl/1nbz"><p>Boys</p></a>
      <a href="/baby-clothing/pl/9th"><p>Babies</p></a>
      <a href="/girls-clothing-sets/pl/9tc"><p>Clothing Sets</p></a>
      <a href="/frocks-girls/pl/3le"><p>Frocks & Dresses</p></a>
      <a href="/kids-tops/pl/9ti"><p>T-Shirt & Polos</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Kids Toys</span>
      </div>
      <a href="/toys/pl/9tk"><p>Toys & Games</p></a>
      <a href="/toys-summer-picks/pl/4dgv"><p>Summer Picks</p></a>
      <a href="/toys-best-sellers/pl/66zg"><p>Best Sellers</p></a>
      <a href="/toys-baby-gears/pl/40vq"><p>Baby Gears</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Kids Accessories</span>
      </div>
      <a href="/kids-bags-bagpacks/pl/68ov"><p>Bags & Backpacks</p></a>
      <a href="/kids-accessories/pl/1gvb"><p>Kids Accessories</p></a>
      <a href="/kids-party-items/pl/66go"><p>Party Items</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Baby Care</span>
      </div>
      <a href="/mom-and-baby-care/pl/9tu"><p>View All</p></a>
      <a href="/baby-bedding-sets/pl/9tl"><p>Baby Bedding &amp; Accessories</p></a>
      <a href="/baby-mother-personal-care/pl/670h"><p>Newborn Care</p></a>
      <a href="/s-baby-daipers/pl/2pev"><p>Diapers</p></a>
      <a href="/cotton-baby-mosquito-nets/pl/bmx"><p>Baby Mosquito nets</p></a>
      <a href="/baby-dry-sheets/pl/3u2c"><p>Baby Dry Sheets</p></a>
    </div>

  </div>
</div>


{/* list-------6 */}
<div className="subheader-item">

  <span className="subheader-text">Home & Kitchen</span>

  <div className="has-dropdown">

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Home Decor</span>
      </div>
      <a href="/home-decor/pl/3tl"><p>View All</p></a>
      <a href="/home-covers/pl/1slm"><p>Covers</p></a>
      <a href="/key-holders/pl/9eq"><p>Key Holders</p></a>
      <a href="/artificial-flowers-and-plants/pl/1hdk"><p>Artificial Plants</p></a>
      <a href="/pooja-essentials/pl/1ll6"><p>Pooja Needs</p></a>
      <a href="/party-supplies/pl/9iy"><p>Party Supplies</p></a>
      <a href="/stick-wallpapers/pl/8em"><p>Wallpapers & Stickers</p></a>
      <a href="/dolls-idols-figurines/pl/dqu"><p>Showpieces & Idols</p></a>
      <a href="/standard-wall-clocks/pl/dmb"><p>Clocks & Wall Decor</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Kitchen & Appliances</span>
      </div>
      <a href="/kitchenware/pl/3tr"><p>View All</p></a>
      <a href="/kitchen-storage-organisers/pl/672t"><p>Storage & Organizers</p></a>
      <a href="/cookware-bakeware/pl/3tm"><p>Cookware</p></a>
      <a href="/kitchen-tools/pl/9i2"><p>Kitchen Tools</p></a>
      <a href="/home-kitchen-appliances/pl/673f"><p>Kitchen Appliances</p></a>
      <a href="/dinnerware/pl/9ig"><p>Dinnerware</p></a>
      <a href="/glassware-drinkware/pl/3nz"><p>Glasses & Barware</p></a>
      <a href="/kitchen-linen/pl/671s"><p>Kitchen Linen</p></a>
      <a href="/home-appliances/pl/3th"><p>Home Appliances</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Home Textiles</span>
      </div>
      <a href="/home-textiles/pl/1spq"><p>View All</p></a>
      <a href="/bedsheets/pl/3jm"><p>Bedsheets</p></a>
      <a href="/curtain-accessories/pl/673h"><p>Curtains & Accessories</p></a>
      <a href="/carpets-doormats/pl/670y"><p>Doormats & Carpets</p></a>
      <a href="/bed-pillows-pillow-covers/pl/673p"><p>Pillow, Cushion & Covers</p></a>
      <a href="/comforter-sets/pl/9gw"><p>Blankets & Comforters</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Home Improvement</span>
      </div>
      <a href="/home-improvement/pl/66zu"><p>All Home Essentials</p></a>
      <a href="/bathroom-organization/pl/9jc"><p>Bathroom Accessories</p></a>
      <a href="/cleaning-supplies/pl/9ii"><p>Cleaning Supplies</p></a>
      <a href="/gardening/pl/673e"><p>Gardening</p></a>
      <a href="/home-tools/pl/671w"><p>Home Tools</p></a>
      <a href="/insect-repellent/pl/905"><p>Insect Protection</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Furniture</span>
      </div>
      <a href="/shoe-racks/pl/1w06"><p>Shoe Racks</p></a>
      <a href="/study-table/pl/9ij"><p>Study Tables</p></a>
      <a href="/collapsible-wardrobe/pl/9ef"><p>Collapsible Wardrobes</p></a>
      <a href="/wall-shelves/pl/9he"><p>Wall Shelves</p></a>
      <a href="/home-temple/pl/9fv"><p>Home Temple</p></a>
      <a href="/hammock-swings/pl/aad"><p>Hammock Swing</p></a>
    </div>

  </div>
</div>

{/* list-------7 */}
<div className="subheader-item">

  <span className="subheader-text">Beauty & Health</span>

  <div className="has-dropdown">

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Makeup</span>
      </div>
      <a href="/lip-care-makeup/pl/67cp"><p>Lipstick</p></a>
      <a href="/eye-makeup/pl/3j1"><p>Eye Shadow and Liner</p></a>
      <a href="/face-makeup/pl/3j7"><p>Face Makeup</p></a>
      <a href="/makeup-kits-combos/pl/67cr"><p>Makeup Kits & Combos</p></a>
      <a href="/hair-stylers/pl/aye"><p>Hair Curlers</p></a>
      <a href="/nails-makeup/pl/3j9"><p>Nail Makeup</p></a>
      <a href="/makeup-brushes/pl/9ln"><p>Brushes & Accessories</p></a>
      <a href="/hair-removal/pl/ii8"><p>Hair Removal</p></a>
      <a href="/unisex-perfumes/pl/9mp"><p>Perfumes & More</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Personal Care</span>
      </div>
      <a href="/skincare/pl/5kw"><p>View All</p></a>
      <a href="/body-lotion/pl/3xg"><p>Body Lotion</p></a>
      <a href="/whitening-creams/pl/iym"><p>Whitening Creams</p></a>
      <a href="/hair-care/pl/67d0"><p>Hair Oil & Shampoo</p></a>
      <a href="/hair-straighteners/pl/3wn"><p>Straighteners & Dryers</p></a>
      <a href="/face-care/pl/67cu"><p>Face Oil & Serum</p></a>
      <a href="/face-wash/pl/3wy"><p>Face Wash</p></a>
      <a href="/face-masks-and-peels/pl/9tr"><p>Face Masks & Peels</p></a>
      <a href="/bathing-soaps/pl/9l5"><p>Soaps & Scrubs</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Healthcare</span>
      </div>
      <a href="/wellness/pl/6716"><p>View All</p></a>
      <a href="/oral-care/pl/3tf"><p>Oral Care</p></a>
      <a href="/winter-healthcare/pl/1w9a"><p>Winter Healthcare</p></a>
      <a href="/ear-cleaner/pl/9nq"><p>Ear Cleaner</p></a>
      <a href="/accupressure-and-massagers/pl/9tv"><p>Health Monitor & Massagers</p></a>
      <a href="/foot-care/pl/21is"><p>Foot care</p></a>
      <a href="/sexual-wellness/pl/672d"><p>Sexual Wellness</p></a>
      <a href="/nutrition/pl/672b"><p>Ayurveda & Nutrition</p></a>
      <a href="/sanitary-pads/pl/9u1"><p>Sanitary Pads & More</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Baby & Mom</span>
      </div>
      <a href="/baby-mom-care/pl/f0o"><p>View All</p></a>
      <a href="/baby-mother-personal-care/pl/670h"><p>Baby Care Essentials</p></a>
      <a href="/mom-and-baby-care/pl/9tu"><p>Mom Care</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Mens Care</span>
      </div>
      <a href="/trimmers/pl/8gc"><p>Trimmers</p></a>
      <a href="/beard-oil/pl/3ww"><p>Beard Oil</p></a>
      <a href="/men-perfumes/pl/1oao"><p>Men Perfumes & Deodorant</p></a>
      <a href="/hair-gel-for-men/pl/9lj"><p>Hair Gels, Wax & Spray</p></a>
      <a href="/men-face-care/pl/67d1"><p>Men's Face & Body Care</p></a>
      <a href="/shaving-essentials/pl/iia"><p>Budget Grooming Kits</p></a>
    </div>

  </div>
</div>


{/* list-------8 */}
<div className="subheader-item">

  <span className="subheader-text">Jewellery & Accessories</span>

  <div className="has-dropdown">

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">jewellery</span>
      </div>
      <a href="/all-jewellery/pl/40m1"><p>All Jewellery</p></a>
      <a href="/jewellery-sets-women/pl/3jy"><p>Jewellery Sets</p></a>
      <a href="/stud-earrings-women/pl/3n9"><p>Earrings</p></a>
      <a href="/gold-mangalsutra-pendants/pl/3lq"><p>Mangalsutras</p></a>
      <a href="/pendant-necklace/pl/1nsl"><p>Necklaces & Chains</p></a>
      <a href="/bracelets/pl/9jl"><p>Bangles & Bracelets</p></a>
      <a href="/anklets-payal/pl/3je"><p>Anklets & Nosepins</p></a>
      <a href="/kamarbandh/pl/3uu"><p>Kamarbandh & Maangtika</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Men Accessories</span>
      </div>
      <a href="/men-accessories/pl/1sro"><p>All Accessories</p></a>
      <a href="/men-watches/pl/3k7"><p>Men Watches</p></a>
      <a href="/wallets-men/pl/3o5"><p>Wallets</p></a>
      <a href="/men-jewellery/pl/18du"><p>Men Jewellery</p></a>
      <a href="/sunglasses-men/pl/8gq"><p>Sunglasses & Spectacle Frames</p></a>
      <a href="/belts-men/pl/3nn"><p>Belts</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Women Accessories</span>
      </div>
      <a href="/women-jewellery/pl/1l6o"><p>All Accessories</p></a>
      <a href="/women-watches/pl/3jx"><p>Women Watches</p></a>
      <a href="/hair-accessories-women/pl/3jl"><p>Hair Accessories</p></a>
      <a href="/women-belts/pl/1hc8"><p>Women Belts</p></a>
      <a href="/sunglasses-women/pl/3kd"><p>Sunglasses & Spectacle Frames</p></a>
      <a href="/scarves/pl/9jn"><p>Scarves, Stoles & Gloves</p></a>
    </div>

  </div>
</div>


{/* list-------9 */}
<div className="subheader-item">

  <span className="subheader-text">Bags & Footwear</span>

  <div className="has-dropdown">

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Women Footwear</span>
      </div>
      <a href="/women-footwear/pl/460"><p>View All</p></a>
      <a href="/women-heels-and-sandals/pl/68ly"><p>Heels and Sandals</p></a>
      <a href="/flats-women/pl/3o1"><p>Flats</p></a>
      <a href="/women-boots/pl/9tz"><p>Boots</p></a>
      <a href="/platform-slippers/pl/1oom"><p>Flipflops & Slippers</p></a>
      <a href="/bellies/pl/3n8"><p>Bellies and Ballerinas</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Men Footwear</span>
      </div>
      <a href="/men-footwear/pl/9u0"><p>View All</p></a>
      <a href="/casual-sneakers-men/pl/rsk"><p>Men Casual Shoes</p></a>
      <a href="/sports-shoes-men/pl/8i9"><p>Men Sports Shoes</p></a>
      <a href="/sandals-men/pl/3js"><p>Men Flip Flops and Sandals</p></a>
      <a href="/formal-shoes-men/pl/3o6"><p>Men Formal Shoes</p></a>
      <a href="/loafers/pl/1o0w"><p>Loafers</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Kids Footwear</span>
      </div>
      <a href="/footwear-kids/pl/3ti"><p>View All</p></a>
      <a href="/boys-shoes/pl/9u6"><p>Boys Shoes</p></a>
      <a href="/girls-shoes/pl/3i"><p>Girls Shoes</p></a>
      <a href="/footwear-kids/pl/3ti"><p>Casual Shoes</p></a>
      <a href="/platform-slippers/pl/1oom"><p>Flipflops & Slippers</p></a>
      <a href="/kids-sandals/pl/9u9"><p>Sandals</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Women Bags</span>
      </div>
      <a href="/women-bags/pl/1l90"><p>View All</p></a>
      <a href="/bags-backpacks-men/pl/3kr"><p>Backpacks</p></a>
      <a href="/women-handbags/pl/1oof"><p>Handbags</p></a>
      <a href="/slingbags-women/pl/3k4"><p>Slingbags</p></a>
      <a href="/women-wallets/pl/1l9t"><p>Wallets</p></a>
      <a href="/clutches-bags-women/pl/3nd"><p>Clutches</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Men Bags</span>
      </div>
      <a href="/bags-backpacks-men/pl/3kr"><p>Backpacks</p></a>
      <a href="/waist-bags/pl/9cj"><p>Waist Bags</p></a>
      <a href="/cross-body-bags/pl/9ca"><p>Crossbody Bags & Sling Bags</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Travel Bags, Luggage and Accessories</span>
      </div>
      <a href="/bags-luggage-travel-accessories/pl/670e"><p>View All</p></a>
      <a href="/trolley-travel-bags/pl/1hvw"><p>Duffel & Trolley Bags</p></a>
      <a href="/laptop-bags/pl/1opg"><p>Laptop & Messenger Bags</p></a>
    </div>

  </div>
</div>


{/* list-------10 */}
<div className="subheader-item">

  <span className="subheader-text">Electronics</span>

  <div className="has-dropdown">

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Audio & Mobiles</span>
      </div>
      <a href="/wireless-headphones/pl/8d8"><p>Neckband</p></a>
      <a href="/speakers/pl/9ub"><p>Speakers</p></a>
      <a href="/mobile-cases-and-covers/pl/68m0"><p>Cases & Covers</p></a>
      <a href="/wireless-earphones/pl/8d7"><p>Bluetooth Earbuds</p></a>
      <a href="/wired-headphones/pl/8da"><p>Wired Earphone</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Accessories</span>
      </div>
      <a href="/mobile-holders/pl/3ky"><p>Mobile Holders</p></a>
      <a href="/wall-chargers/pl/ap6"><p>Mobile Chargers & Cables</p></a>
      <a href="/power-banks/pl/9ox"><p>Power Banks</p></a>
      <a href="/microphone/pl/ayq"><p>Microphone</p></a>
      <a href="/ring-lights/pl/8co"><p>Selfie Stick & Ringlight</p></a>
      <a href="/tripods-accessories/pl/67bf"><p>Tripod & Monopod</p></a>
      <a href="/surge-protectors/pl/avs"><p>Extension Cord</p></a>
      <a href="/reading-magnifiers/pl/99b"><p>Screen Expanders & Magnifiers</p></a>
      <a href="/electronics-accessories/pl/12wx"><p>View All</p></a>
    </div>

  </div>
</div>


{/* list-------11 */}
<div className="subheader-item">

  <span className="subheader-text">Watches</span>

  <div className="has-dropdown">

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Watches</span>
      </div>
      <a href="/men-analog-watches/pl/2meg"><p>Analog Watches</p></a>
      <a href="/men-digital-watches/pl/1hlq"><p>Digital Watches</p></a>
      <a href="/men-sports-watches/pl/1mo0"><p>Sport Watches</p></a>
      <a href="/couple-watches/pl/9jv"><p>Couple Watch</p></a>
      <a href="/watch-bands/pl/9ce"><p>Bands & Boxes</p></a>
      <a href="/watches/pl/1pqz"><p>View All</p></a>
    </div>

  </div>
</div>



{/* list-------12 */}
<div className="subheader-item">

  <span className="subheader-text">Sports & Fitness</span>

  <div className="has-dropdown">

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Fitness</span>
      </div>
      <a href="/sports-fitness/pl/6702"><p>View All</p></a>
      <a href="/sweat-belts/pl/9f4"><p>Sweat Belts</p></a>
      <a href="/exercisers/pl/9ny"><p>Exercise Bands</p></a>
      <a href="/tummy-trimmer/pl/9nb"><p>Tummy Trimmers</p></a>
      <a href="/skipping-ropes/pl/9ho"><p>Skipping Ropes</p></a>
      <a href="/hand-gripper/pl/9f1"><p>Hand Grip Strengthener</p></a>
      <a href="/yoga/pl/673w"><p>Yoga</p></a>
      <a href="/fitness-equipments/pl/672e"><p>Fitness Accessories</p></a>
      <a href="/fitness-gears/pl/1r87"><p>Fitness Gears</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Sports</span>
      </div>
      <a href="/cricket/pl/1l4n"><p>Cricket</p></a>
      <a href="/cycling-accessories/pl/1bhp"><p>Cycles & Accessories</p></a>
      <a href="/roller-skating/pl/674g"><p>Skating</p></a>
      <a href="/football/pl/673x"><p>Football</p></a>
      <a href="/badminton/pl/673v"><p>Badminton</p></a>
      <a href="/volleyball/pl/675o"><p>Volleyball</p></a>
      <a href="/fishing/pl/67a3"><p>Fishing</p></a>
      <a href="/swimming/pl/1guz"><p>Swimming</p></a>
      <a href="/sports-fitness/pl/6702"><p>View All</p></a>
    </div>

  </div>
</div>


{/* list-------13 */}
<div className="subheader-item">

  <span className="subheader-text">Car & Motorbike</span>

  <div className="has-dropdown">

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Bike & Scooty Accessories</span>
      </div>
      <a href="/motorcycle-led-lights/pl/9bb"><p>Bike LED Lights</p></a>
      <a href="/motorcycle-covers/pl/9bj"><p>Bike Covers</p></a>
      <a href="/bike-accessories/pl/9ua"><p>Bike Accessories</p></a>
      <a href="/protective-gear-clothing/pl/9uc"><p>Safety Gear & Clothing</p></a>
      <a href="/motorcycle-helmets/pl/9bu"><p>Helmets</p></a>
      <a href="/bike-accessories/pl/9ua"><p>Scooty & Activa Accessories</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Car Accessories</span>
      </div>
      <a href="/car-interior-accessories/pl/6752"><p>Interior Accessories</p></a>
      <a href="/car-interior-care/pl/6754"><p>Car Care & Cleaning</p></a>
      <a href="/car-exterior-care/pl/6750"><p>Car Repair Assistance</p></a>
      <a href="/mobile-chargers/pl/9r8"><p>Car Mobile & Holders</p></a>
      <a href="/car-covers/pl/9b0"><p>Car Covers</p></a>
      <a href="/car-exterior-accessories/pl/674t"><p>Car Exterior Accessories</p></a>
    </div>

  </div>
</div>


{/* list-------14 */}
<div className="subheader-item">

  <span className="subheader-text">Office Supplies & Stationery</span>

  <div className="has-dropdown">

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Office Supplies & Stationery</span>
      </div>
      <a href="/drawing-and-painting-kits/pl/6747"><p>View All</p></a>
      <a href="/pens-pencils-writing-supplies/pl/675w"><p>Pens & Pencils</p></a>
      <a href="/notebooks-writing-pads-diaries/pl/6769"><p>Diaries & Notebooks</p></a>
      <a href="/art-craft-supplies/pl/iii"><p>Art & Craft Supplies</p></a>
      <a href="/filing-products/pl/9id"><p>Files & Desks Organizers</p></a>
      <a href="/tape-adhesives-fasteners/pl/6761"><p>Adhesives & Tapes</p></a>
    </div>

  </div>
</div>



{/* list-------15 */}
<div className="subheader-item">

  <span className="subheader-text">Grocery</span>

  <div className="has-dropdown">

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Food & Drinks</span>
      </div>
      <a href="/dry-fruits/pl/9pb"><p>Dry Fruits</p></a>
      <a href="/powdered-spices-seasonings-masalas/pl/6786"><p>Masala and spices</p></a>
      <a href="/snacks-namkeens/pl/678l"><p>Snacks and Namkeens</p></a>
      <a href="/pickles-chutney/pl/675f"><p>Pickles</p></a>
      <a href="/sweets-chocolates-gums/pl/678j"><p>Chocolates & Candies</p></a>
      <a href="/biscuits-cookies/pl/6789"><p>Biscuit and cookies</p></a>
      <a href="/coffee/pl/9hy"><p>Coffee</p></a>
      <a href="/tea/pl/9hp"><p>Tea</p></a>
      <a href="/grocery/pl/66zl"><p>View All</p></a>
    </div>

  </div>
</div>


{/* list-------16 */}
<div className="subheader-item">

  <span className="subheader-text">Books</span>

  <div className="has-dropdown">

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Fiction & Non Fiction</span>
      </div>
      <a href="/children-books/pl/9up"><p>Children's Books</p></a>
      <a href="/self-help-books/pl/9uq"><p>Motivational Books</p></a>
      <a href="/novels/pl/9uw"><p>Novels</p></a>
      <a href="/religious-books/pl/9uu"><p>Religious Books</p></a>
      <a href="/business-economics-books/pl/1q6b"><p>Economics & Commerce</p></a>
      <a href="/books/pl/9uv"><p>View All Books</p></a>
    </div>

    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Academic Books</span>
      </div>
      <a href="/exam-preparation/pl/67au"><p>UPSC & Central Exam Preparation</p></a>
      <a href="/exam-preparation/pl/67au"><p>Competitive Exams Preparation</p></a>
      <a href="/reference-books/pl/9ux"><p>Reference Books</p></a>
      <a href="/school-books/pl/67b0"><p>School Textbooks & Guides</p></a>
      <a href="/sciences-technology-medicine-books/pl/67ay"><p>University Books & Guides</p></a>
      <a href="/cbse-ncert-textbooks/pl/ai3"><p>All Academic Books</p></a>
    </div>

  </div>
</div>


{/* list-------17 */}
<div className="subheader-item">

  <span className="subheader-text">Pet Supplies</span>

  <div className="has-dropdown">
    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Pet Supplies</span>
      </div>
      <a href="/dog-collars-harnesses-leashes/pl/6755"><p>Collars & Leashes</p></a>
      <a href="/pet-grooming/pl/9ug"><p>Clothes & Grooming</p></a>
      <a href="/pet-food/pl/9uf"><p>Food & Treats</p></a>
      <a href="/aquarium-accessories/pl/21j0"><p>Aquarium Accessories</p></a>
      <a href="/interactive-toys-for-pets/pl/90f"><p>Pet Toys</p></a>
      <a href="/feeding-bowls-for-pets/pl/9af"><p>Pet Bowls</p></a>
    </div>
  </div>

</div>



{/* list-------18 */}
<div className="subheader-item">

  <span className="subheader-text">Musical Instruments</span>

  <div className="has-dropdown">
    <div className="dropdown-list">
      <div>
        <span className="dropdown-title">Musical Instument</span>
      </div>
      <a href="/drums-percussion/pl/679b"><p>Dholaks & Drum sets</p></a>
      <a href="/piano-keyboard-accessories/pl/679d"><p>Piano & Keyboard</p></a>
      <a href="/string-instruments/pl/9um"><p>String Instruments</p></a>
      <a href="/wind-instruments/pl/9ur"><p>Wind Instruments</p></a>
      <a href="/musical-accessories/pl/9ul"><p>Musical Accessories</p></a>
      <a href="/musical-instruments/pl/9un"><p>All Musical Instruments</p></a>
    </div>
  </div>

</div>


    </div>
  </div>
</div>
      
     
</header>    

{/* Sign Up Modal 
      {showSignUp && (
        <SignUpModal setShowSignUp={setShowSignUp} />
      )} */}

      
{/* Sign Up Modal */}
{showSignUp && (
  <SignUpModal 
    setShowSignUp={setShowSignUp} 
    setUser={setUser}
    setShowSuccessPopup={setShowSuccessPopup}
  />
)}

{/* Success Popup */}
{showSuccessPopup && (
  <div className="success-popup">
    <div className="success-content">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>Successfully logged in!</span>
    </div>
  </div>
)}
            


{/* ==============
    ADV. BANNER
    ============== */}

<div className="promo-wrapper">
  <div className="promo-container">
    <section className="promo-section">
      <img className="promo-image" alt="Smart Shopping" src="https://images.meesho.com/images/marketing/1760553615790.webp"></img>
      <div className="promo-content">
        <div className="promo-text">
          <div className="promo-title">Smart Shopping</div>
          <div className="promo-subtitle">Trusted by Millions</div>
        </div>
        <div className="promo-button">Shop Now</div>
      </div>
    </section>
  </div>
</div>

{/* ====================
     FEATURES SECTION
  ===================== */}

<section className="features-section">
        <div className="features-container">
                <div className="feature-item">
                        <img src={returns} alt="7 Days Easy Return" />
                        <span>7 Days Easy Return</span>
                </div>
                <div className="feature-item">
                        <img src={cod} alt="Cash on Delivery" />
                        <span>Cash on Delivery</span>
                </div>
                <div className="feature-item">
                        <img src={lowestPrice} alt="Lowest Prices" />
                        <span>Lowest Prices</span>
                </div>
        </div>
</section>




{/* ====================
     CATAGEORY SECTION
    ==================== */}

<section class="category-section">
<div class="category-container">
<a class="category-item" href="/women-ethnic-wear/clp/1hjl">
<img alt="Ethnic Wear" src="https://images.meesho.com/images/marketing/1744634654837.webp" />
<div class="category-title">Ethnic Wear</div>
</a>
<a class="category-item" href="/western-dresses/clp/5S3C">
<img alt="Western Dresses" src="https://images.meesho.com/images/marketing/1744634725496.webp" />
<div class="category-title">Western Dresses</div>
</a>
<a class="category-item" href="/menswear/clp/40NO">
<img alt="Menswear" src="https://images.meesho.com/images/marketing/1744634780426.webp" />
<div class="category-title">Menswear</div>
</a>
<a class="category-item" href="/women-men-kids-footwear/clp/15mz">
<img alt="Footwear" src="https://images.meesho.com/images/marketing/1744634814643.webp" />
<div class="category-title">Footwear</div>
</a>
<a class="category-item" href="/home-decor-furnishings/clp/668x">
<img alt="Home Decor" src="https://images.meesho.com/images/marketing/1744634835018.webp" />
<div class="category-title">Home Decor</div>
</a>
<a class="category-item" href="/beauty/facet_collection/30983?title=Beauty">
<img alt="Beauty" src="https://images.meesho.com/images/marketing/1744634871107.webp" />
<div class="category-title">Beauty</div>
</a>
<a class="category-item" href="/accessories-bags/facet_collection/43174">
<img alt="Accessories" src="https://images.meesho.com/images/marketing/1744634909968.webp" />
<div class="category-title">Accessories</div>
</a>
<a class="category-item" href="/grocery/facet_collection/81087?title=Grocery">
<img alt="Grocery" src="https://images.meesho.com/images/marketing/1744634937295.webp" />
<div class="category-title">Grocery</div>
</a>
</div>
</section>





{/* ===================
      GOLD SECTION
    =================== */}

<section class="gold-section">
                <img class="gold-banner" src="https://images.meesho.com/images/marketing/1744698265981.webp" />
<div class="gold-cta">
        <a class="gold-btn" href="/gold/clp/2R2G">Shop Now</a>
</div>
<div class="gold-grid">
        <a class="gold-item" href="/lehengas-gold/clp/3OZZ">
        <div class="gold-img-box">
                <img alt="Lehenga" src="https://images.meesho.com/images/marketing/1744722796811.webp" />
</div>
</a>
        <a  class="gold-item" href="/menwear-gold/clp/3T58">
        <div class="gold-img-box">
        <img alt="Menwear" src="https://images.meesho.com/images/marketing/1744635113661.webp" />
        </div>
        </a>
        <a class="gold-item" href="/sarees/clp/44F1">
        <div  class="gold-img-box">
                <img alt="Sarees" src="https://images.meesho.com/images/marketing/1744635139351.webp" />
                </div>
                </a>
                <a class="gold-item" href="/jewellery-gold/clp/3T56">
                <div class="gold-img-box">
                        <img alt="Jewellery" src="https://images.meesho.com/images/marketing/1744635189897.webp" />
                </div>
                        </a>
        </div>
</section>



{/* ======================
      BRANDS SECTION
    ====================== */}

<section class="brands-section">
  <div class="header-row">
    
    <div class="title-wrap">
      Original Brands
      <svg class="title-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" iconSize="32"><path fill-rule="evenodd" clip-rule="evenodd" d="M23.543 1.188A1.699 1.699 0 0 0 21.14.192l-4.357 2.264a1.699 1.699 0 0 1-1.566 0L10.86.192a1.699 1.699 0 0 0-2.403.996l-1.48 4.681c-.167.528-.58.941-1.108 1.108l-4.681 1.48a1.699 1.699 0 0 0-.996 2.403l2.264 4.357a1.699 1.699 0 0 1 0 1.566L.192 21.14a1.699 1.699 0 0 0 .996 2.403l4.681 1.48c.528.167.941.58 1.108 1.108l1.48 4.681a1.699 1.699 0 0 0 2.403.996l4.357-2.264a1.699 1.699 0 0 1 1.566 0l4.357 2.264c.936.486 2.085.01 2.403-.995l1.48-4.682c.167-.528.58-.941 1.108-1.108l4.681-1.48a1.699 1.699 0 0 0 .996-2.403l-2.264-4.357a1.699 1.699 0 0 1 0-1.566l2.264-4.357a1.699 1.699 0 0 0-.995-2.403l-4.682-1.48a1.699 1.699 0 0 1-1.108-1.108l-1.48-4.681ZM7.737 15.199c.815-.815 1.724-1.226 2.54-.411l3.854 3.855 7.807-7.807c.815-.815 1.708-.387 2.523.428.815.815 1.272 1.68.457 2.495l-9.28 9.28c-1.086 1.086-2.01 1.004-3.096-.083L7.325 17.74c-.815-.815-.403-1.724.412-2.54Z" fill="#6625FF">
        </path>
        </svg>
    </div>

    <a class="view-all" href="/mall/clp/2uoh">
      VIEW ALL
      <svg  class="arrow-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        </path>
      </svg>
    </a>

  </div>

  <div class="card-row" ref={cardRowRef}>

    <a class="card-link" href="/personal-care/clp/3atx">
      <div class="card">
        <img src="https://images.meesho.com/images/marketing/1744635542873.webp" />
      </div>
    </a>

    <a class="card-link" href="/electronics-mall/clp/3nhb">
      <div class="card">
        <img src="https://images.meesho.com/images/marketing/1744635521751.webp" />
      </div>
    </a>

    <a class="card-link" href="/makeup/facet_collection/93811">
      <div class="card">
        <img src="https://images.meesho.com/images/marketing/1744635497001.webp" />
      </div>
    </a>

    <a class="card-link" href="/smartphones/clp/3y5b">
      <div class="card">
        <img src="https://images.meesho.com/images/marketing/1744635464683.webp" />
      </div>
    </a>

    <a class="card-link" href="/men-perfumes/clp/2ykl">
      <div class="card">
        <img src="https://images.meesho.com/images/marketing/1744635432891.webp" />
      </div>
    </a>

    <a class="card-link" href="/bags-mall/clp/1U23">
      <div class="card">
        <img src="https://images.meesho.com/images/marketing/1744635402151.webp" />
      </div>
    </a>

    <a class="card-link" href="/mall-men-footwear/clp/3Z40">
      <div class="card">
        <img src="https://images.meesho.com/images/marketing/1744635614888.webp" />
      </div>
    </a>

    <a class="card-link" href="/mall-books/clp/4204">
      <div class="card">
        <img src="https://images.meesho.com/images/marketing/1744635646070.webp" />
      </div>
    </a>

  </div>

  <button class="scroll-btn" direction="right" onClick={scrollRight}>
 <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        </path>
        </svg>
  </button>

</section>



     {/* ===================================
                BRANDS STRIP
        ==================================== */}

<div class="brands-strip">
  <div class="brands-track">
    <div className="brands-track auto-scroll">
      <div class="brand-card">
        <img alt="Popular Brands" src="https://images.meesho.com/images/marketing/1743159302944.webp" />
      </div>
      <div class="brand-card">
        <img alt="Popular Brands" src="https://images.meesho.com/images/marketing/1743159322237.webp" />
      </div>
      <div class="brand-card">
        <img alt="Popular Brands" src="https://images.meesho.com/images/marketing/1743159363205.webp" />
      </div>
      <div class="brand-card">
        <img alt="Popular Brands" src="https://images.meesho.com/images/marketing/1743159377598.webp" />
      </div>
      <div class="brand-card">
        <img alt="Popular Brands" src="https://images.meesho.com/images/marketing/1743159393231.webp" />
      </div>
      <div class="brand-card">
        <img alt="Popular Brands" src="https://images.meesho.com/images/marketing/1743159415385.webp" />
      </div>
      <div class="brand-card">
        <img alt="Popular Brands" src="https://images.meesho.com/images/marketing/1744636558884.webp" />
      </div>
      <div class="brand-card">
        <img alt="Popular Brands" src="https://images.meesho.com/images/marketing/1744636599446.webp" />
      </div>
      <div class="brand-card">
        <img alt="Popular Brands" src="https://images.meesho.com/images/marketing/1743159302944.webp" />
      </div>
      <div class="brand-card">
        <img alt="Popular Brands" src="https://images.meesho.com/images/marketing/1743159322237.webp" />
      </div>
      <div class="brand-card">
        <img alt="Popular Brands" src="https://images.meesho.com/images/marketing/1743159363205.webp" />
      </div>
      <div class="brand-card">
        <img alt="Popular Brands" src="https://images.meesho.com/images/marketing/1743159377598.webp" />
      </div>
      <div class="brand-card">
        <img alt="Popular Brands" src="https://images.meesho.com/images/marketing/1743159393231.webp" />
      </div>
      <div class="brand-card">
        <img alt="Popular Brands" src="https://images.meesho.com/images/marketing/1743159415385.webp" />
      </div>
      <div class="brand-card">
        <img alt="Popular Brands" src="https://images.meesho.com/images/marketing/1744636558884.webp" />
      </div>
      <div class="brand-card">
        <img alt="Popular Brands" src="https://images.meesho.com/images/marketing/1744636599446.webp" />
      </div>
    </div>
  </div>
</div>


{/* ======================
        PROMO SECTION
    ====================== */}

<section class="promo-section">
  <img class="promo-bg" src="https://images.meesho.com/images/marketing/1762433553672.webp" />

  <button class="promo-btn">Download Now</button>

  <div class="promo-cards">
    <a href="/dupatta-sets/clp/689e">
      <div class="promo-card">
        <img class="promo-card-img" alt="Trending Now" src="https://images.meesho.com/images/marketing/1762433786046.webp" />
        <div class="promo-card-text">Trending Now</div>
      </div>
    </a>

    <a href="/dupatta-sets/clp/689e">
      <div class="promo-card">
        <img class="promo-card-img" alt="Budget Buys" src="https://images.meesho.com/images/marketing/1762433761056.webp" />
        <div class="promo-card-text">Budget Buys</div>
      </div>
    </a>

    <a href="/dupatta-sets/clp/689e">
      <div class="promo-card">
        <img class="promo-card-img" alt="Top Rated Picks" src="https://images.meesho.com/images/marketing/1762433804035.webp" />
        <div class="promo-card-text">Top Rated Picks</div>
      </div>
    </a>

    <a href="/dupatta-sets/clp/689e">
      <div class="promo-card">
        <img class="promo-card-img" alt="Daily Essentials" src="https://images.meesho.com/images/marketing/1762433722680.webp" />
        <div class="promo-card-text">Daily Essentials</div>
      </div>
    </a>
  </div>
</section>




  
    </div>

      
  );
}
