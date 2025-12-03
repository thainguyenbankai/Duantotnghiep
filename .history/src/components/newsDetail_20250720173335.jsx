import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const NewsDetail = () => {
    const [newsItem, setNewsItem] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchNewsItem = async () => {
            const res = await axios.get(`https://new-server-e.onrender.com/api/post/detail/${id}`);
            console.log(res, 'news item');
            setNewsItem(res.data?.data);
        };
        fetchNewsItem();
    }, [id]);

    return (
        <div>
            <h1>News Detail</h1>
            {newsItem && (

                <div className="container mx-auto mt-20 mb-10 p-4 flex">
                    <div className="w-2/3 pr-4">
                        {newsItem.relatedPost.length > 0 && (
                            <h2 className="text-2xl font-bold mb-4">Related News</h2>
                        )}
                        <div className="mb-6 gap-2  ">
                            {newsItem.relatedPost.map((item, index) => (
                                <div key={index} className=" shadow-md rounded-lg flex gap-3">
                                    {item?.postImages?.length > 0 ?  (
                                        <img src={item.postImages[0]} className="w-12 h-12 object-cover" alt="News" />
                                    ) : (
                                        <img src={'https://via.placeholder.com/150'} className="w-12 h-12 object-cover" alt="News" />
                                    )}
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold mb-2">{item.postTitle}</h3>
                                    </div>
                                </div>
                            ))}
                            

                        </div>


                    </div>

                    <div>
                        <h2 className="text-2xl font-bold">{newsItem.detail?.postTitle}</h2>
                        <div className="prose max-w-none [&>div]:my-2 [&>div]:leading-relaxed mb-5">
                            <div dangerouslySetInnerHTML={{ __html: newsItem.detail?.postContent }} />
                        </div>
                        {newsItem.detail?.postImages && newsItem.detail?.postImages.map((image, index) => (
                            <img key={index} src={image} alt="News" className="h-40 rounded-md object-cover border" />
                        ))}
                    </div>

                </div>

            )}
        </div>
    );
};

export default NewsDetail;
