import React from 'react';
import { useCampus } from '../context/CampusContext';
import { AlertOctagon, X } from 'lucide-react';

export default function EmergencyBanner() {
  const { emergencyAlert, dismissEmergency } = useCampus();

  if (!emergencyAlert) return null;

  return (
    <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 border-b border-red-500/60 px-4 py-2.5 text-white sticky top-0 z-50 animate-pulse">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center space-x-3">
          <div className="p-1 rounded bg-red-600 text-white font-black text-[10px] tracking-wider uppercase animate-bounce">
            EMERGENCY BROADCAST
          </div>
          <AlertOctagon className="w-5 h-5 text-amber-300 flex-shrink-0" />
          <span className="font-bold text-amber-200">{emergencyAlert.title}:</span>
          <span className="text-slate-100">{emergencyAlert.message}</span>
          <span className="text-[11px] text-amber-300/80 font-mono">({emergencyAlert.timestamp})</span>
        </div>
        <button
          onClick={dismissEmergency}
          className="p-1 text-slate-300 hover:text-white rounded hover:bg-red-800/50 transition-colors"
          title="Dismiss Alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

