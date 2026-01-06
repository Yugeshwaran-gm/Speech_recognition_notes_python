export default function NotesHeader({ query, onQueryChange, onSearch }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <h1 className="text-2xl font-semibold">
        Your Notes
      </h1>

      <div className="flex gap-2 flex-1 max-w-md">
        <input
          value={query}
          onChange={onQueryChange}
          placeholder="Search your notes..."
          className="flex-1 bg-[#111827] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 transition-colors"
        />
        <button
          onClick={onSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          Search
        </button>
      </div>
    </div>
  );
}
