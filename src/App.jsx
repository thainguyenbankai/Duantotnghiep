import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUserFromStorage } from './redux/AuthSlice.js';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import Footer from './page/Home/footer.jsx';
import Home from './page/Home/Home.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import ProductDetail from './components/ProductDetail.jsx';
import ProductPage from './page/Product/ProductPage.jsx';
import Account from './components/Account.jsx';
import CartPage from './components/Cart.jsx';
import Wishlist from './components/wishlist.jsx';
import Search from './components/search.jsx';
import CheckoutPage from './components/Checkout.jsx';
import CategoryPage from './components/CategoryPage.jsx';
import OrderSuccess from './data/OrderSuccess.jsx';
import NotFound from './components/NotFound.jsx';

// Admin components
import AdminLayout from './admin/adminpage/AdminLayout.jsx';
import Dashboard from './admin/adminpage/Dashboard.jsx';
import ListUsers from './admin/components/adminUser.jsx';
import ListProducts from './admin/components/adminProduct.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ScrollToTop from './data/ScrollToTop.jsx';
import AdminComments from './admin/components/adminComment.jsx';
import AddProduct from './admin/components/Product/addProdcut.jsx';
import EditProduct from './admin/components/Product/editProduct.jsx';
import AdminOrderList from './admin/components/adminOder.jsx';
import AdminCategory from './admin/components/admincategory.jsx';
import VoucherList from './admin/components/adminVocher.jsx';
import NewProduct from './components/News.jsx';
import AdminNews from './admin/components/adminNews.jsx';
import StoreSystem from './components/StoreSystem.jsx';
import NewsDetail from './components/newsDetail.jsx';

const AppContent = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  const hideNavbarPages = ['/order-success'];
  const isAdminPage = location.pathname.startsWith('/admin');
  const shouldHideNavbar = hideNavbarPages.includes(location.pathname) || isAdminPage;

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/danh-muc/:id" element={<CategoryPage />} />
          <Route path="/danh-muc/:id/:id" element={<CategoryPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route path="/news" element={<NewProduct />} />
          <Route path="/store" element={<StoreSystem />} />
          <Route path="/news/:id" element={<NewsDetail />} />


          <Route path="/cart" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />

          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />

          <Route path="/order-success" element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          } />

          <Route path="/account" element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } />

          <Route path="/wishlist" element={
            <Wishlist />
          } />

          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<ListUsers />} />
            <Route path="listproduct" element={<ListProducts />} />
            <Route path="comments" element={<AdminComments />} />
            <Route path="add" element={<AddProduct />} />
            <Route path="edit/:id" element={<EditProduct />} />
            <Route path="orders" element={<AdminOrderList />} />


            <Route path="category" element={<AdminCategory />} />


            <Route path="voucher" element={<VoucherList />} />
            <Route path="news" element={<AdminNews />} />


          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {!shouldHideNavbar && <Footer />}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
};

export default App;