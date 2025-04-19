import { useAuth } from "@/context/AuthContext";
import { Mail, User, Book, Shield, Pencil, Save, X } from "lucide-react";
import { useSearchLaptops } from "@/hooks/useSearch";
import { useState } from "react";
import { useUpdateUser } from "@/hooks/useAuth";
import { useForm } from "@tanstack/react-form";
import { useToasts } from "@/assets/Toasts";
import { Button } from "@/components/ui/button";
export default function ProfileMain() {
  const { userUpdateSuccessToast, userUpdateErrorToast } = useToasts();
  const { user } = useAuth();
  const [editUsername, setEditUsername] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const { laptops: userLaptops, isLoading } = useSearchLaptops(
    "",
    user?.id ? user.id : undefined
  );
  const updateUser = useUpdateUser();

  const form = useForm({
    defaultValues: { username: user?.username || "" },
    onSubmit: async ({ value }) => {
      if (!user) return;
      try {
        await updateUser.mutateAsync({
          id: user.id.toString(),
          username: value.username,
        });
        userUpdateSuccessToast();
        setEditUsername(false);
        setHasEdited(false);
      } catch (error) {
        userUpdateErrorToast("Failed to update username. Please try again.");
      }
    },
  });

  if (!user) return <div>Loading...</div>;

  const isAdmin = user.admin;

  const handleEditUsername = () => {
    setEditUsername(true);
    form.reset({ username: user.username });
  };

  const handleCancelEdit = () => {
    setEditUsername(false);
    form.reset({ username: user.username });
    setHasEdited(false);
  };

  return (
    <div className="from-neutral-800/70 to-neutral-900/90 border-neutral-700/50 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-8 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(79,38,144,0.15)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.07),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-5"></div>

      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-2">
          <div className="h-1 w-5 rounded-full bg-secondary-500"></div>
          <h2 className="text-2xl font-bold text-white">Profile Information</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-6">
            {/* Username Card */}
            <div className="from-neutral-800/80 to-neutral-900/80 border-neutral-700/40 flex items-center gap-4 rounded-xl border bg-gradient-to-br p-5 shadow-lg backdrop-blur-md transition-all hover:shadow-xl">
              <div className="bg-secondary-700/20 flex-shrink-0 rounded-full p-2">
                <User size={22} className="text-secondary-400" />
              </div>
              <div className="flex flex-1 items-center justify-between gap-4">
                <div className="min-h-10 flex w-48 flex-col">
                  <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    Username
                  </span>
                  {editUsername ? (
                    <form onSubmit={form.handleSubmit} className="w-full">
                      <div className="flex items-center gap-2">
                        <form.Field name="username">
                          {(field) => (
                            <input
                              className="bg-neutral-700/60 min-h-7 w-full rounded border border-secondary-500 px-2 py-1 text-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-secondary-500"
                              value={field.state.value}
                              onChange={(e) => {
                                field.handleChange(e.target.value);
                                setHasEdited(e.target.value !== user.username);
                              }}
                              autoFocus
                            />
                          )}
                        </form.Field>
                        <Button
                          type="submit"
                          disabled={
                            !hasEdited ||
                            form.state.values.username.trim() === "" ||
                            updateUser.isPending
                          }
                          className="rounded bg-secondary-600 p-1 text-white transition-colors hover:bg-secondary-700 disabled:opacity-50"
                          title="Save"
                        >
                          {updateUser.isPending ? (
                            <span className="animate-spin">⌛</span>
                          ) : (
                            <Save size={16} />
                          )}
                        </Button>
                        <Button
                          type="button"
                          onClick={handleCancelEdit}
                          className="rounded bg-neutral-700 p-1 text-neutral-300 transition-colors hover:bg-neutral-600"
                          title="Cancel"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <span className="block min-h-[28px] w-full truncate text-lg font-semibold text-neutral-200">
                      {user.username}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {!editUsername && (
                    <Button
                      variant={"ghost"}
                      onClick={handleEditUsername}
                      className=" "
                      title="Edit Username"
                    >
                      <Pencil size={18} className="text-neutral-400" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {/* Email Card */}
            <div className="from-neutral-800/80 to-neutral-900/80 border-neutral-700/40 flex items-center gap-4 rounded-xl border bg-gradient-to-br p-5 shadow-lg backdrop-blur-md transition-all hover:shadow-xl">
              <div className="bg-secondary-700/20 flex-shrink-0 rounded-full p-2">
                <Mail size={22} className="text-secondary-400" />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  Email Address
                </span>
                <span className="text-lg font-semibold text-neutral-200">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {/* Account Type Card */}
            <div className="from-neutral-800/80 to-neutral-900/80 border-neutral-700/40 flex items-center gap-4 rounded-xl border bg-gradient-to-br p-5 shadow-lg backdrop-blur-md transition-all hover:shadow-xl">
              <div className="bg-secondary-700/20 flex-shrink-0 rounded-full p-2">
                <Shield
                  size={22}
                  className={isAdmin ? "text-amber-400" : "text-secondary-400"}
                />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
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
            {/* Activity Card */}
            <div className="from-neutral-800/80 to-neutral-900/80 border-neutral-700/40 flex items-center gap-4 rounded-xl border bg-gradient-to-br p-5 shadow-lg backdrop-blur-md transition-all hover:shadow-xl">
              <div className="bg-secondary-700/20 flex-shrink-0 rounded-full p-2">
                <Book size={22} className="text-secondary-400" />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  Activity
                </span>
                <span className="text-lg font-semibold text-neutral-200">
                  {isLoading ? (
                    <span className="text-neutral-400">Loading...</span>
                  ) : userLaptops ? (
                    <>
                      {userLaptops.length} laptop
                      {userLaptops.length !== 1 ? "s" : ""} posted
                    </>
                  ) : (
                    "No laptops posted"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
