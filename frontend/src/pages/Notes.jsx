import { useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/authContext";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Sidebar from "../components/Sidebar";
import NotesHeader from "../components/NotesHeader";
import RightPanel from "../components/RightPanel";
import CalendarWidget from "../components/CalendarWidget";


export default function Notes() {
    const { logout } = useContext(AuthContext);

    const [notes, setNotes] = useState([]);
    const [filter, setFilter] = useState("All");
    const [title, setTitle] = useState("");     // UI title
    const [content, setContent] = useState(""); // UI content
    const [editingId, setEditingId] = useState(null);
    const [listening, setListening] = useState(false);
    const [livePreview, setLivePreview] = useState("");
    const [lastCommandTime, setLastCommandTime] = useState(0);
    const [speaking, setSpeaking] = useState(false);
    const [speechUtterance, setSpeechUtterance] = useState(null);
    const [query, setQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState(null); // yyyy-mm-dd
    const [isCommandOpen, setIsCommandOpen] = useState(false);
    const COMMAND_COOLDOWN = 1200; 
    const [titleFocused, setTitleFocused] = useState(false);



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

    const formatDateKey = (value) => {
      if (!value) return null;
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return null;
      return d.toLocaleDateString("en-CA");
    };

    const noteDateCounts = useMemo(() => {
      const map = {};
      notes.forEach((n) => {
        const key = formatDateKey(n.created_at);
        if (key) {
          map[key] = (map[key] || 0) + 1;
        }
      });
      return map;
    }, [notes]);

    const filteredNotes = useMemo(() => {
      if (!selectedDate) return notes;
      return notes.filter((n) => formatDateKey(n.created_at) === selectedDate);
    }, [notes, selectedDate]);
  
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
        }),
        Underline,
        TextAlign.configure({
            types: ["heading", "paragraph"],
            defaultAlignment: "left"
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
    editor
      .chain()
      .focus()
      .toggleBold()
      .insertContent(value + " ")
      .toggleBold()
      .run();
    setLastCommandTime(now);
    return;
  }

  // ---- ITALIC ----
  if (text.startsWith("italic ")) {
    const value = spokenText.slice(7);
    editor
      .chain()
      .focus()
      .toggleItalic()
      .insertContent(value + " ")
      .toggleItalic()
      .run();
    setLastCommandTime(now);
    return;
  }

  // ---- BULLET ----
  if (text === "bullet point") {
    editor.chain().focus().toggleBulletList().run();
    editor.commands.enter();
    setLastCommandTime(now);
    return;
  }

  // ---- NEXT LINE ----
  if (text === "next line") {
    editor.commands.enter();
    setLastCommandTime(now);
    return;
  }
  // ---- READ ALOUD ----
  if (text.includes("read") || text.includes("start reading")) {
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

// Link feature removed as requested

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
        <div className="h-screen bg-[rgb(242,245,243)] text-[rgb(47,62,70)] flex overflow-hidden">

            {/* MAIN CENTER CONTENT */}
            <main className="flex-1 flex flex-col h-full overflow-y-auto relative p-8 lg:p-12 scroll-smooth">
                
                {/* Header */}
                <header className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="bg-[rgb(45,106,79)] p-2.5 rounded shadow-md">
                            <span className="material-symbols-outlined text-white text-xl">mic</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight text-[rgb(20,30,25)] font-serif italic">EchoNote</h2>
                            <p className="text-[10px] uppercase tracking-widest text-[rgb(45,106,79)] font-bold">Where Your Thoughts Echo Back</p>
                        </div>
                    </div>
                    <NotesHeader
                        query={query}
                        onQueryChange={handleSearchChange}
                        onSearch={searchNotes}
                    />
                </header>

                {/* Main Content Flex Container */}
                <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full space-y-20">
                    
                    {/* Editor Section */}
                    <section className="max-w-3xl mx-auto w-full">
                        <div className="mb-10 text-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[rgb(45,106,79)] mb-3 block">
                                {editingId ? "Edit Note" : "Create New"}
                            </span>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onFocus={() => setTitleFocused(true)}
                                onBlur={() => setTitleFocused(false)}
                                placeholder="Title"
                                className={`w-full bg-transparent border-none text-4xl font-serif font-bold text-[rgb(20,30,25)] placeholder-[rgb(100,116,139)]/40 focus:outline-none mb-3 ${titleFocused ? "text-left" : "text-center"}`}
                            />
                            {listening && (
                                <div className="flex justify-center items-center gap-3">
                                    <span className="size-2 rounded-full bg-[rgb(45,106,79)] animate-pulse"></span>
                                    <p className="text-[rgb(45,106,79)]/60 text-xs font-medium italic tracking-wide">
                                        Listening...
                                    </p>
                                </div>
                            )}
                        </div>
                            <div className="editor-toolbar flex items-center gap-2 px-4 py-3 border border-[rgb(45,106,79)]/10 bg-white/60 rounded-t-sm">
                                <button
                                    className={`format-btn flex items-center justify-center size-9 rounded transition-colors ${
                                        editor?.isActive("bold") ? "bg-[rgb(242,245,243)] text-[rgb(45,106,79)]" : "text-[rgb(47,62,70)] hover:bg-[rgb(242,245,243)]"
                                    }`}
                                    title="Bold"
                                    onClick={() => editor?.chain().focus().toggleBold().run()}
                                >
                                    <span className="material-symbols-outlined text-[20px]">format_bold</span>
                                </button>

                                <button
                                    className={`format-btn flex items-center justify-center size-9 rounded transition-colors ${
                                        editor?.isActive("italic") ? "bg-[rgb(242,245,243)] text-[rgb(45,106,79)]" : "text-[rgb(47,62,70)] hover:bg-[rgb(242,245,243)]"
                                    }`}
                                    title="Italic"
                                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                                >
                                    <span className="material-symbols-outlined text-[20px]">format_italic</span>
                                </button>

                                <button
                                    className={`format-btn flex items-center justify-center size-9 rounded transition-colors ${
                                        editor?.isActive("underline") ? "bg-[rgb(242,245,243)] text-[rgb(45,106,79)]" : "text-[rgb(47,62,70)] hover:bg-[rgb(242,245,243)]"
                                    }`}
                                    title="Underline"
                                    onClick={() => editor?.chain().focus().toggleUnderline().run()}
                                >
                                    <span className="material-symbols-outlined text-[20px]">format_underlined</span>
                                </button>

                                <button
                                    className={`format-btn flex items-center justify-center size-9 rounded transition-colors ${
                                        editor?.isActive("strike") ? "bg-[rgb(242,245,243)] text-[rgb(45,106,79)]" : "text-[rgb(47,62,70)] hover:bg-[rgb(242,245,243)]"
                                    }`}
                                    title="Strikethrough"
                                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                                >
                                    <span className="material-symbols-outlined text-[20px]">format_strikethrough</span>
                                </button>

                                <div className="w-px h-6 bg-[rgb(45,106,79)]/10 mx-2" />

                                <button
                                    className={`format-btn flex items-center justify-center size-9 rounded transition-colors ${
                                        editor?.isActive("bulletList") ? "bg-[rgb(242,245,243)] text-[rgb(45,106,79)]" : "text-[rgb(47,62,70)] hover:bg-[rgb(242,245,243)]"
                                    }`}
                                    title="Bulleted List"
                                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                >
                                    <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
                                </button>

                                <button
                                    className={`format-btn flex items-center justify-center size-9 rounded transition-colors ${
                                        editor?.isActive("orderedList") ? "bg-[rgb(242,245,243)] text-[rgb(45,106,79)]" : "text-[rgb(47,62,70)] hover:bg-[rgb(242,245,243)]"
                                    }`}
                                    title="Numbered List"
                                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                >
                                    <span className="material-symbols-outlined text-[20px]">format_list_numbered</span>
                                </button>

                                <div className="w-px h-6 bg-[rgb(45,106,79)]/10 mx-2" />

                                <button
                                    className={`format-btn flex items-center justify-center size-9 rounded transition-colors ${
                                        editor?.isActive({ textAlign: "left" }) ? "bg-[rgb(242,245,243)] text-[rgb(45,106,79)]" : "text-[rgb(47,62,70)] hover:bg-[rgb(242,245,243)]"
                                    }`}
                                    title="Align Left"
                                    onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                                >
                                    <span className="material-symbols-outlined text-[20px]">format_align_left</span>
                                </button>

                                <button
                                    className={`format-btn flex items-center justify-center size-9 rounded transition-colors ${
                                        editor?.isActive({ textAlign: "justify" }) ? "bg-[rgb(242,245,243)] text-[rgb(45,106,79)]" : "text-[rgb(47,62,70)] hover:bg-[rgb(242,245,243)]"
                                    }`}
                                    title="Align Justify"
                                    onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
                                >
                                    <span className="material-symbols-outlined text-[20px]">format_align_justify</span>
                                </button>
                            </div>
                        {/* Editor Paper Texture Card */}
                        <div className="relative bg-white bg-[url('https://www.transparenttextures.com/patterns/felt.png')] border-[rgb(45,106,79)]/10 border-x border-b rounded-b-sm p-14 shadow-xl min-h-[500px] flex flex-col">
                            
                          {/* Editor Content */}
                            <div
                                className="flex-1 overflow-y-auto cursor-text focus-within:outline-none"
                                onClick={() => editor?.commands.focus()}
                            >
                                <EditorContent
                                    editor={editor}
                                    className="
                                        outline-none
                                        border-none
                                        shadow-none
                                        prose prose-sm max-w-none text-[rgb(20,30,25)]
                                        font-serif text-xl leading-relaxed
                                        [&_.ProseMirror]:outline-none
                                        [&_.ProseMirror]:border-none
                                        [&_.ProseMirror]:shadow-none
                                        [&_.ProseMirror]:p-0
                                        [&_.ProseMirror_p]:my-4
                                        [&_.ProseMirror_ul]:list-disc
                                        [&_.ProseMirror_ul]:ml-6
                                        [&_.ProseMirror_ul]:my-4
                                        [&_.ProseMirror_ol]:list-decimal
                                        [&_.ProseMirror_ol]:ml-6
                                        [&_.ProseMirror_ol]:my-4
                                        [&_.ProseMirror_li]:ml-2
                                        [&_.ProseMirror_li]:my-2
                                    "
                                />
                            </div>

                            {/* {listening && livePreview && (
                                <p className="text-[rgb(100,116,139)] italic mt-4 pt-4 border-t border-[rgb(45,106,79)]/10">
                                    <span className="font-semibold">Listening:</span> {livePreview}
                                </p>
                            )} */}

                            {/* Action Buttons - Floating Bottom Bar */}
                            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-[rgb(47,62,70)] text-white px-10 py-4 rounded-full shadow-2xl flex items-center justify-center gap-10 ring-4 ring-[rgb(45,106,79)]/5 z-10">
                                
                                <button
                                    onClick={() => {
                                        const ok = window.confirm("Annotate this note?");
                                        if (ok) {
                                            // Annotation logic here
                                        }
                                    }}
                                    className="flex flex-col items-center gap-1 group"
                                    title="Annotate"
                                >
                                    <span className="material-symbols-outlined text-white/80 group-hover:text-white transition-colors text-2xl">edit_note</span>
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-white/60 group-hover:text-white/90">Annotate</span>
                                </button>

                                <button
                                    onClick={() => {
                                        const ok = window.confirm("Clear current note content? This cannot be undone.");
                                        if (!ok) return;
                                        setTitle("");
                                        editor?.commands.clearContent();
                                        setEditingId(null);
                                    }}
                                    className="flex flex-col items-center gap-1 group"
                                    title="Clear"
                                >
                                    <span className="material-symbols-outlined text-white/80 group-hover:text-white transition-colors text-2xl">delete_outline</span>
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-white/60 group-hover:text-white/90">Clear</span>
                                </button>

                                {/* Center Mic Button - Larger & Green */}
                                <button
                                    onClick={() => (listening ? stopListening() : startListening())}
                                    className={`${
                                        listening
                                            ? "bg-[rgb(52,211,153)] shadow-lg shadow-[rgb(52,211,153)]/60 animate-pulse"
                                            : "bg-[rgb(52,211,153)] hover:bg-[rgb(45,190,145)]"
                                    } w-16 h-16 rounded-full flex items-center justify-center relative group hover:scale-110 transition-all flex-shrink-0`}
                                    title={listening ? "Stop Listening" : "Start Listening"}
                                >
                                    <span className="material-symbols-outlined text-white text-3xl">mic</span>
                                </button>

                                <button
                                    onClick={() => (speaking ? stopReading() : startReading())}
                                    className="flex flex-col items-center gap-1 group"
                                    title={speaking ? "Stop Reading" : "Start Reading"}
                                >
                                    <span className={`material-symbols-outlined transition-colors text-2xl ${
                                        speaking ? "text-[rgb(239,68,68)]" : "text-[rgb(52,211,153)]"
                                    } group-hover:scale-110`}>
                                        play_arrow
                                    </span>
                                    <span className={`text-[8px] font-bold uppercase tracking-widest ${
                                        speaking ? "text-[rgb(239,68,68)]" : "text-[rgb(52,211,153)]"
                                    }`}>
                                        Reading
                                    </span>
                                </button>

                                <button
                                    onClick={() => {
                                        const noteContent = `${title}\n\n${editor?.getText() || ""}`;
                                        const element = document.createElement("a");
                                        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(noteContent));
                                        element.setAttribute("download", `${title || "note"}.txt`);
                                        element.style.display = "none";
                                        document.body.appendChild(element);
                                        element.click();
                                        document.body.removeChild(element);
                                    }}
                                    className="flex flex-col items-center gap-1 group"
                                    title="Export"
                                >
                                    <span className="material-symbols-outlined text-white/80 group-hover:text-white transition-colors text-2xl">upload</span>
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-white/60 group-hover:text-white/90">Export</span>
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Recent Notes Section */}
                    <section className="w-full pb-20">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[rgb(45,106,79)]">history</span>
                                <h3 className="text-xl font-serif font-bold text-[rgb(20,30,25)]">Recent Notes</h3>
                            </div>
                        </div>

                        {selectedDate && (
                            <div className="flex items-center gap-2 text-sm text-[rgb(100,116,139)] mb-6">
                                <span>
                                    Showing notes for {new Date(selectedDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                                </span>
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="text-[rgb(45,106,79)] hover:text-[rgb(27,67,50)] underline"
                                >
                                    Clear
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredNotes.length === 0 ? (
                                <p className="col-span-full text-center text-[rgb(100,116,139)] italic">
                                    No notes found
                                </p>
                            ) : (
                                filteredNotes.map((n) => (
                                    <div
                                        key={n.id}
                                        className="bg-white/50 border border-[rgb(45,106,79)]/10 p-5 rounded-lg transition-all hover:bg-white hover:shadow-md hover:border-[rgb(45,106,79)]/20 group flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-[10px] font-bold text-[rgb(47,62,70)]/40 uppercase tracking-tighter">
                                                    {new Date(n.created_at).toLocaleDateString()}
                                                </span>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(n.original_text + "\n" + n.translated_text);
                                                            alert("Copied to clipboard!");
                                                        }}
                                                        className="text-[rgb(45,106,79)]/40 hover:text-[rgb(45,106,79)] transition-colors"
                                                        title="Copy All"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">content_copy</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <h4 className="font-serif font-bold text-[rgb(20,30,25)] text-lg mb-2 group-hover:text-[rgb(45,106,79)] transition-colors">
                                                {n.original_text}
                                            </h4>
                                            <p className="text-sm text-[rgb(47,62,70)]/70 leading-relaxed line-clamp-3 mb-4">
                                                {n.translated_text?.replace(/<[^>]*>/g, "") || "No content"}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEdit(n)}
                                                className="flex-1 bg-[rgb(45,106,79)] text-white px-3 py-2 rounded text-sm hover:bg-[rgb(27,67,50)] transition-all duration-200 font-medium shadow-md"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteNote(n.id)}
                                                className="flex-1 bg-[rgb(239,68,68)] text-white px-3 py-2 rounded text-sm hover:bg-[rgb(220,38,38)] transition-all duration-200 font-medium shadow-md"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </main>

            {/* RIGHT SIDEBAR */}
            <aside className="w-80 bg-[rgba(236,245,240,0.7)] backdrop-blur-md border-l border-[rgb(45,106,79)]/10 shadow-sm flex flex-col z-20 h-full overflow-y-auto">
                <div className="p-8 border-b border-[rgb(45,106,79)]/10 space-y-6 flex-1">
                    <CalendarWidget
                        noteDateCounts={noteDateCounts}
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                    />
                    
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[rgb(45,106,79)]/60 mb-4">
                            Acoustic Commands
                        </h4>
                        <div className="space-y-3">
                            <div className={`bg-white/60 p-5 rounded-lg border-l-4 transition-all cursor-pointer ${
                                listening
                                    ? "border-[rgb(45,106,79)] bg-white shadow-sm"
                                    : "border-transparent hover:border-[rgb(45,106,79)]/30"
                            }`}>
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-[9px] font-black text-[rgb(45,106,79)] uppercase tracking-wider italic">
                                        {listening ? "Listening..." : "Ready"}
                                    </p>
                                    <span className="material-symbols-outlined text-[rgb(45,106,79)]/40 text-sm">
                                        {listening ? "bolt" : "mic"}
                                    </span>
                                </div>
                                <p className="font-serif font-bold text-[rgb(20,30,25)] text-lg leading-tight">
                                    {listening ? "Speak now..." : '"Start voice note"'}
                                </p>
                            </div>

                            <div className="bg-white/30 p-5 rounded-lg border-l-4 border-transparent hover:border-[rgb(45,106,79)]/30 transition-all cursor-pointer">
                                <p className="text-[9px] font-bold text-[rgb(47,62,70)]/40 mb-1 uppercase tracking-wider">
                                    Common Command
                                </p>
                                <p className="font-serif font-bold text-[rgb(47,62,70)]/70 text-lg leading-tight">
                                    "Bold this text"
                                </p>
                            </div>

                            <div className="bg-white/30 p-5 rounded-lg border-l-4 border-transparent hover:border-[rgb(45,106,79)]/30 transition-all cursor-pointer">
                                <p className="text-[9px] font-bold text-[rgb(47,62,70)]/40 mb-1 uppercase tracking-wider">
                                    Common Command
                                </p>
                                <p className="font-serif font-bold text-[rgb(47,62,70)]/70 text-lg leading-tight">
                                    "Read aloud"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 bg-[rgb(45,106,79)]/5 border-t border-[rgb(45,106,79)]/10 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="size-2.5 rounded-full bg-[rgb(45,106,79)] shadow-[0_0_10px_rgba(45,106,79,0.5)]"></div>
                            <span className="text-[10px] font-black text-[rgb(20,30,25)] uppercase tracking-widest">
                                {speaking ? "Reading: ON" : "Ready"}
                            </span>
                        </div>
                        <span className="text-[10px] font-bold text-[rgb(45,106,79)]/40">V.1.0-ECHO</span>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-between py-4 px-6 bg-[rgb(47,62,70)] text-white rounded-md hover:bg-[rgb(45,106,79)] transition-all group shadow-lg"
                    >
                        <span className="text-xs font-black uppercase tracking-widest">End Session</span>
                        <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">logout</span>
                    </button>
                </div>
            </aside>

        </div>
    );
}
