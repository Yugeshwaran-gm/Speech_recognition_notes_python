export default function Sidebar() {
  return (
    <aside className="w-64 bg-[rgb(248,250,249)] border-r border-[rgb(226,232,240)] p-5 flex flex-col">
      <h2 className="text-lg font-semibold mb-6 text-[rgb(15,23,42)]">All Notes</h2>

      <nav className="space-y-3 text-[rgb(100,116,139)]">
        <button className="sidebar-item active">All Notes</button>
        <button className="sidebar-item">Favorites</button>
        <button className="sidebar-item">Personal</button>
        <button className="sidebar-item">Work</button>
        <button className="sidebar-item text-red-400">Trash</button>
      </nav>

      <div className="mt-auto">
        <button className="w-full bg-[rgb(45,106,79)] hover:bg-[rgb(27,67,50)] text-white py-2 rounded-lg transition-colors">
          + New Note
        </button>
      </div>
    </aside>
  );
}
