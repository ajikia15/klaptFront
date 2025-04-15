import { useAuth } from "../context/AuthContext";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { Cpu, User, Settings, LogOut, Crown } from "lucide-react";
import { useLogout } from "../hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();
  const isAdmin = user?.admin || false;
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      navigate({ to: "/" });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-neutral-800 rounded-2xl border border-neutral-700/50 sticky top-24 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(79,38,144,0.15)]">
              <div className="text-center p-6 border-b border-neutral-700/30">
                <div className="bg-gradient-to-br from-purple-700/30 to-secondary-600/30 rounded-full h-24 w-24 flex items-center justify-center mb-4 mx-auto border-2 border-purple-500/30 transition-transform duration-500 hover:scale-105">
                  <span className="text-4xl font-bold text-white">
                    {user?.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  {user?.username}
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

              {/* Navigation links */}
              <div className="p-4">
                <nav className="space-y-2.5 relative">
                  <Link
                    to="/profile"
                    activeProps={{
                      className:
                        "bg-gradient-to-r from-purple-900/40 to-purple-800/20 text-white",
                    }}
                    inactiveProps={{
                      className:
                        "text-neutral-400 hover:bg-neutral-800/70 hover:text-neutral-200",
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden group"
                    activeOptions={{ exact: true }}
                  >
                    <User
                      size={18}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                    <span>Profile</span>
                  </Link>

                  {/* Posts Tab */}
                  <Link
                    to="/profile/posts"
                    activeProps={{
                      className:
                        "bg-gradient-to-r from-purple-900/40 to-purple-800/20 text-white",
                    }}
                    inactiveProps={{
                      className:
                        "text-neutral-400 hover:bg-neutral-800/70 hover:text-neutral-200",
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden group"
                  >
                    <Cpu
                      size={18}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                    <span>Your Posts</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/profile/admin"
                      activeProps={{
                        className:
                          "bg-gradient-to-r from-amber-900/40 to-amber-800/20 text-white",
                      }}
                      inactiveProps={{
                        className:
                          "text-neutral-400 hover:bg-neutral-800/70 hover:text-neutral-200",
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden group"
                    >
                      <Crown
                        size={18}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  {/* Settings Tab */}
                  <Link
                    to="/profile/settings"
                    activeProps={{
                      className:
                        "bg-gradient-to-r from-purple-900/40 to-purple-800/20 text-white",
                    }}
                    inactiveProps={{
                      className:
                        "text-neutral-400 hover:bg-neutral-800/70 hover:text-neutral-200",
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden group"
                  >
                    <Settings
                      size={18}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                    <span>Settings</span>
                  </Link>
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
                <button
                  onClick={handleLogout}
                  className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 rounded-lg transition-colors duration-300"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area - Using Outlet */}
          <div className="md:col-span-2 space-y-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
