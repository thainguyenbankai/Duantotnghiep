/* eslint-disable react/prop-types */
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify';




const tabs = [
    { name: 'MÔ TẢ', key: 'description' },
    { name: 'CHÍNH SÁCH THANH TOÁN', key: 'payment' },
    { name: 'CHÍNH SÁCH ĐỔI TRẢ', key: 'return' },
    { name: 'BÌNH LUẬN', key: 'comments' }
];

export default function TabContent({ product, comments, }) {
    const [activeTab, setActiveTab] = useState('description');
    const {
        register,
        handleSubmit,
    } = useForm();


    const onSubmit = async (formData) => {
        console.log('formData:', formData);
        formData.productId = product._id;
        console.log('formData with product:', formData);
        // check user đã mua hàng thành công 
        const token = localStorage.getItem('accessToken');
        console.log('token:', token);
        try {
            const res = await axios.post(
                'https://new-server-e.onrender.com/api/comment/create',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const resData = res.data?.data;
            console.log('token:', resData?.token?.accessToken);
        } catch (error) {
            toast.error('vui lòng mua hàng để bình luận');
            console.log(error, 'Lỗi khi gửi bình luận');
        }
    };
    const cleanHtml = DOMPurify.sanitize(product.productDescription)
        .replace(/<div>/g, '<p>')
        .replace(/<\/div>/g, '</p>');

    return (
        <div>
            <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-6 py-3 text-sm font-medium border border-b-0 transition-all duration-300
              ${activeTab === tab.key
                                ? 'bg-white border-black text-black'
                                : 'bg-gray-100 border-transparent text-gray-600 hover:text-black'
                            }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            <div className="mt-6">
                {activeTab === 'description' && (
                    <div className=''>
                        {product?.productDescription && (
                            <>
                                <h2 className="mb-2 py-2">Mô tả sản phẩm</h2>
                                <div className="prose max-w-none [&>div]:my-2 [&>div]:leading-relaxed mb-5 text-sm">
                                    <div dangerouslySetInnerHTML={{ __html: product.productDescription }} />
                                </div>
                            </>
                        )}
                    </div>

                )}
                {activeTab === 'payment' && (
            
                )}
                {activeTab === 'return' && (
                    <div className="flex flex-col items-center">
                        <img src='https://file.hstatic.net/200000584505/file/quy_dinh_doi_tra_heng_grande.jpg' alt='Chính sách đổi trả' />
                    </div>
                )}
                {activeTab === 'comments' && (
                    <div className="space-y-4">
                        {
                            comments && comments?.length > 0 ? (
                                comments?.map((comment) => (
                                    <div key={comment._id} className="space-y-1 flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-semibold text-sm mt-1">
                                            {comment.commenterName?.charAt(0).toUpperCase() || 'U'}
                                        </div>

                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{comment.commenterName}</p>

                                            <div className="bg-gray-100 rounded-lg p-3 inline-block">
                                                <p className="text-sm">{comment.content}</p>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500 space-x-3 mt-1 ml-2">
                                                <span>Thích</span>
                                                <span>·</span>
                                                <span>Trả lời</span>
                                                <span>·</span>
                                                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm">Chưa có bình luận nào.</p>
                            )
                        }

                        <h2 className="text-xl font-bold mb-2">Bình luận</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                                {...register('content', {
                                    required: 'Bình luận không được để trống',
                                    minLength: {
                                        value: 5,
                                        message: 'Bình luận phải có ít nhất 5 ký tự'
                                    }
                                })}
                                placeholder="Bình luận..."
                                rows="3"
                            ></textarea>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600 transition-colors text-sm"
                                >
                                    Đăng
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
