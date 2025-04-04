import { useAuth } from "../../context/AuthContext";
import { Link } from "@tanstack/react-router";
import { Crown, Shield } from "lucide-react";

export default function ProfileAdmin() {
  const { user } = useAuth();
  const isAdmin = user?.admin || false;

  if (!isAdmin) {
    return (
      <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-8 text-center">
        <h3 className="text-red-300 font-semibold text-lg mb-2">
          Access Denied
        </h3>
        <p className="text-neutral-300">
          You don't have permission to access this section.
        </p>
      </div>
    );
  }

  return (
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
            <h3 className="text-white font-medium mb-2">User Management</h3>
            <p className="text-neutral-400 text-sm mb-3">
              Manage user accounts and permissions
            </p>
            <Link
              to="/admin/users"
              className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
            >
              Manage Users →
            </Link>
          </div>

          <div className="bg-neutral-800/40 border border-neutral-700/30 rounded-lg p-4 hover:bg-neutral-800/60 transition-colors">
            <h3 className="text-white font-medium mb-2">Content Moderation</h3>
            <p className="text-neutral-400 text-sm mb-3">
              Review and moderate user listings
            </p>
            <Link
              to="/admin/moderation"
              className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
            >
              View Reports →
            </Link>
          </div>

          <div className="bg-neutral-800/40 border border-neutral-700/30 rounded-lg p-4 hover:bg-neutral-800/60 transition-colors">
            <h3 className="text-white font-medium mb-2">Site Statistics</h3>
            <p className="text-neutral-400 text-sm mb-3">
              View site usage and performance metrics
            </p>
            <Link
              to="/admin/statistics"
              className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
            >
              View Analytics →
            </Link>
          </div>

          <div className="bg-neutral-800/40 border border-neutral-700/30 rounded-lg p-4 hover:bg-neutral-800/60 transition-colors">
            <h3 className="text-white font-medium mb-2">System Settings</h3>
            <p className="text-neutral-400 text-sm mb-3">
              Configure system parameters and features
            </p>
            <Link
              to="/admin/system"
              className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
            >
              System Config →
            </Link>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-4">
          <h4 className="text-amber-300 font-medium mb-2 flex items-center gap-2">
            <Shield size={16} />
            Admin Notice
          </h4>
          <p className="text-neutral-300 text-sm">
            You have administrative privileges. Please use these capabilities
            responsibly and in accordance with our platform guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
