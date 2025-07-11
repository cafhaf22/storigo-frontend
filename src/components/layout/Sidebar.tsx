import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Upload, Users, Menu, X, ChevronRight, QrCode } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [expanded, setExpanded] = useState(true);
  const { theme } = useTheme();
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Package size={20} />, label: 'Inventory', path: '/inventory' },
    { icon: <QrCode size={20} />, label: 'QR & Barcodes', path: '/qr-barcodes' },
    { icon: <Upload size={20} />, label: 'Import', path: '/import' },
    { icon: <Users size={20} />, label: 'Users', path: '/users' },
  ];

  return (
    <div
      className={twMerge(
        'h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col',
        expanded ? 'w-64' : 'w-20',
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div className={`flex items-center ${expanded ? '' : 'justify-center w-full'}`}>
          <div className="flex-shrink-0 flex items-center justify-center bg-primary-500 text-white p-2 rounded-md">
            <Package size={20} />
          </div>
          {expanded && (
            <h1 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
              Storigo
            </h1>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className={`text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 ${
            expanded ? '' : 'hidden'
          }`}
        >
          {expanded ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className={`mt-6 flex-1 flex flex-col ${expanded ? 'px-4' : 'px-2'}`}>
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    twMerge(
                      'flex items-center py-2 px-3 rounded-md transition-colors duration-200',
                      isActive
                        ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                      !expanded && 'justify-center'
                    )
                  }
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {expanded && <span className="ml-3">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {!expanded && (
        <button
          onClick={toggleSidebar}
          className="mx-auto mb-4 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
};