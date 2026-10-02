import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuthStore } from "../stores/authStore";

type LoginLocationState = {
  from?: {
    pathname?: string;
  };
};

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = useAuthStore(
    (state) => state.login
  );

  const accessToken = useAuthStore(
    (state) => state.accessToken
  );

  const error = useAuthStore(
    (state) => state.error
  );

  const navigate = useNavigate();
  const location = useLocation();

  const state =
    location.state as LoginLocationState | null;

  const destination =
    state?.from?.pathname || "/profile";

  useEffect(() => {
    if (accessToken) {
      navigate(destination, {
        replace: true,
      });
    }
  }, [
    accessToken,
    destination,
    navigate,
  ]);

  if (accessToken) {
    return (
      <Navigate
        to={destination}
        replace
      />
    );
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      await login({
        email,
        password,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Kirish</h1>
          <p className="mt-2 text-sm text-gray-600">
            Hisobingizga kirish uchun ma'lumotlarni kiriting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              autoComplete="email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              placeholder="email@misol.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Parol
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              minLength={4}
              autoComplete="current-password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              placeholder="********"
            />
          </div>

          {error && (
            <div
              className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting
              ? "Kirilmoqda..."
              : "Kirish"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Test uchun: test@test.com / test123
      </p>
    </div>
  );
}