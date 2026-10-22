"use client";

import { useEffect } from "react";
import { X, ShieldCheck } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#D89BA3]" />
            <div>
              <h2
                id="terms-modal-title"
                className="text-base sm:text-lg font-playfair font-bold text-neutral-900"
              >
                Términos, Condiciones y Política de Privacidad
              </h2>
              <p className="text-[11px] text-neutral-500 uppercase tracking-wider">
                Di&apos;amott — Beauty & Accessories
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto px-6 py-6 space-y-6 text-sm text-neutral-600 leading-relaxed font-light">
          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="font-semibold text-neutral-900 text-sm">
              1. Información General y Respaldo Comercial
            </h3>
            <p>
              Di&apos;amott es una marca colombiana comercializadora de productos de maquillaje, cuidado personal, fragancias, bolsos y accesorios, debidamente inscrita en el Registro Único Tributario (RUT). Nuestros canales oficiales de atención son: WhatsApp 317 059 3785, correo electrónico diamott.beauty@gmail.com e Instagram @diamott_beauty. Para quejas o reclamos comunicarse a través del correo o la línea de WhatsApp.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="font-semibold text-neutral-900 text-sm">
              2. Proceso de Compra y Precios
            </h3>
            <p>
              Nuestro sitio web funciona como un catálogo interactivo. Al seleccionar tus productos en el carrito y hacer clic en finalizar pedido, serás redirigido a nuestra línea oficial de WhatsApp con el resumen de tu selección para confirmar disponibilidad, costos de envío y métodos de pago. Todos los precios están expresados en pesos colombianos (COP).
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h3 className="font-semibold text-neutral-900 text-sm">
              3. Política de Privacidad y Tratamiento de Datos (Sin almacenamiento en bases de datos)
            </h3>
            <p className="font-normal text-neutral-800">
              En Di&apos;amott respetamos al máximo tu privacidad:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-neutral-600">
              <li>
                <strong className="text-neutral-800 font-medium">Cero almacenamiento web:</strong> Los datos opcionales que ingresas en el carrito de compras (como tu nombre y dirección de entrega) no se guardan, no se almacenan en bases de datos propias ni externas, y bajo ninguna circunstancia son vendidos o cedidos a terceros.
              </li>
              <li>
                <strong className="text-neutral-800 font-medium">Uso exclusivo para envío vía WhatsApp:</strong> Dicha información se utiliza única y exclusivamente de forma temporal en tu navegador para estructurar el mensaje automático que tú mismo nos envías por WhatsApp, con el único fin de agilizar la cotización y el despacho de tu pedido a través de la transportadora.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h3 className="font-semibold text-neutral-900 text-sm">
              4. Envíos, Cambios y Garantías
            </h3>
            <p>
              Realizamos envíos a toda Colombia. Por razones de higiene y salud pública, los productos de maquillaje, cuidado personal y fragancias son de uso estrictamente personal y no tienen cambio una vez abiertos o desellados, salvo por defectos de fábrica reportados dentro de los primeros dos (2) días hábiles tras recibir el paquete. Para bolsos y accesorios, la garantía cubre defectos de fabricación o costuras reportados al momento de la entrega.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-100 bg-[#FAFAFA] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium uppercase tracking-wider bg-neutral-900 text-white rounded-full hover:bg-black transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
