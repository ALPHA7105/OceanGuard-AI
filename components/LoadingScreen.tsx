
import React, { useEffect, useState } from 'react';
import { helix } from 'ldrs';

// Register the custom element
if (typeof window !== 'undefined') {
  helix.register();
}

// Fix: Augment global JSX namespace with the correct types to match expected element definitions
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'l-helix': {
        size?: string | number;
        color?: string | number;
        speed?: string | number;
      };
    }
  }
}

const LoadingScreen: React.FC = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-sky-950 via-sky-900 to-sky-950 transition-opacity duration-700 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative flex flex-col items-center">
        {/* Pulsing Glow Effect */}
        <div className="absolute inset-0 bg-sky-400/20 blur-3xl rounded-full animate-pulse scale-150"></div>
        
        {/* SDG 14 Icon */}
        <div className="relative w-24 h-24 bg-sky-600 rounded-2xl flex items-center justify-center text-white text-5xl font-black shadow-2xl mb-12 animate-bounce">
          14
        </div>
        
        <div className="text-center relative flex flex-col items-center">
          <h1 className="text-white text-2xl font-bold tracking-[0.2em] uppercase mb-2">
            OceanGuard <span className="text-sky-400">AI</span>
          </h1>
          <p className="text-sky-300/60 text-xs font-medium tracking-widest uppercase mb-10">
            Protecting Life Below Water
          </p>
          
          {/* Advanced Helix Loader */}
          <div className="relative">
             <l-helix
              size="60"
              speed="2.5" 
              color="#38bdf8" 
            ></l-helix>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
