import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/cartSlice";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  const cartItems = useSelector((state) => state?.cart?.cartItems || []);

  // States
  const [addressOption, setAddressOption] = useState("existing");
  const [existingAddress, setExistingAddress] = useState("");
  const [street, setStreet] = useState("");
  const [ward, setWard] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selected, setSelected] = useState("COD");

  // Helper function to convert address to string
  const convertAddressToString = (address) => {
    if (!address) return "";
    
    // Nếu là mảng, join thành string
    if (Array.isArray(address)) {
      return address.filter(Boolean).join(", ");
    }
    
    // Nếu là object, lấy các giá trị và join
    if (typeof address === 'object') {
      return Object.values(address).filter(Boolean).join(", ");
    }
    
    // Nếu đã là string, trả về như cũ
    return address.toString().trim();
  };

  // Auto-fill user data
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.firstName && user.lastName)
        setValue("fullname", `${user.firstName} ${user.lastName}`);
      if (user.email) setValue("email", user.email);
      if (user.phoneNumber) setValue("phoneNumber", user.phoneNumber);
      
      // Xử lý địa chỉ - luôn convert thành string
      if (user.address) {
        const addressString = convertAddressToString(user.address);
        setExistingAddress(addressString);
        setValue("address", addressString);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, [setValue]);

  // Fetch vouchers
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get(
          "https://new-server-e.onrender.com/api/voucher/list"
        );
        const voucherData =
          response.data?.data?.data || response.data?.data || [];
        setVouchers(voucherData);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };
    fetchVouchers();
  }, []);

  // Handle address changes
  useEffect(() => {
    let finalAddress = "";

    if (addressOption === "new") {
      const addressParts = [street, ward, district, province].filter(Boolean);
finalAddress = addressParts.join(", ");
    } else if (addressOption === "existing") {
      finalAddress = existingAddress || "";
    }

    // Luôn đảm bảo địa chỉ là string
    const addressString = convertAddressToString(finalAddress);
    setValue("address", addressString);

    console.log("Address updated:", addressString);
  }, [addressOption, street, ward, district, province, existingAddress, setValue]);

  // Submit order
  const onSubmit = async (formData) => {
    try {
      console.log("Selected voucher before submit:", selectedVoucher);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user._id) formData.userId = user._id;

      // Kiểm tra và xử lý địa chỉ
      if (!formData.address || formData.address.trim() === "") {
        alert("Vui lòng chọn địa chỉ giao hàng");
        return;
      }

      // Đảm bảo address luôn là string, không phải array hoặc object
      formData.address = convertAddressToString(formData.address);

      // Kiểm tra lại sau khi convert
      if (!formData.address || formData.address.trim() === "") {
        alert("Địa chỉ không hợp lệ. Vui lòng nhập lại.");
        return;
      }

      formData.products = cartItems.map((item) => ({
        _id: item._id,
        productName: item.productName,
        productQuantity: item.quantity || 1,
        productPrice: item.productPrice,
        productImages:
          item.productImages?.[0] ||
          "https://via.placeholder.com/80x96?text=No+Image",
        productSize: Array.isArray(item.productSize)
          ? item.productSize[0]
          : item.productSize || "M",
        productColor: Array.isArray(item.productColor)
          ? item.productColor[0]
          : item.productColor || "#FFF",
      }));

      if (selectedVoucher) {
        formData.discountValue =
          selectedVoucher.voucherDiscount || selectedVoucher.discount || 0;
      }

      console.log("Address type:", typeof formData.address);
      console.log("Address value:", formData.address);
      console.log("Is array:", Array.isArray(formData.address));
      console.log("Final formData being sent:", formData);

      const res = await axios.post(
        "https://new-server-e.onrender.com/api/order/create",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Order response:", res.data);

      dispatch(clearCart());

      if (
        formData.paymentMethod === "BANK" &&
        res.data?.data?.urlPayment?.payUrl
      ) {
        window.location.href = res.data.data.urlPayment.payUrl;
      } else {
        navigate("/order-success", {
          state: {
            orderData: res.data.data || res.data,
            formData,
            totalAmount: finalAmount,
          },
        });
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    }
  };
// Calculate totals
  const totalAmount = cartItems.reduce(
    (total, item) =>
      total + (Number(item?.productPrice) || 0) * (Number(item?.quantity) || 1),
    0
  );

  const discountAmount = selectedVoucher
    ? Math.min(
      (totalAmount *
        (selectedVoucher.voucherDiscount || selectedVoucher.discount || 0)) /
      100,
      selectedVoucher.maxDiscount || totalAmount
    )
    : 0;

  const finalAmount = totalAmount - discountAmount;

  const paymentOptions = [
    {
      id: "COD",
      label: "Thanh toán khi giao hàng (COD)",
      icon: "https://hstatic.net/0/0/global/design/seller/image/payment/cod.svg?v=6",
    },
    {
      id: "BANK",
      label: "Chuyển khoản MomoPay",
      icon: "https://homepage.momocdn.net/fileuploads/svg/momo-file-240411162904.svg",
    },
  ];

  return (
    <div className='min-h-screen mt-32'>
      <div className='max-w-6xl mx-auto px-4 py-3'>
        <nav className='text-sm text-center'>
          <img
            src='https://file.hstatic.net/200000584505/file/jp_fashion_200x80_ebdc8724d9f14d47bd874a6bb664f061_grande.png'
            alt='JP Fashion Logo'
            className='mx-auto'
          />
        </nav>
      </div>

      <div className='max-w-6xl mx-auto px-4 pb-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Form Section */}
          <div className='bg-white rounded-lg shadow-sm p-6'>
            <h2 className='text-xl font-semibold mb-6'>Thông tin giao hàng</h2>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              {/* Full Name */}
              <div>
                <input
                  type='text'
                  placeholder='Họ và tên'
                  {...register("fullname", {
                    required: "Họ và tên là bắt buộc",
                    minLength: { value: 2, message: "Tối thiểu 2 ký tự" },
                  })}
                  className='w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                {errors.fullname && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.fullname.message}
                  </p>
                )}
              </div>

              {/* Email & Phone */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <input
                    type='email'
                    placeholder='Email'
                    {...register("email", {
                      required: "Email bắt buộc",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Email không hợp lệ",
                      },
                    })}
                    className='w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
{errors.email && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type='tel'
                    placeholder='Số điện thoại'
                    {...register("phoneNumber", {
                      required: "SĐT bắt buộc",
                      pattern: {
                        value: /^\d{10,11}$/,
                        message: "SĐT 10-11 số",
                      },
                    })}
                    className='w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                  {errors.phoneNumber && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Address Options */}
              <div className='space-y-4'>
                <label className='block text-sm font-medium text-gray-700'>
                  Địa chỉ giao hàng
                </label>
                <div className='flex gap-4'>
                  <label className='flex items-center'>
                    <input
                      type='radio'
                      value='existing'
                      checked={addressOption === "existing"}
                      onChange={(e) => setAddressOption(e.target.value)}
                      className='mr-2'
                    />
                    Địa chỉ có sẵn
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='radio'
                      value='new'
                      checked={addressOption === "new"}
                      onChange={(e) => setAddressOption(e.target.value)}
                      className='mr-2'
                    />
                    Địa chỉ mới
                  </label>
                </div>

                {addressOption === "existing" && (
                  <div className='p-4 bg-gray-50 rounded-lg'>
                    {existingAddress ? (
                      <div>
                        <p className='text-sm text-gray-600 mb-2'>
                          Địa chỉ đã lưu:
                        </p>
                        <p className='font-medium'>{existingAddress}</p>
                      </div>
                    ) : (
                      <p className='text-gray-500 italic'>
                        Chưa có địa chỉ đã lưu
                      </p>
                    )}
                  </div>
                )}

                {addressOption === "new" && (
                  <div className='space-y-3'>
                    <input
                      type='text'
                      value={street}
onChange={(e) => setStreet(e.target.value)}
                      placeholder='Số nhà, tên đường'
                      className='w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                      <input
                        type='text'
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        placeholder='Phường/Xã'
                        className='w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='text'
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder='Quận/Huyện'
                        className='w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <input
                        type='text'
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        placeholder='Tỉnh/TP'
                        className='w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                    </div>
                    {(street || ward || district || province) && (
                      <div className='p-3 bg-blue-50 rounded-lg'>
                        <p className='text-sm text-blue-600'>
                          Địa chỉ mới:{" "}
                          <span className='font-medium'>
                            {[street, ward, district, province]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <input
                  type='hidden'
                  {...register("address", {
                    required: "Vui lòng chọn địa chỉ",
                  })}
                />
                {errors.address && (
                  <p className='text-red-500 text-sm'>
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Payment Methods */}
              <div className='border rounded-lg overflow-hidden divide-y divide-gray-200'>
                {paymentOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center gap-4 p-4 cursor-pointer ${selected === option.id ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}>
                    <input
type='radio'
                      {...register("paymentMethod", {
                        required: "Chọn phương thức thanh toán",
                      })}
                      value={option.id}
                      checked={selected === option.id}
                      onChange={() => setSelected(option.id)}
                      className='form-radio h-5 w-5 text-blue-600'
                    />
                    <img
                      src={option.icon}
                      alt={option.label}
                      className='w-8 h-8 object-contain'
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <span className='text-gray-800 font-medium'>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className='text-red-500 text-sm'>
                  {errors.paymentMethod.message}
                </p>
              )}

              {/* Submit Buttons */}
              <div className='flex justify-between pt-6'>
                <button
                  type='button'
                  onClick={() => navigate("/cart")}
                  className='text-blue-600 hover:underline text-sm'>
                  ← Quay lại giỏ hàng
                </button>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50'>
                  {isSubmitting
                    ? "Đang xử lý..."
                    : `Thanh toán ${finalAmount.toLocaleString()}₫`}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className='bg-white rounded-lg shadow-sm p-6'>
            <h3 className='text-lg font-semibold mb-4'>Đơn hàng của bạn</h3>

            {/* Cart Items */}
            <div className='space-y-4 mb-6'>
              {cartItems.map((item, index) => (
                <div
                  key={`${item._id}-${index}`}
                  className='flex items-start space-x-4 pb-4 border-b border-gray-100'>
                  <div className='relative'>
                    <img
                      src={
                        item?.productImages?.[0] ||
                        "https://via.placeholder.com/80x96?text=No+Image"
                      }
                      alt={item?.productName || "Product"}
                      className='w-16 h-20 object-cover rounded border'
                      onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/80x96?text=Error")
                      }
                    />
<span className='absolute -top-2 -right-2 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                      {item?.quantity || 1}
                    </span>
                  </div>
                  <div className='flex-1'>
                    <h4 className='font-medium text-sm mb-1'>
                      {item?.productName || "Sản phẩm"}
                    </h4>
                    <div className='flex items-center gap-2 text-xs text-gray-500'>
                      <div
                        className='w-4 h-4 rounded border border-gray-300'
                        style={{
                          backgroundColor: Array.isArray(item?.productColor)
                            ? item.productColor[0]
                            : item?.productColor || "#ccc",
                        }}></div>
                      <span>/</span>
                      <span>
                        {Array.isArray(item?.productSize)
                          ? item.productSize[0]
                          : item?.productSize || "M"}
                      </span>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-semibold'>
                      {(
                        (Number(item?.productPrice) || 0) *
                        (Number(item?.quantity) || 1)
                      ).toLocaleString()}
                      ₫
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Voucher Selection */}
            <div className='border-t pt-4 mb-6'>
              <h4 className='text-lg font-semibold mb-4'>Chọn Voucher</h4>
              {vouchers.length > 0 ? (
                <div>
                  <select
                    value={selectedVoucher?._id || ""}
                    onChange={(e) => {
                      const voucher =
                        vouchers.find((v) => v._id === e.target.value) || null;
                      setSelectedVoucher(voucher);
                      console.log("Voucher selected:", voucher);
                    }}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
                    <option value=''>Chọn voucher</option>
                    {vouchers.map((voucher) => {
                      console.log("Rendering voucher option:", voucher);
                      return (
                        <option key={voucher._id} value={voucher._id}>
                          {voucher.voucherName || voucher.code || "Voucher"} -
                          Giảm{" "}
                          {voucher.voucherDiscount || voucher.discount || 0}%
                          {voucher.maxDiscount &&
                            ` (Tối đa ${voucher.maxDiscount.toLocaleString()}₫)`}
                        </option>
);
                    })}
                  </select>
                  {selectedVoucher && (
                    <div className='mt-3 p-3 bg-green-50 border border-green-200 rounded-lg'>
                      <p className='text-sm text-green-700'>
                        ✅{" "}
                        <strong>
                          {selectedVoucher.voucherName || selectedVoucher.code}
                        </strong>{" "}
                        - Tiết kiệm {discountAmount.toLocaleString()}₫
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className='text-gray-500 text-center py-4'>
                  Không có voucher khả dụng
                </p>
              )}
            </div>

            <div className='border-t pt-4 space-y-3'>
              <div className='flex justify-between text-sm'>
                <span>Tạm tính</span>
                <span>{totalAmount.toLocaleString()}₫</span>
              </div>
              {discountAmount > 0 && (
                <div className='flex justify-between text-sm text-red-600'>
                  <span>Giảm giá</span>
                  <span>-{discountAmount.toLocaleString()}₫</span>
                </div>
              )}
              <div className='flex justify-between text-sm'>
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className='flex justify-between text-lg font-semibold border-t pt-3'>
                <span>Tổng cộng</span>
                <div className='text-right'>
                  <span className='text-xs text-gray-500'>VND</span>
                  <span className='ml-2 text-xl'>
                    {finalAmount.toLocaleString()}₫
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;