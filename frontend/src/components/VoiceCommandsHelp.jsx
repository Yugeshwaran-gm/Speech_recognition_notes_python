import { useEffect, useState } from "react";

const COMMANDS = [
  "🎙️ Say: 'bold hello world'",
  "🎙️ Say: 'italic this text'",
  "🎙️ Say: 'bullet point'",
  "🎙️ Say: 'next line'",
  "🎙️ Say: 'start reading'",
  "🎙️ Say: 'stop reading'",
];

export default function VoiceCommandsHelp() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % COMMANDS.length);
    }, 3000);

    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="bg-[#0F172A] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300"
    >
      <span className="text-blue-400 font-medium">Voice Help:</span>{" "}
      {COMMANDS[index]}
      <span className="block text-[11px] text-slate-500 mt-1">
        Hover to pause
      </span>
    </div>
  );
}
