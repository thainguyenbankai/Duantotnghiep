/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { toggleFavorite } from '../../redux/favoriteSlice';
import { Autoplay } from 'swiper/modules';
import toast from 'react-hot-toast';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [products1, setProducts1] = useState([]);

    const dispatch = useDispatch();
    const favorites = useSelector((state) => state.favorite);

    const handleToggleFavorite = (product) => {
        const isFav = favorites.some((item) => item._id === product._id);
        dispatch(toggleFavorite(product));
        toast.success(isFav ? ' Đã bỏ yêu thích' : ' Đã thêm vào yêu thích', {
            position: 'top-center',
        });
    };

    const handleAddToCart = (product) => {
        toast.success(
            <div>
                <strong>✅ Thêm vào giỏ hàng thành công!</strong>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>
                    Sản phẩm của bạn đã được cập nhật trong giỏ.
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

    useEffect(() => {
        axios.post('https://new-server-e.onrender.com/api/product/list?limit=12')
            .then(res => {
                const data = res.data?.data?.data || [];
                console.log(data);

                setProducts(data);
            })
            .catch(err => console.error(err));
        axios.post('https://new-server-e.onrender.com/api/product/list?limit=100', {
            soldAmount: 1
        })
            .then(res => {
                const data = res.data?.data?.data || [];
                setProducts1(data);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <>
            <div className="">
                <img
                    src="https://file.hstatic.net/200000584505/file/web-pc_865b0eabd4794cf5b30722a6b41d4c98.jpg"
                    alt="banner"
                    className="w-full"
                />
            </div>

            <div className="container mx-auto p-4">
                <div className="text-center my-8">
                    <h2 className="text-2xl font-sans relative inline-block uppercase">
                        <span>SẢN PHẨM MỚI</span>
                        <div className="flex items-center justify-center mt-2">
                            <div className="w-16 h-px bg-black" />
                            <div className="w-16 h-px bg-black" />
                        </div>
                    </h2>
                    <p className="text-gray-500 italic mt-2">Top trending tuần này</p>
                </div>

                <Swiper
                    slidesPerView={5}
                    spaceBetween={20}
                    pagination={{ clickable: true }}
                    navigation={true}
                    modules={[Pagination, Navigation, Autoplay]}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false
                    }}
                    speed={800}
                    loop={products1.length>5}
                    className="mySwiper !pb-12 transition-transform duration-700 ease-in-out"
                >
                    {products1.map((product, index) => (
                        <SwiperSlide key={product._id || index}>
                            <div className="relative  bg-white transition-all duration-500">
                                <div className="relative overflow-hidden">
                                    <Link to={`/product/${product._id}`}>
                                        <div className="relative w-full h-[350px]">
                                            <img
                                                src={product.productImages?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'}
                                                alt={product.productName}
                                                className={`w-full h-full object-cover  transition-opacity duration-300 ${product.productImages?.[3] ? '' : ''
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
                                        className={`absolute top-3 right-3 z-10 text-xl transition ${favorites.some((item) => item._id === product._id)
                                            ? 'text-red-500'
                                            : 'text-gray-400 hover:text-red-500'
                                            }`}
                                        onClick={() => handleToggleFavorite(product)}
                                    >
                                        <FaHeart />
                                    </button>

                                    <div className="absolute bottom-0 left-0 w-full flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300  py-2">
                                        <button
                                            className="bg-black text-white text-sm px-4 py-1 rounded  transition"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            Thêm vào giỏ
                                        </button>

                                        <Link to={`/product/${product._id}`} className="text-black hover:text-red-700 transition duration-200 relative group">
                                            Xem Thêm
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="pt-3 px-2 pb-2">
                                    <p className="text-sm font-medium">{product.productName}</p>
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
                        </SwiperSlide>
                    ))}
                </Swiper>



                <div>
                    <Link to="/product">
                        <p className="text-center text-black hover:text-red-500 mt-8">Xem thêm</p>
                    </Link>
                </div>

                <div className="flex w-full mt-8">
                    <img
                        className="w-1/2"
                        src="https://file.hstatic.net/200000584505/file/banner_category_1024x1024.jpg"
                        alt=""
                    />
                    <img
                        className="w-1/2"
                        src="https://file.hstatic.net/200000584505/file/phu_kien_copyweb_1024x1024.jpg"
                        alt=""
                    />
                </div>

                <div className=" min-h-screen px-6 py-10">
                    <div className="text-center py-12 ">
                        <h2 className="text-3xl text-gray-900 mb-6">
                            SẢN PHẨM BÁN CHẠY
                        </h2>

                        <div className="inline-block">
                            <div className="border-2 border-red-500 border-dashed rounded-full px-6 py-2">
                                <span className="text-red-500 text-sm font-mulish  tracking-wider">
                                    BEST SELLER
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products1.map((product) => (
                            <div key={product._id} className="relative group bg-white">
                                <div className="relative overflow-hidden">
                                    <Link to={`/product/${product._id}`}>
                                        <div className="relative w-full h-[400px]">
                                            {/* Ảnh chính */}
                                            <img
                                                src={
                                                    product.productImages?.[0] ||
                                                    'https://via.placeholder.com/400x400?text=No+Image'
                                                }
                                                alt={product.productName}
                                                className={`w-full h-full object-cover rounded-md transition-opacity duration-300 ${product.productImages?.[1] ? 'group-hover:opacity-0' : 'hover:opacity-90'
                                                    }`}
                                            />

                                            {/* Ảnh hover (ảnh thứ 2) - chỉ hiển thị nếu có */}
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
                                        className={`absolute top-3 right-3 z-10 text-xl transition ${favorites.some((item) => item._id === product._id)
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
                </div>
            </div>
        </>
    );
}