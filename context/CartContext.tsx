"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { Product, CartItem, CheckoutCustomerData } from "@/lib/constants";
import { formatCurrency } from "@/lib/formatters";

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number, openDrawer?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  subtotalFormatted: string;
  checkoutViaWhatsApp: (customerData: CheckoutCustomerData) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "diamott_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Inicialización perezosa (lazy) desde localStorage para evitar setState en useEffect
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("Error al leer el carrito desde localStorage:", e);
    }
    return [];
  });

  const [isOpen, setIsOpen] = useState(false);

  // Sincronizar en localStorage cada vez que cambien los items
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Error al persistir el carrito en localStorage:", e);
    }
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addToCart = useCallback(
    (product: Product, quantity: number = 1, openDrawer: boolean = false) => {
      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }
        return [...prevItems, { product, quantity }];
      });
      if (openDrawer) {
        setIsOpen(true);
      }
    },
    []
  );

  const removeFromCart = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.product.precio * item.quantity, 0);
  }, [items]);

  const subtotalFormatted = useMemo(() => formatCurrency(subtotal), [subtotal]);

  // Checkout preformateado y codificado hacia la API de WhatsApp
  const checkoutViaWhatsApp = useCallback(
    (customerData: CheckoutCustomerData) => {
      if (items.length === 0) return;

      const productLines = items
        .map(
          (item) =>
            `- ${item.quantity}x ${item.product.nombre_producto} (${item.product.pagina}${
              item.product.subcategoria ? ` - ${item.product.subcategoria}` : ""
            }) -> ${formatCurrency(item.product.precio * item.quantity)}`
        )
        .join("\n");

      const message = `✨ *NUEVO PEDIDO - DI'AMOTT*

🛍️ *Productos solicitados:*
${productLines}

💰 *Total a pagar:* ${formatCurrency(subtotal)}

📍 *Datos de entrega:*
- Nombre: ${customerData.nombre.trim()}
- Cedula: ${customerData.cedula.trim()}
- Direccion / Ciudad: ${customerData.direccionCiudad.trim()}
- Metodo de pago: ${customerData.metodoPago}

Hola Di'amott, deseo confirmar la disponibilidad de estos productos para realizar el pago de mi pedido.`;

      const encodedMessage = encodeURIComponent(message);
      const url = `https://wa.me/573170593785?text=${encodedMessage}`;

      // En móviles y WebViews de redes sociales (Instagram, TikTok, Facebook),
      // window.location.href garantiza la apertura directa de la app oficial de WhatsApp sin bloqueos
      const isMobileOrWebView =
        typeof window !== "undefined" &&
        /iPhone|iPad|iPod|Android|Instagram|FBAN|FBAV|TikTok/i.test(navigator.userAgent);

      if (isMobileOrWebView) {
        window.location.href = url;
      } else {
        const win = window.open(url, "_blank", "noopener,noreferrer");
        if (!win || win.closed || typeof win.closed === "undefined") {
          window.location.href = url;
        }
      }
    },
    [items, subtotal]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        subtotalFormatted,
        checkoutViaWhatsApp,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
}
