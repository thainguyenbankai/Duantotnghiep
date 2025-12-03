import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const NewsDetail = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        const response = await axios.get(`https://new-server-e.onrender.com/api/post/detail/${id}`);
        setNewsItem(response.data.data);
      } catch (error) {
        console.error("Error fetching news detail:", error);
      }
    };
    fetchNewsItem();
  }, [id]);

  if (!newsItem) return <p className="text-center mt-20">⏳ Đang tải...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{newsItem.postTitle}</h1>
      {newsItem.postImages?.length > 0 && (
        <div className="mb-4">
          {newsItem.postImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`News ${idx}`}
              className="w-full rounded-md mb-2 object-cover"
            />
          ))}
        </div>
      )}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: newsItem.postContent }}
      />
    </div>
  );
};

export default NewsDetail;
