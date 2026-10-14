import {
  ArrowRight,
  CheckCircle,
  Globe,
  Headphones,
  LockKeyhole,
  Menu,
  Package,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: ShieldCheck,
    title: "Real-Time Tracking",
    description: "Get instant updates on your shipment's journey.",
  },
  {
    icon: LockKeyhole,
    title: "Secure & Safe",
    description: "Your packages are in trusted hands.",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Track shipments across multiple carriers worldwide.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "We're always here to help.",
  },
];

const steps = [
  {
    icon: Search,
    title: "Enter Tracking Number",
    description: "Input your tracking number in the search box above.",
  },
  {
    icon: Package,
    title: "View Package Details",
    description: "See the latest status, location and tracking history.",
  },
  {
    icon: CheckCircle,
    title: "Stay Updated",
    description: "Stay informed as your package moves toward delivery.",
  },
];

export default function Home() {
const [trackingNumber, setTrackingNumber] = useState("");
const [carrier, setCarrier] = useState("dhl");
const [menuOpen, setMenuOpen] = useState(false);

 const navigate = useNavigate();

function handleTracking(event) {
  event.preventDefault();

  const number = trackingNumber.trim();

  if (!number) {
    alert("Please enter your tracking number.");
    return;
  }

  navigate(
    `/track/${encodeURIComponent(number)}?carrier=${encodeURIComponent(carrier)}`
  );
}

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Navigation */}
      <header className="border-b border-white/10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10">
              <Package size={30} className="text-[#D4AF37]" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#D4AF37] sm:text-2xl">
                TrackXpress
              </h1>
              <p className="text-xs text-gray-400">
                Your Package. Our Priority.
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-9 md:flex">
            <a href="#home" className="nav-link active-link">
              Home
            </a>
            <a href="#track" className="nav-link">
              Track Package
            </a>
            <a href="#about" className="nav-link">
              About
            </a>
            <a href="#contact" className="nav-link">
              Contact
            </a>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <a
              href="/admin/login"
              className="flex items-center gap-2 text-sm transition hover:text-[#D4AF37]"
            >
              <UserRound size={20} className="text-[#D4AF37]" />
              Admin Login
            </a>

            <a href="#track" className="gold-button">
              <Search size={18} />
              Track Now
            </a>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-white/10 p-2 text-[#D4AF37] md:hidden"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="flex flex-col gap-5 border-t border-white/10 px-6 py-6 md:hidden">
            <a href="#home" onClick={() => setMenuOpen(false)}>
              Home
            </a>
            <a href="#track" onClick={() => setMenuOpen(false)}>
              Track Package
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              About
            </a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </a>
            <a href="/admin/login" onClick={() => setMenuOpen(false)}>
              Admin Login
            </a>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section
          id="home"
          className="hero-background relative overflow-hidden border-b border-white/10"
        >
          <div className="relative mx-auto grid max-w-7xl items-center px-6 py-24 lg:grid-cols-2 lg:px-10 lg:py-32">
            <div className="max-w-2xl">
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                Fast <span className="mx-2">•</span> Secure
                <span className="mx-2">•</span> Reliable
              </p>

              <h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Track Your Package
                <span className="block text-[#D4AF37]">
                  Anywhere, Anytime
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-gray-400 sm:text-lg">
                Get updates on your shipments. Enter your tracking number below
                to see the latest status of your package.
              </p>

              <form
                id="track"
                onSubmit={handleTracking}
                className="mt-8 flex max-w-2xl flex-col gap-3 rounded-xl border border-[#D4AF37]/70 bg-[#111111] p-2 sm:flex-row"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-3 px-3 sm:flex-row sm:items-center">
  <div className="flex min-w-0 flex-1 items-center gap-3">
    <Package
      size={23}
      className="shrink-0 text-[#D4AF37]"
    />


<input
  type="text"
  value={trackingNumber}
  onChange={(event) =>
    setTrackingNumber(event.target.value)
  }
  placeholder="Enter your tracking number"
  aria-label="Tracking number"
  className="w-full min-w-0 bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray-500"
/>


  </div>

<select
value={carrier}
onChange={(event) => setCarrier(event.target.value)}
aria-label="Select shipping carrier"
className="w-full cursor-pointer rounded-lg border border-white/10 bg-[#181818] px-3 py-3 text-sm text-white outline-none focus:border-[#D4AF37] sm:w-36"

>


<option value="dhl">DHL</option>



<option value="fedex">FedEx</option>
<option value="ups">UPS</option>
<option value="usps">USPS</option>


  </select>
</div>


                <button type="submit" className="gold-button justify-center">
                  <Search size={19} />
                  Track Package
                </button>
              </form>

              <p className="mt-4 text-sm text-gray-500">
                Track your shipment with confidence.
              </p>
            </div>

            <div className="pointer-events-none absolute -right-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#D4AF37]/5 blur-3xl lg:right-0" />
          </div>
        </section>

        {/* Features */}
        <section className="border-b border-white/10 bg-[#0B0B0B]">
          <div className="mx-auto grid max-w-7xl grid-cols-1 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className={`flex items-center gap-5 px-4 py-6 ${
                    index !== 0 ? "lg:border-l lg:border-white/10" : ""
                  }`}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#D4AF37] text-[#D4AF37]">
                    <Icon size={27} />
                  </div>

                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section id="about" className="bg-[#080808]">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-24">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
                How It Works
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Tracking Made <span className="text-[#D4AF37]">Simple</span>
              </h2>

              <p className="mt-5 max-w-lg leading-7 text-gray-400">
                Get your package information in just a few easy steps. No
                complicated processes, no stress.
              </p>
            </div>

            <div className="grid gap-10 sm:grid-cols-3">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.title} className="text-center">
                    <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-[#111111] text-[#D4AF37]">
                      <Icon size={28} />

                      <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF37] text-xs font-bold text-black">
                        {index + 1}
                      </span>
                    </div>

                    <h3 className="mt-5 font-semibold">{step.title}</h3>

                    <p className="mt-3 text-sm leading-6 text-gray-400">
                      {step.description}
                    </p>

                    {index < steps.length - 1 && (
                      <ArrowRight
                        size={20}
                        className="mx-auto mt-5 hidden text-[#D4AF37] sm:hidden"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/10 bg-[#050505]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>
            <span className="font-semibold text-[#D4AF37]">TrackXpress</span>
            {" "}— Your Package. Our Priority.
          </p>

          <p>
            © {new Date().getFullYear()} TrackXpress. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}