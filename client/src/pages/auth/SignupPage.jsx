
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "../../services/auth.service.js";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await authApi.register({ name, email, password });
      toast.success("Account created successfully!");
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
          Create Account
        </h1>
        <p className="mt-2 text-center text-gray-500">
          Join the EduReach community
        </p>

        <label className="mt-6 block text-sm font-medium">Full name</label>
        <input
          required
          minLength={2}
          maxLength={80}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-maroon"
          placeholder="Your full name"
        />

        <label className="mt-4 block text-sm font-medium">Email address</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-maroon"
          placeholder="you@example.com"
        />

        <label className="mt-4 block text-sm font-medium">Password</label>
        <input
          type="password"
          required
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-maroon"
          placeholder="At least 8 characters"
        />

        <label className="mt-4 block text-sm font-medium">
          Confirm password
        </label>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-maroon"
          placeholder="Re-enter password"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-maroon py-3 font-semibold text-white hover:bg-maroon-dark disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="mt-5 text-center text-sm text-gray-600">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-maroon">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
