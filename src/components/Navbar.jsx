import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoMdHeartEmpty } from "react-icons/io";
import { MdAccountCircle } from 'react-icons/md';
import { FiSearch } from 'react-icons/fi';
import { FiHome } from 'react-icons/fi';

import CartPopup from './CartPopup';
import SearchSuggestions from '../data/Searchdata';
import ProductMegaMenu from '../data/navMenuData';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);

  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const favoriteItems = useSelector((state) => state.favorite);
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const isActivePage = (path) => location.pathname === path;

  return (
    <nav className="bg-white p-4 shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-black transition-transform duration-200 hover:scale-105">
          <img
            src="https://file.hstatic.net/200000584505/file/137_x_42_px_28a4499b7dc045caab7996ef0fab24d4.png"
            alt="Logo"
            className="h-10"
          />
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-black hover:text-red-700 transition duration-200 relative group flex items-center space-x-1">
            <FiHome className="w-3 h-3 text-red-700" />
            <span>Home</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <div className="relative group">
            <ProductMegaMenu />
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
          </div>

          <Link to="/news" className="text-black hover:text-red-700 transition duration-200 relative group flex items-center space-x-1">
            <span>Tin tức mới</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link to="/store" className="text-black hover:text-red-700 transition duration-200 relative group flex items-center space-x-1">
            {/* <FiPhone className="w-4 h-4" /> */}
            <span>Hệ Thống cửa Hàng</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-2">
          <button
            onClick={() => setShowSearchBox(!showSearchBox)}
            className="text-2xl text-black hover:text-gray-600 transition-transform duration-200 hover:scale-110 px-2"
          >
            <FiSearch />
          </button>

          <SearchSuggestions
            isOpen={showSearchBox}
            onClose={() => setShowSearchBox(false)}
          />

          {!isActivePage('/wishlist') && (
            <Link to="/wishlist" className="relative text-2xl text-black  transition-transform duration-200 hover:scale-110">
              <IoMdHeartEmpty />
              {favoriteItems.length > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-black text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md leading-none">
                  {favoriteItems.length}
                </span>
              )}
            </Link>
          )}

          {!isActivePage('/account') && (
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <Link
                to={isAuthenticated ? "/account" : "/login"}
                className="text-2xl text-black px-2 flex items-center transition-transform duration-200 hover:scale-110"
              >
                <MdAccountCircle />
              </Link>

              {showUserMenu && isAuthenticated && (
                <Link to="/account">
                  <div className="absolute right-2 mt-8 bg-white shadow-lg rounded-md px-4 py-3 border border-gray-200 z-50 min-w-[200px] cursor-pointer hover:bg-gray-50 transition-opacity duration-300 opacity-100 animate-fadeIn">
                    <div className="text-sm text-center text-gray-600">Xin chào!</div>
                    <div className="text-sm font-medium text-black mt-1">
                      {user?.email || 'User'}
                    </div>
                  </div>
                </Link>
              )}
            </div>
          )}

          <button
            onClick={toggleCart}
            className="relative flex items-center justify-center  rounded-full hover:bg-gray-100 transition-transform duration-200 hover:scale-110"
          >
            <AiOutlineShoppingCart className="text-2xl text-black" />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-black text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md leading-none">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <CartPopup isOpen={isCartOpen} onClose={toggleCart} cartItems={cartItems} />
    </nav>
  );
};

export default Navbar;
