import React, { useEffect, useState } from "react";

const App = () => {
  // State for products and cart
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // Fetch products from backend
  useEffect(() => {
    fetch("http://localhost:1000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Function to add item to cart
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Departmental Store</h1>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="p-4 bg-white shadow-lg rounded-lg">
            <img src={product.image_url} alt={product.name} className="w-32 h-32 object-cover mx-auto mb-2" />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-700">${product.price.toFixed(2)}</p>
            <button
              className="block w-full bg-blue-500 text-white py-2 px-4 rounded mt-2 hover:bg-blue-700 transition"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      <div className="mt-8 w-full max-w-md bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Cart</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">No items added.</p>
        ) : (
          <ul className="list-disc pl-5">
            {cart.map((item, index) => (
              <li key={index} className="text-gray-700">{item.name} - ${item.price.toFixed(2)}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
