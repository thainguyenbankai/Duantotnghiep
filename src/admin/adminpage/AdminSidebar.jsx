import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import {
  FaBars,
  FaTimes,
  FaHome,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaComments,
} from 'react-icons/fa';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 py-2.5 px-4 rounded transition duration-200 
     ${isActive ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-blue-500 hover:text-white'}`;

  return (
    <div className={`fixed top-0 left-0 h-screen bg-gray-900 text-white shadow-lg transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-between px-4 py-6 border-b border-gray-700">
        <span className={`font-bold text-xl transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
          Admin
        </span>
        <button onClick={toggleSidebar} className="text-white hover:text-gray-300">
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      <nav className="flex flex-col mt-6 space-y-2">
        <NavLink to="/admin/dashboard" className={linkClass}>
          <FaHome />
          {isOpen && 'Dashboard'}
        </NavLink>
        <NavLink to="/admin/listproduct" className={linkClass}>
          <FaBoxOpen />
          {isOpen && 'Quản lý sản phẩm'}
        </NavLink>
        <NavLink to="/admin/orders" className={linkClass}>
          <FaShoppingCart />
          {isOpen && 'Quản lý đơn hàng'}
        </NavLink>
        <NavLink to="/admin/users" className={linkClass}>
          <FaUsers />
          {isOpen && 'Quản lý người dùng'}
        </NavLink>
        <NavLink to="/admin/comments" className={linkClass}>
          <FaComments />
          {isOpen && 'Quản lý bình luận'}
        </NavLink>
        <NavLink to="/admin/category" className={linkClass}>
          <FaComments />
          {isOpen && 'Quản lý danh mục'}
        </NavLink>

        <NavLink to="/admin/voucher" className={linkClass}>
          <FaComments />
          {isOpen && 'Quản lý Voucher'}
        </NavLink>


          <NavLink to="/admin/news" className={linkClass}>
          <FaComments />
          {isOpen && 'Quản lý Tin Tức'}
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
