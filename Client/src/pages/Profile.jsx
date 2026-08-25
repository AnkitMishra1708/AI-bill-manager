import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { FormatDate } from "../components/index"
import toast from 'react-hot-toast';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState(null)

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Logged Out")
    } catch {
      setError(err.message)
    } finally {
      navigate("/login");
    }
  }

  if (!user) return null;
  if (error) {
    return (<p className='text-3xl font-bold'>Oops, something went wrong.</p>)
  }
  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">Welcome, {user?.fullName}</h1>

      <div className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-100">
        <Field label="Name" value={user.fullName} />
        <Field label="Email" value={user.email} />
        <Field label="User ID" value={user._id} mono />
        <Field label="Account created on" value={FormatDate(user.createdAt)} />
      </div>

      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="mt-6 w-full cursor-pointer flex items-center justify-center gap-2 rounded-lg bg-red-50 text-red-700 font-medium py-2.5 hover:bg-red-100 transition-colors disabled:opacity-60"
      >
        <LogOut size={16} />
        {loggingOut ? "Logging out…" : "Log out"}
      </button>
    </div>
  );
}

function Field({ label, value, mono }) {
  return (
    <div className="px-5 py-3">
      <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
        {label}
      </p>
      <p
        className={`mt-0.5 text-gray-900 ${mono ? "font-mono text-sm truncate" : "font-medium"
          }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}