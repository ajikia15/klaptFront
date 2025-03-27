import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-neutral-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">User Profile</h1>

        <div className="mb-6">
          <div className="bg-neutral-700 rounded-full h-24 w-24 flex items-center justify-center mb-4 mx-auto">
            <span className="text-4xl text-white">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-center text-white">
            {user?.email}
          </h2>
        </div>

        <div className="border-t border-neutral-600 pt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-white">
              Account Information
            </h3>
            <div className="bg-neutral-700 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Email:</span>
                <span className="text-white">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">User ID:</span>
                <span className="text-white">{user?.id}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">
              Preferences
            </h3>
            <p className="text-gray-300 mb-4">
              Manage your account preferences and settings.
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
