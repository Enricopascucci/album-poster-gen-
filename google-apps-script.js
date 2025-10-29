/**
 * 🎨 Album Poster Generator - Google Apps Script Backend
 *
 * Questo script gestisce:
 * - Ricezione webhook da Etsy
 * - Generazione token univoci
 * - Invio email con link personalizzati
 * - API per validazione token
 * - Tracking download
 */

// ========================================
// 🔧 CONFIGURAZIONE
// ========================================

const CONFIG = {
  SHEET_NAME_ORDERS: "Orders",
  SHEET_NAME_LINKS: "DownloadLinks",
  TOKEN_EXPIRY_DAYS: 30,
  BASE_URL: "https://tuodominio.com", // Modifica con il tuo dominio
  EMAIL_FROM: "noreply@tuodominio.com",
  EMAIL_SUBJECT: "🎵 Il tuo Poster Musicale è pronto!",
};

// ========================================
// 📨 WEBHOOK ETSY - Ricevi ordini
// ========================================

/**
 * Endpoint principale per webhook e API
 * POST /exec?action=etsy-webhook
 * GET /exec?action=validate-token&token=ABC123
 * POST /exec?action=mark-downloaded
 */
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = e.parameter.action;

    if (action === "etsy-webhook") {
      return handleEtsyWebhook(params);
    } else if (action === "mark-downloaded") {
      return handleMarkDownloaded(params);
    }

    return createResponse(400, { error: "Invalid action" });
  } catch (error) {
    Logger.log("Error in doPost: " + error);
    return createResponse(500, { error: error.toString() });
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;

    if (action === "validate-token") {
      const token = e.parameter.token;
      return handleValidateToken(token);
    }

    return createResponse(400, { error: "Invalid action" });
  } catch (error) {
    Logger.log("Error in doGet: " + error);
    return createResponse(500, { error: error.toString() });
  }
}

// ========================================
// 🎯 HANDLER: Webhook Etsy
// ========================================

function handleEtsyWebhook(webhookData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const ordersSheet = sheet.getSheetByName(CONFIG.SHEET_NAME_ORDERS);
  const linksSheet = sheet.getSheetByName(CONFIG.SHEET_NAME_LINKS);

  // Estrai dati ordine Etsy
  // Nota: adatta questi campi in base alla struttura webhook reale di Etsy
  const orderId = webhookData.receipt_id || webhookData.order_id;
  const customerEmail = webhookData.buyer_email;
  const customerName = webhookData.name || "Cliente";
  const transactionId = webhookData.transaction_id || "";

  // Verifica se ordine già esiste
  const existingOrder = findOrderById(ordersSheet, orderId);
  if (existingOrder) {
    return createResponse(200, {
      message: "Order already processed",
      token: existingOrder.token
    });
  }

  // Salva ordine
  const orderDate = new Date();
  ordersSheet.appendRow([
    orderId,
    customerEmail,
    customerName,
    orderDate,
    "paid",
    transactionId
  ]);

  // Genera token univoco
  const token = generateUniqueToken();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + CONFIG.TOKEN_EXPIRY_DAYS);

  // Salva link
  linksSheet.appendRow([
    token,
    orderId,
    customerEmail,
    orderDate,
    expiryDate,
    false, // is_downloaded
    "", // downloaded_at
    "", // poster_data
    "active"
  ]);

  // Invia email
  sendWelcomeEmail(customerEmail, customerName, token);

  return createResponse(200, {
    success: true,
    message: "Order processed and email sent",
    token: token
  });
}

// ========================================
// ✅ HANDLER: Valida Token
// ========================================

function handleValidateToken(token) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const linksSheet = sheet.getSheetByName(CONFIG.SHEET_NAME_LINKS);

  const linkData = findLinkByToken(linksSheet, token);

  if (!linkData) {
    return createResponse(404, {
      valid: false,
      error: "Token non trovato"
    });
  }

  // Controlla se già scaricato
  if (linkData.isDownloaded === "TRUE") {
    return createResponse(403, {
      valid: false,
      error: "Poster già scaricato",
      status: "used",
      downloadedAt: linkData.downloadedAt
    });
  }

  // Controlla scadenza
  const now = new Date();
  const expiryDate = new Date(linkData.expiresAt);
  if (now > expiryDate) {
    return createResponse(403, {
      valid: false,
      error: "Link scaduto",
      status: "expired",
      expiresAt: linkData.expiresAt
    });
  }

  // Token valido
  return createResponse(200, {
    valid: true,
    status: "active",
    customerEmail: linkData.customerEmail,
    expiresAt: linkData.expiresAt,
    orderId: linkData.orderId
  });
}

// ========================================
// 📥 HANDLER: Marca come scaricato
// ========================================

function handleMarkDownloaded(params) {
  const token = params.token;
  const posterData = params.posterData || {};

  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const linksSheet = sheet.getSheetByName(CONFIG.SHEET_NAME_LINKS);

  const rowIndex = findLinkRowByToken(linksSheet, token);

  if (!rowIndex) {
    return createResponse(404, { error: "Token non trovato" });
  }

  // Aggiorna riga
  const now = new Date();
  linksSheet.getRange(rowIndex, 6).setValue(true); // is_downloaded
  linksSheet.getRange(rowIndex, 7).setValue(now); // downloaded_at
  linksSheet.getRange(rowIndex, 8).setValue(JSON.stringify(posterData)); // poster_data
  linksSheet.getRange(rowIndex, 9).setValue("used"); // status

  return createResponse(200, {
    success: true,
    message: "Download tracked successfully"
  });
}

// ========================================
// 📧 Invio Email
// ========================================

function sendWelcomeEmail(email, name, token) {
  const createUrl = `${CONFIG.BASE_URL}/create/${token}`;

  const subject = CONFIG.EMAIL_SUBJECT;
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #1DB954; color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .highlight { background: #fff; padding: 15px; border-left: 4px solid #1DB954; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎵 Grazie per il tuo ordine!</h1>
        </div>
        <div class="content">
          <p>Ciao <strong>${name}</strong>,</p>
          <p>Grazie per aver acquistato il tuo poster musicale personalizzato! Siamo entusiasti di aiutarti a creare qualcosa di unico.</p>

          <div class="highlight">
            <strong>📝 Cosa fare ora:</strong>
            <ol>
              <li>Clicca sul pulsante qui sotto</li>
              <li>Cerca il tuo album musicale preferito</li>
              <li>Personalizza il poster come preferisci</li>
              <li>Scarica il tuo poster in alta risoluzione</li>
            </ol>
          </div>

          <p style="text-align: center;">
            <a href="${createUrl}" class="button">🎨 Crea il tuo Poster</a>
          </p>

          <p><strong>⚠️ Importante:</strong></p>
          <ul>
            <li>Puoi scaricare il poster <strong>una sola volta</strong></li>
            <li>Il link scade tra <strong>${CONFIG.TOKEN_EXPIRY_DAYS} giorni</strong></li>
            <li>Assicurati di essere soddisfatto prima di scaricarlo!</li>
          </ul>

          <p>Se hai problemi, rispondi a questa email e ti aiuteremo!</p>

          <p>Buon divertimento! 🎉</p>
        </div>
        <div class="footer">
          <p>Link diretto: <a href="${createUrl}">${createUrl}</a></p>
          <p>&copy; 2025 Album Poster Generator - Tutti i diritti riservati</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const plainBody = `
Ciao ${name},

Grazie per aver acquistato il tuo poster musicale personalizzato!

Clicca qui per creare il tuo poster: ${createUrl}

Importante:
- Puoi scaricare il poster UNA SOLA VOLTA
- Il link scade tra ${CONFIG.TOKEN_EXPIRY_DAYS} giorni

Buon divertimento!
  `;

  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody,
    name: "Album Poster Generator Team"
  });

  Logger.log(`Email sent to ${email} with token ${token}`);
}

// ========================================
// 🛠️ UTILITY FUNCTIONS
// ========================================

function generateUniqueToken() {
  return Utilities.getUuid().replace(/-/g, '').substring(0, 16).toUpperCase();
}

function findOrderById(sheet, orderId) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == orderId) {
      return {
        orderId: data[i][0],
        email: data[i][1],
        name: data[i][2]
      };
    }
  }
  return null;
}

function findLinkByToken(sheet, token) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === token) {
      return {
        token: data[i][0],
        orderId: data[i][1],
        customerEmail: data[i][2],
        createdAt: data[i][3],
        expiresAt: data[i][4],
        isDownloaded: data[i][5],
        downloadedAt: data[i][6],
        posterData: data[i][7],
        status: data[i][8]
      };
    }
  }
  return null;
}

function findLinkRowByToken(sheet, token) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === token) {
      return i + 1; // Le righe in Sheets sono 1-indexed
    }
  }
  return null;
}

function createResponse(statusCode, data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ========================================
// 🧪 TEST FUNCTIONS (solo per debug)
// ========================================

/**
 * Test webhook con dati fittizi
 * Esegui questa funzione manualmente per testare
 */
function testWebhook() {
  const testData = {
    receipt_id: "TEST" + Date.now(),
    buyer_email: "test@example.com",
    name: "Mario Rossi Test",
    transaction_id: "TXN123456"
  };

  const result = handleEtsyWebhook(testData);
  Logger.log(result.getContent());
}

/**
 * Test validazione token
 */
function testValidateToken() {
  // Inserisci un token reale dal tuo sheet
  const token = "ABC123XYZ789";
  const result = handleValidateToken(token);
  Logger.log(result.getContent());
}
