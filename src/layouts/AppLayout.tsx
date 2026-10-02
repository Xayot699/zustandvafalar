import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";

export function AppLayout() {
  const profile = useAuthStore((state) => state.profile);
  const logout = useAuthStore((state) => state.logout);
  const cartItemCount = useCartStore((state) => state.items.length);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <NavLink
                to="/profile"
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                Profil
              </NavLink>

              <NavLink
                to="/products"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                Mahsulotlar
              </NavLink>

              <div className="relative">
                <NavLink
                  to="/cart"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-1"
                >
                  <span>Savat</span>
                  {cartItemCount > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </NavLink>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {profile && (
                <span className="text-sm text-gray-700 font-medium">
                  {profile.name}
                </span>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Chiqish
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}