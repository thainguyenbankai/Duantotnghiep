import { useEffect, useState } from "react";

export default function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 20,
  });

  const ORDER_STATUS = ["pending", "confirmed", "shipping", "completed", "cancelled"];

  const getProductImage = (product) => {
    if (!product) return null;
    const img = product.productImage || product.image || product.imageUrl || (product.images?.[0] ?? null);
    if (!img) return null;
    return img.startsWith("http")
      ? img
      : `https://new-server-e.onrender.com/${img.replace(/^\//, "")}`;
  };

  const updateOrderStatus = async (orderId, newStatus, newPaymentStatus) => {
    try {
      setUpdating(orderId);
      const order = orders.find((o) => o._id === orderId);

      const updateData = {
        status: newStatus,
        paymentStatus:
          order?.paymentMethod === "BANK" ? "paid" : newPaymentStatus || "unpaid",
      };

      const response = await fetch(
        `https://new-server-e.onrender.com/api/order/update/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );
      const responseData = await response.json();

      console.log("Update response:", responseData);
      alert("Cập nhật thành công!");
      fetchOrders(pagination.currentPage);
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Cập nhật thất bại!");
    } finally {
      setUpdating(null);
    }
  };

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://new-server-e.onrender.com/api/order/list?page=${page}`
      );
      const data = await response.json();

      const result = data?.data;
      const orderData = result?.data || [];
      setOrders(Array.isArray(orderData) ? orderData : []);
      setPagination({
        currentPage: result?.current_page || 1,
        totalPages: result?.total_page || 1,
        totalItems: result?.total_data || 0,
        limit: result?.limit_per_page || 20,
      });
    } catch (error) {
      console.error("Error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetail = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const handlePageChange = (page) => {
    if (
      page !== pagination.currentPage &&
      page >= 1 &&
      page <= pagination.totalPages &&
      !loading
    ) {
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
    if (current > 3) pages.push("...");

    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(total - 1, current + 1);
      i++
    ) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (current < total - 2) pages.push("...");
    if (total > 1) pages.push(total);

    return pages;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price || 0) + "₫";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipping: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
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
              <th className="px-6 py-3 text-left text-xs font-medium">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Khách hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Số điện thoại</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Sản phẩm</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Tổng tiền</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Giảm giá</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Thanh toán</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Ngày tạo</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Thao tác</th>
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
              orders.map((order) => (
                <>
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => toggleOrderDetail(order._id)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        #{order._id?.slice(-8) || "N/A"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm">{order.fullname || "N/A"}</td>
                    <td className="px-6 py-4 text-sm">{order.email || "N/A"}</td>
                    <td className="px-6 py-4 text-sm">{order.phoneNumber || "N/A"}</td>
                    <td className="px-6 py-4 text-sm">{order.products?.length || 0} sản phẩm</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {formatPrice(order.products?.reduce((total, p) => total + p.productPrice * p.productQuantity, 0))}
                    </td>
                    <td className="px-6 py-4 text-sm">{formatPrice(order.discountValue)}</td>
                    <td className="px-6 py-4 text-sm">
                      {order.status === "completed" || order.status === "cancelled" ? (
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      ) : (
                        <select
                          value={order.status || "pending"}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value, order.paymentStatus)}
                          disabled={updating === order._id}
                          className="px-2 py-1 border rounded text-xs"
                        >
                          {ORDER_STATUS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.status === "completed" || order.status === "cancelled" ? (
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      ) : order.paymentMethod === "BANK" ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          paid (BANK)
                        </span>
                      ) : (
                        <select
                          value={order.paymentStatus || "unpaid"}
                          onChange={(e) => updateOrderStatus(order._id, order.status, e.target.value)}
                          disabled={updating === order._id}
                          className="px-2 py-1 border rounded text-xs"
                        >
                          <option value="unpaid">unpaid</option>
                          <option value="paid">paid</option>
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4 text-sm">
                      {order.status === "completed" ? (
                        <span className="text-green-600 font-medium">Đã hoàn thành</span>
                      ) : order.status === "cancelled" ? (
                        <span className="text-red-600 font-medium">Đã hủy</span>
                      ) : updating === order._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      ) : (
                        <button
                          onClick={() => updateOrderStatus(order._id, "completed", "paid")}
                          className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                        >
                          Hoàn thành
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Chi tiết đơn hàng */}
                  {expandedOrder === order._id && (
                    <tr>
                      <td colSpan="11">
                        <div className="bg-gray-50 border-t">
                          <div className="px-6 py-4">
                            <h4 className="font-semibold mb-3">
                              Chi tiết đơn #{order._id?.slice(-8)}
                            </h4>

                            {/* Thông tin khách hàng */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              <div className="bg-white p-3 rounded border">
                                <h5 className="font-medium text-gray-700 mb-2">
                                  Thông tin khách hàng
                                </h5>
                                <p><b>Tên:</b> {order.fullname || "N/A"}</p>
                                <p><b>Email:</b> {order.email || "N/A"}</p>
                                <p><b>SĐT:</b> {order.phoneNumber || "N/A"}</p>
                                <p><b>Địa chỉ:</b> {order.address || "N/A"}</p>
                              </div>

                              <div className="bg-white p-3 rounded border">
                                <h5 className="font-medium text-gray-700 mb-2">
                                  Thông tin đơn hàng
                                </h5>
                                <p><b>Ngày tạo:</b> {formatDate(order.createdAt)}</p>
                                <p><b>Trạng thái:</b>{" "}
                                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                                    {order.status}
                                  </span>
                                </p>
                                <p><b>Thanh toán:</b>{" "}
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    order.paymentStatus === "paid"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}>
                                    {order.paymentStatus}
                                  </span>
                                </p>
                                <p><b>Phương thức:</b> {order.paymentMethod}</p>
                              </div>

                              <div className="bg-white p-3 rounded border">
                                <h5 className="font-medium text-gray-700 mb-2">Tổng kết</h5>
                                <p><b>Tạm tính:</b> {formatPrice(order.products?.reduce((t, p) => t + p.productPrice * p.productQuantity, 0))}</p>
                                <p><b>Giảm giá:</b> -{formatPrice(order.discountValue || 0)}</p>
                                <p><b>Phí ship:</b> {formatPrice(order.shippingFee || 0)}</p>
                                <p className="font-bold text-lg">
                                  <b>Tổng cộng:</b>{" "}
                                  {formatPrice(
                                    (order.products?.reduce((t, p) => t + p.productPrice * p.productQuantity, 0) || 0) -
                                      (order.discountValue || 0) +
                                      (order.shippingFee || 0)
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Danh sách sản phẩm */}
                            <div className="bg-white rounded border">
                              <div className="px-4 py-3 border-b bg-gray-100">
                                <h5 className="font-medium">
                                  Danh sách sản phẩm ({order.products?.length || 0} sản phẩm)
                                </h5>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-4 py-3 text-left">Sản phẩm</th>
                                      <th className="px-4 py-3 text-center">Ảnh</th>
                                      <th className="px-4 py-3 text-center">Size</th>
                                      <th className="px-4 py-3 text-center">Màu</th>
                                      <th className="px-4 py-3 text-right">Đơn giá</th>
                                      <th className="px-4 py-3 text-center">SL</th>
                                      <th className="px-4 py-3 text-right">Thành tiền</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.products?.map((product, idx) => (
                                      <tr key={idx} className="border-t">
                                        <td className="px-4 py-3">{product.productName}</td>
                                        <td className="px-4 py-3 text-center">
                                          {getProductImage(product) ? (
                                            <img
                                              src={getProductImage(product)}
                                              alt={product.productName}
                                              className="w-12 h-12 object-cover mx-auto rounded border"
                                            />
                                          ) : (
                                            <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded">
                                              <span className="text-xs text-gray-500">No img</span>
                                            </div>
                                          )}
                                        </td>
                                        <td className="px-4 py-3 text-center">{product.productSize || "-"}</td>
                                        <td className="px-4 py-3 text-center">{product.productColor || "-"}</td>
                                        <td className="px-4 py-3 text-right">{formatPrice(product.productPrice)}</td>
                                        <td className="px-4 py-3 text-center">{product.productQuantity}</td>
                                        <td className="px-4 py-3 text-right font-medium">
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
          Trang {pagination.currentPage} / {pagination.totalPages} • Hiển thị{" "}
          {orders.length} / {pagination.totalItems} đơn hàng
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={loading || pagination.currentPage === 1}
              className="px-3 py-2 border rounded bg-white text-black disabled:opacity-50"
            >
              ‹ Trước
            </button>

            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={loading}
                  className={`px-3 py-2 border rounded ${
                    page === pagination.currentPage
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={loading || pagination.currentPage === pagination.totalPages}
              className="px-3 py-2 border rounded bg-white text-black disabled:opacity-50"
            >
              Sau ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
