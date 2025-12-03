import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../redux/AuthSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUser, FiLock, FiShoppingBag, FiHeart, FiLogOut, FiEdit, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const tabs = [
  { name: 'Thông tin', key: 'info', icon: 'user' },
  { name: 'Đổi mật khẩu', key: 'password', icon: 'lock' },
  { name: 'Danh sách đơn hàng', key: 'orders', icon: 'shopping-bag' },
  { name: 'Sản phẩm yêu thích', key: '/wishlist', icon: 'heart' },
  { name: 'Đăng xuất', key: 'logout', icon: 'log-out' }
];

export default function Account() {
  const [activeTab, setActiveTab] = useState('info');
  const [userOrder, setUserOrder] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', phoneNumber: '', address: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', password: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
  const [loading, setLoading] = useState({ user: false, password: false, orders: false, logout: false });

  const [street, setStreet] = useState('');
  const [ward, setWard] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');

  // Helper function để render icon
  const renderIcon = (iconName) => {
    const iconProps = { className: "w-5 h-5" };
    switch (iconName) {
      case 'user': return <FiUser {...iconProps} />;
      case 'lock': return <FiLock {...iconProps} />;
      case 'shopping-bag': return <FiShoppingBag {...iconProps} />;
      case 'heart': return <FiHeart {...iconProps} />;
      case 'log-out': return <FiLogOut {...iconProps} />;
      default: return <FiUser {...iconProps} />;
    }
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Người dùng';

  const apiCall = async (url, data = null, method = 'patch') => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Phiên đăng nhập đã hết hạn');
      dispatch(logout());
      navigate('/login');
      return null;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
      return await axios[method](url, method === 'get' ? config : data, config);
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
        navigate('/login');
      }
      throw error;
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(`https://new-server-e.onrender.com/api/order/cancel/${orderId}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Hủy đơn hàng thành công!');
      loadOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng');
    }
  };

  // ✅ Hàm logout được sửa lại
  const handleLogout = async () => {
    // Hiển thị confirm dialog
    const confirmLogout = window.confirm('Bạn có chắc chắn muốn đăng xuất?');
    if (!confirmLogout) return;

    setLoading(prev => ({ ...prev, logout: true }));

    try {
      const token = localStorage.getItem('accessToken');

      if (token) {
        // Gọi API logout trên server
        await axios.patch(`https://new-server-e.onrender.com/api/auth/logout`, null, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // Xóa dữ liệu local
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // Dispatch logout action
      dispatch(logout());

      // Thông báo thành công
      toast.success('Đăng xuất thành công!');

      // Redirect về trang chủ
      navigate('/');

    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);

      // Dù có lỗi API, vẫn thực hiện logout local
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('favorite');

      dispatch(logout());
      dispatch({ type: 'favorite/resetFavorites' });

      toast.error('Đăng xuất thành công!'); // Vẫn hiển thị success vì đã logout local
      navigate('/');
    } finally {
      setLoading(prev => ({ ...prev, logout: false }));
    }
  };

  // account lấy user từ 
  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || ''
      });

      // 🔧 FIX: Kiểm tra address trước khi split
      if (user.address && typeof user.address === 'string' && user.address.trim()) {
        const parts = user.address.split(', ');
        setStreet(parts[0] || '');
        setWard(parts[1] || '');
        setDistrict(parts[2] || '');
        setProvince(parts[3] || '');
      } else {
        setStreet('');
        setWard('');
        setDistrict('');
        setProvince('');
      }

      loadOrders();
    }
  }, [user]);

  useEffect(() => {
    const addressParts = [street, ward, district, province].filter(part => part && part.trim());
    const fullAddress = addressParts.join(', ');
    setEditForm(prev => ({ ...prev, address: fullAddress }));
  }, [street, ward, district, province]);

  // get data đơn hàng 
  const loadOrders = async () => {
    setLoading(prev => ({ ...prev, orders: true }));
    try {
      const response = await apiCall('https://new-server-e.onrender.com/api/order/list-of-user', null, 'get');
      setUserOrder(response?.data?.data || []);
      
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
      setUserOrder([]);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  const handleTabClick = (tabKey) => {
    if (tabKey === 'logout') {
      handleLogout(); // ✅ Gọi hàm logout mới
    } else {
      setActiveTab(tabKey);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    // Validation
    if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
      return toast.error('Vui lòng nhập đầy đủ họ tên!');
    }

    // Validation phone number (optional)
    if (editForm.phoneNumber && !/^[0-9+\-\s()]+$/.test(editForm.phoneNumber)) {
      return toast.error('Số điện thoại không hợp lệ!');
    }

    setLoading(prev => ({ ...prev, user: true }));
    try {
      const response = await apiCall('https://new-server-e.onrender.com/api/user/update', editForm);
      if (response) {
        // Update localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...editForm };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        toast.success('Cập nhật thành công!');
        setIsEditing(false);

        // Reload page sau 1s để cập nhật Redux state
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error('Lỗi cập nhật user:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật');
    } finally {
      setLoading(prev => ({ ...prev, user: false }));
    }
  };


  // validate
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.oldPassword.trim()) {
      return toast.error('Vui lòng nhập mật khẩu hiện tại!');
    }
    if (!passwordForm.password.trim()) {
      return toast.error('Vui lòng nhập mật khẩu mới!');
    }
    if (passwordForm.password.length < 6) {
      return toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
    }
    if (passwordForm.password !== passwordForm.confirmPassword) {
      return toast.error('Xác nhận mật khẩu không khớp!');
    }

    //
    setLoading(prev => ({ ...prev, password: true }));
    try {
      await apiCall('https://new-server-e.onrender.com/api/user/update', {
        oldPassword: passwordForm.oldPassword,
        password: passwordForm.password
      });
// call api đổi mk
      toast.success('Đổi mật khẩu thành công!');
      setPasswordForm({ oldPassword: '', password: '', confirmPassword: '' });
      setShowPasswords({ old: false, new: false, confirm: false });
    } catch (error) {
      console.error('Lỗi đổi mật khẩu:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Đang tải...</h2>
          <p className="text-gray-600 mb-4">Vui lòng đợi trong giây lát</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">

          <div className="w-80">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="flex w-15 h-16 items-center justify-center">
                  <DotLottieReact
                    src="https://lottie.host/062b939e-cd35-4687-9474-bd41741b503f/madlrX6AzP.lottie"
                    loop
                    autoplay
                    style={{ width: '100%', height: '100%'  ,}}
                  />
                </div>
    
                <div>
                  <h3 className="font-medium">{fullName}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  tab.key === '/wishlist' ? (
                    <Link key={tab.key} to={tab.key} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 w-full text-left transition-colors">
                      {renderIcon(tab.icon)}
                      <span>{tab.name}</span>
                    </Link>
                  ) : (
                    <button
                      key={tab.key}
                      onClick={() => handleTabClick(tab.key)}
                      disabled={loading.logout && tab.key === 'logout'}
                      className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 w-full text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${activeTab === tab.key && tab.key !== 'logout' ? 'text-red-500 bg-red-50' :
                        tab.key === 'logout' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                        }`}
                    >
                      {loading.logout && tab.key === 'logout' ? (
                        <div className="animate-spin h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full"></div>
                      ) : (
                        renderIcon(tab.icon)
                      )}
                      <span>{loading.logout && tab.key === 'logout' ? 'Đang đăng xuất...' : tab.name}</span>
                    </button>
                  )
                ))}
              </nav>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow-sm p-8">

            {activeTab === 'info' && (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-semibold">Thông tin tài khoản</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-8 py-2 rounded flex items-center gap-4 transition-colors ${isEditing ? 'bg-gray-500 text-white hover:bg-gray-600' : 'bg-black text-white hover:bg-gray-800'
                      }`}
                  >
                    {isEditing ? (
                      <>
                        <FiX className="w-4 h-4" />
                        <span>Hủy</span>
                      </>
                    ) : (
                      <>
                        <FiEdit className="w-4 h-4" />
                        <span>sửa</span>
                      </>
                    )}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleUpdateUser} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tên *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={editForm.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          maxLength={50}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Họ *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={editForm.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          maxLength={50}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={editForm.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0123456789"
                        maxLength={15}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-medium">Địa chỉ</label>

                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Số nhà, tên đường"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        maxLength={100}
                      />

                      <div className="grid grid-cols-3 gap-4">
                        <input
                          type="text"
                          value={ward}
                          onChange={(e) => setWard(e.target.value)}
                          placeholder="Phường/Xã"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          maxLength={50}
                        />
                        <input
                          type="text"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          placeholder="Quận/Huyện"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          maxLength={50}
                        />
                        <input
                          type="text"
                          value={province}
                          onChange={(e) => setProvince(e.target.value)}
                          placeholder="Tỉnh/TP"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          maxLength={50}
                        />
                      </div>

                      {editForm.address && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Địa chỉ: <strong>{editForm.address}</strong></p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-6">
                      <button
                        type="submit"
                        disabled={loading.user}
                        className="px-6 py-2 bg-black  text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading.user ? 'Đang lưu...' : 'Lưu'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div><strong>Họ tên:</strong> {fullName}</div>
                    <div><strong>Email:</strong> {user?.email}</div>
                    <div><strong>Số điện thoại:</strong> {user?.phoneNumber || 'Chưa cập nhật'}</div>
                    <div><strong>Địa chỉ:</strong> {user?.address || 'Chưa cập nhật'}</div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'password' && (
              <>
                <h2 className="text-2xl font-semibold mb-8">Đổi mật khẩu</h2>
                <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-2">Mật khẩu hiện tại *</label>
                    <div className="relative">
                      <input
                        type={showPasswords.old ? "text" : "password"}
                        name="oldPassword"
                        value={passwordForm.oldPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                      >
                        {showPasswords.old ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Mật khẩu mới *</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="password"
                        value={passwordForm.password}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      >
                        {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Xác nhận mật khẩu *</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      >
                        {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading.password}
                    className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading.password ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                  </button>
                </form>
              </>
            )}

            {/* Đơn hàng */}
            {activeTab === 'orders' && (
              <>
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h2>
                  <p className="mt-2 ">Quản lý và theo dõi tình trạng các đơn hàng của bạn</p>
                </div>

                {loading.orders ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin h-8 w-8 border-2  border-t-gray-900 rounded-full mb-4"></div>
                    <p className="text-sm text-gray-600">Đang tải đơn hàng...</p>
                  </div>
                ) : userOrder.length > 0 ? (
                  <div className="space-y-4">
                    {userOrder.map((order) => {
                      const total = order.products?.reduce(
                        (sum, item) => sum + (item.productPrice || 0) * (item.productQuantity || 0),
                        0
                      );
                      const orderDate = new Date(order.createdAt);

                      return (
                        <div
                          key={order._id}
                          className="bg-white border border-gray-200 rounded-lg  transition-colors"
                        >
                          <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    #{order.orderId?.replace("ORDER_", "").slice(-8) || 'N/A'}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {orderDate.toLocaleDateString("vi-VN", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${order.paymentStatus === "paid"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                  {order.paymentStatus === "paid" ? "Đã thanh toán" : "Chờ thanh toán"}
                                </span>

                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "completed"
                                    ? "bg-blue-100 text-blue-700"
                                    : order.status === "pending"
                                      ? "bg-gray-100 text-gray-700"
                                      : "bg-red-100 text-red-700"
                                    }`}
                                >
                                  {order.status === "completed" ? "Hoàn thành" : order.status === "pending" ? "Đang xử lý" : "Đã hủy"}
                                </span>

                                {order.status === "pending" && (
                                  <button
                                    onClick={() => {
                                      if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
                                        cancelOrder(order._id);
                                      }
                                    }}
                                    className="px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                                  >
                                    Hủy đơn
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Nội dung đơn */}
                          <div className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Sản phẩm */}
                              <div className="md:col-span-2">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Sản phẩm</h4>
                                <div className="space-y-3">
                                  {order.products?.slice(0, 2).map((product, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                      <img
                                        src={product.productImages || "https://via.placeholder.com/48x48?text=IMG"}
                                        alt={product.productName || 'Sản phẩm'}
                                        className="w-12 h-12 object-cover rounded-md bg-gray-100"
                                        onError={(e) => {
                                          e.target.src = "https://via.placeholder.com/48x48?text=IMG";
                                        }}
                                      />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{product.productName || 'Sản phẩm'}</p>
                                        <p className="text-xs text-gray-500">
                                          SL: {product.productQuantity || 0} • {(product.productPrice || 0).toLocaleString()}₫
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                  {order.products?.length > 2 && (
                                    <p className="text-xs text-gray-400">
                                      +{order.products.length - 2} sản phẩm khác
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Thông tin đơn */}
                              <div className="space-y-3">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Tổng tiền</p>
                                  <p className="text-lg font-bold text-gray-900">{(total || 0).toLocaleString()}₫</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Địa chỉ</p>
                                  <p className="text-sm text-gray-700 line-clamp-2">{order.address || "Chưa có thông tin"}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Thanh toán</p>
                                  <p className="text-sm text-gray-700">
                                    {order.paymentMethod === "BANK" ? "Chuyển khoản" : "Khi nhận hàng"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-gray-500 mb-6">Bạn chưa thực hiện đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
                    <button
                      onClick={() => navigate("/")}
                      className="inline-flex items-center px-6 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-md transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      Mua sắm ngay
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}