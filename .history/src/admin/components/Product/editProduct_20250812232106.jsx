/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

const EditProduct = ({ productId, onClose, onSuccess, open }) => {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [previewImages, setPreviewImages] = useState([]);

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
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
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId || !open) return;
            try {
                setLoadingProduct(true);
                const response = await axios.get(`https://new-server-e.onrender.com/api/product/detail/${productId}`);
                const productData = response.data?.data || response.data;
                if (!productData) {
                    alert('Không tìm thấy dữ liệu sản phẩm!');
                    return;
                }
                setCurrentProduct(productData);
                setPreviewImages(productData.productImages || []);

                // Map dữ liệu API sang form
                const formData = {
                    productName: productData.productName || '',
                    productPrice: productData.productPrice || 0,
                    productQuantity: productData.productQuantity || 0,
                    productDescription: productData.productDescription || '',
                    productCategory: productData.productCategory?._id || productData.productCategory || '',
                    productSize: productData.productSize || [],
                    productColors: (productData.productColor && productData.productColor.length > 0)
                        ? productData.productColor.map(color => ({ value: color }))
                        : [{ value: "#000000" }]
                };
                reset(formData); // Không dùng setTimeout
            } catch (error) {
                console.error('API Error:', error);
                alert('Lỗi API: ' + (error.response?.data?.message || error.message));
            } finally {
                setLoadingProduct(false);
            }
        };
        if (open && productId) {
            fetchProduct();
        }
    }, [productId, open, reset]);

    useEffect(() => {
        if (!open) {
            reset({
                productColors: [{ value: "#000000" }],
            });
            setPreviewImages([]);
            setCurrentProduct(null);
            setLoadingProduct(true);
        }
    }, [open, reset]);

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
            if (formData.productSize?.length > 0) {
                formData.productSize.forEach(size => {
                    data.append("productSize[]", size);
                });
            }
            if (formData.productColors?.length > 0) {
                formData.productColors.forEach(color => {
                    data.append("productColor[]", color.value);
                });
            }
            if (formData.images?.length > 0) {
                for (let i = 0; i < formData.images.length; i++) {
                    data.append("images", formData.images[i]);
                }
            }
            data.append("keepExistingImages", "true");

            const res = await axios.patch(
                `https://new-server-e.onrender.com/api/product/update/${productId}`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${localStorage.getItem('accessToken') || ''}`
                    }
                }
            );
            alert('Cập nhật sản phẩm thành công!');
            if (onSuccess) {
                onSuccess();
            } else {
                onClose();
            }
        } catch (error) {
            console.error("Error updating product:", error.response?.data || error.message);
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm!');
        }
    };

    const handleRemoveExistingImage = async (imageUrl, index) => {
        try {
            await axios.delete(
                `https://new-server-e.onrender.com/api/product/image/${productId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('accessToken') || ''}`
                    },
                    data: { imageUrl }
                }
            );
            setPreviewImages(prev => prev.filter((_, i) => i !== index));
            alert('Xóa hình ảnh thành công!');
        } catch (error) {
            console.error('Error removing image:', error);
            alert('Không thể xóa hình ảnh!');
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 max-w-4xl w-full mx-4 p-6 bg-white shadow-lg rounded-lg max-h-[90vh] overflow-y-auto">
                <button type="button" className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold" onClick={onClose}>✕</button>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Chỉnh sửa sản phẩm</h2>

                {loadingProduct ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full mr-4"></div>
                        <span className="text-gray-600">Đang tải thông tin sản phẩm...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left column */}
                        <div className="space-y-4">
                            {/* Product name */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Tên sản phẩm *</label>
                                <input type="text" {...register("productName", { required: "Tên sản phẩm là bắt buộc" })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                                {errors.productName && <p className="text-red-500 text-sm">{errors.productName.message}</p>}
                            </div>
                            {/* Price */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Giá sản phẩm *</label>
                                <input type="number" {...register("productPrice", { required: "Giá sản phẩm là bắt buộc" })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                            </div>
                            {/* Quantity */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Số lượng *</label>
                                <input type="number" {...register("productQuantity", { required: "Số lượng là bắt buộc" })} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                            </div>
                            {/* Category */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Danh mục *</label>
                                <select {...register("productCategory", { required: "Vui lòng chọn danh mục" })} className="w-full px-4 py-2 border border-gray-300 rounded-md">
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>{category.categoryName}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Existing images */}
                            {previewImages.length > 0 && (
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Hình ảnh hiện tại</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {previewImages.map((image, index) => (
                                            <div key={index} className="relative">
                                                <img src={image} alt={`Product ${index}`} className="w-full h-20 object-cover rounded border" />
                                                <button type="button" onClick={() => handleRemoveExistingImage(image, index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* New images */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Thêm hình ảnh mới</label>
                                <input type="file" {...register("images")} multiple accept="image/*" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="space-y-4">
                            {/* Sizes */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Kích thước *</label>
                                <select multiple size="5" {...register("productSize", { required: "Chọn ít nhất 1 kích thước" })} className="w-full px-4 py-2 border border-gray-300 rounded-md">
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                    <option value="XXL">XXL</option>
                                    <option value="XXXL">XXXL</option>
                                </select>
                            </div>
                            {/* Colors */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Màu sắc *</label>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-3">
                                        <input type="color" {...register(`productColors.${index}.value`, { required: true })} className="w-12 h-12 border border-gray-300 rounded-md" />
                                        <input type="text" {...register(`productColors.${index}.value`)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="Mã màu" />
                                        {fields.length > 1 && (
                                            <button type="button" onClick={() => remove(index)} className="text-red-500">🗑️</button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={() => append({ value: "#000000" })} className="mt-3 text-blue-600 text-sm">+ Thêm màu</button>
                            </div>
                            {/* Description */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Mô tả *</label>
                                <textarea rows={6} {...register("productDescription", { required: "Mô tả sản phẩm là bắt buộc" })} className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md">Hủy</button>
                    <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow disabled:opacity-50">
                        {isSubmitting ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
