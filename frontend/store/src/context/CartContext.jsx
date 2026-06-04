import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage', error);
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add Item to Cart
  const addToCart = (product, qty = 1) => {
    if (!product || !product._id) {
      toast.error('خطأ في إضافة المنتج');
      return;
    }

    const stockLimit = product.stock || 0;
    if (stockLimit <= 0) {
      toast.error('هذا المنتج غير متوفر حالياً في المخزن');
      return;
    }

    const existingItem = cartItems.find((item) => item.product === product._id);

    if (existingItem) {
      const newQty = existingItem.quantity + qty;
      if (newQty > stockLimit) {
        toast.warning(`عذراً، الكمية المتاحة في المخزن هي ${stockLimit} فقط`);
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.product === product._id ? { ...item, quantity: stockLimit } : item
          )
        );
      } else {
        toast.success(`تم تحديث كمية ${product.title} في السلة`);
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
        toast.warning(`تمت إضافة الحد الأقصى المتاح (${stockLimit})`);
      } else {
        toast.success(`تمت إضافة ${product.title} إلى السلة`);
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
  };

  // Remove Item from Cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product !== id));
    toast.info('تمت إزالة المنتج من السلة');
  };

  // Update Cart Quantity
  const updateCartQuantity = (id, qty) => {
    const item = cartItems.find((i) => i.product === id);
    if (!item) return;

    const clampedQty = Math.max(1, Math.min(qty, item.stock));
    if (qty > item.stock) {
      toast.warning(`عذراً، أقصى كمية متاحة هي ${item.stock}`);
    }

    setCartItems((prevItems) =>
      prevItems.map((i) => (i.product === id ? { ...i, quantity: clampedQty } : i))
    );
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
