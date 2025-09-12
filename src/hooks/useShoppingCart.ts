import { useState } from 'react';

export function useShoppingCart() {
  const [shoppingCart, setShoppingCart] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [totalSpent, setTotalSpent] = useState(2340);

  const addToCart = (item) => {
    const existingItem = shoppingCart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setShoppingCart(shoppingCart.map(cartItem => 
        cartItem.id === item.id 
          ? {...cartItem, quantity: cartItem.quantity + 1}
          : cartItem
      ));
    } else {
      setShoppingCart([...shoppingCart, {...item, quantity: 1}]);
    }
    alert(`${item.title} added to cart!`);
  };

  const removeFromCart = (itemId) => {
    setShoppingCart(shoppingCart.filter(item => item.id !== itemId));
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setShoppingCart(shoppingCart.map(item => 
        item.id === itemId ? {...item, quantity} : item
      ));
    }
  };

  const addPurchase = (item) => {
    const purchase = {
      id: Date.now(),
      ...item,
      purchaseDate: new Date().toISOString(),
      status: 'confirmed'
    };
    setPurchases([purchase, ...purchases]);
    setTotalSpent(totalSpent + item.price);
  };

  const checkout = () => {
    const total = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const order = {
      id: Date.now(),
      items: [...shoppingCart],
      total,
      date: new Date().toISOString(),
      status: 'confirmed'
    };
    setPurchases([order, ...purchases]);
    setTotalSpent(totalSpent + total);
    setShoppingCart([]);
    alert(`Order confirmed! Total: $${total}. Thank you for your purchase!`);
    return true; // Success
  };

  return {
    shoppingCart,
    purchases,
    totalSpent,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    addPurchase,
    checkout
  };
}