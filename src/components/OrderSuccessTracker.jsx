import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, ShoppingBag, MapPin, Clock, FileText, Phone, Utensils, Store, Truck } from 'lucide-react';
import { generateWhatsAppLink } from '../services/whatsappService';
import { BUSINESS_CONFIG } from '../data/products';
import ReceiptTicket from './ReceiptTicket';

export default function OrderSuccessTracker({ initialOrder, onNewOrder }) {
  const [showReceipt, setShowReceipt] = useState(false);
  const order = initialOrder;

  const whatsappUrl = generateWhatsAppLink(order, BUSINESS_CONFIG);
  const isPickup = order.deliveryType === 'tienda';

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      {/* Tarjeta Principal de Confirmación */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg text-center space-y-6">
        {/* Cabecera de Éxito */}
        <div className="space-y-3">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <span className="text-xs font-mono font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Orden #{order.id}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              ¡Tu Pedido está Listo!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Cliente: <strong>{order.fullName}</strong> • Registrado el {order.createdAt}
            </p>
          </div>
        </div>

        {/* Botón Destacado para Enviar Comanda a WhatsApp */}
        <div className="p-4 sm:p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-300 space-y-3 text-center">
          <div className="flex items-center justify-center gap-2 text-emerald-950 font-black text-base">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <span>Enviar Pedido a WhatsApp</span>
          </div>
          <p className="text-xs text-emerald-800 font-medium max-w-sm mx-auto leading-relaxed">
            Haz clic en el botón de abajo para enviar el detalle de tu compra directamente al WhatsApp de Don José (<strong>+51 960 447 032</strong>):
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-md transition active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Enviar a WhatsApp (+51 960 447 032)</span>
          </a>
          <p className="text-[11px] text-emerald-700 font-medium">
            ¿Tienes alguna consulta o modificación? Comunícate directamente al <strong>+51 960 447 032</strong>.
          </p>
        </div>

        {/* Modalidad de Entrega / Recojo */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 font-black text-slate-900 text-sm pb-1 border-b border-slate-200">
            {isPickup ? (
              <>
                <Store className="w-4 h-4 text-amber-600" />
                <span>Separar para llevar (Recojo en Tienda)</span>
              </>
            ) : (
              <>
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Delivery a Domicilio</span>
              </>
            )}
          </div>

          {isPickup ? (
            <div className="space-y-1.5 pt-1 text-slate-700">
              <div className="flex items-start gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Hora aproximada de recojo:</strong> {order.pickupTime || 'En 30 minutos'}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Lugar de recojo:</strong> {BUSINESS_CONFIG.address}</span>
              </div>
              <div className="text-[11px] text-slate-500 pt-0.5">
                💳 Pago en caja al momento de recoger (Efectivo / Yape / Tarjeta).
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 pt-1 text-slate-700">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Dirección de entrega:</strong> {order.address}</span>
              </div>
              {order.reference && (
                <div className="text-slate-600 pl-5">
                  <strong>Referencia:</strong> {order.reference}
                </div>
              )}
              <div className="text-slate-600 pl-5">
                <strong>Zona:</strong> {order.deliveryZoneName}
              </div>
              <div className="text-slate-600 pl-5">
                <strong>Forma de pago:</strong> {order.paymentMethod === 'YAPE' ? 'Yape (+51 960 447 032)' : 'Efectivo al recibir'}
              </div>
            </div>
          )}
        </div>

        {/* Resumen Detallado de lo Comprado */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-3">
          <div className="flex items-center gap-2 font-black text-slate-900 text-sm pb-1 border-b border-slate-200">
            <Utensils className="w-4 h-4 text-amber-600" />
            <span>Detalle de lo Comprado:</span>
          </div>

          <div className="space-y-2 divide-y divide-slate-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center pt-1.5 text-xs">
                <div className="pr-2">
                  <span className="font-bold text-slate-800">
                    {item.quantity}x {item.name}
                  </span>
                  {item.unit && (
                    <span className="text-[11px] text-slate-500 block">{item.unit}</span>
                  )}
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  S/ {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Desglose de Costos */}
          <div className="pt-2 border-t border-slate-200 space-y-1 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal Platos:</span>
              <span className="font-semibold">S/ {order.subtotal.toFixed(2)}</span>
            </div>
            {order.taperCount > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Empaques ({order.taperCount} táperes):</span>
                <span>S/ {order.taperCost.toFixed(2)}</span>
              </div>
            )}
            {order.bagCost > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Bolsa de despacho:</span>
                <span>S/ {order.bagCost.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Envío / Modalidad:</span>
              <span className="font-semibold">
                {isPickup ? 'Gratis (Recojo)' : (order.deliveryCost === 0 ? 'Por coordinar' : `S/ ${order.deliveryCost.toFixed(2)}`)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-black text-slate-900">
              <span>TOTAL:</span>
              <span className="text-amber-700 text-xl font-black">
                S/ {order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Ver Recibo Digital (Si lo solicitó) */}
        {order.wantsReceipt && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowReceipt(!showReceipt)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-600" />
              <span>{showReceipt ? 'Ocultar Recibo Digital' : 'Ver Recibo / Nota de Pedido Digital'}</span>
            </button>

            {showReceipt && (
              <div className="pt-3 animate-in fade-in">
                <ReceiptTicket order={order} />
              </div>
            )}
          </div>
        )}

        {/* Botón Hacer Otro Pedido */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={onNewOrder}
            className="flex items-center justify-center gap-1.5 mx-auto text-xs font-bold text-slate-500 hover:text-slate-800 transition py-1 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-slate-400" />
            <span>Hacer un nuevo pedido</span>
          </button>
        </div>
      </div>
    </div>
  );
}
