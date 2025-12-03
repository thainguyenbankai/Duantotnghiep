import React, { useEffect, useState } from "react";
import axios from "axios";

function VoucherList() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newVoucher, setNewVoucher] = useState({
    voucherName: "",
    voucherDiscount: "",
  });

  const [editingVoucher, setEditingVoucher] = useState(null);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const res = await axios.get("https://new-server-e.onrender.com/api/voucher/list");
      const voucherArray = res.data.data.data;
      setVouchers(Array.isArray(voucherArray) ? voucherArray : []);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newVoucher.voucherName || !newVoucher.voucherDiscount) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      await axios.post(
        "https://new-server-e.onrender.com/api/voucher/create",
        {
          voucherName: newVoucher.voucherName,
          voucherDiscount: Number(newVoucher.voucherDiscount),
        }
      );
      alert("🎉 Tạo voucher thành công!");
      setNewVoucher({ voucherName: "", voucherDiscount: "" });
      fetchVouchers();
    } catch (error) {
      console.error("Lỗi tạo voucher:", error);
      alert("❌ Tạo voucher thất bại!");
    }
  };

  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingVoucher.voucherName || !editingVoucher.voucherDiscount) {
      alert("Vui lòng điền đủ thông tin khi sửa");
      return;
    }

    try {
      await axios.patch(
        `https://new-server-e.onrender.com/api/voucher/update/${editingVoucher._id}`,
        {
          voucherName: editingVoucher.voucherName,
          voucherDiscount: Number(editingVoucher.voucherDiscount),
        }
      );
      alert("✅ Cập nhật thành công!");
      setEditingVoucher(null);
      fetchVouchers();
    } catch (error) {
      console.error("❌ Lỗi cập nhật:", error);
      alert("❌ Cập nhật thất bại!");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa voucher này?");
    if (!confirm) return;

    try {
      await axios.delete(`https://new-server-e.onrender.com/api/voucher/delete/${id}`);
      setVouchers((prev) => prev.filter((v) => v._id !== id));
      alert("✅ Xóa thành công!");
    } catch (error) {
      console.error("❌ Xóa thất bại:", error);
      alert("❌ Xóa thất bại!");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🎁 Danh sách Voucher</h2>

      {/* FORM TẠO MỚI */}
      <form onSubmit={handleCreate} className="mb-6 space-y-2">
        <div>
          <label className="mr-2">Tên Voucher:</label>
          <input
            type="text"
            className="border p-1 w-64"
            value={newVoucher.voucherName}
            onChange={(e) => setNewVoucher({ ...newVoucher, voucherName: e.target.value })}
          />
        </div>
        <div>
          <label className="mr-2">Giảm giá (%):</label>
          <input
            type="number"
            className="border p-1 w-32"
            value={newVoucher.voucherDiscount}
            onChange={(e) => setNewVoucher({ ...newVoucher, voucherDiscount: e.target.value })}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
          ➕ Thêm Voucher
        </button>
      </form>

      {/* FORM SỬA */}
      {editingVoucher && (
        <form onSubmit={handleUpdate} className="mb-6 space-y-2 bg-yellow-50 p-4 rounded border">
          <h3 className="font-bold text-lg text-yellow-700">✏️ Sửa Voucher</h3>
          <div>
            <label className="mr-2">Tên Voucher:</label>
            <input
              type="text"
              className="border p-1 w-64"
              value={editingVoucher.voucherName}
              onChange={(e) =>
                setEditingVoucher({ ...editingVoucher, voucherName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="mr-2">Giảm giá (%):</label>
            <input
              type="number"
              className="border p-1 w-32"
              value={editingVoucher.voucherDiscount}
              onChange={(e) =>
                setEditingVoucher({ ...editingVoucher, voucherDiscount: e.target.value })
              }
            />
          </div>
          <div className="space-x-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded">
              ✅ Cập nhật
            </button>
            <button
              onClick={() => setEditingVoucher(null)}
              type="button"
              className="bg-gray-400 text-white px-4 py-1 rounded"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* DANH SÁCH */}
      {loading ? (
        <p>Đang tải danh sách voucher...</p>
      ) : (
        <table className="w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Tên Voucher</th>
              <th className="border px-4 py-2">Giảm giá (%)</th>
              <th className="border px-4 py-2">Hết hạn</th>
              <th className="border px-4 py-2">Trạng thái</th>
              <th className="border px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher, index) => (
              <tr key={voucher._id} className="text-center">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{voucher.voucherName || "Không tên"}</td>
                <td className="border px-4 py-2">{voucher.voucherDiscount}%</td>
                <td className="border px-4 py-2">
                  {new Date(voucher.expiryDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  {voucher.isActive ? (
                    <span className="text-green-600 font-semibold">Đang hoạt động</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Ngừng</span>
                  )}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(voucher)}
                    className="bg-yellow-400 px-2 py-1 rounded text-white"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(voucher._id)}
                    className="bg-red-500 px-2 py-1 rounded text-white"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VoucherList;
