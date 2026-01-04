
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SDGInfo from './components/SDGInfo';
import PollutionDetector from './components/PollutionDetector';
import ImpactVisualization from './components/ImpactVisualization';
import LoadingScreen from './components/LoadingScreen';
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.LEARN);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Simulate initial loading sequence
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 2500); // Slightly longer than the LoadingScreen internal timer for smooth handover
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.LEARN:
        return <SDGInfo />;
      case AppTab.DETECT:
        return <PollutionDetector />;
      case AppTab.IMPACT:
        return <ImpactVisualization />;
      default:
        return <SDGInfo />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      {isInitializing && <LoadingScreen />}
      
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px]">
          {renderContent()}
        </div>
      </main>

      <footer className="bg-sky-900 text-sky-100 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌊</span>
            <span className="font-bold text-xl">OceanGuard AI</span>
          </div>
          <p className="text-sm opacity-75">
            Designed for Students | Educational Tool for SDG 14 Conservation
          </p>
          <div className="flex gap-4 text-xs font-medium uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Resources</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
