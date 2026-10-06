import { useState, Fragment } from 'react';
import { HoneypotIntelModal } from '../components/HoneypotIntelModal';

const ScamRadarFeed = () => {
  const [showHoneypotModal, setShowHoneypotModal] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newThreat, setNewThreat] = useState({ type: 'Video Deepfake', target: '', channel: 'Telegram', content: '' });
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const [scams, setScams] = useState([
    {
      id: 1,
      type: 'Video Deepfake',
      target: 'NSE CEO Impersonation',
      channel: 'YouTube Shorts',
      date: '2026-07-12',
      status: 'Takedown Requested',
      evidence: {
        type: 'video',
        content: 'AI-generated video of NSE CEO promoting a suspicious penny stock. Lip-sync delay and spatial boundaries around face contain ViT neural network artifacts. Traced back to offshore domain.'
      }
    },
    {
      id: 2,
      type: 'Text/Phishing',
      target: 'Guaranteed Returns Scheme',
      channel: 'WhatsApp Groups',
      date: '2026-07-11',
      status: 'Active Alert',
      evidence: {
        type: 'text',
        content: '"URGENT: SEBI approved 200% guaranteed returns on new NIFTY options. Click here to join VIP group before link expires: sebi-alert-urgent.com/join"'
      }
    },
    {
      id: 3,
      type: 'Voice Clone',
      target: 'Broker Helpdesk Spoof',
      channel: 'Phone Call',
      date: '2026-07-10',
      status: 'Resolved',
      evidence: {
        type: 'audio',
        content: '[Transcript] "Hello, this is Zerodha support. We detected unusual activity. Please share your OTP to block the unauthorized transaction." (Spectral analysis confirmed AI voice generation, pitch variance 92% synthetic).'
      }
    }
  ]);

  const handleAddThreat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreat.target || !newThreat.content) return;
    const created = {
      id: Date.now(),
      type: newThreat.type,
      target: newThreat.target,
      channel: newThreat.channel,
      date: new Date().toISOString().split('T')[0],
      status: 'Under Review',
      evidence: {
        type: newThreat.type.toLowerCase().includes('voice') ? 'audio' : 'text',
        content: newThreat.content,
      }
    };
    setScams([created, ...scams]);
    setSubmissionSuccess(true);
    setTimeout(() => {
      setShowSubmitModal(false);
      setSubmissionSuccess(false);
      setNewThreat({ type: 'Video Deepfake', target: '', channel: 'Telegram', content: '' });
    }, 1200);
  };

  const filteredScams = scams.filter(s =>
    s.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.channel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 w-full relative">
      {/* Honeypot Intel Modal */}
      {showHoneypotModal && (
        <HoneypotIntelModal onClose={() => setShowHoneypotModal(false)} />
      )}
      {/* Page Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 w-full">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#ba1a1a] text-3xl font-bold">swap_vert</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0b1c30] dark:text-white tracking-tight">
              Public Scam Radar
            </h1>
          </div>
          <p className="text-lg text-[#45464d] dark:text-slate-400">
            Live feed of confirmed synthetic media and phishing attacks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowHoneypotModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs transition-all shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">smart_toy</span>
            AI Honeypot Intel
          </button>
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d]">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ticker, channel..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-[#c6c6cd] dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b1c30] text-[#0b1c30] dark:text-white"
            />
          </div>
          <button className="p-2 border border-[#c6c6cd] dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 hover:bg-[#eff4ff] transition-colors flex items-center justify-center text-[#45464d] dark:text-slate-300">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </div>

      {/* Heat Map Section matching reference screenshot */}
      <section className="w-full h-[300px] glass-panel rounded-xl overflow-hidden relative shadow-sm border border-[#c6c6cd]/50 dark:border-slate-800">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80 filter grayscale"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAFiQOOnemd5Dt4j3N7Eam9O5Lu_JXIAfagQgy6_raPtGFMlerhhRRohPYyw7G_JIuTp7-4S9z2HuhyJvNvdm4-xGuaGPQtAL3AmD_ApuTqHv32UNeox0TUeTB8vQwPOn2eFlF0I3M9UppU8nQmZS_DQJkOQgXqYoTs9TmVKVKQe5Tm_i7MQ2GiXTJUfIHfITmOKAI555u5PRn0W8RvzkObHuxZbfcV-2Fhnp58dw0LMXOY88MM7_-8XQ')" }}
        />

        {/* Map Overlay UI */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent dark:from-[#060b17]/90 dark:via-[#060b17]/40 flex flex-col justify-end p-6">
          <h3 className="text-xl font-bold text-[#0b1c30] dark:text-white mb-1">Global Activity Clusters</h3>
          <p className="text-sm text-[#45464d] dark:text-slate-400">Real-time threat origination mapping.</p>
        </div>

        {/* Simulated Glowing Red Nodes */}
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-[#ba1a1a] rounded-full shadow-[0_0_15px_rgba(186,26,26,0.8)] animate-pulse" />
        <div className="absolute top-1/2 left-2/3 w-4 h-4 bg-[#ba1a1a] rounded-full shadow-[0_0_20px_rgba(186,26,26,0.9)] animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-[#ba1a1a] rounded-full shadow-[0_0_10px_rgba(186,26,26,0.6)] animate-pulse" style={{ animationDelay: '1s' }} />
      </section>

      {/* Data Table Section */}
      <section className="glass-panel bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-[#c6c6cd]/50 dark:border-slate-800">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#eff4ff] dark:bg-slate-800 border-b border-[#c6c6cd]/50 dark:border-slate-700">
                <th className="p-4 text-xs font-semibold text-[#45464d] dark:text-slate-300 w-1/4">Threat Type</th>
                <th className="p-4 text-xs font-semibold text-[#45464d] dark:text-slate-300 w-1/4">Target / Impersonation</th>
                <th className="p-4 text-xs font-semibold text-[#45464d] dark:text-slate-300 w-1/6">Channel</th>
                <th className="p-4 text-xs font-semibold text-[#45464d] dark:text-slate-300 w-1/6">Date Detected</th>
                <th className="p-4 text-xs font-semibold text-[#45464d] dark:text-slate-300 w-1/6">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#c6c6cd]/30 dark:divide-slate-800">
              {filteredScams.map((scam) => (
                <Fragment key={scam.id}>
                  <tr
                    onClick={() => setExpandedId(expandedId === scam.id ? null : scam.id)}
                    className="scam-row-hover transition-colors group cursor-pointer bg-white dark:bg-slate-900"
                  >
                    <td className="p-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg text-[#76777d] group-hover:text-[#0b1c30] transition-colors">
                        {expandedId === scam.id ? 'expand_less' : 'expand_more'}
                      </span>
                      <span className="font-medium text-[#0b1c30] dark:text-white">{scam.type}</span>
                    </td>
                    <td className="p-4 text-[#45464d] dark:text-slate-300">{scam.target}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-[#e5eeff] dark:bg-slate-800 border border-[#c6c6cd]/30 dark:border-slate-700 text-xs text-[#45464d] dark:text-slate-300 font-medium">
                        {scam.channel}
                      </span>
                    </td>
                    <td className="p-4 text-[#45464d] dark:text-slate-300">{scam.date}</td>
                    <td className="p-4">
                      {scam.status === 'Active Alert' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#ba1a1a] text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-pulse" />
                          Active Alert
                        </span>
                      ) : scam.status === 'Resolved' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6cf8bb]/20 border border-[#006c49]/30 text-[#006c49] dark:text-emerald-400 text-xs font-bold">
                          <span className="material-symbols-outlined text-xs">check_circle</span>
                          Resolved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#dce9ff] dark:bg-slate-800 border border-[#0b1c30]/20 text-[#0b1c30] dark:text-slate-200 text-xs font-bold">
                          Takedown Requested
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Expanded Evidence Details */}
                  {expandedId === scam.id && (
                    <tr className="bg-[#eff4ff]/80 dark:bg-slate-800/80 border-b border-[#c6c6cd]/30">
                      <td colSpan={5} className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-white dark:bg-slate-900 border border-[#c6c6cd] dark:border-slate-700 rounded-lg text-[#ba1a1a]">
                            <span className="material-symbols-outlined text-2xl">troubleshoot</span>
                          </div>
                          <div className="space-y-2 flex-1">
                            <h4 className="text-xs font-bold text-[#0b1c30] dark:text-white uppercase tracking-wider">Evidence &amp; Forensics Details</h4>
                            <p className="text-xs font-mono bg-white dark:bg-slate-900 p-4 rounded-lg border border-[#c6c6cd]/40 dark:border-slate-700 text-[#0b1c30] dark:text-slate-200 leading-relaxed">
                              {scam.evidence.content}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination matching screenshot */}
        <div className="bg-[#eff4ff] dark:bg-slate-800 border-t border-[#c6c6cd]/30 p-4 flex justify-between items-center rounded-b-xl">
          <span className="text-xs text-[#45464d] dark:text-slate-400">Showing {filteredScams.length} of {scams.length} confirmed threats</span>
          <div className="flex gap-2">
            <button className="p-1.5 rounded bg-white dark:bg-slate-900 border border-[#c6c6cd]/40 hover:bg-[#dce9ff] transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="p-1.5 rounded bg-white dark:bg-slate-900 border border-[#c6c6cd]/40 hover:bg-[#dce9ff] transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section matching screenshot */}
      <section className="mt-4 p-8 rounded-xl bg-gradient-to-br from-[#e5eeff] to-[#eff4ff] dark:from-slate-800 dark:to-slate-900 border border-[#bec6e0] dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#000000] text-white flex items-center justify-center shadow-md shrink-0">
            <span className="material-symbols-outlined text-2xl">add_alert</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0b1c30] dark:text-white">Spotted a Suspicious Activity?</h3>
            <p className="text-xs text-[#45464d] dark:text-slate-400 mt-1">Help protect the investor community by reporting unverified channels or synthetic media.</p>
          </div>
        </div>
        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-6 py-3 rounded-lg bg-[#000000] dark:bg-sky-600 text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-md whitespace-nowrap flex items-center gap-2"
        >
          Submit a Threat
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </section>

      {/* Submit Threat Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-xl max-w-lg w-full p-6 border border-[#c6c6cd] space-y-4 shadow-2xl bg-white dark:bg-slate-900">
            <div className="flex justify-between items-center border-b border-[#e5eeff] pb-3">
              <h3 className="text-xl font-bold text-[#0b1c30] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ba1a1a]">report_problem</span>
                Report Suspicious Media / Link
              </h3>
              <button onClick={() => setShowSubmitModal(false)} className="p-1 hover:bg-[#eff4ff] rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {submissionSuccess ? (
              <div className="py-8 text-center space-y-2">
                <span className="material-symbols-outlined text-5xl text-[#006c49] animate-bounce">check_circle</span>
                <h4 className="text-xl font-bold text-[#0b1c30] dark:text-white">Threat Logged Successfully</h4>
                <p className="text-xs text-[#45464d] dark:text-slate-400">Our AI engine and SEBI HITL cell have received your report.</p>
              </div>
            ) : (
              <form onSubmit={handleAddThreat} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase text-[#45464d] dark:text-slate-300 mb-1">Threat Type</label>
                  <select
                    value={newThreat.type}
                    onChange={(e) => setNewThreat({ ...newThreat, type: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 border border-[#c6c6cd] rounded-lg p-2.5 text-[#0b1c30] dark:text-white"
                  >
                    <option value="Video Deepfake">Video Deepfake</option>
                    <option value="Voice Clone">Voice Clone</option>
                    <option value="Text/Phishing">Text/Phishing</option>
                    <option value="Fake Circular">Fake Circular PDF</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[#45464d] dark:text-slate-300 mb-1">Target / Channel</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WhatsApp VIP Stock Group / NSE CEO Fake Video"
                    value={newThreat.target}
                    onChange={(e) => setNewThreat({ ...newThreat, target: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 border border-[#c6c6cd] rounded-lg p-2.5 text-[#0b1c30] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[#45464d] dark:text-slate-300 mb-1">Evidence / Message Text / URL</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Paste full text, link, or description of the scam..."
                    value={newThreat.content}
                    onChange={(e) => setNewThreat({ ...newThreat, content: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 border border-[#c6c6cd] rounded-lg p-2.5 text-[#0b1c30] dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 font-bold rounded-lg border border-[#c6c6cd]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold bg-[#ba1a1a] text-white rounded-lg hover:bg-red-700"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScamRadarFeed;
