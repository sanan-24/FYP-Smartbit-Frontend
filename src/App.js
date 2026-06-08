import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRouter from './routes/AppRouter';
import { checkAuthStatus } from './features/authSlice';
import { fetchCategories } from './features/productSlice';
import { fetchFavorites } from './features/favoriteSlice';
import socketService from './api/socket';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Enforce light-only UI by clearing any previously saved dark preference.
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('darkMode');

    dispatch(checkAuthStatus());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle Socket Connection and Favorites Fetch
  useEffect(() => {
    if (isAuthenticated && user?._id) {
      socketService.connect(user._id);
      dispatch(fetchFavorites());
    }
    // Remove the automatic disconnect from cleanup to prevent loops during re-renders
  }, [isAuthenticated, user, dispatch]);

  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
