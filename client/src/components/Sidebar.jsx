import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessage,
    setUnseenMessage,
  } = useContext(ChatContext);

  const { logout, onlineUsers, authUser } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const filteredUsers = input.trim()
    ? (users || []).filter((user) => user.fullName?.toLowerCase().includes(input.toLowerCase()))
    : users || [];

  useEffect(() => {
    if (authUser) getUsers();
  }, [authUser]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    if (unseenMessage[user._id]) {
      setUnseenMessage((prev) => ({ ...prev, [user._id]: 0 }));
    }
  };

  return (
    <div className="w-full h-full bg-[#1a162b]/95 backdrop-blur-xl p-4 flex flex-col text-white">
      {/* Header Container */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <img src={assets.logo} alt="logo" className="h-8 w-auto object-contain max-w-[140px]" />
        
        {/* Dropdown Menu Container */}
        <div className="relative group">
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors outline-none">
            <img src={assets.menu_icon} alt="menu" className="h-5 w-5 opacity-80 group-hover:opacity-100" />
          </button>
          
          <div className="absolute top-full right-0 mt-1 z-30 w-40 p-1.5 rounded-xl bg-[#231c3a] border border-white/10 shadow-2xl transition-all scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto origin-top-right">
            <button
              onClick={() => navigate("/profile")}
              className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              Edit Profile
            </button>
            <div className="h-px bg-white/5 my-1" />
            <button 
              onClick={logout} 
              className="w-full text-left px-3 py-2 text-sm text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Search Input Filter Container */}
      <div className="my-4">
        <div className="bg-[#282142] border border-white/5 focus-within:border-violet-500/50 rounded-xl flex items-center gap-2.5 py-2.5 px-3.5 transition-all">
          <img src={assets.search_icon} alt="Search" className="w-3.5 h-3.5 opacity-60" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-white text-sm placeholder-gray-400/80 flex-1"
            placeholder="Search users..."
          />
        </div>
      </div>

      {/* Dynamic Users List Thread View */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-sm">
            <p>No conversations found</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isSelected = selectedUser?._id === user._id;
            const isOnline = onlineUsers.includes(user._id);
            const unreadCount = unseenMessage[user._id] || 0;

            return (
              <div
                onClick={() => handleUserClick(user)}
                key={user._id}
                className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? "bg-violet-600/30 border border-violet-500/30 text-white" 
                    : "hover:bg-white/5 text-gray-300 hover:text-white border border-transparent"
                }`}
              >
                {/* Avatar Visual Ring Anchor */}
                <div className="relative flex-shrink-0">
                  <img 
                    src={user?.profilePic || assets.avatar_icon} 
                    alt={user?.fullName} 
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-white/10 transition-all" 
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-[#1a162b]" />
                  )}
                </div>

                {/* Profile Metadata Stack */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user?.fullName}</p>
                  <span className={`text-xs block mt-0.5 ${isOnline ? "text-green-400/90 font-light" : "text-gray-400/70"}`}>
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>

                {/* Notification Unread Counter Badge */}
                {unreadCount > 0 && (
                  <span className="flex-shrink-0 min-w-5 h-5 px-1.5 flex justify-center items-center rounded-full bg-violet-500 text-[11px] font-bold shadow-md text-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Sidebar;
