import { useForm } from "react-hook-form";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const EditNews = ({ newsItem, onClose }) => {
  console.log("newsItem:", newsItem);

  const { register, handleSubmit } = useForm();
  const [content, setContent] = useState(newsItem?.postContent || "");

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("postTitle", data.postTitle);
    formData.append("postContent", content);

    // Thêm ảnh mới (nếu có)
    if (data.postImages && data.postImages.length > 0) {
      for (let i = 0; i < data.postImages.length; i++) {
        formData.append("images", data.postImages[i]);
      }
    }

    axios
      .patch(
        `https://new-server-e.onrender.com/api/post/update/${newsItem._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log("Cập nhật tin thành công:", response.data);
        alert("Cập nhật tin thành công");
        onClose(); // Đóng modal khi thành công
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật tin:", error);
        alert("Cập nhật tin thất bại");
      });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg p-8 rounded-lg mt-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        🛠️ Chỉnh sửa Tin Tức
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="space-y-6 overflow-y-scroll"
      >
        {/* Tiêu đề */}
        <div>
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-1"
          >
            Tiêu đề
          </label>
          <input
            type="text"
            id="title"
            defaultValue={newsItem?.postTitle}
            {...register("postTitle", { required: true })}
            placeholder="Nhập tiêu đề bài viết"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Nội dung */}
        <div>
          <label
            htmlFor="content"
            className="block text-gray-700 font-medium mb-1"
          >
            Nội dung
          </label>
          <div className="bg-white rounded-md h-60 overflow-y-auto">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="h-full"
            />
          </div>
        </div>

        {/* Hình ảnh */}
        <div>
          <label
            htmlFor="images"
            className="block text-gray-700 font-medium mb-1"
          >
            Cập nhật Hình ảnh
          </label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            {...register("postImages")}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0 file:text-sm file:font-semibold
              file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
          />

          {/* Ảnh hiện tại */}
          {newsItem?.postImages?.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              <p className="text-sm text-gray-500 col-span-3">Ảnh hiện tại:</p>
              {newsItem.postImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="News"
                  className="h-32 w-full object-cover rounded-md border"
                />
              ))}
            </div>
          )}
        </div>

        {/* Nút submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-yellow-600 text-white px-6 py-2 rounded-md font-medium hover:bg-yellow-700 transition duration-200"
          >
            💾 Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNews;
