import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="w-full h-screen bg-[#0d0a1b] flex items-center justify-center p-0 md:p-6 lg:p-8 selection:bg-violet-500/30">
      <div className="w-full h-full max-w-[1600px] bg-[#141026]/40 backdrop-blur-xl border border-white/10 rounded-none md:rounded-2xl shadow-2xl overflow-hidden flex">
        
        {/* Column 1: Navigation Sidebar Panel */}
        <div 
          className={`h-full w-full md:w-[320px] flex-shrink-0 border-r border-white/5 ${
            selectedUser ? "hidden md:block" : "block"
          }`}
        >
          <Sidebar />
        </div>

        {/* Column 2: Core Chat Display Panel */}
        <div 
          className={`h-full flex-1 min-w-0 bg-[#130f22]/40 ${
            !selectedUser ? "hidden md:block" : "block"
          }`}
        >
          <ChatContainer />
        </div>

        {/* Column 3: Secondary Information Right Profile Panel */}
        <div 
          className={`h-full w-[300px] flex-shrink-0 border-l border-white/5 hidden xl:block`}
        >
          <RightSidebar />
        </div>

      </div>
    </div>
  );
};

export default HomePage;
