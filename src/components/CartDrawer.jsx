import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onClearCart,
  onProceedToCheckout
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Cabecera del Carrito */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-black text-slate-900">Tu Pedido</h2>
            <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
              {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <ShoppingBag className="w-16 h-16 text-slate-300 stroke-[1.5] mb-3" />
              <p className="text-lg font-bold text-slate-700">Tu carrito está vacío</p>
              <p className="text-sm mt-1 max-w-xs text-slate-400">
                Selecciona los productos que necesitas del catálogo para armar tu pedido.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-slate-500">
                    S/ {item.price.toFixed(2)} c/u ({item.unit})
                  </p>
                  <p className="text-xs font-black text-amber-700 mt-0.5">
                    Subtotal: S/ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Control de cantidad */}
                <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 gap-1">
                  <button
                    onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pie del Carrito con Subtotal y Botón Siguiente */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-white space-y-3">
            <div className="flex justify-between items-center text-base">
              <span className="text-slate-600 font-semibold">Subtotal en productos:</span>
              <span className="text-2xl font-black text-slate-900">
                S/ {subtotal.toFixed(2)}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              * El costo de entrega se calculará en el siguiente paso según tu zona en Ilo.
            </p>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 px-4 rounded-xl text-base shadow-lg transition active:scale-98 cursor-pointer"
            >
              <span>Continuar con mis Datos (Paso 2)</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onClearCart}
              className="w-full text-xs text-red-600 hover:text-red-700 font-bold py-1 flex items-center justify-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vaciar carrito</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
