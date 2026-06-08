import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AIAssistant from '../components/AIAssistant';

const MainLayout = () => {
  const { pathname } = useLocation();
  const normalizedPath = pathname !== '/' ? pathname.replace(/\/+$/, '') : pathname;
  const isAuthPage = normalizedPath === '/login' || normalizedPath === '/signup';

  return (
    <div className="flex flex-col min-h-screen bg-app-bg-light transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isAuthPage && <AIAssistant />}
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default MainLayout;
