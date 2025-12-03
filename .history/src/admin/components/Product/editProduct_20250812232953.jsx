/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

const EditProduct = ({ productId, onClose, onSuccess, open }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
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

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get(
          "https://new-server-e.onrender.com/api/category/list"
        );
        const categoryData =
          response.data?.data?.data ||
          response.data?.data ||
          response.data ||
          [];
        setCategories(Array.isArray(categoryData) ? categoryData : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch product when modal is open and productId changes
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || !open) return;

      try {
        setLoadingProduct(true);
        const response = await axios.get(
          `https://new-server-e.onrender.com/api/product/detail/${productId}`
        );
        const productData = response.data?.data || response.data;

        if (!productData) {
          alert("Không tìm thấy dữ liệu sản phẩm!");
          return;
        }

        setPreviewImages(productData.productImages || []);

        // Đảm bảo cấu trúc dữ liệu khớp với register()
        const formData = {
          productName: productData.productName || "",
          productPrice: productData.productPrice || 0,
          productQuantity: productData.productQuantity || 0,
          productDescription: productData.productDescription || "",
          productCategory:
            productData.productCategory?._id ||
            productData.productCategory ||
            "",
          productSize: Array.isArray(productData.productSize)
            ? productData.productSize
            : [],
          productColors:
            Array.isArray(productData.productColor) &&
            productData.productColor.length > 0
              ? productData.productColor.map((c) => ({ value: c }))
              : [{ value: "#000000" }],
        };

        reset(formData);
      } catch (error) {
        console.error("❌ API Error:", error);
        alert("Lỗi API: " + (error.response?.data?.message || error.message));
      } finally {
        setLoadingProduct(false);
      }
    };

    if (open && productId) {
      fetchProduct();
    }
  }, [productId, open, reset]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      reset({
        productColors: [{ value: "#000000" }],
      });
      setPreviewImages([]);
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

      if (formData.productSize && formData.productSize.length > 0) {
        formData.productSize.forEach((size) => {
          data.append("productSize[]", size);
        });
      }

      if (formData.productColors && formData.productColors.length > 0) {
        formData.productColors.forEach((color) => {
          data.append("productColor[]", color.value);
        });
      }

      if (formData.images && formData.images.length > 0) {
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
            Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
          },
        }
      );

      alert("Cập nhật sản phẩm thành công!");
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      console.error("❌ Error updating product:", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật sản phẩm!"
      );
    }
  };

  const handleRemoveExistingImage = async (imageUrl, index) => {
    try {
      const response = await axios.delete(
        `https://new-server-e.onrender.com/api/product/image/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
          },
          data: { imageUrl },
        }
      );
      setPreviewImages((prev) => prev.filter((_, i) => i !== index));
      alert("Xóa hình ảnh thành công!");
    } catch (error) {
      console.error("Error removing image:", error);
      alert("Không thể xóa hình ảnh!");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
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
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Chỉnh sửa sản phẩm
        </h2>

        {loadingProduct ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full mr-4"></div>
            <span className="text-gray-600">
              Đang tải thông tin sản phẩm...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label
                  className="block text-gray-700 font-medium mb-1"
                  htmlFor="productName"
                >
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  id="productName"
                  {...register("productName", {
                    required: "Tên sản phẩm là bắt buộc",
                    minLength: {
                      value: 3,
                      message: "Tên sản phẩm phải có ít nhất 3 ký tự",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Nhập tên sản phẩm"
                />
                {errors.productName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productName.message}
                  </p>
                )}
              </div>

              {/* Product Price */}
              <div>
                <label
                  className="block text-gray-700 font-medium mb-1"
                  htmlFor="productPrice"
                >
                  Giá sản phẩm (VNĐ) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  id="productPrice"
                  {...register("productPrice", {
                    required: "Giá sản phẩm là bắt buộc",
                    min: { value: 0, message: "Giá phải lớn hơn 0" },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="VD: 100000"
                />
                {errors.productPrice && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productPrice.message}
                  </p>
                )}
              </div>

              {/* Product Quantity */}
              <div>
                <label
                  className="block text-gray-700 font-medium mb-1"
                  htmlFor="productQuantity"
                >
                  Số lượng *
                </label>
                <input
                  type="number"
                  min="0"
                  id="productQuantity"
                  {...register("productQuantity", {
                    required: "Số lượng là bắt buộc",
                    min: {
                      value: 0,
                      message: "Số lượng phải lớn hơn hoặc bằng 0",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="VD: 100"
                />
                {errors.productQuantity && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productQuantity.message}
                  </p>
                )}
              </div>

              {/* Product Category */}
              <div>
                <label
                  className="block text-gray-700 font-medium mb-1"
                  htmlFor="productCategory"
                >
                  Danh mục sản phẩm *
                </label>
                {loadingCategories ? (
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                      <span className="text-gray-500">
                        Đang tải danh mục...
                      </span>
                    </div>
                  </div>
                ) : (
                  <select
                    id="productCategory"
                    {...register("productCategory", {
                      required: "Vui lòng chọn danh mục",
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((category) => (
                      <option
                        key={category._id || category.id}
                        value={category._id || category.id}
                      >
                        {category.categoryName ||
                          category.name ||
                          "Danh mục"}
                      </option>
                    ))}
                  </select>
                )}
                {errors.productCategory && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productCategory.message}
                  </p>
                )}
              </div>

              {/* Existing Images */}
              {previewImages.length > 0 && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Hình ảnh hiện tại
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {previewImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveExistingImage(image, index)
                          }
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              <div>
                <label
                  className="block text-gray-700 font-medium mb-1"
                  htmlFor="images"
                >
                  Thêm hình ảnh mới (tùy chọn)
                </label>
                <input
                  type="file"
                  id="images"
                  {...register("images", {
                    validate: {
                      maxFiles: (files) =>
                        !files ||
                        files.length <= 10 ||
                        "Tối đa 10 hình ảnh",
                      fileSize: (files) => {
                        if (!files) return true;
                        for (let file of files) {
                          if (file.size > 5 * 1024 * 1024) {
                            return "Kích thước file không được vượt quá 5MB";
                          }
                        }
                        return true;
                      },
                    },
                  })}
                  multiple
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
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
                  {...register("productSize", {
                    required: "Vui lòng chọn ít nhất 1 kích thước",
                  })}
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
                {errors.productSize && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productSize.message}
                  </p>
                )}
              </div>

              {/* Product Colors */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Màu sắc sản phẩm *
                </label>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-3">
                    <input
                      type="color"
                      {...register(`productColors.${index}.value`, {
                        required: "Vui lòng chọn màu",
                      })}
                      className="w-12 h-12 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      {...register(`productColors.${index}.value`)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Mã màu (VD: #FF0000)"
                    />
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => append({ value: "#000000" })}
                  className="mt-2 text-blue-600 text-sm hover:text-blue-800"
                >
                  + Thêm màu
                </button>
              </div>

              {/* Product Description */}
              <div>
                <label
                  className="block text-gray-700 font-medium mb-1"
                  htmlFor="productDescription"
                >
                  Mô tả sản phẩm *
                </label>
                <textarea
                  id="productDescription"
                  rows={6}
                  {...register("productDescription", {
                    required: "Mô tả sản phẩm là bắt buộc",
                    minLength: {
                      value: 10,
                      message: "Mô tả phải có ít nhất 10 ký tự",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.productDescription && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productDescription.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow disabled:opacity-50"
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
