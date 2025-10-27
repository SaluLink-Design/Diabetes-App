'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
  Plus,
  Eye,
  Trash2,
  Sun,
  User,
  ArrowUpRight,
  LogOut,
  ChevronRight,
  ChevronDown
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
    <div className="w-[282px] bg-[#F2F2F2] border-r border-[rgba(28,28,28,0.1)] h-screen flex flex-col justify-between">
      {/* Main Navigation */}
      <div className="w-[282px] h-[236px] p-5 flex flex-col items-start gap-1">
        <div className="flex flex-col gap-3 w-full mt-[53px]">
          {/* New Case Button */}
          <button
            onClick={createNewCase}
            className="flex w-[242px] px-4 py-2 justify-center items-center gap-2 rounded-[12px] bg-[#1C1C1C] h-10 relative hover:bg-black transition-colors"
          >
            <Plus className="w-[14px] h-[14px] text-white fill-white" strokeWidth={3} />
            <span className="text-white text-center font-[Inter] text-[18px] font-normal leading-6">New Case</span>
          </button>

          {/* View Cases Button */}
          <button
            onClick={() => setShowCases(!showCases)}
            className="flex w-[242px] px-4 py-2 justify-center items-center gap-2 rounded-[12px] bg-[#1C1C1C] h-10 relative hover:bg-black transition-colors"
          >
            <Eye className="w-[15px] h-[14px] text-white" strokeWidth={2.5} />
            <span className="text-white text-center font-[Inter] text-[18px] font-normal leading-6">View Cases</span>
          </button>

          {/* Cases List */}
          {showCases && (
            <div className="ml-4 space-y-1 max-h-64 overflow-y-auto">
              {savedCases.length === 0 ? (
                <p className="text-sm text-black/60 px-3 py-2">No saved cases</p>
              ) : (
                savedCases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="group flex items-center justify-between px-3 py-2 text-sm text-black hover:bg-black/5 rounded-lg cursor-pointer transition-colors"
                    onClick={() => handleLoadCase(caseItem.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-[14px]">
                        {caseItem.confirmedCondition || 'Untitled Case'}
                      </p>
                      <p className="text-xs text-black/60">
                        {new Date(caseItem.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteCase(caseItem.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity"
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
      <div className="w-[282px] px-5 py-5 flex flex-col items-start gap-1 border-t border-[rgba(28,28,28,0.1)]">
        <button className="flex px-3 py-3 items-center gap-3 self-stretch rounded-lg hover:bg-black/5 transition-colors">
          <Trash2 className="w-6 h-6 text-black" strokeWidth={1.5} />
          <span className="text-black font-[Inter] text-[14px] font-normal leading-5 flex-1">Clear conversations</span>
        </button>
        <button className="flex px-3 py-3 items-center gap-3 self-stretch rounded-lg hover:bg-black/5 transition-colors">
          <Sun className="w-6 h-6 text-black" strokeWidth={1.5} />
          <span className="text-black font-[Inter] text-[14px] font-normal leading-5 flex-1">Light mode</span>
        </button>
        <button className="flex px-3 py-3 items-center gap-3 self-stretch rounded-lg hover:bg-black/5 transition-colors">
          <User className="w-6 h-6 text-black" strokeWidth={1.5} />
          <span className="text-black font-[Inter] text-[14px] font-normal leading-5 flex-1">My account</span>
        </button>
        <button className="flex px-3 py-3 items-center gap-3 self-stretch rounded-lg hover:bg-black/5 transition-colors">
          <ArrowUpRight className="w-6 h-6 text-black" strokeWidth={1.5} />
          <span className="text-black font-[Inter] text-[14px] font-normal leading-5 flex-1">Updates & FAQ</span>
        </button>
        <button className="flex px-3 py-3 items-center gap-3 self-stretch rounded-lg hover:bg-black/5 transition-colors">
          <LogOut className="w-6 h-6 text-black" strokeWidth={1.5} />
          <span className="text-black font-[Inter] text-[14px] font-normal leading-5 flex-1">Log out</span>
        </button>
      </div>
    </div>
  );
};

