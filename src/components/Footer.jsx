import React from 'react';
import { Store, Phone, MessageCircle, Clock, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/products';

export default function Footer({ onOpenAdmin }) {
  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.adminWhatsApp}?text=${encodeURIComponent(
    'Hola Don José, tengo una consulta sobre el menú o un pedido.'
  )}`;

  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800 pt-10 pb-20 md:pb-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Cuadrícula Principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          {/* Columna 1: Marca e Identidad */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl p-1 shadow-md flex items-center justify-center shrink-0">
                <img
                  src="/logo.png"
                  alt="Logo Don José"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-black text-lg leading-tight">
                  {BUSINESS_CONFIG.name}
                </h3>
                <span className="text-xs text-amber-400 font-bold">
                  Pollería & Parrilladas al Carbón
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              El auténtico sabor del pollo a la brasa y las mejores carnes y parrilladas de Ilo. Calidad, sazón y rapidez sin intermediarios.
            </p>
            <div className="text-[11px] text-slate-500">
              <span>Titular: </span>
              <strong className="text-slate-400">{BUSINESS_CONFIG.owner}</strong>
            </div>
          </div>

          {/* Columna 2: Consultas por WhatsApp y Contacto */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-sm">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>¿Consultas o Pedidos Especiales?</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              ¿Deseas hacer una consulta sobre la carta, coordinar un pedido corporativo o consultar tu orden? Escríbenos directamente a nuestro WhatsApp oficial:
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Consultar al WhatsApp (+51 {BUSINESS_CONFIG.adminDisplayPhone})</span>
            </a>
            <div className="text-[11px] text-slate-400 flex flex-col gap-0.5">
              <span>
                📞 Teléfono principal: <strong className="text-white">{BUSINESS_CONFIG.adminDisplayPhone}</strong>
              </span>
              <span>
                📱 Teléfonos de apoyo: <span className="text-slate-300">{BUSINESS_CONFIG.secondaryPhone}</span>
              </span>
            </div>
          </div>

          {/* Columna 3: Ubicación y Horarios */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-sm">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Ubicación y Atención</span>
            </div>
            <div className="text-xs text-slate-400 space-y-2">
              <div className="flex items-start gap-2">
                <Store className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{BUSINESS_CONFIG.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Lunes a Domingo • 11:30 AM a 10:30 PM</span>
              </div>
            </div>
            <div className="pt-2 text-[11px] text-slate-400">
              <span className="font-bold text-slate-300 block mb-1">Modalidades de pedido:</span>
              <ul className="space-y-0.5 list-disc list-inside text-slate-400">
                <li>Separar pedido para llevar (Recojo en Tienda)</li>
                <li>Delivery a Domicilio en todo Ilo</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Barra Inferior de Derechos y Enlace Admin */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Don José Pollería & Parrilladas • Todos los derechos reservados.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition cursor-pointer text-xs font-semibold py-1 px-2.5 rounded-lg hover:bg-slate-800"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Acceso Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
