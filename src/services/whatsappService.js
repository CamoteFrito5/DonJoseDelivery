/**
 * Formatea y genera el enlace oficial de WhatsApp con el mensaje estructurado
 * para el administrador de Restaurant Parrilladas y Pollería DON JOSÉ.
 */
export function generateWhatsAppLink(order, businessConfig) {
  const phone = businessConfig.adminWhatsApp.replace(/\D/g, '');

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

  // Modalidad de entrega
  let deliverySection = '';
  if (order.deliveryType === 'tienda') {
    deliverySection = `🏪 *Modalidad:* RECOJO EN LOCAL DE DON JOSÉ\n📍 Local: A.H. PROMUVI IV Mz 35 Lte 20`;
  } else if (order.deliveryZoneId === 'externo') {
    deliverySection = `🛵 *Modalidad:* DELIVERY EXTERNO (Carrera pagada al motorizado)\n📍 Dirección: ${order.address}\n🧭 Referencia: ${order.reference || 'Ninguna'}`;
  } else {
    deliverySection = `🛵 *Modalidad:* DELIVERY (Moto Don José - ${order.deliveryZoneName})\n📍 Dirección: ${order.address}\n🧭 Referencia: ${order.reference || 'Ninguna'}`;
  }

  // Método de Pago
  let paymentText = '';
  if (order.paymentMethod === 'YAPE') {
    paymentText = `💳 *MÉTODO DE PAGO:* YAPE A DON JOSÉ (953 953 533)\n📎 *(Adjunto captura de pantalla a continuación)*`;
  } else if (order.paymentMethod === 'EFECTIVO') {
    paymentText = `💵 *MÉTODO DE PAGO:* EFECTIVO CONTRA ENTREGA\n💵 *Paga con billete de:* S/ ${order.cashWith || order.total.toFixed(2)}\n🪙 *Vuelto a enviar:* S/ ${(order.cashWith ? Math.max(0, parseFloat(order.cashWith) - order.total) : 0).toFixed(2)}`;
  } else {
    paymentText = `📱 *MÉTODO DE PAGO:* YAPE AL REPARTIDOR AL ENTREGAR`;
  }

  // Mensaje final
  const message = `🍗 *NUEVO PEDIDO #${order.id} — DON JOSÉ*
━━━━━━━━━━━━━━━━━━━━
👤 *Cliente:* ${order.fullName}
📞 *Teléfono:* ${order.phone}
${deliverySection}

📦 *DETALLE DEL PEDIDO:*
${itemsList}
${taperText}${bagText}
💵 *Subtotal Comida:* S/ ${order.subtotal.toFixed(2)}
🥡 *Empaques (Táper/Bolsa):* S/ ${(order.taperCost + order.bagCost).toFixed(2)}
🛵 *Envío:* ${order.deliveryCost === 0 ? (order.deliveryZoneId === 'externo' ? 'Se paga al motorizado' : 'Gratis (Recojo)') : `S/ ${order.deliveryCost.toFixed(2)}`}
💰 *TOTAL GENERAL:* S/ ${order.total.toFixed(2)}

${paymentText}

🧾 *COMPROBANTE:* NOTA DE PEDIDO (RECIBO)
🪪 *DNI:* ${order.dni || '11111111 (VARIOS)'}
━━━━━━━━━━━━━━━━━━━━
ℹ️ *Estado:* PENDIENTE DE PREPARACIÓN`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
