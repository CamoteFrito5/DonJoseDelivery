import React, { useState } from 'react';
import { QrCode, Copy, Check, ArrowLeft, ArrowRight, ShieldAlert, Smartphone } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/products';

export default function YapePayment({
  orderSummary,
  onBackToData,
  onConfirmAndFinish
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(BUSINESS_CONFIG.yapeNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {/* Cabecera Paso 3 */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-lg">
            Y
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Paso 3: Pago con Yape
            </h2>
            <p className="text-xs text-slate-500">
              Realiza el pago antes de enviar la confirmación a Don José.
            </p>
          </div>
        </div>

        {/* Resumen del Monto Destacado */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 text-center my-4">
          <span className="text-xs font-black text-purple-700 uppercase tracking-wider block">
            Monto Exacto a Yapear
          </span>
          <div className="text-4xl font-black text-purple-950 mt-1">
            S/ {orderSummary.total.toFixed(2)}
          </div>
          <p className="text-xs text-purple-800 mt-1 font-semibold">
            Titular: <span className="font-black">{BUSINESS_CONFIG.yapeOwner}</span>
          </p>
        </div>

        {/* Datos de Yape para transferir */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center my-6">
          {/* Tarjeta con número y botón copiar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-slate-700 text-xs font-bold">
              <Smartphone className="w-4 h-4 text-purple-600" />
              <span>Número de Yape de Don José:</span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-wider">
              {BUSINESS_CONFIG.adminDisplayPhone}
            </div>
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-100 text-purple-700 font-bold border border-purple-200 rounded-lg text-xs transition active:scale-95 shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-black">¡Número Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Número de Yape</span>
                </>
              )}
            </button>
          </div>

          {/* Código QR Ilustrativo */}
          <div className="flex flex-col items-center justify-center p-4 bg-purple-900 rounded-xl text-white text-center">
            <div className="bg-white p-2 rounded-lg shadow mb-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=YAPE_DON_JOSE_${BUSINESS_CONFIG.yapeNumber}`}
                alt="QR Yape Don José"
                className="w-28 h-28 object-contain"
              />
            </div>
            <span className="text-xs font-bold text-purple-200">
              Escanea con tu app Yape
            </span>
          </div>
        </div>

        {/* Instrucciones Claras en 3 Pasos */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
          <h4 className="font-black text-slate-900 flex items-center gap-1.5 text-sm">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            ¿Cómo completar tu compra?
          </h4>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-600 font-medium">
            <li>Abre tu aplicación <strong>Yape</strong> y transfiere <strong>S/ {orderSummary.total.toFixed(2)}</strong>.</li>
            <li>Guarda o toma una <strong>captura de pantalla</strong> del comprobante de Yape.</li>
            <li>Haz clic en el botón verde abajo para <strong>registrar el pedido y enviar el detalle a WhatsApp</strong>.</li>
            <li>En WhatsApp, presiona "Enviar" y adjunta tu captura de Yape para que el pedido comience a prepararse de inmediato.</li>
          </ol>
        </div>

        {/* Botones de Acción */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onBackToData}
            className="sm:w-1/3 flex items-center justify-center gap-1.5 px-4 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Datos</span>
          </button>

          <button
            type="button"
            onClick={onConfirmAndFinish}
            className="sm:w-2/3 flex items-center justify-center gap-2 px-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-base shadow-lg transition active:scale-98 cursor-pointer"
          >
            <span>Confirmar Pedido y Enviar a WhatsApp</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
