import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './AuthSlice';
import favoriteReducer from './favoriteSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    favorite: favoriteReducer,
    auth: authReducer, 


  },
});
