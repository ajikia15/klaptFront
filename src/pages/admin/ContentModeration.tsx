import { useState } from "react";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useSearchLaptops } from "../../hooks/useSearch"; // Import from useSearch.ts
import { CheckCircle, XCircle, Eye, Trash2, AlertTriangle } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function ContentModeration() {
  useRequireAuth();

  // Use the hook from useSearch.ts
  const { laptops, isLoading, error } = useSearchLaptops();

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Function to handle the NUKE action
  const handleNukeAll = () => {
    if (
      window.confirm(
        "⚠️ WARNING: This will DELETE ALL LISTINGS from the database. This action CANNOT be undone! Are you absolutely sure?"
      )
    ) {
      alert(
        "NUKE command initiated! All listings would be deleted if this was connected to the backend."
      );
      // The actual delete functionality will be implemented by you
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 py-10">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 rounded-2xl border border-amber-700/30 p-8">
          <h1 className="text-2xl font-bold text-white mb-4">
            Content Moderation
          </h1>
          <p className="text-neutral-400 mb-6">
            Review and moderate user laptop listings
          </p>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === "all"
                  ? "bg-amber-600 text-white"
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              }`}
            >
              All Listings
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === "pending"
                  ? "bg-amber-600 text-white"
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("approved")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === "approved"
                  ? "bg-amber-600 text-white"
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setStatusFilter("rejected")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === "rejected"
                  ? "bg-amber-600 text-white"
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              }`}
            >
              Rejected
            </button>
          </div>

          {/* NUKE Button Section */}
          <div className="mb-8 border-2 border-red-700 bg-red-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="text-red-500 mr-2" size={24} />
                <span className="text-red-400 font-bold">DANGER ZONE</span>
              </div>
              <button
                onClick={handleNukeAll}
                className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg flex items-center gap-2 transform transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse"
              >
                <AlertTriangle size={18} />
                <span className="uppercase tracking-wider">
                  NUKE ALL LISTINGS
                </span>
                <AlertTriangle size={18} />
              </button>
            </div>
            <p className="text-red-300 mt-2 text-sm">
              This action will permanently delete ALL listings from the
              database. Use with extreme caution!
            </p>
          </div>

          {/* Laptops Table */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-6 text-center">
              <h3 className="text-red-300 font-semibold text-lg">
                Error Loading Laptops
              </h3>
              <p className="text-neutral-300 mt-2">
                We encountered a problem while fetching laptop listings.
              </p>
            </div>
          ) : laptops && laptops.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-neutral-800 rounded-lg">
                  <tr>
                    <th className="px-6 py-3 rounded-l-lg">Title</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 rounded-r-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {laptops
                    .filter(
                      (laptop) =>
                        statusFilter === "all" || laptop.status === statusFilter
                    )
                    .map((laptop) => (
                      <tr
                        key={laptop.id}
                        className="bg-neutral-800/30 border-b border-neutral-700/30"
                      >
                        <td className="px-6 py-4 font-medium">
                          <div className="flex items-center">
                            {laptop.images && laptop.images.length > 0 && (
                              <img
                                src={laptop.images[0]}
                                alt={laptop.title}
                                className="w-10 h-10 mr-3 rounded object-cover"
                              />
                            )}
                            <span className="line-clamp-1">{laptop.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">${laptop.price}</td>
                        <td className="px-6 py-4">
                          {laptop.userId || "Unknown"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium 
                          ${
                            laptop.status === "approved"
                              ? "bg-green-900/30 text-green-400 border border-green-800/30"
                              : laptop.status === "rejected"
                              ? "bg-red-900/30 text-red-400 border border-red-800/30"
                              : "bg-amber-900/30 text-amber-400 border border-amber-800/30"
                          }`}
                          >
                            {laptop.status || "pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <Link
                              to="/laptop/$laptopId"
                              params={{ laptopId: laptop.id.toString() }}
                              className="p-1.5 text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/30 rounded transition-colors"
                              title="View listing"
                            >
                              <Eye size={16} />
                            </Link>
                            <button
                              className="p-1.5 text-green-400 hover:text-green-300 bg-green-900/20 hover:bg-green-900/30 rounded transition-colors"
                              title="Approve listing"
                              onClick={() =>
                                alert(`Approve laptop #${laptop.id}`)
                              }
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              className="p-1.5 text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30 rounded transition-colors"
                              title="Reject listing"
                              onClick={() =>
                                alert(`Reject laptop #${laptop.id}`)
                              }
                            >
                              <XCircle size={16} />
                            </button>
                            <button
                              className="p-1.5 text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30 rounded transition-colors"
                              title="Delete listing"
                              onClick={() =>
                                alert(`Delete laptop #${laptop.id}`)
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-neutral-800/40 border border-neutral-700/30 rounded-lg p-8 text-center">
              <p className="text-neutral-400">
                No laptops found matching the selected filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
