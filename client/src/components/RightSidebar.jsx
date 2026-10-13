import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { onlineUsers } = useContext(AuthContext);

  // NEW STATE: Tracks which image is currently opened in full screen preview
  const [activePreviewImage, setActivePreviewImage] = useState(null);

  const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  // DYNAMIC FILTER: Scan the conversation array and extract only messages containing shared images
  const sharedImages = (messages || [])
    .filter((msg) => msg.image)
    .map((msg) => msg.image);

  return selectedUser ? (
    <div className="w-full h-full bg-[#16122c]/95 backdrop-blur-xl p-6 flex flex-col text-white overflow-y-auto custom-scrollbar relative">
      {/* Target Member Profile Summary Stack */}
      <div className="flex flex-col items-center text-center mt-6 space-y-3">
        <div className="relative">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt={selectedUser?.fullName}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-white/5 shadow-xl"
          />
          {isOnline && (
            <span className="absolute bottom-1 right-1 block h-3.5 w-3.5 rounded-full bg-green-400 ring-2 ring-[#16122c]" />
          )}
        </div>

        <div className="space-y-1 px-2">
          <h2 className="text-lg font-semibold tracking-wide text-white truncate max-w-[240px]">
            {selectedUser?.fullName}
          </h2>
          <p className="text-xs text-violet-400/90 font-light">
            {isOnline ? "Active Status: Online" : "Status: Offline"}
          </p>
        </div>

        {selectedUser?.bio && (
          <p className="text-xs text-gray-400/80 font-light max-w-[240px] px-2 leading-relaxed break-words bg-white/[0.02] border border-white/5 p-2.5 rounded-xl">
            {selectedUser.bio}
          </p>
        )}
      </div>

      <div className="h-px bg-white/5 my-6" />

      {/* Shared Media Content Grid Gallery Container */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between text-xs font-medium tracking-wider text-gray-400 uppercase mb-3">
          <span>Shared Media</span>
          <span className="text-[10px] lowercase opacity-60">
            ({sharedImages.length} items)
          </span>
        </div>

        {/* DYNAMIC GRID: Displays actual chat images or fallback notice */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-3 gap-2 auto-rows-max custom-scrollbar opacity-90">
          {sharedImages.length > 0 ? (
            sharedImages.map((url, index) => (
              <div
                key={index}
                onClick={() => setActivePreviewImage(url)}
                className="group relative aspect-square cursor-pointer rounded-lg overflow-hidden border border-white/5 bg-white/[0.02]"
              >
                <img
                  src={url}
                  alt="Shared history asset"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded backdrop-blur-sm text-white">
                    View
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-xs text-gray-500 py-12 font-light bg-white/[0.01] rounded-xl border border-dashed border-white/5">
              <p>No photos or media shared</p>
              <p className="text-[10px] opacity-60 mt-1">
                Images you exchange will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Glassmorphic Media Lightbox Modal for Right Sidebar */}
      {activePreviewImage && (
        <div
          onClick={() => setActivePreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setActivePreviewImage(null)}
            className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full p-2.5 transition-colors cursor-pointer outline-none shadow-lg"
          >
            <svg
              xmlns="http://w3.org"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l18 18"
              />
            </svg>
          </button>

          <img
            src={activePreviewImage}
            alt="Expanded attachment view"
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/5 transform scale-100 transition-transform duration-300 select-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  ) : null;
};

export default RightSidebar;
