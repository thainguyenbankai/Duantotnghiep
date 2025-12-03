import { useEffect, useState } from 'react';
import axios from 'axios';

const ListUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('https://new-server-e.onrender.com/api/user/list')
            .then(response => {
                console.log('dsfsdfsdfdsfdffdsfd', response.data);
                setUsers(response.data.data );
            })
            .catch(error => {
                console.error('Axios fetch error:', error);
            });
    }, []);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Danh sách người dùng</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            {/* <th className="py-3 px-4 text-left">ID</th> */}
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Tên</th>
                            <th className="py-3 px-4 text-left">Quyền</th>
                            <th className="py-3 px-4 text-left">Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user._id} className="border-b hover:bg-gray-100">
                                    {/* <td className="py-3 px-4 text-sm">{user._id}</td> */}
                                    <td className="py-3 px-4">{user.email}</td>
                                    <td className="py-3 px-4">
                                        {user.firstName && user.lastName
                                            ? `${user.firstName} ${user.lastName}`
                                            : 'Chưa cập nhật'
                                        }
                                    </td>
                                    <td className="py-3 px-4 capitalize">{user.role}</td>
                                    <td className="py-3 px-4">{formatDate(user.createdAt)}</td>
                                   {/* <td className="py-3 px-4 text-center space-x-2">
                                        <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm">
                                            Sửa
                                        </button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">
                                            Xóa
                                        </button>
                                    </td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    Không có người dùng nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListUsers;