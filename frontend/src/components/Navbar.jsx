import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="inline-block w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
            N
          </span>
          <span className="font-semibold text-lg text-slate-800">
            Mini Notes
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 hidden sm:block">
              {user.name}
            </span>
            <button
              onClick={logout}
              className="text-sm px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
