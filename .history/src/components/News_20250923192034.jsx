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
            className=" shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
          >
       
            {item?.postImages?.length > 0 ? (
              <img
                src={item.postImages[0] || 'https://via.placeholder.com/150'} 
                alt="News"
                className="h-40 rounded-md object-cover border"
              />
            ) : (
              <img
                src="https://via.placeholder.com/150"
                alt="News"
                className="h-40 rounded-md object-cover border"
              />
            )}
                 <h3 className="text-lg font-semibold mb-2">{item.postTitle}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewProduct;
  