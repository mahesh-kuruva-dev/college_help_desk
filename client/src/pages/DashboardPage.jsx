
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../services/auth.service.js";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    authApi.me()
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch(() => {
        if (active) navigate("/login", { replace: true });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleLogout() {
    try {
      await authApi.logout();
      toast.success("Logged out successfully.");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (loading || !user) {
    return <main className="p-10 text-center">Loading your dashboard...</main>;
  }

  return (
    <main className="min-h-[80vh] bg-cream px-4 py-12">
      <section className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <p className="text-sm font-semibold uppercase tracking-wider text-maroon">
          EduReach Student Portal
        </p>
        <h1 className="mt-3 text-3xl font-bold">
          Welcome, {user.name}!
        </h1>
        <p className="mt-3 text-gray-600">
          You are signed in as {user.email}.
        </p>

        <div className="mt-8 rounded-xl bg-cream p-5">
          <h2 className="text-xl font-semibold text-maroon">Your account</h2>
          <p className="mt-2 text-gray-600">
            Your account is ready. Admission tracking and saved courses can be
            added here in the next phase.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-lg border border-maroon px-5 py-3 text-maroon"
          >
            Back to Home
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-maroon px-5 py-3 text-white hover:bg-maroon-dark"
          >
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}
