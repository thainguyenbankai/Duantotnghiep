/* eslint-disable react/prop-types */
import axios from "axios";
import { Controller, useFieldArray, useForm,useWatch, } from "react-hook-form";
import { useEffect, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill";


const AddProduct = (props) => {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    // const [content, setContent] = useState('');
    

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            productColors: [{ value: "#000000" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "productColors",
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const response = await axios.get('https://new-server-e.onrender.com/api/category/list');
                const categoryData = response.data?.data?.data || response.data?.data || response.data || [];
                setCategories(Array.isArray(categoryData) ? categoryData : []);

                console.log('Categories loaded:', categoryData);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const onSubmit = async (formData) => {
        try {
            const data = new FormData();

            data.append("productName", formData.productName);
            data.append("productPrice", formData.productPrice);
            data.append("productQuantity", formData.productQuantity);
            data.append("productDescription", formData.productDescription);

            if (formData.productCategory) {
                data.append("productCategory", formData.productCategory);
            }

            // Product sizes (array)
            if (formData.productSize && formData.productSize.length > 0) {
                formData.productSize.forEach(size => {
                    data.append("productSize[]", size);
                });
            }

            // Product colors (array)
            if (formData.productColors && formData.productColors.length > 0) {
                formData.productColors.forEach(color => {
                    data.append("productColor[]", color.value);
                });
            }

            // Images
            if (formData.images && formData.images.length > 0) {
                for (let i = 0; i < formData.images.length; i++) {
                    data.append("images", formData.images[i]);
                }
            }

            // Debug: Log FormData contents
            console.log('FormData contents:');
            for (let [key, value] of data.entries()) {
                console.log(key, value);
            }

            const res = await axios.post(
                'https://new-server-e.onrender.com/api/product/create',
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${localStorage.getItem('accessToken') || ''}`
                    }
                }
            );

            console.log("✅ Product created successfully:", res.data);
            alert('Thêm sản phẩm thành công!');

            // Call success callback if provided
            if (props.onSuccess) {
                props.onSuccess();
            } else {
                props.onClose();
            }

        } catch (error) {
            console.error("❌ Error creating product:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi thêm sản phẩm!';
            alert(errorMessage);
        }
    };

    

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => props.onClose()}
            ></div>

            {/* Modal */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative z-10 max-w-4xl w-full mx-4 p-6 bg-white shadow-lg rounded-lg max-h-[90vh] overflow-y-auto"
            >
                {/* Close button */}
                <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
                    onClick={() => props.onClose()}
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-6 text-gray-800">Thêm sản phẩm mới</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {/* Product Name */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1" htmlFor="productName">
                                Tên sản phẩm *
                            </label>
                            <input
                                type="text"
                                id="productName"
                                {...register("productName", {
                                    required: "Tên sản phẩm là bắt buộc",
                                    minLength: { value: 3, message: "Tên sản phẩm phải có ít nhất 3 ký tự" }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Nhập tên sản phẩm"
                            />
                            {errors.productName && (
                                <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>
                            )}
                        </div>

                        {/* Product Price */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1" htmlFor="productPrice">
                                Giá sản phẩm (VNĐ) *
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="1000"
                                id="productPrice"
                                {...register("productPrice", {
                                    required: "Giá sản phẩm là bắt buộc",
                                    min: { value: 0, message: "Giá phải lớn hơn 0" }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="VD: 100000"
                            />
                            {errors.productPrice && (
                                <p className="text-red-500 text-sm mt-1">{errors.productPrice.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1" htmlFor="productQuantity">
                                Số lượng *
                            </label>
                            <input
                                type="number"
                                min="0"
                                id="productQuantity"
                                {...register("productQuantity", {
                                    required: "Số lượng là bắt buộc",
                                    min: { value: 0, message: "Số lượng phải lớn hơn hoặc bằng 0" }
                                })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="VD: 100"
                            />
                            {errors.productQuantity && (
                                <p className="text-red-500 text-sm mt-1">{errors.productQuantity.message}</p>
                            )}
                        </div>

                        {/* 🔥 Product Category */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1" htmlFor="productCategory">
                                Danh mục sản phẩm *
                            </label>
                            {loadingCategories ? (
                                <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                                        <span className="text-gray-500">Đang tải danh mục...</span>
                                    </div>
                                </div>
                            ) : (
                                <select
                                    id="productCategory"
                                    {...register("productCategory", { required: "Vui lòng chọn danh mục" })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map((category) => (
                                        <option key={category._id || category.id} value={category._id || category.id}>
                                            {category.categoryName || category.name || 'Danh mục'}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.productCategory && (
                                <p className="text-red-500 text-sm mt-1">{errors.productCategory.message}</p>
                            )}
                            {categories.length === 0 && !loadingCategories && (
                                <p className="text-yellow-600 text-sm mt-1">
                                    ⚠️ Không có danh mục nào. Vui lòng tạo danh mục trước.
                                </p>
                            )}
                        </div>

                        {/* Product Images */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1" htmlFor="images">
                                Hình ảnh sản phẩm *
                            </label>
                            <input
                                type="file"
                                id="images"
                                {...register("images", {
                                    required: "Vui lòng chọn ít nhất 1 hình ảnh",
                                    validate: {
                                        maxFiles: (files) =>
                                            files.length <= 10 || "Tối đa 10 hình ảnh",
                                        fileSize: (files) => {
                                            for (let file of files) {
                                                if (file.size > 5 * 1024 * 1024) { // 5MB
                                                    return "Kích thước file không được vượt quá 5MB";
                                                }
                                            }
                                            return true;
                                        }
                                    }
                                })}
                                multiple
                                accept="image/*"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Chọn nhiều hình ảnh (tối đa 10 files, mỗi file &lt; 5MB)
                            </p>
                            {errors.images && (
                                <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* Product Sizes */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Kích thước sản phẩm *
                            </label>
                            <select
                                multiple
                                size="5"
                                {...register("productSize", { required: "Vui lòng chọn ít nhất 1 kích thước" })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                                <option value="XXXL">XXXL</option>
                            </select>
                            <p className="text-sm text-gray-500 mt-1">
                                Giữ Ctrl (hoặc Cmd) để chọn nhiều kích thước.
                            </p>
                            {errors.productSize && (
                                <p className="text-red-500 text-sm mt-1">{errors.productSize.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Màu sắc sản phẩm *
                            </label>
                            <div className="space-y-3">
                                {fields.map((field, index) => {
    // Lấy giá trị hiện tại của màu
    const currentColor = useWatch({
        control,
        name: `productColors.${index}.value`,
    });
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            {...register(`productColors.${index}.value`, { required: "Vui lòng chọn màu" })}
                                            className="w-12 h-12 border border-gray-300 rounded-md cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                {...register(`productColors.${index}.value`)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                placeholder="Mã màu (VD: #FF0000)"
                                            />
                                        </div>
                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition-colors"
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => append({ value: "#000000" })}
                                className="mt-3 text-blue-600 text-sm hover:text-blue-800 transition-colors"
                            >
                                + Thêm màu
                            </button>
                            {errors.productColors && (
                                <p className="text-red-500 text-sm mt-1">Vui lòng chọn ít nhất 1 màu</p>
                            )}
                        </div>

                        {/* Product Description */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1" htmlFor="productDescription">
                                Mô tả sản phẩm *
                            </label>

                            {/* Controller giúp ReactQuill hoạt động với react-hook-form */}
                            <Controller
                                name="productDescription"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: "Mô tả sản phẩm là bắt buộc",
                                    validate: (value) => {
                                        const plainText = value.replace(/<[^>]+>/g, '').trim(); // Xóa thẻ HTML
                                        if (plainText.length < 10) return "Mô tả phải có ít nhất 10 ký tự";
                                        return true;
                                    },
                                }}
                                render={({ field }) => (
                                    <ReactQuill
                                        {...field}
                                        theme="snow"
                                        className="bg-white"
                                        placeholder="Nhập mô tả chi tiết về sản phẩm..."
                                        modules={modules}
                                        formats={formats}
                                    />
                                )}
                            />

                            {errors.productDescription && (
                                <p className="text-red-500 text-sm mt-1">{errors.productDescription.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => props.onClose()}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Đang thêm...
                            </div>
                        ) : (
                            "Thêm sản phẩm"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ],
  clipboard: {
    matchVisual: false, // Giữ format Word khi paste
  },
};

const formats = [
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'align',
  'color', 'background'
];

export default AddProduct;