import { useState } from "react";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useGetUsers } from "../../hooks/useAuth";
import {
  UserCheck,
  UserX,
  Eye,
  Trash2,
  Shield,
  Users,
  ShieldAlert,
  UserCog,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { User } from "../../services/authService";

// Add proper type definitions for components
interface LetterAvatarProps {
  email: string;
}

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number | null;
  onAction: (userId: number | null) => void;
}

interface PromoteDialogProps extends Omit<DialogProps, "onAction"> {
  onAction: (userId: number | null, role: string) => void;
}

// Simple component to display the first letter of email as avatar
const LetterAvatar = ({ email }: LetterAvatarProps) => {
  const firstLetter = email?.charAt(0).toUpperCase() || "?";
  // Generate a deterministic color based on the email string
  const hash = email
    ? email.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : 0;
  const hue = hash % 360;

  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-medium"
      style={{
        backgroundColor: `hsl(${hue}, 70%, 40%)`,
        width: "100%",
        height: "100%",
      }}
    >
      {firstLetter}
    </div>
  );
};

// Dialog components for user management actions
const BanUserDialog = ({
  open,
  onOpenChange,
  userId,
  onAction,
}: DialogProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-800 rounded-xl max-w-md w-full p-6 border border-amber-700/30">
        <h2 className="text-xl font-bold text-white mb-4">Ban User</h2>
        <p className="text-neutral-300 mb-6">
          Are you sure you want to ban this user? They will no longer be able to
          log in or post content.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onAction(userId)}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Ban User
          </button>
        </div>
      </div>
    </div>
  );
};

const UnbanUserDialog = ({
  open,
  onOpenChange,
  userId,
  onAction,
}: DialogProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-800 rounded-xl max-w-md w-full p-6 border border-amber-700/30">
        <h2 className="text-xl font-bold text-white mb-4">Unban User</h2>
        <p className="text-neutral-300 mb-6">
          Are you sure you want to unban this user? They will regain access to
          their account.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onAction(userId)}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Unban User
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteUserDialog = ({
  open,
  onOpenChange,
  userId,
  onAction,
}: DialogProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-800 rounded-xl max-w-md w-full p-6 border border-amber-700/30">
        <h2 className="text-xl font-bold text-white mb-4">Delete User</h2>
        <p className="text-neutral-300 mb-6">
          Are you sure you want to permanently delete this user? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onAction(userId)}
            className="px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

const PromoteUserDialog = ({
  open,
  onOpenChange,
  userId,
  onAction,
}: PromoteDialogProps) => {
  const [selectedRole, setSelectedRole] = useState("user");

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-800 rounded-xl max-w-md w-full p-6 border border-amber-700/30">
        <h2 className="text-xl font-bold text-white mb-4">Change User Role</h2>
        <p className="text-neutral-300 mb-4">
          Select a new role for this user:
        </p>
        <div className="mb-6">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full p-2 bg-neutral-700 text-neutral-200 rounded-lg border border-neutral-600"
          >
            <option value="user">Regular User</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onAction(userId, selectedRole)}
            className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
          >
            Change Role
          </button>
        </div>
      </div>
    </div>
  );
};

// Add a Badge component that follows Shadcn UI styling
interface BadgeProps {
  variant: "default" | "admin" | "user";
  children: React.ReactNode;
}

const Badge = ({ variant, children }: BadgeProps) => {
  const variantClasses = {
    default:
      "bg-neutral-100/10 text-neutral-100 border-neutral-800/50 hover:bg-neutral-100/20",
    admin:
      "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20",
    user: "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
};

export default function UserManagement() {
  useRequireAuth();

  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Dialog states
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [unbanDialogOpen, setUnbanDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);

  const [userTable] = useAutoAnimate<HTMLDivElement>();

  // Fetch real user data
  const { data: users = [], isLoading, error } = useGetUsers();

  // Filter users based on admin status
  const filteredUsers = users.filter((user: User) => {
    return (
      roleFilter === "all" ||
      (roleFilter === "admin" && user.admin) ||
      (roleFilter === "user" && !user.admin)
    );
  });

  // Action handlers
  const handleBanUser = (userId: number | null) => {
    if (userId === null) return;
    console.log("Banning user:", userId);
    // In a real app, you would make an API call here
    setBanDialogOpen(false);
  };

  const handleUnbanUser = (userId: number | null) => {
    if (userId === null) return;
    console.log("Unbanning user:", userId);
    // In a real app, you would make an API call here
    setUnbanDialogOpen(false);
  };

  const handleDeleteUser = (userId: number | null) => {
    if (userId === null) return;
    console.log("Deleting user:", userId);
    // In a real app, you would make an API call here
    setDeleteDialogOpen(false);
  };

  const handlePromoteUser = (userId: number | null, newRole: string) => {
    if (userId === null) return;
    // Update to reflect admin boolean instead of role string
    const isAdmin = newRole === "admin";
    console.log("Changing user admin status:", userId, "to", isAdmin);
    // In a real app, you would make an API call here
    setPromoteDialogOpen(false);
  };

  // Dialog open handlers
  const openBanDialog = (id: number) => {
    setSelectedUserId(id);
    setBanDialogOpen(true);
  };

  const openUnbanDialog = (id: number) => {
    setSelectedUserId(id);
    setUnbanDialogOpen(true);
  };

  const openDeleteDialog = (id: number) => {
    setSelectedUserId(id);
    setDeleteDialogOpen(true);
  };

  const openPromoteDialog = (id: number) => {
    setSelectedUserId(id);
    setPromoteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 py-10">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 rounded-2xl border border-amber-700/30 p-4 sm:p-8">
          <h1 className="text-2xl font-bold text-white mb-4">
            User Management
          </h1>
          <p className="text-neutral-400 mb-6">
            Manage user accounts, permissions, and access
          </p>

          {/* Filter buttons */}
          <div className="mb-4">
            <h3 className="text-sm text-neutral-400 mb-2">Filter by Role:</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {["all", "admin", "user"].map((role) => {
                let activeClass = "";
                let inactiveClass = "";

                switch (role) {
                  case "admin":
                    activeClass = "bg-amber-600 text-white";
                    inactiveClass =
                      "bg-amber-900/20 hover:bg-amber-900/40 text-amber-400 hover:text-amber-300 border border-amber-800/30";
                    break;
                  case "user":
                    activeClass = "bg-green-600 text-white";
                    inactiveClass =
                      "bg-green-900/20 hover:bg-green-900/40 text-green-400 hover:text-green-300 border border-green-800/30";
                    break;
                  default: // "all"
                    activeClass = "bg-neutral-600 text-white";
                    inactiveClass =
                      "bg-neutral-800/70 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-300 border border-neutral-700/30";
                }

                return (
                  <button
                    key={`role-${role}`}
                    onClick={() => setRoleFilter(role)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs sm:text-sm ${
                      roleFilter === role ? activeClass : inactiveClass
                    }`}
                  >
                    {role === "admin" && <ShieldAlert size={14} />}
                    {role === "user" && <UserCheck size={14} />}
                    {role === "all" && <Users size={14} />}
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-neutral-700/30">
            {/* Table header - grid for desktop with additional Role column */}
            <div className="hidden md:grid grid-cols-7 bg-neutral-800 text-xs uppercase font-medium">
              <div className="col-span-1 px-6 py-3">ID</div>
              <div className="col-span-2 px-6 py-3">Email</div>
              <div className="col-span-1 px-6 py-3">Role</div>
              <div className="col-span-3 px-6 py-3">Actions</div>
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="py-8 bg-neutral-800/40 text-center">
                <p className="text-neutral-400">Loading users...</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="py-8 bg-neutral-800/40 text-center">
                <p className="text-red-400">
                  Error loading users. Please try again later.
                </p>
              </div>
            )}

            {/* Table body */}
            {!isLoading && !error && (
              <div ref={userTable}>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user: User) => (
                    <div
                      key={user.id}
                      className="md:grid md:grid-cols-7 block bg-neutral-800/30 border-b border-neutral-700/30 hover:bg-neutral-800/50 transition-colors"
                    >
                      {/* Mobile card view */}
                      <div className="p-4 md:hidden">
                        <div className="flex items-start mb-3">
                          <div className="w-12 h-12 mr-3 rounded-full overflow-hidden flex-shrink-0">
                            <LetterAvatar email={user.email} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">ID: {user.id}</h3>
                            <p className="text-sm text-neutral-400 mb-1">
                              {user.email}
                            </p>
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant={user.admin ? "admin" : "user"}>
                                {user.admin ? "Admin" : "User"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Link
                            to={`/`} // TODO
                            className="p-1.5 text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/30 rounded transition-colors flex items-center gap-1"
                          >
                            <Eye size={16} />
                            <span className="text-xs">View</span>
                          </Link>
                          <button
                            className="p-1.5 text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30 rounded transition-colors flex items-center gap-1"
                            onClick={() => openBanDialog(user.id)}
                          >
                            <UserX size={16} />
                            <span className="text-xs">Ban</span>
                          </button>
                          <button
                            className="p-1.5 text-amber-400 hover:text-amber-300 bg-amber-900/20 hover:bg-amber-900/30 rounded transition-colors flex items-center gap-1"
                            onClick={() => openPromoteDialog(user.id)}
                          >
                            <UserCog size={16} />
                            <span className="text-xs">Role</span>
                          </button>
                          <button
                            className="p-1.5 text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30 rounded transition-colors flex items-center gap-1"
                            onClick={() => openDeleteDialog(user.id)}
                          >
                            <Trash2 size={16} />
                            <span className="text-xs">Delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Desktop table view with separate columns */}
                      <div className="col-span-1 px-6 py-4 min-h-[72px] items-center hidden md:flex">
                        <div className="flex items-center">
                          <div className="w-8 h-8 mr-3 rounded-full overflow-hidden">
                            <LetterAvatar email={user.email} />
                          </div>
                          <div className="font-medium">{user.id}</div>
                        </div>
                      </div>
                      <div className="col-span-2 px-6 py-4 items-center text-sm hidden md:flex">
                        {user.email}
                      </div>
                      <div className="col-span-1 px-6 py-4 items-center text-sm hidden md:flex">
                        <Badge variant={user.admin ? "admin" : "user"}>
                          {user.admin ? "Admin" : "User"}
                        </Badge>
                      </div>
                      <div className="col-span-3 px-6 py-4 items-center hidden md:flex">
                        <div className="flex space-x-1.5">
                          <Link
                            to={`/`} // TODO
                            className="p-1.5 text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/30 rounded transition-colors"
                            title="View user profile"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            className="p-1.5 text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30 rounded transition-colors"
                            title="Ban user"
                            onClick={() => openBanDialog(user.id)}
                          >
                            <UserX size={16} />
                          </button>
                          <button
                            className="p-1.5 text-amber-400 hover:text-amber-300 bg-amber-900/20 hover:bg-amber-900/30 rounded transition-colors"
                            title="Change user role"
                            onClick={() => openPromoteDialog(user.id)}
                          >
                            <UserCog size={16} />
                          </button>
                          <button
                            className="p-1.5 text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30 rounded transition-colors"
                            title="Delete user"
                            onClick={() => openDeleteDialog(user.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 bg-neutral-800/40 text-center">
                    <p className="text-neutral-400">
                      No users found matching the selected filters.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User management dialogs */}
      <BanUserDialog
        open={banDialogOpen}
        onOpenChange={setBanDialogOpen}
        userId={selectedUserId}
        onAction={handleBanUser}
      />

      <UnbanUserDialog
        open={unbanDialogOpen}
        onOpenChange={setUnbanDialogOpen}
        userId={selectedUserId}
        onAction={handleUnbanUser}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        userId={selectedUserId}
        onAction={handleDeleteUser}
      />

      <PromoteUserDialog
        open={promoteDialogOpen}
        onOpenChange={setPromoteDialogOpen}
        userId={selectedUserId}
        onAction={handlePromoteUser}
      />
    </div>
  );
}
