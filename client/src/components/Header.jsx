import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="bg-gradient-to-r from-[#080808] to-[#056af05b] via-white shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-5">
        {/* Logo Section */}
        <Link to="/">
          <h1 className="font-serif text-slate-800 text-3xl font-semibold rounded-lg cursor-pointer hover:text-blue-600 transition-colors">
            Social
          </h1>
        </Link>
        
        {/* Navigation Links */}
        <ul className="flex gap-6 items-center">
          <Link to="/" className="mt-2 text-lg font-medium opacity-70 hover:text-blue-600 transition-colors cursor-pointer">
            Post
          </Link>

          {/* User Profile Section */}
          <Link to="/profile" className="flex gap-3 items-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUA61gIlA_YnqrwGhxKIffyTO-f8B1V44Y9ypZDKV2pQ&s"
              alt="User Avatar"
              className="w-10 h-10 object-cover rounded-full"
            />
            <div className="text-left">
              <h1 className="text-gray-700 font-semibold">user344</h1>
              <h2 className="text-slate-600 text-sm">user344@gmail.com</h2>
            </div>
          </Link>
        </ul>
      </div>
    </div>
  );
}
