import { useEffect, useState } from 'react';
import axios from 'axios';
import AddProduct from './Product/addProdcut';
import EditProduct from './Product/editProduct';
import DetailProduct from './Product/detailProduct';

const ListProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [AddProductModal, setAddProductModal] = useState(false);
    const [EditProductModal, setEditProductModal] = useState(false);
    const [detail, setDetailPProduct] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        setLoading(true);
        axios.post('https://new-server-e.onrender.com/api/product/list')
            .then(response => {
                console.log(response, 'product list response');
                setProducts(response?.data?.data?.data || []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Axios fetch error:', error);
                setProducts([]);
                setLoading(false);
            });
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            return;
        }

        try {
            setDeleteLoading(productId);
            const response = await axios.delete(`https://new-server-e.onrender.com/api/product/delete/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Delete response:', response.data);

            setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
            alert('Xóa sản phẩm thành công!');

        } catch (error) {
            console.error('Delete product error:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm!';
            alert(errorMessage);

        } finally {
            setDeleteLoading(null);
        }
    };

    const handleEditProduct = (productId) => {
        console.log('🛠️ Edit button clicked, productId:', productId);
        setSelectedProductId(productId);
        setEditProductModal(true);
        // Cập nhật URL để hiện ID trong params
        window.history.pushState({}, '', `/admin/edit/${productId}`);
        console.log('📋 Modal state set, selectedProductId:', productId);
    };


    const handleDetailProduct = (productId) => {
        setSelectedProductId(productId);
        setHandleDetailProduct(true);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (loading) {
        return (
            <div className="p-4 text-center">
                <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-4"></div>
                <div className="text-lg">Đang tải danh sách sản phẩm...</div>
            </div>
        );
    }

    return (
        <div className="p-4 relative">
            {AddProductModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <AddProduct
                            onClose={() => setAddProductModal(false)}
                            onSuccess={() => {
                                setAddProductModal(false);
                                fetchProducts();
                            }}
                        />
                    </div>
                </div>
            )}

            {EditProductModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <EditProduct
                            open={EditProductModal}
                            productId={selectedProductId}
                            onClose={() => {
                                setEditProductModal(false);
                                setSelectedProductId(null);
                                // Trở về URL ban đầu
                                window.history.pushState({}, '', '/admin/listproduct');
                            }}
                            onSuccess={() => {
                                setEditProductModal(false);
                                setSelectedProductId(null);
                                fetchProducts();
                                // Trở về URL ban đầu
                                window.history.pushState({}, '', '/admin/listproduct');
                            }}
                        />
                    </div>
                </div>
            )}


              {detail && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <DetailProduct
                            open={handleDetailProduct}
                            productId={selectedProductId}
                            product={detail}
                            onClose={() => {
                                setDetailPProduct(false);
                                setSelectedProductId(null);
                 
                            }}
                            onSuccess={() => {
                                setEditProductModal(false);
                                setSelectedProductId(null);
                                fetchProducts();
                            }}
                        />
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Danh sách sản phẩm</h2>
                <button
                    onClick={() => setAddProductModal(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                    Thêm sản phẩm
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="py-3 px-4 text-left">Hình ảnh</th>
                            <th className="py-3 px-4 text-left">Tên sản phẩm</th>
                            <th className="py-3 px-4 text-left">Giá</th>
                            <th className="py-3 px-4 text-left">Số lượng</th>
                            <th className="py-3 px-4 text-left">Đã bán</th>
                            <th className="py-3 px-4 text-left">Màu sắc</th>
                            <th className="py-3 px-4 text-left">Kích cỡ</th>
                            <th className="py-3 px-4 text-left">Ngày tạo</th>
                            <th className="py-3 px-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map(product => (
                                <tr key={product._id} className="border-b hover:bg-gray-100">
                                    <td className="py-3 px-4">
                                        {product.productImages && product.productImages.length > 0 ? (
                                            <img
                                                src={product.productImages[0]}
                                                alt={product.productName}
                                                className="w-12 h-12 object-cover rounded"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                                <span className="text-gray-500 text-xs">No img</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 font-medium">
                                        {product.productName || 'Chưa có tên'}
                                    </td>
                                    <td className="py-3 px-4 font-semibold text-green-600">
                                        {product.productPrice ? formatPrice(product.productPrice) : 'Chưa có giá'}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded text-sm ${(product.productQuantity || 0) > 0
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {product.productQuantity || 0}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                                            {product.soldAmount || 0}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {product?.productColor && product.productColor.length > 0 ? (
                                            <div className="flex gap-1">
                                                {product.productColor.slice(0, 3).map((color, index) => (
                                                    <div
                                                        key={color + index}
                                                        className="w-6 h-6 rounded border-2 border-gray-300"
                                                        style={{ backgroundColor: color }}
                                                        title={color}
                                                    ></div>
                                                ))}
                                                {product.productColor.length > 3 && (
                                                    <span className="text-xs text-gray-500 self-center">
                                                        +{product.productColor.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 text-sm">Chưa có</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {product.productSize && product.productSize.length > 0 ? (
                                            <div className="flex gap-1 flex-wrap">
                                                {product.productSize.slice(0, 3).map((size, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                                    >
                                                        {size}
                                                    </span>
                                                ))}
                                                {product.productSize.length > 3 && (
                                                    <span className="text-xs text-gray-500">
                                                        +{product.productSize.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 text-sm">Chưa có</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-sm">
                                        {product.createdAt ? formatDate(product.createdAt) : 'Chưa có'}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => handleEditProduct(product._id)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm transition-colors"
                                                disabled={deleteLoading === product._id}
                                            >
                                                Sửa
                                            </button>

                                            <button
                                                onClick={() => setDetailPProduct(product)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm transition-colors"
                                                disabled={deleteLoading === product._id}
                                            >
                                                chi tiết
                                            </button>



                                            <button
                                                onClick={() => handleDeleteProduct(product._id)}
                                                disabled={deleteLoading === product._id}
                                                className={`px-3 py-1 rounded text-sm transition-colors ${deleteLoading === product._id
                                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                                        : 'bg-red-500 text-white hover:bg-red-600'
                                                    }`}
                                            >
                                                {deleteLoading === product._id ? (
                                                    <div className="flex items-center gap-1">
                                                        <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full"></div>
                                                        <span>Xóa...</span>
                                                    </div>
                                                ) : (
                                                    'Xóa'
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center py-8 text-gray-500">
                                    <div className="text-lg">Không có sản phẩm nào.</div>
                                    <div className="text-sm mt-2">Hãy thêm sản phẩm đầu tiên của bạn!</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {products.length > 0 && (
                <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Tổng cộng: {products.length} sản phẩm
                    </div>
                    <button
                        onClick={fetchProducts}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm transition-colors"
                    >
                        🔄 Tải lại
                    </button>
                </div>
            )}
        </div>
    );
};

export default ListProducts;