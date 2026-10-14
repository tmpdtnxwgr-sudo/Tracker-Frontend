import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  RefreshCw,
  MapPin,
  CalendarDays,
  ArrowUpRight,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Menu,
  X,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

const STATUS_OPTIONS = [
  "Pending",
  "Shipment Created",
  "Picked Up",
  "In Transit",
  "Arrived at Facility",
  "Out for Delivery",
  "Delivered",
  "Delivery Attempted",
  "On Hold",
  "Exception",
  "Cancelled",
  "Returned",
];

const STATUS_STYLES = {
  Pending: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  "Shipment Created":
    "border-blue-500/20 bg-blue-500/10 text-blue-400",
  "Picked Up": "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
  "In Transit": "border-sky-500/20 bg-sky-500/10 text-sky-400",
  "Arrived at Facility":
    "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
  "Out for Delivery":
    "border-purple-500/20 bg-purple-500/10 text-purple-400",
  Delivered: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  "Delivery Attempted":
    "border-orange-500/20 bg-orange-500/10 text-orange-400",
  "On Hold": "border-amber-500/20 bg-amber-500/10 text-amber-400",
  Exception: "border-red-500/20 bg-red-500/10 text-red-400",
  Cancelled: "border-gray-500/20 bg-gray-500/10 text-gray-400",
  Returned: "border-rose-500/20 bg-rose-500/10 text-rose-400",
};

function formatDate(date) {
  if (!date) return "Not scheduled";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not scheduled";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getLocation(address) {
  if (!address) return "Location unavailable";

  return [address.city, address.country].filter(Boolean).join(", ") ||
    "Location unavailable";
}

function StatCard({ title, value, description, icon: Icon, accent }) {
  return (
    <article className="rounded-2xl border border-white/[0.07] bg-[#101010] p-5 transition hover:border-[#D4AF37]/30 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-400">{title}</p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-2 text-xs text-gray-500">{description}</p>
        </div>

        <div
          className={`rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 ${accent}`}
        >
          <Icon size={22} />
        </div>
      </div>
    </article>
  );
}

function StatusBadge({ status }) {
  const styles =
    STATUS_STYLES[status] ||
    "border-gray-500/20 bg-gray-500/10 text-gray-400";

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${styles}`}
    >
      {status || "Unknown"}
    </span>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  const fetchPackages = useCallback(
    async ({ silent = false } = {}) => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }

      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "20",
        });

        if (statusFilter) {
          params.set("status", statusFilter);
        }

        const response = await fetch(
          `${API_URL}/packages?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login", { replace: true });
          return;
        }

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load packages."
          );
        }

        setPackages(result.data?.packages || []);

        setPagination(
          result.data?.pagination || {
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 1,
          }
        );
      } catch (err) {
        setError(
          err.message ||
            "Could not connect to the server. Check that your backend is running."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigate, page, statusFilter]
  );

 useEffect(() => {
  const timer = setTimeout(() => {
    fetchPackages();
  }, 0);

  return () => clearTimeout(timer);
}, [fetchPackages]);
  // These statistics describe the packages currently loaded.
  // The total package count comes from backend pagination.
  const stats = useMemo(() => {
    return {
      total: pagination.total,
      inTransit: packages.filter((item) =>
        [
          "Picked Up",
          "In Transit",
          "Arrived at Facility",
          "Out for Delivery",
        ].includes(item.status)
      ).length,
      delivered: packages.filter(
        (item) => item.status === "Delivered"
      ).length,
      pending: packages.filter((item) =>
        ["Pending", "Shipment Created"].includes(item.status)
      ).length,
    };
  }, [packages, pagination.total]);

  const filteredPackages = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return packages;

    return packages.filter((item) => {
      const searchableValues = [
        item.trackingNumber,
        item.sender?.name,
        item.recipient?.name,
        item.recipient?.email,
        item.recipient?.phone,
        item.origin?.city,
        item.origin?.country,
        item.destination?.city,
        item.destination?.country,
        item.packageDescription,
      ];

      return searchableValues.some((value) =>
        String(value || "").toLowerCase().includes(term)
      );
    });
  }, [packages, search]);

  function handleStatusFilter(value) {
    setStatusFilter(value);
    setPage(1);
  }

  function handlePageChange(nextPage) {
    if (
      nextPage < 1 ||
      nextPage > pagination.totalPages ||
      nextPage === page
    ) {
      return;
    }

    setPage(nextPage);
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* Top navigation */}
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080808]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-2.5">
              <Package className="text-[#D4AF37]" size={23} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-wide text-[#D4AF37]">
                TrackXpress
              </h1>
              <p className="text-xs text-gray-500">Administration</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <span className="flex items-center gap-2 text-sm text-[#D4AF37]">
              <LayoutDashboard size={17} />
              Dashboard
            </span>

            <Link
              to="/"
              className="text-sm text-gray-400 transition hover:text-white"
            >
              View Website
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <span className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1.5 text-xs text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Admin session
            </span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="rounded-lg border border-white/10 p-2 text-gray-300 md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="space-y-3 border-t border-white/[0.07] px-5 py-4 md:hidden">
            <Link
              to="/"
              className="block text-sm text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              View Website
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-300"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </header>

      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        {/* Page heading */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              Control Centre
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Dashboard <span className="text-[#D4AF37]">Overview</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">
              Manage shipments, monitor delivery progress, and keep
              every package moving.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => fetchPackages({ silent: true })}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-gray-300 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37] disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/packages/new")
              }
              className="gold-button justify-center"
            >
              <Plus size={17} />
              Create Shipment
            </button>
          </div>
        </section>

        {/* Error message */}
        {error && (
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-red-400"
            />

            <div className="flex-1">
              <p className="text-sm font-medium text-red-300">
                Unable to load shipments
              </p>
              <p className="mt-1 text-sm text-gray-400">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => fetchPackages()}
              className="text-sm text-[#D4AF37] hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Statistics */}
        <section className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Packages"
            value={stats.total.toLocaleString()}
            description="All registered shipments"
            icon={Package}
            accent="text-[#D4AF37]"
          />

          <StatCard
            title="In Transit"
            value={stats.inTransit.toLocaleString()}
            description="Active delivery stages"
            icon={Truck}
            accent="text-sky-400"
          />

          <StatCard
            title="Delivered"
            value={stats.delivered.toLocaleString()}
            description="Delivered on this page"
            icon={CheckCircle2}
            accent="text-emerald-400"
          />

          <StatCard
            title="Pending"
            value={stats.pending.toLocaleString()}
            description="Awaiting shipment progress"
            icon={Clock}
            accent="text-amber-400"
          />
        </section>

        {/* Package table */}
        <section className="mt-10 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101010]">
          <div className="flex flex-col justify-between gap-5 border-b border-white/[0.07] p-5 sm:p-6 lg:flex-row lg:items-center">
            <div>
              <h3 className="text-lg font-semibold">
                Shipment Management
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Browse and monitor your registered packages.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 sm:w-72">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search loaded packages..."
                  className="w-full rounded-xl border border-white/10 bg-[#080808] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#D4AF37]/50"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  handleStatusFilter(event.target.value)
                }
                className="rounded-xl border border-white/10 bg-[#080808] px-4 py-3 text-sm text-gray-300 outline-none focus:border-[#D4AF37]/50"
                aria-label="Filter packages by status"
              >
                <option value="">All statuses</option>

                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4">
              <RefreshCw
                size={28}
                className="animate-spin text-[#D4AF37]"
              />
              <p className="text-sm text-gray-400">
                Loading shipments...
              </p>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                <Package size={30} className="text-gray-500" />
              </div>

              <h4 className="mt-5 font-semibold">
                {search || statusFilter
                  ? "No matching packages"
                  : "No shipments yet"}
              </h4>

              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                {search || statusFilter
                  ? "Try changing your search term or status filter."
                  : "Your registered shipments will appear here."}
              </p>

              {!search && !statusFilter && (
                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin/packages/new")
                  }
                  className="gold-button mt-5"
                >
                  <Plus size={16} />
                  Create First Shipment
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                        Tracking Number
                      </th>

                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                        Recipient
                      </th>

                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                        Destination
                      </th>

                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                        Created
                      </th>

                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                        Details
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPackages.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-white/[0.05] transition last:border-0 hover:bg-white/[0.02]"
                      >
                        <td className="px-6 py-5">
                          <p className="font-mono text-sm font-semibold text-[#D4AF37]">
                            {item.trackingNumber}
                          </p>

                          <p className="mt-1 max-w-48 truncate text-xs text-gray-500">
                            {item.packageDescription}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-gray-200">
                            {item.recipient?.name || "Unknown"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {item.recipient?.phone || "No phone"}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-start gap-2">
                            <MapPin
                              size={15}
                              className="mt-0.5 shrink-0 text-gray-500"
                            />

                            <span className="text-sm text-gray-300">
                              {getLocation(item.destination)}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <StatusBadge status={item.status} />
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <CalendarDays
                              size={15}
                              className="text-gray-500"
                            />

                            {formatDate(item.createdAt)}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/packages/${item._id}`
                              )
                            }
                            className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-[#D4AF37]"
                          >
                            View
                            <ArrowUpRight size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-4 border-t border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="text-gray-300">
                    {pagination.total === 0
                      ? 0
                      : (page - 1) * pagination.limit + 1}
                    {"–"}
                    {Math.min(
                      page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="text-gray-300">
                    {pagination.total}
                  </span>{" "}
                  packages
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <span className="px-3 text-sm text-gray-400">
                    Page {pagination.page} of{" "}
                    {Math.max(1, pagination.totalPages)}
                  </span>

                  <button
                    type="button"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= pagination.totalPages}
                    className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Next page"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-8 flex flex-col justify-between gap-3 border-t border-white/[0.06] pt-6 text-xs text-gray-600 sm:flex-row">
          <p>
            © {new Date().getFullYear()} TrackXpress. Your Package. Our
            Priority.
          </p>

          <p>Shipment administration</p>
        </footer>
      </div>
    </main>
  );
}