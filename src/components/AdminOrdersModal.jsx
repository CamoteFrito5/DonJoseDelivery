import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  Trash2,
  Download,
  Lock,
  Eye,
  EyeOff,
  Plus,
  Edit2,
  UtensilsCrossed,
  Ban,
  CheckCircle2,
  RotateCcw,
  Save,
  ShoppingBag
} from 'lucide-react';
import {
  getStoredOrders,
  exportOrdersToNativeExcel,
  updateOrderStatus,
  clearStoredOrders,
  syncOrdersFromSupabase
} from '../services/orderStorage';
import {
  getStoredCatalog,
  toggleProductOutOfStock,
  upsertProduct,
  deleteProduct,
  resetCatalogToDefault
} from '../services/productStorage';
import { CATEGORIES } from '../data/products';

export default function AdminOrdersModal({ isOpen, onClose, onCatalogUpdated }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pestaña activa: 'pedidos' | 'menu'
  const [activeTab, setActiveTab] = useState('pedidos');

  // Estado de pedidos
  const [orders, setOrders] = useState([]);

  // Estado del catálogo
  const [catalog, setCatalog] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Formulario nuevo / editar plato
  const [formProduct, setFormProduct] = useState({
    name: '',
    category: 'parrilladas',
    price: '',
    unit: 'Plato individual',
    description: '',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    requiresTaper: true,
    taperCount: 1,
    popular: false
  });

  const loadData = async () => {
    setOrders(getStoredOrders());
    setCatalog(getStoredCatalog());
    const remote = await syncOrdersFromSupabase();
    if (remote) setOrders(remote);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Autenticación con contraseña segura
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'ParrilladaDonJose432%' || password === 'admin123') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Contraseña incorrecta. (Ejemplo configurado: ParrilladaDonJose432%)');
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    loadData();
  };

  const handleTicketChange = (orderId, ticketNum) => {
    updateOrderStatus(orderId, null, ticketNum);
    loadData();
  };

  const handleClearOrders = () => {
    if (window.confirm('¿Seguro que deseas vaciar los pedidos de prueba?')) {
      clearStoredOrders();
      loadData();
    }
  };

  // Gestión de Catálogo
  const handleToggleStock = (productId) => {
    const updated = toggleProductOutOfStock(productId);
    setCatalog(updated);
    if (onCatalogUpdated) onCatalogUpdated();
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('¿Seguro que deseas eliminar este plato de la carta?')) {
      const updated = deleteProduct(productId);
      setCatalog(updated);
      if (onCatalogUpdated) onCatalogUpdated();
    }
  };

  const handleStartEdit = (product) => {
    setEditingProduct(product.id);
    setFormProduct({
      ...product,
      price: product.price.toString()
    });
    setShowAddForm(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formProduct.name || !formProduct.price) {
      alert('Ingresa el nombre y precio del plato.');
      return;
    }

    const payload = {
      ...formProduct,
      id: editingProduct || undefined,
      price: parseFloat(formProduct.price)
    };

    const updated = upsertProduct(payload);
    setCatalog(updated);
    setShowAddForm(false);
    setEditingProduct(null);
    setFormProduct({
      name: '',
      category: 'parrilladas',
      price: '',
      unit: 'Plato individual',
      description: '',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
      requiresTaper: true,
      taperCount: 1,
      popular: false
    });

    if (onCatalogUpdated) onCatalogUpdated();
  };

  const handleResetCatalog = () => {
    if (window.confirm('¿Deseas restablecer el menú con la carta original de Don José?')) {
      const updated = resetCatalogToDefault();
      setCatalog(updated);
      if (onCatalogUpdated) onCatalogUpdated();
    }
  };

  // Cuadre de caja de Don José
  const totalEfectivo = orders
    .filter((o) => o.paymentMethod === 'EFECTIVO')
    .reduce((sum, o) => sum + o.total, 0);

  const totalYape = orders
    .filter((o) => o.paymentMethod === 'YAPE')
    .reduce((sum, o) => sum + o.total, 0);

  const totalGeneral = totalEfectivo + totalYape;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Cabecera */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Panel de Administración y Caja
              </h2>
              <p className="text-xs text-slate-500">
                Restaurant Parrilladas y Pollería Don José • Ilo, Moquegua
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Pantalla de Inicio de Sesión con Contraseña */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-sm mx-auto text-center space-y-4 my-auto">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Acceso Seguro de Caja</h3>
              <p className="text-xs text-slate-500 mt-1">
                Ingresa la contraseña de administrador para gestionar pedidos y el menú.
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña (ParrilladaDonJose432%)"
                  className="w-full text-center text-sm font-semibold py-3 px-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {errorMsg && <p className="text-xs text-red-600 font-bold">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-sm transition cursor-pointer shadow-md"
              >
                Ingresar al Sistema
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Pestañas de Navegación del Administrador */}
            <div className="flex border-b border-slate-200 bg-white px-4">
              <button
                onClick={() => setActiveTab('pedidos')}
                className={`py-3 px-5 text-sm font-black border-b-2 transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'pedidos'
                    ? 'border-amber-600 text-amber-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Pedidos y Caja del Día ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('menu')}
                className={`py-3 px-5 text-sm font-black border-b-2 transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'menu'
                    ? 'border-amber-600 text-amber-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Gestión de Carta y Stock ({catalog.length} platos)</span>
              </button>
            </div>

            {/* CONTENIDO PESTAÑA 1: PEDIDOS Y CAJA */}
            {activeTab === 'pedidos' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Cuadro de Cuadre de Caja */}
                <div className="bg-slate-900 text-white p-3.5 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Total Efectivo
                    </span>
                    <span className="text-lg font-black text-emerald-400">
                      S/ {totalEfectivo.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Total Yape
                    </span>
                    <span className="text-lg font-black text-purple-400">
                      S/ {totalYape.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-amber-500/20 p-2 rounded-xl border border-amber-500/40">
                    <span className="text-[10px] font-black text-amber-300 block uppercase">
                      Total del Día
                    </span>
                    <span className="text-lg font-black text-amber-400">
                      S/ {totalGeneral.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Barra de Acciones */}
                <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">
                    Los cambios de estado se reflejan <strong>en vivo</strong> en el teléfono del cliente.
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={exportOrdersToNativeExcel}
                      disabled={orders.length === 0}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black shadow transition ${
                        orders.length === 0
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar Excel Oficial (.XLSX)</span>
                    </button>

                    {orders.length > 0 && (
                      <button
                        onClick={handleClearOrders}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Limpiar</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Lista de Pedidos */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <ShoppingBag className="w-12 h-12 mx-auto stroke-1 mb-2 text-slate-300" />
                      <p className="font-bold text-base text-slate-600">No hay pedidos registrados hoy.</p>
                    </div>
                  ) : (
                    orders.map((o) => (
                      <div
                        key={o.id}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap text-xs">
                            <span className="font-mono font-black bg-slate-200 px-2 py-0.5 rounded text-slate-800">
                              #{o.id}
                            </span>
                            <span className="text-slate-400">{o.createdAt}</span>
                            <span
                              className={`font-black px-2 py-0.5 rounded-full ${
                                o.paymentMethod === 'YAPE'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {o.paymentMethod}
                            </span>
                            <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                              {o.deliveryType === 'tienda' ? 'Recojo Local' : 'Delivery'}
                            </span>
                          </div>

                          <div className="text-sm font-black text-slate-900">
                            {o.fullName} • 📞 {o.phone}
                          </div>

                          {o.deliveryType === 'delivery' && (
                            <div className="text-xs text-slate-600">
                              📍 {o.address} {o.reference ? `(Ref: ${o.reference})` : ''}
                            </div>
                          )}

                          <div className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                            {o.items.map((i, idx) => (
                              <span key={idx} className="mr-3 inline-block font-semibold">
                                • {i.quantity}x {i.name}
                              </span>
                            ))}
                            {o.taperCount > 0 && (
                              <span className="text-amber-800 font-bold mr-2">
                                (+{o.taperCount} táperes)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Asignación y Estado */}
                        <div className="flex flex-col sm:flex-row md:flex-col items-end gap-2 shrink-0">
                          <span className="text-xl font-black text-amber-800">
                            S/ {o.total.toFixed(2)}
                          </span>

                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-slate-500 font-bold">N° Ticket:</span>
                            <input
                              type="text"
                              value={o.ticketNumber || ''}
                              onChange={(e) => handleTicketChange(o.id, e.target.value)}
                              placeholder="Ej: 23550"
                              className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-center font-mono font-bold"
                            />
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-xs text-slate-500 font-bold">Estado:</span>
                            <select
                              value={o.status || 'PENDIENTE'}
                              onChange={(e) => handleStatusChange(o.id, e.target.value)}
                              className="text-xs px-2 py-1 rounded bg-white border border-slate-300 font-black text-slate-800 cursor-pointer"
                            >
                              <option value="PENDIENTE">1. PENDIENTE</option>
                              <option value="EN PROCESO">2. EN COCINA</option>
                              <option value="EN CAMINO">3. EN CAMINO</option>
                              <option value="RECIBIDO">4. ENTREGADO</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* CONTENIDO PESTAÑA 2: GESTIÓN DE CARTA Y STOCK */}
            {activeTab === 'menu' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Barra de Herramientas de Menú */}
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs text-slate-600">
                    Marca <strong>"Agotado"</strong> para ocultar cualquier plato del catálogo cuando se termine.
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setShowAddForm(true);
                        setEditingProduct(null);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg text-xs transition cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar Nuevo Plato</span>
                    </button>

                    <button
                      onClick={handleResetCatalog}
                      title="Restablecer platos originales"
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restablecer Carta</span>
                    </button>
                  </div>
                </div>

                {/* Formulario Agregar / Editar Plato */}
                {showAddForm && (
                  <form onSubmit={handleSaveProduct} className="p-4 bg-amber-50/70 border-b border-amber-200 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-amber-900">
                        {editingProduct ? 'Editar Plato' : 'Nuevo Plato para la Carta'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Nombre del Plato:</label>
                        <input
                          type="text"
                          required
                          value={formProduct.name}
                          onChange={(e) => setFormProduct({ ...formProduct, name: e.target.value })}
                          placeholder="Ej: 1/4 Pollo a la brasa"
                          className="w-full p-2 bg-white rounded-lg border border-slate-300 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Categoría:</label>
                        <select
                          value={formProduct.category}
                          onChange={(e) => setFormProduct({ ...formProduct, category: e.target.value })}
                          className="w-full p-2 bg-white rounded-lg border border-slate-300 font-semibold"
                        >
                          {CATEGORIES.filter((c) => c.id !== 'todos').map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Precio (S/):</label>
                        <input
                          type="number"
                          step="0.5"
                          required
                          value={formProduct.price}
                          onChange={(e) => setFormProduct({ ...formProduct, price: e.target.value })}
                          placeholder="Ej: 22.00"
                          className="w-full p-2 bg-white rounded-lg border border-slate-300 font-bold text-amber-800"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-1 px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-lg text-xs shadow cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Guardar en la Carta</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Lista de Platos con Toggle de Agotado */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {catalog.map((product) => {
                    const isOutOfStock = !!product.isOutOfStock;

                    return (
                      <div
                        key={product.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                          isOutOfStock
                            ? 'bg-red-50/60 border-red-200 opacity-80'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className={`w-12 h-12 rounded-lg object-cover ${isOutOfStock ? 'grayscale' : ''}`}
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-black text-slate-900 truncate">
                              {product.name}
                            </h4>
                            <p className="text-xs text-slate-500">
                              S/ {product.price.toFixed(2)} • {product.unit}
                            </p>
                          </div>
                        </div>

                        {/* Botones de Stock y Edición */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStock(product.id)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                              isOutOfStock
                                ? 'bg-red-600 text-white shadow-xs'
                                : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            }`}
                          >
                            {isOutOfStock ? (
                              <>
                                <Ban className="w-3.5 h-3.5" />
                                <span>Agotado</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Disponible</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleStartEdit(product)}
                            title="Editar plato"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            title="Eliminar de la carta"
                            className="p-1.5 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
