import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
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
    description: "Follow your shipment using the latest tracking information available.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Packages prepared for shipping in a logistics facility",
    details: [
      "Knowing where a shipment was last recorded can make the wait for a delivery easier to manage. TrackXpress gives you one place to enter your tracking number and review the tracking information returned for your selected carrier.",
      "Depending on the information supplied by the carrier, the results may include the latest recorded status, location details, and a history of shipment events. These details help you understand the progress reported for your package, from an initial shipment record through transit and delivery updates.",
      "Tracking updates depend on the carrier and its available data. If a shipment has not been scanned recently, new information may not appear immediately. You can return to TrackXpress and check again as further updates become available."
    ],
  },
  {
    icon: LockKeyhole,
    title: "Secure & Safe",
    description: "A straightforward way to access your shipment information.",
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Carefully packed goods ready to be shipped",
    details: [
      "TrackXpress is designed to make checking a shipment simple: enter the tracking number, choose the relevant carrier, and review the available results in one place. You do not need to visit several tracking pages just to begin looking for your shipment's latest recorded information.",
      "Public tracking is kept separate from shipment-management tools intended for authorized administrators. Administrative actions, such as managing shipment records or adding status updates, are intended for authorized users rather than visitors using the public tracking form.",
      "For your own safety, only enter the tracking information needed to look up a shipment. Do not send passwords or other sensitive personal information by email when contacting support."
    ],
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Look up shipments through supported shipping carriers.",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Passenger aircraft flying above the clouds",
    details: [
      "Shipments can move through multiple locations before reaching their destination. TrackXpress helps you look up tracking information through the shipping carriers available in the carrier selector, giving you a central starting point for checking a package's reported journey.",
      "To get started, choose the carrier associated with your tracking number and enter the number exactly as provided by the sender or shipping company. TrackXpress then displays the tracking information available for that selection.",
      "Carrier availability, supported tracking numbers, and the amount of detail returned can vary. If a result cannot be found, double-check the number and carrier, then try again later or contact the sender or carrier for further assistance."
    ],
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description: "Contact us if you need help with a tracking enquiry.",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Colleagues working together in a support-oriented team",
    details: [
      "Sometimes a tracking status needs a little context, or a shipment may not appear as expected. If you have a question about using TrackXpress, the tracking details displayed, or an issue with a lookup, you can contact our team by email.",
      "When writing to us, describe the issue clearly and include the tracking number only when it is relevant to your enquiry. You can also tell us which carrier you selected and what happened when you searched. Please do not include passwords or unnecessary sensitive information.",
      "Email support is available at info@trackxpress.com. This is a contact channel for enquiries; it does not mean that a support agent is available instantly or that replies are guaranteed within a specific time."
    ],
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
const [expandedFeature, setExpandedFeature] = useState(null);
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

        {/* Expandable Features */}
        <section
          id="features"
          className="border-b border-white/10 bg-[#0B0B0B]"
        >
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
                TrackXpress Features
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                More Clarity for Every{" "}
                <span className="text-[#D4AF37]">Shipment</span>
              </h2>
              <p className="mt-5 leading-7 text-gray-400">
                Explore how TrackXpress helps you look up shipment information,
                understand available tracking events, and find assistance when
                you need it. Select a feature below to read more.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isExpanded = expandedFeature === index;
                const panelId = `feature-details-${index}`;

                return (
                  <article
                    key={feature.title}
                    className="overflow-hidden rounded-xl border border-white/10 bg-[#101010] transition-colors hover:border-[#D4AF37]/40"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedFeature(isExpanded ? null : index)
                      }
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                      className="flex w-full items-center gap-4 p-5 text-left sm:p-6"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
                        <Icon size={27} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-white">
                          {feature.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-gray-400">
                          {feature.description}
                        </p>
                        <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                          {isExpanded ? "Show less" : "Explore feature"}
                        </span>
                      </div>

                      <ChevronDown
                        size={22}
                        className={`shrink-0 text-[#D4AF37] transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div
                        id={panelId}
                        className="border-t border-white/10 p-5 sm:p-6"
                      >
                        <img
                          src={feature.image}
                          alt={feature.imageAlt}
                          loading="lazy"
                          className="mb-6 h-52 w-full rounded-lg object-cover sm:h-64"
                        />

                        <div className="space-y-4">
                          {feature.details.map((paragraph) => (
                            <p
                              key={paragraph}
                              className="text-sm leading-7 text-gray-400"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>

                        {index === 0 && (
                          <a
                            href="#track"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#D4AF37] transition hover:text-yellow-300"
                          >
                            Track your package
                            <ArrowRight size={17} />
                          </a>
                        )}

                        {index === 3 && (
                          <a
                            href="mailto:info@trackxpress.com"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#D4AF37] transition hover:text-yellow-300"
                          >
                            Contact Support
                            <ArrowRight size={17} />
                          </a>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
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
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <a href="#home" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10">
                  <Package size={25} className="text-[#D4AF37]" />
                </div>
                <span className="text-xl font-bold text-[#D4AF37]">
                  TrackXpress
                </span>
              </a>
              <p className="mt-4 max-w-xs text-sm leading-7 text-gray-400">
                Your Package. Our Priority. A central place to look up shipment
                information and review the tracking details available for your
                package.
              </p>
              <a
                href="#track"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#D4AF37] transition hover:text-yellow-300"
              >
                Track a Package
                <ArrowRight size={17} />
              </a>
            </div>

            <div>
              <h3 className="font-semibold text-white">Quick Links</h3>
              <ul className="mt-5 space-y-3 text-sm text-gray-400">
                <li><a href="#home" className="transition hover:text-[#D4AF37]">Home</a></li>
                <li><a href="#track" className="transition hover:text-[#D4AF37]">Track Package</a></li>
                <li><a href="#about" className="transition hover:text-[#D4AF37]">About</a></li>
                <li><a href="#contact" className="transition hover:text-[#D4AF37]">Contact</a></li>
                <li><a href="/admin/login" className="transition hover:text-[#D4AF37]">Admin Login</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white">Our Features</h3>
              <ul className="mt-5 space-y-3 text-sm text-gray-400">
                {features.map((feature, index) => (
                  <li key={feature.title}>
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedFeature(index);
                        document.getElementById("features")?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }}
                      className="text-left transition hover:text-[#D4AF37]"
                    >
                      {feature.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white">Contact Us</h3>
              <p className="mt-5 text-sm leading-7 text-gray-400">
                Have a question about a tracking lookup or using TrackXpress?
                Send our team an email with a description of your enquiry.
              </p>
              <a
                href="mailto:info@trackxpress.com"
                className="mt-3 inline-block break-all text-sm text-[#D4AF37] transition hover:text-yellow-300"
              >
                info@trackxpress.com
              </a>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} TrackXpress. All rights reserved.</p>
            <p>Your Package. Our Priority.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}