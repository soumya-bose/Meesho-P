import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Header from './Component/Client/Header'
import Homepage from './Component/Pages/Homepage'
import Footer from './Component/Client/Footer'
import ProductDetail from './Component/Pages/ProductDetail'
import Cart from './Component/Pages/Cart'
import DeleteAccount from './Component/Pages/DeleteAccount'

createRoot(document.getElementById('root')).render(
 <StrictMode>
    <BrowserRouter>
      <Header />
  <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>
)
