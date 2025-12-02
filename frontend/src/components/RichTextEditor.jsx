import React, { useRef, useEffect } from "react";

const RichTextEditor = ({ value, onChange, readOnly }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleCommand = (cmd, arg = null) => {
    if (readOnly) return;
    document.execCommand(cmd, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="flex flex-col h-full border border-slate-200 rounded-lg bg-white">
      {!readOnly && (
        <div className="flex flex-wrap gap-2 px-3 py-2 border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => handleCommand("bold")}
            className="text-sm px-2 py-1 rounded border border-slate-200 hover:bg-slate-100"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => handleCommand("italic")}
            className="text-sm px-2 py-1 rounded border border-slate-200 hover:bg-slate-100"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => handleCommand("underline")}
            className="text-sm px-2 py-1 rounded border border-slate-200 hover:bg-slate-100"
          >
            U
          </button>
          <button
            type="button"
            onClick={() => handleCommand("insertUnorderedList")}
            className="text-sm px-2 py-1 rounded border border-slate-200 hover:bg-slate-100"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => handleCommand("formatBlock", "<h2>")}
            className="text-sm px-2 py-1 rounded border border-slate-200 hover:bg-slate-100"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => handleCommand("formatBlock", "<h3>")}
            className="text-sm px-2 py-1 rounded border border-slate-200 hover:bg-slate-100"
          >
            H3
          </button>
        </div>
      )}

      <div
        ref={editorRef}
        className={`flex-1 px-4 py-3 outline-none overflow-y-auto prose max-w-none ${
          readOnly ? "bg-slate-50" : "bg-white"
        }`}
        contentEditable={!readOnly}
        onInput={handleInput}
        suppressContentEditableWarning={true}
        style={{ minHeight: "300px" }}
      />
    </div>
  );
};

export default RichTextEditor;
