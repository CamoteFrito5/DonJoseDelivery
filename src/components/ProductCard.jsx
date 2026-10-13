import React, { useState } from 'react';
import { Plus, Minus, Check, Ban } from 'lucide-react';

export default function ProductCard({ product, inCartQty, onUpdateQty }) {
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = !!product.isOutOfStock;

  const handleAddOne = () => {
    if (isOutOfStock) return;
    onUpdateQty(product.id, inCartQty + 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  const handleMinusOne = () => {
    if (inCartQty > 0) {
      onUpdateQty(product.id, inCartQty - 1);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border transition flex flex-col justify-between overflow-hidden shadow-sm ${
      isOutOfStock ? 'opacity-70 border-slate-300' : 'border-slate-200 hover:shadow-md'
    }`}>
      {/* Imagen y Badges */}
      <div className="relative bg-slate-100 aspect-4/3 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition duration-300 ${
            isOutOfStock ? 'grayscale contrast-75' : ''
          }`}
          loading="lazy"
        />

        {isOutOfStock ? (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider flex items-center gap-1">
              <Ban className="w-3.5 h-3.5" />
              Agotado por hoy
            </span>
          </div>
        ) : product.popular ? (
          <span className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-md shadow">
            ⭐ Más pedido
          </span>
        ) : null}
      </div>

      {/* Contenido */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
            {product.unit}
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug mt-0.5">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Precio y Controles */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-slate-400 font-bold block">Precio:</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              S/ {product.price.toFixed(2)}
            </span>
          </div>

          {/* Selector de cantidad o botón Agotado */}
          {isOutOfStock ? (
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-2 rounded-xl">
              No disponible
            </span>
          ) : inCartQty === 0 ? (
            <button
              onClick={handleAddOne}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 rounded-xl text-sm transition active:scale-95 shadow cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Pedir</span>
            </button>
          ) : (
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 gap-1">
              <button
                onClick={handleMinusOne}
                aria-label="Disminuir"
                className="w-8 h-8 flex items-center justify-center bg-white hover:bg-red-50 text-slate-800 hover:text-red-600 rounded-lg font-bold shadow-xs transition cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              <span className="w-6 text-center font-black text-base text-slate-900">
                {inCartQty}
              </span>
              <button
                onClick={handleAddOne}
                aria-label="Aumentar"
                className="w-8 h-8 flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-bold shadow-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
