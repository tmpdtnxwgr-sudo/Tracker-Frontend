import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  RefreshCw,
  MapPin,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleString();
}

function InfoRow({ label, value }) {
  const displayValue =
    value && typeof value === "object"
      ? [
          value.street || value.address,
          value.city,
          value.state,
          value.postalCode,
          value.country,
        ]
          .filter(Boolean)
          .join(", ")
      : value;

  return (
    <div className="border-b border-white/10 py-3 last:border-b-0">
      <p className="text-xs uppercase tracking-wider text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm text-gray-200">
        {displayValue || "Not provided"}
      </p>
    </div>
  );
}

function ContactCard({ title, contact }) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#111111] p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#d4af37]">
        {title}
      </h2>

      <InfoRow
        label="Name"
        value={contact?.name}
      />
      <InfoRow
        label="Email"
        value={contact?.email}
      />
      <InfoRow
        label="Phone"
        value={contact?.phone}
      />
      <InfoRow
        label="Address"
        value={contact?.address}
      />
    </section>
  );
}

export default function AdminPackageDetails() {
  const { id } = useParams();

  const [packageItem, setPackageItem] = useState(null);
  const [trackingEvents, setTrackingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("adminToken");

  const fetchPackage = useCallback(async () => {
    setError("");

    try {
      const response = await fetch(`${API_URL}/packages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load shipment details."
        );
      }

      setPackageItem(result.data.package);
      setTrackingEvents(result.data.trackingEvents || []);
    } catch (err) {
      setError(err.message || "Unable to load shipment details.");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
  let cancelled = false;

  const loadPackage = async () => {
    setError("");

    try {
      const response = await fetch(`${API_URL}/packages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load shipment details."
        );
      }

      if (!cancelled) {
        setPackageItem(result.data.package);
        setTrackingEvents(result.data.trackingEvents || []);
      }
    } catch (err) {
      if (!cancelled) {
        setError(err.message || "Unable to load shipment details.");
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  loadPackage();

  return () => {
    cancelled = true;
  };
}, [id, token]);

  const handleUpdateTracking = async () => {
    setSyncing(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/packages/${id}/trace-sync`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to update tracking information."
        );
      }

      setMessage(
        result.message ||
          `Tracking updated. ${result.data?.newEventsSaved ?? 0} new events saved.`
      );

      await fetchPackage();
    } catch (err) {
      setError(err.message || "Unable to update tracking information.");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-gray-300">
        <RefreshCw className="mr-3 animate-spin text-[#d4af37]" size={20} />
        Loading shipment...
      </div>
    );
  }

  if (!packageItem) {
    return (
      <main className="min-h-screen bg-black px-5 py-10 text-white">
        <p className="mb-5 text-red-400">
          {error || "Shipment not found."}
        </p>
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 text-[#d4af37] hover:text-yellow-300"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </main>
    );
  }

  const origin = packageItem.origin || {};
  const destination = packageItem.destination || {};

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/admin/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#d4af37]"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#d4af37]">
              TrackXpress / Shipment Details
            </p>

            <h1 className="break-words text-2xl font-bold sm:text-3xl">
              {packageItem.trackingNumber}
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Carrier: {packageItem.carrier || "Not assigned"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleUpdateTracking}
            disabled={syncing || !packageItem.externalTrackingNumber}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={syncing ? "animate-spin" : ""}
            />
            {syncing ? "Updating Tracking..." : "Update Tracking"}
          </button>
        </header>

        {!packageItem.externalTrackingNumber && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-200">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            Add an external carrier tracking number to this shipment before
            requesting carrier updates.
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-[#111111] p-5">
            <Package className="mb-4 text-[#d4af37]" size={22} />
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Current Status
            </p>
            <p className="mt-2 font-semibold">
              {packageItem.status || "Pending"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#111111] p-5">
            <Truck className="mb-4 text-[#d4af37]" size={22} />
            <p className="text-xs uppercase tracking-wider text-gray-500">
              External Tracking
            </p>
            <p className="mt-2 break-words text-sm font-semibold">
              {packageItem.externalTrackingNumber || "Not assigned"}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#111111] p-5">
            <Clock className="mb-4 text-[#d4af37]" size={22} />
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Estimated Delivery
            </p>
            <p className="mt-2 text-sm font-semibold">
              {formatDate(packageItem.estimatedDelivery)}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#111111] p-5">
            <CheckCircle2 className="mb-4 text-[#d4af37]" size={22} />
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Actual Delivery
            </p>
            <p className="mt-2 text-sm font-semibold">
              {formatDate(packageItem.actualDelivery)}
            </p>
          </div>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ContactCard
            title="Sender Information"
            contact={packageItem.sender}
          />

          <ContactCard
            title="Recipient Information"
            contact={packageItem.recipient}
          />
        </section>

        <section className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-[#111111] p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#d4af37]">
              <MapPin size={18} />
              Origin
            </h2>

            <InfoRow label="Address" value={origin.address} />
            <InfoRow label="City" value={origin.city} />
            <InfoRow label="State" value={origin.state} />
            <InfoRow label="Country" value={origin.country} />
          </div>

          <div className="rounded-xl border border-white/10 bg-[#111111] p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#d4af37]">
              <MapPin size={18} />
              Destination
            </h2>

            <InfoRow label="Address" value={destination.address} />
            <InfoRow label="City" value={destination.city} />
            <InfoRow label="State" value={destination.state} />
            <InfoRow label="Country" value={destination.country} />
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-[#111111] p-5 sm:p-7">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">
                Tracking History
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {trackingEvents.length} recorded event
                {trackingEvents.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {trackingEvents.length === 0 ? (
            <p className="rounded-lg border border-dashed border-white/10 p-6 text-center text-sm text-gray-500">
              No tracking events have been recorded yet.
            </p>
          ) : (
            <div className="space-y-0">
              {trackingEvents.map((event, index) => (
                <div
                  key={event._id || `${event.timestamp}-${index}`}
                  className="relative flex gap-4 pb-7 last:pb-0"
                >
                  <div className="flex flex-col items-center">
                    <span className="mt-1 h-3 w-3 rounded-full border-2 border-[#d4af37] bg-black" />
                    {index !== trackingEvents.length - 1 && (
                      <span className="mt-2 w-px flex-1 bg-white/10" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                      <h3 className="font-semibold text-white">
                        {event.status}
                      </h3>
                      <time className="text-xs text-gray-500">
                        {formatDate(event.timestamp)}
                      </time>
                    </div>

                    <p className="mt-2 break-words text-sm leading-6 text-gray-300">
                      {event.description}
                    </p>

                    <p className="mt-2 flex items-start gap-2 text-xs text-gray-500">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      {event.location || "Location unavailable"}
                    </p>

                    {event.source === "carrier_api" && (
                      <span className="mt-3 inline-block rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-2.5 py-1 text-xs text-[#d4af37]">
                        Carrier Update
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}