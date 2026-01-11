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
      <div className="pointer-events-auto bg-[rgb(51,65,85)]/95 backdrop-blur border border-[rgb(100,116,139)] text-white rounded-2xl shadow-strong w-[720px] max-w-[92vw]">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(27,67,50)] border border-[rgb(45,106,79)]">🎙️</span>
            <div>
              <div className="text-sm font-semibold">Command Panel</div>
              <div className="text-xs text-[rgb(216,243,232)]/80">Activate mic or start reading your note</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleListening}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${listening ? "bg-[rgb(239,68,68)] border-[rgb(220,38,38)]" : "bg-[rgb(45,106,79)] hover:bg-[rgb(27,67,50)] border-[rgb(45,106,79)]"}`}
            >
              {listening ? "Stop" : "Listen"}
            </button>
            <button
              onClick={onToggleSpeaking}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${speaking ? "bg-[rgb(239,68,68)] border-[rgb(220,38,38)]" : "bg-[rgb(52,211,153)] hover:bg-[rgb(45,106,79)] border-[rgb(52,211,153)]"}`}
            >
              {speaking ? "Stop Reading" : "Start Reading"}
            </button>
            <button
              onClick={onClear}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors border bg-[rgb(239,68,68)] hover:bg-[rgb(220,38,38)] border-[rgb(220,38,38)]"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors border bg-[rgb(27,67,50)] hover:bg-[rgb(45,106,79)] border-[rgb(45,106,79)]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
