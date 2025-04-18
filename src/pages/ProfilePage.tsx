import { useAuth } from "../context/AuthContext";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { Cpu, User, Settings, LogOut, Crown } from "lucide-react";
import { useLogout } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-neutral-900 py-10 text-neutral-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="border-neutral-700/50 sticky top-24 rounded-2xl border bg-neutral-800 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(79,38,144,0.15)]">
              <div className="border-neutral-700/30 border-b p-6 text-center">
                <div className="to-secondary-600/30 mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-purple-500/30 bg-gradient-to-br from-purple-700/30 transition-transform duration-500 hover:scale-105">
                  <span className="text-4xl font-bold text-white">
                    {user?.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  {user?.username}
                </h2>
                <p className="mt-1 text-sm text-neutral-400">{user?.email}</p>

                {/* Admin badge */}
                {isAdmin && (
                  <div className="mt-2 inline-flex items-center gap-1 rounded-md border border-amber-600/30 bg-amber-900/30 px-2 py-1 text-amber-300">
                    <Crown size={14} />
                    <span className="text-xs font-semibold">Admin</span>
                  </div>
                )}
              </div>

              {/* Navigation links */}
              <div className="p-4">
                <nav className="relative space-y-2.5">
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
                    className="group relative flex w-full items-center gap-3 overflow-hidden rounded-lg px-4 py-3 transition-all duration-300"
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
                    className="group relative flex w-full items-center gap-3 overflow-hidden rounded-lg px-4 py-3 transition-all duration-300"
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
                      className="group relative flex w-full items-center gap-3 overflow-hidden rounded-lg px-4 py-3 transition-all duration-300"
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
                    className="group relative flex w-full items-center gap-3 overflow-hidden rounded-lg px-4 py-3 transition-all duration-300"
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
              <div className="border-neutral-700/30 mx-4 border-t p-4 pt-2">
                <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-400">
                  Account
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400">Member since</span>
                    <span className="text-neutral-200">October 2023</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400">User ID</span>
                    <span className="rounded bg-neutral-800 px-2 py-1 font-mono text-xs text-neutral-200">
                      {user?.id}
                    </span>
                  </div>
                  {/* Display admin status in account info */}
                  <div className="flex items-center justify-between text-sm">
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
                <Button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-900/20 px-4 py-3 text-red-400 transition-colors duration-300 hover:bg-red-900/40 hover:text-red-300"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Area - Using Outlet */}
          <div className="space-y-8 md:col-span-2">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
