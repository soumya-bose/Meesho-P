import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Left Section - App Download */}
        <div className="footer-column footer-app">
          <h4 className="footer-heading">Shop Non-Stop on Meesho</h4>
          <p className="footer-subtext">
            Trusted by crores of Indians<br />
            Cash on Delivery | Free Delivery
          </p>
          <div className="app-buttons">
            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://images.meesho.com/images/pow/playstore-icon-big_400.webp" 
                alt="Google Play Store" 
                className="app-badge"
              />
            </a>
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://images.meesho.com/images/pow/appstore-icon-big_400.webp" 
                alt="App Store" 
                className="app-badge"
              />
            </a>
          </div>
        </div>

        {/* Column 2 - Careers & Supplier */}
        <div className="footer-column">
          <ul className="footer-links">
            <li>
              <a href="https://meesho.io/jobs" target="_blank" rel="noopener noreferrer">
                Careers
              </a>
            </li>
            <li>
              <a href="https://supplier.meesho.com" target="_blank" rel="noopener noreferrer">
                Become a supplier
              </a>
            </li>
            <li>
              <a href="/hall-of-fame">Hall of Fame</a>
            </li>
            <li>
              <a href="/sitemap" target="_blank">Sitemap</a>
            </li>
          </ul>
        </div>

        {/* Column 3 - Legal & Policies */}
        <div className="footer-column">
          <ul className="footer-links">
            <li>
              <a href="/legal">Legal and Policies</a>
            </li>
            <li>
              <a href="https://meesho.io/blog" target="_blank" rel="noopener noreferrer">
                Meesho Tech Blog
              </a>
            </li>
            <li>
              <a href="/notices-and-returns" target="_blank">
                Notices and Returns
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4 - Social Media */}
        <div className="footer-column">
          <h6 className="footer-subheading">Reach out to us</h6>
          <div className="social-links">
            <a href="https://www.facebook.com/meeshosupply" target="_blank" rel="noopener noreferrer">
              <img src="https://images.meesho.com/images/pow/facebook.webp" alt="Facebook" />
            </a>
            <a href="https://www.instagram.com/meeshoapp/" target="_blank" rel="noopener noreferrer">
              <img src="https://images.meesho.com/images/pow/instagram.webp" alt="Instagram" />
            </a>
            <a href="https://www.youtube.com/channel/UCaGHIRKYUYlaI_ZAt2hxpjw" target="_blank" rel="noopener noreferrer">
              <img src="https://images.meesho.com/images/pow/youtube.webp" alt="YouTube" />
            </a>
            <a href="https://www.linkedin.com/company/meesho" target="_blank" rel="noopener noreferrer">
              <img src="https://images.meesho.com/images/pow/linkedin.webp" alt="LinkedIn" />
            </a>
            <a href="https://twitter.com/Meesho_Official/" target="_blank" rel="noopener noreferrer">
              <img src="https://images.meesho.com/images/pow/twitter.webp" alt="Twitter" />
            </a>
          </div>
        </div>

        {/* Column 5 - Contact Info */}
        <div className="footer-column footer-contact">
          <h6 className="footer-subheading">Contact Us</h6>
          <p className="contact-text">
            Meesho Technologies Private Limited<br />
            CIN: U62099KA2024PTC186568<br />
            3rd Floor, Wing-E, Helios Business Park,<br />
            Kadubeesanahalli Village, Varthur Hobli,<br />
            Outer Ring Road Bellandur, Bangalore,<br />
            Bangalore South, Karnataka, India, 560103<br />
            E-mail address: <a href="mailto:query@meesho.com">query@meesho.com</a><br />
            © 2015-2025 Meesho.com
          </p>
        </div>

      </div>
    </footer>
  );
}