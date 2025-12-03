import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { toggleFavorite } from '../redux/favoriteSlice';
import { addToCart } from '../redux/cartSlice';

export default function Wishlist() {
    const favorites = useSelector((state) => state.favorite);
    const dispatch = useDispatch();

    const handleToggleFavorite = (product) => {
        dispatch(toggleFavorite(product));
    };

    const handleAddToCart = (product) => {
        console.log('Adding to cart:', product);
        dispatch(addToCart({ ...product, quantity: 1 }));
    };

    return (
        <div className="container mx-auto mt-10 p-4 bg-white min-h-screen px-6 py-10">
            <h2 className="text-2xl font-bold text-center mb-8">
                DANH SÁCH YÊU THÍCH <span className="text-pink-500">💕</span>
            </h2>

            {favorites.length === 0 ? (
                <p className="text-center text-gray-500">
                  Chưa có sản phẩm yêu thích! Nhấp vào{' '}
                    <Link to="/product" className="text-red-500 underline">
                        đây 
                    </Link>
                   {' '}  Hãy lựa chọn những sản phẩm ưa thích của mình nào.
                </p>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {favorites.map((product) => (
                        <div key={product._id} className="relative group bg-white">
                            <div className="relative overflow-hidden rounded-md">
                                <Link to={`/product/${product._id}`}>
                                    <img
                                        src={
                                            product.productImages?.[0] ||
                                            'https://via.placeholder.com/400x400?text=No+Image'
                                        }
                                        alt={product.productName}
                                        className="w-full h-[400px] object-cover hover:opacity-90 transition"
                                    />
                                </Link>
                                <button
                                    className={`absolute top-3 right-3 z-10 text-xl transition ${favorites.some((item) => item._id === product._id)
                                        ? 'text-red-500'
                                        : 'text-gray-400 hover:text-red-500'
                                        }`}
                                    onClick={() => handleToggleFavorite(product)}
                                >
                                    <FaHeart />
                                </button>
                                <div className="absolute bottom-0 left-0 w-full flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ">
                                    <button
                                        className="bg-black text-white text-sm px-6 py-2"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        Thêm vào giỏ
                                    </button>
                                    <Link to={`/product/${product._id}`}>
                                        <button className="bg-black text-white text-sm px-6 py-2">
                                            Xem nhanh
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <div className="pt-3">
                                <p className="text-sm">{product.productName}</p>
                                <p className="text-red-600 font-semibold">
                                    {product.productPrice?.toLocaleString()}₫
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
    );
}
