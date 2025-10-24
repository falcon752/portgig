import React from 'react';
import { Bell, Menu } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

interface SuperAdminHeaderProps {
  activeTab: string;
  menuItems: MenuItem[];
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SuperAdminHeader: React.FC<SuperAdminHeaderProps> = ({ 
  activeTab, 
  menuItems, 
  setSidebarOpen 
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            className="text-gray-600 hover:text-gray-900 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <p className="text-sm text-gray-600">
              Manage Portgig with super admin controls
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            className="relative text-gray-600 hover:text-gray-900"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;