
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "../../services/auth.service.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await authApi.login({ email, password });
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[80vh] bg-cream px-4 py-12 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-gray-100"
      >
        <Link to="/" className="flex justify-center text-maroon">
          <GraduationCap size={42} />
        </Link>
        <h1 className="mt-3 text-center text-3xl font-bold text-maroon">
          Welcome Back
        </h1>
        <p className="mt-2 text-center text-gray-500">
          Sign in to your EduReach account
        </p>

        <label className="mt-7 block text-sm font-medium">Email address</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-maroon"
          placeholder="you@example.com"
        />

        <label className="mt-5 block text-sm font-medium">Password</label>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-maroon"
          placeholder="Enter your password"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-maroon py-3 font-semibold text-white hover:bg-maroon-dark disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="mt-5 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-maroon">
            Sign Up
          </Link>
        </p>
      </form>
    </main>
  );
}
