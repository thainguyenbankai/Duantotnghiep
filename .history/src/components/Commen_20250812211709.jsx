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
                   <section className="bg-white py-10 px-6 lg:px-20">
  <div className="max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold mb-6 text-gray-800">Chính Sách Đổi/Trả Hàng</h1>
    <p className="text-gray-700 mb-4">
      Nhằm mang đến trải nghiệm mua sắm tốt nhất cho khách hàng, chúng tôi cung cấp chính sách đổi/trả hàng linh hoạt. Vui lòng đọc kỹ các điều khoản dưới đây để đảm bảo quyền lợi của bạn.
    </p>

    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">1. Thời hạn đổi/trả</h2>
    <ul className="list-disc list-inside text-gray-700 mb-4">
      <li>Khách hàng có thể đổi hoặc trả hàng trong vòng <strong>7 ngày</strong> kể từ ngày nhận sản phẩm.</li>
      <li>Thời gian được tính dựa trên ngày ghi trên hóa đơn hoặc biên nhận giao hàng.</li>
    </ul>

    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">2. Điều kiện áp dụng</h2>
    <ul className="list-disc list-inside text-gray-700 mb-4">
      <li>Sản phẩm chưa qua sử dụng, còn nguyên tem, nhãn mác và bao bì ban đầu.</li>
      <li>Không bị dơ bẩn, hư hỏng hoặc có mùi lạ.</li>
      <li>Có đầy đủ hóa đơn hoặc chứng từ mua hàng.</li>
    </ul>

    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3. Các trường hợp không hỗ trợ đổi/trả</h2>
    <ul className="list-disc list-inside text-gray-700 mb-4">
      <li>Sản phẩm trong chương trình giảm giá hoặc khuyến mãi đặc biệt (trừ khi bị lỗi sản xuất).</li>
      <li>Sản phẩm đặt làm theo yêu cầu riêng của khách hàng.</li>
      <li>Sản phẩm bị hư hỏng do lỗi của người sử dụng.</li>
    </ul>

    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">4. Quy trình đổi/trả</h2>
    <ol className="list-decimal list-inside text-gray-700 mb-4">
      <li>Liên hệ với bộ phận chăm sóc khách hàng qua hotline hoặc email để đăng ký đổi/trả.</li>
      <li>Cung cấp thông tin đơn hàng và lý do đổi/trả.</li>
      <li>Gửi sản phẩm về địa chỉ của chúng tôi qua đơn vị vận chuyển.</li>
      <li>Sau khi kiểm tra, chúng tôi sẽ tiến hành đổi sản phẩm hoặc hoàn tiền theo yêu cầu.</li>
    </ol>

    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">5. Chi phí vận chuyển</h2>
    <p className="text-gray-700 mb-4">
      - Khách hàng chịu phí vận chuyển khi đổi/trả sản phẩm do không vừa ý hoặc đặt nhầm.  
      - Chúng tôi chịu phí vận chuyển nếu sản phẩm bị lỗi hoặc giao nhầm.
    </p>

    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">6. Hoàn tiền</h2>
    <p className="text-gray-700 mb-4">
      Tiền hoàn sẽ được chuyển vào tài khoản ngân hàng của khách hàng trong vòng <strong>3–5 ngày làm việc</strong> sau khi sản phẩm được xác nhận đạt điều kiện đổi/trả.
    </p>

    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">7. Liên hệ hỗ trợ</h2>
    <p className="text-gray-700">
      Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ:  
      📞 Hotline: <strong>0123 456 789</strong>  
      📧 Email: <strong>support@shop.com</strong>
    </p>
  </div>
</section>
                )}
                {activeTab === 'return' && (
                           <section className="bg-white py-10 px-6 lg:px-20">
  <div className="max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold mb-6 text-gray-800">Chính Sách Đổi/Trả Hàng</h1>
    <p className="text-gray-700 mb-4">
      Nhằm mang đến trải nghiệm mua sắm tốt nhất cho khách hàng, chúng tôi cung cấp chính sách đổi/trả hàng linh hoạt. Vui lòng đọc kỹ các điều khoản dưới đây để đảm bảo quyền lợi của bạn.
    </p>

    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">1. Thời hạn đổi/trả</h2>
    <ul className="list-disc list-inside text-gray-700 mb-4">
      <li>Khách hàng có thể đổi hoặc trả hàng trong vòng <strong>7 ngày</strong> kể từ ngày nhận sản phẩm.</li>
      <li>Thời gian được tính dựa trên ngày ghi trên hóa đơn hoặc biên nhận giao hàng.</li>
    </ul>

    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">2. Điều kiện áp dụng</h2>
    <ul className="list-disc list-inside text-gray-700 mb-4">
      <li>Sản phẩm chưa qua sử dụng, còn nguyên tem, nhãn mác và bao bì ban đầu.</li>
      <li>Không bị dơ bẩn, hư hỏng hoặc có mùi lạ.</li>
      <li>Có đầy đủ hóa đơn hoặc chứng từ mua hàng.</li>
    </ul>

    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">3. Các trường hợp không hỗ trợ đổi/trả</h2>
    <ul className="list-disc list-inside text-gray-700 mb-4">
      <li>Sản phẩm trong chương trình giảm giá hoặc khuyến mãi đặc biệt (trừ khi bị lỗi sản xuất).</li>
      <li>Sản phẩm đặt làm theo yêu cầu riêng của khách hàng.</li>
      <li>Sản phẩm bị hư hỏng do lỗi của người sử dụng.</li>
    </ul>

    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">4. Quy trình đổi/trả</h2>
    <ol className="list-decimal list-inside text-gray-700 mb-4">
      <li>Liên hệ với bộ phận chăm sóc khách hàng qua hotline hoặc email để đăng ký đổi/trả.</li>
      <li>Cung cấp thông tin đơn hàng và lý do đổi/trả.</li>
      <li>Gửi sản phẩm về địa chỉ của chúng tôi qua đơn vị vận chuyển.</li>
      <li>Sau khi kiểm tra, chúng tôi sẽ tiến hành đổi sản phẩm hoặc hoàn tiền theo yêu cầu.</li>
    </ol>

    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">5. Chi phí vận chuyển</h2>
    <p className="text-gray-700 mb-4">
      - Khách hàng chịu phí vận chuyển khi đổi/trả sản phẩm do không vừa ý hoặc đặt nhầm.  
      - Chúng tôi chịu phí vận chuyển nếu sản phẩm bị lỗi hoặc giao nhầm.
    </p>

    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">6. Hoàn tiền</h2>
    <p className="text-gray-700 mb-4">
      Tiền hoàn sẽ được chuyển vào tài khoản ngân hàng của khách hàng trong vòng <strong>3–5 ngày làm việc</strong> sau khi sản phẩm được xác nhận đạt điều kiện đổi/trả.
    </p>

    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">7. Liên hệ hỗ trợ</h2>
    <p className="text-gray-700">
      Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ:  
      📞 Hotline: <strong>0123 456 789</strong>  
      📧 Email: <strong>support@shop.com</strong>
    </p>
  </div>
</section>
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
