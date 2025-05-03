export default function ProfileSettings() {
  return (
    <div className="from-neutral-800/70 to-neutral-900/90 border-neutral-700/50 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.07),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-5"></div>

      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-2">
          <div className="h-1 w-5 rounded-full bg-secondary-500"></div>
          <h2 className="text-2xl font-bold text-white">Account Settings</h2>
        </div>

        <p className="mb-6 text-neutral-400">
          Manage your account settings and preferences
        </p>

        <div className="space-y-6">
          {/* Settings options will go here */}
          <div className="bg-neutral-800/50 border-neutral-700/30 rounded-lg border p-6">
            <h3 className="mb-4 text-lg font-medium text-white">Coming Soon</h3>
            <p className="text-neutral-400">
              Account settings functionality is currently under development
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
