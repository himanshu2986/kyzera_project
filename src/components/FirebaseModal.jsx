import React, { useState } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Flame,
  Save,
  Trash2,
  Copy,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  getStoredFirebaseConfig,
  saveFirebaseConfig,
  clearFirebaseConfig,
  isFirebaseReady
} from '../services/firebase';

export default function FirebaseModal({ isOpen, onClose, onConfigUpdated }) {
  const [config, setConfig] = useState(() => getStoredFirebaseConfig());
  const [connected, setConnected] = useState(() => isFirebaseReady());
  const [statusMsg, setStatusMsg] = useState(
    isFirebaseReady()
      ? 'Firebase Cloud Firestore is actively connected.'
      : 'Currently operating in Local Mode. Enter your Firebase project credentials below to enable live cloud synchronization.'
  );

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value.trim() }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!config.apiKey || !config.projectId) {
      setStatusMsg('Please provide at least the Firebase API Key and Project ID.');
      return;
    }

    const success = saveFirebaseConfig(config);
    setConnected(success);
    if (success) {
      setStatusMsg('Successfully connected to Firebase Cloud Firestore! Real-time syncing is active.');
      if (onConfigUpdated) onConfigUpdated(true);
    } else {
      setStatusMsg('Configuration saved, but could not connect to Firestore. Verify project credentials.');
    }
  };

  const handleDisconnect = () => {
    clearFirebaseConfig();
    setConfig({
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: ''
    });
    setConnected(false);
    setStatusMsg('Disconnected from Firebase. Kyzera has reverted to high-speed Local Mode.');
    if (onConfigUpdated) onConfigUpdated(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#101726] border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-950/30 to-orange-950/30">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Connect Firebase Cloud Firestore</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  connected
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {connected ? '● LIVE CONNECTED' : '○ LOCAL MODE'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time multi-user cloud synchronization for complaints and admin audits.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Notification Banner */}
        <div className={`px-5 py-2.5 text-xs font-medium flex items-center space-x-2 border-b ${
          connected
            ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
            : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}>
          {connected ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <Database className="w-4 h-4 text-amber-400 flex-shrink-0" />
          )}
          <span className="leading-tight">{statusMsg}</span>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-xs">
          
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 space-y-1.5">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span>Where to get your Firebase configuration:</span>
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-orange-400 hover:text-orange-300 flex items-center space-x-1 font-mono text-[11px]"
              >
                <span>Firebase Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] leading-relaxed">
              In your Firebase Console, open <strong className="text-white">Project Settings &gt; General &gt; Your Apps &gt; Web App</strong>, then copy the SDK config values into the fields below.
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                API Key <span className="text-orange-400">*</span>
              </label>
              <input
                type="text"
                value={config.apiKey}
                onChange={(e) => handleChange('apiKey', e.target.value)}
                placeholder="AIzaSyA..."
                className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Project ID <span className="text-orange-400">*</span>
              </label>
              <input
                type="text"
                value={config.projectId}
                onChange={(e) => handleChange('projectId', e.target.value)}
                placeholder="kyzera-campus-app"
                className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Auth Domain</label>
              <input
                type="text"
                value={config.authDomain}
                onChange={(e) => handleChange('authDomain', e.target.value)}
                placeholder="kyzera-campus-app.firebaseapp.com"
                className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Storage Bucket</label>
              <input
                type="text"
                value={config.storageBucket}
                onChange={(e) => handleChange('storageBucket', e.target.value)}
                placeholder="kyzera-campus-app.appspot.com"
                className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Messaging Sender ID</label>
              <input
                type="text"
                value={config.messagingSenderId}
                onChange={(e) => handleChange('messagingSenderId', e.target.value)}
                placeholder="10482910492"
                className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">App ID</label>
              <input
                type="text"
                value={config.appId}
                onChange={(e) => handleChange('appId', e.target.value)}
                placeholder="1:10482910492:web:9fa48..."
                className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            {connected ? (
              <button
                type="button"
                onClick={handleDisconnect}
                className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-800/60 text-red-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Disconnect Firebase</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-500 font-mono">
                No keys stored yet
              </span>
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-xs font-bold shadow-glow-sm flex items-center space-x-1.5 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save &amp; Connect</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}

