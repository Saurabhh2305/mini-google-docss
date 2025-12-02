import { Server } from "socket.io";

export const registerNoteCollaborationHandlers = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("join-note", (noteId: string) => {
      socket.join(noteId);
      socket.to(noteId).emit("user-joined", socket.id);
    });

    socket.on("note-update", ({ noteId, content }) => {
      socket.to(noteId).emit("note-update", { content });
    });

    socket.on("disconnect", () => {
      console.log("🔌 User disconnected:", socket.id);
    });
  });
};
