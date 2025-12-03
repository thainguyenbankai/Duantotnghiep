import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { FiX } from 'react-icons/fi';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from '../redux/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const CartPage = () => {
  const cartItems = useSelector((state) => state?.cart?.cartItems || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const totalAmount = cartItems.reduce(
    (total, item) => total + Number(item.productPrice || 0) * Number(item.quantity || 1),
    0
  );

  return (
    <div className="max-w-7xl mx-auto p-4 grid mt-36 grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 mt-10">
        <h2 className="text-xl font-semibold mb-4">Giỏ hàng:</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-700">
            Giỏ hàng của bạn đang trống. Mời bạn mua thêm sản phẩm{' '}
            <Link to="/" className="text-red-500 font-semibold">tại đây.</Link>
          </p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.cartId || `${item._id}-${item.productColor || 'default'}-${item.productSize || 'default'}`}
              className="flex items-center justify-between border-b py-4"
            >
              <div className="flex items-center space-x-4">
                <img 
                  src={
                    item?.productImages && Array.isArray(item.productImages) && item.productImages.length > 0
                      ? item.productImages[0]
                      : 'https://via.placeholder.com/80x96?text=No+Image'
                  } 
                  alt={item?.productName || 'Product'} 
                  className="w-20 h-24 object-cover rounded" 
                />
                <div>
                  <h3 className="font-semibold">{item.productName}</h3>
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
                  <p className="text-sm text-gray-500">
                    Kích thước: {Array.isArray(item?.productSize) ? item.productSize[0] : item?.productSize || 'Mặc định'}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <button
                      onClick={() => dispatch(decreaseQuantity(item.cartId || item._id))}
                      className="border px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <AiOutlineMinus />
                    </button>
                    <span className="px-2 min-w-[30px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(increaseQuantity(item.cartId || item._id))}
                      className="border px-2 py-1 hover:bg-gray-100"
                    >
                      <AiOutlinePlus />
                    </button>
                    <span className="ml-4 text-red-500 font-semibold">
                      {((item.productPrice || 0) * (item.quantity || 1)).toLocaleString()}₫
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => dispatch(removeFromCart(item.cartId || item._id))}
                className="text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-red-50"
                title="Xóa sản phẩm"
              >
                <FiX size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="border p-4 rounded-lg bg-white shadow-md">
        <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
        <div className="flex justify-between mb-2 text-lg">
          <span>Tổng tiền:</span>
          <span className="text-red-500 font-bold">{totalAmount.toLocaleString()}₫</span>
        </div>
        <textarea className="w-full p-2 border rounded mb-2" placeholder="Ghi chú đơn hàng"></textarea>
        <button 
          onClick={handleCheckout}
          className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-800 transition-colors"
        >
          THANH TOÁN NGAY
        </button>
        
        <Link to="/" className="mt-4 block text-center text-sm text-gray-600 hover:underline">
          ↩ Tiếp tục mua hàng
        </Link>
      </div>
    </div>
  );
};

export default CartPage;