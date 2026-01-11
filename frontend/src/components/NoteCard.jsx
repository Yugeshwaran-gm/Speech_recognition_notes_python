import { useState } from "react";

const NoteCard = ({ note, updateNote, deleteNote }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);

    const saveChanges = () => {
        updateNote(note.id, title, content);
        setIsEditing(false);
    };

    return (
        <div className="bg-[rgb(255,255,255)] shadow p-4 rounded-lg border border-[rgb(226,232,240)]">
            {isEditing ? (
                <>
                    <input
                        type="text"
                        className="w-full border border-[rgb(226,232,240)] p-2 rounded mb-2 text-[rgb(15,23,42)]"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        className="w-full border border-[rgb(226,232,240)] p-2 rounded mb-2 h-24 resize-none text-[rgb(15,23,42)]"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={saveChanges}
                            className="bg-[rgb(45,106,79)] text-white px-3 py-1 rounded hover:bg-[rgb(27,67,50)]"
                        >
                            Save
                        </button>

                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-[rgb(100,116,139)] text-white px-3 py-1 rounded hover:bg-[rgb(51,65,85)]"
                        >
                            Cancel
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <h3 className="text-xl font-semibold mb-2 text-[rgb(15,23,42)]">{note.title}</h3>
                    <p className="text-[rgb(100,116,139)] mb-3">{note.content}</p>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-[rgb(45,106,79)] text-white px-3 py-1 rounded hover:bg-[rgb(27,67,50)]"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => deleteNote(note.id)}
                            className="bg-[rgb(239,68,68)] text-white px-3 py-1 rounded hover:bg-[rgb(220,38,38)]"
                        >
                            Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default NoteCard;
