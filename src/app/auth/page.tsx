"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

const roles = ["student", "teacher", "admin"];

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const asPlayer = searchParams ? searchParams.get("asPlayer") : null;
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState<string | null>(null);

  useEffect(() => {
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && asPlayer) {
        router.push("/chess/multiplayer");
      }
    });

    // Also check on mount (for reloads)
    supabase.auth.getUser().then(({ data }) => {
      if (data.user && asPlayer) {
        router.push("/chess/multiplayer");
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [asPlayer, router]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    if (mode === "signup") {
      if (password !== confirm) {
        setMessage("Passwords do not match");
        setLoading(false);
        return;
      }
      if (asPlayer) setRole("player");
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role } },
      });
      setLoading(false);
      setMessage(error ? error.message : "Check your email to confirm your account.");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setMessage(error.message);
      } else {
        if (asPlayer) {
          router.push("/chess/multiplayer");
      } else {
        // Fetch user role from session
        const user = data.user;
        const userRole = user?.user_metadata?.role;
        if (userRole && roles.includes(userRole)) {
          router.push(`/dashboard/${userRole}`);
        } else {
          router.push("/dashboard");
          }
        }
      }
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setResetMsg(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
    setLoading(false);
    setResetMsg(error ? error.message : "Check your email for a password reset link.");
  }

  async function handleGoogle() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    setLoading(false);
    if (error) setMessage(error.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-card p-8 w-full max-w-md flex flex-col gap-6 border border-gray-200">
        <div className="flex justify-center gap-4 mb-2">
          <button
            className={`font-heading px-4 py-2 rounded-lg transition-colors ${mode === "login" ? "bg-primary text-white" : "bg-gray-200 text-black"}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`font-heading px-4 py-2 rounded-lg transition-colors ${mode === "signup" ? "bg-primary text-white" : "bg-gray-200 text-black"}`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>
        <button
          type="button"
          className="bg-primary text-white rounded-lg px-4 py-2 font-heading text-base transition-transform duration-200 hover:scale-105 mb-2"
          onClick={handleGoogle}
          disabled={loading}
        >
          Continue with Google
        </button>
        <form className="flex flex-col gap-4" onSubmit={handleAuth}>
          <input
            type="email"
            required
            placeholder="Email"
            className="border border-gray-400 rounded-lg px-4 py-2 font-body focus:border-primary outline-none bg-white text-black"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="border border-gray-400 rounded-lg px-4 py-2 font-body focus:border-primary outline-none bg-white text-black"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {mode === "signup" && (
              <input
                type="password"
                required
                placeholder="Confirm Password"
              className="border border-gray-400 rounded-lg px-4 py-2 font-body focus:border-primary outline-none bg-white text-black"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
              />
          )}
          {!asPlayer && mode === "signup" && (
              <select
              className="border border-gray-400 rounded-lg px-4 py-2 font-body focus:border-primary outline-none bg-white text-black"
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                {roles.map(r => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
          )}
          <button
            type="submit"
            className="bg-primary text-white rounded-lg px-4 py-2 font-heading text-lg transition-transform duration-200 hover:scale-105 hover:bg-primary disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (mode === "signup" ? "Signing Up..." : "Logging In...") : (mode === "signup" ? "Sign Up" : "Login")}
          </button>
        </form>
        {mode === "login" && (
          <button
            type="button"
            className="text-primary underline text-sm font-heading mt-2"
            onClick={() => setShowReset(true)}
          >
            Forgot password?
          </button>
        )}
        {message && <div className="text-center text-accent font-heading">{message}</div>}
        {showReset && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-card p-6 w-full max-w-xs flex flex-col gap-4 relative">
              <button
                className="absolute top-2 right-2 text-black text-xl"
                onClick={() => setShowReset(false)}
                aria-label="Close"
              >
                ×
              </button>
              <h3 className="font-heading text-lg mb-2">Reset Password</h3>
              <form className="flex flex-col gap-3" onSubmit={handleReset}>
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  className="border border-gray-400 rounded-lg px-4 py-2 font-body focus:border-primary outline-none bg-white text-black"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-primary text-white rounded-lg px-4 py-2 font-heading text-base transition-transform duration-200 hover:scale-105 disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>
              {resetMsg && <div className="text-center text-accent font-heading mt-2">{resetMsg}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 