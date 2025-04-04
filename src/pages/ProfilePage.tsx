import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { LaptopCard } from "../components/LaptopCard";
import {
  Cpu,
  Mail,
  User,
  Settings,
  Book,
  Shield,
  LogOut,
  Crown,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // Simply use the admin property directly from the user object
  const isAdmin = user?.admin || false;

  // Placeholder for user's posts - you'll implement fetching later
  const userPosts = [];
  const isLoading = false;

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-neutral-800 rounded-2xl border border-neutral-700/50 sticky top-24 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(79,38,144,0.15)]">
              {/* Profile Header - simplified to avoid gradient positioning issues */}
              <div className="text-center p-6 border-b border-neutral-700/30">
                <div className="bg-gradient-to-br from-purple-700/30 to-secondary-600/30 rounded-full h-24 w-24 flex items-center justify-center mb-4 mx-auto border-2 border-purple-500/30 transition-transform duration-500 hover:scale-105">
                  <span className="text-4xl font-bold text-white">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  {user?.email?.split("@")[0]}
                </h2>
                <p className="text-sm text-neutral-400 mt-1">{user?.email}</p>

                {/* Admin badge */}
                {isAdmin && (
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-amber-900/30 text-amber-300 rounded-md border border-amber-600/30">
                    <Crown size={14} />
                    <span className="text-xs font-semibold">Admin</span>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === "profile"
                        ? "bg-purple-900/30 text-purple-200 border-l-2 border-purple-500"
                        : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                    }`}
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("posts")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === "posts"
                        ? "bg-purple-900/30 text-purple-200 border-l-2 border-purple-500"
                        : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                    }`}
                  >
                    <Cpu size={18} />
                    <span>Your Posts</span>
                  </button>

                  {/* Admin dashboard button - only visible to admins */}
                  {isAdmin && (
                    <button
                      onClick={() => setActiveTab("admin")}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeTab === "admin"
                          ? "bg-amber-900/30 text-amber-200 border-l-2 border-amber-500"
                          : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                      }`}
                    >
                      <Crown size={18} />
                      <span>Admin Dashboard</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === "settings"
                        ? "bg-purple-900/30 text-purple-200 border-l-2 border-purple-500"
                        : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                    }`}
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </button>
                </nav>
              </div>

              {/* Account Info */}
              <div className="p-4 pt-2 border-t border-neutral-700/30 mx-4">
                <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4">
                  Account
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-400">Member since</span>
                    <span className="text-neutral-200">October 2023</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-400">User ID</span>
                    <span className="text-neutral-200 font-mono text-xs bg-neutral-800 px-2 py-1 rounded">
                      {user?.id}
                    </span>
                  </div>
                  {/* Display admin status in account info */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-400">Access Level</span>
                    <span
                      className={`font-mono text-xs px-2 py-1 rounded ${
                        isAdmin
                          ? "bg-amber-900/30 text-amber-200"
                          : "bg-neutral-800 text-neutral-200"
                      }`}
                    >
                      {isAdmin ? "Admin" : "Standard"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <div className="p-4 pt-0">
                <button className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 rounded-lg transition-colors duration-300">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-8">
            {activeTab === "profile" && (
              <div className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 rounded-2xl border border-neutral-700/50 p-8 relative overflow-hidden transition-all duration-300 hover:shadow-[0_4px_20px_rgba(79,38,144,0.15)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.07),transparent_70%)]"></div>
                <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-1 w-5 bg-secondary-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-white">
                      Profile Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">
                          Username
                        </label>
                        <div className="flex items-center gap-3 bg-neutral-800/50 p-3 rounded-lg border border-neutral-700/30">
                          <User size={18} className="text-secondary-400" />
                          <span className="text-neutral-200 font-medium">
                            {user?.email?.split("@")[0] || "Not set"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">
                          Email Address
                        </label>
                        <div className="flex items-center gap-3 bg-neutral-800/50 p-3 rounded-lg border border-neutral-700/30">
                          <Mail size={18} className="text-secondary-400" />
                          <span className="text-neutral-200 font-medium">
                            {user?.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">
                          Account Type
                        </label>
                        <div className="flex items-center gap-3 bg-neutral-800/50 p-3 rounded-lg border border-neutral-700/30">
                          <Shield
                            size={18}
                            className={
                              isAdmin ? "text-amber-400" : "text-secondary-400"
                            }
                          />
                          <span
                            className={
                              isAdmin
                                ? "text-amber-200 font-medium"
                                : "text-neutral-200 font-medium"
                            }
                          >
                            {isAdmin ? "Administrator" : "Standard User"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">
                          Activity
                        </label>
                        <div className="flex items-center gap-3 bg-neutral-800/50 p-3 rounded-lg border border-neutral-700/30">
                          <Book size={18} className="text-secondary-400" />
                          <span className="text-neutral-200 font-medium">
                            {userPosts.length} laptop
                            {userPosts.length !== 1 ? "s" : ""} posted
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button className="py-3 px-6 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center gap-2">
                      <Settings size={18} />
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "posts" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-5 bg-secondary-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-white">
                      Your Laptop Listings
                    </h2>
                  </div>
                  <button className="bg-secondary-500 hover:bg-secondary-600 font-bold transition-all duration-300 px-4 py-2 rounded-md text-white flex items-center gap-2">
                    <span>Add New</span>
                    <span className="text-lg">+</span>
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                  </div>
                ) : userPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* This is where you'll map through user's posts */}
                    {/* Placeholder for illustration */}
                    {/* {userPosts.map((post) => (
                      <LaptopCard
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        price={post.price}
                        shortDesc={post.shortDesc}
                        image={post.images[0]}
                        isAuthenticated={true}
                      />
                    ))} */}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 rounded-2xl border border-neutral-700/50 p-10 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Cpu size={48} className="text-neutral-600" />
                      <h3 className="text-xl font-semibold text-neutral-300">
                        You haven't posted any laptops yet
                      </h3>
                      <p className="text-neutral-500 max-w-md mx-auto">
                        Start by adding your first laptop listing. It's easy to
                        get started and reach potential buyers.
                      </p>
                      <button className="mt-4 bg-secondary-500 hover:bg-secondary-600 font-bold transition-all duration-300 px-6 py-3 rounded-md text-white flex items-center gap-2">
                        Create Your First Listing
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Admin Dashboard Tab - only visible to admins */}
            {activeTab === "admin" && isAdmin && (
              <div className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 rounded-2xl border border-amber-700/30 p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(217,119,6,0.07),transparent_70%)]"></div>
                <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-1 w-5 bg-amber-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Crown size={20} className="text-amber-400" />
                      Admin Dashboard
                    </h2>
                  </div>

                  <p className="text-neutral-400 mb-6">
                    Access administrative controls and manage site content
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-neutral-800/40 border border-neutral-700/30 rounded-lg p-4 hover:bg-neutral-800/60 transition-colors">
                      <h3 className="text-white font-medium mb-2">
                        User Management
                      </h3>
                      <p className="text-neutral-400 text-sm mb-3">
                        Manage user accounts and permissions
                      </p>
                      <button className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
                        Manage Users →
                      </button>
                    </div>

                    <div className="bg-neutral-800/40 border border-neutral-700/30 rounded-lg p-4 hover:bg-neutral-800/60 transition-colors">
                      <h3 className="text-white font-medium mb-2">
                        Content Moderation
                      </h3>
                      <p className="text-neutral-400 text-sm mb-3">
                        Review and moderate user listings
                      </p>
                      <button className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
                        View Reports →
                      </button>
                    </div>

                    <div className="bg-neutral-800/40 border border-neutral-700/30 rounded-lg p-4 hover:bg-neutral-800/60 transition-colors">
                      <h3 className="text-white font-medium mb-2">
                        Site Statistics
                      </h3>
                      <p className="text-neutral-400 text-sm mb-3">
                        View site usage and performance metrics
                      </p>
                      <button className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
                        View Analytics →
                      </button>
                    </div>

                    <div className="bg-neutral-800/40 border border-neutral-700/30 rounded-lg p-4 hover:bg-neutral-800/60 transition-colors">
                      <h3 className="text-white font-medium mb-2">
                        System Settings
                      </h3>
                      <p className="text-neutral-400 text-sm mb-3">
                        Configure system parameters and features
                      </p>
                      <button className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
                        System Config →
                      </button>
                    </div>
                  </div>

                  <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-4">
                    <h4 className="text-amber-300 font-medium mb-2 flex items-center gap-2">
                      <Shield size={16} />
                      Admin Notice
                    </h4>
                    <p className="text-neutral-300 text-sm">
                      You have administrative privileges. Please use these
                      capabilities responsibly and in accordance with our
                      platform guidelines.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 rounded-2xl border border-neutral-700/50 p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.07),transparent_70%)]"></div>
                <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-1 w-5 bg-secondary-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-white">
                      Account Settings
                    </h2>
                  </div>

                  <p className="text-neutral-400 mb-6">
                    Manage your account settings and preferences
                  </p>

                  <div className="space-y-6">
                    {/* Settings options will go here */}
                    <div className="p-6 bg-neutral-800/50 rounded-lg border border-neutral-700/30">
                      <h3 className="text-lg font-medium text-white mb-4">
                        Coming Soon
                      </h3>
                      <p className="text-neutral-400">
                        Account settings functionality is currently under
                        development
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
