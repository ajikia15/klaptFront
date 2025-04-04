import { Settings } from "lucide-react";

export default function ProfileSettings() {
  return (
    <div className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 rounded-2xl border border-neutral-700/50 p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.07),transparent_70%)]"></div>
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-1 w-5 bg-secondary-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-white">Account Settings</h2>
        </div>

        <p className="text-neutral-400 mb-6">
          Manage your account settings and preferences
        </p>

        <div className="space-y-6">
          {/* Settings options will go here */}
          <div className="p-6 bg-neutral-800/50 rounded-lg border border-neutral-700/30">
            <h3 className="text-lg font-medium text-white mb-4">Coming Soon</h3>
            <p className="text-neutral-400">
              Account settings functionality is currently under development
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
