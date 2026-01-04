
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const data = [
  { name: '1950', amount: 2 },
  { name: '1970', amount: 35 },
  { name: '1990', amount: 120 },
  { name: '2010', amount: 310 },
  { name: '2020', amount: 460 },
  { name: '2040 (Est)', amount: 800 },
];

const plasticTypes = [
  { name: 'Polyethylene (PE)', value: 34, color: '#0ea5e9' },
  { name: 'Polypropylene (PP)', value: 19, color: '#0284c7' },
  { name: 'PVC', value: 16, color: '#0369a1' },
  { name: 'PET', value: 7, color: '#075985' },
  { name: 'Other Plastics', value: 24, color: '#0c4a6e' },
];

const ImpactVisualization: React.FC = () => {
  return (
    <div className="p-8 md:p-12 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-sky-900 mb-2">Global Impact Data</h2>
          <p className="text-gray-500">Visualizing the scale of marine plastic pollution over time.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-sky-900 text-sm mb-6 flex items-center justify-between">
              Global Plastic Production
              <span className="text-[10px] text-gray-400 font-normal italic">Millions of Tons/Year</span>
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f9ff" />
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-sky-900 text-sm mb-6">Plastic Types in Oceans</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={plasticTypes}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {plasticTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-sky-50 rounded-3xl p-8 border border-sky-100">
          <h3 className="text-xl font-bold text-sky-900 mb-4">Key Takeaways for Students</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <div className="text-3xl">💹</div>
              <h4 className="font-bold text-sky-800 text-sm">Exponential Growth</h4>
              <p className="text-xs text-gray-600">Production has grown 200x since 1950, outpacing waste management systems.</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-3xl">♻️</div>
              <h4 className="font-bold text-sky-800 text-sm">Low Recycling Rates</h4>
              <p className="text-xs text-gray-600">Only 9% of all plastic ever made has been recycled. The rest is in landfills or nature.</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-3xl">⏳</div>
              <h4 className="font-bold text-sky-800 text-sm">Forever Presence</h4>
              <p className="text-xs text-gray-600">Common plastics like PET bottles take 450 years to decompose in the ocean.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactVisualization;
