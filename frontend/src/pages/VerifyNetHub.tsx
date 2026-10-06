import { useState, useRef } from 'react';
import { VerdictCard } from '../components/VerdictCard';
import { ContentCredentialsBadge } from '../components/ContentCredentialsBadge';

const VerifyNetHub = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [registryQuery, setRegistryQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [verdict, setVerdict] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'verify' | 'sign'>('verify');
  const [c2paManifest, setC2paManifest] = useState<any>(null);
  const [showManifestBadge, setShowManifestBadge] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<{ mel: number; vit: number; phash: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setVerdict(null);
    setC2paManifest(null);
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

  const handleAnalyzeFile = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setVerdict(null);
    setC2paManifest(null);
    setAnalysisProgress({ mel: 100, vit: 40, phash: 'Scanning...' });

    const progressTimer = setInterval(() => {
      setAnalysisProgress(prev => prev ? { ...prev, vit: Math.min(100, prev.vit + 20) } : null);
    }, 250);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').replace(/\/+$/, '');
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
      } else {
        const errText = await response.text();
        setVerdict({
          status: 'unverified',
          explanation: `⚠️ Backend Error (HTTP ${response.status}): ${errText.slice(0, 200)}`,
          confidenceScore: 0,
          correlatedFlags: ['File scan failed on backend server'],
          contentId: selectedFile.name,
        });
      }
    } catch (e) {
      clearInterval(progressTimer);
      setAnalysisProgress({ mel: 100, vit: 100, phash: 'Connection Failed' });
      setVerdict({
        status: 'unverified',
        explanation: 'Could not connect to FastAPI server. Run: cd backend && uvicorn main:app --reload',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSignC2PA = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('issuer_name', 'SEBI Official Communications Bureau');
      formData.append('issuer_title', selectedFile.name);

      const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').replace(/\/+$/, '');
      const response = await fetch(`${backendUrl}/api/v1/verify/sign`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setC2paManifest(data.c2pa_manifest);
        setShowManifestBadge(true);
      }
    } catch (e) {
      console.error('C2PA signing failed:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRegistrySearch = async () => {
    if (!registryQuery) return;
    setIsAnalyzing(true);
    setVerdict(null);
    setC2paManifest(null);
    setAnalysisProgress({ mel: 100, vit: 100, phash: 'Searching Registry...' });

    try {
      const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').replace(/\/+$/, '');
      const response = await fetch(`${backendUrl}/api/v1/verify/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_id: registryQuery, source_url: registryQuery }),
      });
      setAnalysisProgress({ mel: 100, vit: 100, phash: 'Match Found' });
      const data = await response.json();

      if (data.c2pa_manifest) {
        setC2paManifest(data.c2pa_manifest);
      }

      setVerdict({
        status: data.status === 'verified' ? 'verified' : data.status === 'unregistered' ? 'unverified' : 'high-risk',
        explanation: data.message,
        signer: data.signer,
        timestamp: data.timestamp,
        contentId: registryQuery,
      });
    } catch (e) {
      setVerdict({
        status: 'unverified',
        explanation: 'Registry search unavailable. Ensure backend API is online.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full relative">
      {/* C2PA Manifest Modal */}
      {showManifestBadge && c2paManifest && (
        <ContentCredentialsBadge
          manifest={c2paManifest}
          onClose={() => setShowManifestBadge(false)}
        />
      )}

      {/* Left Column (2/3 width) */}
      <div className="flex-grow flex flex-col gap-8 w-full md:w-2/3">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0b1c30] dark:text-white tracking-tight mb-2">
              VerifyNet Trust Hub
            </h1>
            <p className="text-lg text-[#45464d] dark:text-slate-400">
              Drag and drop media or search the Official Registry to cryptographically verify authenticity.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex p-1 bg-[#eff4ff] dark:bg-slate-800 rounded-xl border border-[#c6c6cd]/40 self-start sm:self-auto shrink-0">
            <button
              onClick={() => { setActiveTab('verify'); setVerdict(null); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'verify'
                  ? 'bg-white dark:bg-slate-900 text-[#0b1c30] dark:text-white shadow-sm'
                  : 'text-[#45464d] dark:text-slate-400'
              }`}
            >
              Verify Media
            </button>
            <button
              onClick={() => { setActiveTab('sign'); setVerdict(null); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'sign'
                  ? 'bg-[#006c49] text-white shadow-sm'
                  : 'text-[#45464d] dark:text-slate-400'
              }`}
            >
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
              Issue C2PA Circular
            </button>
          </div>
        </header>

        {/* Upload Dropzone Card */}
        <div
          className="glass-panel bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-[#c6c6cd] dark:border-slate-700 p-8 flex flex-col items-center justify-center min-h-[300px] transition-all cursor-pointer hover:border-[#0b1c30] dark:hover:border-sky-400 group shadow-sm"
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
            <div className="flex flex-col items-center gap-4 w-full max-w-md">
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="max-h-48 rounded object-contain border border-[#c6c6cd] shadow" />
              )}
              <div className="p-4 bg-[#ffffff] dark:bg-slate-800 border border-[#c6c6cd] dark:border-slate-700 rounded-lg flex items-center gap-3 w-full">
                <span className="material-symbols-outlined text-[#0b1c30] dark:text-sky-400 text-2xl">description</span>
                <div className="flex-1 truncate text-left">
                  <p className="text-sm font-bold text-[#0b1c30] dark:text-white truncate">{selectedFile.name}</p>
                  <p className="text-xs text-[#76777d]">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setVerdict(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="p-1 hover:bg-red-100 text-red-600 rounded"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              {activeTab === 'verify' ? (
                <button
                  onClick={(e) => { e.stopPropagation(); handleAnalyzeFile(); }}
                  disabled={isAnalyzing}
                  className="w-full py-3 bg-[#0b1c30] dark:bg-sky-600 text-white font-bold rounded-lg text-sm hover:bg-slate-800 transition-all shadow"
                >
                  {isAnalyzing ? 'Analyzing File...' : 'Start AI Verification'}
                </button>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); handleSignC2PA(); }}
                  disabled={isAnalyzing}
                  className="w-full py-3 bg-[#006c49] text-white font-bold rounded-lg text-sm hover:bg-[#006c49]/90 transition-all shadow flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">verified</span>
                  {isAnalyzing ? 'Signing C2PA Manifest...' : 'Issue C2PA Content Credential'}
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-[#dce9ff] dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-4xl text-[#0b1c30] dark:text-sky-400" data-icon="upload_file">
                  {activeTab === 'verify' ? 'upload_file' : 'workspace_premium'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#0b1c30] dark:text-white mb-2">
                {activeTab === 'verify' ? 'Upload for AI Verification' : 'Upload Genuine Media for C2PA Signing'}
              </h3>
              <p className="text-sm text-[#45464d] dark:text-slate-400 text-center max-w-md">
                {activeTab === 'verify'
                  ? 'Support for Audio (.mp3, .wav), Video (.mp4), Images (.jpg, .png), and Documents (.pdf). Maximum file size 50MB.'
                  : 'Issuer Authority: SEBI Communications Bureau. Signs document with ECDSA P-256 keys and generates a verifiable C2PA Content Credential.'}
              </p>
              <div className="mt-6 flex gap-4">
                <span className="px-3 py-1 bg-[#e5eeff] dark:bg-slate-800 rounded text-xs font-semibold text-[#45464d] dark:text-slate-300">Mel-spectrogram</span>
                <span className="px-3 py-1 bg-[#e5eeff] dark:bg-slate-800 rounded text-xs font-semibold text-[#45464d] dark:text-slate-300">C2PA Signature</span>
              </div>
            </>
          )}
        </div>

        {/* Registry Search Card */}
        <div className="glass-panel bg-white dark:bg-slate-900 rounded-xl p-6 flex flex-col gap-4 shadow-sm">
          <h3 className="text-xl font-bold text-[#0b1c30] dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl" data-icon="manage_search">manage_search</span>
            Official pHash Registry &amp; C2PA Search
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d]" data-icon="search">search</span>
              <input
                value={registryQuery}
                onChange={(e) => setRegistryQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#ffffff] dark:bg-slate-800 border border-[#c6c6cd] dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-[#0b1c30] outline-none transition-all text-[#0b1c30] dark:text-white"
                placeholder="Enter Broker ID, SEBI Circular No., C2PA URN, or pHash"
                type="text"
              />
            </div>
            <button
              onClick={handleRegistrySearch}
              disabled={isAnalyzing || !registryQuery}
              className="bg-[#0b1c30] dark:bg-sky-600 text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap disabled:opacity-50"
            >
              Verify Entity
            </button>
          </div>
        </div>
      </div>

      {/* Right Column (1/3 width) */}
      <div className="w-full md:w-1/3 flex flex-col gap-8">
        {/* Real-time Analysis Progress */}
        <div className="glass-panel bg-white dark:bg-slate-900 rounded-xl p-6 flex flex-col gap-6 shadow-sm" id="analysisState">
          <h3 className="text-xl font-bold text-[#0b1c30] dark:text-white border-b border-[#e5eeff] dark:border-slate-800 pb-2">Real-time Analysis</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#45464d] dark:text-slate-400">Mel-spectrogram extraction</span>
                <span className="text-[#006c49] dark:text-emerald-400 font-bold">{analysisProgress ? `${analysisProgress.mel}%` : '100%'}</span>
              </div>
              <div className="h-2 w-full bg-[#e5eeff] dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#006c49] dark:bg-emerald-500 w-full" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#45464d] dark:text-slate-400">Vision Transformer scan</span>
                <span className="text-[#0b1c30] dark:text-sky-400 font-bold">{analysisProgress ? `${analysisProgress.vit}%` : '84%'}</span>
              </div>
              <div className="h-2 w-full bg-[#e5eeff] dark:bg-slate-800 rounded-full overflow-hidden relative">
                <div className="h-full bg-[#0b1c30] dark:bg-sky-500 w-[84%] relative overflow-hidden">
                  <div className="absolute inset-0 shimmer" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#45464d] dark:text-slate-400">C2PA &amp; pHash Lookup</span>
                <span className="text-[#76777d] font-semibold">{analysisProgress ? analysisProgress.phash : 'Complete'}</span>
              </div>
              <div className="h-2 w-full bg-[#e5eeff] dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#006c49] w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Results State */}
        {verdict ? (
          <div className="space-y-4">
            <VerdictCard {...verdict} />
            {c2paManifest && (
              <button
                onClick={() => setShowManifestBadge(true)}
                className="w-full py-3 bg-[#006c49] text-white font-bold rounded-xl text-xs hover:bg-[#006c49]/90 transition-all flex items-center justify-center gap-2 shadow"
              >
                <span className="material-symbols-outlined text-base">workspace_premium</span>
                Inspect C2PA Content Credentials
              </button>
            )}
          </div>
        ) : (
          <div className="glass-panel bg-white dark:bg-slate-900 rounded-xl p-6 flex flex-col gap-4 border-t-4 border-[#ba1a1a] shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#ba1a1a] text-3xl" data-icon="warning">warning</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#ba1a1a] mb-1">Confirmed Synthetic</h2>
                <p className="text-xs text-[#45464d] dark:text-slate-400">This media contains AI-generated artifacts and does not match the official SEBI registry.</p>
              </div>
            </div>
            <div className="bg-[#eff4ff] dark:bg-slate-800 rounded-lg p-4 mt-2">
              <h4 className="text-xs font-bold text-[#0b1c30] dark:text-white mb-3 uppercase tracking-wider">Technical Artifacts Found</h4>
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-2 text-xs text-[#0b1c30] dark:text-slate-200">
                  <span className="material-symbols-outlined text-[#ba1a1a] text-base mt-0.5" data-icon="troubleshoot">troubleshoot</span>
                  <span><strong>Audio Anomalies:</strong> Unnatural breath patterns detected in Mel-spectrogram analysis (Confidence: 98%).</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-[#0b1c30] dark:text-slate-200">
                  <span className="material-symbols-outlined text-[#ba1a1a] text-base mt-0.5" data-icon="fingerprint">fingerprint</span>
                  <span><strong>Registry Miss:</strong> Digital signature does not match any known SEBI circular or authorized broker pHash.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyNetHub;
