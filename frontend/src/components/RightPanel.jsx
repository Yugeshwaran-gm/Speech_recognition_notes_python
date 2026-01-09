import { useContext } from "react";
import CalendarWidget from "./CalendarWidget";
import VoiceCommandsHelp from "./VoiceCommandsHelp";
import { AuthContext } from "../context/authContext";

export default function RightPanel({ noteDateCounts, selectedDate, onSelectDate }) {
  const { logout } = useContext(AuthContext);

  return (
    <aside className="w-80 bg-[#0F172A] border-l border-slate-800 p-5 flex flex-col h-full">
      <div className="space-y-6 flex-1">
        <CalendarWidget
          noteDateCounts={noteDateCounts}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
        />
        {/* <Scratchpad /> */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 min-h-[160px] flex flex-col">
          <VoiceCommandsHelp />
        </div>
      </div>
      <button
        onClick={logout}
        className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg mt-6"
      >
      Logout
      </button>
      </aside>
 );
}