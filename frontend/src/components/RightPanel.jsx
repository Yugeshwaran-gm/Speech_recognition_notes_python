import CalendarWidget from "./CalendarWidget";
import Scratchpad from "./Scratchpad";

export default function RightPanel({ noteDateCounts, selectedDate, onSelectDate }) {
  return (
    <aside className="w-80 bg-[#0F172A] border-l border-slate-800 p-5 space-y-6">
      <CalendarWidget
        noteDateCounts={noteDateCounts}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
      />
      <Scratchpad />
    </aside>
  );
}
