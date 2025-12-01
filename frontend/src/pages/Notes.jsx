import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/authContext";

export default function Notes() {
    const { logout, token } = useContext(AuthContext);

    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            const res = await api.get("/notes/");
            setNotes(res.data);
        } catch (err) {
            console.error("Error fetching notes:", err);
        }
    };

   const addNote = async () => {
    try {
        const res = await api.post("/notes/", {
            original_text: title,
            translated_text: content,
            category: "General",
            is_pinned: false,
        });

        setNotes([...notes, res.data]);
        setTitle("");
        setContent("");
    } catch (err) {
        console.error("Error adding note:", err);
    }
};


    const saveEdit = async () => {
        if (!title.trim() || !content.trim()) return;

        try {
            await api.put(`/notes/${editingId}`, { title, content });
            setEditingId(null);
            setTitle("");
            setContent("");
            loadNotes();
        } catch (err) {
            console.error("Error editing note:", err);
        }
    };

    const deleteNote = async (id) => {
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter((n) => n.id !== id));
        } catch (err) {
            console.error("Error deleting note:", err);
        }
    };

    const startEdit = (note) => {
        setEditingId(note.id);
        setTitle(note.title);
        setContent(note.content);
    };

    return (
        <div className="max-w-3xl mx-auto p-5">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Your Notes</h2>
                <button
                    onClick={logout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </div>

            {/* Add / Edit Note Form */}
            <div className="bg-white shadow p-5 rounded mb-6">
                <h3 className="text-xl font-semibold mb-4">
                    {editingId ? "Edit Note" : "Add Note"}
                </h3>

                <input
                    type="text"
                    placeholder="Title"
                    className="w-full border p-2 rounded mb-3"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    placeholder="Content"
                    className="w-full border p-2 rounded mb-3 h-28 resize-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <div className="flex gap-3">
                    {editingId ? (
                        <>
                            <button
                                onClick={saveEdit}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Save Changes
                            </button>

                            <button
                                onClick={() => {
                                    setEditingId(null);
                                    setTitle("");
                                    setContent("");
                                }}
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={addNote}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Add Note
                        </button>
                    )}
                </div>
            </div>

            {/* Notes List */}
            <div className="grid md:grid-cols-2 gap-4">
                {notes.map((n) => (
                    <div
                        key={n.id}
                        className="bg-white shadow p-4 rounded border"
                    >
                        <h4 className="text-xl font-semibold">{n.title}</h4>
                        <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                            {n.content}
                        </p>

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => startEdit(n)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => deleteNote(n.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
