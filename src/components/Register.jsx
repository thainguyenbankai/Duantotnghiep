import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const [errorMsg] = useState('');


  const onSubmit = async (data) => {
    try {
      const { data: res } = await axios.post(
        'https://new-server-e.onrender.com/api/auth/register',
        data
      );

      const message = res?.message || res?.msg;
      message && toast.success(message);

      navigate('/login');
    } catch (error) {
      const errMsg = error.response?.data?.err || error.response?.data?.message;
      errMsg && toast.error(errMsg);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="px-8 py-10 rounded w-full max-w-md">
        <p className="text-3xl font-sans text-center mb-6">Tạo tài khoản</p>

        {errorMsg && (
          <div className="text-red-600 text-sm text-center mb-2">{errorMsg}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Họ"
            {...register('firstName', { required: 'Vui lòng nhập họ' })}
            className="w-full border border-gray-300 p-3 rounded outline-none focus:ring-2 focus:ring-black"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}

          <input
            type="text"
            placeholder="Tên"
            {...register('lastName', { required: 'Vui lòng nhập tên' })}
            className="w-full border border-gray-300 p-3 rounded outline-none focus:ring-2 focus:ring-black"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            {...register('email', {
              required: 'Vui lòng nhập email',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Email không hợp lệ',
              },
            })}
            className="w-full border border-gray-300 p-3 rounded outline-none focus:ring-2 focus:ring-black"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <input
            type="tel"
            placeholder="Số điện thoại"
            {...register('phoneNumber', { required: 'Vui lòng nhập số điện thoại' })}
            className="w-full border border-gray-300 p-3 rounded outline-none focus:ring-2 focus:ring-black"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
          )}

          <input
            type="password"
            placeholder="Mật khẩu"
            {...register('password', {
              required: 'Vui lòng nhập mật khẩu',
              minLength: {
                value: 6,
                message: 'Mật khẩu phải từ 6 ký tự',
              },
            })}
            className="w-full border border-gray-300 p-3 rounded outline-none focus:ring-2 focus:ring-black"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <FaArrowLeft className="mr-2" />
          <Link to="/" className="hover:underline">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
