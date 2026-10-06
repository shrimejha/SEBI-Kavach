import { useState } from 'react';
import { Shield, CheckCircle, AlertOctagon, X } from 'lucide-react';
import { VerdictCard } from '../components/VerdictCard';

const createDemoImageFile = async (variant: 'real' | 'fake'): Promise<File> => {
  const width = 640;
  const height = 360;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not available');

  ctx.fillStyle = variant === 'real' ? '#10b981' : '#ef4444';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(variant === 'real' ? 'REAL DEMO' : 'FAKE DEMO', width / 2, height / 2 - 20);
  ctx.font = '20px Inter, system-ui, sans-serif';
  ctx.fillText('Investor Kavach live demo', width / 2, height / 2 + 30);

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Failed to create demo image')); 
      resolve(new File([blob], `${variant} document.png`, { type: 'image/png' }));
    }, 'image/png');
  });
};

const TrialDemo = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const chooseSample = async (variant: 'real' | 'fake') => {
    setMessage(null);
    setVerdict(null);
    try {
      const file = await createDemoImageFile(variant);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } catch (err) {
      setMessage('Unable to generate demo file for this browser.');
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setVerdict(null);
    setMessage(null);
  };

  const analyzeFile = async () => {
    if (!selectedFile) {
      setMessage('Please load a demo file first.');
      return;
    }

    setIsAnalyzing(true);
    setMessage(null);
    setVerdict(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000').replace(/\/+$/, '');

    try {
      const response = await fetch(`${backendUrl}/api/v1/detect/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        setMessage(`Backend error: ${response.status} - ${text.slice(0, 200)}`);
        return;
      }

      const data = await response.json();
      setVerdict({
        status: data.risk_level === 'high' ? 'high-risk' : data.risk_level === 'medium' ? 'flagged' : 'verified',
        explanation: data.explanation,
        confidenceScore: data.confidence_score,
        correlatedFlags: data.correlated_flags || [],
        contentId: selectedFile.name,
      });
    } catch (err) {
      setMessage(`Unable to reach backend at ${backendUrl}. Start the backend and try again.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">Trial Demo: Fake vs Real Media</h1>
        <p className="text-foreground/70">
          Load a demo file and press Analyze. Files named <strong>fake</strong> will be shown as fake, and files named <strong>real</strong> will be shown as real.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        <button
          onClick={() => chooseSample('real')}
          className="rounded-3xl border border-green-400/40 bg-green-500/10 px-6 py-4 text-left hover:bg-green-500/20 transition"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" size={24} />
            <div>
              <h2 className="text-lg font-semibold">Load Real Demo File</h2>
              <p className="text-sm text-foreground/70">This demo file is named <strong>real document.png</strong> and will be flagged as verified.</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => chooseSample('fake')}
          className="rounded-3xl border border-red-400/40 bg-red-500/10 px-6 py-4 text-left hover:bg-red-500/20 transition"
        >
          <div className="flex items-center gap-3">
            <AlertOctagon className="text-red-500" size={24} />
            <div>
              <h2 className="text-lg font-semibold">Load Fake Demo File</h2>
              <p className="text-sm text-foreground/70">This demo file is named <strong>fake document.png</strong> and will be flagged as synthetic.</p>
            </div>
          </div>
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-card border border-border rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Demo File Preview</h2>
            <p className="text-foreground/70 text-sm">Use the demo buttons above to load the sample file, then click Analyze.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={analyzeFile}
              disabled={isAnalyzing || !selectedFile}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition disabled:opacity-50"
            >
              <Shield size={16} /> {isAnalyzing ? 'Analyzing...' : 'Analyze File'}
            </button>
            <button
              onClick={clearSelection}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-background"
            >
              <X size={16} /> Clear
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
          <div className="rounded-3xl overflow-hidden bg-background border border-border h-64 flex items-center justify-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Demo preview" className="max-h-full max-w-full object-contain" />
            ) : (
              <div className="text-center text-sm text-foreground/50 px-4">
                No demo file loaded yet. Click one of the buttons above to generate a preview.
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-background p-5">
              <p className="text-sm font-semibold mb-2">Selected File</p>
              <p className="text-foreground/80">{selectedFile?.name ?? 'None'}</p>
              <p className="text-foreground/80">{selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB` : ''}</p>
            </div>
            <div className="rounded-3xl border border-border bg-background p-5">
              <p className="text-sm font-semibold mb-2">How it works</p>
              <ul className="list-disc list-inside text-foreground/70 space-y-2 text-sm">
                <li>The backend sees the filename and flags <strong>fake</strong> as high-risk.</li>
                <li>Files named <strong>real</strong> or <strong>authentic</strong> are flagged as verified.</li>
                <li>This demo page generates the file name and submits it to the existing `/api/v1/detect/upload` endpoint.</li>
              </ul>
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-3xl border border-yellow-400/40 bg-yellow-500/10 p-4 text-sm text-yellow-900">
            {message}
          </div>
        )}
      </div>

      {verdict && (
        <div className="max-w-3xl mx-auto">
          <VerdictCard {...verdict} />
        </div>
      )}
    </div>
  );
};

export default TrialDemo;
