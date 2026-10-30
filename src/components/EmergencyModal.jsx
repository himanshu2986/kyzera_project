import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { AlertTriangle, Send, X, ShieldAlert } from 'lucide-react';

export default function EmergencyModal({ isOpen, onClose }) {
  const { broadcastEmergency } = useCampus();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('Urgent');

  if (!isOpen) return null;

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    broadcastEmergency(title, message, severity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#121826] border border-red-500/50 rounded-2xl w-full max-w-lg p-6 shadow-glow-red relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-red-500/20 text-red-400 rounded-xl border border-red-500/40">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Campus-Wide Emergency Broadcast</h3>
            <p className="text-xs text-red-300">
              Immediate push to all active campus portal headers and mobile banners.
            </p>
          </div>
        </div>

        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Broadcast Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Critical Water Shutdown - Hostel Block C"
              required
              className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Alert Severity Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Urgent', 'Life Safety', 'Advisory'].map((sev) => (
                <button
                  type="button"
                  key={sev}
                  onClick={() => setSeverity(sev)}
                  className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    severity === sev
                      ? 'bg-red-600/30 border-red-500 text-red-200'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Incident Message & Action Plan
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Maintenance emergency crews are replacing the 40A booster pump contactor. Water supply will be suspended between 2:00 PM and 4:00 PM today. Alternate water tankers stationed at Quad 2."
              required
              className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-glow-red transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast to Campus</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

