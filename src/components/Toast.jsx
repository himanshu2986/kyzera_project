import React from 'react';
import { useCampus } from '../context/CampusContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useCampus();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let colorClass = 'border-emerald-500/50 bg-[#0f1d19] text-emerald-200';
        let iconColor = 'text-emerald-400';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClass = 'border-red-500/50 bg-[#241315] text-red-200';
          iconColor = 'text-red-400';
        } else if (toast.type === 'warning') {
          Icon = AlertCircle;
          colorClass = 'border-amber-500/50 bg-[#251e12] text-amber-200';
          iconColor = 'text-amber-400';
        } else if (toast.type === 'info') {
          Icon = Info;
          colorClass = 'border-blue-500/50 bg-[#101b2f] text-blue-200';
          iconColor = 'text-blue-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start space-x-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all transform translate-y-0 opacity-100 ${colorClass}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-xs font-medium leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

