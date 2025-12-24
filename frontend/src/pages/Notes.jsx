import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/authContext";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";


export default function Notes() {
    const { logout } = useContext(AuthContext);

    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");     // UI title
    const [content, setContent] = useState(""); // UI content
    const [editingId, setEditingId] = useState(null);
    const [listening, setListening] = useState(false);


    useEffect(() => {
        loadNotes();
    }, []);


    const recognition = useSpeechRecognition((spokenText) => {
    setContent((prev) => {
        const updated = prev ? prev + " " + spokenText : spokenText;

        // Auto-set title if empty
        setTitle((currentTitle) => {
            if (!currentTitle && updated) {
                return updated.split(" ").slice(0, 5).join(" ");
            }
            return currentTitle;
        });

        return updated;
    });
});


    useEffect(() => {
        if (!recognition) return;

        recognition.onend = () => {
            // Auto-restart if still in listening mode
            if (listening) {
                try {
                    recognition.start();
                } catch (err) {
                    console.log("Recognition restart skipped:", err.message);
                }
            }
        };

        return () => {
            recognition.onend = null;
        };
    }, [listening, recognition]);

const enableMic = async () => {
    await navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
        }
    });
};


const startListening = async () => {
    if (!recognition) return;
    await enableMic();
    recognition.start();
    console.log("Listening started");
    setListening(true);
};

const stopListening = () => {
    if (!recognition) return;
    recognition.stop();
    setListening(false);
    console.log("Final content:", content);
};


    // -------------------------------
    // Load Notes
    // -------------------------------
    const loadNotes = async () => {
        try {
            const res = await api.get("/notes/");
            setNotes(res.data);
        } catch (err) {
            console.error("Error fetching notes:", err);
        }
    };

    // -------------------------------
    // Add Note
    // -------------------------------
    const addNote = async () => {
        if (!title.trim()) return;

        try {
            const res = await api.post("/notes/", {
                original_text: title,          // mapped internally
                translated_text: content || "", // mapped internally
                category: "General",
                is_pinned: false,
            });

            setNotes([...notes, res.data]);
            setTitle("");
            setContent("");
        } catch (err) {
            console.error("Error adding note:", err.response?.data || err);
        }
    };

    // -------------------------------
    // Save Edited Note
    // -------------------------------
    const saveEdit = async () => {
        if (!title.trim()) return;

        try {
            await api.put(`/notes/${editingId}`, {
                original_text: title,
                translated_text: content || "",
                category: "General",
                is_pinned: false,
            });

            setEditingId(null);
            setTitle("");
            setContent("");
            loadNotes();
        } catch (err) {
            console.error("Error editing note:", err.response?.data || err);
        }
    };

    // -------------------------------
    // Delete Note
    // -------------------------------
    const deleteNote = async (id) => {
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter((n) => n.id !== id));
        } catch (err) {
            console.error("Error deleting note:", err);
        }
    };

    // -------------------------------
    // Start Edit
    // -------------------------------
    const startEdit = (note) => {
        setEditingId(note.id);
        setTitle(note.original_text || "");
        setContent(note.translated_text || "");
    };

    return (
        <div className="max-w-3xl mx-auto p-5">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Your Notes</h2>
                <button
                    onClick={logout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </div>

            {/* Add / Edit Form */}
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
                    <button onClick={startListening} disabled={listening}>
    🎙️ Start Voice
</button>

<button onClick={stopListening} disabled={!listening}>
    ⏹ Stop
</button>

                </div>
            </div>

            {/* Notes List */}
            <div className="grid md:grid-cols-2 gap-4">
                {notes.map((n) => (
                    <div
                        key={n.id}
                        className="bg-white shadow p-4 rounded border"
                    >
                        <h4 className="text-xl font-semibold text-gray-800">
                            {n.original_text}
                        </h4>

                        {n.translated_text && (
                            <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                                {n.translated_text}
                            </p>
                        )}

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
