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
import { Button } from "@/components/ui/button";

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
      className="flex items-center justify-center rounded-full font-medium text-white"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-amber-700/30 bg-neutral-800 p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Ban User</h2>
        <p className="mb-6 text-neutral-300">
          Are you sure you want to ban this user? They will no longer be able to
          log in or post content.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => onOpenChange(false)}
            className="rounded-lg bg-neutral-700 px-4 py-2 text-neutral-200 hover:bg-neutral-600"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onAction(userId)}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Ban User
          </Button>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-amber-700/30 bg-neutral-800 p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Unban User</h2>
        <p className="mb-6 text-neutral-300">
          Are you sure you want to unban this user? They will regain access to
          their account.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => onOpenChange(false)}
            className="rounded-lg bg-neutral-700 px-4 py-2 text-neutral-200 hover:bg-neutral-600"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onAction(userId)}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Unban User
          </Button>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-amber-700/30 bg-neutral-800 p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Delete User</h2>
        <p className="mb-6 text-neutral-300">
          Are you sure you want to permanently delete this user? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => onOpenChange(false)}
            className="rounded-lg bg-neutral-700 px-4 py-2 text-neutral-200 hover:bg-neutral-600"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onAction(userId)}
            className="rounded-lg bg-red-700 px-4 py-2 text-white hover:bg-red-800"
          >
            Delete User
          </Button>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-amber-700/30 bg-neutral-800 p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Change User Role</h2>
        <p className="mb-4 text-neutral-300">
          Select a new role for this user:
        </p>
        <div className="mb-6">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full rounded-lg border border-neutral-600 bg-neutral-700 p-2 text-neutral-200"
          >
            <option value="user">Regular User</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => onOpenChange(false)}
            className="rounded-lg bg-neutral-700 px-4 py-2 text-neutral-200 hover:bg-neutral-600"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onAction(userId, selectedRole)}
            className="rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
          >
            Change Role
          </Button>
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
    <div className="min-h-screen bg-neutral-900 py-10 text-neutral-200">
      <div className="container mx-auto px-4">
        <div className="from-neutral-800/70 to-neutral-900/90 rounded-2xl border border-amber-700/30 bg-gradient-to-br p-4 sm:p-8">
          <h1 className="mb-4 text-2xl font-bold text-white">
            User Management
          </h1>
          <p className="mb-6 text-neutral-400">
            Manage user accounts, permissions, and access
          </p>

          {/* Filter buttons */}
          <div className="mb-4">
            <h3 className="mb-2 text-sm text-neutral-400">Filter by Role:</h3>
            <div className="mb-6 flex flex-wrap gap-2">
              {["all", "admin", "user"].map((role) => {
                let activeClass = "";
                let inactiveClass = "";

                switch (role) {
                  case "admin":
                    activeClass = "bg-amber-600 text-white";
                    inactiveClass =
                      "border border-amber-800/30 bg-amber-900/20 text-amber-400 hover:bg-amber-900/40 hover:text-amber-300";
                    break;
                  case "user":
                    activeClass = "bg-green-600 text-white";
                    inactiveClass =
                      "border border-green-800/30 bg-green-900/20 text-green-400 hover:bg-green-900/40 hover:text-green-300";
                    break;
                  default: // "all"
                    activeClass = "bg-neutral-600 text-white";
                    inactiveClass =
                      "bg-neutral-800/70 border-neutral-700/30 border text-neutral-400 hover:bg-neutral-700 hover:text-neutral-300";
                }

                return (
                  <Button
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
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="border-neutral-700/30 overflow-x-auto rounded-lg border">
            {/* Table header - grid for desktop with additional Role column */}
            <div className="hidden grid-cols-7 bg-neutral-800 text-xs font-medium uppercase md:grid">
              <div className="col-span-1 px-6 py-3">ID</div>
              <div className="col-span-2 px-6 py-3">Email</div>
              <div className="col-span-1 px-6 py-3">Role</div>
              <div className="col-span-3 px-6 py-3">Actions</div>
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="bg-neutral-800/40 py-8 text-center">
                <p className="text-neutral-400">Loading users...</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="bg-neutral-800/40 py-8 text-center">
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
                      className="bg-neutral-800/30 border-neutral-700/30 hover:bg-neutral-800/50 block border-b transition-colors md:grid md:grid-cols-7"
                    >
                      {/* Mobile card view */}
                      <div className="p-4 md:hidden">
                        <div className="mb-3 flex items-start">
                          <div className="mr-3 h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                            <LetterAvatar email={user.email} />
                          </div>
                          <div className="flex-1">
                            <h3 className="mb-1 font-medium">ID: {user.id}</h3>
                            <p className="mb-1 text-sm text-neutral-400">
                              {user.email}
                            </p>
                            <div className="mb-2 flex items-center gap-3">
                              <Badge variant={user.admin ? "admin" : "user"}>
                                {user.admin ? "Admin" : "User"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Link
                            to={`/`} // TODO
                            className="flex items-center gap-1 rounded bg-blue-900/20 p-1.5 text-blue-400 transition-colors hover:bg-blue-900/30 hover:text-blue-300"
                          >
                            <Eye size={16} />
                            <span className="text-xs">View</span>
                          </Link>
                          <Button
                            className="flex items-center gap-1 rounded bg-red-900/20 p-1.5 text-red-400 transition-colors hover:bg-red-900/30 hover:text-red-300"
                            onClick={() => openBanDialog(user.id)}
                          >
                            <UserX size={16} />
                            <span className="text-xs">Ban</span>
                          </Button>
                          <Button
                            className="flex items-center gap-1 rounded bg-amber-900/20 p-1.5 text-amber-400 transition-colors hover:bg-amber-900/30 hover:text-amber-300"
                            onClick={() => openPromoteDialog(user.id)}
                          >
                            <UserCog size={16} />
                            <span className="text-xs">Role</span>
                          </Button>
                          <Button
                            className="flex items-center gap-1 rounded bg-red-900/20 p-1.5 text-red-400 transition-colors hover:bg-red-900/30 hover:text-red-300"
                            onClick={() => openDeleteDialog(user.id)}
                          >
                            <Trash2 size={16} />
                            <span className="text-xs">Delete</span>
                          </Button>
                        </div>
                      </div>

                      {/* Desktop table view with separate columns */}
                      <div className="col-span-1 hidden min-h-[72px] items-center px-6 py-4 md:flex">
                        <div className="flex items-center">
                          <div className="mr-3 h-8 w-8 overflow-hidden rounded-full">
                            <LetterAvatar email={user.email} />
                          </div>
                          <div className="font-medium">{user.id}</div>
                        </div>
                      </div>
                      <div className="col-span-2 hidden items-center px-6 py-4 text-sm md:flex">
                        {user.email}
                      </div>
                      <div className="col-span-1 hidden items-center px-6 py-4 text-sm md:flex">
                        <Badge variant={user.admin ? "admin" : "user"}>
                          {user.admin ? "Admin" : "User"}
                        </Badge>
                      </div>
                      <div className="col-span-3 hidden items-center px-6 py-4 md:flex">
                        <div className="flex space-x-1.5">
                          <Link
                            to={`/`} // TODO
                            className="rounded bg-blue-900/20 p-1.5 text-blue-400 transition-colors hover:bg-blue-900/30 hover:text-blue-300"
                            title="View user profile"
                          >
                            <Eye size={16} />
                          </Link>
                          <Button
                            className="rounded bg-red-900/20 p-1.5 text-red-400 transition-colors hover:bg-red-900/30 hover:text-red-300"
                            title="Ban user"
                            onClick={() => openBanDialog(user.id)}
                          >
                            <UserX size={16} />
                          </Button>
                          <Button
                            className="rounded bg-amber-900/20 p-1.5 text-amber-400 transition-colors hover:bg-amber-900/30 hover:text-amber-300"
                            title="Change user role"
                            onClick={() => openPromoteDialog(user.id)}
                          >
                            <UserCog size={16} />
                          </Button>
                          <Button
                            className="rounded bg-red-900/20 p-1.5 text-red-400 transition-colors hover:bg-red-900/30 hover:text-red-300"
                            title="Delete user"
                            onClick={() => openDeleteDialog(user.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-neutral-800/40 py-8 text-center">
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
