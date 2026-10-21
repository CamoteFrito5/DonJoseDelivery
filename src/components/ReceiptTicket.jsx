import React from 'react';
import { Printer, CheckCircle, ShieldCheck } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/products';

export default function ReceiptTicket({ order }) {
  if (!order) return null;

  // Cálculos contables similares al PDF
  const total = order.total;
  const subtotalGravado = total / 1.18;
  const igv = total - subtotalGravado;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-6 max-w-sm mx-auto font-mono text-xs text-slate-800 shadow-md">
      {/* Encabezado del Recibo idéntico al PDF R101 */}
      <div className="text-center space-y-0.5 pb-3 border-b border-dashed border-slate-300">
        <img
          src="/logo.png"
          alt="Logo Don José"
          className="w-14 h-14 object-contain mx-auto mb-1"
        />
        <div className="font-black text-base text-slate-900 tracking-wider">
          DON JOSE
        </div>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          POLLERIA & PARRILLADAS
        </div>
        <div className="font-bold text-slate-900 text-[11px] mt-1">
          {BUSINESS_CONFIG.owner}
        </div>
        <div className="text-[10px] text-slate-600">
          MOQUEGUA, MOQUEGUA ILO
        </div>
        <div className="text-[10px] text-slate-600">
          A.H. PROMUVI IV NUEVO ILO. MZ.35 LOTE.20
        </div>
        <div className="text-[10px] text-slate-600 font-bold">
          Tel: {BUSINESS_CONFIG.adminDisplayPhone} - {BUSINESS_CONFIG.secondaryPhone}
        </div>
        <div className="text-[11px] font-black text-amber-700 mt-1">
          Restaurant Parrilladas y Polleria DON JOSE
        </div>
        <div className="font-black text-slate-900 text-xs mt-1">
          NOTA DE PEDIDO
        </div>
        <div className="text-[9px] text-slate-400">
          Reclame su comprobante de pago
        </div>
        <div className="font-black text-slate-900 text-sm bg-slate-100 py-1 rounded mt-1">
          {order.receiptCode || `R101-${order.id.replace(/\D/g, '').padStart(8, '0')}`}
        </div>
      </div>

      {/* Datos del Cliente */}
      <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
        <div className="flex justify-between">
          <span className="text-slate-500">CLIENTE:</span>
          <span className="font-bold text-slate-900">{order.fullName.toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">DNI:</span>
          <span className="font-bold">{order.dni || '11111111 (VARIOS)'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">TELÉFONO:</span>
          <span className="font-bold">{order.phone}</span>
        </div>
        <div className="text-slate-600 text-[10px] truncate">
          DIR: {order.deliveryType === 'tienda' ? 'LOCAL DON JOSÉ (RECOJO)' : order.address}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 pt-1">
          <span>EMISIÓN: {order.createdAt}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span>FORMA PAGO: CONTADO</span>
          <span className="font-bold">MEDIO: {order.paymentMethod}</span>
        </div>
      </div>

      {/* Detalle de Platos */}
      <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1.5">
        <div className="flex justify-between font-bold text-[10px] text-slate-400 border-b border-slate-200 pb-1">
          <span>ÍTEM / PLATO</span>
          <span>CANT</span>
          <span>TOTAL</span>
        </div>
        {order.items.map((i, idx) => (
          <div key={idx} className="flex justify-between items-center text-[11px]">
            <span className="flex-1 truncate mr-2 font-medium">{i.name}</span>
            <span className="w-8 text-center">{i.quantity}</span>
            <span className="font-bold">S/ {(i.price * i.quantity).toFixed(2)}</span>
          </div>
        ))}

        {order.taperCount > 0 && (
          <div className="flex justify-between items-center text-[11px] text-slate-600">
            <span className="flex-1 truncate mr-2">Táper descartable</span>
            <span className="w-8 text-center">{order.taperCount}</span>
            <span>S/ {order.taperCost.toFixed(2)}</span>
          </div>
        )}

        {order.bagCost > 0 && (
          <div className="flex justify-between items-center text-[11px] text-slate-600">
            <span className="flex-1 truncate mr-2">Bolsa despacho</span>
            <span className="w-8 text-center">1</span>
            <span>S/ {order.bagCost.toFixed(2)}</span>
          </div>
        )}

        {order.deliveryCost > 0 && (
          <div className="flex justify-between items-center text-[11px] text-slate-600">
            <span className="flex-1 truncate mr-2">Servicio Delivery</span>
            <span className="w-8 text-center">1</span>
            <span>S/ {order.deliveryCost.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Totales e Impuestos */}
      <div className="py-2.5 space-y-1 text-[11px]">
        <div className="flex justify-between text-slate-500">
          <span>Op. Gravada:</span>
          <span>S/ {subtotalGravado.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Sub total venta:</span>
          <span>S/ {subtotalGravado.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>IGV (18%):</span>
          <span>S/ {igv.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-dashed border-slate-300">
          <span>IMPORTE TOTAL:</span>
          <span className="text-base text-amber-700">S/ {total.toFixed(2)}</span>
        </div>
        <div className="text-[10px] text-slate-400 italic text-center pt-1">
          USUARIO: JOSE C.H.
        </div>
      </div>

      {/* Botón Imprimir Ticket */}
      <div className="mt-3 pt-2 border-t border-slate-200 flex justify-center">
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 py-1.5 px-3 rounded-lg transition"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Imprimir / Guardar Ticket</span>
        </button>
      </div>
    </div>
  );
}
