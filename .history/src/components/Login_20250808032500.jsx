import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { loginSuccess } from "../redux/AuthSlice";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Login = () => {
  const {register,handleSubmit,formState: { errors, isSubmitting },} = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (formData) => {
    try {
      const res = await axios.post(
        "https://new-server-e.onrender.com/api/auth/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      const resData = res.data?.data;
      const role = resData?.data?.role;

      if (!resData?.token?.accessToken) {
        toast.error("Không nhận được access token!");
        return;
      }

      localStorage.setItem("accessToken", resData?.token?.accessToken);
      localStorage.setItem("refreshToken", resData?.token?.refreshToken);
      localStorage.setItem("user", JSON.stringify(resData.data));
      localStorage.setItem("role", role);

      dispatch(
        loginSuccess({
          user: resData.data,
          userData: resData,
          token: resData.token,
          role: role,
        })
      );

      if (role === "admin") {
        window.location.href = "/admin";
        toast.success("Đăng nhập thành công!");
      } else {
        window.location.href = "/";
        toast.success("Đăng nhập thành công!");
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.err ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Đã xảy ra lỗi";
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded space-y-6">
        <p className="text-3xl font-sans text-center">Đăng nhập</p>

        {isSubmitting && (
          <div className="flex justify-center">
            <DotLottieReact
              src="https://lottie.host/61da9ced-3b8e-4b73-8d42-032d1062ee2f/ymnE1sdcZn.lottie"
              loop
              autoplay
            />
          </div>
        )}
        {!isSubmitting && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FiMail className="w-5 h-5" />
              </span>
              <input
                type="email"
                {...register("email", {
                  required: "Vui lòng nhập email",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email không hợp lệ",
                  },
                })}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-base placeholder-gray-400"
                placeholder="Email"
                aria-label="Email"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FiLock className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Vui lòng nhập mật khẩu",
                })}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-base placeholder-gray-400"
                placeholder="Mật khẩu"
                aria-label="Mật khẩu"
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <FiEyeOff className="w-5 h-5" />
                ) : (
                  <FiEye className="w-5 h-5" />
                )}
              </span>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-medium text-base hover:opacity-90 transition disabled:opacity-50"
            >
              Đăng nhập
            </button>
          </form>
        )}

        {/* Text loading */}
        {isSubmitting && (
          <div className="text-center">
            <p className="text-gray-600">Đang đăng nhập...</p>
          </div>
        )}

        {!isSubmitting && (
          <div className="text-center text-sm mt-6 space-y-1">
            <p>
              hoặc{" "}
              <Link
                to="/register"
                className="text-red-600 font-medium hover:underline"
              >
                Đăng ký.
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
