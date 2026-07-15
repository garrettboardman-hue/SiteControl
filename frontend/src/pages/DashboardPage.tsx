import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats, type DashboardStats } from "../api/client";

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-navy-500">{label}</p>
          <p className="mt-2 text-3xl font-extrabold text-navy-900">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "status-pending",
    processing: "status-processing",
    completed: "status-completed",
    flagged: "status-flagged",
    failed: "status-failed",
  };
  return (
    <span className={`status-badge ${map[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy-200 border-t-ship-600" />
          <p className="text-sm text-navy-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-center">
          <p className="text-sm font-medium text-red-800">Failed to load dashboard</p>
          <p className="mt-1 text-xs text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-navy-500">
          Overview of your logistics document processing
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Shipments"
          value={stats?.totalShipments ?? 0}
          color="bg-ship-50 text-ship-700"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          }
        />
        <StatCard
          label="Total Documents"
          value={stats?.totalDocuments ?? 0}
          color="bg-navy-50 text-navy-700"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          }
        />
        <StatCard
          label="Flagged Items"
          value={stats?.flaggedDocuments ?? 0}
          color="bg-red-50 text-red-700"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          }
        />
        <StatCard
          label="Pending Review"
          value={stats?.pendingDocuments ?? 0}
          color="bg-yellow-50 text-yellow-700"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Documents */}
        <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy-900">Recent Documents</h2>
            <Link
              to="/documents"
              className="text-sm font-medium text-ship-600 hover:text-ship-700"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {stats?.recentDocuments.length === 0 ? (
              <p className="py-8 text-center text-sm text-navy-400">No documents yet</p>
            ) : (
              stats?.recentDocuments.map((doc) => (
                <Link
                  key={doc.id}
                  to={`/documents/${doc.id}`}
                  className="flex items-center justify-between rounded-lg border border-navy-100 px-4 py-3 transition-colors hover:bg-navy-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-navy-900">
                      {doc.filename}
                    </p>
                    <p className="text-xs text-navy-500">
                      {doc.documentType.replace(/_/g, " ")} &middot;{" "}
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={doc.status} />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Shipments */}
        <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy-900">Recent Shipments</h2>
          </div>
          <div className="mt-4 space-y-3">
            {stats?.recentShipments.length === 0 ? (
              <p className="py-8 text-center text-sm text-navy-400">No shipments yet</p>
            ) : (
              stats?.recentShipments.map((ship) => (
                <div
                  key={ship.id}
                  className="rounded-lg border border-navy-100 px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-navy-900">
                      {ship.reference || "Unnamed Shipment"}
                    </p>
                    <span className="status-badge bg-navy-100 text-navy-700">
                      {ship.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-navy-500">
                    {ship.origin || "?"} &rarr; {ship.destination || "?"}
                    {ship.carrier ? ` &middot; ${ship.carrier}` : ""}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}