import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('favorite')) || [];

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const productId = action.payload._id;
      const exists = state.find((item) => item._id === productId);
      let updatedFavorites;

      if (exists) {
        updatedFavorites = state.filter((item) => item._id !== productId);
      } else {
        updatedFavorites = [...state, action.payload];
      }

      localStorage.setItem('favorite', JSON.stringify(updatedFavorites));

      return updatedFavorites;
    },
  },
});

export const { toggleFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;
