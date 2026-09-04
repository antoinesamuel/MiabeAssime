import { createContext, useContext, useState } from 'react';
import { products as initialProducts, initialOrders, initialMessages, farmers } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [messages, setMessages] = useState(initialMessages);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // PRODUCTS
  const addProduct = (product) => {
    const newProduct = { ...product, id: `p${Date.now()}`, createdAt: new Date().toISOString().split('T')[0], rating: 0, reviews: 0 };
    setProducts(prev => [newProduct, ...prev]);
    showNotification('Produit ajouté avec succès !');
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showNotification('Produit mis à jour !');
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showNotification('Produit supprimé.', 'info');
  };

  const updateProductStatus = (id, status) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      if (status === 'out') {
        return {
          ...p,
          status: 'out',
          prevQuantity: p.quantity > 0 ? p.quantity : (p.prevQuantity || 500),
          quantity: 0,
        };
      }
      if (status === 'available') {
        const restoredQty = p.quantity > 0 ? p.quantity : (p.prevQuantity || 500);
        return {
          ...p,
          status: 'available',
          quantity: restoredQty,
        };
      }
      return { ...p, status };
    }));
  };

  // ORDERS
  const placeOrder = (orderData) => {
    const newOrder = {
      id: `o${Date.now()}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      transporterId: null,
    };
    setOrders(prev => [newOrder, ...prev]);

    // Automatically decrement remaining stock at the farmer
    setProducts(prev => prev.map(p => {
      if (p.id !== orderData.productId) return p;
      const remainingQty = Math.max(0, p.quantity - Number(orderData.quantity || 0));
      return {
        ...p,
        quantity: remainingQty,
        status: remainingQty <= 0 ? 'out' : p.status,
      };
    }));

    showNotification('Commande passée avec succès ! 🎉');
    return newOrder;
  };

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const assignTransporter = (orderId, transporterId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, transporterId } : o));
    showNotification('Transporteur assigné !');
  };

  // MESSAGES
  const sendMessage = (conversationId, fromId, toId, text) => {
    const newMsg = {
      id: `msg${Date.now()}`,
      from: fromId, to: toId, text,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
    };
    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));
  };

  const getConversationKey = (id1, id2) => {
    const sorted = [id1, id2].sort();
    return `${sorted[0]}-${sorted[1]}`;
  };

  const getConversation = (id1, id2) => {
    const key = getConversationKey(id1, id2);
    return messages[key] || [];
  };

  // CART
  const addToCart = (product, qty) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) return prev.map(i => i.productId === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { productId: product.id, product, qty }];
    });
    showNotification('Ajouté au panier !');
  };

  const removeFromCart = (productId) => setCart(prev => prev.filter(i => i.productId !== productId));
  const clearCart = () => setCart([]);

  // FARMER helpers
  const getFarmerProducts = (farmerId) => products.filter(p => p.farmerId === farmerId);
  const getFarmerOrders = (farmerId) => orders.filter(o => o.farmerId === farmerId);
  const getMerchantOrders = (merchantId) => orders.filter(o => o.merchantId === merchantId);
  const getProductById = (id) => products.find(p => p.id === id);
  const getFarmerById = (id) => farmers.find(f => f.id === id);

  return (
    <AppContext.Provider value={{
      products, orders, messages, cart, notification,
      addProduct, updateProduct, deleteProduct, updateProductStatus,
      placeOrder, updateOrderStatus, assignTransporter,
      sendMessage, getConversationKey, getConversation,
      addToCart, removeFromCart, clearCart,
      getFarmerProducts, getFarmerOrders, getMerchantOrders,
      getProductById, getFarmerById,
      showNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
