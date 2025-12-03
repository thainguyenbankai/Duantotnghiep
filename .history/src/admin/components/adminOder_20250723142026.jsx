import { useEffect, useState } from 'react';

export default function AdminOrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        limit: 20
    });

    const ORDER_STATUS = ["pending", "confirmed", "shipping", "completed", "cancelled"];

    const updateOrderStatus = async (orderId, newStatus, newPaymentStatus) => {
        try {
            setUpdating(orderId);
            const order = orders.find(o => o._id === orderId);

            const updateData = {
                status: newStatus,
                paymentStatus: order?.paymentMethod === 'BANK' ? 'paid' : (newPaymentStatus || 'unpaid')
            };

            const response = await fetch(`https://new-server-e.onrender.com/api/order/update/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });
            const responseData = await response.json();

            console.log('Update response:', responseData);
            alert('Cập nhật thành công!');
            fetchOrders(pagination.currentPage);

        } catch (error) {
            console.error('Error updating order:', error);
            alert('Cập nhật thất bại!');
        } finally {
            setUpdating(null);
        }
    };

    const fetchOrders = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`https://new-server-e.onrender.com/api/order/list?page=${page}`);
            const data = await response.json();

            console.log('API Response:', data);

            const result = data?.data;
            const orderData = result?.data || [];
            setOrders(Array.isArray(orderData) ? orderData : []);
            setPagination({
                currentPage: result?.current_page || 1,
                totalPages: result?.total_page || 1,
                totalItems: result?.total_data || 0,
                limit: result?.limit_per_page || 20
            });

        } catch (error) {
            console.error('Error:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleOrderDetail = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    useEffect(() => {
        let mounted = true;

        const loadOrders = async () => {
            if (mounted) {
                await fetchOrders(1);
            }
        };

        loadOrders();

        return () => {
            mounted = false;
        };
    }, []);

    const handlePageChange = (page) => {
        if (page !== pagination.currentPage && page >= 1 && page <= pagination.totalPages && !loading) {
            fetchOrders(page);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const current = pagination.currentPage;
        const total = pagination.totalPages;

        if (total <= 1) return [];
        if (total <= 7) {
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
            return pages;
        }
        pages.push(1);
        if (current > 3) pages.push('...');

        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
            if (!pages.includes(i)) pages.push(i);
        }

        if (current < total - 2) pages.push('...');
        if (total > 1) pages.push(total);

        return pages;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price || 0) + '₫';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            shipping: 'bg-purple-100 text-purple-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2">Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Danh sách đơn hàng</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giảm giá</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thanh toán</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="11" className="px-6 py-8 text-center text-gray-500">
                                    Không có đơn hàng nào
                                </td>
                            </tr>
                        ) : (
                            orders.map((order, index) => (
                                <>
                                    <tr key={order._id || index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => toggleOrderDetail(order._id)}
                                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                            >
                                                #{order._id?.slice(-8) || 'N/A'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {order.fullname || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {order.email || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {order.phoneNumber || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="text-sm font-medium">
                                                {order.products?.length || 0} sản phẩm
                                            </div>
                                            {order.products?.slice(0, 2).map((product, idx) => (
                                                <div key={idx} className="text-xs text-gray-500 max-w-xs">
                                                    <div className="font-medium truncate">{product.productName}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span>SL: {product.productQuantity}</span>
                                                        {product.productSize && (
                                                            <span className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                                                                {product.productSize}
                                                            </span>
                                                        )}
                                                        {product.productColor && (
                                                            <div className="flex items-center gap-1">
                                                                <div
                                                                    className="w-3 h-3 rounded-full border border-gray-300"
                                                                    style={{ backgroundColor: product.productColor }}
                                                                    title={product.productColor}
                                                                />
                                                                <span className="text-xs">{product.productColor}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {order.products?.length > 2 && (
                                                <div className="text-xs text-gray-400 mt-1">
                                                    +{order.products.length - 2} sản phẩm khác
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            {formatPrice(
                                                order.products?.reduce((total, product) =>
                                                    total + (product.productPrice * product.productQuantity), 0
                                                ) || 0
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {formatPrice(order.discountValue)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <select
                                                value={order.status || 'pending'}
                                                onChange={(e) => updateOrderStatus(order._id, e.target.value, order.paymentStatus)}
                                                disabled={updating === order._id}
                                                className="px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {ORDER_STATUS.map(status => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {order.paymentMethod === 'BANK' ? (
                                                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                                    paid (BANK)
                                                </span>
                                            ) : (
                                                <select
                                                    value={order.paymentStatus || 'unpaid'}
                                                    onChange={(e) => updateOrderStatus(order._id, order.status, e.target.value)}
                                                    disabled={updating === order._id}
                                                    className="px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="unpaid">unpaid</option>
                                                    <option value="paid">paid</option>
                                                </select>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {updating === order._id ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                            ) : (
                                                <button
                                                    onClick={() => updateOrderStatus(order._id, 'completed', 'paid')}
                                                    className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                                                >
                                                    Hoàn thành
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                    
                                    {/* Order Detail Row */}
                                    {expandedOrder === order._id && (
                                        <tr>
                                            <td colSpan="11" className="px-0 py-0">
                                                <div className="bg-gray-50 border-t border-b">
                                                    <div className="px-6 py-4">
                                                        <h4 className="font-semibold text-lg mb-4">Chi tiết đơn hàng #{order._id?.slice(-8)}</h4>

                                                        {/* Customer Info */}
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                                            <div className="bg-white p-3 rounded border">
                                                                <h5 className="font-medium text-gray-700 mb-2">Thông tin khách hàng</h5>
                                                                <p><span className="text-gray-600">Tên:</span> {order.fullname || 'N/A'}</p>
                                                                <p><span className="text-gray-600">Email:</span> {order.email || 'N/A'}</p>
                                                                <p><span className="text-gray-600">SĐT:</span> {order.phoneNumber || 'N/A'}</p>
                                                                <p><span className="text-gray-600">Địa chỉ:</span> {order.address || 'N/A'}</p>
                                                            </div>

                                                            <div className="bg-white p-3 rounded border">
                                                                <h5 className="font-medium text-gray-700 mb-2">Thông tin đơn hàng</h5>
                                                                <p><span className="text-gray-600">Ngày tạo:</span> {formatDate(order.createdAt)}</p>
                                                                <p><span className="text-gray-600">Trạng thái:</span>
                                                                    <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                                                                        {order.status || 'pending'}
                                                                    </span>
                                                                </p>
                                                                <p><span className="text-gray-600">Thanh toán:</span>
                                                                    <span className={`ml-2 px-2 py-1 rounded text-xs ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                        {order.paymentStatus || 'unpaid'}
                                                                    </span>
                                                                </p>
                                                                <p><span className="text-gray-600">Phương thức:</span> {order.paymentMethod || 'N/A'}</p>
                                                            </div>

                                                            <div className="bg-white p-3 rounded border">
                                                                <h5 className="font-medium text-gray-700 mb-2">Tổng kết</h5>
                                                                <p><span className="text-gray-600">Tạm tính:</span> {formatPrice(
                                                                    order.products?.reduce((total, product) =>
                                                                        total + (product.productPrice * product.productQuantity), 0
                                                                    ) || 0
                                                                )}</p>
                                                                <p><span className="text-gray-600">Giảm giá:</span> <span className="text-red-600">-{formatPrice(order.discountValue || 0)}</span></p>
                                                                <p><span className="text-gray-600">Phí ship:</span> {formatPrice(order.shippingFee || 0)}</p>
                                                                <p className="font-bold text-lg"><span className="text-gray-600">Tổng cộng:</span> {formatPrice(
                                                                    (order.products?.reduce((total, product) =>
                                                                        total + (product.productPrice * product.productQuantity), 0
                                                                    ) || 0) - (order.discountValue || 0) + (order.shippingFee || 0)
                                                                )}</p>
                                                            </div>
                                                        </div>

                                                        {/* Products Detail */}
                                                        <div className="bg-white rounded border">
                                                            <div className="px-4 py-3 border-b bg-gray-100">
                                                                <h5 className="font-medium">Danh sách sản phẩm ({order.products?.length || 0} sản phẩm)</h5>
                                                            </div>
                                                            <div className="overflow-x-auto">
                                                                <table className="w-full">
                                                                    <thead className="bg-gray-50">
                                                                        <tr>
                                                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Sản phẩm</th>
                                                                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Hình ảnh</th>
                                                                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Size</th>
                                                                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Màu</th>
                                                                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Đơn giá</th>
                                                                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">SL</th>
                                                                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Thành tiền</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-200">
                                                                        {order.products?.map((product, idx) => (
                                                                            <tr key={idx} className="hover:bg-gray-50">
                                                                                <td className="px-4 py-3">
                                                                                    <div>
                                                                                        <p className="font-medium text-sm">{product.productName}</p>
                                                                                        <p className="text-xs text-gray-500">ID: {product.productId}</p>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="px-4 py-3 text-center">
                                                                                    {product.productImage ? (
                                                                                        <img
                                                                                            src={product.productImage}
                                                                                            alt={product.productName}
                                                                                            className="w-12 h-12 object-cover rounded mx-auto border"
                                                                                        />
                                                                                    ) : (
                                                                                        <div className="w-12 h-12 bg-gray-200 rounded mx-auto flex items-center justify-center">
                                                                                            <span className="text-xs text-gray-500">No img</span>
                                                                                        </div>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-4 py-3 text-center">
                                                                                    {product.productSize ? (
                                                                                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                                                                                            {product.productSize}
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span className="text-gray-400 text-sm">-</span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-4 py-3 text-center">
                                                                                    {product.productColor ? (
                                                                                        <div className="flex items-center justify-center gap-2">
                                                                                            <div
                                                                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                                                                style={{ backgroundColor: product.productColor }}
                                                                                            />
                                                                                            <span className="text-sm">{product.productColor}</span>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <span className="text-gray-400 text-sm">-</span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-4 py-3 text-right font-medium">
                                                                                    {formatPrice(product.productPrice)}
                                                                                </td>
                                                                                <td className="px-4 py-3 text-center font-medium">
                                                                                    {product.productQuantity}
                                                                                </td>
                                                                                <td className="px-4 py-3 text-right font-bold">
                                                                                    {formatPrice(product.productPrice * product.productQuantity)}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>

                                                        {order.note && (
                                                            <div className="mt-4 bg-yellow-50 p-3 rounded border">
                                                                <h5 className="font-medium text-gray-700 mb-1">Ghi chú:</h5>
                                                                <p className="text-sm">{order.note}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex flex-col items-center gap-4">
                <div className="text-sm text-gray-600">
                    Trang {pagination.currentPage} / {pagination.totalPages} •
                    Hiển thị {orders.length} / {pagination.totalItems} đơn hàng
                </div>

                {pagination.totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={loading || pagination.currentPage === 1}
                            className="px-3 py-2 border border-gray-300 rounded bg-white text-black hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ‹ Trước
                        </button>

                        {getPageNumbers().map((page, index) => (
                            page === '...' ? (
                                <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    disabled={loading}
                                    className={`px-3 py-2 border rounded transition-colors disabled:opacity-50 ${page === pagination.currentPage
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-black border-gray-300 hover:bg-gray-100'
                                        }`}
                                >
                                    {page}
                                </button>
                            )
                        ))}

                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={loading || pagination.currentPage === pagination.totalPages}
                            className="px-3 py-2 border border-gray-300 rounded bg-white text-black hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Sau ›
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}