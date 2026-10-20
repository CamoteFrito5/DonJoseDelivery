import React from 'react';
import { ShoppingBag, Phone, Store, ClipboardList, MessageCircle } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/products';

export default function Header({ cartCount, onOpenCart, onOpenAdmin, currentStep }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Marca y Ubicación */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold text-2xl shadow-md">
            DJ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                {BUSINESS_CONFIG.name}
              </h1>
              <span className="hidden sm:inline-block bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                Abierto hoy
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1 font-medium">
              <Store className="w-3.5 h-3.5 text-amber-600" />
              {BUSINESS_CONFIG.city} • Pedidos directos sin demoras
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          {/* WhatsApp de Consultas para el Cliente */}
          <a
            href={`https://wa.me/${BUSINESS_CONFIG.adminWhatsApp}?text=${encodeURIComponent('Hola Don José, tengo una consulta sobre el menú o mi pedido.')}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Consultas al WhatsApp de Don José"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Consultas: {BUSINESS_CONFIG.adminDisplayPhone}</span>
            <span className="sm:hidden">Consultas</span>
          </a>

          {/* Botón Administrador (Ver registros / Excel) */}
          <button
            onClick={onOpenAdmin}
            title="Panel de administración y pedidos"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
          >
            <ClipboardList className="w-4 h-4 text-slate-600" />
            <span>Pedidos (Excel)</span>
          </button>

          {/* Carrito de compras */}
          <button
            onClick={onOpenCart}
            aria-label="Abrir carrito"
            className="relative flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2.5 rounded-xl shadow-md transition active:scale-95 text-base"
          >
            <ShoppingBag className="w-5 h-5 text-slate-950" />
            <span className="hidden sm:inline font-extrabold">Mi Pedido</span>
            {cartCount > 0 && (
              <span className="bg-slate-900 text-white text-xs font-black px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
