import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NewProduct = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://new-server-e.onrender.com/api/post/list');
        setNews(response.data.data.data || []); // Ensure news is an array
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="px-8 py-12 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {news.map((item, index) => (
          <Link
            to={`/news/${item._id}`}
            key={index}
            className="shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white"
          >
            <div className="w-full aspect-[4/3] overflow-hidden">
              {item?.postImages?.length > 0 ? (
                <img
                  src={item.postImages[0] || 'https://via.placeholder.com/300x200'}
                  alt="News"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="https://via.placeholder.com/300x200"
                  alt="News"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.postTitle}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewProduct;
