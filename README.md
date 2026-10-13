# Comercial Don José — Sistema de Catálogo y Pedidos Online 🏪

Prototipo funcional desarrollado para la asignatura **IS-621 Ingeniería de Software** (Universidad Nacional de Moquegua - UNAM).

## 1. Problemática que resuelve
* **Elimina llamadas de 8 minutos:** Los clientes ya no llaman a regatear o dudar mientras el administrador cobra en caja.
* **Interfaz pensada para 30 a 50 años:** Botones grandes, alto contraste, selector de cantidades claro y sin formularios complejos ni contraseñas.
* **Flujo en 3 pasos:**
  1. **Catálogo:** Selección rápida con filtro por categorías y buscador.
  2. **Tus Datos:** Registro de DNI (8 dígitos), Nombre, Teléfono y modalidad de entrega (Recojo en tienda o Delivery en Ilo).
  3. **Pago con Yape:** Visualización del número con botón de copiado rápido y simulación de código QR.
  4. **Confirmación:** Guardado automático y generación instantánea del mensaje estructurado para WhatsApp.

---

## 2. Tecnologías y Herramientas Utilizadas
* **Frontend:** React 19 + Vite 8
* **Estilos:** Tailwind CSS v4 + Lucide Icons
* **Exportación de Datos:** Almacenamiento local + Descargador de reportes en Excel (`.csv` con codificación UTF-8 compatible con acentos y caracteres especiales).
* **Mensajería:** Generador de enlaces oficiales `wa.me` sin costo de API.

---

## 3. Instrucciones de Ejecución Local

Para levantar el prototipo en tu máquina:

```bash
cd DonJoseCatalogo
npm install
npm run dev
```

Abre tu navegador en `http://localhost:5173`.

---

## 4. Despliegue en la Nube (Hosting Gratuito en Vercel)

1. Sube este repositorio a **GitHub**.
2. Ingresa a [vercel.com](https://vercel.com) e inicia sesión con GitHub.
3. Haz clic en **"Add New Project"** y selecciona este repositorio.
4. En **Root Directory**, selecciona la carpeta `DonJoseCatalogo`.
5. Haz clic en **"Deploy"**. En 1 minuto tendrás tu enlace público `https://donjose-catalogo.vercel.app` listo para usar en celulares con certificado SSL gratis.
