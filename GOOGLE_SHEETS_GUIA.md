# Guía de Conexión Automática con Google Sheets (Google Drive) 📊

Para que cada pedido que se registre en la web se guarde **automáticamente y en tiempo real en una hoja de Google Drive de Don José** (sin costo alguno):

---

## Paso 1: Crear la Hoja en Google Drive
1. Entra a [Google Sheets](https://sheets.google.com) con la cuenta de Google de Don José.
2. Crea una nueva hoja llamada: `Ventas_DonJose_2026`.
3. En la primera fila (Fila 1), coloca los siguientes encabezados en las columnas **A hasta E** (idénticos a su planilla física):
   * **A1:** `N° de tiket`
   * **B1:** `N°`
   * **C1:** `DESCRIPCION`
   * **D1:** `MONTO`
   * **E1:** `EFECTIVO/YAPE`

---

## Paso 2: Crear el Script de Recepción (Google Apps Script)
1. En tu hoja de cálculo, haz clic en el menú superior: **Extensiones** > **Apps Script**.
2. Borra el código que aparece y pega este código:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var lastRow = sheet.getLastRow();
    var itemNumber = lastRow; // Contador secuencial

    // Insertar la fila con el formato de Don José
    sheet.appendRow([
      data.ticketNumber || data.id,     // Columna A: N° de tiket
      itemNumber,                       // Columna B: N°
      data.description,                 // Columna C: DESCRIPCION
      data.total,                       // Columna D: MONTO
      data.paymentMethod                // Columna E: EFECTIVO/YAPE
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Haz clic en **Implementar** (botón azul arriba a la derecha) > **Nueva implementación**.
4. En tipo, selecciona **Aplicación web**.
5. Configura:
   * **Ejecutar como:** *Yo (tu cuenta de correo)*.
   * **Quién tiene acceso:** *Cualquier usuario (Anyone)*.
6. Haz clic en **Implementar** y copia la **URL de la aplicación web**.

---

## Paso 3: Conectar la URL en el Sistema
Pega la URL obtenida en `src/services/googleSheetsWebhook.js`:

```javascript
export const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/TU_SCRIPT_ID/exec";
```

¡Listo! Cada vez que un cliente complete su pedido, se guardará en tu Google Drive automáticamente y el Administrador también podrá descargar el archivo `.xlsx` de Microsoft Excel desde el panel.
