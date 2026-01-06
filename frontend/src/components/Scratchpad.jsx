import { useEffect, useState } from "react";

export default function Scratchpad() {
  const [text, setText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("scratchpad");
    if (saved) setText(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("scratchpad", text);
  }, [text]);

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-4 flex flex-col h-[260px]">
      <h3 className="font-semibold text-sm mb-2">Scratchpad</h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Jot down quick thoughts here..."
        className="flex-1 bg-transparent border border-slate-700 rounded-lg p-2 text-sm resize-none focus:outline-none"
      />

      <span className="text-[11px] text-slate-400 mt-2">
        Saved automatically
      </span>
    </div>
  );
}
