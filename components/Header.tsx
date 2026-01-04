
import React from 'react';
import { AppTab } from '../types';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: AppTab.LEARN, label: 'Learn SDG 14', icon: '📖' },
    { id: AppTab.DETECT, label: 'Detect Pollution', icon: '🔍' },
    { id: AppTab.IMPACT, label: 'Global Impact', icon: '🌏' },
  ];

  return (
    <header className="bg-white border-b border-sky-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
            14
          </div>
          <div>
            <h1 className="text-xl font-bold text-sky-900 leading-none">OceanGuard</h1>
            <p className="text-xs text-sky-500 font-medium tracking-tight">SDG 14: LIFE BELOW WATER</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-sky-100 text-sky-700 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <button 
           onClick={() => setActiveTab(AppTab.DETECT)}
           className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-sky-200 transition-all active:scale-95"
        >
          Start AI Analysis
        </button>
      </div>
    </header>
  );
};

export default Header;
