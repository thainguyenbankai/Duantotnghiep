import { useForm } from "react-hook-form";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const AddNew = () => {
  const { register, handleSubmit } = useForm();
  const [content, setContent] = useState("");

  const onSubmit = (data) => {
    console.log("formData:", data);

    const formData = new FormData();
    formData.append("postTitle", data.postTitle);
    formData.append("postContent", content);

    // Thêm ảnh (cho phép nhiều ảnh)
    if (data.postImages && data.postImages.length > 0) {
      for (let i = 0; i < data.postImages.length; i++) {
        formData.append("images", data.postImages[i]);
      }
    }

    axios
      .post("https://new-server-e.onrender.com/api/post/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Thêm tin thành công:", response.data);
        alert("Thêm tin thành công");
      })
      .catch((error) => {
        console.error("Lỗi khi thêm tin:", error);
        alert("Thêm tin thất bại");
      });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg p-8 rounded-lg mt-10 overflow-y-auto h-[600px]">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        📰 Thêm Tin Tức Mới
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
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            className="bg-white rounded-md"
          />
        </div>

        {/* Hình ảnh */}
        <div>
          <label
            htmlFor="images"
            className="block text-gray-700 font-medium mb-1"
          >
            Hình ảnh
          </label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            {...register("postImages")}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-200"
          >
            ➕ Thêm bài viết
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNew;
