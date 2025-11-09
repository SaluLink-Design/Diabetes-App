'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  FileText, 
  Trash2, 
  Sun, 
  User, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  FolderOpen
} from 'lucide-react';

export const Sidebar = () => {
  const { savedCases, loadCase, deleteCase, createNewCase } = useAppStore();
  const [showCases, setShowCases] = useState(false);

  const handleLoadCase = (caseId: string) => {
    loadCase(caseId);
    setShowCases(false);
  };

  const handleDeleteCase = (caseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this case?')) {
      deleteCase(caseId);
    }
  };

  return (
    <div className="w-72 glass border-r border-white/20 h-screen flex flex-col shadow-xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">SaluLink</h1>
            <p className="text-xs text-gray-600">Chronic Treatment App</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {/* New Case Button */}
          <button
            onClick={createNewCase}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-white/60 rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">New Case</span>
          </button>

          {/* View Cases Button */}
          <button
            onClick={() => setShowCases(!showCases)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-gray-700 hover:bg-white/60 rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <FolderOpen className="w-5 h-5" />
              <span className="font-medium">View Cases</span>
            </div>
            <ChevronRight
              className={`w-4 h-4 transition-transform ${
                showCases ? 'rotate-90' : ''
              }`}
            />
          </button>

          {/* Cases List */}
          {showCases && (
            <div className="ml-4 space-y-1 max-h-64 overflow-y-auto">
              {savedCases.length === 0 ? (
                <p className="text-sm text-gray-500 px-4 py-2">No saved cases</p>
              ) : (
                savedCases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="group flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-white/60 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
                    onClick={() => handleLoadCase(caseItem.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {caseItem.confirmedCondition || 'Untitled Case'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(caseItem.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteCase(caseItem.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-lg transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-white/20 p-4 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-white/60 rounded-xl transition-all duration-200 hover:shadow-md">
          <Sun className="w-5 h-5" />
          <span className="text-sm">Light mode</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-white/60 rounded-xl transition-all duration-200 hover:shadow-md">
          <User className="w-5 h-5" />
          <span className="text-sm">My account</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-white/60 rounded-xl transition-all duration-200 hover:shadow-md">
          <HelpCircle className="w-5 h-5" />
          <span className="text-sm">Updates & FAQ</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-white/60 rounded-xl transition-all duration-200 hover:shadow-md">
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Log out</span>
        </button>
      </div>
    </div>
  );
};

