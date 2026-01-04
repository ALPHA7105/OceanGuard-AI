
import React, { useState, useRef } from 'react';
import { detectPollution } from '../services/geminiService';
import { DetectionResult } from '../types';

const PollutionDetector: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const data = await detectPollution(base64Data);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-8 md:p-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-sky-900 mb-2">Marine Pollution Detection</h2>
          <p className="text-gray-500">Upload a sample image of marine waste or a beach to see AI in action.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Upload Section */}
          <div className="space-y-6">
            <div 
              className={`relative border-2 border-dashed rounded-3xl overflow-hidden aspect-square flex flex-col items-center justify-center transition-all duration-300 ${
                image ? 'border-sky-400 bg-sky-50' : 'border-gray-300 hover:border-sky-300 hover:bg-sky-50/50'
              }`}
            >
              {image ? (
                <>
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={reset}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <div 
                  className="p-10 text-center cursor-pointer w-full h-full flex flex-col items-center justify-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-4 text-3xl">
                    📸
                  </div>
                  <p className="font-bold text-sky-900 mb-1">Upload Photo</p>
                  <p className="text-sm text-gray-500">JPG, PNG up to 10MB</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </div>

            <div className="flex gap-4">
              <button
                disabled={!image || loading}
                onClick={analyzeImage}
                className="flex-grow bg-sky-600 hover:bg-sky-700 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-sky-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    AI Analyzing...
                  </>
                ) : (
                  <>
                    <span>🚀</span> Run AI Analysis
                  </>
                )}
              </button>
              {image && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold p-4 rounded-2xl transition-all"
                  title="Change Image"
                >
                  🔄
                </button>
              )}
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl text-sm flex items-center gap-3">
                <span>❌</span> {error}
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="flex flex-col h-full">
            {!result && !loading && (
              <div className="flex-grow flex flex-col items-center justify-center border border-gray-100 rounded-3xl bg-gray-50/50 p-10 text-center text-gray-400">
                <div className="text-5xl mb-4">🧬</div>
                <p className="text-sm font-medium">Detection results will appear here after analysis.</p>
              </div>
            )}

            {loading && (
              <div className="flex-grow flex flex-col items-center justify-center border border-sky-100 rounded-3xl bg-sky-50/30 p-10 text-center">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 bg-sky-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-3 h-3 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
                <p className="text-sky-700 font-bold mb-1">Analyzing Marine Sample</p>
                <p className="text-xs text-sky-500 uppercase tracking-widest font-semibold">Gemini AI Model is working...</p>
              </div>
            )}

            {result && (
              <div className="flex-grow space-y-6 animate-in fade-in duration-500">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sky-900 uppercase tracking-widest text-xs">AI Findings</h3>
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                      result.severity === 'high' ? 'bg-rose-100 text-rose-700' :
                      result.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {result.severity} Severity
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {result.detectedItems.map((item, i) => (
                      <span key={i} className="bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-xs font-semibold border border-sky-100">
                        #{item.replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed italic border-l-4 border-sky-200 pl-4 mb-6">
                    "{result.description}"
                  </p>

                  <h4 className="font-bold text-sky-900 text-sm mb-3 flex items-center gap-2">
                    <span>🌱</span> Conservation Actions
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                        <span className="text-sky-500 font-bold">✓</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-sky-900 p-6 rounded-2xl text-white">
                  <h4 className="font-bold mb-2 text-sm">Student Mission</h4>
                  <p className="text-xs opacity-80 leading-relaxed">
                    By identifying these pollutants, we can map out clean-up priorities. 
                    Your next step: Share this data with your local environmental club!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollutionDetector;
