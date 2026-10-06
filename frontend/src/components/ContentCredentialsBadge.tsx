import React from 'react';

interface ContentCredentialsBadgeProps {
  manifest: {
    manifest_id: string;
    issuer: string;
    issuer_title: string;
    timestamp: string;
    cryptographic_proof: {
      algorithm: string;
      authority: string;
      signature: string;
      public_key_pem: string;
    };
    assertions: {
      sha256_digest: string;
      phash: string;
      format: string;
      provenance_status: string;
    };
  };
  onClose: () => void;
}

export const ContentCredentialsBadge: React.FC<ContentCredentialsBadgeProps> = ({ manifest, onClose }) => {
  const handleDownloadManifest = () => {
    const jsonStr = JSON.stringify(manifest, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `c2pa_manifest_${manifest.manifest_id.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glass-panel bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 max-w-2xl w-full border border-[#006c49]/30 dark:border-emerald-500/30 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5eeff] dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6cf8bb]/20 flex items-center justify-center border border-[#006c49]/40">
              <span className="material-symbols-outlined text-[#006c49] dark:text-emerald-400 text-2xl">verified</span>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#0b1c30] dark:text-white">Content Credentials (C2PA)</h3>
              <p className="text-xs text-[#006c49] dark:text-emerald-400 font-bold uppercase tracking-wider">Cryptographically Signed Genuine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#76777d] hover:text-[#0b1c30] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content Credentials Provenance Overview */}
        <div className="p-4 bg-[#f8f9ff] dark:bg-slate-800/60 rounded-xl border border-[#c6c6cd]/30 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#45464d] dark:text-slate-400 font-semibold">Issuer Authority:</span>
            <span className="font-bold text-[#0b1c30] dark:text-white">{manifest.issuer}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#45464d] dark:text-slate-400 font-semibold">Document Title:</span>
            <span className="font-semibold text-[#0b1c30] dark:text-white">{manifest.issuer_title}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#45464d] dark:text-slate-400 font-semibold">Issuance Timestamp:</span>
            <span className="font-mono text-[#0b1c30] dark:text-slate-300">{manifest.timestamp}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#45464d] dark:text-slate-400 font-semibold">Manifest URN:</span>
            <span className="font-mono text-xs text-[#006c49] dark:text-emerald-400 font-bold truncate max-w-[260px]">{manifest.manifest_id}</span>
          </div>
        </div>

        {/* Cryptographic Assertions & Digital Signature */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#0b1c30] dark:text-white uppercase tracking-wider">Cryptographic Proof Assertions</h4>
          
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-[#e5eeff] dark:border-slate-700">
              <span className="text-[#76777d] block text-[10px] uppercase font-bold">SHA-256 Content Digest</span>
              <span className="font-mono text-[#0b1c30] dark:text-slate-200 break-all">{manifest.assertions.sha256_digest}</span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-[#e5eeff] dark:border-slate-700">
              <span className="text-[#76777d] block text-[10px] uppercase font-bold">Perceptual Hash (pHash Signature)</span>
              <span className="font-mono text-[#006c49] dark:text-emerald-400 font-bold">{manifest.assertions.phash}</span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-[#e5eeff] dark:border-slate-700">
              <span className="text-[#76777d] block text-[10px] uppercase font-bold">ECDSA P-256 Digital Signature</span>
              <span className="font-mono text-[11px] text-[#76777d] dark:text-slate-400 break-all">{manifest.cryptographic_proof.signature}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleDownloadManifest}
            className="flex-1 py-3 bg-[#0b1c30] dark:bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Download C2PA Manifest (.json)
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-[#eff4ff] dark:bg-slate-800 text-[#0b1c30] dark:text-white font-bold rounded-xl text-xs hover:bg-[#e5eeff] dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
