import React, { useState, useEffect, useMemo } from 'react';
import { Search, ShoppingBag, ArrowRight, Utensils, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import Header from './components/Header';
import StepBar from './components/StepBar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CustomerInfoStep from './components/CustomerInfoStep';
import DeliveryLocationStep from './components/DeliveryLocationStep';
import ReceiptPaymentStep from './components/ReceiptPaymentStep';
import OrderSuccessTracker from './components/OrderSuccessTracker';
import AdminOrdersModal from './components/AdminOrdersModal';

import { CATEGORIES, BUSINESS_CONFIG } from './data/products';
import { getStoredCatalog } from './services/productStorage';
import {
  saveOrderLocally,
  getActiveOrderSession,
  clearActiveOrderSession
} from './services/orderStorage';
import { sendOrderToGoogleSheets } from './services/googleSheetsWebhook';
import { generateWhatsAppLink } from './services/whatsappService';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Catálogo dinámico (con soporte de platos editados / agotados)
  const [catalog, setCatalog] = useState(() => getStoredCatalog());

  // Carrito de compras: { [productId]: quantity }
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Paso 2: Datos de Contacto
  const [customerData, setCustomerData] = useState({
    fullName: '',
    phone: '',
    deliveryType: 'tienda', // 'tienda' | 'delivery'
    deliveryZoneId: 'nuevo-ilo',
    address: '',
    reference: '',
    pickupTime: 'En 30 minutos'
  });

  // Paso 4: Pago y Comprobante (100% opcional el recibo y DNI)
  const [paymentData, setPaymentData] = useState({
    dni: '',
    wantsReceipt: false,
    paymentMethod: 'YAPE', // 'YAPE' | 'EFECTIVO'
    cashWith: ''
  });

  // Pedido confirmado para el rastreador en vivo
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [activeSessionInfo, setActiveSessionInfo] = useState(null);

  // PERSISTENCIA DE 4 HORAS AL CARGAR O RECARGAR LA PÁGINA
  useEffect(() => {
    const active = getActiveOrderSession();
    if (active && active.order) {
      setConfirmedOrder(active.order);
      setActiveSessionInfo(active);
      setCurrentStep(5); // Lleva directo a la pantalla de seguimiento en vivo
    }
  }, []);

  const refreshCatalogFromStorage = () => {
    setCatalog(getStoredCatalog());
  };

  // Lista detallada de ítems en el carrito
  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const prod = catalog.find((p) => p.id === id);
        return {
          ...prod,
          quantity: qty
        };
      })
      .filter((item) => item.id);
  }, [cart, catalog]);

  const totalCartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  const subtotalFood = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  // Cálculo de Táperes y Bolsa
  const taperCount = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      if (item.requiresTaper) {
        return acc + (item.taperCount || 1) * item.quantity;
      }
      return acc;
    }, 0);
  }, [cartItems]);

  const taperCost = taperCount * BUSINESS_CONFIG.packaging.taperPrice;
  const bagCost = cartItems.length > 0 ? BUSINESS_CONFIG.packaging.bagPrice : 0;

  // Costo de Delivery
  const selectedZone = useMemo(() => {
    return (
      BUSINESS_CONFIG.deliveryZones.find((z) => z.id === customerData.deliveryZoneId) ||
      BUSINESS_CONFIG.deliveryZones[0]
    );
  }, [customerData.deliveryZoneId]);

  const deliveryCost = customerData.deliveryType === 'tienda' ? 0 : selectedZone.cost;
  const grandTotal = subtotalFood + taperCost + bagCost + deliveryCost;

  const orderCalculations = {
    subtotal: subtotalFood,
    taperCount,
    taperCost,
    bagCost,
    deliveryCost,
    deliveryZoneName: selectedZone.name,
    total: grandTotal
  };

  // Manejo de cantidades en el carrito
  const handleUpdateQty = (productId, newQty) => {
    setCart((prev) => {
      const next = { ...prev };
      if (newQty <= 0) {
        delete next[productId];
      } else {
        next[productId] = newQty;
      }
      return next;
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  // Filtrado de productos para el catálogo
  const filteredProducts = useMemo(() => {
    return catalog.filter((product) => {
      const matchesCategory =
        selectedCategory === 'todos' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [catalog, selectedCategory, searchQuery]);

  // Navegación
  const handleStartCheckout = () => {
    if (cartItems.length === 0) {
      alert('Tu carrito está vacío. Agrega al menos un plato o bebida.');
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishOrder = () => {
    const randomCorrelative = Math.floor(100000 + Math.random() * 900000);
    const orderId = `DJ-${randomCorrelative.toString().slice(-4)}`;
    const receiptCode = `R101-${randomCorrelative.toString().padStart(8, '0')}`;

    const newOrder = {
      id: orderId,
      receiptCode,
      createdAt: new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' }),
      status: 'PENDIENTE',
      ticketNumber: '',
      fullName: customerData.fullName,
      phone: customerData.phone,
      deliveryType: customerData.deliveryType,
      pickupTime: customerData.deliveryType === 'tienda' ? (customerData.pickupTime || 'En 30 minutos') : '',
      deliveryZoneId: customerData.deliveryZoneId,
      deliveryZoneName: selectedZone.name,
      address: customerData.address,
      reference: customerData.reference,
      wantsReceipt: paymentData.wantsReceipt,
      dni: paymentData.wantsReceipt ? (paymentData.dni || '11111111') : 'VARIOS',
      paymentMethod: paymentData.paymentMethod,
      cashWith: paymentData.cashWith,
      items: cartItems,
      subtotal: subtotalFood,
      taperCount,
      taperCost,
      bagCost,
      deliveryCost,
      total: grandTotal
    };

    // Guardar en almacenamiento y registrar sesión de 4 horas
    saveOrderLocally(newOrder);
    sendOrderToGoogleSheets(newOrder);

    // Abrir automáticamente WhatsApp con la comanda para el administrador
    try {
      const whatsappUrl = generateWhatsAppLink(newOrder, BUSINESS_CONFIG);
      window.open(whatsappUrl, '_blank');
    } catch (e) {
      console.warn('No se pudo abrir WhatsApp automáticamente:', e);
    }

    setConfirmedOrder(newOrder);
    setActiveSessionInfo({ order: newOrder, minutesLeft: 240 });
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewOrder = () => {
    clearActiveOrderSession();
    setCart({});
    setConfirmedOrder(null);
    setActiveSessionInfo(null);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans pb-28 md:pb-12">
      {/* Cabecera */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        currentStep={currentStep}
      />

      {/* Indicador de Pasos */}
      <StepBar currentStep={currentStep} onStepClick={(step) => setCurrentStep(step)} />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4">
        {/* ================= PASO 1: CATÁLOGO ================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Banner de Bienvenida */}
            <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-slate-950 shadow-md">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-1.5 bg-slate-950 text-amber-400 text-xs font-black px-3 py-1 rounded-full mb-3 shadow-xs">
                  <Utensils className="w-3.5 h-3.5" />
                  Parrilladas y Pollería Don José • Ilo
                </span>
                <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                  Haz tu pedido directo sin llamadas ni demoras.
                </h2>
                <p className="text-amber-100 text-sm sm:text-base font-medium mt-2">
                  Pollos a la brasa, parrilladas jugosas y platos criollos en Ilo. Escoge tus platos y sigue tu orden en tiempo real.
                </p>
              </div>
            </div>

            {/* Barra de Búsqueda Grande */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="¿Qué se te antoja hoy? (Pollo a la brasa, Parrillada, Costillar, Lomo...)"
                className="w-full pl-12 pr-4 py-3.5 bg-white text-base font-semibold rounded-2xl border border-slate-200 shadow-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs bg-slate-200 hover:bg-slate-300 font-bold px-2 py-1 rounded-md text-slate-700 cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Selector de Categorías */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-2xs cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Cuadrícula de Platos */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
                <p className="text-base font-bold text-slate-700">
                  No encontramos platos con "{searchQuery}"
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('todos');
                  }}
                  className="mt-3 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl cursor-pointer"
                >
                  Ver toda la carta
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    inCartQty={cart[product.id] || 0}
                    onUpdateQty={handleUpdateQty}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= PASO 2: NOMBRE Y TELÉFONO ================= */}
        {currentStep === 2 && (
          <CustomerInfoStep
            customerData={customerData}
            onUpdateCustomerData={(newData) =>
              setCustomerData((prev) => ({ ...prev, ...newData }))
            }
            onBack={() => setCurrentStep(1)}
            onNext={() => {
              setCurrentStep(3);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* ================= PASO 3: MODALIDAD Y UBICACIÓN ================= */}
        {currentStep === 3 && (
          <DeliveryLocationStep
            customerData={customerData}
            onUpdateCustomerData={(newData) =>
              setCustomerData((prev) => ({ ...prev, ...newData }))
            }
            onBack={() => setCurrentStep(2)}
            onNext={() => {
              setCurrentStep(4);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* ================= PASO 4: COMPROBANTE Y PAGO (RECIBO Y DNI OPCIONALES) ================= */}
        {currentStep === 4 && (
          <ReceiptPaymentStep
            customerData={customerData}
            orderCalculation={orderCalculations}
            paymentData={paymentData}
            onUpdatePaymentData={(newData) =>
              setPaymentData((prev) => ({ ...prev, ...newData }))
            }
            onBack={() => setCurrentStep(3)}
            onFinishOrder={handleFinishOrder}
          />
        )}

        {/* ================= PASO 5: SEGUIMIENTO EN VIVO DENTRO DE LA APLICACIÓN ================= */}
        {currentStep === 5 && confirmedOrder && (
          <OrderSuccessTracker
            initialOrder={confirmedOrder}
            onNewOrder={handleNewOrder}
            minutesLeft={activeSessionInfo?.minutesLeft || 240}
          />
        )}
      </main>

      {/* Barra Flotante Inferior en Paso 1 */}
      {currentStep === 1 && totalCartCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-3 z-30 shadow-2xl">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-500 font-bold block">
                {totalCartCount} {totalCartCount === 1 ? 'plato seleccionado' : 'platos seleccionados'}
              </span>
              <span className="text-xl font-black text-amber-700">
                S/ {grandTotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleStartCheckout}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition active:scale-95 text-base cursor-pointer"
            >
              <span>Generar Compra</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Drawer del Carrito */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleStartCheckout}
      />

      {/* Modal del Administrador (Dashboard con contraseña y gestión de menú) */}
      <AdminOrdersModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onCatalogUpdated={refreshCatalogFromStorage}
      />
    </div>
  );
}
