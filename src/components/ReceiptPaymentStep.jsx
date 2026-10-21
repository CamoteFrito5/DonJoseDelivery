import React, { useState } from 'react';
import { FileText, Banknote, Copy, Check, ArrowLeft, ArrowRight, ShieldCheck, CheckSquare, Square, Store, QrCode } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/products';

export default function ReceiptPaymentStep({
  customerData,
  orderCalculation,
  paymentData,
  onUpdatePaymentData,
  onBack,
  onFinishOrder
}) {
  const [copied, setCopied] = useState(false);
  const [wantsReceipt, setWantsReceipt] = useState(!!paymentData.wantsReceipt);

  const isPickup = customerData?.deliveryType === 'tienda';

  const handleCopy = () => {
    navigator.clipboard.writeText(BUSINESS_CONFIG.yapeNumber || '960447032');
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
            Paso 4 de 4 • {isPickup ? 'Comprobante y Confirmación' : 'Forma de Pago y Comprobante'}
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            {isPickup ? 'Confirmación de Pedido para Llevar' : '¿Cómo deseas pagar?'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isPickup
              ? 'Como recogerás en persona en el local, pagarás directamente en caja al recibir tu pedido.'
              : 'Elige tu método de pago para el delivery. El recibo y DNI son totalmente opcionales.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Si es RECOJO EN LOCAL: No mostrar selector de formas de pago */}
          {isPickup ? (
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                <Store className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-1">
                <h4 className="font-black text-slate-900 text-sm">
                  Pago presencial en caja al recoger
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Pagarás al momento de recoger tus platos en el local. Aceptamos <strong>Efectivo, Yape o Tarjeta</strong> directamente en caja.
                </p>
                <p className="text-[11px] text-amber-800 font-bold">
                  📍 A.H. PROMUVI IV Mz. 35 Lte. 20 • Hora aprox: {customerData?.pickupTime || 'En 30 minutos'}
                </p>
              </div>
            </div>
          ) : (
            /* Si es DELIVERY: Mostrar selector de formas de pago (SIN selector de denominación de billetes) */
            <div className="space-y-3">
              <label className="block text-sm font-black text-slate-900 mb-2">
                Forma de Pago para el Delivery:
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
                    <p className="text-[11px] text-slate-500">Pagas por anticipado</p>
                  </div>
                </button>

                {/* Opción EFECTIVO CONTRA ENTREGA (Sin preguntar billetes) */}
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
                    <p className="text-[11px] text-slate-500">Pagas al motorizado</p>
                  </div>
                </button>
              </div>

              {/* Detalle si elige YAPE */}
              {paymentData.paymentMethod === 'YAPE' && (
                <div className="p-4 sm:p-5 bg-purple-50/90 rounded-2xl border-2 border-purple-200 space-y-4 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Tarjeta del Código QR de Yape */}
                    <div className="w-36 h-48 sm:w-40 sm:h-52 bg-white rounded-2xl p-1.5 shadow-md border border-purple-200 shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src="/yape-qr.jpg"
                        alt="Código QR de Yape"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>

                    {/* Información y botón para copiar */}
                    <div className="space-y-2.5 flex-1 text-center sm:text-left">
                      <div>
                        <span className="text-xs font-bold text-purple-700 block">
                          Escanea el QR o yapea directo a:
                        </span>
                        <span className="text-2xl font-black text-purple-950 font-mono tracking-wider block">
                          {BUSINESS_CONFIG.yapeNumber}
                        </span>
                        <p className="text-xs font-bold text-purple-900 mt-0.5">
                          Titular: {BUSINESS_CONFIG.yapeOwner}
                        </p>
                        <div className="inline-block mt-1 bg-purple-200 text-purple-950 text-xs font-black px-2.5 py-0.5 rounded-full">
                          Monto a yapear: S/ {orderCalculation.total.toFixed(2)}
                        </div>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="w-full sm:w-auto px-3.5 py-2 bg-white hover:bg-purple-100 text-purple-700 font-bold border border-purple-300 rounded-xl text-xs transition active:scale-95 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer mx-auto sm:mx-0"
                        >
                          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          <span>{copied ? '¡Número copiado!' : 'Copiar Número de Yape'}</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-purple-800 leading-snug">
                        💡 Puedes escanear el QR desde tu celular o hacer captura de pantalla si estás navegando desde el mismo móvil.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Detalle si elige EFECTIVO */}
              {paymentData.paymentMethod === 'EFECTIVO' && (
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 animate-in fade-in flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Pagarás en efectivo al momento de recibir tu pedido del repartidor.</span>
                </div>
              )}
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

          {/* Desglose de Totales */}
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
              <span>Envío / Modalidad:</span>
              <span className="font-bold">
                {isPickup ? 'Gratis (Separar para llevar)' : (orderCalculation.deliveryCost === 0 ? 'Por coordinar' : `S/ ${orderCalculation.deliveryCost.toFixed(2)}`)}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>TOTAL A PAGAR:</span>
              <span className="text-amber-700 text-xl font-black">
                S/ {orderCalculation.total.toFixed(2)}
              </span>
            </div>
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
