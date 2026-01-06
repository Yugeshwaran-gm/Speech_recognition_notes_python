import { useMemo, useState } from "react";

const formatDateKey = (year, month, day) => {
  const d = new Date(year, month, day);
  return d.toLocaleDateString("en-CA");
};

export default function CalendarWidget({ noteDateCounts = {}, selectedDate, onSelectDate }) {
  const [date, setDate] = useState(new Date());

  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const dates = useMemo(
    () => Array(firstDay).fill(null).concat([...Array(lastDate)].map((_, i) => i + 1)),
    [firstDay, lastDate]
  );

  const handleSelect = (day) => {
    if (!day) return;
    const key = formatDateKey(year, month, day);
    const next = selectedDate === key ? null : key;
    onSelectDate?.(next);
  };

  const today = new Date();
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm">
          {date.toLocaleString("default", { month: "long" })} {year}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setDate(new Date(year, month - 1, 1))}
            className="text-slate-400 hover:text-white"
          >
            ‹
          </button>
          <button
            onClick={() => setDate(new Date(year, month + 1, 1))}
            className="text-slate-400 hover:text-white"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-xs text-center">
        {days.map((d, idx) => (
          <div key={`${d}-${idx}`} className="text-slate-400">{d}</div>
        ))}

        {dates.map((d, i) => {
          const key = d ? formatDateKey(year, month, d) : null;
          const hasNotes = key ? noteDateCounts[key] : 0;
          const isToday = key === todayKey;
          const isSelected = key && selectedDate === key;

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(d)}
              className={`py-1 rounded-lg transition-colors ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : isToday
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              } ${d ? "cursor-pointer" : "cursor-default"}`}
              disabled={!d}
            >
              <div className="leading-none">{d || ""}</div>
              <div className="h-2 mt-1 flex justify-center">
                {hasNotes ? <span className="w-2 h-2 rounded-full bg-emerald-400" /> : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
