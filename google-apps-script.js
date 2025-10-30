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
  BASE_URL: "https://moodlabstudio.com",
  EMAIL_FROM: "Mood Lab Studios <moodlabstudios@gmail.com>",
  EMAIL_SUBJECT: "🎵 Il tuo Poster Musicale è pronto!",
  SUPPORT_EMAIL: "moodlabstudios@gmail.com"
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

/**
 * Handler per richieste OPTIONS (CORS preflight)
 * Necessario per permettere richieste POST dal frontend
 */
function doOptions(e) {
  return createResponse(200, {});
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
  // Paywall-only: route aggiornata per nuovo routing
  const createUrl = `${CONFIG.BASE_URL}/album/create/${token}`;

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

          <p>Se hai problemi, contattaci a <a href="mailto:${CONFIG.SUPPORT_EMAIL}">${CONFIG.SUPPORT_EMAIL}</a></p>

          <p>Buon divertimento! 🎉</p>
        </div>
        <div class="footer">
          <p>Link diretto: <a href="${createUrl}">${createUrl}</a></p>
          <p>&copy; 2025 Mood Lab Studios - Tutti i diritti riservati</p>
          <p>Supporto: <a href="mailto:${CONFIG.SUPPORT_EMAIL}">${CONFIG.SUPPORT_EMAIL}</a></p>
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

Se hai problemi, contattaci a ${CONFIG.SUPPORT_EMAIL}

Buon divertimento!

---
© 2025 Mood Lab Studios
Supporto: ${CONFIG.SUPPORT_EMAIL}
  `;

  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody,
    name: "Mood Lab Studios"
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
  // Note: Apps Script Web Apps automatically handle CORS when deployed with:
  // - Execute as: Me
  // - Who has access: Anyone
  // Google's infrastructure adds the necessary CORS headers automatically
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ========================================
// 🧪 TEST FUNCTIONS - Per Testing Locale
// ========================================
// Usa queste funzioni per testare il sistema PRIMA del deploy
// Vedi guida completa: TEST_LOCAL.md

/**
 * TEST 1: Simula ordine Etsy completo + invio email
 *
 * ISTRUZIONI:
 * 1. Cambia buyer_email con la TUA email
 * 2. Seleziona questa funzione nel menu dropdown
 * 3. Clicca Run (▶️)
 * 4. Controlla la tua email (anche spam!) per il link
 * 5. Apri il link nel browser con npm run dev attivo
 */
function testWebhook() {
  Logger.log("🧪 ===== TEST ORDINE ETSY =====");

  const testData = {
    receipt_id: "TEST-ORDER-" + Date.now(),
    buyer_email: "moodlabstudios@gmail.com", // ⚠️ CAMBIA QUESTO!
    name: "Test User",
    transaction_id: "TXN-TEST-" + Date.now()
  };

  Logger.log("📦 Creating test order...");
  Logger.log("   Order ID: " + testData.receipt_id);
  Logger.log("   Email: " + testData.buyer_email);

  const result = handleEtsyWebhook(testData);
  const response = JSON.parse(result.getContent());

  if (response.success) {
    Logger.log("✅ Order created successfully!");
    Logger.log("📧 Email sent to: " + testData.buyer_email);
    Logger.log("🔗 Check your email for the link!");
    Logger.log("");
    Logger.log("Next steps:");
    Logger.log("1. Check your email (also spam folder)");
    Logger.log("2. Copy the link from the email");
    Logger.log("3. Open it in browser with npm run dev running");
  } else {
    Logger.log("❌ Order creation failed!");
    Logger.log("Error: " + response.error);
  }

  return result;
}

/**
 * TEST 2: Verifica stato di un token
 * Utile per debug - controlla se un token esiste ed è valido
 */
function testTokenStatus(token) {
  if (!token) {
    // ⚠️ Incolla qui un token da testare
    token = "PASTE_YOUR_TOKEN_HERE";
  }

  Logger.log("🔍 ===== VERIFICA TOKEN =====");
  Logger.log("Token: " + token);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const linksSheet = ss.getSheetByName(CONFIG.SHEET_NAME_LINKS);
  const linkData = findLinkByToken(linksSheet, token);

  if (linkData) {
    Logger.log("✅ Token found!");
    Logger.log("   Order ID: " + linkData.orderId);
    Logger.log("   Email: " + linkData.customerEmail);
    Logger.log("   Created: " + linkData.createdAt);
    Logger.log("   Expires: " + linkData.expiresAt);
    Logger.log("   Downloaded: " + (linkData.isDownloaded ? "YES" : "NO"));
    Logger.log("   Status: " + linkData.status);

    if (linkData.isDownloaded) {
      Logger.log("   Downloaded at: " + linkData.downloadedAt);
    }

    // Controlla se scaduto
    const now = new Date();
    const expiresAt = new Date(linkData.expiresAt);
    if (now > expiresAt) {
      Logger.log("⚠️ Token is EXPIRED!");
    }
  } else {
    Logger.log("❌ Token not found in database");
  }

  return linkData;
}

/**
 * TEST 3: Test solo email (senza creare ordine)
 * Utile per testare rapidamente il template email
 */
function testEmail() {
  Logger.log("📧 ===== TEST EMAIL =====");

  const testToken = "TEST-TOKEN-" + Date.now();
  const testEmail = "TUA_EMAIL@gmail.com"; // ⚠️ CAMBIA QUESTO!
  const testName = "Test User";

  Logger.log("Sending test email...");
  Logger.log("   To: " + testEmail);
  Logger.log("   Token: " + testToken);

  sendWelcomeEmail(testEmail, testName, testToken);

  Logger.log("✅ Email sent!");
  Logger.log("🔗 Test link: " + CONFIG.BASE_URL + "/album/create/" + testToken);
  Logger.log("Note: This token is NOT in the database, so validation will fail");
}

/**
 * TEST 4: Pulisci dati di test
 * Rimuove tutti gli ordini di test dal database
 */
function cleanTestData() {
  Logger.log("🗑️ ===== PULIZIA DATI TEST =====");

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Pulisci Orders
  const ordersSheet = ss.getSheetByName(CONFIG.SHEET_NAME_ORDERS);
  const ordersData = ordersSheet.getDataRange().getValues();
  let deletedOrders = 0;

  for (let i = ordersData.length - 1; i > 0; i--) {
    const orderId = String(ordersData[i][0]);
    if (orderId.startsWith("TEST-")) {
      ordersSheet.deleteRow(i + 1);
      deletedOrders++;
    }
  }

  Logger.log("🗑️ Deleted " + deletedOrders + " test orders");

  // Pulisci DownloadLinks
  const linksSheet = ss.getSheetByName(CONFIG.SHEET_NAME_LINKS);
  const linksData = linksSheet.getDataRange().getValues();
  let deletedLinks = 0;

  for (let i = linksData.length - 1; i > 0; i--) {
    const orderId = String(linksData[i][1]);
    if (orderId.startsWith("TEST-")) {
      linksSheet.deleteRow(i + 1);
      deletedLinks++;
    }
  }

  Logger.log("🗑️ Deleted " + deletedLinks + " test tokens");
  Logger.log("✅ Cleanup complete!");
}

/**
 * TEST 5: Verifica configurazione completa
 * Controlla che tutto sia configurato correttamente
 */
function testConfiguration() {
  Logger.log("🔧 ===== VERIFICA CONFIGURAZIONE =====");

  let allGood = true;

  // Verifica fogli
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ordersSheet = ss.getSheetByName(CONFIG.SHEET_NAME_ORDERS);
  const linksSheet = ss.getSheetByName(CONFIG.SHEET_NAME_LINKS);

  if (!ordersSheet) {
    Logger.log("❌ Sheet 'Orders' not found!");
    allGood = false;
  } else {
    Logger.log("✅ Sheet 'Orders' found");
  }

  if (!linksSheet) {
    Logger.log("❌ Sheet 'DownloadLinks' not found!");
    allGood = false;
  } else {
    Logger.log("✅ Sheet 'DownloadLinks' found");
  }

  // Verifica BASE_URL
  if (CONFIG.BASE_URL.includes("localhost")) {
    Logger.log("⚠️ BASE_URL is localhost: " + CONFIG.BASE_URL);
    Logger.log("   Remember to change it after deploy!");
  } else if (CONFIG.BASE_URL.includes("tuodominio.com")) {
    Logger.log("⚠️ BASE_URL is still placeholder: " + CONFIG.BASE_URL);
    Logger.log("   Remember to change it to your real domain!");
    allGood = false;
  } else {
    Logger.log("✅ BASE_URL configured: " + CONFIG.BASE_URL);
  }

  // Verifica EMAIL_FROM
  if (CONFIG.EMAIL_FROM.includes("tuodominio.com")) {
    Logger.log("⚠️ EMAIL_FROM is still placeholder");
  } else {
    Logger.log("✅ EMAIL_FROM: " + CONFIG.EMAIL_FROM);
  }

  // Verifica TOKEN_EXPIRY_DAYS
  Logger.log("✅ Token expiry: " + CONFIG.TOKEN_EXPIRY_DAYS + " days");

  if (allGood) {
    Logger.log("");
    Logger.log("🎉 Configuration OK! Ready to test.");
    Logger.log("Run testWebhook() to create a test order.");
  } else {
    Logger.log("");
    Logger.log("⚠️ Some issues found. Fix them before proceeding.");
  }

  return allGood;
}

/**
 * TEST 6: Test validazione token (rapido)
 */
function testValidateToken() {
  // ⚠️ Inserisci un token reale dal tuo sheet
  const token = "B26B5C13E9674C19";

  Logger.log("🔍 Testing token validation...");
  Logger.log("Token: " + token);

  const result = handleValidateToken(token);
  const response = JSON.parse(result.getContent());

  Logger.log("");
  Logger.log("Response:");
  Logger.log(JSON.stringify(response, null, 2));

  return result;
}

/**
 * TEST 7: Test mark-downloaded
 * IMPORTANTE: Prima esegui testWebhook() per creare un token,
 * poi copia il token e incollalo qui sotto
 */
function testMarkDownloaded() {
  // ⚠️ Incolla qui un token VALIDO dal tuo sheet DownloadLinks
  const token = "B26B5C13E9674C19";

  Logger.log("🎯 ===== TEST MARK DOWNLOADED =====");
  Logger.log("Token: " + token);

  // Verifica che il token esista prima
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const linksSheet = ss.getSheetByName(CONFIG.SHEET_NAME_LINKS);
  const linkData = findLinkByToken(linksSheet, token);

  if (!linkData) {
    Logger.log("❌ Token not found! Make sure you pasted a valid token.");
    return;
  }

  Logger.log("✅ Token found in database");
  Logger.log("   Status BEFORE: " + linkData.status);
  Logger.log("   Downloaded BEFORE: " + linkData.isDownloaded);

  // Simula la chiamata dal frontend
  const payload = {
    token: token,
    posterData: {
      albumId: "test-album-id",
      albumName: "Test Album",
      artistName: "Test Artist",
      customization: {
        bgMode: "beige",
        frame: "none",
        layout: "60-40",
        radius: 8,
        tagline: "Test tagline"
      }
    }
  };

  Logger.log("");
  Logger.log("📤 Calling handleMarkDownloaded...");
  const result = handleMarkDownloaded(payload);
  const response = JSON.parse(result.getContent());

  Logger.log("");
  Logger.log("📥 Response:");
  Logger.log(JSON.stringify(response, null, 2));

  // Verifica che sia stato aggiornato
  const updatedLinkData = findLinkByToken(linksSheet, token);
  Logger.log("");
  Logger.log("🔍 Status AFTER:");
  Logger.log("   Status: " + updatedLinkData.status);
  Logger.log("   Downloaded: " + updatedLinkData.isDownloaded);
  Logger.log("   Downloaded At: " + updatedLinkData.downloadedAt);

  if (updatedLinkData.isDownloaded === "TRUE" || updatedLinkData.isDownloaded === true) {
    Logger.log("");
    Logger.log("✅ SUCCESS! Token was marked as downloaded.");
  } else {
    Logger.log("");
    Logger.log("❌ FAILED! Token was NOT marked as downloaded.");
  }

  return result;
}
