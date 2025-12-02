import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadNotes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notes");
      setNotes(res.data); // assume array
    } catch (err) {
      setError("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    try {
      const res = await api.post("/notes", { title });
      setTitle("");
      navigate(`/notes/${res.data._id || res.data.id}`);
    } catch (err) {
      setError("Failed to create note");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id && n.id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Your Notes
              </h1>
              <p className="text-sm text-slate-500">
                Create, edit and collaborate in real-time.
              </p>
            </div>

            <form
              onSubmit={handleCreate}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <input
                type="text"
                className="flex-1 sm:flex-none sm:w-56 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="New note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {creating ? "Creating..." : "New Note"}
              </button>
            </form>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-slate-500">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="text-sm text-slate-500">
              No notes yet. Create your first note.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => {
                const id = note._id || note.id;
                return (
                  <div
                    key={id}
                    className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      <h2 className="font-semibold text-slate-900 line-clamp-2">
                        {note.title || "Untitled note"}
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Updated{" "}
                        {note.updatedAt
                          ? new Date(note.updatedAt).toLocaleString()
                          : "-"}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <div className="flex gap-2">
                        <Link
                          to={`/notes/${id}`}
                          className="text-xs px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          Open
                        </Link>
                        <Link
                          to={`/shared/${id}`}
                          className="text-xs px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
                        >
                          Share
                        </Link>
                      </div>
                      <button
                        onClick={() => handleDelete(id)}
                        className="text-xs px-2 py-1.5 rounded-md text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
