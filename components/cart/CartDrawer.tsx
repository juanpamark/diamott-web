"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { BRAND, CheckoutCustomerData } from "@/lib/constants";
import { formatCurrency } from "@/lib/formatters";

const PAYMENT_METHODS = ["Nequi", "Daviplata", "Bancolombia"];

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    totalItems,
    subtotalFormatted,
    checkoutViaWhatsApp,
  } = useCart();

  const [formData, setFormData] = useState<CheckoutCustomerData>({
    nombre: "",
    cedula: "",
    direccionCiudad: "",
    metodoPago: "Nequi",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Bloquear scroll de la página cuando el Drawer esté abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Tecla Escape para cerrar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeCart]);

  if (!isOpen) return null;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { [key: string]: string } = {};
    if (!formData.nombre.trim()) errors.nombre = "Ingresa tu nombre completo";
    if (!formData.cedula.trim()) errors.cedula = "Ingresa tu número de cédula";
    if (!formData.direccionCiudad.trim())
      errors.direccionCiudad = "Ingresa tu dirección y ciudad";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    checkoutViaWhatsApp(formData);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      {/* Backdrop con blur */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-neutral-100 animate-in slide-in-from-right duration-300">
          {/* Encabezado del Drawer */}
          <div className="p-4 sm:p-6 border-b border-neutral-100 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2
                id="cart-drawer-title"
                className="text-base sm:text-lg font-semibold tracking-wider uppercase text-neutral-900"
              >
                Tu Carrito ({totalItems})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-2 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-50 transition-colors cursor-pointer"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cuerpo: Lista de Productos o Carrito Vacío */}
          <div className="grow overflow-y-auto p-4 sm:p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300">
                  <ShoppingBag className="w-8 h-8 stroke-[1.25]" />
                </div>
                <h3 className="text-base font-medium text-neutral-800">
                  Tu carrito está vacío
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs leading-relaxed font-light">
                  Añade tus cosméticos, bolsos o productos de cuidado favoritos para armar tu pedido.
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-2 px-6 py-2.5 text-xs font-semibold tracking-widest uppercase bg-neutral-900 text-white rounded-sm hover:bg-black transition-all cursor-pointer"
                >
                  Continuar explorando
                </button>
              </div>
            ) : (
              <>
                {/* Lista de productos agregados */}
                <div className="divide-y divide-neutral-100">
                  {items.map((item) => (
                    <div key={item.product.id} className="py-4 flex gap-3 sm:gap-4">
                      {/* Imagen con fallback */}
                      <div className="relative w-20 h-20 aspect-square rounded-sm overflow-hidden bg-neutral-50 shrink-0 border border-neutral-100">
                        <Image
                          src={item.product.imagen_url || BRAND.fallbackImageUrl}
                          alt={item.product.nombre_producto}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      {/* Detalles y controles */}
                      <div className="grow flex flex-col justify-between min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-[9px] tracking-wider uppercase text-neutral-400 block">
                              {item.product.pagina}
                            </span>
                            <h4 className="text-xs sm:text-sm font-medium text-neutral-900 truncate">
                              {item.product.nombre_producto}
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-neutral-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                            aria-label={`Eliminar ${item.product.nombre_producto}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1">
                          {/* Selector de cantidad */}
                          <div className="flex items-center border border-neutral-200 rounded-sm">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                              className="p-1 sm:px-2 text-neutral-600 hover:text-black cursor-pointer"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-semibold text-neutral-900 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              className="p-1 sm:px-2 text-neutral-600 hover:text-black cursor-pointer"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Subtotal del item */}
                          <span className="text-xs sm:text-sm font-semibold text-neutral-900">
                            {formatCurrency(item.product.precio * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumen del Subtotal */}
                <div className="bg-[#FAF9F7] p-4 rounded-lg border border-[#EBE8E1] space-y-2">
                  <div className="flex justify-between items-center text-xs text-neutral-600 font-light">
                    <span>Artículos acumulados:</span>
                    <span>{totalItems} uds</span>
                  </div>
                  <div className="flex justify-between items-center text-sm sm:text-base font-semibold text-neutral-900 pt-1 border-t border-neutral-200/60">
                    <span>Subtotal General:</span>
                    <span className="text-lg text-neutral-950 font-bold">
                      {subtotalFormatted}
                    </span>
                  </div>
                </div>

                {/* Formulario de Datos de Envío */}
                <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-3.5 pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Datos de Envío y Pago</span>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-medium mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => {
                        setFormData({ ...formData, nombre: e.target.value });
                        if (formErrors.nombre) setFormErrors({ ...formErrors, nombre: "" });
                      }}
                      placeholder="Ej. Jennifer Motato"
                      className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                    />
                    {formErrors.nombre && (
                      <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.nombre}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-medium mb-1">
                      Cédula / Documento *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cedula}
                      onChange={(e) => {
                        setFormData({ ...formData, cedula: e.target.value });
                        if (formErrors.cedula) setFormErrors({ ...formErrors, cedula: "" });
                      }}
                      placeholder="Ej. 1020304050"
                      className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                    />
                    {formErrors.cedula && (
                      <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.cedula}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-medium mb-1">
                      Dirección y Ciudad *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.direccionCiudad}
                      onChange={(e) => {
                        setFormData({ ...formData, direccionCiudad: e.target.value });
                        if (formErrors.direccionCiudad)
                          setFormErrors({ ...formErrors, direccionCiudad: "" });
                      }}
                      placeholder="Ej. Calle 10 #20-30, Medellín"
                      className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                    />
                    {formErrors.direccionCiudad && (
                      <p className="text-[10px] text-rose-600 mt-0.5">
                        {formErrors.direccionCiudad}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-medium mb-1.5">
                      Método de pago preferido
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {PAYMENT_METHODS.map((method) => {
                        const isSelected = formData.metodoPago === method;
                        return (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setFormData({ ...formData, metodoPago: method })}
                            className={`py-2 px-1 text-center text-xs rounded-sm font-medium transition-all cursor-pointer ${
                              isSelected
                                ? "bg-neutral-900 text-white shadow-xs"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
                            }`}
                          >
                            {method}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Pie del Drawer: Botón WhatsApp Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-neutral-100 bg-white">
              <button
                type="submit"
                form="checkout-form"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                <span>Enviar Pedido por WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-neutral-400 text-center mt-2 font-light">
                Serás redirigido a la línea oficial de Di&apos;amott con tu pedido preformateado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
