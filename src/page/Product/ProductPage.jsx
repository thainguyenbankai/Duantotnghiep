import { useState } from 'react';
import { FaFilter } from "react-icons/fa";
import Product from "../../components/Product";

const ProductPage = () => {
    const [filters, setFilters] = useState({
        sortOrder: 'latest',
        priceRange: null,
        category: null,
        color: null,
    });

    return (
        <div className="container mx-auto mt-10 p-4">
            <div>
                <img src="https://file.hstatic.net/200000584505/file/san_pham_moi_banner.jpg" alt="" />
            </div>
            {/* <div className="flex items-center justify-between flex-wrap gap-4 px-4 md:px-10 py-4">
                <h2 className="text-xl md:text-2xl font-sans tracking-wider">
                    TẤT CẢ SẢN PHẨM
                </h2>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 border px-4 py-2 text-sm rounded hover:bg-gray-100">
                        Bộ lọc <FaFilter />
                    </button>
                    <label className="text-sm hidden md:block">Sắp xếp:</label>
                    <select
                        className="border px-3 py-2 text-sm rounded"
                        value={filters.sortOrder}
                        onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value }))}
                    >
                        <option value="latest">Mới nhất</option>
                        <option value="priceAsc">Giá thấp đến cao</option>
                        <option value="priceDesc">Giá cao đến thấp</option>
                        <option value="nameAsc">A → Z</option>
                        <option value="nameDesc">Z → A</option>
                    </select>
                </div>
            </div> */}

            <Product filters={filters} />
        </div>
    );
};

export default ProductPage;