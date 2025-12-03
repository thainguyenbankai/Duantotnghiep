import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const NewsDetail = () => {
    const [newsItem, setNewsItem] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchNewsItem = async () => {
            try {
                const res = await axios.get(`https://new-server-e.onrender.com/api/post/detail/${id}`);
                setNewsItem(res.data?.data);
            } catch (error) {
                console.error("Error fetching news:", error);
            }
        };
        fetchNewsItem();
    }, [id]);

    return (
        <div>
            <h1>News Detail</h1>
            {newsItem && (
                <div className="container mx-auto mt-20 mb-10 p-4 flex">
                    {/* Related News */}
                    <div className="w-2/3 pr-4">
                        {newsItem.relatedPost.length > 0 && (
                            <h2 className="text-2xl font-bold mb-4">Related News</h2>
                        )}
                        <div className="mb-6 gap-2">
                            {newsItem.relatedPost.map((item, index) => (
                                <Link
                                    key={index}
                                    to={`/news/${item._id}`} // 🔥 link tới trang detail theo id
                                    className="block shadow-md rounded-lg flex gap-3 hover:bg-gray-100 transition"
                                >
                                    {item?.postImages?.length > 0 ? (
                                        <img
                                            src={item.postImages[0]}
                                            className="w-12 h-12 object-cover"
                                            alt="News"
                                        />
                                    ) : (
                                        <img
                                            src={"https://via.placeholder.com/150"}
                                            className="w-12 h-12 object-cover"
                                            alt="News"
                                        />
                                    )}
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold mb-2">{item.postTitle}</h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Main Detail */}
                    <div>
                        <h2 className="text-2xl font-bold">{newsItem.detail?.postTitle}</h2>
                        <div className="prose max-w-none [&>div]:my-2 [&>div]:leading-relaxed mb-5">
                            <div
                                dangerouslySetInnerHTML={{ __html: newsItem.detail?.postContent }}
/>
                        </div>
                        {newsItem.detail?.postImages &&
                            newsItem.detail?.postImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt="News"
                                    className="h-40 rounded-md object-cover border"
                                />
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsDetail;