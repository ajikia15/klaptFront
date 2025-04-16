import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  User,
  Settings,
  Book,
  Shield,
  Pencil,
  Save,
  Loader,
  X,
} from "lucide-react";
import { useSearchLaptops } from "@/hooks/useSearch";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "@tanstack/react-form";
export default function ProfileMain() {
  const { user } = useAuth();
  const isAdmin = user?.admin || false;
  const [editUsername, setEditUsername] = useState(false);
  const [usernameValue, setUsernameValue] = useState(user?.username || "");
  const [hasEdited, setHasEdited] = useState(false);

  // Fetch user's laptops
  const { laptops: userLaptops, isLoading } = useSearchLaptops("", user?.id);

  const handleEditUsername = () => {
    setEditUsername(true);
    setUsernameValue(user?.username || "");
  };
  const handleCancelEdit = () => {
    setEditUsername(false);
    setUsernameValue(user?.username || "");
    setHasEdited(false);
  };
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameValue(e.target.value);
    setHasEdited(e.target.value !== user?.username);
  };
  const handleSaveUsername = async () => {
    // TODO: Call updateUsername(usernameValue) here
    setEditUsername(false);
    setHasEdited(false);
  };

  return (
    <div className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 rounded-2xl border border-neutral-700/50 p-8 relative overflow-hidden transition-all duration-300 hover:shadow-[0_4px_20px_rgba(79,38,144,0.15)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.07),transparent_70%)]"></div>
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-1 w-5 bg-secondary-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-white">Profile Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Username Card */}
            <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-md rounded-xl shadow-lg border border-neutral-700/40 p-5 flex items-center gap-4 hover:shadow-xl transition-all">
              <div className="flex-shrink-0 bg-secondary-700/20 rounded-full p-2">
                <User size={22} className="text-secondary-400" />
              </div>
              <div className="flex flex-1 items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wide mb-1">
                    Username
                  </span>
                  {editUsername ? (
                    <input
                      className="bg-neutral-700/60 border border-secondary-500 rounded px-2 py-1 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all w-48"
                      value={usernameValue}
                      onChange={handleUsernameChange}
                      autoFocus
                    />
                  ) : (
                    <span className="text-lg text-neutral-200 font-semibold">
                      {user?.username || "Not set"}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {editUsername ? (
                    <>
                      <button
                        onClick={handleSaveUsername}
                        disabled={!hasEdited || usernameValue.trim() === ""}
                        className="p-1 rounded bg-secondary-600 hover:bg-secondary-700 text-white disabled:opacity-50 transition-colors"
                        title="Save"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 rounded bg-neutral-700 hover:bg-neutral-600 text-neutral-300 transition-colors"
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditUsername}
                      className="p-1 rounded hover:bg-neutral-700 transition-colors"
                      title="Edit Username"
                    >
                      <Pencil size={18} className="text-neutral-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            {/* Email Card */}
            <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-md rounded-xl shadow-lg border border-neutral-700/40 p-5 flex items-center gap-4 hover:shadow-xl transition-all">
              <div className="flex-shrink-0 bg-secondary-700/20 rounded-full p-2">
                <Mail size={22} className="text-secondary-400" />
              </div>
              <div className="flex flex-1 items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wide mb-1">
                    Email Address
                  </span>
                  <span className="text-lg text-neutral-200 font-semibold">
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {/* Account Type Card */}
            <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-md rounded-xl shadow-lg border border-neutral-700/40 p-5 flex items-center gap-4 hover:shadow-xl transition-all">
              <div className="flex-shrink-0 bg-secondary-700/20 rounded-full p-2">
                <Shield
                  size={22}
                  className={isAdmin ? "text-amber-400" : "text-secondary-400"}
                />
              </div>
              <div className="flex flex-1 items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wide mb-1">
                    Account Type
                  </span>
                  <span
                    className={
                      isAdmin
                        ? "text-lg text-amber-200 font-semibold"
                        : "text-lg text-neutral-200 font-semibold"
                    }
                  >
                    {isAdmin ? "Administrator" : "Standard User"}
                  </span>
                </div>
              </div>
            </div>
            {/* Activity Card */}
            <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-md rounded-xl shadow-lg border border-neutral-700/40 p-5 flex items-center gap-4 hover:shadow-xl transition-all">
              <div className="flex-shrink-0 bg-secondary-700/20 rounded-full p-2">
                <Book size={22} className="text-secondary-400" />
              </div>
              <div className="flex flex-1 items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wide mb-1">
                    Activity
                  </span>
                  <span className="text-lg text-neutral-200 font-semibold">
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
        </div>
      </div>
    </div>
  );
}
