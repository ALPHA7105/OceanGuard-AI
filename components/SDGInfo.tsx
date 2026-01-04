
import React from 'react';

const SDGInfo: React.FC = () => {
  return (
    <div className="p-8 md:p-12 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto">
        <span className="inline-block px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          United Nations Global Goal
        </span>
        <h2 className="text-4xl font-extrabold text-sky-900 mb-6">
          Sustainable Development Goal 14: <br/>
          <span className="text-sky-600">Life Below Water</span>
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          The ocean drives global systems that make the Earth habitable for humankind. 
          Our rainwater, drinking water, weather, climate, coastlines, much of our food, 
          and even the oxygen in the air we breathe, are all ultimately provided and regulated by the sea.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
            <h3 className="font-bold text-sky-900 mb-2 flex items-center gap-2">
              <span className="text-xl">🛡️</span> Marine Conservation
            </h3>
            <p className="text-sm text-gray-600">
              Over 3 billion people depend on marine and coastal biodiversity for their livelihoods. 
              Conserving our oceans is a necessity for the survival of humanity.
            </p>
          </div>
          <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
            <h3 className="font-bold text-rose-900 mb-2 flex items-center gap-2">
              <span className="text-xl">⚠️</span> Plastic Pollution
            </h3>
            <p className="text-sm text-gray-600">
              An estimated 8 million metric tons of plastic enter our oceans every year. 
              By 2050, there could be more plastic in the ocean than fish (by weight).
            </p>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden h-64 mb-12">
          <img 
            src="https://picsum.photos/seed/ocean/1200/600" 
            alt="Beautiful Marine Life" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <p className="text-white font-medium text-lg italic">
              "We are at a tipping point. Every action you take to reduce plastic waste matters."
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <h3 className="text-xl font-bold text-sky-900 mb-4">How AI Helps</h3>
          <p className="text-gray-600 mb-6">
            In this lesson, you will use Gemini AI to identify marine pollution. 
            AI helps researchers monitor large coastal areas quickly, identifying plastic debris 
            before it breaks down into harmful microplastics.
          </p>
          <ul className="space-y-3">
            {[
              "Automated shoreline monitoring using satellites and drones.",
              "Identifying different types of waste for better recycling strategies.",
              "Mapping high-risk areas for debris accumulation.",
              "Educating students like you on environmental impact."
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="text-sky-500 mt-1">●</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SDGInfo;
