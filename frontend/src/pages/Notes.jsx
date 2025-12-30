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
    const [lastCommandTime, setLastCommandTime] = useState(0);
    const [speaking, setSpeaking] = useState(false);
    const [speechUtterance, setSpeechUtterance] = useState(null);
    const [query, setQuery] = useState("");
    const COMMAND_COOLDOWN = 1200; 



    useEffect(() => {
        loadNotes();
    }, []);

const recognition = useSpeechRecognition(
    (spokenText) => {
        if (editor) {
            // editor.commands.insertContent(spokenText + " ");
            handleSpokenText(spokenText);

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
const handleSearchChange = (e) => {
  const value = e.target.value;
  setQuery(value);
  
  // Auto-reload all notes when search field is cleared
  if (!value.trim()) {
    loadNotes();
  }
};

const searchNotes = async () => {
  try {
    if (!query.trim()) {
      // If query is empty, reload all notes
      loadNotes();
      return;
    }
    const res = await api.get(`/notes/search?q=${query}`);
    console.log("Search response:", res.data);
    
    // Handle both response structures: {results: [...]} or [...]
    const results = Array.isArray(res.data) ? res.data : (res.data.results || []);
    console.log("Setting notes to:", results);
    setNotes(results);
  } catch (err) {
    console.error("Error searching notes:", err);
    alert("Search failed. Please try again.");
  }
};


    // Load Notes
   
    const loadNotes = async () => {
        try {
            const res = await api.get("/notes/");
            setNotes(res.data);
        } catch (err) {
            console.error("Error fetching notes:", err);
        }
    };
  
    // Add Note
   
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
  
    // Save Edited Note
   
    const saveEdit = async () => {
        if (!title.trim()) return;
        const ok = window.confirm("Save changes to this note?");
        if (!ok) return;

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

    // Delete Note
    
    const deleteNote = async (id) => {
        const target = notes.find((n) => n.id === id);
        const label = target?.original_text ? `\"${target.original_text}\"` : "this note";
        const ok = window.confirm(`Delete ${label}? This action cannot be undone.`);
        if (!ok) return;
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter((n) => n.id !== id));
            
        } catch (err) {
            console.error("Error deleting note:", err);
        }
    };

    // Start Edit
    
    const startEdit = (note) => {
        setEditingId(note.id);
        setTitle(note.original_text || "");
        setContent(note.translated_text || "");
    };

    const getEditorText = () => {
  if (!editor) return "";
  return editor.getText();
};

    const deriveTitleFromText = (text) => {
      if (!text) return "";
      const clean = text.replace(/\s+/g, " ").trim();
      if (!clean) return "";
      const words = clean.split(" ");
      const slice = words.slice(0, 6).join(" ");
      return slice.charAt(0).toUpperCase() + slice.slice(1);
    };

    // Highlight the currently spoken word in the editor by selecting it
    const clearReadingHighlight = () => {
      const sel = window.getSelection();
      if (sel && sel.removeAllRanges) sel.removeAllRanges();
    };

    const getWordBounds = (text, index) => {
      if (!text || index == null) return { start: 0, end: 0 };
      let start = index;
      while (start > 0 && !/\s/.test(text[start - 1])) start--;
      let end = index;
      while (end < text.length && !/\s/.test(text[end])) end++;
      return { start, end };
    };

    const setDomSelectionForTextRange = (start, end) => {
      if (!editor?.view?.dom) return;
      const root = editor.view.dom;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

      let acc = 0;
      let startNode = null, startOffset = 0;
      let endNode = null, endOffset = 0;

      while (walker.nextNode()) {
        const node = walker.currentNode;
        const len = node.nodeValue.length;
        if (!startNode && acc + len >= start) {
          startNode = node;
          startOffset = Math.max(0, start - acc);
        }
        if (startNode && acc + len >= end) {
          endNode = node;
          endOffset = Math.max(0, end - acc);
          break;
        }
        acc += len;
      }

      if (startNode && endNode) {
        const range = document.createRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    };

    const highlightWordByCharIndex = (charIndex) => {
      const text = getEditorText();
      if (!text) return;
      const { start, end } = getWordBounds(text, charIndex || 0);
      setDomSelectionForTextRange(start, end);
    };

    // ----- Selection helpers -----
    const getSelectedEditorText = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return "";
      const root = editor?.view?.dom;
      const range = sel.getRangeAt(0);
      if (!root || !root.contains(range.startContainer)) return "";
      if (range.collapsed) return "";
      return range.toString().trim();
    };

    const charIndexFromNodeOffset = (root, targetNode, offset) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let acc = 0;
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node === targetNode) {
          return acc + Math.max(0, offset);
        }
        acc += node.nodeValue.length;
      }
      return acc; // fallback end
    };

    const getSelectionAbsoluteRangeIndices = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return null;
      const root = editor?.view?.dom;
      const range = sel.getRangeAt(0);
      if (!root || !root.contains(range.startContainer)) return null;
      const startAbs = charIndexFromNodeOffset(root, range.startContainer, range.startOffset);
      const endAbs = charIndexFromNodeOffset(root, range.endContainer, range.endOffset);
      return { startAbs, endAbs };
    };

    
    const editor = useEditor({
  extensions: [
   StarterKit.configure({
  bulletList: { 
    keepMarks: true,
    keepAttributes: false,
    HTMLAttributes: {
      class: 'list-disc ml-6'
    }
  },
  orderedList: { 
    keepMarks: true,
    keepAttributes: false,
    HTMLAttributes: {
      class: 'list-decimal ml-6'
    }
  },
  listItem: {
    HTMLAttributes: {
      class: 'ml-2'
    }
  }
}),
    Placeholder.configure({
      placeholder: "Write your content here..."
    })
  ],
  content,
  onUpdate: ({ editor }) => {
    setContent(editor.getHTML());
    // Auto-generate title from content when empty (typing or voice)
    setTitle((prev) => {
      if (!prev || !prev.trim()) {
        const candidate = deriveTitleFromText(editor.getText());
        return candidate || prev || "";
      }
      return prev;
    });
  }
});
const handleSpokenText = (spokenText) => {
  if (!editor) return;
    const now = Date.now();
  const text = spokenText.toLowerCase().trim();
    if (now - lastCommandTime < COMMAND_COOLDOWN) return;
  // ---- BOLD ----
  if (text.startsWith("bold ")) {
    const value = spokenText.slice(5);
    editor.chain().focus().toggleBold().run();
    editor.commands.insertContent(value + " ");
    editor.chain().focus().toggleBold().run();
    return;
  }

  // ---- ITALIC ----
  if (text.startsWith("italic ")) {
    const value = spokenText.slice(7);
    editor.chain().focus().toggleItalic().run();
    editor.commands.insertContent(value + " ");
    editor.chain().focus().toggleItalic().run();
    return;
  }

  // ---- BULLET ----
  if (text === "bullet point") {
    editor.chain().focus().toggleBulletList().run();
    editor.commands.enter();
    return;
  }

  // ---- NEXT LINE ----
  if (text === "next line") {
    editor.commands.enter();
    return;
  }
  // ---- READ ALOUD ----
if (text.includes("read ") || text.includes("start reading")) {
  startReading();
  return;
}


if (text.includes("stop reading")) {
  stopReading();
  return;
}


  // ---- NORMAL TEXT ----
  editor.commands.insertContent(spokenText + " ");
};

const startReading = () => {
  // Prefer selected text if any, else read entire editor content
  const selected = getSelectedEditorText();
  const text = selected || getEditorText();
  if (!text) return;

  window.speechSynthesis.cancel(); // stop previous speech

  const utterance = new SpeechSynthesisUtterance(text);
  // Polite voice: slightly slower and a bit higher pitch
  utterance.rate = 0.95;    // speed (0.5 – 2)
  utterance.pitch = 1.15;   // pitch (0 – 2)
  utterance.lang = "en-US";

  // Choose a softer/female English voice when available (Windows: Microsoft Zira)
  const getPreferredVoice = () => {
    try {
      const voices = window.speechSynthesis.getVoices() || [];
      const byName = voices.find(v => /zira|female/i.test(v.name) && /^en/i.test(v.lang));
      if (byName) return byName;
      const enVoices = voices.filter(v => /^en/i.test(v.lang));
      // Prefer non-'David'/'Mark' voices if present
      const softer = enVoices.find(v => !/david|mark/i.test(v.name));
      return softer || enVoices[0] || voices[0] || null;
    } catch { return null; }
  };
  const preferred = getPreferredVoice();
  if (preferred) utterance.voice = preferred;

  utterance.onstart = () => {
    editor?.commands.focus();
    setSpeaking(true);
  };
  // Base index for highlighting when reading only the selected portion
  const selectionAbs = selected ? getSelectionAbsoluteRangeIndices() : null;
  const baseOffset = selectionAbs ? selectionAbs.startAbs : 0;

  utterance.onboundary = (e) => {
    // Highlight word as it is spoken (Chrome supports word boundaries)
    try {
      if (typeof e.charIndex === "number") {
        highlightWordByCharIndex(baseOffset + e.charIndex);
      }
    } catch {}
  };
  utterance.onend = () => {
    clearReadingHighlight();
    setSpeaking(false);
  };
  utterance.onerror = () => {
    clearReadingHighlight();
    setSpeaking(false);
  };

  setSpeechUtterance(utterance);
  window.speechSynthesis.speak(utterance);
};
const stopReading = () => {
  window.speechSynthesis.cancel();
  setSpeaking(false);
  clearReadingHighlight();
};

const readSelection = () => {
  const { from, to } = editor.state.selection;
  if (from === to) return;

  const text = editor.state.doc.textBetween(from, to, " ");
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
};


useEffect(() => {
    if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content || "");
    }
}, [content, editor]);

useEffect(() => {
  localStorage.setItem("draft_note", JSON.stringify({ title, content }));
}, [title, content]);

useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("draft_note"));
  if (saved) {
    setTitle(saved.title || "");
    setContent(saved.content || "");
  }
}, []);


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
                <input
  type="text"
  placeholder="Search notes..."
  value={query}
  onChange={handleSearchChange}
  className="border p-2 rounded w-full mb-3"
/>
<button
  onClick={searchNotes}
  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium shadow-md mb-6"
>
  Search
</button>

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
  className="flex gap-2 mb-2"
  onClick={(e) => e.stopPropagation()}
>
  <button
   type="button"
  onClick={() => editor?.chain().focus().toggleBold().run()}
  className={`editor-btn ${
    editor?.isActive("bold") ? "editor-btn-active" : ""
  }`}
  >
    B
  </button>
<button
  type="button"
  onClick={() => editor?.chain().focus().toggleItalic().run()}
  className={`editor-btn ${
    editor?.isActive("italic") ? "editor-btn-active" : ""
  }`}
>
  I
</button>
 <button
  type="button"
  onClick={() => editor?.chain().focus().toggleBulletList().run()}
  className={`editor-btn ${
    editor?.isActive("bulletList") ? "editor-btn-active" : ""
  }`}
>
  • List
</button>


  <button
  type="button"
  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
  className={`editor-btn ${
    editor?.isActive("orderedList") ? "editor-btn-active" : ""
  }`}
>
  1. List
</button>

</div>
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
      prose prose-sm max-w-none
      [&_.ProseMirror]:outline-none
      [&_.ProseMirror]:border-none
      [&_.ProseMirror]:shadow-none
      [&_.ProseMirror]:p-2
      [&_.ProseMirror_p]:my-2
      [&_.ProseMirror_ul]:list-disc
      [&_.ProseMirror_ul]:ml-6
      [&_.ProseMirror_ul]:my-2
      [&_.ProseMirror_ol]:list-decimal
      [&_.ProseMirror_ol]:ml-6
      [&_.ProseMirror_ol]:my-2
      [&_.ProseMirror_li]:ml-2
      [&_.ProseMirror_li]:my-1
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
                            </>
                        ) : (
                            <button
                                onClick={addNote}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                            >
                                Add Note
                            </button>
                        )}
                        {/* Mic: Start/Stop toggle */}
                        <button
                          onClick={() => (listening ? stopListening() : startListening())}
                          className={`px-4 py-2 rounded-lg shadow-md font-medium transition ${
                            listening
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                          }`}
                        >
                          {listening ? "⏹ Stop Voice" : "🎙️ Start Voice"}
                        </button>
                        {/* Read / Stop Read toggle */}
                        <button
                          onClick={() => (speaking ? stopReading() : startReading())}
                          className={`px-4 py-2 rounded-lg shadow-md font-medium transition ${
                            speaking
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                        >
                          {speaking ? "⏹ Stop Read" : "🔊 Read"}
                        </button>
                        <button
                            onClick={() => {
                               const ok = window.confirm("Clear current note content? This cannot be undone.");
                               if (!ok) return;
                               setTitle("");
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
  {notes.length === 0 ? (
    <p className="col-span-full text-center text-slate-400 italic">
      No notes found
    </p>
  ) : (
    notes.map((n) => (
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
    ))
  )}
</div>

            </div>
        </div>
    );
}
