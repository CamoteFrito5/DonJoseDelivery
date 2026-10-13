import * as XLSX from 'xlsx';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEY = 'donjose_pedidos_v2';
const ACTIVE_SESSION_KEY = 'donjose_active_order_session';
const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

export async function saveOrderLocally(order) {
  try {
    const existing = getStoredOrders();
    const updated = [order, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    setActiveOrderSession(order.id);

    // Si Supabase está configurado, guardar en PostgreSQL en la nube
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('orders').insert({
          id: order.id,
          status: order.status || 'PENDIENTE',
          ticket_number: order.ticketNumber || '',
          full_name: order.fullName,
          phone: order.phone,
          delivery_type: order.deliveryType,
          delivery_zone_name: order.deliveryZoneName || '',
          address: order.address || '',
          reference: order.reference || '',
          wants_receipt: !!order.wantsReceipt,
          dni: order.dni || '11111111',
          payment_method: order.paymentMethod,
          cash_with: order.cashWith || '',
          items: order.items,
          subtotal: order.subtotal,
          taper_count: order.taperCount,
          taper_cost: order.taperCost,
          bag_cost: order.bagCost,
          delivery_cost: order.deliveryCost,
          total: order.total
        });
      } catch (err) {
        console.warn('Advertencia guardando en Supabase:', err);
      }
    }

    return true;
  } catch (error) {
    console.error('Error guardando pedido:', error);
    return false;
  }
}

export function setActiveOrderSession(orderId) {
  try {
    const session = {
      orderId,
      createdAt: Date.now()
    };
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Error guardando sesión de pedido:', e);
  }
}

export function getActiveOrderSession() {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);
    const elapsed = Date.now() - session.createdAt;

    if (elapsed < FOUR_HOURS_MS) {
      const order = getOrderById(session.orderId);
      if (order) {
        return {
          order,
          minutesLeft: Math.round((FOUR_HOURS_MS - elapsed) / (1000 * 60)),
          createdAt: session.createdAt
        };
      }
    } else {
      clearActiveOrderSession();
    }
    return null;
  } catch (e) {
    console.error('Error leyendo sesión de pedido:', e);
    return null;
  }
}

export function clearActiveOrderSession() {
  localStorage.removeItem(ACTIVE_SESSION_KEY);
}

export function getStoredOrders() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error leyendo pedidos:', error);
    return [];
  }
}

export function getOrderById(orderId) {
  const orders = getStoredOrders();
  return orders.find((o) => o.id === orderId) || null;
}

export async function updateOrderStatus(orderId, newStatus, ticketNumber = null) {
  try {
    const orders = getStoredOrders();
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus !== null ? newStatus : o.status,
          ticketNumber: ticketNumber !== null ? ticketNumber : o.ticketNumber
        };
      }
      return o;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Actualizar en Supabase si está disponible
    if (isSupabaseConfigured && supabase) {
      try {
        const patch = {};
        if (newStatus !== null) patch.status = newStatus;
        if (ticketNumber !== null) patch.ticket_number = ticketNumber;

        await supabase.from('orders').update(patch).eq('id', orderId);
      } catch (err) {
        console.warn('Error actualizando en Supabase:', err);
      }
    }

    return true;
  } catch (error) {
    console.error('Error actualizando pedido:', error);
    return false;
  }
}

export function clearStoredOrders() {
  localStorage.removeItem(STORAGE_KEY);
  clearActiveOrderSession();
}

/**
 * Carga pedidos remotos desde Supabase y los sincroniza con LocalStorage
 */
export async function syncOrdersFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return getStoredOrders();

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const mapped = data.map((d) => ({
        id: d.id,
        createdAt: new Date(d.created_at).toLocaleString('es-PE', { timeZone: 'America/Lima' }),
        status: d.status,
        ticketNumber: d.ticket_number || '',
        fullName: d.full_name,
        phone: d.phone,
        deliveryType: d.delivery_type,
        deliveryZoneName: d.delivery_zone_name,
        address: d.address,
        reference: d.reference,
        wantsReceipt: d.wants_receipt,
        dni: d.dni,
        paymentMethod: d.payment_method,
        cashWith: d.cash_with,
        items: d.items,
        subtotal: Number(d.subtotal),
        taperCount: d.taper_count,
        taperCost: Number(d.taper_cost),
        bagCost: Number(d.bag_cost),
        deliveryCost: Number(d.delivery_cost),
        total: Number(d.total)
      }));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
      return mapped;
    }
  } catch (e) {
    console.warn('No se pudo sincronizar pedidos desde Supabase:', e);
  }

  return getStoredOrders();
}

/**
 * Exportación directa a Microsoft Excel (.xlsx) con la planilla de Don José
 */
export function exportOrdersToNativeExcel() {
  const orders = getStoredOrders();
  if (orders.length === 0) {
    alert('No hay pedidos registrados para exportar.');
    return;
  }

  const dataRows = orders.map((o, index) => {
    const itemsText = (o.items || [])
      .map((i) => `${i.quantity} ${i.name.toUpperCase()}`)
      .join(', ');
    const taperText = o.taperCount > 0 ? ` + ${o.taperCount} TAPER` : '';

    return {
      'N° de tiket': o.ticketNumber || o.id,
      'N°': index + 1,
      'DESCRIPCION': `${itemsText}${taperText}`,
      'MONTO': Number(o.total.toFixed(2)),
      'EFECTIVO/YAPE': o.paymentMethod === 'YAPE' ? 'YAPE' : 'EFECTIVO'
    };
  });

  const totalEfectivo = orders
    .filter((o) => o.paymentMethod === 'EFECTIVO')
    .reduce((sum, o) => sum + o.total, 0);

  const totalYape = orders
    .filter((o) => o.paymentMethod === 'YAPE')
    .reduce((sum, o) => sum + o.total, 0);

  const totalGeneral = totalEfectivo + totalYape;

  const ws = XLSX.utils.json_to_sheet(dataRows);

  const summaryStartRow = dataRows.length + 3;
  XLSX.utils.sheet_add_aoa(
    ws,
    [
      ['', '', 'CUADRE DE CAJA DEL DÍA', ''],
      ['', '', 'TOTAL EN EFECTIVO', totalEfectivo],
      ['', '', 'TOTAL EN YAPE', totalYape],
      ['', '', 'TOTAL GENERAL', totalGeneral]
    ],
    { origin: `A${summaryStartRow}` }
  );

  ws['!cols'] = [
    { wch: 14 },
    { wch: 6 },
    { wch: 45 },
    { wch: 14 },
    { wch: 16 }
  ];

  const wb = XLSX.utils.book_new();
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.utils.book_append_sheet(wb, ws, `Ventas_${dateStr}`);

  XLSX.writeFile(wb, `Ventas_DonJose_${dateStr}.xlsx`);
}
