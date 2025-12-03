/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiX } from 'react-icons/fi';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from '../redux/cartSlice';

const CartPopup = ({ isOpen, onClose, cartItems }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!shouldRender) return null;

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const totalAmount = safeCartItems.reduce(
    (total, item) => total + (Number(item?.productPrice) || 0) * (Number(item?.quantity) || 1),
    0
  );

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="bg-white w-[90%] max-w-md rounded-lg shadow-lg relative p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
        >
          <FiX />
        </button>

        <h2 className="text-center text-2xl font-semibold mb-4">GIỎ HÀNG</h2>

        {safeCartItems.length === 0 ? (
          <>
            <div className="flex flex-col items-center justify-center py-10 text-gray-600">
              <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.3 5.3a1 1 0 001 1.2h11.6a1 1 0 001-1.2L17 13" />
              </svg>
              <p>Hiện chưa có sản phẩm</p>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold border-t pt-4">
              <span>TỔNG TIỀN:</span>
              <span className="text-red-500">0₫</span>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4 mb-6 border-t pt-4 max-h-[400px] overflow-y-auto">
              {safeCartItems.map((item) => (
                <div key={item.cartId || `${item._id}-${item.productColor}-${item.productSize}`} className="flex items-center border-b pb-4">
                  <img
                    src={item?.productImages?.[0] || 'https://via.placeholder.com/80x96?text=No+Image'}
                    alt={item?.productName || 'Product'}
                    className="w-20 h-24 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x96?text=Error';
                    }}
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-sm">{item?.productName || 'Sản phẩm'}</h3>
                    <div className='flex gap-2'>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Màu:</span>
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{
                            backgroundColor: Array.isArray(item?.productColor)
                              ? item.productColor[0]
                              : item?.productColor || '#ccc'
                          }}
                        />
                      </div>
                      |
                      <p className="text-sm text-gray-500">
                        Size: {Array.isArray(item?.productSize) ? item.productSize[0] : item?.productSize || 'Mặc định'}
                      </p>
                    </div>
                    <div className="flex items-center mt-2 space-x-2">
                      <button
                        className="border px-2 py-1 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => {
                          dispatch(decreaseQuantity(item.cartId || item._id));
                        }}
                        disabled={(item?.quantity || 1) <= 1}
                      >
                        <AiOutlineMinus />
                      </button>
                      <span className="px-2 min-w-[30px] text-center font-medium">
                        {item?.quantity || 1}
                      </span>
                      <button
                        className="border px-2 py-1 text-sm hover:bg-gray-100"
                        onClick={() => {
                          dispatch(increaseQuantity(item.cartId || item._id));
                        }}
                      >
                        <AiOutlinePlus />
                      </button>
                      <span className="ml-auto text-red-500 font-semibold">
                        {((item?.productPrice || 0) * (item?.quantity || 1)).toLocaleString()}₫
                      </span>
                    </div>
                  </div>
                  <button
                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                    onClick={() => {
                      dispatch(removeFromCart(item.cartId || item._id));
                    }}
                    title="Xóa sản phẩm"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-lg font-semibold border-t pt-4">
              <span>TỔNG TIỀN:</span>
              <span className="text-red-500">{totalAmount.toLocaleString()}₫</span>
            </div>

            <div className="flex gap-4 mt-6">
              <Link to={'/cart'} className="flex-1">
                <button
                  className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors font-medium"
                  onClick={onClose}
                >
                  XEM GIỎ HÀNG
                </button>
              </Link>
              <button
                onClick={handleCheckout}
                className="flex-1 border-2 border-black text-black py-3 rounded hover:bg-black hover:text-white transition-colors font-medium"
              >
                THANH TOÁN
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPopup;