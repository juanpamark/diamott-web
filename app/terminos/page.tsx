import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos, Condiciones y Política de Privacidad | Di'amott",
  description:
    "Términos comerciales, proceso de compra por WhatsApp, política de privacidad y garantías de Di'amott.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-neutral-200/70 p-6 sm:p-10 md:p-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>

        <div className="flex items-center gap-3 pb-6 border-b border-neutral-100">
          <ShieldCheck className="w-7 h-7 text-[#D89BA3]" />
          <div>
            <h1 className="text-xl sm:text-2xl font-playfair font-bold text-neutral-900">
              TÉRMINOS Y CONDICIONES, POLÍTICA DE PRIVACIDAD
            </h1>
            <p className="text-xs text-neutral-500 uppercase tracking-widest mt-0.5">
              DI&apos;AMOTT — BEAUTY & ACCESSORIES
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-8 text-sm sm:text-base text-neutral-600 leading-relaxed font-light">
          {/* 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold text-neutral-900">
              1. Información General y Respaldo Comercial
            </h2>
            <p>
              Di&apos;amott es una marca colombiana comercializadora de productos de maquillaje, cuidado personal, fragancias, bolsos y accesorios, debidamente inscrita en el Registro Único Tributario (RUT). Nuestros canales oficiales de atención son: WhatsApp 317 059 3785, correo electrónico diamott.beauty@gmail.com e Instagram @diamott_beauty. Para quejas o reclamos comunicarse a través del correo o la línea de WhatsApp.
            </p>
          </section>

          {/* 2 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold text-neutral-900">
              2. Proceso de Compra y Precios
            </h2>
            <p>
              Nuestro sitio web funciona como un catálogo interactivo. Al seleccionar tus productos en el carrito y hacer clic en finalizar pedido, serás redirigido a nuestra línea oficial de WhatsApp con el resumen de tu selección para confirmar disponibilidad, costos de envío y métodos de pago. Todos los precios están expresados en pesos colombianos (COP).
            </p>
          </section>

          {/* 3 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold text-neutral-900">
              3. Política de Privacidad y Tratamiento de Datos (Sin almacenamiento en bases de datos)
            </h2>
            <p className="font-normal text-neutral-800">
              En Di&apos;amott respetamos al máximo tu privacidad:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600">
              <li>
                <strong className="text-neutral-900 font-medium">Cero almacenamiento web:</strong> Los datos opcionales que ingresas en el carrito de compras (como tu nombre y dirección de entrega) no se guardan, no se almacenan en bases de datos propias ni externas, y bajo ninguna circunstancia son vendidos o cedidos a terceros.
              </li>
              <li>
                <strong className="text-neutral-900 font-medium">Uso exclusivo para envío vía WhatsApp:</strong> Dicha información se utiliza única y exclusivamente de forma temporal en tu navegador para estructurar el mensaje automático que tú mismo nos envías por WhatsApp, con el único fin de agilizar la cotización y el despacho de tu pedido a través de la transportadora.
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold text-neutral-900">
              4. Envíos, Cambios y Garantías
            </h2>
            <p>
              Realizamos envíos a toda Colombia. Por razones de higiene y salud pública, los productos de maquillaje, cuidado personal y fragancias son de uso estrictamente personal y no tienen cambio una vez abiertos o desellados, salvo por defectos de fábrica reportados dentro de los primeros dos (2) días hábiles tras recibir el paquete. Para bolsos y accesorios, la garantía cubre defectos de fabricación o costuras reportados al momento de la entrega.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
