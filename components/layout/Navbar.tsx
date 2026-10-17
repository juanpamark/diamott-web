"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ShoppingBag, Search, X, Menu, ChevronDown } from "lucide-react";
import { BRAND, CATEGORIES, NAV_LINKS, Product } from "@/lib/constants";
import { useCatalog } from "@/context/CatalogContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const { products, openQuickView } = useCatalog();
  const { openCart, totalItems } = useCart();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [badgeBump, setBadgeBump] = useState(false);

  const prevTotalItemsRef = useRef(totalItems);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (totalItems > prevTotalItemsRef.current) {
      setBadgeBump(true);
      const timer = setTimeout(() => setBadgeBump(false), 500);
      prevTotalItemsRef.current = totalItems;
      return () => clearTimeout(timer);
    }
    prevTotalItemsRef.current = totalItems;
  }, [totalItems]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Función para normalizar texto eliminando tildes y diacríticos
  const normalizeText = (text: string | undefined): string => {
    if (!text) return "";
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // Búsqueda en tiempo real insensible a tildes sobre todo el catálogo de productos
  const searchResults = useMemo(() => {
    const rawQuery = searchQuery.trim();
    if (!rawQuery) return [];
    const query = normalizeText(rawQuery);

    return products.filter((p) => {
      const matchName = normalizeText(p.nombre_producto).includes(query);
      const matchPage = normalizeText(p.pagina).includes(query);
      const matchSub = normalizeText(p.subcategoria).includes(query);
      return matchName || matchPage || matchSub;
    });
  }, [products, searchQuery]);

  const handleSelectProduct = (product: Product) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    openQuickView(product);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between py-3 sm:py-4">
          {/* Lado Izquierdo: Botón Menú Móvil (Hamburguesa) */}
          <div className="w-20 sm:w-28 flex items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-neutral-800 hover:text-black rounded-full hover:bg-neutral-50 focus:outline-none cursor-pointer"
              aria-label="Abrir menú de navegación"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 stroke-[1.75]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[1.75]" />
              )}
            </button>
          </div>

          {/* CENTRO: Logotipo Puramente Gráfico Oficial */}
          <Link
            href="/"
            className="flex items-center justify-center group focus:outline-none"
            aria-label={`${BRAND.name} - Inicio`}
          >
            <div className="relative h-14 sm:h-20 w-44 sm:w-64">
              <Image
                src={BRAND.officialLogoUrl}
                alt="Di'amott"
                fill
                priority
                sizes="(max-width: 640px) 176px, 256px"
                className="object-contain transition-transform duration-300 group-hover:scale-102"
              />
            </div>
          </Link>

          {/* Lado Derecho: Buscador y Carrito */}
          <div className="w-20 sm:w-28 flex items-center justify-end gap-1 sm:gap-2">
            {/* Botón Lupa (Buscar) */}
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (isMobileMenuOpen) setIsMobileMenuOpen(false);
              }}
              className="p-2 text-neutral-800 hover:text-black transition-colors rounded-full hover:bg-neutral-50 focus:outline-none cursor-pointer"
              aria-label="Buscar productos"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* Ícono de Carrito Outline */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2 text-neutral-800 hover:text-black transition-colors rounded-full hover:bg-neutral-50 focus:outline-none cursor-pointer"
              aria-label="Abrir carrito de compras"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
              <span
                suppressHydrationWarning
                className={`absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-semibold tracking-tighter text-white rounded-full transition-all duration-300 ${
                  badgeBump
                    ? "scale-125 bg-[#D89BA3] shadow-md ring-2 ring-white"
                    : "scale-100 bg-neutral-900"
                }`}
              >
                {totalItems}
              </span>
            </button>
          </div>
        </div>

        {/* Barra de Búsqueda Desplegable */}
        {isSearchOpen && (
          <div className="border-t border-neutral-100 py-4 px-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en todo el catálogo (ej. labial, base, serum, bolso, aretes)..."
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-full focus:outline-none focus:border-neutral-900 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-3 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Resultados de Búsqueda en Vivo */}
              {searchQuery.trim() && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-neutral-100 max-h-80 overflow-y-auto z-50 p-2">
                  {searchResults.length === 0 ? (
                    <p className="text-xs text-neutral-500 text-center py-6 font-light">
                      No encontramos productos que coincidan con &quot;{searchQuery}&quot;.
                    </p>
                  ) : (
                    <div className="divide-y divide-neutral-100">
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          className="flex items-center gap-3 p-2.5 hover:bg-neutral-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <div className="relative w-12 h-12 aspect-square rounded-sm overflow-hidden bg-neutral-100 shrink-0">
                            <Image
                              src={product.imagen_principal_url || product.imagen_url || BRAND.fallbackImageUrl}
                              alt={product.nombre_producto}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="grow min-w-0">
                            <span className="text-[10px] tracking-wider uppercase text-neutral-400 block">
                              {product.pagina} {product.subcategoria ? `• ${product.subcategoria}` : ""}
                            </span>
                            <h4 className="text-xs sm:text-sm font-medium text-neutral-900 truncate">
                              {product.nombre_producto}
                            </h4>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-semibold text-neutral-900">
                              {product.precioFormateado}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enlaces de Navegación Centrados (Desktop) */}
        <nav
          className="hidden md:block pb-3 overflow-visible"
          aria-label="Navegación principal"
        >
          <ul className="flex items-center justify-center gap-6 lg:gap-9 min-w-max mx-auto px-2">
            {NAV_LINKS.map((link) => {
              if (link.isDropdown) {
                return (
                  <li key="categories-dropdown" className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                      className={`text-xs sm:text-sm tracking-widest uppercase transition-all pb-1 border-b flex items-center gap-1 cursor-pointer select-none ${
                        isCategoriesDropdownOpen
                          ? "text-neutral-950 font-semibold border-neutral-900"
                          : "text-neutral-600 font-medium border-transparent hover:text-neutral-950 hover:border-neutral-300"
                      }`}
                      aria-expanded={isCategoriesDropdownOpen}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isCategoriesDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Menú Dropdown Flotante */}
                    {isCategoriesDropdownOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-neutral-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        {CATEGORIES.map((cat) => (
                          <Link
                            key={cat.id}
                            href={cat.href}
                            onClick={() => setIsCategoriesDropdownOpen(false)}
                            className="block px-4 py-2.5 text-xs tracking-wider uppercase text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 transition-colors font-medium"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                );
              }

              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-xs sm:text-sm tracking-widest uppercase transition-all pb-1 border-b ${
                      isActive
                        ? "text-neutral-950 font-semibold border-neutral-900"
                        : "text-neutral-600 font-medium border-transparent hover:text-neutral-950 hover:border-neutral-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Menú de Navegación Móvil Desplegable */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-100 py-4 animate-in fade-in duration-200">
            <ul className="flex flex-col space-y-2 px-2">
              {NAV_LINKS.map((link) => {
                if (link.isDropdown) {
                  return (
                    <li key="mobile-dropdown" className="border-b border-neutral-100/70 pb-2">
                      <button
                        type="button"
                        onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                        className="w-full flex items-center justify-between py-2 text-sm tracking-widest uppercase font-medium text-neutral-700 hover:text-neutral-950 cursor-pointer"
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isMobileCategoriesOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isMobileCategoriesOpen && (
                        <div className="pl-4 py-1 space-y-1.5 border-l-2 border-[#D89BA3] my-1 ml-1">
                          {CATEGORIES.map((cat) => (
                            <Link
                              key={cat.id}
                              href={cat.href}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsMobileCategoriesOpen(false);
                              }}
                              className="block py-1.5 text-xs tracking-wider uppercase text-neutral-600 hover:text-neutral-950"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                }

                const isActive = pathname === link.href;
                return (
                  <li key={link.href} className="border-b border-neutral-100/70 pb-1">
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-2 text-sm tracking-widest uppercase transition-colors ${
                        isActive
                          ? "text-neutral-950 font-semibold"
                          : "text-neutral-600 hover:text-neutral-950"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
