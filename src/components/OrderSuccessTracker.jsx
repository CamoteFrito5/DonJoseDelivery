import React, { useState, useEffect } from 'react';
import { Clock, ChefHat, Bike, CheckCheck, RefreshCw, FileText, ShoppingBag, MessageCircle, ShieldCheck, Zap } from 'lucide-react';
import { generateWhatsAppLink } from '../services/whatsappService';
import { BUSINESS_CONFIG } from '../data/products';
import { getOrderById } from '../services/orderStorage';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import ReceiptTicket from './ReceiptTicket';

export default function OrderSuccessTracker({ initialOrder, onNewOrder, minutesLeft = 240 }) {
  const [order, setOrder] = useState(initialOrder);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString('es-PE'));

  // Consulta el estado actualizado del pedido
  const refreshStatus = () => {
    const updated = getOrderById(order.id);
    if (updated) {
      setOrder(updated);
      setLastRefreshed(new Date().toLocaleTimeString('es-PE'));
    }
  };

  // 1. Polling de respaldo cada 3 segundos
  useEffect(() => {
    const interval = setInterval(refreshStatus, 3000);
    return () => clearInterval(interval);
  }, [order.id]);

  // 2. Suscripción en Tiempo Real con Supabase WebSockets (si está configurado)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel(`order-status-${order.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${order.id}`
        },
        (payload) => {
          if (payload.new) {
            setOrder((prev) => ({
              ...prev,
              status: payload.new.status,
              ticketNumber: payload.new.ticket_number
            }));
            setLastRefreshed(new Date().toLocaleTimeString('es-PE'));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order.id]);

  const whatsappUrl = generateWhatsAppLink(order, BUSINESS_CONFIG);

  // 4 Niveles de Estado en Vivo
  const statusLevels = [
    {
      key: 'PENDIENTE',
      label: '1. Recibido',
      title: 'Pedido Recibido',
      icon: Clock,
      desc: 'Tu pedido está registrado en el sistema de Don José. En breve comenzará su preparación.'
    },
    {
      key: 'EN PROCESO',
      label: '2. En Cocina',
      title: '¡En Preparación!',
      icon: ChefHat,
      desc: 'Tus parrilladas y pollos a la brasa están en el fuego y siendo empaquetados.'
    },
    {
      key: 'EN CAMINO',
      label: '3. En Camino',
      title: 'Repartidor en Ruta',
      icon: Bike,
      desc: 'El repartidor ya salió del local de Don José hacia tu dirección en Ilo.'
    },
    {
      key: 'RECIBIDO',
      label: '4. Entregado',
      title: '¡Pedido Entregado!',
      icon: CheckCheck,
      desc: 'Tu comida fue entregada con éxito. ¡Muchas gracias por tu compra en Don José!'
    }
  ];

  const currentLevelIndex = Math.max(
    0,
    statusLevels.findIndex((s) => s.key === (order.status || 'PENDIENTE'))
  );
  const activeStatus = statusLevels[currentLevelIndex];

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      {/* Banner de Persistencia de 4 Horas */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Seguimiento Activo:</strong> Puedes cerrar o recargar esta página; tu pedido permanecerá visible aquí por <strong>4 horas</strong>.
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg text-center space-y-6">
        {/* Cabecera */}
        <div>
          <span className="text-xs font-mono font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            Código de Orden: #{order.id}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Seguimiento de tu Pedido
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Cliente: <strong>{order.fullName}</strong> • Registrado a las {order.createdAt}
          </p>
        </div>

        {/* Botón Destacado para Enviar Comanda a WhatsApp */}
        <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 space-y-2.5 text-center">
          <div className="flex items-center justify-center gap-2 text-emerald-950 font-black text-sm">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <span>Notificar a Don José por WhatsApp</span>
          </div>
          <p className="text-xs text-emerald-800 font-medium max-w-sm mx-auto">
            Haz clic en el botón verde para abrir WhatsApp y enviar la comanda completa a Don José (<strong>+51 960 447 032</strong>):
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-md transition active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Enviar Detalle a WhatsApp (+51 960 447 032)</span>
          </a>
        </div>

        {/* TARJETA DE ESTADO EN VIVO DESTACADA */}
        <div className="p-5 bg-gradient-to-b from-slate-50 to-slate-100 rounded-3xl border-2 border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Estado en tiempo real:</span>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
              {isSupabaseConfigured ? (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Realtime Supabase Conectado</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Actualizado {lastRefreshed}</span>
                </>
              )}
            </div>
          </div>

          {/* Icono animado del estado actual */}
          <div className="py-2">
            <div className="w-16 h-16 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-md ring-4 ring-amber-200 animate-bounce">
              {React.createElement(activeStatus.icon, { className: 'w-8 h-8' })}
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-2">{activeStatus.title}</h3>
            <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed font-medium">
              {activeStatus.desc}
            </p>
          </div>

          {/* Barra de progreso de los 4 pasos */}
          <div className="grid grid-cols-4 gap-1 pt-2">
            {statusLevels.map((lvl, idx) => {
              const Icon = lvl.icon;
              const isPastOrCurrent = idx <= currentLevelIndex;
              const isCurrent = idx === currentLevelIndex;

              return (
                <div key={lvl.key} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-200 font-black shadow'
                        : isPastOrCurrent
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-bold ${
                      isCurrent ? 'text-amber-900 font-black' : isPastOrCurrent ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {lvl.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumen del Pedido */}
        <div className="text-left bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-bold">Entrega:</span>
            <span className="font-bold text-slate-900">
              {order.deliveryType === 'tienda' ? 'Recojo en Local Don José' : `Delivery (${order.address || order.deliveryZoneName})`}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-bold">Método de Pago:</span>
            <span className="font-bold text-purple-700">
              {order.paymentMethod === 'YAPE' ? 'Yape a Don José' : `Efectivo contra entrega ${order.cashWith ? `(Paga con S/ ${order.cashWith})` : ''}`}
            </span>
          </div>
          <div className="flex justify-between pt-1 text-sm font-black">
            <span className="text-slate-700">Total a Pagar:</span>
            <span className="text-amber-800 text-base">S/ {order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Ver Recibo Digital (Si lo solicitó) */}
        {order.wantsReceipt && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowReceipt(!showReceipt)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-600" />
              <span>{showReceipt ? 'Ocultar Recibo Digital' : 'Ver Recibo Digital (Nota de Pedido R101)'}</span>
            </button>

            {showReceipt && (
              <div className="pt-3 animate-in fade-in">
                <ReceiptTicket order={order} />
              </div>
            )}
          </div>
        )}

        {/* Botón Hacer Otro Pedido */}
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={onNewOrder}
            className="flex items-center justify-center gap-1.5 mx-auto text-xs font-bold text-slate-400 hover:text-slate-700 transition py-1 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Hacer un nuevo pedido (cerrar seguimiento actual)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
