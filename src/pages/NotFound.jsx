import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Button from '../components/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <h1 className="text-[150px] font-black text-gray-100 dark:text-gray-800 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-primary p-6 rounded-3xl rotate-12 shadow-2xl">
              <Search className="h-16 w-16 text-white -rotate-12" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4 relative z-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Oops! Page not found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Go Back
          </Button>
          <Button 
            onClick={() => navigate('/')}
            className="flex items-center"
          >
            <Home className="mr-2 h-5 w-5" /> Back to Home
          </Button>
        </div>

        <div className="pt-12">
          <p className="text-sm text-gray-500">
            Need help? <button className="text-primary font-bold hover:underline">Contact Support</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
