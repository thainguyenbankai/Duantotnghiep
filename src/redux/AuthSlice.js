import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  userData: null,
  token: null,
  role: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      console.log('🔥 loginSuccess reducer được gọi!');
      console.log('🔥 action.payload:', action.payload);
      console.log('🔥 state trước khi update:', {
        isAuthenticated: state.isAuthenticated,
        role: state.role
      });
      
      const { user, userData, token, role } = action.payload;
      
      console.log('🎯 loginSuccess payload:', action.payload);
      console.log('🎯 role nhận được:', role);
      
      state.isAuthenticated = true;
      state.user = user;
      state.userData = userData;
      state.token = token;
      state.role = role;
      state.isLoading = false;
      
      console.log('🎯 State sau khi login:', {
        isAuthenticated: state.isAuthenticated,
        role: state.role,
        user: state.user
      });
    },
    logout: (state) => {
      console.log('🚪 Đăng xuất');
      state.isAuthenticated = false;
      state.user = null;
      state.userData = null;
      state.token = null;
      state.role = null;
      state.isLoading = false;
      
      // Xóa dữ liệu từ localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    },
    loadUserFromStorage: (state) => {
      const token = localStorage.getItem('accessToken');
      const user = localStorage.getItem('user');
      const role = localStorage.getItem('role');
      
      console.log('🔄 Loading from storage:');
      console.log('token:', token ? 'có' : 'không');
      console.log('user:', user);
      console.log('role:', role);
      
      if (token && user) { 
        try {
          const parsedUser = JSON.parse(user);
          state.isAuthenticated = true;
          state.user = parsedUser;
          state.userData = parsedUser;
          state.token = { accessToken: token };
          state.role = role || null; 
          
          console.log('✅ Load thành công từ storage:', {
            isAuthenticated: true,
            role: role,
            user: parsedUser
          });
        } catch (error) {
          console.error('❌ Lỗi khi load user từ storage:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('role');
        }
      } else {
        console.log('❌ Thiếu dữ liệu trong storage');
      }
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  },
});

export const { loginSuccess, logout, loadUserFromStorage, setLoading } = authSlice.actions;
export default authSlice.reducer;