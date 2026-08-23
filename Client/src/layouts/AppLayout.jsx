import { Upload } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinkClasses = ({ isActive }) =>
  `rounded-lg px-4 py-2 text-sm font-medium ${isActive
    ? "bg-gray-100 text-White"
    : "text-black hover:text-stone-700"
  }`;

export const AppLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="flex items-center justify-between sticky top-0 z-50 border-b border-stone-200 bg-white px-8 py-4">
        <NavLink to="/" end><div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-lg font-semibold text-stone-900">
            <p className="font-extrabold">GOAT,</p>
            <p>{user?.fullName}</p>
          </div>
        </div></NavLink>

        <nav className="items-center gap-1 hidden md:block">
          <NavLink to="/" end className={navLinkClasses}>
            See Your Bill
          </NavLink>
        </nav>

        <div className="flex justify-center items-center gap-3">
          <button
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 cursor-pointer rounded-md px-6 py-2 bg-black text-sm font-medium text-white hover:bg-gray-800"
          >
            <Upload className="h-4 w-4" />
            Upload Bill
          </button>

          <NavLink to="/profile" end>
            <span className="cursor-pointer rounded-lg px-3 py-2 text-lg font-semibold text-stone-900 transition-colors duration-200 hover:bg-gray-100">
              Profile
            </span></NavLink>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
