import React from 'react';
import { useCampus } from '../context/CampusContext';
import { ShieldCheck, PhoneCall, ExternalLink, Lock } from 'lucide-react';

export default function Footer() {
  const { navigateTo } = useCampus();

  return (
    <footer className="bg-[#070a10] border-t border-[#1a2333] text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-glow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">Kyzera</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The official live resolution and governance hub connecting students, faculty, and university leadership with verified SSO, AI clustering, and zero-knowledge anonymity.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>FERPA & Campus Data Charter §4.2 Compliant Vault</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateTo('submit')} className="hover:text-blue-400 transition-colors">
                  Submit Grievance
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('dashboard')} className="hover:text-blue-400 transition-colors">
                  Live Public Feed
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('admin')} className="hover:text-blue-400 transition-colors">
                  Campus Governance Command
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('duplicate-cluster', 'CL-882')} className="hover:text-blue-400 transition-colors">
                  Incident Impact Clusters
                </button>
              </li>
            </ul>
          </div>

          {/* Governance & Privacy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Governance & Privacy</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateTo('privacy-audit')} className="hover:text-blue-400 transition-colors">
                  Identity Access Audit Log
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('login')} className="hover:text-blue-400 transition-colors">
                  Zero-Knowledge SSO Specs
                </button>
              </li>
              <li>
                <span className="hover:text-blue-400 cursor-pointer">
                  Whistleblower Protection Policy
                </span>
              </li>
              <li>
                <span className="hover:text-blue-400 cursor-pointer">
                  Campus Ethics Board Charter
                </span>
              </li>
            </ul>
          </div>

          {/* Emergency Hotlines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center space-x-1.5">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Emergency Hotlines</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-tight">
              For active fires, leaks, or life-safety emergencies, contact dispatch directly:
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Campus Police:</span>
                <span className="font-mono font-bold text-slate-200">(800) 555-0101</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Medical Center:</span>
                <span className="font-mono font-bold text-slate-200">(800) 555-0102</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Facilities Rapid:</span>
                <span className="font-mono font-bold text-slate-200">(800) 555-0109</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-slate-300 font-semibold">Kyzera</span>
            <span>•</span>
            <span>Campus Grievance &amp; Accountability Registry</span>
          </div>
          <div>
            © 2025 Kyzera University Student Affairs & IT Services. Encrypted & Audited.
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-300 cursor-pointer">System Status</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Terms</span>
            <span className="hover:text-slate-300 cursor-pointer">IT Help Desk</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

