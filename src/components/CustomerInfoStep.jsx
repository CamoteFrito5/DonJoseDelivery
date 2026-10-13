import React, { useState } from 'react';
import { User, Phone, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export default function CustomerInfoStep({
  customerData,
  onUpdateCustomerData,
  onBack,
  onNext
}) {
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerData.fullName.trim() || customerData.fullName.trim().length < 3) {
      setError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!customerData.phone.trim() || !/^\d{9}$/.test(customerData.phone.trim())) {
      setError('Ingresa un número de celular de 9 dígitos para coordinar el pedido.');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-black text-amber-600 uppercase tracking-widest block mb-1">
            Paso 2 de 4 • Datos de Contacto
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            ¿A nombre de quién registramos el pedido?
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Solo te pediremos tu nombre y celular para confirmar en cocina y WhatsApp.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-black text-slate-800 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-600" />
              <span>Tu Nombre Completo:</span>
            </label>
            <input
              type="text"
              autoFocus
              value={customerData.fullName}
              onChange={(e) => onUpdateCustomerData({ fullName: e.target.value })}
              placeholder="Ejemplo: Miguel Ángel Ramos"
              className="w-full text-base px-4 py-3.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-semibold"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-black text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-amber-600" />
              <span>Teléfono Celular (WhatsApp):</span>
            </label>
            <input
              type="tel"
              maxLength={9}
              value={customerData.phone}
              onChange={(e) =>
                onUpdateCustomerData({ phone: e.target.value.replace(/\D/g, '') })
              }
              placeholder="Ejemplo: 953123456"
              className="w-full text-base px-4 py-3.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono font-bold tracking-wider"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
              {error}
            </p>
          )}

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
              className="w-2/3 flex items-center justify-center gap-2 px-4 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl text-base shadow-md transition active:scale-98 cursor-pointer"
            >
              <span>Continuar a Entrega</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
