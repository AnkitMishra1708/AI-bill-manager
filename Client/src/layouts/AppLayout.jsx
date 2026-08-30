import { Upload, Menu, X, CreditCard, User, Home } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export const AppLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="flex items-center justify-between sticky top-0 z-50 border-b border-stone-200 bg-white px-8 py-4">
        <NavLink to="/" end><div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-lg font-semibold text-stone-900">
            <p className="font-extrabold">GOAT</p>
            <p>, {user?.fullName}</p>
          </div>
        </div>
        </NavLink>

        <div className="hidden lg:flex justify-center items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `hidden md:block cursor-pointer rounded-lg py-1 px-3 text-lg font-semibold transition ${isActive
                ? "bg-gray-100 text-black"
                : "text-black hover:text-stone-700"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/pricing"
            end
            className={({ isActive }) =>
              `cursor-pointer rounded-lg py-1 px-3 text-lg font-semibold transition ${isActive
                ? "bg-gray-100 text-black"
                : "text-black hover:text-stone-700"
              }`
            }
          >
            Pricing
          </NavLink>

          <NavLink
            to="/profile"
            end
            className={({ isActive }) =>
              `cursor-pointer rounded-lg py-1 px-3 text-lg font-semibold transition ${isActive
                ? "bg-gray-100 text-black"
                : "text-black hover:text-stone-700"
              }`
            }
          >
            Profile
          </NavLink>

          <button
            onClick={() => navigate("/upload")}
            className="flex items-center justify-center gap-2 cursor-pointer rounded-md p-2 sm:px-6 sm:py-2 bg-black text-sm font-medium text-white hover:bg-gray-800 transition"
            title="Upload Bill"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Bill</span>
          </button>
        </div>


        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6 text-stone-900" />
        </button>

        {isSidebarOpen && (
          <div
            onClick={closeSidebar}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
        )}

        <aside
          className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h2 className="text-xl font-bold text-stone-900">
              Menu
            </h2>

            <button
              onClick={closeSidebar}
              className="p-2 rounded-md hover:bg-gray-100 transition"
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-stone-900" />
            </button>
          </div>

          <div className="flex flex-col gap-2 p-5">
            <NavLink
              to="/"
              end
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-base font-semibold transition ${isActive
                  ? "bg-gray-100 text-black"
                  : "text-stone-700 hover:bg-gray-100"
                }`
              }
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/pricing"
              end
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-base font-semibold transition ${isActive
                  ? "bg-gray-100 text-black"
                  : "text-stone-700 hover:bg-gray-100"
                }`
              }
            >
              <CreditCard className="h-5 w-5" />
              <span>Pricing</span>
            </NavLink>

            <NavLink
              to="/profile"
              end
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-base font-semibold transition ${isActive
                  ? "bg-gray-100 text-black"
                  : "text-stone-700 hover:bg-gray-100"
                }`
              }
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </NavLink>

            <button
              onClick={() => {
                navigate("/upload");
                closeSidebar();
              }}
              className="flex items-center gap-3 w-full rounded-lg bg-black px-4 py-3 text-left text-sm font-medium text-white hover:bg-gray-800 transition"
            >
              <Upload className="h-5 w-5" />
              <span>Upload Bill</span>
            </button>
          </div>
        </aside>
      </header>

      <main className="mx-auto max-w-5xl px-3 py-8">
        <Outlet />
      </main>
    </div>
  );
}
