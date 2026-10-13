import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const scrollEnd = useRef();

  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();

    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  return selectedUser ? (
    <div className="w-full h-full flex flex-col relative text-white transition-all duration-300">
      {/* -------- Header Bar ------------- */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-3.5">
          {/* Back button for mobile viewports */}
          <button
            onClick={() => setSelectedUser(null)}
            className="md:hidden p-1.5 hover:bg-white/5 rounded-full transition-colors cursor-pointer"
          >
            <img
              src={assets.arrow_icon}
              alt="Back"
              className="w-5 h-5 invert opacity-80"
            />
          </button>

          <div className="relative">
            <img
              src={selectedUser.profilePic || assets.avatar_icon}
              alt={selectedUser.fullName}
              className="w-10 h-10 object-cover rounded-full ring-2 ring-white/5"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-[#130f22]" />
            )}
          </div>

          <div>
            <h2 className="text-base font-semibold leading-tight tracking-wide">
              {selectedUser.fullName}
            </h2>
            <span
              className={`text-xs ${isOnline ? "text-green-400/90 font-light" : "text-gray-400/60"}`}
            >
              {isOnline ? "Active now" : "Offline"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors opacity-70 hover:opacity-100 hidden md:block">
            <img src={assets.help_icon} alt="Help" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ------------ Scrollable Message Feed Area ------------- */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-gray-500 text-sm space-y-1">
            <p className="font-light">No messages here yet.</p>
            <p className="text-xs opacity-60">
              Say hello to start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMyMessage = msg.senderId === authUser?._id;

            return (
              <div
                key={msg._id || index}
                className={`flex items-end gap-2.5 ${isMyMessage ? "justify-end" : "justify-start"}`}
              >
                {!isMyMessage && (
                  <img
                    src={selectedUser?.profilePic || assets.avatar_icon}
                    alt=""
                    className="w-6 h-6 object-cover rounded-full mb-1 flex-shrink-0"
                  />
                )}

                <div
                  className={`flex flex-col max-w-[70%] space-y-1 ${isMyMessage ? "items-end" : "items-start"}`}
                >
                  {msg.image ? (
                    <div className="relative group max-w-[260px] rounded-2xl overflow-hidden border border-white/10 shadow-lg mt-1">
                      <img
                        src={msg.image}
                        alt="Shared attachment"
                        className="w-full h-auto max-h-60 object-cover group-hover:scale-[1.02] transition-transform duration-200"
                      />
                    </div>
                  ) : (
                    <p
                      className={`px-4 py-2.5 text-sm font-light leading-relaxed rounded-2xl break-words shadow-sm ${
                        isMyMessage
                          ? "bg-violet-600/70 text-white rounded-br-none"
                          : "bg-[#231c3a]/90 text-gray-100 border border-white/5 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </p>
                  )}

                  <span className="text-[10px] text-gray-500/80 px-1">
                    {formatMessageTime(msg.createdAt)}
                  </span>
                </div>

                {isMyMessage && (
                  <img
                    src={authUser?.profilePic || assets.avatar_icon}
                    alt=""
                    className="w-6 h-6 object-cover rounded-full mb-1 flex-shrink-0"
                  />
                )}
              </div>
            );
          })
        )}
        <div ref={scrollEnd} />
      </div>

      {/* ------------- Bottom Message Input Action Deck --------------- */}
      <form
        onSubmit={handleSendMessage}
        className="px-6 py-4 bg-gradient-to-t from-[#130f22] to-transparent border-t border-white/5"
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-white/[0.04] border border-white/10 focus-within:border-violet-500/40 rounded-xl px-4 transition-all duration-200 shadow-inner">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder={`Message ${selectedUser.fullName || "user"}...`}
              className="flex-1 text-sm py-3 bg-transparent border-none outline-none text-white placeholder-gray-500/80"
            />

            <input
              onChange={handleSendImage}
              type="file"
              id="image-file"
              accept="image/png, image/jpeg, image/webp"
              hidden
            />

            <label
              htmlFor="image-file"
              className="p-1.5 hover:bg-white/5 rounded-lg cursor-pointer transition-colors group"
            >
              <img
                src={assets.gallery_icon}
                alt="Upload Media"
                className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity invert"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={!input.trim()}
            className={`p-3 rounded-xl transition-all duration-200 shadow-md ${
              input.trim()
                ? "bg-violet-600 hover:bg-violet-500 text-white hover:scale-105 active:scale-95 cursor-pointer"
                : "bg-white/5 text-gray-500 opacity-40 cursor-not-allowed"
            }`}
          >
            <img
              src={assets.send_button}
              alt="Send"
              className="w-5 h-5 invert"
            />
          </button>
        </div>
      </form>
    </div>
  ) : (
    /* -------- Empty Desktop Standby Mode View ---------- */
    <div className="flex-1 h-full flex flex-col justify-center items-center gap-4 text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center shadow-xl animate-bounce">
        <img
          src={assets.logo_icon || assets.logo}
          alt=""
          className="max-w-10 opacity-40 object-contain"
        />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-medium text-white/80 tracking-wide">
          Select a conversation
        </h3>
        <p className="text-sm text-gray-500/80 font-light max-w-xs">
          Pick a friend from the user directory to start messaging securely
          anytime, anywhere.
        </p>
      </div>
    </div>
  );
};

export default ChatContainer;
