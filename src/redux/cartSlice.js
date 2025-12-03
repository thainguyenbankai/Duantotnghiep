import { createSlice } from '@reduxjs/toolkit';

// Helper để load từ localStorage
const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
};

const saveToLocalStorage = (cartItems) => {
  try {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  } catch (error) {
    console.error('❌ Error saving cart:', error);
  }
};

// Tạo unique ID cho cart item
const generateCartId = (product, color, size) => {
  return `${product._id}-${color || 'default'}-${size || 'default'}-${Date.now()}`;
};

const initialState = {
  cartItems: loadFromLocalStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        item => 
          item._id === newItem._id &&
          item.productColor === newItem.productColor &&
          item.productSize === newItem.productSize
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      } else {
        // Thêm unique cartId cho item mới
        const cartItem = {
          ...newItem,
          cartId: generateCartId(newItem, newItem.productColor, newItem.productSize),
          quantity: newItem.quantity || 1
        };
        state.cartItems.push(cartItem);
      }
      
      saveToLocalStorage(state.cartItems);
    },

    removeFromCart: (state, action) => {
      const cartId = action.payload;
      
      state.cartItems = state.cartItems.filter(item => item.cartId !== cartId);
      
      saveToLocalStorage(state.cartItems);
    },

    increaseQuantity: (state, action) => {
      const cartId = action.payload;
      
      const item = state.cartItems.find(item => item.cartId === cartId);
      
      if (item) {
        item.quantity += 1;
        console.log('✅ New quantity:', item.quantity);
        
        saveToLocalStorage(state.cartItems);
      } else {
        console.log('❌ Item not found for increase');
      }
    },

    decreaseQuantity: (state, action) => {
      const cartId = action.payload;
      console.log('⬇️ Decreasing quantity for:', cartId);
      
      const item = state.cartItems.find(item => item.cartId === cartId);
      
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        console.log('✅ New quantity:', item.quantity);
        
        saveToLocalStorage(state.cartItems);
      } else {
        console.log('❌ Item not found or quantity = 1');
      }
    },

    clearCart: (state) => {
      console.log('🧹 Clearing cart');
      state.cartItems = [];
      
      saveToLocalStorage(state.cartItems);
    },

    setCart: (state, action) => {
      state.cartItems = action.payload || [];
      
      saveToLocalStorage(state.cartItems);
    }
  },
});

export const { 
  addToCart,
  removeFromCart,
  increaseQuantity,// đếm sl
  decreaseQuantity,// tổng sl
  clearCart,
  setCart 
} = cartSlice.actions;

export default cartSlice.reducer;