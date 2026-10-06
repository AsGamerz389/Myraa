import React, { useState, useRef } from 'react';
import { Upload, FolderUp, CheckCircle, AlertCircle, Trash2, X, RefreshCw } from 'lucide-react';
import { importCharacterFiles, ImportProgress, ImportResult } from '../../character_import/importer';
import { clearImportedCharacter, StoredCharacterData } from '../lib/db';

interface ModelSelectorProps {
  currentData: StoredCharacterData | null;
  onImportSuccess: (result: ImportResult) => void;
  onClose: () => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  currentData,
  onImportSuccess,
  onClose,
}) => {
  const [importing, setImporting] = useState<boolean>(false);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      setImporting(true);
      setError(null);
      setProgress({
        stage: 'extracting',
        processedCount: 0,
        totalCount: files.length,
        percentage: 5,
      });

      const res = await importCharacterFiles(files, (p) => {
        setProgress(p);
      });

      setResult(res);
      onImportSuccess(res);
    } catch (err: any) {
      console.error('Import error:', err);
      setError(err?.message || 'Failed to import character model');
    } finally {
      setImporting(false);
    }
  };

  const handleClear = async () => {
    if (confirm('Remove current imported character from local storage?')) {
      await clearImportedCharacter('current');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">Import Character</h2>
            <p className="text-xs text-slate-400 mt-0.5">PMX 3D Model & Textures (.zip / folder / .pmx)</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current status */}
        <div className="my-4 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Current Character
          </div>
          {currentData ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{currentData.name}</p>
                <p className="text-xs text-slate-400">
                  {Object.keys(currentData.textures || {}).length} textures •{' '}
                  {Math.round(currentData.pmxBuffer.byteLength / 1024 / 1024 * 10) / 10} MB
                </p>
              </div>
              <button
                onClick={handleClear}
                className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Remove character"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <div className="text-xs text-amber-300/90 flex items-center gap-1.5 py-1">
              <AlertCircle size={14} className="shrink-0" />
              <span>No character imported yet. Choose a package below.</span>
            </div>
          )}
        </div>

        {/* Import actions */}
        <div className="space-y-3 my-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip,.pmx"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <input
            ref={folderInputRef}
            type="file"
            // @ts-ignore
            webkitdirectory=""
            directory=""
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <button
            disabled={importing}
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all text-white font-medium text-sm shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            <Upload size={18} />
            <span>Select .ZIP or .PMX File</span>
          </button>

          <button
            disabled={importing}
            onClick={() => folderInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] transition-all text-slate-200 font-medium text-sm border border-slate-700/80 disabled:opacity-50"
          >
            <FolderUp size={18} />
            <span>Select Unzipped Folder</span>
          </button>
        </div>

        {/* Downscale optimization notice (Rule 4) */}
        <div className="p-3 bg-indigo-950/30 border border-indigo-900/40 rounded-xl text-[11px] text-indigo-300/80 leading-relaxed">
          ⚡ <strong>Mobile Optimization:</strong> Hair/clothes textures are downscaled to max 1024px, and others to 512px. TGAs are auto-converted to PNG for fast GPU texture streaming.
        </div>

        {/* Live progress */}
        {importing && progress && (
          <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="capitalize">{progress.stage.replace('_', ' ')}...</span>
              <span className="font-mono">{progress.percentage}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-2 transition-all duration-300 ease-out"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            {progress.currentFile && (
              <p className="text-[10px] text-slate-500 truncate font-mono">
                {progress.currentFile}
              </p>
            )}
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="mt-4 p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        {/* Success notification */}
        {result && (
          <div className="mt-4 p-3.5 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
            <CheckCircle size={16} className="shrink-0 mt-0.5 text-emerald-400" />
            <div>
              <p className="font-semibold text-emerald-200">Import successful!</p>
              <p className="text-[11px] text-emerald-300/80 mt-0.5">
                Loaded {result.modelName} ({result.textureCount} textures, {result.downscaledTexturesCount} downscaled).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
