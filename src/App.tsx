import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { useAuthStore } from "./stores/authStore";
import { CartPage } from "./pages/CartPage";

function HomeRedirect() {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  return (
    <Navigate
      to={accessToken ? "/profile" : "/login"}
      replace
    />
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomeRedirect />}
      />

      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={<LoginPage />}
        />
      </Route>

      <Route element={<AppLayout />}>
        <Route
          path="/products"
          element={<ProductsPage />}
        />

        <Route
          path="/cart"
          element={<CartPage />}
        />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route
            path="/profile"
            element={<ProfilePage />}
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={<HomeRedirect />}
      />
    </Routes>
  );
}

export default App;