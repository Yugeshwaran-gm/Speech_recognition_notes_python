export default function NotesHeader({ query, onQueryChange, onSearch }) {
  return (
    <div className="flex justify-between items-center gap-4">
      

      <div className="flex gap-2 flex-1 max-w-md">
        <input
          value={query}
          onChange={onQueryChange}
          placeholder="Search your notes..."
          className="flex-1 bg-[rgb(255,255,255)] border border-[rgb(226,232,240)] rounded-lg px-4 py-2 text-[rgb(15,23,42)] placeholder-[rgb(100,116,139)] focus:border-[rgb(45,106,79)] transition-colors"
        />
        <button
          onClick={onSearch}
          className="bg-[rgb(45,106,79)] hover:bg-[rgb(27,67,50)] text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          Search
        </button>
      </div>
    </div>
  );
}
