import { useRequireAuth } from "../../hooks/useRequireAuth";

export default function ContentModeration() {
  useRequireAuth();

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 py-10">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 rounded-2xl border border-amber-700/30 p-8">
          <h1 className="text-2xl font-bold text-white mb-4">
            Content Moderation
          </h1>
          <p className="text-neutral-400">Review and moderate user listings</p>

          {/* Content moderation interface will go here */}
          <div className="mt-8 p-4 bg-neutral-800 rounded-lg">
            <p className="text-amber-300">Moderation tools coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
