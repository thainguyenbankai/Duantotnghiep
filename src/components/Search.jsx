import { useLocation, Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { useState } from 'react';

const Search = () => {
  const location = useLocation();
  const { results, keyword } = location.state || {};

  const productList = Array.isArray(results) ? results : [];

  const [favorites, setFavorites] = useState([]);

  const handleToggleFavorite = (product) => {
    const isFav = favorites.some((item) => item._id === product._id);
    if (isFav) {
      setFavorites(favorites.filter((item) => item._id !== product._id));
    } else {
      setFavorites([...favorites, product]);
    }
  };

  const handleAddToCart = (product) => {
    console.log('Thêm vào giỏ:', product);
  };

  return (
    // call api ,get lại 
    <div className="container mx-auto p-4 min-h-screen pt-28 px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">
        Kết quả tìm kiếm cho: <span className="text-blue-600">&quot;{keyword}&quot;</span>
      </h2>
      {productList.length === 0 ? (
        <p className="text-gray-500 text-lg mb-96">Không tìm thấy sản phẩm nào.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {productList.map((product) => (
            <div key={product._id} className="relative group bg-white">
              <div className="relative overflow-hidden">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={
                      product.productImages?.[0] ||
                      'https://via.placeholder.com/400x400?text=No+Image'
                    }
                    alt={product.productName}
                    className="w-full h-[400px] object-cover rounded-md hover:opacity-90 transition"
                  />
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

                {/* Updated buttons section */}
                <div className="absolute bottom-0 left-0 w-full flex justify-between gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 px-2 pb-2">
                  <button
                    className="bg-white text-black text-sm px-2 py-1.5 border border-black w-full hover:border-red-500 hover:text-red-500 transition-colors duration-300"
                    onClick={() => handleAddToCart(product)}
                  >
                    Thêm vào giỏ
                  </button>
                  <Link to={`/product/${product._id}`} className="w-full">
                    <button className="bg-white text-black text-sm px-2 py-1.5 border border-black w-full hover:border-red-500 hover:text-red-500 transition-colors duration-300">
                      Xem nhanh
                    </button>
                  </Link>
                </div>
              </div>

              <div className="pt-3">
                <p className="text-sm truncate">{product.productName}</p>
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
};

export default Search;