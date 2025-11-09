'use client';

import { useAppStore } from '@/store/useAppStore';
import {
  Sun,
  User,
  Settings,
  LogOut,
  FolderOpen
} from 'lucide-react';

interface SidebarProps {
  onViewCases?: () => void;
}

export const Sidebar = ({ onViewCases }: SidebarProps) => {
  const { createNewCase } = useAppStore();

  return (
    <div className="w-64 bg-gray-50 h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          <span style={{ color: '#38b6ff' }}>Salu</span>
          <span style={{ color: '#000000' }}>Link</span>
        </h1>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="space-y-1">
          {/* New Case Button */}
          <button
            onClick={createNewCase}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-200 rounded-lg transition-colors text-sm"
          >
            + New Case
          </button>

          {/* View Cases Button */}
          <button
            onClick={onViewCases}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-200 rounded-lg transition-colors text-sm"
          >
            <FolderOpen className="w-5 h-5" />
            View All Cases
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
          <Sun className="w-5 h-5" />
          <span className="text-sm">Light mode</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
          <User className="w-5 h-5" />
          <span className="text-sm">My account</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-sm">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Log out</span>
        </button>
      </div>
    </div>
  );
};

