import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import axios from 'axios';

function ProductMegaMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navListMenuItems, setNavListMenuItems] = useState([]);
  let timeoutId = null;

  useEffect(() => {
    axios.get('https://new-server-e.onrender.com/api/category/list-navbar')
      .then(response => {
        setNavListMenuItems(response?.data?.data);
              console.log(response,'ádsadsadsdasd');
      })
      
      .catch(err => console.error('API failed:', err));
  }, []);

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsMenuOpen(false);
    }, 150);
  };

  const renderItems = navListMenuItems.map((item, key) => (
    <div key={item._id || key} className="p-4">
      <Link
        to={`/danh-muc/${item._id}`}
        className="block"
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="flex items-center gap-3 rounded-lg p-4 transition-colors">
          <div className="flex items-center justify-center rounded-lg bg-blue-gray-50 p-2"></div>
          <div>
            <div className="text-lg relative pb-2 before:content-[''] before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-12 before:bg-black text-center font-bold hover:text-red-700 duration-300 transition uppercase text-black">
              {item.categoryName}
            </div>
          </div>
        </div>
      </Link>
      <div className="pl-4">
        {item?.categoryChild
          ?.sort((a, b) => a.categoryName.localeCompare(b.categoryName))
          .map((subItem, subKey) => (
            <Link
              to={`/danh-muc/${item._id}/${subItem._id}`}
              key={subItem._id || subKey}
              className="block pl-6 text-sm mb-1 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              <p className="text-black text-sm hover:text-red-700 duration-300 transition">
                {subItem.categoryName}
              </p>
            </Link>
          ))}
      </div>
    </div>
  ));

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={'/product'}>
        <div className="text-black hover:text-red-700 flex items-center gap-2 cursor-pointer">
          Sản phẩm
          <FiChevronDown
            className={`h-3 w-3 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </Link>

      <div
        className={`
          absolute -left-56 top-full mt-6 w-[800px] z-50 bg-white border border-gray-200 rounded-xl shadow-xl 
          transition-all duration-300 ease-out transform
          ${isMenuOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
        `}
      >
        <div className="grid grid-cols-4 gap-y-2">
          {renderItems}
        </div>
      </div>
    </div>
  );
}

export default ProductMegaMenu;
