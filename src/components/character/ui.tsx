import React from 'react';

export const StudioButton: React.FC<{
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
      active
        ? 'bg-indigo-600 text-white shadow'
        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
    }`}
  >
    {children}
  </button>
);

export const StudioSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="space-y-2 mb-4">
    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
      {title}
    </div>
    {children}
  </div>
);
