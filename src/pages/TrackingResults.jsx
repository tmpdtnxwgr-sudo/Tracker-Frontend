import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Search,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Truck,
} from "lucide-react";

const API_URL = "https://tracker-umber-seven-50.vercel.app/api";

export default function TrackingResults() {
  const { trackingNumber } = useParams();

  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchTracking() {
      setLoading(true);
      setError("");
      setTrackingData(null);

      try {
        const response = await fetch(
          `${API_URL}/packages/track/${encodeURIComponent(trackingNumber)}`
        );

        const result = await response.json().catch(() => null);
        console.log("Tracking API response:", result);
console.log(
  "Tracking details:",
  JSON.stringify(result?.data?.tracking, null, 2)
)

        if (!response.ok) {
          throw new Error(
            result?.message ||
              result?.error ||
              "Unable to retrieve tracking information."
          );
        }

        if (!cancelled) {
          setTrackingData(result?.data ?? result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              "Unable to connect to the tracking service. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (trackingNumber) {
      fetchTracking();
    }

    return () => {
      cancelled = true;
    };
  }, [trackingNumber]);

  const packageInfo =
    trackingData?.package ||
    trackingData?.tracking ||
    trackingData;

  const events =
    trackingData?.trackingEvents ||
    trackingData?.events ||
    packageInfo?.events ||
    [];

  function formatDate(value) {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Date unavailable";

    return date.toLocaleString();
  }

  function getLocation(event) {
    const location = event?.location;

    if (typeof location === "string") return location;

    if (location && typeof location === "object") {
      return [
        location.city,
        location.state,
        location.country,
        location.name,
      ]
        .filter(Boolean)
        .join(", ");
    }

    return "Location unavailable";
  }

  function getStatus() {
    return (
      packageInfo?.status ||
      events?.[events.length - 1]?.status ||
      "Status unavailable"
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10">
              <Package size={26} className="text-[#D4AF37]" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#D4AF37]">
                TrackXpress
              </h1>
              <p className="text-xs text-gray-400">
                Your Package. Our Priority.
              </p>
            </div>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-gray-300 transition hover:text-[#D4AF37]"
          >
            <ArrowLeft size={18} />
            Back Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
            Shipment Tracking
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Track Your <span className="text-[#D4AF37]">Package</span>
          </h2>

          <p className="mt-3 text-gray-400">
            Tracking number:{" "}
            <span className="break-all font-semibold text-white">
              {trackingNumber}
            </span>
          </p>
        </div>

        {loading && (
          <div className="rounded-xl border border-white/10 bg-[#111111] p-10 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#D4AF37]" />
            <p className="text-gray-300">
              Retrieving your tracking information...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
            <AlertCircle className="mb-3 text-red-400" size={28} />

            <h3 className="font-semibold text-red-300">
              Tracking Unavailable
            </h3>

            <p className="mt-2 break-words text-sm leading-6 text-gray-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2 font-semibold text-black transition hover:bg-[#e5c34e]"
            >
              <Search size={17} />
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && trackingData && (
          <>
            <section className="rounded-xl border border-[#D4AF37]/30 bg-[#111111] p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-400">Current Status</p>

                  <h3 className="mt-2 text-2xl font-bold text-[#D4AF37]">
                    {getStatus()}
                  </h3>

                  <p className="mt-2 break-all text-sm text-gray-400">
                    {packageInfo?.trackingNumber || trackingNumber}
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                  <Truck size={28} className="text-[#D4AF37]" />
                </div>
              </div>

              <div className="mt-8 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Carrier
                  </p>
                  <p className="mt-2 font-medium">
                    {typeof packageInfo?.carrier === "object"
  ? packageInfo?.carrier?.name || "Carrier information unavailable"
  : packageInfo?.carrier || "Carrier information unavailable"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Estimated Delivery
                  </p>
                  <p className="mt-2 font-medium">
                    {formatDate(
                      packageInfo?.estimatedDelivery ||
                        packageInfo?.estimated_delivery
                    )}
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-xl border border-white/10 bg-[#111111] p-6 sm:p-8">
              <h3 className="flex items-center gap-3 text-xl font-bold">
                <Clock className="text-[#D4AF37]" size={23} />
                Tracking History
              </h3>

              {events.length === 0 ? (
                <p className="mt-6 text-sm text-gray-400">
                  No tracking events were returned for this shipment.
                </p>
              ) : (
                <div className="mt-8">
                  {events.map((event, index) => (
                    <div
                      key={
                        event._id ||
                        event.id ||
                        `${event.timestamp || event.datetime}-${index}`
                      }
                      className="relative flex gap-4 pb-8 last:pb-0"
                    >
                      <div className="flex flex-col items-center">
                        <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10">
                          {index === 0 ? (
                            <CheckCircle
                              size={19}
                              className="text-[#D4AF37]"
                            />
                          ) : (
                            <Package
                              size={18}
                              className="text-[#D4AF37]"
                            />
                          )}
                        </div>

                        {index < events.length - 1 && (
                          <div className="absolute bottom-0 top-10 w-px bg-white/10" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 border-b border-white/10 pb-6 last:border-0">
                        <h4 className="font-semibold">
                          {event.status || event.tag || "Shipment Update"}
                        </h4>

                        <p className="mt-2 break-words text-sm leading-6 text-gray-400">
                          {event.description ||
                            event.message ||
                            event.status_description ||
                            "No additional details provided."}
                        </p>

                        <p className="mt-3 flex items-start gap-2 text-sm text-gray-400">
                          <MapPin
                            size={16}
                            className="mt-0.5 shrink-0 text-[#D4AF37]"
                          />
                          <span>{getLocation(event)}</span>
                        </p>

                        <p className="mt-2 text-xs text-gray-500">
                          {formatDate(
                            event.timestamp ||
                              event.datetime ||
                              event.event_time ||
                              event.time
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#D4AF37] transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Track Another Package
          </Link>
        </div>
      </main>
    </div>
  );
}

