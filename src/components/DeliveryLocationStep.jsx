import React, { useState } from 'react';
import { Store, Truck, MapPin, Compass, ArrowLeft, ArrowRight, Loader2, Check } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/products';

export default function DeliveryLocationStep({
  customerData,
  onUpdateCustomerData,
  onBack,
  onNext
}) {
  const [locating, setLocating] = useState(false);
  const [locSuccess, setLocSuccess] = useState(false);
  const [error, setError] = useState('');

  // Sugerir ubicación con Geolocation API del dispositivo
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      return;
    }

    setLocating(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        const autoText = `Ubicación GPS detectada (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;

        onUpdateCustomerData({
          address: customerData.address || autoText,
          reference: customerData.reference ? `${customerData.reference} [Maps: ${mapsLink}]` : `[Ubicación Maps: ${mapsLink}]`
        });

        setLocating(false);
        setLocSuccess(true);
        setTimeout(() => setLocSuccess(false), 3000);
      },
      (err) => {
        setLocating(false);
        setError('No se pudo acceder a tu ubicación. Puedes escribir tu dirección manualmente.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customerData.deliveryType === 'delivery') {
      if (!customerData.address || customerData.address.trim().length < 4) {
        setError('Por favor indica tu dirección de entrega en Ilo.');
        return;
      }
    }
    setError('');
    onNext();
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-black text-amber-600 uppercase tracking-widest block mb-1">
            Paso 3 de 4 • Modalidad de Entrega
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            ¿Cómo deseas recibir tu comida?
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Elige si pasarás a recogerlo al local de Don José o si te lo enviamos por delivery.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Opciones de Modalidad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onUpdateCustomerData({ deliveryType: 'tienda' })}
              className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between gap-2 ${
                customerData.deliveryType === 'tienda'
                  ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">Recojo en Local</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  PROMUVI IV Mz 35 Lte 20 (Sin costo de envío)
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onUpdateCustomerData({ deliveryType: 'delivery' })}
              className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between gap-2 ${
                customerData.deliveryType === 'delivery'
                  ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">Delivery a Domicilio</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Directo a tu casa en Ilo por motorizado
                </p>
              </div>
            </button>
          </div>

          {/* Formulario de Delivery */}
          {customerData.deliveryType === 'delivery' && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in">
              {/* Botón de Geolocalización */}
              <div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locating}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl font-bold text-xs transition cursor-pointer active:scale-98"
                >
                  {locating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Detectando tu ubicación...</span>
                    </>
                  ) : locSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-black">¡Ubicación sugerida añadida!</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-4 h-4 text-blue-600" />
                      <span>📍 Usar la ubicación de mi celular / computadora</span>
                    </>
                  )}
                </button>
              </div>

              {/* Zona de Delivery */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Zona de entrega en Ilo:
                </label>
                <select
                  value={customerData.deliveryZoneId}
                  onChange={(e) =>
                    onUpdateCustomerData({ deliveryZoneId: e.target.value })
                  }
                  className="w-full text-sm px-3.5 py-3 rounded-xl border border-slate-300 bg-white font-bold text-slate-800"
                >
                  {BUSINESS_CONFIG.deliveryZones
                    .filter((z) => z.id !== 'tienda')
                    .map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name} {zone.cost > 0 ? `(+S/ ${zone.cost.toFixed(2)})` : ''}
                      </option>
                    ))}
                </select>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Dirección exacta (Calle, Mz, Lote o Número):
                </label>
                <input
                  type="text"
                  value={customerData.address}
                  onChange={(e) => onUpdateCustomerData({ address: e.target.value })}
                  placeholder="Ej: Urb. Garibaldi Mz C Lte 8, 2do piso"
                  className="w-full text-sm px-3.5 py-3 rounded-xl border border-slate-300 bg-white font-medium"
                />
              </div>

              {/* Referencia Opcional */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Referencia de llegada (Opcional):
                </label>
                <input
                  type="text"
                  value={customerData.reference}
                  onChange={(e) => onUpdateCustomerData({ reference: e.target.value })}
                  placeholder="Ej: Frente al parque, puerta de rejas negras"
                  className="w-full text-sm px-3.5 py-3 rounded-xl border border-slate-300 bg-white font-medium"
                />
              </div>
            </div>
          )}

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
              <span>Continuar a Comprobante</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
