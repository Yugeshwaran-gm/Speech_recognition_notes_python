import { useContext } from "react";
import CalendarWidget from "./CalendarWidget";
import VoiceCommandsHelp from "./VoiceCommandsHelp";
import { AuthContext } from "../context/authContext";

export default function RightPanel({ noteDateCounts, selectedDate, onSelectDate }) {
  const { logout } = useContext(AuthContext);

  return (
    <aside className="w-80 bg-[rgb(248,250,249)] border-l border-[rgb(226,232,240)] p-5 flex flex-col h-full">
      <div className="space-y-6 flex-1">
        <CalendarWidget
          noteDateCounts={noteDateCounts}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
        />
        {/* <Scratchpad /> */}
        <div className="bg-[rgb(248,250,249)] border border-[rgb(226,232,240)] rounded-xl p-4 min-h-[160px] flex flex-col">
          <VoiceCommandsHelp />
        </div>
      </div>
      <button
        onClick={logout}
        className="w-full bg-[rgb(27,67,50)] text-white px-4 py-2 rounded-lg hover:bg-[rgb(45,106,79)] transition-all duration-200 font-medium shadow-md hover:shadow-lg mt-6"
      >
      Logout
      </button>
      </aside>
 );
}