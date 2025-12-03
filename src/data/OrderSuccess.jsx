
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderData, formData, totalAmount } = location.state || {};
    const cartItems = useSelector((state) => state?.cart?.cartItems);


    if (!orderData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4">Không tìm thấy thông tin đơn hàng</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                        Về trang chủ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="bg-white ">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-center">
                        <img
                            src='https://file.hstatic.net/200000584505/file/jp_fashion_200x80_ebdc8724d9f14d47bd874a6bb664f061_grande.png'
                            alt="JP Fashion Logo"
                            className="h-12"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Đặt hàng thành công</h1>
                    </div>



                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                        <div>
                            <p className="text-lg text-gray-600 mb-2">
                                Mã đơn hàng {orderData.orderId || orderData._id || 'HRV119048'}
                            </p>
                            <p className="text-gray-500">Cảm ơn bạn đã mua hàng!</p>

                            <h2 className="text-xl font-semibold mb-6">Thông tin đơn hàng</h2>


                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium mb-3">Thông tin giao hàng</h3>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="font-medium">{formData?.fullname || orderData.fullname}</span>
                                        </div>
                                        <div className="text-gray-600">{formData?.email || orderData.email}</div>
                                        <div className="text-gray-600">{formData?.phoneNumber || orderData.phoneNumber}</div>
                                        <div className="text-gray-600">{formData?.address || orderData.address}</div>
                                        <div className="text-gray-600">Việt Nam</div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium mb-3">Phương thức thanh toán</h3>
                                    <div className="text-sm">
                                        <div className="font-medium">
                                            {(formData?.paymentMethod || orderData.paymentMethod) === 'COD' ? 'Thanh toán khi giao hàng (COD)' : 'Chuyển khoản MomoPay'}
                                        </div>
                                        <div className="text-gray-600 mt-1">
                                            Trạng thái: <span className="text-yellow-600">{orderData.paymentStatus || 'Chưa thanh toán'}</span>
                                        </div>
                                        <div className="text-gray-600">
                                            Đơn hàng: <span className="text-blue-600">{orderData.status || 'Đang xử lý'}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-6">Đơn hàng của bạn</h2>
                            <div className="border rounded-lg p-4">
                                <div className="space-y-4 mb-6">
                                    {orderData?.products && orderData.products.length > 0 ? (
                                        orderData?.products.map((product, index) => (
                                            <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-b-0">
                                                <div className="relative">
                                                    <img
                                                        src={product.productImages || 'https://via.placeholder.com/60x75?text=No+Image'}
                                                        alt={product.productName}
                                                        className="w-12 h-16 object-cover rounded border"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/60x75?text=Error';
                                                        }}
                                                    />

                                                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                        {product.productQuantity}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-sm mb-1">{product.productName}</h3>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        {product.productColor && (
                                                            <div className="flex items-center gap-1">
                                                                <div
                                                                    className="w-3 h-3 rounded border border-gray-300"
                                                                    style={{ backgroundColor: product.productColor }}
                                                                ></div>
                                                                <span>/</span>
                                                                <span>{product?.productSize}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-sm">
                                                        {(product.productPrice * product.productQuantity).toLocaleString()}₫
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>Không có thông tin sản phẩm</p>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t pt-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span>Tạm tính</span>
                                        <span>{totalAmount?.toLocaleString() || '0'}₫</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Phí vận chuyển</span>
                                        <span>Miễn phí</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-semibold border-t pt-3">
                                        <span>Tổng cộng</span>
                                        <div className="text-right">
                                            <span className="text-xs text-gray-500">VND</span>
                                            <span className="ml-2 text-xl text-green-600">
                                                {totalAmount?.toLocaleString() || '0'}₫
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center pt-4">
                                <Link to={'/product'}>
                                    <p className="text-sm underline underline-offset-4 hover:text-black text-gray-500">
                                        tiếp tục mua hàng ?
                                    </p>
                                </Link>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;