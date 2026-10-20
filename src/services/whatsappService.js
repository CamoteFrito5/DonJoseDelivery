/**
 * Formatea y genera el enlace oficial de WhatsApp con el mensaje estructurado
 * para el administrador de Restaurant Parrilladas y Pollería DON JOSÉ (+51 960 447 032).
 */
export function generateWhatsAppLink(order, businessConfig) {
  const phone = (businessConfig.adminWhatsApp || '51960447032').replace(/\D/g, '');

  const itemsList = order.items
    .map(
      (item) =>
        `• ${item.quantity}x ${item.name} — S/ ${(item.price * item.quantity).toFixed(2)}`
    )
    .join('\n');

  // Empaques
  const taperText =
    order.taperCount > 0
      ? `• ${order.taperCount}x Táper descartable — S/ ${(order.taperCost).toFixed(2)}\n`
      : '';
  const bagText =
    order.bagCost > 0
      ? `• 1x Bolsa de despacho — S/ ${(order.bagCost).toFixed(2)}\n`
      : '';

  let message = '';

  if (order.deliveryType === 'tienda') {
    // ----------------------------------------------------
    // FORMATO: SEPARAR PEDIDO PARA LLEVAR (RECOJO EN TIENDA)
    // ----------------------------------------------------
    message = `🍗 *NUEVO PEDIDO #${order.id} — DON JOSÉ*
━━━━━━━━━━━━━━━━━━━━
🛍️ *MODALIDAD: SEPARAR PARA LLEVAR*
⏰ *Hora estimada de recojo:* ${order.pickupTime || 'En 30 minutos'}
📍 *Local de recojo:* A.H. PROMUVI IV Mz 35 Lte 20 (Ilo)
━━━━━━━━━━━━━━━━━━━━
👤 *Cliente:* ${order.fullName}
📞 *Teléfono:* ${order.phone}

📦 *DETALLE DE PLATOS:*
${itemsList}
${taperText}${bagText}
💵 *Subtotal Comida:* S/ ${order.subtotal.toFixed(2)}
🥡 *Empaques:* S/ ${(order.taperCost + order.bagCost).toFixed(2)}
💰 *TOTAL A PAGAR EN CAJA:* S/ ${order.total.toFixed(2)}

💳 *PAGO:* Se cancela en caja al recoger (Efectivo / Yape / Tarjeta)
${order.wantsReceipt ? `🧾 *Comprobante Solicitado:* Nota de Pedido (DNI: ${order.dni || 'VARIOS'})` : '🧾 *Comprobante:* No solicitado'}
━━━━━━━━━━━━━━━━━━━━
✅ *Pedido registrado desde la página web*`;
  } else {
    // ----------------------------------------------------
    // FORMATO: DELIVERY A DOMICILIO
    // ----------------------------------------------------
    const paymentMethodText =
      order.paymentMethod === 'YAPE'
        ? `💳 *FORMA DE PAGO:* YAPE A DON JOSÉ (+51 960 447 032)\n📎 *(Adjunto captura de pago por aquí)*`
        : `💵 *FORMA DE PAGO:* EFECTIVO CONTRA ENTREGA`;

    message = `🍗 *NUEVO PEDIDO #${order.id} — DON JOSÉ*
━━━━━━━━━━━━━━━━━━━━
🛵 *MODALIDAD: DELIVERY A DOMICILIO*
📍 *Dirección de Entrega:* ${order.address}
🧭 *Referencia:* ${order.reference || 'Ninguna'}
🌆 *Zona:* ${order.deliveryZoneName || 'Ilo'}
━━━━━━━━━━━━━━━━━━━━
👤 *Cliente:* ${order.fullName}
📞 *Teléfono:* ${order.phone}

📦 *DETALLE DE PLATOS:*
${itemsList}
${taperText}${bagText}
💵 *Subtotal Comida:* S/ ${order.subtotal.toFixed(2)}
🥡 *Empaques:* S/ ${(order.taperCost + order.bagCost).toFixed(2)}
🛵 *Costo de Envío:* ${order.deliveryCost === 0 ? 'Se coordina con motorizado' : `S/ ${order.deliveryCost.toFixed(2)}`}
💰 *TOTAL GENERAL A PAGAR:* S/ ${order.total.toFixed(2)}

${paymentMethodText}
${order.wantsReceipt ? `🧾 *Comprobante Solicitado:* Nota de Pedido (DNI: ${order.dni || 'VARIOS'})` : '🧾 *Comprobante:* No solicitado'}
━━━━━━━━━━━━━━━━━━━━
✅ *Pedido registrado desde la página web*`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
