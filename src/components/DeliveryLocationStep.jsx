import React, { useState } from 'react';
import { ShoppingBag, Truck, MapPin, Compass, ArrowLeft, ArrowRight, Loader2, Check, Clock } from 'lucide-react';
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

  const pickupOptions = BUSINESS_CONFIG.pickupTimes || [
    'En 20 minutos',
    'En 30 minutos',
    'En 45 minutos',
    'En 1 hora',
    'Hora específica (indicar)'
  ];

  const currentPickupTime = customerData.pickupTime || 'En 30 minutos';
  const isCustomTime = !pickupOptions.slice(0, 4).includes(currentPickupTime);

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
        setError('No se pudo acceder a tu ubicación GPS. Puedes escribir tu dirección manualmente.');
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
    } else {
      if (!customerData.pickupTime) {
        onUpdateCustomerData({ pickupTime: 'En 30 minutos' });
      }
    }
    setError('');
    onNext();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-black text-amber-600 uppercase tracking-widest block mb-1">
            Paso 3 de 4 • Modalidad de Entrega
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            ¿Cómo deseas recibir tu comida?
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Puedes separar tu pedido para recogerlo calientito en el local o pedir delivery a domicilio en Ilo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Opciones de Modalidad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Modalidad 1: Separar para llevar */}
            <button
              type="button"
              onClick={() =>
                onUpdateCustomerData({
                  deliveryType: 'tienda',
                  pickupTime: customerData.pickupTime || 'En 30 minutos'
                })
              }
              className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between gap-3 cursor-pointer ${
                customerData.deliveryType === 'tienda'
                  ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">
                  Separar pedido para llevar
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Recoges en tienda a la hora que tú elijas. Sin costo de delivery.
                </p>
              </div>
            </button>

            {/* Modalidad 2: Delivery */}
            <button
              type="button"
              onClick={() => onUpdateCustomerData({ deliveryType: 'delivery' })}
              className={`p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between gap-3 cursor-pointer ${
                customerData.deliveryType === 'delivery'
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">Delivery a Domicilio</h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Directo a tu puerta en Ilo por motorizado.
                </p>
              </div>
            </button>
          </div>

          {/* Sub-formulario si elige Separar para llevar */}
          {customerData.deliveryType === 'tienda' && (
            <div className="p-4 sm:p-5 bg-amber-50/40 rounded-2xl border border-amber-200 space-y-4 animate-in fade-in">
              <div className="flex items-start gap-2.5 text-xs text-amber-950 font-medium">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Dirección del Local de Don José:</p>
                  <p className="text-slate-600">{BUSINESS_CONFIG.address}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>¿A qué hora aproximada pasarás a recogerlo?</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['En 20 minutos', 'En 30 minutos', 'En 45 minutos', 'En 1 hora'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onUpdateCustomerData({ pickupTime: option })}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition text-center border cursor-pointer ${
                        currentPickupTime === option
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className="mt-2.5">
                  <input
                    type="text"
                    value={isCustomTime ? currentPickupTime : ''}
                    onChange={(e) => onUpdateCustomerData({ pickupTime: e.target.value })}
                    placeholder="O escribe una hora exacta (Ej: A las 8:30 PM)"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Tus platos se prepararán para que estén calientes y listos en la barra a esa hora.
                </p>
              </div>
            </div>
          )}

          {/* Sub-formulario si elige Delivery a Domicilio */}
          {customerData.deliveryType === 'delivery' && (
            <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in">
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
                      <span>Detectando tu ubicación GPS...</span>
                    </>
                  ) : locSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-black">¡Ubicación sugerida añadida!</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-4 h-4 text-blue-600" />
                      <span>📍 Usar la ubicación GPS de mi dispositivo</span>
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
