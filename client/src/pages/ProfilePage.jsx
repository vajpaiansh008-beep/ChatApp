import React, { useContext, useState, useEffect } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize navigation
  
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName || "");
      setBio(authUser.bio || "");
    }
  }, [authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      if (!selectedImg) {
        await updateProfile({ fullName: name, bio });
        setIsUpdating(false);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);
      reader.onload = async () => {
        try {
          const base64Image = reader.result;
          await updateProfile({ profilePic: base64Image, fullName: name, bio });
          setSelectedImg(null); 
        } catch (err) {
          console.error("Image upload failed:", err);
        } finally {
          setIsUpdating(false);
        }
      };
    } catch (error) {
      console.error("Profile update failed:", error);
      setIsUpdating(false);
    }
  };

  const getAvatarSrc = () => {
    if (selectedImg) return URL.createObjectURL(selectedImg);
    if (authUser?.profilePic) return authUser.profilePic;
    return assets.avatar_icon;
  };

  return (
    // ✅ KEPT ORIGINAL BACKGROUND SPECIFICS UNCHANGED
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center p-4 md:p-8 selection:bg-violet-500/30 relative">
      
      {/* ✅ AESTHETIC HOME BUTTON FOR REDIRECTION */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 px-4 py-2 bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-md text-slate-200 border border-slate-700/50 rounded-xl shadow-lg transition-all duration-200 active:scale-95 group cursor-pointer z-20"
      >
        {/* Minimalist Home SVG Icon */}
        <svg 
          xmlns="http://w3.org" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth="2" 
          stroke="currentColor" 
          className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        <span className="text-sm font-medium">Home</span>
      </button>

      {/* Main Glassmorphic Panel Structure */}
      <div className="w-full max-w-4xl bg-slate-900/40 backdrop-blur-xl text-slate-200 border border-slate-800/80 shadow-2xl flex flex-col md:flex-row rounded-2xl overflow-hidden z-10">
        
        {/* Left Section: Interactive Inputs Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 sm:p-10 flex-1 order-2 md:order-1">
          <div>
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
              Profile Details
            </h3>
            <p className="text-sm text-slate-400 mt-1">Update your digital identity and account specifics.</p>
          </div>
          
          {/* Avatar Upload Track */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-300">Avatar Selection</span>
            <label
              htmlFor="avatar"
              className="flex items-center gap-4 p-3 bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/40 rounded-xl cursor-pointer group transition-all duration-300"
            >
              <input
                onChange={(e) => {
                  if (e.target.files?.[0]) setSelectedImg(e.target.files[0]);
                }}
                type="file"
                id="avatar"
                accept=".png, .jpg, .jpeg"
                hidden
              />
              <img
                src={getAvatarSrc()}
                alt="Preview Avatar"
                className="w-14 h-14 rounded-xl object-cover border-2 border-slate-700 group-hover:border-violet-500 transition-all duration-300 shadow-md"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-200 group-hover:text-violet-400 transition-colors">
                  {selectedImg ? "Change selected image" : "Upload new image"}
                </span>
                <span className="text-xs text-slate-400">Supports PNG, JPG up to 10MB</span>
              </div>
            </label>
          </div>

          {/* Full Name Input Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Display Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              required
              placeholder="Enter your full name"
              className="w-full p-3 bg-slate-950/50 border border-slate-800 focus:border-violet-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 text-slate-100 placeholder:text-slate-600 transition-all duration-200 shadow-inner"
            />
          </div>
          
          {/* Bio Textarea Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Bio</label>
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              placeholder="Tell the community a little bit about yourself..."
              required
              rows="4"
              className="w-full p-3 bg-slate-950/50 border border-slate-800 focus:border-violet-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 text-slate-100 placeholder:text-slate-600 transition-all duration-200 resize-none shadow-inner"
            ></textarea>
          </div>
          
          {/* Action Save Button */}
          <button
            type="submit"
            disabled={isUpdating}
            className={`w-full relative mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium p-3 rounded-xl transition-all duration-300 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-[0.98] ${
              isUpdating ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {isUpdating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Syncing Changes...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>

        {/* Right Section: Large Visual Summary Showcase Card */}
        <div className="flex flex-col items-center justify-center p-8 bg-slate-900/30 border-b md:border-b-0 md:border-l border-slate-800/80 min-w-[280px] lg:min-w-[340px] order-1 md:order-2 text-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-500 pointer-events-none" />
            <img
              src={getAvatarSrc()}
              alt="Showcase Profile"
              className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-slate-950/80 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
          
          <h4 className="mt-5 text-xl font-medium text-slate-100 truncate max-w-[240px]">
            {name || "Anonymous Member"}
          </h4>
          <p className="text-xs text-violet-400 font-mono mt-1 tracking-wider uppercase bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/20">
            {authUser?.email ? "Verified Identity" : "Guest profile"}
          </p>
          
          <p className="mt-3 text-sm text-slate-400 max-w-[220px] line-clamp-3 italic">
            "{bio || "No profile biography details written yet."}"
          </p>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
