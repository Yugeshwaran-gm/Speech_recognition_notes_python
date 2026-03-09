import { useRef, useState } from "react";
import api from "../api/axios";

export default function AudioUploadModal({ editor, onClose }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const handleFileChange = (e) => {
  const selected = e.target.files[0];

  if (!selected) return;

  if (selected.size > MAX_FILE_SIZE) {
    alert("Audio file must be under 5MB (approx 3–5 minutes).");
    return;
  }

  setFile(selected);
};

  

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      setFile(dropped);
      setProgress(0);
    }
  };

  const formatBytes = (bytes = 0) => {
    if (!bytes) return "0 MB";
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const uploadAudio = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setProcessing(true);

      const response = await api.post("/speech/stt", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        },
      });

      const text = response.data.original_text;

      if (editor && text) {
        editor.commands.insertContent(text);
      }

      onClose();
    } catch (error) {
      console.error("Audio transcription failed", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/10 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-xl overflow-hidden flex flex-col bg-white/70 border border-white/40 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg text-[rgb(45,106,79)]">
              <span className="material-symbols-outlined block">audio_file</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Upload Audio</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 transition-colors p-1"
            title="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <input
            ref={inputRef}
            type="file"
            accept=".mp3,.wav,.m4a"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onDragEnter={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDrop={handleDrop}
            className={`group relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-6 py-10 transition-all ${
              dragActive
                ? "border-[rgb(45,106,79)] bg-emerald-50/60"
                : "border-emerald-200 bg-emerald-50/30 hover:border-[rgb(45,106,79)] hover:bg-emerald-50/50"
            }`}
          >
            <div className="p-4 rounded-full bg-emerald-100 text-[rgb(45,106,79)]">
              <span className="material-symbols-outlined text-4xl">cloud_upload</span>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-800 leading-tight">Drag and drop audio files</p>
              <p className="text-sm text-slate-500 mt-1">MP3, WAV, M4A up to 5MB</p>
              <p className="text-sm text-slate-500 mt-1">Recommended duration: under 3 minutes</p>
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-2 flex items-center justify-center rounded-xl h-10 px-6 bg-[rgb(45,106,79)] text-white text-sm font-bold tracking-wide shadow-lg shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-transform"
            >
              Browse Files
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Current Task</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                processing
                  ? "text-[rgb(45,106,79)] bg-emerald-100"
                  : file
                    ? "text-slate-700 bg-slate-200"
                    : "text-slate-500 bg-slate-100"
              }`}>
                {processing ? "Processing" : file ? "Ready" : "Waiting"}
              </span>
            </div>

            <div className="bg-white/60 rounded-xl p-4 border border-white/60 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center rounded-lg bg-emerald-100 text-[rgb(45,106,79)] shrink-0 size-12">
                  <span className="material-symbols-outlined text-2xl">mic</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-slate-800 text-base font-semibold truncate">
                      {file?.name || "No file selected"}
                    </p>
                    <p className="text-slate-400 text-xs whitespace-nowrap">{formatBytes(file?.size)}</p>
                  </div>
                  <p className="text-[rgb(45,106,79)] text-xs font-medium mt-0.5">
                    {processing ? `Transcribing thoughts... ${progress}%` : file ? "Ready to transcribe" : "Select an audio file to begin"}
                  </p>
                </div>

                {file && (
                  <button
                    onClick={() => {
                      setFile(null);
                      setProgress(0);
                    }}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                    title="Remove file"
                  >
                    <span className="material-symbols-outlined">cancel</span>
                  </button>
                )}
              </div>

              <div className="relative h-2 w-full bg-emerald-100 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full" />
                <div
                  className="h-full bg-[rgb(45,106,79)] rounded-full shadow-[0_0_8px_rgba(45,106,79,0.5)] transition-all duration-500"
                  style={{ width: `${processing ? progress : file ? 10 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 bg-white/40 border-t border-white/40 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Minimize
          </button>
          <button
            onClick={uploadAudio}
            disabled={!file || processing}
            className="px-5 py-2 text-sm font-bold text-white bg-slate-900 rounded-lg shadow-lg hover:bg-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {processing ? "Transcribing..." : "Upload & Transcribe"}
          </button>
        </div>
      </div>
    </div>
  );
}