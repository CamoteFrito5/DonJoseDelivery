/**
 * Webhook para sincronizar pedidos con Google Sheets (Google Drive)
 */

export const GOOGLE_SHEETS_WEBHOOK_URL = ''; // Coloca aquí tu URL de Google Apps Script cuando esté lista

export async function sendOrderToGoogleSheets(order) {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    return false;
  }

  try {
    const itemsText = order.items
      .map((i) => `${i.quantity} ${i.name.toUpperCase()}`)
      .join(', ');
    const taperText = order.taperCount > 0 ? ` + ${order.taperCount} TAPER` : '';

    const payload = {
      id: order.id,
      ticketNumber: order.ticketNumber || order.id,
      description: `${itemsText}${taperText}`,
      total: order.total,
      paymentMethod: order.paymentMethod
    };

    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return true;
  } catch (error) {
    console.error('Error enviando a Google Sheets:', error);
    return false;
  }
}
