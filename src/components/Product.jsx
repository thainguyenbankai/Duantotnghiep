/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaFilter, FaSort } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { toggleFavorite } from '../redux/favoriteSlice';
import toast from 'react-hot-toast';
import AOS from 'aos';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import 'aos/dist/aos.css';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter states
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low', 'price-high'
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favorites = useSelector((state) => state.favorite);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.post(`https://new-server-e.onrender.com/api/product/list?limit=8&page=${page}`, {

      });

      const data = response.data?.data;
      console.log('Fetch products response:', data);

      if (data && data.data) {
        setProducts(data.data);
        setCurrentPage(data.current_page || page);
        setTotalPages(data.total_page || 1);
        setTotalProducts(data.total || 0);
      } else {
        setProducts([]);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalProducts(0);
      }
    } catch (err) {
      console.error('Chi tiết lỗi khi fetch sản phẩm:', err.response?.data || err.message);
      toast.error('Không thể tải sản phẩm. Vui lòng thử lại!');
      setProducts([]);
      setCurrentPage(1);
      setTotalPages(1);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(product => {
        const price = product.productPrice || 0;
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.productPrice || 0) - (b.productPrice || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.productPrice || 0) - (a.productPrice || 0));
        break;
      case 'name-asc':
        filtered.sort((a, b) => (a.productName || '').localeCompare(b.productName || ''));
        break;
      case 'name-desc':
        filtered.sort((a, b) => (b.productName || '').localeCompare(a.productName || ''));
        break;
      default:
        // Keep original order
        break;
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts(1);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, sortBy, priceRange]);

  const handlePageChange = (page) => {
    if (page === currentPage || page < 1 || page > totalPages || loading) {
      return;
    }

    console.log('Chuyển sang trang:', page);
    setCurrentPage(page);
    fetchProducts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const current = currentPage;
    const total = totalPages;

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

  const handleAddToCart = (product) => {
    try {
      toast.success('Thêm vào giỏ hàng thành công!', {
        position: 'top-center',
        duration: 2500,
        style: {
          background: '#ecfdf5',
          border: '1px solid #34d399',
          color: '#065f46',
          fontWeight: 500,
          borderRadius: '10px',
          padding: '12px 16px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
        },
      });

      dispatch(
        addToCart({
          ...product,
          productSize: product.productSize?.[0] || '',
          productColor: product.productColor?.[0] || '',
          quantity: 1,
        })
      );
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng!', error);
    }
  };

  const handleToggleFavorite = (product) => {
    try {
      const isFav = favorites.some((item) => item._id === product._id);
      dispatch(toggleFavorite(product));

      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex-shrink-0">
            <DotLottieReact
              src={isFav
                ? "https://lottie.host/embed/your-heart-remove-animation.lottie"
                : "https://lottie.host/embed/your-heart-add-animation.lottie"
              }
              loop={false}
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <div>
            <strong className={isFav ? 'text-gray-600' : 'text-red-500'}>
              {isFav ? 'Đã bỏ yêu thích' : 'Đã thêm vào yêu thích'}
            </strong>
          </div>
        </div>,
        {
          position: 'top-center',
          autoClose: 2000,
          icon: false,
          style: {
            background: isFav ? '#f9fafb' : '#fef2f2',
            border: `1px solid ${isFav ? '#e5e7eb' : '#fecaca'}`,
            borderRadius: '12px',
            padding: '12px',
          }
        }
      );
    } catch (error) {
      console.error('Lỗi khi toggle favorite:', error);
      toast.error('Có lỗi xảy ra!');
    }
  };

  const handleViewProduct = (productId) => {
    try {
      setLoadingProductId(productId);
      setTimeout(() => {
        navigate(`/product/${productId}`);
        setLoadingProductId(null);
      }, 400);
    } catch (error) {
      console.error('Lỗi khi chuyển trang:', error);
      setLoadingProductId(null);
      toast.error('Có lỗi xảy ra khi chuyển trang!');
    }
  };

  const handleResetFilters = () => {
    setSortBy('default');
    setPriceRange({ min: '', max: '' });
    toast.success('Đã reset bộ lọc!');
  };

  const handlePriceRangeChange = (field, value) => {
    setPriceRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading && products.length === 0) {
    return (
      <div className="bg-white min-h-screen px-6 py-10">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-gray-900 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="bg-white min-h-screen px-6 py-10">
        <div className="flex flex-col justify-center items-center py-20">
          <div className="text-gray-500 text-lg mb-4">Không tìm thấy sản phẩm nào</div>
          <button
            onClick={() => fetchProducts(1)}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Tải lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen px-6 py-10">
      {/* Filter Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Sản phẩm</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
          >
            <FaFilter className="text-sm" />
            <span>Bộ lọc</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaSort className="inline mr-1" />
                  Sắp xếp theo
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="default">Mặc định</option>
                  <option value="price-low">Giá: Thấp → Cao</option>
                  <option value="price-high">Giá: Cao → Thấp</option>
                  <option value="name-asc">Tên: A → Z</option>
                  <option value="name-desc">Tên: Z → A</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khoảng giá (₫)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={priceRange.min}
                    onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    value={priceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>


              <div className="flex items-end">
                <button
                  onClick={handleResetFilters}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Reset bộ lọc
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter status */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Hiển thị {filteredProducts.length} / {totalProducts} sản phẩm
            {(sortBy !== 'default' || priceRange.min || priceRange.max) && (
              <span className="ml-2 text-blue-600 font-medium">
                (Đã lọc)
              </span>
            )}
          </span>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-gray-900 rounded-full"></div>
        </div>
      )}

      {/* Products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product, index) => (
          <div
            key={product._id}
            className="relative group bg-white"
            data-aos="fade-up"
            data-aos-delay={index * 50}
            data-aos-duration="500"
            data-aos-easing="ease-in-out"
          >
            <div className="relative overflow-hidden">
              <Link to={`/product/${product._id}`}>
                <div className="relative w-full h-[400px]">
                  <img
                    src={
                      product.productImages?.[0] ||
                      'https://via.placeholder.com/400x400?text=No+Image'
                    }
                    alt={product.productName || 'Product'}
                    className={`w-full h-full object-cover rounded-md transition-opacity duration-300 ${product.productImages?.[1] ? 'group-hover:opacity-0' : 'hover:opacity-90'
                      }`}
                    loading="lazy"
                  />

                  {product.productImages?.[1] && (
                    <img
                      src={product.productImages[1]}
                      alt={product.productName || 'Product'}
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-md transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                      loading="lazy"
                    />
                  )}
                </div>
              </Link>

              <button
                className={`absolute top-3 right-3 z-10 text-xl transition ${favorites.some((item) => item._id === product._id)
                  ? 'text-red-500'
                  : 'text-gray-400 hover:text-red-500'
                  }`}
                onClick={() => handleToggleFavorite(product)}
                aria-label="Toggle favorite"
              >
                <FaHeart />
              </button>

              <div className="absolute -bottom-1 left-0 w-full flex justify-between gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 px-2 pb-2">
                <button
                  className="bg-black text-white text-sm px-2 py-1.5 border border-black w-full hover:border-white hover:text-red-500 transition-colors duration-300"
                  onClick={() => handleAddToCart(product)}
                  disabled={loading}
                >
                  Thêm vào giỏ
                </button>

                <button
                  className="bg-black text-white text-sm px-2 py-1.5 border border-black w-full hover:border-white hover:text-red-500 transition-colors duration-300 relative"
                  onClick={() => handleViewProduct(product._id)}
                  disabled={loadingProductId === product._id}
                >
                  {loadingProductId === product._id ? (
                    <span className="animate-pulse">Đang tải...</span>
                  ) : (
                    'Xem nhanh'
                  )}
                </button>
              </div>
            </div>

            <div className="pt-3">
              <p className="text-sm truncate">{product.productName || 'Tên sản phẩm'}</p>
              <p className="text-red-600 font-semibold">
                {product.productPrice?.toLocaleString('vi-VN') || '0'}₫
              </p>

              <div className="flex items-center gap-2 mt-2">
                {Array.isArray(product.productColor) &&
                  product.productColor.slice(0, 5).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-5 h-5 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                {product.productColor?.length > 5 && (
                  <span className="text-xs text-gray-500">
                    +{product.productColor.length - 5}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No results message */}
      {filteredProducts.length === 0 && products.length > 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            Không tìm thấy sản phẩm nào phù hợp với bộ lọc
          </div>
          <button
            onClick={handleResetFilters}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="text-sm text-gray-600">
          Trang {currentPage} / {totalPages} •
          Hiển thị {filteredProducts.length} / {totalProducts} sản phẩm
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={loading || currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded bg-white text-black hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ‹ Trước
            </button>

            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={loading}
                  className={`px-3 py-2 border rounded transition-colors disabled:opacity-50 ${page === currentPage
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:bg-gray-100'
                    }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={loading || currentPage === totalPages}
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