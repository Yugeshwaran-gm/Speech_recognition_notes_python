import { useEffect, useState } from "react";

const COMMANDS = [
  
  {
    title: "Bold text",
    subtitle: "Say 'bold hello world' — makes text bold",
    icon: "📝",
  },
  {
    title: "Italic text",
    subtitle: "Say 'italic Hi' — makes text italic",
    icon: "📖",
  },
  {
    title: "Bullet point",
    subtitle: "Say 'bullet point' — inserts a bullet",
    icon: "📋",
  },
  {
    title: "Next line",
    subtitle: "Say 'next line' — adds a new line",
    icon: "⬇️",
  },
  {
    title: "Read aloud",
    subtitle: "Say 'start reading' — begins reading aloud",
    icon: "🔊",
  },
  {
    title: "Stop reading",
    subtitle: "Say 'stop reading' — stops reading aloud",
    icon: "⏹️",
  },
  {
    title: "Highlight text",
    subtitle: "Say 'highlight [text]' — highlights text in yellow",
    icon: "✨",
  },
];

export default function VoiceCommandsHelp() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % COMMANDS.length);
    }, 4000);

    return () => clearInterval(id);
  }, [paused]);

  const getCommandAtOffset = (offset) => {
    return COMMANDS[(index + offset) % COMMANDS.length];
  };

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="w-full bg-[rgb(255,255,255)] border border-[rgb(226,232,240)] rounded-xl px-6 py-4 text-sm text-[rgb(100,116,139)] shadow-sm hover:shadow-md transition-shadow hover:border-[rgb(45,106,79)]/50"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[rgb(45,106,79)] font-semibold text-xs uppercase tracking-widest">
          🎙️ Voice Commands
        </span>
      </div>

      {/* Card Stack Container */}
      <div className="relative h-64 w-full overflow-hidden">
        {[0, 1, 2].map((offset) => {
          const command = getCommandAtOffset(offset);
          const isTop = offset === 0;
          const opacityClass =
            offset === 0
              ? "opacity-100"
              : offset === 1
                ? "opacity-70"
                : "opacity-40";

          return (
            <div
              key={offset}
              className={`absolute w-full transition-all duration-300 ease-out transform-gpu will-change-transform ${opacityClass}`}
              style={{
                top: `${offset * 100}px`,
                transform: isTop ? "translateY(0) scale(1)" : "translateY(0) scale(0.98)",
              }}
            >
              <div
                className="bg-gradient-to-r from-[rgb(242,245,243)] to-white border border-[rgb(45,106,79)]/10 rounded-lg px-4 py-4 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-1">{command.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[rgb(20,30,25)] text-sm leading-tight">
                      "{command.title}"
                    </h3>
                    <p className="text-[rgb(100,116,139)] text-xs mt-1 leading-relaxed">
                      {command.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between text-[11px] text-[rgb(100,116,139)]">
        <span>Hover to pause</span>
        <div className="flex gap-1">
          {COMMANDS.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                i === index ? "bg-[rgb(45,106,79)]" : "bg-[rgb(100,116,139)]/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
