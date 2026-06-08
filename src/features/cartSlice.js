import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (!savedCart) return { items: [], totalQuantity: 0, totalAmount: 0 };
    
    const parsed = JSON.parse(savedCart);
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      totalQuantity: typeof parsed.totalQuantity === 'number' ? parsed.totalQuantity : 0,
      totalAmount: typeof parsed.totalAmount === 'number' ? parsed.totalAmount : 0,
    };
  } catch (error) {
    return { items: [], totalQuantity: 0, totalAmount: 0 };
  }
};

const saveCartToStorage = (state) => {
  localStorage.setItem('cart', JSON.stringify(state));
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      const itemId = newItem._id || newItem.id;
      const existingItem = state.items.find((item) => (item._id || item.id) === itemId);
      state.totalQuantity++;
      
      if (!existingItem) {
        state.items.push({
          ...newItem,
          id: itemId, // Normalize ID
          quantity: 1,
          totalPrice: newItem.price,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice += newItem.price;
      }
      state.totalAmount += newItem.price;
      saveCartToStorage(state);
    },
    removeFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => (item._id || item.id) === id);
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.totalPrice;
        state.items = state.items.filter((item) => (item._id || item.id) !== id);
      }
      saveCartToStorage(state);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => (item._id || item.id) === id);
      if (existingItem && quantity > 0) {
        const diff = quantity - existingItem.quantity;
        state.totalQuantity += diff;
        state.totalAmount += diff * existingItem.price;
        existingItem.quantity = quantity;
        existingItem.totalPrice = existingItem.price * quantity;
      }
      saveCartToStorage(state);
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
