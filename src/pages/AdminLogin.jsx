import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Package,
  ShieldCheck,
} from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Login failed. Check your credentials."
        );
      }

      // We'll verify the exact token field returned by your backend.
      const token =
        result.token ||
        result.accessToken ||
        result.data?.token ||
        result.data?.accessToken;

      if (!token) {
        throw new Error(
          "Login succeeded, but no authentication token was returned."
        );
      }

      // Save the token for subsequent protected API requests.
      localStorage.setItem("adminToken", token);

      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-5 py-12">
      <div className="w-full max-w-md">
        {/* Back to homepage */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#D4AF37]"
        >
          <ArrowLeft size={17} />
          Back to Homepage
        </Link>

        {/* Login card */}
        <div className="rounded-2xl border border-white/10 bg-[#111111] p-7 shadow-2xl sm:p-9">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10">
              <Package size={34} className="text-[#D4AF37]" />
            </div>

            <h1 className="text-2xl font-bold text-[#D4AF37]">
              TrackXpress
            </h1>

            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-400">
              <ShieldCheck size={17} className="text-[#D4AF37]" />
              Administrator Access
            </div>

            <h2 className="mt-7 text-xl font-semibold text-white">
              Welcome Back
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Sign in to manage shipments and tracking information.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Email Address
              </label>

              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black px-4 transition focus-within:border-[#D4AF37]">
                <Mail size={19} className="shrink-0 text-[#D4AF37]" />

                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Password
              </label>

              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black px-4 transition focus-within:border-[#D4AF37]">
                <LockKeyhole
                  size={19}
                  className="shrink-0 text-[#D4AF37]"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-gray-600"
                  required
                />

                <button
                  type="button"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  onClick={() => setShowPassword(!showPassword)}
                  className="shrink-0 text-gray-500 transition hover:text-[#D4AF37]"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-400"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="gold-button w-full justify-center py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In to Dashboard"}
            </button>
          </form>

          <div className="mt-7 border-t border-white/10 pt-5 text-center">
            <p className="text-xs leading-5 text-gray-500">
              Restricted area. Authorized administrators only.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} TrackXpress
        </p>
      </div>
    </main>
  );
}