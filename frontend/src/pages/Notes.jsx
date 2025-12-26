import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/authContext";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

export default function Notes() {
    const { logout } = useContext(AuthContext);

    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");     // UI title
    const [content, setContent] = useState(""); // UI content
    const [editingId, setEditingId] = useState(null);
    const [listening, setListening] = useState(false);
    const [livePreview, setLivePreview] = useState("");



    useEffect(() => {
        loadNotes();
    }, []);


//     const recognition = useSpeechRecognition((spokenText) => {
//     setContent((prev) => {
//         const updated = prev ? prev + " " + spokenText : spokenText;

//         // Auto-set title if empty
//         setTitle((currentTitle) => {
//             if (!currentTitle && updated) {
//                 return updated.split(" ").slice(0, 5).join(" ");
//             }
//             return currentTitle;
//         });

//         return updated;
//     });
// });
const recognition = useSpeechRecognition(
    (spokenText) => {
        if (editor) {
            editor.commands.insertContent(spokenText + " ");
        }

        setTitle((currentTitle) => {
            if (!currentTitle && spokenText) {
                return spokenText.split(" ").slice(0, 5).join(" ");
            }
            return currentTitle;
        });

        setLivePreview("");
    },
    setLivePreview
);



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
    
    const editor = useEditor({
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: "Write your content here..."
    })
  ],
  content,
  onUpdate: ({ editor }) => {
    setContent(editor.getHTML());
  }
});

useEffect(() => {
    if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content || "");
    }
}, [content, editor]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50">
            <div className="max-w-3xl mx-auto p-5">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-blue-600">Your Notes</h2>
                    <button
                        onClick={logout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium shadow-md"
                    >
                        Logout
                    </button>
                </div>

                {/* Add / Edit Form */}
                <div className="bg-white shadow-lg border border-slate-100 p-6 rounded-2xl mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-slate-800">
                        {editingId ? "Edit Note" : "Add Note"}
                    </h3>

                    <input
                        type="text"
                        placeholder="Title"
                        className="w-full border-2 border-slate-200 p-3 rounded-lg mb-3 focus:outline-none focus:border-blue-400 focus:bg-slate-50 transition-all duration-200"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    {/* <textarea
                        placeholder="Content"
                        className="w-full border-2 border-slate-200 p-3 rounded-lg mb-3 h-28 resize-none focus:outline-none focus:border-blue-400 focus:bg-slate-50 transition-all duration-200"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    /> */}
                    <div
  className="w-full border-2 border-slate-200 rounded-lg mb-3 min-h-[160px]
             px-3 py-2 cursor-text
             focus-within:border-blue-400 transition-all"
  onClick={() => editor?.commands.focus()}
>
  <EditorContent
    editor={editor}
    className="
      min-h-[120px]
      outline-none
      border-none
      shadow-none
      prose max-w-none
      [&_.ProseMirror]:outline-none
      [&_.ProseMirror]:border-none
      [&_.ProseMirror]:shadow-none
      [&_.ProseMirror]:p-0
      [&_.ProseMirror_p]:m-0
    "
  />
</div>


                    <div className="flex gap-3 flex-wrap">
                        {editingId ? (
                            <>
                                <button
                                    onClick={saveEdit}
                                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                                >
                                    Save Changes
                                </button>

                                {/* <button
                                    onClick={() => {
                                        setEditingId(null);
                                        setTitle("");
                                        setContent("");
                                    }}
                                    className="bg-slate-400 text-white px-4 py-2 rounded-lg hover:bg-slate-500 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                                >
                                    Cancel
                                </button> */}
                            </>
                        ) : (
                            <button
                                onClick={addNote}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                            >
                                Add Note
                            </button>
                        )}
                        <button 
                            onClick={startListening} 
                            disabled={listening}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                        >
                            🎙️ Start Voice
                        </button>

                        <button 
                            onClick={stopListening} 
                            disabled={!listening}
                            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                        >
                            ⏹ Stop
                        </button>
                        <button
                            onClick={() => {
                                setTitle("");
                                // setContent("");
                                editor?.commands.clearContent();
                                setEditingId(null);
                            }}
                            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                        >   
                            Clear
                        </button>
                    </div>
                    {listening && livePreview && (
    <p className="text-slate-400 italic mb-3">
        {livePreview}
    </p>
)}

                </div>

                {/* Notes List */}
                <div className="grid md:grid-cols-2 gap-4">
                    {notes.map((n) => (
                        <div
                            key={n.id}
                            className="bg-white shadow-lg border border-slate-100 p-4 rounded-2xl hover:shadow-xl transition-all duration-300"
                        >
                            <h4 className="text-xl font-semibold text-slate-800">
                                {n.original_text}
                            </h4>

                            {n.translated_text && (
                                <div
    className="text-slate-600 mt-2 prose max-w-none"
    dangerouslySetInnerHTML={{ __html: n.translated_text }}
/>

                            )}

                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => startEdit(n)}
                                    className="bg-amber-500 text-white px-3 py-1 rounded-lg hover:bg-amber-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => deleteNote(n.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
