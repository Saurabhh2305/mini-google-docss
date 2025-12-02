import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import RichTextEditor from "../components/RichTextEditor";
import api from "../services/api";

const SharedNote = () => {
  const { noteId } = useParams();
  const [note, setNote] = useState(null);
  const [role, setRole] = useState("viewer");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/notes/${noteId}/shared`);
        setNote(res.data.note);
        setRole(res.data.role || "viewer");
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [noteId]);

  const isViewer = role === "viewer";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-xl font-semibold">
              {note?.title || "Shared note"}
            </h1>
            <span className="text-xs text-slate-500 capitalize">
              Access: {role}
            </span>
          </div>

          <RichTextEditor
            value={note?.content || ""}
            onChange={() => {}}
            readOnly={true} // shared link yaha sirf read-only rakha; agar editor share hua toh NoteEditor page se open karwana better
          />

          <p className="text-xs text-slate-500 mt-2">
            This is a shared view. To collaborate in real-time, open the note
            from your dashboard.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SharedNote;
