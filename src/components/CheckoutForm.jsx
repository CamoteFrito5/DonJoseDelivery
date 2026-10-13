import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, MapPin, Store, Truck, ShieldCheck, AlertCircle } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/products';

export default function CheckoutForm({
  cartItems,
  customerData,
  onUpdateCustomerData,
  onBackToCatalog,
  onProceedToPayment
}) {
  const [errors, setErrors] = useState({});

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const selectedZone =
    BUSINESS_CONFIG.deliveryZones.find((z) => z.id === customerData.deliveryZoneId) ||
    BUSINESS_CONFIG.deliveryZones[0];

  const deliveryCost = customerData.deliveryType === 'tienda' ? 0 : selectedZone.cost;
  const total = subtotal + deliveryCost;

  const validate = () => {
    const newErrors = {};

    // Validación DNI (8 dígitos peruanos)
    if (!customerData.dni || !/^\d{8}$/.test(customerData.dni.trim())) {
      newErrors.dni = 'Ingresa un DNI válido de 8 dígitos.';
    }

    // Validación Nombre
    if (!customerData.fullName || customerData.fullName.trim().length < 3) {
      newErrors.fullName = 'Ingresa tu nombre y apellido completo.';
    }

    // Validación Teléfono (9 dígitos peruanos)
    if (!customerData.phone || !/^\d{9}$/.test(customerData.phone.trim())) {
      newErrors.phone = 'Ingresa un número de celular de 9 dígitos.';
    }

    // Validación Dirección si es Delivery
    if (customerData.deliveryType === 'delivery') {
      if (!customerData.address || customerData.address.trim().length < 5) {
        newErrors.address = 'Ingresa tu dirección exacta de entrega en Ilo.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onProceedToPayment({
        ...customerData,
        deliveryZoneName: selectedZone.name,
        deliveryCost,
        subtotal,
        total
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Paso 2: Datos de Identificación y Entrega
            </h2>
            <p className="text-xs text-slate-500">
              Esta información identificará tu pedido al registrarlo en el sistema de Don José.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* DNI */}
          <div>
            <label className="block text-sm font-black text-slate-800 mb-1">
              DNI del Cliente <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              maxLength={8}
              value={customerData.dni}
              onChange={(e) =>
                onUpdateCustomerData({ dni: e.target.value.replace(/\D/g, '') })
              }
              placeholder="Ejemplo: 04412345"
              className={`w-full text-base px-4 py-3 rounded-xl border ${
                errors.dni ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
              } focus:ring-2 focus:ring-amber-500 font-mono`}
            />
            {errors.dni && (
              <p className="text-xs text-red-600 font-bold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.dni}
              </p>
            )}
          </div>

          {/* Nombre Completo */}
          <div>
            <label className="block text-sm font-black text-slate-800 mb-1">
              Nombre Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customerData.fullName}
              onChange={(e) => onUpdateCustomerData({ fullName: e.target.value })}
              placeholder="Ejemplo: Juan Pérez Gómez"
              className={`w-full text-base px-4 py-3 rounded-xl border ${
                errors.fullName ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
              } focus:ring-2 focus:ring-amber-500`}
            />
            {errors.fullName && (
              <p className="text-xs text-red-600 font-bold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Teléfono / WhatsApp */}
          <div>
            <label className="block text-sm font-black text-slate-800 mb-1">
              Teléfono Celular (WhatsApp) <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              maxLength={9}
              value={customerData.phone}
              onChange={(e) =>
                onUpdateCustomerData({ phone: e.target.value.replace(/\D/g, '') })
              }
              placeholder="Ejemplo: 953123456"
              className={`w-full text-base px-4 py-3 rounded-xl border ${
                errors.phone ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
              } focus:ring-2 focus:ring-amber-500 font-mono`}
            />
            {errors.phone && (
              <p className="text-xs text-red-600 font-bold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Tipo de Entrega */}
          <div>
            <label className="block text-sm font-black text-slate-800 mb-2">
              Modalidad de Entrega <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${
                  customerData.deliveryType === 'tienda'
                    ? 'border-amber-500 bg-amber-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryType"
                  value="tienda"
                  checked={customerData.deliveryType === 'tienda'}
                  onChange={() => onUpdateCustomerData({ deliveryType: 'tienda' })}
                  className="w-4 h-4 text-amber-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm">
                    <Store className="w-4 h-4 text-amber-700" />
                    <span>Recojo en Tienda</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Calle Mirave 450 (Gratis)</p>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${
                  customerData.deliveryType === 'delivery'
                    ? 'border-amber-500 bg-amber-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryType"
                  value="delivery"
                  checked={customerData.deliveryType === 'delivery'}
                  onChange={() => onUpdateCustomerData({ deliveryType: 'delivery' })}
                  className="w-4 h-4 text-amber-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm">
                    <Truck className="w-4 h-4 text-amber-700" />
                    <span>Delivery a Domicilio</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">En la ciudad de Ilo</p>
                </div>
              </label>
            </div>
          </div>

          {/* Opciones de Delivery si aplica */}
          {customerData.deliveryType === 'delivery' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Zona de Entrega en Ilo:
                </label>
                <select
                  value={customerData.deliveryZoneId}
                  onChange={(e) =>
                    onUpdateCustomerData({ deliveryZoneId: e.target.value })
                  }
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  {BUSINESS_CONFIG.deliveryZones
                    .filter((z) => z.id !== 'tienda')
                    .map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name} (+S/ {zone.cost.toFixed(2)})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Dirección exacta (Calle, Mz, Lote o Número): <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerData.address}
                  onChange={(e) => onUpdateCustomerData({ address: e.target.value })}
                  placeholder="Ej: Urb. Garibaldi Mz B Lte 12"
                  className={`w-full text-sm px-3 py-2.5 rounded-lg border ${
                    errors.address ? 'border-red-500 bg-red-50/30' : 'border-slate-300'
                  } bg-white`}
                />
                {errors.address && (
                  <p className="text-xs text-red-600 font-bold mt-1">
                    {errors.address}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Referencia de ubicación (Opcional):
                </label>
                <input
                  type="text"
                  value={customerData.reference}
                  onChange={(e) => onUpdateCustomerData({ reference: e.target.value })}
                  placeholder="Ej: Frente al parque, casa de rejas verdes"
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>
          )}

          {/* Notas adicionales */}
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">
              Indicaciones adicionales o comentarios para Don José (Opcional):
            </label>
            <input
              type="text"
              value={customerData.notes}
              onChange={(e) => onUpdateCustomerData({ notes: e.target.value })}
              placeholder="Ej: Si no hay Primor, cambiar por Cocinero"
              className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300"
            />
          </div>

          {/* Resumen del Total */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex justify-between text-sm text-slate-700">
              <span>Subtotal productos:</span>
              <span className="font-bold">S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-700 mt-1">
              <span>Costo de envío:</span>
              <span className="font-bold">
                {deliveryCost === 0 ? 'Gratis' : `S/ ${deliveryCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-lg font-black text-slate-900 mt-2 pt-2 border-t border-amber-200">
              <span>Total a Pagar:</span>
              <span className="text-amber-800 text-2xl font-black">
                S/ {total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Botones de Navegación */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onBackToCatalog}
              className="sm:w-1/3 flex items-center justify-center gap-1.5 px-4 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-sm transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Modificar Catálogo</span>
            </button>

            <button
              type="submit"
              className="sm:w-2/3 flex items-center justify-center gap-2 px-4 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-base shadow-md transition active:scale-98 cursor-pointer"
            >
              <span>Ir al Paso 3: Pagar con Yape</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
