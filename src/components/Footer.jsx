import React from 'react';
import { Store, Phone, MessageCircle, Clock, MapPin, ShieldCheck } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/products';

export default function Footer({ onOpenAdmin }) {
  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.adminWhatsApp}?text=${encodeURIComponent(
    'Hola Don José, tengo una consulta sobre el menú o un pedido.'
  )}`;

  return (
    <footer
      className="mt-auto border-t pt-10 pb-20 md:pb-10 text-slate-800"
      style={{ backgroundColor: '#bfc2c5', borderColor: '#a2a6aa' }}
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Cuadrícula Principal */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b"
          style={{ borderColor: '#a2a6aa' }}
        >
          {/* Columna 1: Marca e Identidad */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl p-1 shadow-md flex items-center justify-center shrink-0 border border-slate-300">
                <img
                  src="/logo.png"
                  alt="Logo Don José"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-slate-950 font-black text-lg leading-tight">
                  {BUSINESS_CONFIG.name}
                </h3>
                <span className="text-xs text-amber-800 font-extrabold">
                  Pollería & Parrilladas al Carbón
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              El auténtico sabor del pollo a la brasa y las mejores carnes y parrilladas de Ilo. Calidad, sazón y rapidez sin intermediarios.
            </p>
            <div className="text-[11px] text-slate-600">
              <span>Titular: </span>
              <strong className="text-slate-900">{BUSINESS_CONFIG.owner}</strong>
            </div>
          </div>

          {/* Columna 2: Consultas por WhatsApp y Contacto */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-950 font-black text-sm">
              <MessageCircle className="w-4 h-4 text-emerald-800" />
              <span>¿Consultas o Pedidos Especiales?</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              ¿Deseas hacer una consulta sobre la carta, coordinar un pedido corporativo o consultar tu orden? Escríbenos directamente a nuestro WhatsApp oficial:
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Consultar al WhatsApp (+51 {BUSINESS_CONFIG.adminDisplayPhone})</span>
            </a>
            <div className="text-[11px] text-slate-700 flex flex-col gap-0.5 font-medium">
              <span>
                📞 Teléfono principal: <strong className="text-slate-950">{BUSINESS_CONFIG.adminDisplayPhone}</strong>
              </span>
              <span>
                📱 Teléfonos de apoyo: <span className="text-slate-800 font-semibold">{BUSINESS_CONFIG.secondaryPhone}</span>
              </span>
            </div>
          </div>

          {/* Columna 3: Ubicación y Horarios */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-950 font-black text-sm">
              <MapPin className="w-4 h-4 text-amber-800" />
              <span>Ubicación y Atención</span>
            </div>
            <div className="text-xs text-slate-700 space-y-2 font-medium">
              <div className="flex items-start gap-2">
                <Store className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <span>{BUSINESS_CONFIG.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <span>Lunes a Domingo • 11:30 AM a 10:30 PM</span>
              </div>
            </div>
            <div className="pt-2 text-[11px] text-slate-700">
              <span className="font-bold text-slate-900 block mb-1">Modalidades de pedido:</span>
              <ul className="space-y-0.5 list-disc list-inside text-slate-700 font-medium">
                <li>Separar pedido para llevar (Recojo en Tienda)</li>
                <li>Delivery a Domicilio en todo Ilo</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Barra Inferior de Derechos y Enlace Admin */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="font-medium text-slate-700">
            © {new Date().getFullYear()} Don José Pollería & Parrilladas • Todos los derechos reservados.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-slate-700 hover:text-slate-950 transition cursor-pointer text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-slate-300/80 border border-slate-400/50"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-800" />
              <span>Acceso Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
