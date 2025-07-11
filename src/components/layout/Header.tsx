import React from 'react';
import { Bell, Sun, Moon, Search, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { Button } from '../ui/Button';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, isAuthenticated, logout } = useUser();

  return (
    <header
      className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-3 px-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search inventory..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger-500"></span>
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {currentUser?.role.charAt(0).toUpperCase() + currentUser?.role.slice(1)}
                </p>
              </div>
              <div className="relative">
                <button className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors duration-200">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt="User avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                      <User size={16} className="text-gray-600 dark:text-gray-400" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => window.location.href = '/login'}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};