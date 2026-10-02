import { useEffect, useState } from "react";
import { useCartStore } from "../stores/cartStore";
import type { CartProduct } from "../types/cart";

const PRODUCTS_URL =
  "https://api.escuelajs.co/api/v1/products?offset=0&limit=10";

export function ProductsPage() {
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore(
    (state) => state.addItem,
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(PRODUCTS_URL);

        if (!response.ok) {
          throw new Error(
            "Mahsulotlarni olishda xatolik",
          );
        }

        const data: CartProduct[] =
          await response.json();

        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Noma'lum xatolik",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Mahsulotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mahsulotlar</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {product.title}
              </h2>
              <p className="text-xl font-bold text-blue-600 mb-4">
                ${product.price}
              </p>
              <button
                type="button"
                onClick={() =>
                  addItem({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                  })
                }
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Savatga qo'shish
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}