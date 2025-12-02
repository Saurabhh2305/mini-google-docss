import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import RichTextEditor from "../components/RichTextEditor";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const AUTO_SAVE_DELAY = 2000; // ms

const NoteEditor = () => {
  const { noteId } = useParams();
  const { accessToken, user } = useAuth();
  const [note, setNote] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [saving, setSaving] = useState(false);
  const [versions, setVersions] = useState([]);
  const [role, setRole] = useState("editor"); // assume API bhi bhej raha hai
  const socketRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // load note
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${noteId}`);
        setNote(res.data);
        if (res.data.role) setRole(res.data.role);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchVersions = async () => {
      try {
        const res = await api.get(`/notes/${noteId}/versions`);
        setVersions(res.data || []);
      } catch (err) {
        // optional, ignore
      }
    };
    fetchNote();
    fetchVersions();
  }, [noteId]);

  // socket connection
  useEffect(() => {
    if (!accessToken || !noteId) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      auth: {
        token: accessToken,
      },
    });

    socketRef.current = socket;

    socket.emit("join-note", { noteId });

    socket.on("note-updated", (updated) => {
      setNote((prev) => {
        if (!prev || updated.updatedAt > (prev.updatedAt || "")) {
          return { ...prev, ...updated };
        }
        return prev;
      });
    });

    socket.on("active-users", (users) => {
      setCollaborators(users);
    });

    return () => {
      socket.emit("leave-note", { noteId });
      socket.disconnect();
    };
  }, [noteId, accessToken]);

  const emitUpdate = (updatedFields) => {
    if (!socketRef.current) return;
    socketRef.current.emit("update-note", {
      noteId,
      ...updatedFields,
    });
  };

  const scheduleSave = (updated) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setSaving(true);
        const res = await api.put(`/notes/${noteId}`, updated);
        setNote(res.data);
      } catch (err) {
        console.error("autosave failed", err);
      } finally {
        setSaving(false);
      }
    }, AUTO_SAVE_DELAY);
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setNote((prev) => ({ ...prev, title: value }));
    emitUpdate({ title: value });
    scheduleSave({ title: value, content: note?.content || "" });
  };

  const handleContentChange = (html) => {
    setNote((prev) => ({ ...prev, content: html }));
    emitUpdate({ content: html });
    scheduleSave({ title: note?.title || "", content: html });
  };

  const handleRestoreVersion = async (versionId) => {
    if (!window.confirm("Restore this version?")) return;
    try {
      const res = await api.post(`/notes/${noteId}/restore`, { versionId });
      setNote(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to restore version");
    }
  };

  const isViewer = role === "viewer";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col lg:flex-row gap-4">
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={note?.title || ""}
                onChange={handleTitleChange}
                disabled={isViewer}
                placeholder="Untitled note"
                className="flex-1 text-xl font-semibold border-0 bg-transparent focus:outline-none focus:ring-0"
              />
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">
                  Role:{" "}
                  <span className="font-medium capitalize text-slate-700">
                    {role}
                  </span>
                </span>
                <span className="text-xs text-slate-500">
                  {saving ? "Saving..." : "All changes saved"}
                </span>
              </div>
            </div>

            <RichTextEditor
              value={note?.content || ""}
              onChange={handleContentChange}
              readOnly={isViewer}
            />

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-medium">Active collaborators:</span>
              {collaborators.length === 0 && <span>Only you</span>}
              {collaborators.map((c) => (
                <span
                  key={c.userId}
                  className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700"
                >
                  {c.name || c.userId}
                  {user && c.userId === user.id && " (you)"}
                </span>
              ))}
            </div>
          </div>

          {/* Version history */}
          <aside className="w-full lg:w-64 bg-white border border-slate-200 rounded-lg p-3 h-fit max-h-[450px] flex flex-col">
            <h2 className="text-sm font-semibold text-slate-800">
              Version history
            </h2>
            <p className="text-xs text-slate-500 mb-2">
              Auto-save creates versions over time.
            </p>

            <div className="flex-1 overflow-y-auto space-y-2 text-xs">
              {versions && versions.length > 0 ? (
                versions.map((v) => (
                  <div
                    key={v._id || v.id}
                    className="border border-slate-200 rounded-md px-2 py-1.5 flex flex-col gap-1"
                  >
                    <span className="font-medium">
                      {new Date(v.createdAt).toLocaleString()}
                    </span>
                    <span className="text-slate-500">
                      By: {v.user?.name || "Unknown"}
                    </span>
                    <button
                      onClick={() => handleRestoreVersion(v._id || v.id)}
                      className="mt-1 self-start text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      Restore
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No versions yet.</p>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default NoteEditor;
