"use client";

import React from "react";
import { Search, SlidersHorizontal, Download, Bell, Upload } from "lucide-react";

interface TopHeaderProps {
  onOpenUpload: () => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenUpload,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-40 flex items-center justify-between shadow-sm">
      {/* Search Input Bar */}
      <div className="relative w-full max-w-md">
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm transition-all"
        >
          <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Upload Raw CSV</span>
        </button>
      </div>
    </header>
  );
};
