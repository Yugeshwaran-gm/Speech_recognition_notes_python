export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#0F172A] border-r border-slate-800 p-5 flex flex-col">
      <h2 className="text-lg font-semibold mb-6">All Notes</h2>

      <nav className="space-y-3 text-slate-300">
        <button className="sidebar-item active">All Notes</button>
        <button className="sidebar-item">Favorites</button>
        <button className="sidebar-item">Personal</button>
        <button className="sidebar-item">Work</button>
        <button className="sidebar-item text-red-400">Trash</button>
      </nav>

      <div className="mt-auto">
        <button className="w-full bg-blue-600 py-2 rounded-lg">
          + New Note
        </button>
      </div>
    </aside>
  );
}
