import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { toggleFavorite } from '../redux/favoriteSlice';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorite);
  const { id } = useParams();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://new-server-e.onrender.com/api/product/category/${id}`);
      const data = response.data?.data?.data;
      console.log(data, 'Product list by category');
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // FIX: Thêm id vào dependency array để gọi lại API khi id thay đổi
  useEffect(() => {
    if (id) {
      fetchProducts();
    }
  }, [id]); // Thêm id vào đây

  const handleAddToCart = (product) => {
    toast.success(
      <div>
        <strong>✅ Added to cart successfully!</strong>
        <div style={{ fontSize: '13px', opacity: 0.9 }}>
          Your product has been updated in cart.
        </div>
      </div>,
      {
        position: 'top-center',
        className: 'custom-toast-success',
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
        icon: false,
      }
    );

    dispatch(
      addToCart({ 
        ...product, 
        productSize: product.productSize?.[0] || '', 
        productColor: product.productColor?.[0] || '', 
        quantity: 1 
      })
    );
  };

  const handleToggleFavorite = (product) => {
    const isFav = favorites.some((item) => item._id === product._id);
    dispatch(toggleFavorite(product));
    toast.success(isFav ? 'Removed from favorites' : 'Added to favorites', {
      position: 'top-center',
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className='container mx-auto p-4 mt-8'>
        <div className="bg-white min-h-screen px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 h-[400px] rounded-md mb-3"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4 mt-8'>
      <div className="bg-white min-h-screen px-6 py-10">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product._id} className="relative group bg-white">
                <div className="relative overflow-hidden">
                  <Link to={`/product/${product._id}`}>
                    <div className="relative w-full h-[400px]">
                      <img
                        src={
                          product.productImages?.[0] ||
                          'https://via.placeholder.com/400x400?text=No+Image'
                        }
                        alt={product.productName}
                        className={`w-full h-full object-cover rounded-md transition-opacity duration-300 ${
                          product.productImages?.[1] ? 'group-hover:opacity-0' : 'hover:opacity-90'
                        }`}
                      />

                      {product.productImages?.[1] && (
                        <img
                          src={product.productImages[1]}
                          alt={product.productName}
                          className="absolute top-0 left-0 w-full h-full object-cover rounded-md transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                        />
                      )}
                    </div>
                  </Link>

                  <button
                    className={`absolute top-3 right-3 z-10 text-xl transition ${
                      favorites.some((item) => item._id === product._id)
                        ? 'text-red-500'
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                    onClick={() => handleToggleFavorite(product)}
                  >
                    <FaHeart />
                  </button>

                  <div className="absolute bottom-0 left-0 w-full flex justify-center gap-5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      className="bg-black text-white text-sm px-6 py-2"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                    <Link to={`/product/${product._id}`}>
                      <button className="bg-black text-white text-sm px-6 py-2">
                        Quick View
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="pt-3">
                  <p className="text-sm">{product.productName}</p>
                  <p className="text-red-600 font-semibold">
                    ${product.productPrice?.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    {Array.isArray(product.productColor) &&
                      product.productColor.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}