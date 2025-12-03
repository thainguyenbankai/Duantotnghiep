import { useEffect, useState } from "react";
import AddNew from "./new/addNew";
import EditNews from "./new/addEdit";
import axios from "axios";




const AdminNews = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedNews, setSelectedNews] = useState(null);
    const [newsList, setNewsList] = useState([]);


    useEffect(() => {
        const fetchNewsList = async () => {
            const res = await axios.get('https://new-server-e.onrender.com/api/post/list');
            console.log(res, 'news list');
            setNewsList(res.data.data.data || []);
        };
        fetchNewsList();
    }, []);

    const handleDelete = (id) => {
        console.log(id, 'id delete');
        if (!window.confirm("Bạn có chắc chắn muốn xoá tin này?")) {
            return;
        }
        axios.delete(`https://new-server-e.onrender.com/api/post/delete/${id}`)
            .then(() => {
                setNewsList();
                alert("Xoá tin thành công");
            })
            .catch((error) => {
                console.error("Lỗi khi xoá tin:", error);
                alert("Xoá tin thất bại");
            });
    };

    const handleEdit = (news) => {
        console.log(news, 'news edit');
        setSelectedNews(news);
        setModalType("edit");
        setShowModal(true);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Quản lý Tin Tức</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Thêm Tin Tức Mới</h2>
                <button
                    onClick={() => {
                        setModalType("add");
                        setShowModal(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    + Thêm Tin
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Danh sách tin</h2>
                {newsList?.map((item) => (
                    <div key={item._id} className="flex justify-between items-center border-b py-2">
                        <div className="flex justify-center items-center gap-8">
                            <p className="font-semibold">{item.postTitle}</p>
                            <p className="text-xs text-gray-500">Ngày đăng: {new Date(item.createdAt).toLocaleDateString()}</p>
                            {
                                item.postImages && item.postImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        className="w-20 h-20 object-cover mt-2 rounded"
                                    />
                                ))
                            }
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={() => handleEdit(item)}
                                className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-white"
                            >
                                Sửa
                            </button>
                            <button
                                onClick={() => handleDelete(item._id)}
                                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
                            >
                                Xoá
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-xl relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
                        >
                            ✕
                        </button>

                        {modalType === "add" ? (
                            <AddNew onClose={() => setShowModal(false)} />
                        ) : (
                            <EditNews newsItem={selectedNews} onClose={() => setShowModal(false)} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminNews;
