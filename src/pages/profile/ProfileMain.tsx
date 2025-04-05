import { useAuth } from "../../context/AuthContext";
import { Mail, User, Settings, Book, Shield } from "lucide-react";
import { useSearchLaptops } from "@/hooks/useSearch";

export default function ProfileMain() {
  const { user } = useAuth();
  const isAdmin = user?.admin || false;

  // Fetch user's laptops
  const { laptops: userLaptops, isLoading } = useSearchLaptops("", user?.id);

  return (
    <div className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 rounded-2xl border border-neutral-700/50 p-8 relative overflow-hidden transition-all duration-300 hover:shadow-[0_4px_20px_rgba(79,38,144,0.15)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.07),transparent_70%)]"></div>
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-1 w-5 bg-secondary-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-white">Profile Information</h2>
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
                  className={isAdmin ? "text-amber-400" : "text-secondary-400"}
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
                  {isLoading ? (
                    <span className="text-neutral-400">Loading...</span>
                  ) : userLaptops ? (
                    <>
                      {userLaptops.length} laptop
                      {userLaptops.length !== 1 ? "s" : ""} posted
                    </>
                  ) : (
                    "0 laptops posted"
                  )}
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
  );
}
