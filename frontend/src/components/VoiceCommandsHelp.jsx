import { useEffect, useState } from "react";

const COMMANDS = [
  "Bold: say 'bold hello world' — makes text bold",
  "Italic: say 'italic Hi' — makes text italic",
  "Bullet: say 'bullet point' — inserts a bullet",
  "Next line: say 'next line' — adds a new line",
  "Read: say 'start reading' — begins reading aloud",
  "Say 'stop reading' — stops reading aloud",
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
      className="group bg-[rgb(255,255,255)] border border-[rgb(226,232,240)] rounded-xl px-5 py-4 text-sm text-[rgb(100,116,139)] shadow-sm hover:shadow-md transition-shadow hover:border-[rgb(45,106,79)]/50 [perspective:800px]"
    >
      <div className="flex items-center gap-2">
        <span className="text-[rgb(45,106,79)] font-semibold">🎙️ Voice Help</span>
      </div>
      <div
        aria-live="polite"
        role="status"
        className="mt-1 transform-gpu will-change-transform transition-transform duration-300 ease-out group-hover:[transform:translateZ(6px)_scale(1.015)]"
      >
        {COMMANDS[index]}
      </div>
      <span className="block text-[11px] text-[rgb(100,116,139)] mt-2">
        Hover to pause • All commands require ~1s gap
      </span>
    </div>
  );
}
