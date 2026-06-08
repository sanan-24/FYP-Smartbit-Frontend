import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Menu from '../pages/Menu';
import Cart from '../pages/Cart';
import Favorites from '../pages/Favorites';
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import Profile from '../pages/Profile';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import VerifyEmail from '../pages/auth/VerifyEmail';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';

// Admin Module Imports
import AdminLayout from '../modules/admin/components/AdminLayout';
import AdminDashboard from '../modules/admin/pages/Dashboard';
import AdminOrders from '../modules/admin/pages/OrderManagement';
import AdminMenu from '../modules/admin/pages/MenuManagement';
import AdminRiders from '../modules/admin/pages/RiderManagement';
import AdminUsers from '../modules/admin/pages/UserManagement';

// Rider Module Imports
import RiderLayout from '../modules/rider/components/RiderLayout';
import RiderDashboard from '../modules/rider/pages/RiderDashboard';
import RiderOrders from '../modules/rider/pages/RiderOrders';
import RiderHistory from '../modules/rider/pages/RiderHistory';
import RiderSettings from '../modules/rider/pages/RiderSettings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'menu', element: <Menu /> },
      { 
        path: 'cart', 
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'favorites', 
        element: (
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'profile', 
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'orders', 
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'checkout', 
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ) 
      },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'api/v1/auth/verify-email', element: <VerifyEmail /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'menu', element: <AdminMenu /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'riders', element: <AdminRiders /> },
    ],
  },
  {
    path: '/rider',
    element: (
      <ProtectedRoute allowedRoles={['rider']}>
        <RiderLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <RiderDashboard /> },
      { path: 'orders', element: <RiderOrders /> },
      { path: 'history', element: <RiderHistory /> },
      { path: 'settings', element: <RiderSettings /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
