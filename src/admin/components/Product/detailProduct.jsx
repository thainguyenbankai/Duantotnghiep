import React from "react";

const DetailProduct = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        {/* Product Image */}
        <img
          src={product.productImages?.[0]}
          alt={product.productName}
          className="w-full h-72 object-cover rounded-md mb-4"
        />

        {/* Product Name */}
        <h2 className="text-2xl font-bold mb-2">{product.productName}</h2>

        {/* Product Price */}
        <p className="text-lg font-semibold text-red-500 mb-2">
          {product.productPrice?.toLocaleString("vi-VN")}₫
        </p>

        {/* Product Size */}
        <p className="text-sm text-gray-700 mb-1">
          Kích cỡ: {product.productSize?.join(", ")}
        </p>

        {/* Product Color */}
        <div className="flex items-center mb-4">
          <span className="text-sm text-gray-700 mr-2">Màu sắc:</span>
          {product.productColor?.map((color, index) => (
            <div
              key={index}
              className="w-5 h-5 rounded-full border"
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>

        {/* Product Description */}
        <div className="prose max-w-none text-sm leading-relaxed mb-2">
          <div
            dangerouslySetInnerHTML={{ __html: product.productDescription }}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
