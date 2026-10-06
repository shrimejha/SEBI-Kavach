import { useState, useRef } from 'react';
import { VerdictCard } from '../components/VerdictCard';
import { ChallengeModeModal } from '../components/ChallengeModeModal';

const InvestorDashboard = () => {
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'link' | 'text' | 'registry'>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [verdict, setVerdict] = useState<any>(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tier1Status, setTier1Status] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<{ mel: number; vit: number; phash: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setVerdict(null);
    setTier1Status(null);
    setAnalysisProgress(null);
    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setVerdict(null);
    setTier1Status(null);

    setAnalysisProgress({ mel: 100, vit: 45, phash: 'Scanning...' });
    const progressTimer = setInterval(() => {
      setAnalysisProgress(prev => prev ? { ...prev, vit: Math.min(100, prev.vit + 25) } : null);
    }, 300);

    try {
      setTier1Status('⚡ Tier-1: Instant pHash Lookup (<150ms)');

      if (activeTab === 'upload' && selectedFile) {
        setTier1Status('🧠 Tier-2: Multi-Modal AI Transformer Evaluation (HF Vision/Audio)...');

        const formData = new FormData();
        formData.append('file', selectedFile);

        const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').replace(/\/+$/, '');

        try {
          const response = await fetch(`${backendUrl}/api/v1/detect/upload`, {
            method: 'POST',
            body: formData,
          });

          clearInterval(progressTimer);
          setAnalysisProgress({ mel: 100, vit: 100, phash: 'Complete' });

          if (response.ok) {
            const data = await response.json();
            setVerdict({
              status: data.risk_level === 'high' ? 'high-risk' : data.risk_level === 'medium' ? 'flagged' : 'verified',
              explanation: data.explanation,
              confidenceScore: data.confidence_score,
              correlatedFlags: data.correlated_flags || [],
              contentId: selectedFile.name,
            });
            return;
          } else {
            const errText = await response.text();
            setVerdict({
              status: 'unverified',
              explanation: `⚠️ Backend Error (HTTP ${response.status}): ${errText.slice(0, 200)}`,
              confidenceScore: 0,
              correlatedFlags: ['Backend error received — file scan incomplete'],
              contentId: selectedFile.name,
            });
            return;
          }
        } catch (fetchErr) {
          clearInterval(progressTimer);
          setAnalysisProgress({ mel: 100, vit: 100, phash: 'Backend Unreachable' });
          setVerdict({
            status: 'unverified',
            explanation: `⚠️ Backend Server Unreachable at ${backendUrl}. Ensure Python backend is running.`,
            confidenceScore: 0,
            correlatedFlags: ['Connection failed to backend API server'],
            contentId: selectedFile.name,
          });
          return;
        }

      } else if (activeTab === 'link' || activeTab === 'registry') {
        if (!inputValue) return;
        const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').replace(/\/+$/, '');
        const response = await fetch(`${backendUrl}/api/v1/verify/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content_id: inputValue, source_url: inputValue }),
        });
        clearInterval(progressTimer);
        setAnalysisProgress({ mel: 100, vit: 100, phash: 'Complete' });
        const data = await response.json();
        setVerdict({
          status: data.status === 'verified' ? 'verified' : data.status === 'unregistered' ? 'unverified' : 'high-risk',
          explanation: data.message,
          signer: data.signer,
          timestamp: data.timestamp,
          contentId: inputValue,
        });

      } else {
        if (!inputValue) return;
        const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').replace(/\/+$/, '');
        const response = await fetch(`${backendUrl}/api/v1/detect/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel: 'text', content_text: inputValue }),
        });
        clearInterval(progressTimer);
        setAnalysisProgress({ mel: 100, vit: 100, phash: 'Complete' });
        const data = await response.json();
        setVerdict({
          status: data.risk_level === 'high' ? 'high-risk' : data.risk_level === 'medium' ? 'flagged' : 'verified',
          explanation: data.explanation,
          confidenceScore: data.confidence_score,
          correlatedFlags: data.correlated_flags || [],
          contentId: inputValue.slice(0, 30),
        });
      }

    } catch (error) {
      clearInterval(progressTimer);
      setVerdict({
        status: 'unverified',
        explanation: 'Backend AI model not reachable. Run: cd backend && uvicorn main:app --reload',
      });
    } finally {
      setIsAnalyzing(false);
      setTier1Status(null);
    }
  };

  const handleFloatingScanClick = () => {
    if (dropzoneRef.current) {
      dropzoneRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-8 w-full relative">
      {/* Live Challenge Mode Modal */}
      {showChallengeModal && (
        <ChallengeModeModal onClose={() => setShowChallengeModal(false)} />
      )}
      {/* Hero Protection Status Header */}
      <section className="glass-card rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#006c49]/10 rounded-full blur-3xl -z-10" />
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0b1c30] dark:text-white tracking-tight">
            Executive Overview
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#006c49]/10 border border-[#006c49]/20 rounded-full text-[#006c49] dark:text-emerald-400 font-semibold text-xs">
              <span className="material-symbols-outlined text-base">shield</span>
              Current Threat Level: LOW
            </div>
            <button
              onClick={() => setShowChallengeModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0b1c30] text-white hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 rounded-full text-xs font-bold transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-base">videocam</span>
              Start Live Liveness Challenge
            </button>
          </div>
          <p className="text-lg text-[#45464d] dark:text-slate-300 max-w-2xl">
            System active and monitoring across all registered channels. Real-time scanning is identifying anomalies within expected parameters.
          </p>
        </div>

        {/* Immunity Score Circular Progress Ring */}
        <div className="flex-shrink-0 relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle className="text-[#d3e4fe] dark:text-slate-800" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="8" />
            <circle className="text-[#006c49] dark:text-emerald-500 stroke-current progress-ring__circle" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeDasharray="283" strokeDashoffset="42" strokeWidth="8" strokeLinecap="round" />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-[#0b1c30] dark:text-white">85%</span>
            <span className="text-xs text-[#45464d] dark:text-slate-400 font-semibold">Immunity Score</span>
          </div>
        </div>
      </section>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Verification Dropzone (2 Columns) */}
        <section ref={dropzoneRef} className="md:col-span-2 glass-card rounded-xl p-6 flex flex-col gap-4 border-t-2 border-t-[#0b1c30] dark:border-t-sky-400">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-[#0b1c30] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl">upload_file</span>
                VerifyNet Quick Check
              </h2>
              <p className="text-xs text-[#45464d] dark:text-slate-400">Upload media for instant AI verification against known scams.</p>
            </div>

            {/* Mode Tabs */}
            <div className="flex p-1 bg-[#eff4ff] dark:bg-slate-800 rounded-lg border border-[#c6c6cd]/30">
              {(['upload', 'link', 'text', 'registry'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setVerdict(null); setAnalysisProgress(null); }}
                  className={`px-3 py-1 text-xs font-bold rounded capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-white dark:bg-slate-900 text-[#0b1c30] dark:text-white shadow-sm'
                      : 'text-[#45464d] dark:text-slate-400 hover:text-[#0b1c30]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Dropzone */}
          {activeTab === 'upload' && (
            <div
              className="flex-1 border-2 border-dashed border-[#c6c6cd]/60 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center p-8 bg-[#f8f9ff]/50 dark:bg-slate-900/50 hover:bg-[#eff4ff]/60 transition-colors cursor-pointer group relative min-h-[180px]"
              onClick={() => !selectedFile && fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) handleFileChange(e.target.files[0]);
                }}
              />

              {selectedFile ? (
                <div className="flex flex-col items-center gap-3 w-full max-w-md">
                  {previewUrl && (
                    <img src={previewUrl} alt="File Preview" className="max-h-40 rounded object-contain border border-[#c6c6cd] shadow" />
                  )}
                  <div className="p-3 bg-white dark:bg-slate-800 border border-[#c6c6cd] dark:border-slate-700 rounded-lg flex items-center gap-3 w-full">
                    <span className="material-symbols-outlined text-[#0b1c30] dark:text-sky-400">description</span>
                    <div className="flex-1 text-left truncate">
                      <p className="text-xs font-bold text-[#0b1c30] dark:text-white truncate">{selectedFile.name}</p>
                      <p className="text-xs text-[#76777d]">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        setVerdict(null);
                        setAnalysisProgress(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="p-1 hover:bg-red-100 text-red-600 rounded"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-4xl text-[#76777d] mb-2 group-hover:text-[#0b1c30] transition-colors" data-icon="cloud_upload">cloud_upload</span>
                  <span className="text-sm font-semibold text-[#0b1c30] dark:text-white">Drag &amp; Drop Files Here</span>
                  <span className="text-xs text-[#76777d]">or click to browse (Audio, Image, Video)</span>
                </>
              )}
            </div>
          )}

          {/* Link / Text / Registry Inputs */}
          {(activeTab === 'link' || activeTab === 'text' || activeTab === 'registry') && (
            <div className="space-y-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3.5 text-[#76777d] text-lg">
                  {activeTab === 'link' ? 'link' : activeTab === 'registry' ? 'search' : 'edit_note'}
                </span>
                <textarea
                  className="w-full bg-white dark:bg-slate-800 border border-[#c6c6cd] dark:border-slate-700 rounded-lg pl-10 pr-4 py-3 min-h-[120px] text-xs focus:outline-none focus:ring-2 focus:ring-[#0b1c30] text-[#0b1c30] dark:text-white"
                  placeholder={
                    activeTab === 'link'
                      ? 'Paste suspicious URL or social media link...'
                      : activeTab === 'registry'
                      ? 'Enter Broker ID, SEBI Circular No., or pHash fingerprint...'
                      : 'Paste SMS, WhatsApp text, or stock recommendation message...'
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Real-time Stage Progress Indicators */}
          {analysisProgress && (
            <div className="p-4 bg-[#eff4ff] dark:bg-slate-800 rounded-lg space-y-3 border border-[#c6c6cd]/30">
              <p className="text-xs font-bold uppercase text-[#45464d] dark:text-slate-300">Real-time Analysis Pipeline</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#45464d] dark:text-slate-400">Mel-Spectrogram Audio Extraction</span>
                  <span className="text-[#006c49] dark:text-emerald-400 font-bold">{analysisProgress.mel}%</span>
                </div>
                <div className="h-2 w-full bg-[#dce9ff] dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-[#006c49] transition-all duration-300" style={{ width: `${analysisProgress.mel}%` }} />
                </div>

                <div className="flex justify-between">
                  <span className="text-[#45464d] dark:text-slate-400">Vision Transformer (ViT) Pixel Scan</span>
                  <span className="text-[#006c49] dark:text-emerald-400 font-bold">{analysisProgress.vit}%</span>
                </div>
                <div className="h-2 w-full bg-[#dce9ff] dark:bg-slate-700 rounded-full overflow-hidden relative">
                  <div className="h-full bg-[#006c49] relative transition-all duration-300" style={{ width: `${analysisProgress.vit}%` }}>
                    <div className="absolute inset-0 shimmer" />
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#45464d] dark:text-slate-400">Official SEBI pHash Registry Lookup</span>
                  <span className="text-[#76777d] font-bold">{analysisProgress.phash}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tier-1 Alert Message */}
          {tier1Status && (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#006c49] animate-pulse">
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span>{tier1Status}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || (activeTab === 'upload' ? !selectedFile : !inputValue)}
              className="bg-[#0b1c30] dark:bg-sky-600 text-white px-6 py-3 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  <span>Run AI Verification</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Stats Column (3 Cards matching code.html) */}
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-xl p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#45464d] dark:text-slate-400">
              <span className="material-symbols-outlined text-lg">gpp_maybe</span>
              <span className="text-xs font-bold">Threats Neutralized</span>
            </div>
            <span className="text-3xl font-extrabold text-[#0b1c30] dark:text-white">1,248</span>
            <span className="text-xs font-bold text-[#006c49] dark:text-emerald-400">+12% this week</span>
          </div>

          <div className="glass-card rounded-xl p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#45464d] dark:text-slate-400">
              <span className="material-symbols-outlined text-lg">radar</span>
              <span className="text-xs font-bold">Active Verifications</span>
            </div>
            <span className="text-3xl font-extrabold text-[#0b1c30] dark:text-white">84</span>
            <span className="text-xs font-semibold text-[#76777d]">Live processing</span>
          </div>

          <div className="glass-card rounded-xl p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#45464d] dark:text-slate-400">
              <span className="material-symbols-outlined text-lg">group</span>
              <span className="text-xs font-bold">Protection Radius</span>
            </div>
            <span className="text-3xl font-extrabold text-[#0b1c30] dark:text-white">2.4M</span>
            <span className="text-xs font-semibold text-[#76777d]">Investors Secured</span>
          </div>
        </div>
      </div>

      {/* Analysis Verdict Output */}
      {verdict && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <VerdictCard {...verdict} />
        </div>
      )}

      {/* Lower Row: Live AI Detection Feed + Market Sentiment Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Live AI Detection Feed (2 Columns) */}
        <section className="md:col-span-2 glass-card rounded-xl p-6 flex flex-col h-80 overflow-hidden border-t-2 border-t-[#006c49] relative">
          <h2 className="text-xl font-bold text-[#0b1c30] dark:text-white flex items-center gap-2 mb-4 shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur z-10 pb-2 border-b border-[#e5eeff] dark:border-slate-800">
            <span className="material-symbols-outlined text-[#006c49] dark:text-emerald-400">sensors</span>
            Live AI Detection Feed
          </h2>
          <div className="relative flex-1 overflow-hidden">
            <div className="absolute inset-0 scrolling-feed flex flex-col gap-2">
              <div className="flex items-center justify-between p-3 bg-[#f8f9ff]/80 dark:bg-slate-800 rounded-lg border border-[#c6c6cd]/30">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#006c49]">mic</span>
                  <div>
                    <p className="text-xs font-bold text-[#0b1c30] dark:text-white">Voice Clip: Broker Spoof</p>
                    <p className="text-xs text-[#76777d]">Source: WhatsApp Group</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-[#6cf8bb]/20 border border-[#006c49]/30 text-[#006c49] dark:text-emerald-400 text-xs font-bold rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span> VERIFIED
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#ffdad6]/40 dark:bg-red-950/40 rounded-lg border border-[#ba1a1a]/30">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#ba1a1a]">link</span>
                  <div>
                    <p className="text-xs font-bold text-[#0b1c30] dark:text-white">URL: Phishing Attempt</p>
                    <p className="text-xs text-[#76777d]">Target: Trading Portal</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#ba1a1a] text-xs font-bold rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">block</span> BLOCKED
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#f8f9ff]/80 dark:bg-slate-800 rounded-lg border border-[#c6c6cd]/30">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#45464d]">image</span>
                  <div>
                    <p className="text-xs font-bold text-[#0b1c30] dark:text-white">Image: Fake Circular</p>
                    <p className="text-xs text-[#76777d]">Source: Telegram</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-[#ffddb8]/40 border border-[#ffb95f] text-[#b87500] dark:text-amber-400 text-xs font-bold rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">pending</span> UNDER REVIEW
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Market Sentiment Widget */}
        <section className="glass-card rounded-xl p-6 flex flex-col gap-4 border-t-2 border-t-[#ffb95f]">
          <h2 className="text-xl font-bold text-[#0b1c30] dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb95f]">trending_up</span>
            Market Sentiment
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-semibold text-[#0b1c30] dark:text-white">Deepfake Mentions</span>
                <span className="text-xs font-bold text-[#ba1a1a]">High</span>
              </div>
              <div className="w-full bg-[#d3e4fe] dark:bg-slate-800 rounded-full h-2">
                <div className="bg-[#ba1a1a] h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-semibold text-[#0b1c30] dark:text-white">Guaranteed Returns Spam</span>
                <span className="text-xs font-bold text-[#b87500]">Medium</span>
              </div>
              <div className="w-full bg-[#d3e4fe] dark:bg-slate-800 rounded-full h-2">
                <div className="bg-[#ffb95f] h-2 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#eff4ff] dark:bg-slate-800 rounded-lg border border-[#c6c6cd]/30">
              <p className="text-xs font-bold text-[#45464d] dark:text-slate-300 mb-1">Trending Keyword</p>
              <p className="text-sm font-bold text-[#0b1c30] dark:text-white">"Pre-IPO Allocation Guaranteed"</p>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Action Button matching sebi_kavach_dashboard_code.html */}
      <button
        onClick={handleFloatingScanClick}
        className="fixed bottom-8 right-8 bg-[#000000] dark:bg-sky-600 text-white shadow-xl hover:bg-slate-800 hover:-translate-y-1 transition-all rounded-full px-6 py-4 flex items-center gap-3 z-50 group font-bold"
      >
        <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform">document_scanner</span>
        <span className="text-sm">Scan Now</span>
      </button>
    </div>
  );
};

export default InvestorDashboard;
