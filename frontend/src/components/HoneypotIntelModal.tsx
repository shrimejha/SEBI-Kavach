import React, { useState, useEffect } from 'react';

interface HarvestedItem {
  id: string;
  channel_name: string;
  extracted_upi_ids: string[];
  extracted_phones: string[];
  extracted_urls: string[];
  scam_category: string;
  baiting_summary: string;
  timestamp: string;
}

interface HoneypotIntelModalProps {
  onClose: () => void;
}

export const HoneypotIntelModal: React.FC<HoneypotIntelModalProps> = ({ onClose }) => {
  const [intelList, setIntelList] = useState<HarvestedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').replace(/\/+$/, '');

  useEffect(() => {
    fetchIntel();
  }, []);

  const fetchIntel = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/v1/honeypot/intel`);
      if (res.ok) {
        const data = await res.json();
        setIntelList(data);
      }
    } catch (e) {
      console.warn('Error fetching honeypot intel:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-panel bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 max-w-3xl w-full border border-amber-500/30 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5eeff] dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-2xl">bug_report</span>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#0b1c30] dark:text-white">AI Honeypot Intelligence</h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">Automated Gemini 3.6 Telegram / WhatsApp Scam-Baiting</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#76777d] hover:text-[#0b1c30] dark:hover:text-white rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-xl mt-0.5">smart_toy</span>
          <p className="text-xs text-[#0b1c30] dark:text-slate-300">
            Passive Gemini 3.6 bot personas automatically engage scammers in flagged public Telegram/WhatsApp channels,
            persuading scammers to reveal payment <strong>UPI IDs</strong>, <strong>escrow bank accounts</strong>, and <strong>phone numbers</strong>.
          </p>
        </div>

        {/* Intelligence List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[#76777d]">Loading harvested intelligence...</div>
        ) : intelList.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#76777d]">No harvested scammer credentials logged yet.</div>
        ) : (
          <div className="space-y-4">
            {intelList.map((item) => (
              <div key={item.id} className="p-5 bg-[#f8f9ff] dark:bg-slate-800 rounded-xl border border-[#c6c6cd]/30 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e5eeff] dark:border-slate-700 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">{item.scam_category}</span>
                    <h4 className="text-sm font-extrabold text-[#0b1c30] dark:text-white">{item.channel_name}</h4>
                  </div>
                  <span className="text-[11px] font-mono text-[#76777d] dark:text-slate-400">{item.timestamp}</span>
                </div>

                <p className="text-xs text-[#45464d] dark:text-slate-300 italic">{item.baiting_summary}</p>

                {/* Harvested Credentials Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-[#e5eeff] dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold text-[#ba1a1a] uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">account_balance_wallet</span>
                      Harvested Scammer UPI IDs
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.extracted_upi_ids.map((upi, i) => (
                        <span key={i} className="px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded font-mono text-[11px] font-bold">
                          {upi}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-[#e5eeff] dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">call</span>
                      Harvested Phone Numbers
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.extracted_phones.map((ph, i) => (
                        <span key={i} className="px-2 py-0.5 bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 rounded font-mono text-[11px] font-bold">
                          {ph}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#0b1c30] dark:bg-sky-600 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors"
          >
            Close Intelligence Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
