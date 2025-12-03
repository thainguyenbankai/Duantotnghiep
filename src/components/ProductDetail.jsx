import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';
import Comments from './Commen';

export default function ProductDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
// get data = param
    useEffect(() => {
        axios.get(`https://new-server-e.onrender.com/api/product/detail/${id}`)
            .then((res) => {
                const data = res.data?.data;
                setProduct(data);
                setSelectedImage(data?.detail.productImages?.[0]);
                setSelectedColor(data?.detail.productColor?.[0] || '');
                setSelectedSize(data?.detail.productSize?.[0] || '');
                console.log(data);
            })
            .catch((err) => {
                console.error('Lỗi lấy chi tiết sản phẩm:', err.message);
            });
    }, [id]);

    const handleAddToCart = () => {
        if (!selectedColor) {
            toast.error('⚠️ Vui lòng chọn màu sắc!', {
                position: 'top-center',
                style: {
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: '1px solid #fecaca'
                }
            });
            return;
        }

        if (!selectedSize) {
            toast.error('⚠️ Vui lòng chọn kích thước!', {
                position: 'top-center',
                style: {
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: '1px solid #fecaca'
                }
            });
            return;
        }

        if (quantity > product.detail.productQuantity) {
            toast.error('❌ Số lượng vượt quá tồn kho!', {
                position: 'top-center'
            });
            return;
        }

        dispatch(
            addToCart({ ...product.detail, productSize: selectedSize, productColor: selectedColor, quantity })
        );
        toast.success('Đã thêm vào giỏ hàng!', {
            position: 'top-center',
            style: {
                background: '#dcfce7',
                color: '#16a34a',
                border: '1px solid #bbf7d0'
            }
        });
    };

    if (!product) return <div className="p-10">Đang tải sản phẩm...</div>;

    return (
        <div className='container mx-auto'>
            <div className="p-6 flex flex-col lg:flex-row gap-8 mt-20">
                <div className="flex gap-4">
                    <div className="flex flex-col gap-3">
                        {product.detail.productImages?.map((img, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedImage(img)}
                                className={`w-20 h-24 border-2 cursor-pointer overflow-hidden ${selectedImage === img ? 'border-black' : 'border-gray-200'
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`preview-${idx}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="w-[500px] h-[600px] bg-gray-50 overflow-hidden">
                        <img
                            src={selectedImage}
                            alt="Main"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="flex-1 max-w-md">
                    <h1 className="text-2xl font-medium mb-4">{product.detail.productName}</h1>

            
                    <div className="text-sm text-gray-600 mb-4">
                        <span>Thương hiệu: J-P Fashion</span> | 
                        <span> MSP: {product.detail._id?.slice(-8)}</span>
                    </div>

                    <div className='flex items-center gap-4'>

                        <div className="mb-4">
                            <span className="text-2xl font-mulish text-red-600">
                                {product.detail.productPrice?.toLocaleString()}₫
                            </span>
                        </div>

                        <div className="mb-3">
                            <span className="text-sm text-gray-600">Tình trạng: </span>
                            <span className={`text-sm font-medium ${product.detail.productQuantity > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {product.detail.productQuantity > 0 ? "Còn hàng" : "Hết hàng"}
                            </span>
                        </div>

                    </div>



                    <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-2">
                            Màu sắc: <span className="text-red-500">*</span>
                            <span className="text-black ml-1">
                                {selectedColor || product.detail.productColor?.[0]}
                            </span>
                        </p>
                        <div className="flex gap-3">
                            {product.detail.productColor?.map((color, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-black' : 'border-gray-300'
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-2">
                            Kích thước: <span className="text-red-500">*</span>
                        </p>
                        <div className="flex gap-2">
                            {product.detail.productSize?.map((size, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedSize(size)}
                                    className={`border px-4 py-2 text-sm ${selectedSize === size
                                        ? 'border-black bg-black text-white'
                                        : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                            −
                        </button>
                        <span className="w-12 text-center">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                            +
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-black text-white py-3 px-6 hover:bg-gray-800 transition-colors"
                        >
                            Thêm vào giỏ
                        </button>
                        <Link
                            to={`/cart`}
                            className="flex-1 border border-gray-300 py-3 px-6 text-center hover:bg-gray-50 transition-colors"
                        >
                             Giỏ Hàng
                        </Link>
                    </div>
                </div>
            </div>
 
            <Comments product={product.detail} comments={product.comments} /> 
            
        </div>
    );
}