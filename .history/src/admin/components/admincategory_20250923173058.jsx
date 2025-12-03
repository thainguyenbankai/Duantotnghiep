import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deletingCategory, setDeletingCategory] = useState(null);
    const [formData, setFormData] = useState({
        categoryName: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://new-server-e.onrender.com/api/category/list');
            const categoryData = response.data?.data?.data || response.data?.data || response.data || [];
            setCategories(Array.isArray(categoryData) ? categoryData : []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
            alert('Không thể tải danh sách danh mục!');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.categoryName.trim()) {
            newErrors.categoryName = 'Vui lòng nhập tên danh mục';
        } else if (formData.categoryName.trim().length > 50) {
            newErrors.categoryName = 'Tên danh mục không quá 50 ký tự';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            const data = {
                categoryName: formData.categoryName.trim()
            };

            if (editingCategory) {
                // Update category
                await axios.patch(
                    `https://new-server-e.onrender.com/api/category/update/${editingCategory._id}`,
                    data,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                alert('Cập nhật danh mục thành công!');
                setShowEditModal(false);
            } else {
                // Create new category
                await axios.post(
                    'https://new-server-e.onrender.com/api/category/create',
                    data,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                alert('Thêm danh mục thành công!');
                setShowAddModal(false);
            }

            // Reset form and refresh list
            resetForm();
            fetchCategories();

        } catch (error) {
            console.error('Error saving category:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi lưu danh mục!';
            alert(errorMessage);
        }
    };


    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            categoryName: category.categoryName || category.name || ''
        });
        setErrors({});
        setShowEditModal(true);
    };


    const resetForm = () => {
        setFormData({ categoryName: '' });
        setEditingCategory(null);
        setErrors({});
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Chưa có';
        const date = new Date(timestamp);
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
    };

    if (loading) {
        return (
            <div className="p-4 text-center">
                <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-4"></div>
                <div className="text-lg">Đang tải danh sách danh mục...</div>
            </div>
        );
    }

    return (
        <div className="p-4 relative">
            {/* Add Category Modal */}
            {showAddModal && (
                <CategoryModal 
                    title="Thêm danh mục mới"
                    onSubmit={handleSubmit}
                    onClose={() => {
                        setShowAddModal(false);
                        resetForm();
                    }}
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    submitText="Thêm danh mục"
                    submitColor="blue"
                />
            )}

            {/* Edit Category Modal */}
            {showEditModal && (
                <CategoryModal 
                    title="Chỉnh sửa danh mục"
                    onSubmit={handleSubmit}
                    onClose={() => {
                        setShowEditModal(false);
                        resetForm();
                    }}
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    submitText="Cập nhật"
                    submitColor="yellow"
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
                        <h3 className="text-xl font-bold mb-4">Xác nhận xóa</h3>
                        <p className="mb-6">Bạn có chắc chắn muốn xóa danh mục "{deletingCategory?.categoryName || deletingCategory?.name}"?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Quản lý danh mục</h2>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                    Thêm danh mục
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="py-3 px-4 text-left">STT</th>
                            <th className="py-3 px-4 text-left">Tên danh mục</th>
                            <th className="py-3 px-4 text-left">Ngày tạo</th>
                            <th className="py-3 px-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? (
                            categories.map((category, index) => (
                                <tr key={category._id || category.id} className="border-b hover:bg-gray-100">
                                    <td className="py-3 px-4 text-center">{index + 1}</td>
                                    <td className="py-3 px-4 font-medium">
                                        {category.categoryName || category.name || 'Chưa có tên'}
                                    </td>
                                    <td className="py-3 px-4 text-sm">
                                        {formatDate(category.createdAt)}
                                    </td>
                                    <td className="py-3 px-4 text-center space-x-2">
                                        <button 
                                            onClick={() => handleEdit(category)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm transition-colors"
                                        >
                                            Sửa
                                        </button>

                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-8 text-gray-500">
                                    <div className="text-lg">Không có danh mục nào.</div>
                                    <div className="text-sm mt-2">Hãy thêm danh mục đầu tiên!</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        
        </div>
    );
};

const CategoryModal = ({ 
    title, 
    onSubmit, 
    onClose, 
    formData, 
    setFormData, 
    errors, 
    submitText, 
    submitColor 
}) => {
    const colorClasses = {
        blue: 'bg-blue-600 hover:bg-blue-700',
        yellow: 'bg-yellow-600 hover:bg-yellow-700',
        green: 'bg-green-600 hover:bg-green-700'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
                <h3 className="text-xl font-bold mb-4">{title}</h3>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Tên danh mục *
                        </label>
                        <input
                            type="text"
                            value={formData.categoryName}
                            onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
                            className={`w-full px-4 py-2 border ${errors.categoryName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
                            placeholder="Nhập tên danh mục"
                        />
                        {errors.categoryName && (
                            <p className="mt-1 text-sm text-red-500">{errors.categoryName}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 ${colorClasses[submitColor]} text-white rounded-md transition-colors`}
                        >
                            {submitText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminCategory;