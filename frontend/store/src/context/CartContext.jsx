import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    const user = localStorage.getItem('user');
    if (!user) {
      toast.error('Please log in first to add items to your cart.');
      return false;
    }

    if (!product || !product._id) {
      toast.error('Error adding product.');
      return false;
    }

    const stockLimit = product.stock || 0;
    if (stockLimit <= 0) {
      toast.error('This product is currently out of stock.');
      return false;
    }

    const existingItem = cartItems.find((item) => item.product === product._id);

    if (existingItem) {
      const newQty = existingItem.quantity + qty;
      if (newQty > stockLimit) {
        toast.warning(`Only ${stockLimit} units available in stock.`);
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.product === product._id ? { ...item, quantity: stockLimit } : item
          )
        );
      } else {
        toast.success(`${product.title} quantity updated in cart.`);
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.product === product._id ? { ...item, quantity: newQty } : item
          )
        );
      }
    } else {
      let finalQty = qty;
      if (qty > stockLimit) {
        finalQty = stockLimit;
        toast.warning(`Maximum available quantity added (${stockLimit}).`);
      } else {
        toast.success(`${product.title} added to cart.`);
      }

      const imageUrl = product.images && product.images.length > 0
        ? product.images[0].url
        : 'https://via.placeholder.com/150';

      const newItem = {
        product: product._id,
        name: product.title,
        price: product.price,
        image: imageUrl,
        quantity: finalQty,
        stock: stockLimit,
        category: product.category,
      };

      setCartItems((prevItems) => [...prevItems, newItem]);
    }

    return true;
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product !== id));
    toast.info('Item removed from cart.');
  };

  const updateCartQuantity = (id, qty) => {
    const item = cartItems.find((i) => i.product === id);
    if (!item) return;

    const clampedQty = Math.max(1, Math.min(qty, item.stock));
    if (qty > item.stock) {
      toast.warning(`Maximum available quantity is ${item.stock}.`);
    }

    setCartItems((prevItems) =>
      prevItems.map((i) => (i.product === id ? { ...i, quantity: clampedQty } : i))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
