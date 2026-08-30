import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Trash } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { FormatDate, Modal } from "../components/index"
import toast from 'react-hot-toast';
import { deleteUser } from "../api/authApi";

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)
  const [activeModal, setActiveModal] = useState(null);

  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
      setActiveModal(null)
      toast.success("Logged Out")
    } catch {
      setError(err.message)
    } finally {
      navigate("/login");
    }
  }

  async function handleDeleteAcc() {
    setLoading(true);
    try {
      await deleteUser()
      setActiveModal(null)
      toast.success("Account Deleted")
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
        <Field label="Email" value={user.email} mono />
        <Field label="User ID" value={user._id} mono />
        <Field label="Account created on" value={FormatDate(user.createdAt)} />
      </div>

      <div className="">
        <button
          onClick={() => setActiveModal("logout")}
          disabled={loading}
          className="mt-6 w-full cursor-pointer flex items-center justify-center gap-2 rounded-lg bg-red-50 text-red-700 font-medium py-2.5 hover:bg-red-100 transition-colors disabled:opacity-60"
        >
          <LogOut size={16} />
          {loading ? "Logging out…" : "Log out"}
        </button>
        <Modal
          isOpen={activeModal === "logout"}
          onClose={() => setActiveModal(null)}
          onConfirm={handleLogout}
          title="Want to logout?"
          cancelText="No"
        />
        <button
          onClick={() => setActiveModal("delete")}
          disabled={loading}
          className="mt-6 w-full cursor-pointer flex items-center justify-center gap-2 rounded-lg bg-black text-white font-medium py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-60"
        >
          <Trash size={16} />
          {loading ? "Deleting…" : "Throw account in trash"}
        </button>
        <Modal
          isOpen={activeModal === "delete"}
          onClose={() => setActiveModal(null)}
          onConfirm={handleDeleteAcc}
          title="Are you sure you want to delete this account permanently?"
        />
      </div>
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