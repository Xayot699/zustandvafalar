import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";

export function CartPage() {
  const navigate = useNavigate();

  const items = useCartStore(
    (state) => state.items,
  );

  const increaseQuantity = useCartStore(
    (state) => state.increaseQuantity,
  );

  const decreaseQuantity = useCartStore(
    (state) => state.decreaseQuantity,
  );

  const removeItem = useCartStore(
    (state) => state.removeItem,
  );

  const clearCart = useCartStore(
    (state) => state.clearCart,
  );

  const total = useCartStore(
    (state) => state.getTotalPrice(),
  );

  const [message, setMessage] = useState("");

  const handleCheckout = () => {
    const { accessToken } =
      useAuthStore.getState();

    if (!accessToken) {
      navigate("/login", {
        state: {
          from: {
            pathname: "/cart",
          },
        },
      });

      return;
    }

    clearCart();

    setMessage(
      "Buyurtmangiz muvaffaqiyatli yaratildi!",
    );
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.89 2.26M8 17h8M3 3h2l.89 2.26M8 17h8.02M8 17l-1.35-2.7A1 1 0 005.66 13H4a1 1 0 01-1-1V6a1 1 0 011-1h2m0 0h16"
          />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Savat</h1>
        <p className="text-gray-500 mb-6">Savat hozircha bo'sh.</p>
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Mahsulotlarni ko'rish
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Savat</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between"
          >
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">
                {item.title}
              </h2>
              <p className="text-gray-600">
                ${item.price}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() =>
                  decreaseQuantity(item.productId)
                }
                className="w-8 h-8 flex items-center justify-center text-lg font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                -
              </button>

              <span className="w-8 text-center text-gray-900 font-medium">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  increaseQuantity(item.productId)
                }
                className="w-8 h-8 flex items-center justify-center text-lg font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                +
              </button>
            </div>

            <div className="ml-4 text-right">
              <p className="text-sm text-gray-500">Jami:</p>
              <p className="font-semibold text-gray-900">
                ${item.price * item.quantity}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                removeItem(item.productId)
              }
              className="ml-3 text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none"
            >
              O'chirish
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-700">Umumiy:</h2>
          <span className="text-2xl font-bold text-gray-900">
            ${total.toFixed(2)}
          </span>
        </div>

        {message && (
          <div className="mb-4 p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">
            {message}
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={clearCart}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Savatni tozalash
          </button>
          <button
            type="button"
            onClick={handleCheckout}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Buyurtma berish
          </button>
        </div>
      </div>
    </div>
  );
}