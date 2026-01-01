import React, { useState } from "react";
import {
  Camera,
  Trash2,
  Edit3,
  Save,
  X,
  User,
  Mail,
  Calendar,
  Clock,
  Lock,
} from "lucide-react";
import { useSelector } from "react-redux";

const Settings = () => {

  const user = useSelector(state => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);
  const brandGreen = "text-[#55aa00]";
  const bgBrandGreen = "bg-[#55aa00]";
  const borderBrandGreen = "border-[#55aa00]";

  const userData = {
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Postly",
    fullName: "Alex Rivera",
    username: "alex_stories",
    email: "alex@postly.com",
    createdAt: "Jan 12, 2024",
    updatedAt: "Oct 05, 2025",
  };

  return (
    <div className="mt-5 min-h-screen bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">
            Account <span className={brandGreen}>Settings</span>
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your profile and account preferences.
          </p>
        </div>

        {/* PARENT CONTAINER: 
            items-stretch ensures that children in the same row take the height of the tallest child.
        */}
        <div className="flex flex-col md:flex-row items-stretch gap-8">
          {/* --- LEFT CARD: Profile Picture --- */}
          <div className="w-full md:w-1/3 flex">
            <div className="w-full bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-300 dark:border-gray-700 shadow-xl flex flex-col items-center justify-between">
              <div className="flex flex-col items-center w-full">
                <div className="relative group">
                  <img
                    src={user?.avatar === null ? "./user.png" : user.avatar}
                    alt="Avatar"
                    className={`w-40 h-40 rounded-full object-cover border-4 ${borderBrandGreen} p-1 shadow-2xl`}
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera className="text-white" size={32} />
                  </div>
                </div>
                <h3 className="mt-6 font-bold text-2xl">{userData.username}</h3>
                <p
                  className={`text-sm font-bold uppercase tracking-widest ${brandGreen}`}
                >
                  Verified Author
                </p>
              </div>

              <div className="flex flex-col w-full gap-3 mt-8">
                <button
                  className={`flex items-center justify-center gap-2 ${bgBrandGreen} hover:bg-[#448800] text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#55aa00]/20`}
                >
                  <Camera size={18} /> Upload New
                </button>
                <button className="flex items-center justify-center gap-2 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white py-3 rounded-xl font-bold transition-all">
                  <Trash2 size={18} /> Remove Photo
                </button>
              </div>
            </div>
          </div>

          {/* --- RIGHT CARD: User Details --- */}
          <div className="w-full md:w-2/3 flex">
            <div className="w-full bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-300 dark:border-gray-700 shadow-xl overflow-hidden flex flex-col">
              {/* Card Header */}
              <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                <div className="flex items-center gap-2">
                  <User size={20} className={brandGreen} />
                  <span className="font-black uppercase tracking-widest text-sm">
                    Personal Information
                  </span>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 font-bold text-xs uppercase tracking-widest border-2 px-4 py-2 rounded-full transition-all ${
                    isEditing
                      ? "border-red-500 text-red-500"
                      : `${borderBrandGreen} ${brandGreen}`
                  }`}
                >
                  {isEditing ? (
                    <>
                      <X size={14} /> Cancel
                    </>
                  ) : (
                    <>
                      <Edit3 size={14} /> Edit
                    </>
                  )}
                </button>
              </div>

              {/* Details Content - flex-grow ensures this area fills the card height */}
              <div className="p-8 grow flex flex-col justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <DetailItem
                    icon={<User size={16} />}
                    label="Full Name"
                    value={userData.fullName}
                    isEditing={isEditing}
                  />
                  <DetailItem
                    icon={<Mail size={16} />}
                    label="Email"
                    value={userData.email}
                    isEditing={isEditing}
                  />
                  <DetailItem
                    icon={<User size={16} />}
                    label="Username"
                    value={userData.username}
                    isEditing={isEditing}
                  />
                  <DetailItem
                    icon={<Lock size={16} />}
                    label="Password"
                    value="••••••••"
                    isEditing={isEditing}
                    type="password"
                  />
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex flex-wrap gap-8 opacity-60">
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className={brandGreen} />
                      <div>
                        <p className="text-[10px] uppercase font-black tracking-widest">
                          Account Created
                        </p>
                        <p className="text-sm font-bold">
                          {userData.createdAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={18} className={brandGreen} />
                      <div>
                        <p className="text-[10px] uppercase font-black tracking-widest">
                          Last Update
                        </p>
                        <p className="text-sm font-bold">
                          {userData.updatedAt}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-8 animate-in slide-in-from-bottom-2 duration-300">
                      <button
                        className={`w-full ${bgBrandGreen} hover:bg-[#448800] text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-transform active:scale-95`}
                      >
                        <Save size={20} /> Save All Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value, isEditing, type = "text" }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
      {icon} {label}
    </label>
    {isEditing ? (
      <input
        type={type}
        defaultValue={value}
        className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#55aa00] focus:border-transparent outline-none transition-all font-bold"
      />
    ) : (
      <p className="text-lg font-bold tracking-tight py-2 border-b border-transparent">
        {value}
      </p>
    )}
  </div>
);

export default Settings;
