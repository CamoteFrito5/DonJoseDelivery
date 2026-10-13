import React, { useState } from 'react';
import { FileText, QrCode, Banknote, Copy, Check, ArrowLeft, ArrowRight, ShieldCheck, CheckSquare, Square } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/products';

export default function ReceiptPaymentStep({
  orderCalculation,
  paymentData,
  onUpdatePaymentData,
  onBack,
  onFinishOrder
}) {
  const [copied, setCopied] = useState(false);
  const [wantsReceipt, setWantsReceipt] = useState(!!paymentData.wantsReceipt);

  const handleCopy = () => {
    navigator.clipboard.writeText(BUSINESS_CONFIG.yapeNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleReceipt = () => {
    const nextVal = !wantsReceipt;
    setWantsReceipt(nextVal);
    onUpdatePaymentData({ wantsReceipt: nextVal });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFinishOrder();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-black text-amber-600 uppercase tracking-widest block mb-1">
            Paso 4 de 4 • Forma de Pago y Comprobante
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            ¿Cómo deseas pagar?
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Elige tu método de pago. El recibo y DNI son totalmente opcionales.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selector de Método de Pago */}
          <div>
            <label className="block text-sm font-black text-slate-900 mb-2">
              Forma de Pago:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Opción YAPE */}
              <button
                type="button"
                onClick={() => onUpdatePaymentData({ paymentMethod: 'YAPE' })}
                className={`p-4 rounded-2xl border-2 text-left transition flex items-center gap-3 cursor-pointer ${
                  paymentData.paymentMethod === 'YAPE'
                    ? 'border-purple-600 bg-purple-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-lg">
                  Y
                </div>
                <div>
                  <h5 className="font-black text-slate-900 text-sm">Yape a Don José</h5>
                  <p className="text-[11px] text-slate-500">Pagas antes de enviar</p>
                </div>
              </button>

              {/* Opción EFECTIVO */}
              <button
                type="button"
                onClick={() => onUpdatePaymentData({ paymentMethod: 'EFECTIVO' })}
                className={`p-4 rounded-2xl border-2 text-left transition flex items-center gap-3 cursor-pointer ${
                  paymentData.paymentMethod === 'EFECTIVO'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-black text-slate-900 text-sm">Efectivo al recibir</h5>
                  <p className="text-[11px] text-slate-500">Pagas contra entrega</p>
                </div>
              </button>
            </div>
          </div>

          {/* Detalle si elige YAPE */}
          {paymentData.paymentMethod === 'YAPE' && (
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-purple-700 block">Número de Yape de Don José:</span>
                  <span className="text-xl font-black text-purple-950 font-mono tracking-wider">
                    {BUSINESS_CONFIG.yapeNumber}
                  </span>
                  <p className="text-xs text-purple-800 font-semibold">{BUSINESS_CONFIG.yapeOwner}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-2 bg-white hover:bg-purple-100 text-purple-700 font-bold border border-purple-200 rounded-xl text-xs transition active:scale-95 flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Detalle si elige EFECTIVO */}
          {paymentData.paymentMethod === 'EFECTIVO' && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 animate-in fade-in">
              <label className="block text-xs font-black text-emerald-900">
                ¿Con cuánto billete pagarás? (Para llevarte vuelto exacto):
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-emerald-900">S/</span>
                <input
                  type="number"
                  step="5"
                  value={paymentData.cashWith || ''}
                  onChange={(e) => onUpdatePaymentData({ cashWith: e.target.value })}
                  placeholder={`Ejemplo: ${Math.ceil(orderCalculation.total / 10) * 10 || 50}`}
                  className="w-full text-sm px-3 py-2.5 rounded-xl border border-emerald-300 bg-white font-bold"
                />
              </div>
            </div>
          )}

          {/* RECIBO Y DNI (100% OPCIONAL) */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <button
              type="button"
              onClick={toggleReceipt}
              className="flex items-center gap-2.5 text-left w-full cursor-pointer"
            >
              {wantsReceipt ? (
                <CheckSquare className="w-5 h-5 text-amber-600 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-400 shrink-0" />
              )}
              <div>
                <span className="text-xs sm:text-sm font-black text-slate-800 block">
                  ¿Deseas generar un Recibo / Nota de Pedido digital? (Opcional)
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Podrás ver y descargar un ticket formal de Don José con el detalle de tu compra.
                </span>
              </div>
            </button>

            {wantsReceipt && (
              <div className="pt-2 border-t border-slate-200 animate-in fade-in space-y-1">
                <label className="block text-xs font-black text-slate-700">
                  DNI para el recibo (Opcional):
                </label>
                <input
                  type="tel"
                  maxLength={8}
                  value={paymentData.dni || ''}
                  onChange={(e) =>
                    onUpdatePaymentData({ dni: e.target.value.replace(/\D/g, '') })
                  }
                  placeholder="DNI (o déjalo en blanco para VARIOS)"
                  className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                />
              </div>
            )}
          </div>

          {/* Desglose de Pago Completo */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between">
              <span>Subtotal Platos:</span>
              <span className="font-bold">S/ {orderCalculation.subtotal.toFixed(2)}</span>
            </div>
            {orderCalculation.taperCount > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Empaques ({orderCalculation.taperCount} táperes descartables):</span>
                <span>S/ {orderCalculation.taperCost.toFixed(2)}</span>
              </div>
            )}
            {orderCalculation.bagCost > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Bolsa de despacho:</span>
                <span>S/ {orderCalculation.bagCost.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Envío / Delivery:</span>
              <span className="font-bold">
                {orderCalculation.deliveryCost === 0 ? 'Gratis (Recojo)' : `S/ ${orderCalculation.deliveryCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>TOTAL A PAGAR:</span>
              <span className="text-amber-700 text-xl font-black">
                S/ {orderCalculation.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Información clara sobre el seguimiento */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              Al confirmar, <strong>permanecerás en esta página</strong> y podrás seguir el estado de tu pedido en vivo (en cocina, en camino, etc.) durante las próximas 4 horas sin perder tu información.
            </p>
          </div>

          {/* Botones */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="w-1/3 flex items-center justify-center gap-1.5 px-4 py-3.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-sm transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>

            <button
              type="submit"
              className="w-2/3 flex items-center justify-center gap-2 px-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-base shadow-lg transition active:scale-98 cursor-pointer"
            >
              <span>Confirmar Pedido</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
