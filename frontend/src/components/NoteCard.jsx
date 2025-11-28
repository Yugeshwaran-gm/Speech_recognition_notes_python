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
        <div className="bg-white shadow p-4 rounded-lg">
            {isEditing ? (
                <>
                    <input
                        type="text"
                        className="w-full border p-2 rounded mb-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        className="w-full border p-2 rounded mb-2 h-24 resize-none"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={saveChanges}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                            Save
                        </button>

                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
                    <p className="text-gray-700 mb-3">{note.content}</p>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => deleteNote(note.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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
