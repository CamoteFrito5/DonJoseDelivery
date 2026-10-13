import React from 'react';
import { CheckCircle2, MessageCircle, RefreshCw, ShoppingCart, FileSpreadsheet } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/products';
import { generateWhatsAppLink } from '../services/whatsappService';

export default function OrderSuccess({ order, onNewOrder }) {
  const whatsappUrl = generateWhatsAppLink(order, BUSINESS_CONFIG);

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg text-center space-y-6">
        {/* Icono Éxito */}
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>

        <div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">
            Código de Pedido: {order.id}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            ¡Tu pedido fue registrado!
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
            La información ha sido guardada en la base de datos de <strong>Don José</strong>. Ahora debes enviar el mensaje a WhatsApp para confirmar la atención.
          </p>
        </div>

        {/* Botón Principal WhatsApp */}
        <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-200 space-y-3">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-2xl shadow-lg shadow-emerald-600/30 transition active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-6 h-6 fill-white" />
            <span>Enviar Pedido a WhatsApp</span>
          </button>
          <p className="text-xs text-emerald-800 font-semibold">
            Haz clic aquí para abrir WhatsApp con todo el detalle de tu pedido listo para enviar a Don José.
          </p>
        </div>

        {/* Resumen del Pedido Registrado */}
        <div className="text-left bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs sm:text-sm space-y-2">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-bold">Cliente:</span>
            <span className="font-black text-slate-800">{order.fullName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-bold">DNI:</span>
            <span className="font-mono font-black text-slate-800">{order.dni}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-bold">Modalidad:</span>
            <span className="font-bold text-slate-800">
              {order.deliveryType === 'tienda' ? 'Recojo en Local' : `Delivery (${order.deliveryZoneName})`}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-bold">Productos:</span>
            <span className="font-bold text-slate-800">{order.items.length} ítems</span>
          </div>
          <div className="flex justify-between pt-1 text-base font-black">
            <span className="text-slate-700">Monto Pagado con Yape:</span>
            <span className="text-emerald-700 text-lg">S/ {order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Botón de nuevo pedido */}
        <div className="pt-2">
          <button
            onClick={onNewOrder}
            className="flex items-center justify-center gap-2 mx-auto text-sm font-bold text-slate-500 hover:text-slate-800 transition py-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Realizar otro pedido</span>
          </button>
        </div>
      </div>
    </div>
  );
}
