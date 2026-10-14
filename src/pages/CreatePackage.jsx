import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  UserRound,
  MapPin,
  Truck,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

const initialContact = {
  name: "",
  email: "",
  phone: "",
  address: {
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  },
};

const initialForm = {
  sender: {
    ...initialContact,
    address: { ...initialContact.address },
  },
  recipient: {
    ...initialContact,
    address: { ...initialContact.address },
  },
  packageDescription: "",
  weight: "",
  weightUnit: "kg",
  dimensions: {
    length: "",
    width: "",
    height: "",
    unit: "cm",
  },
  status: "Pending",
  origin: {
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  },
  destination: {
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  },
  estimatedDelivery: "",
  shippingCost: "0",
  currency: "NGN",
  carrier: "",
  externalTrackingNumber: "",
};

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

const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#D4AF37]/60";

const labelClass = "text-sm font-medium text-gray-300";

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-2.5">
        <Icon size={20} className="text-[#D4AF37]" />
      </div>

      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  min,
  step,
}) {
  return (
    <label className={labelClass}>
      {label}
      {required && <span className="ml-1 text-[#D4AF37]">*</span>}

      <input
        className={inputClass}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || ""}
        required={required}
        min={min}
        step={step}
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className={labelClass}>
      {label}

      <select
        className={inputClass}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function AddressFields({ title, value, onChange }) {
  const fields = [
    { key: "street", label: "Street address", required: false },
    { key: "city", label: "City", required: true },
    { key: "state", label: "State / Region", required: false },
    { key: "postalCode", label: "Postal code", required: false },
    { key: "country", label: "Country", required: true },
  ];

  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-[#D4AF37]">
        {title}
      </h4>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <TextField
            key={field.key}
            label={field.label}
            value={value[field.key] || ""}
            required={field.required}
            onChange={(event) =>
              onChange(field.key, event.target.value)
            }
          />
        ))}
      </div>
    </div>
  );
}

function ContactFields({ title, value, onChange }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0b0b0b] p-4 sm:p-5">
      <h4 className="mb-4 font-semibold text-white">{title}</h4>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="Full name"
          value={value.name}
          required
          onChange={(event) => onChange("name", event.target.value)}
        />

        <TextField
          label="Phone number"
          value={value.phone}
          required
          onChange={(event) => onChange("phone", event.target.value)}
        />

        <TextField
          label="Email address"
          type="email"
          value={value.email}
          onChange={(event) => onChange("email", event.target.value)}
        />
      </div>

      <div className="mt-6">
        <AddressFields
          title="Address"
          value={value.address}
          onChange={(field, fieldValue) =>
            onChange("address", fieldValue, field)
          }
        />
      </div>
    </div>
  );
}

export default function CreatePackage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdPackage, setCreatedPackage] = useState(null);

  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateContact(contactType, field, value, nestedField) {
    setForm((previous) => {
      const contact = previous[contactType];

      if (field === "address") {
        return {
          ...previous,
          [contactType]: {
            ...contact,
            address: {
              ...contact.address,
              [nestedField]: value,
            },
          },
        };
      }

      return {
        ...previous,
        [contactType]: {
          ...contact,
          [field]: value,
        },
      };
    });
  }

  function updateAddress(addressType, field, value) {
    setForm((previous) => ({
      ...previous,
      [addressType]: {
        ...previous[addressType],
        [field]: value,
      },
    }));
  }

  function updateDimension(field, value) {
    setForm((previous) => ({
      ...previous,
      dimensions: {
        ...previous.dimensions,
        [field]: value,
      },
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setCreatedPackage(null);

    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        weight: Number(form.weight),
        shippingCost: Number(form.shippingCost || 0),
        dimensions: {
          ...form.dimensions,
          length:
            form.dimensions.length === ""
              ? undefined
              : Number(form.dimensions.length),
          width:
            form.dimensions.width === ""
              ? undefined
              : Number(form.dimensions.width),
          height:
            form.dimensions.height === ""
              ? undefined
              : Number(form.dimensions.height),
        },
        estimatedDelivery: form.estimatedDelivery
          ? new Date(form.estimatedDelivery).toISOString()
          : null,
      };

      const response = await fetch(`${API_URL}/packages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok || !result.success) {
        const validationErrors = result.errors?.join(" ");

        throw new Error(
          validationErrors ||
            result.message ||
            "Unable to create the shipment."
        );
      }

      const newPackage = result.data?.package;

      if (!newPackage) {
        throw new Error(
          "The shipment may have been created, but the server response did not contain its details. Check the dashboard before trying again."
        );
      }

      setCreatedPackage(newPackage);
      setSuccess("Shipment created successfully.");
    } catch (err) {
      setError(
        err.message ||
          "Could not connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-8 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <header className="mt-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-3">
              <Package size={25} className="text-[#D4AF37]" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                Shipment Management
              </p>

              <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
                Create Shipment
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-400">
            Enter the sender, recipient, and shipment information.
            TrackXpress will generate a unique tracking number when the
            shipment is registered.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mt-7 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4"
          >
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-red-400"
            />
            <p className="text-sm leading-6 text-red-300">{error}</p>
          </div>
        )}

        {success && createdPackage && (
          <div className="mt-7 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={22}
                className="mt-0.5 shrink-0 text-emerald-400"
              />

              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-emerald-300">
                  {success}
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  Your new tracking number is:
                </p>

                <p className="mt-2 break-all font-mono text-lg font-bold text-[#D4AF37]">
                  {createdPackage.trackingNumber}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  Save this number so the shipment can be tracked later.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/dashboard")}
                    className="gold-button"
                  >
                    View Dashboard
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/admin/packages/${createdPackage._id}`
                      )
                    }
                    className="rounded-xl border border-white/10 px-4 py-3 text-sm text-gray-300 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                  >
                    View Shipment
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setForm(initialForm);
                      setSuccess("");
                      setCreatedPackage(null);
                      setError("");
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    className="rounded-xl border border-white/10 px-4 py-3 text-sm text-gray-300 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                  >
                    Create Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-7">
          {/* Sender and recipient */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#101010] p-5 sm:p-7">
            <SectionHeading
              icon={UserRound}
              title="People & Contact Details"
              description="Provide the contact information for both parties."
            />

            <div className="space-y-6">
              <ContactFields
                title="Sender information"
                value={form.sender}
                onChange={(field, value, nestedField) =>
                  updateContact("sender", field, value, nestedField)
                }
              />

              <ContactFields
                title="Recipient information"
                value={form.recipient}
                onChange={(field, value, nestedField) =>
                  updateContact("recipient", field, value, nestedField)
                }
              />
            </div>
          </section>

          {/* Shipment details */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#101010] p-5 sm:p-7">
            <SectionHeading
              icon={Package}
              title="Package Details"
              description="Describe the shipment and enter its measurements."
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className={`${labelClass} sm:col-span-2`}>
                Package description
                <span className="ml-1 text-[#D4AF37]">*</span>

                <textarea
                  className={`${inputClass} min-h-28 resize-y`}
                  value={form.packageDescription}
                  onChange={(event) =>
                    updateField(
                      "packageDescription",
                      event.target.value
                    )
                  }
                  placeholder="Describe the contents of the package"
                  maxLength={500}
                  required
                />

                <span className="mt-1 block text-right text-xs text-gray-600">
                  {form.packageDescription.length}/500
                </span>
              </label>

              <div className="grid grid-cols-[1fr_110px] gap-3">
                <TextField
                  label="Weight"
                  type="number"
                  value={form.weight}
                  required
                  min="0.01"
                  step="any"
                  placeholder="0.00"
                  onChange={(event) =>
                    updateField("weight", event.target.value)
                  }
                />

                <SelectField
                  label="Unit"
                  value={form.weightUnit}
                  onChange={(event) =>
                    updateField("weightUnit", event.target.value)
                  }
                  options={[
                    { value: "kg", label: "kg" },
                    { value: "g", label: "g" },
                    { value: "lb", label: "lb" },
                  ]}
                />
              </div>

              <SelectField
                label="Initial shipment status"
                value={form.status}
                onChange={(event) =>
                  updateField("status", event.target.value)
                }
                options={STATUS_OPTIONS.map((status) => ({
                  value: status,
                  label: status,
                }))}
              />

              <div className="sm:col-span-2">
                <p className={labelClass}>Dimensions (optional)</p>

                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {["length", "width", "height"].map((dimension) => (
                    <label
                      key={dimension}
                      className="text-xs text-gray-400"
                    >
                      {dimension.charAt(0).toUpperCase() +
                        dimension.slice(1)}

                      <input
                        className={inputClass}
                        type="number"
                        min="0"
                        step="any"
                        value={form.dimensions[dimension]}
                        onChange={(event) =>
                          updateDimension(
                            dimension,
                            event.target.value
                          )
                        }
                        placeholder="0"
                      />
                    </label>
                  ))}

                  <SelectField
                    label="Unit"
                    value={form.dimensions.unit}
                    onChange={(event) =>
                      updateDimension("unit", event.target.value)
                    }
                    options={[
                      { value: "cm", label: "Centimetres" },
                      { value: "in", label: "Inches" },
                    ]}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Origin and destination */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#101010] p-5 sm:p-7">
            <SectionHeading
              icon={MapPin}
              title="Shipping Route"
              description="Specify where the shipment starts and where it is going."
            />

            <div className="space-y-7">
              <AddressFields
                title="Origin"
                value={form.origin}
                onChange={(field, value) =>
                  updateAddress("origin", field, value)
                }
              />

              <div className="border-t border-white/[0.07]" />

              <AddressFields
                title="Destination"
                value={form.destination}
                onChange={(field, value) =>
                  updateAddress("destination", field, value)
                }
              />
            </div>
          </section>

          {/* Delivery and carrier */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#101010] p-5 sm:p-7">
            <SectionHeading
              icon={Truck}
              title="Delivery & Carrier"
              description="Configure the estimated delivery and shipping charges."
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <TextField
                label="Estimated delivery"
                type="date"
                value={form.estimatedDelivery}
                onChange={(event) =>
                  updateField("estimatedDelivery", event.target.value)
                }
              />

              <TextField
                label="Carrier name"
                value={form.carrier}
                onChange={(event) =>
                  updateField("carrier", event.target.value)
                }
                placeholder="e.g. DHL, FedEx"
              />

              <TextField
                label="Shipping cost"
                type="number"
                min="0"
                step="any"
                value={form.shippingCost}
                onChange={(event) =>
                  updateField("shippingCost", event.target.value)
                }
              />

              <SelectField
                label="Currency"
                value={form.currency}
                onChange={(event) =>
                  updateField("currency", event.target.value)
                }
                options={[
                  { value: "NGN", label: "NGN — Nigerian Naira" },
                  { value: "USD", label: "USD — US Dollar" },
                  { value: "GBP", label: "GBP — British Pound" },
                  { value: "EUR", label: "EUR — Euro" },
                ]}
              />

              <label className={`${labelClass} sm:col-span-2`}>
                External carrier tracking number (optional)

                <input
                  className={inputClass}
                  value={form.externalTrackingNumber}
                  onChange={(event) =>
                    updateField(
                      "externalTrackingNumber",
                      event.target.value
                    )
                  }
                  placeholder="Enter a carrier-issued tracking number if available"
                />

                <span className="mt-2 block text-xs leading-5 text-gray-500">
                  Your TrackXpress tracking number will still be
                  generated automatically.
                </span>
              </label>
            </div>
          </section>

          {/* Submit */}
          <div className="flex flex-col-reverse justify-between gap-4 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center">
            <p className="max-w-md text-xs leading-5 text-gray-500">
              Fields marked with an asterisk are required. Check all
              information before registering the shipment.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-300 transition hover:border-white/20 hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading || Boolean(createdPackage)}
                className="gold-button justify-center disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    Creating shipment...
                  </>
                ) : (
                  <>
                    <Package size={17} />
                    Register Shipment
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}