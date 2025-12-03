import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios';

const SearchSuggestions = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const searchRef = useRef(null);
    const suggestionsRef = useRef(null);
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (searchTerm.trim().length > 1) {
                fetchSuggestions(searchTerm.trim());
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(delayedSearch);
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target) &&
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSuggestions = async (query) => {
        setIsLoading(true);
        try {
            const res = await axios.post(
                'https://new-server-e.onrender.com/api/product/find',
                { productName: query }
            );

            const results = res.data?.data?.data ;
            setSuggestions(results.slice(0, 7));
            setShowSuggestions(true);
        } catch (err) {
            console.error('Lỗi ádasdasd', err);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            setShowSuggestions(false);
            onClose();
            try {
                const res = await axios.post(
                    'https://new-server-e.onrender.com/api/product/find',
                    { productName: searchTerm.trim() }
                );

                navigate('/search', {
                    state: {
                        results: res.data?.data?.data || [],
                        keyword: searchTerm.trim()
                    }
                });
            } catch (err) {
                console.error('Lỗiádasdasd ', err.message);
            }
        }
    };

    const handleSuggestionClick = (product) => {
        setSearchTerm('');
        setShowSuggestions(false);
        onClose();
        navigate(`/product/${product._id}`);
    };

    const handleShowAllResults = () => {
        if (searchTerm.trim()) {
            setShowSuggestions(false);
            onClose();
            navigate('/search', {
                state: {
                    results: suggestions,
                    keyword: searchTerm.trim()
                }
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-12  right-48 bg-white shadow-xl border border-gray-200 rounded-xl z-[9999] w-[400px]">
            <div className="p-4">
                <h3 className="text-center font-medium text-gray-900 mb-4">TÌM KIẾM</h3>

                <div
                    ref={searchRef}
                    className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-4"
                >
                    <FiSearch className="text-gray-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                        onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
                        className="w-full bg-transparent outline-none text-sm"
                        autoFocus
                    />
                </div>

                {showSuggestions && (
                    <div ref={suggestionsRef}>
                        {isLoading ? (
                            <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                            </div>
                        ) : suggestions.length > 0 ? (
                            <>
                                <div className="space-y-3 mb-4 max-h-[350px] overflow-y-auto">
                                    {suggestions.map((product) => (
                                        <div
                                            key={product._id}
                                            onClick={() => handleSuggestionClick(product)}
                                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                                        >
                                            <img
                                                src={product.productImages?.[0] || 'https://via.placeholder.com/50x50'}
                                                alt={product.productName}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                                    {product.productName}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-sm text-red-600 font-semibold">
                                                        {product.productPrice?.toLocaleString()}₫
                                                    </p>
                                                    {product.originalPrice && product.originalPrice > product.productPrice && (
                                                        <p className="text-xs text-gray-400 line-through">
                                                            {product.originalPrice?.toLocaleString()}₫
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleShowAllResults}
                                    className="w-full bg-gray-900 text-white py-3 rounded text-sm hover:bg-gray-800 transition-colors"
                                >
                                    Xem thêm {suggestions.length} kết quả tìm kiếm
                                </button>
                            </>
                        ) : searchTerm.length > 1 && (
                            <div className="text-center py-4 text-gray-500">
                                Không tìm thấy sản phẩm nào
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchSuggestions;