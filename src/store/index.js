import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import cartReducer from '../features/cartSlice';
import productReducer from '../features/productSlice';
import favoriteReducer from '../features/favoriteSlice';
import orderReducer from '../features/orderSlice';
import aiReducer from '../features/aiSlice';
import adminReducer from '../modules/admin/redux/adminSlice';
import riderReducer from '../modules/rider/redux/riderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    favorites: favoriteReducer,
    orders: orderReducer,
    ai: aiReducer,
    admin: adminReducer,
    rider: riderReducer,
  },
});
