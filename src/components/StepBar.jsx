import React from 'react';
import { ShoppingBag, User, MapPin, FileText, CheckCircle2 } from 'lucide-react';

export default function StepBar({ currentStep, onStepClick }) {
  const steps = [
    { number: 1, title: 'Catálogo', icon: ShoppingBag },
    { number: 2, title: 'Datos', icon: User },
    { number: 3, title: 'Entrega', icon: MapPin },
    { number: 4, title: 'Recibo', icon: FileText },
    { number: 5, title: 'Confirmado', icon: CheckCircle2 }
  ];

  return (
    <div className="bg-white border-b border-slate-200 py-3 px-4 shadow-2xs">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {steps.map((s, index) => {
          const Icon = s.icon;
          const isActive = currentStep === s.number;
          const isDone = currentStep > s.number;

          return (
            <React.Fragment key={s.number}>
              <button
                type="button"
                disabled={s.number > currentStep}
                onClick={() => onStepClick && s.number < currentStep && onStepClick(s.number)}
                className={`flex flex-col items-center gap-1 transition ${
                  s.number < currentStep ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isActive
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-200 shadow'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-bold ${
                    isActive ? 'text-slate-900 font-black' : isDone ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {s.title}
                </span>
              </button>

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-1 sm:mx-2 rounded transition-colors ${
                    currentStep > index + 1 ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
