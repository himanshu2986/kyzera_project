import React from 'react';
import { X, ZoomIn, ShieldCheck, Download } from 'lucide-react';

export default function LightboxModal({ isOpen, onClose, imageTitle, imageUrl }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#101726] border border-slate-700 rounded-2xl max-w-2xl w-full p-4 relative shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">
              Verified Evidence: {imageTitle || 'Incident Evidence Photo'}
            </span>
            <span className="text-[10px] text-blue-400 font-mono bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded">
              SHA-256 HASH VERIFIED
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Evidence Visual: Real photo if available, or telemetry diagram */}
        <div className="my-4 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-3 flex flex-col items-center justify-center min-h-[300px] relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageTitle}
              className="max-h-[460px] w-auto max-w-full rounded-lg object-contain shadow-2xl"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="w-44 h-44 rounded-full border-4 border-slate-700 bg-slate-900 flex flex-col items-center justify-center shadow-inner relative mb-4">
                <div className="absolute inset-2 rounded-full border border-dashed border-red-500/50 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-black text-red-500 font-mono">0.0</span>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">PSI / BAR</span>
                  </div>
                </div>
                <div className="w-1 h-16 bg-red-500 origin-bottom transform -rotate-45 rounded-full absolute bottom-1/2"></div>
                <div className="w-4 h-4 bg-white rounded-full z-10 border-2 border-red-600"></div>
              </div>
              <p className="text-xs font-semibold text-red-400">
                Telemetry Alert: Zero Hydraulic Pressure Detected
              </p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-md">
                Hostel Block C Mechanical Room • Sensor ID #PS-884
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          <span>Metadata: Verified Visual Evidence • Kyzera SHA-256 Integrity Seal</span>
          {imageUrl && (
            <a
              href={imageUrl}
              download={imageTitle || 'kyzera-evidence.png'}
              className="flex items-center space-x-1.5 text-blue-400 hover:text-blue-300 font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Evidence File</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

