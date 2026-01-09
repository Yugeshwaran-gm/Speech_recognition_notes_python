import React from "react";

export default function CommandPanel({
  open,
  onClose,
  listening,
  onToggleListening,
  speaking,
  onToggleSpeaking,
  onClear,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-x-0 bottom-6 z-40 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-euca-900/95 backdrop-blur border border-euca-800 text-euca-50 rounded-2xl shadow-strong w-[720px] max-w-[92vw]">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-euca-800 border border-euca-700">🎙️</span>
            <div>
              <div className="text-sm font-semibold">Command Panel</div>
              <div className="text-xs text-emerald-200/80">Activate mic or start reading your note</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleListening}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${listening ? "bg-red-500 border-red-400" : "bg-euca-600 hover:bg-euca-500 border-euca-500"}`}
            >
              {listening ? "Stop" : "Listen"}
            </button>
            <button
              onClick={onToggleSpeaking}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${speaking ? "bg-red-500 border-red-400" : "bg-green-600 hover:bg-green-500 border-green-500"}`}
            >
              {speaking ? "Stop Reading" : "Start Reading"}
            </button>
            <button
              onClick={onClear}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors border bg-orange-500 hover:bg-orange-400 border-orange-400"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors border bg-euca-800 hover:bg-euca-700 border-euca-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
