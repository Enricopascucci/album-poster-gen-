# 🛍️ Setup Etsy Webhook Integration

Questa guida ti aiuterà a configurare l'integrazione con Etsy per ricevere automaticamente gli ordini e inviare i link di creazione poster ai clienti.

---

## 📋 Pre-requisiti

1. ✅ Account sviluppatore Etsy attivo
2. ✅ Shop Etsy configurato con prodotto "Poster Musicale Personalizzato"
3. ✅ Google Sheet configurato (vedi `SETUP_GOOGLE_SHEETS.md`)
4. ✅ Google Apps Script installato e deployato

---

## 🔧 Passo 1: Crea App Etsy

1. Vai su [Etsy Developer Portal](https://www.etsy.com/developers)
2. Clicca su **"Create a New App"**
3. Compila i dati:
   - **App Name**: Album Poster Generator Integration
   - **App Description**: Integrazione automatica per ordini poster musicale
   - **Callback URL**: Non necessario per webhook
4. Ottieni le credenziali:
   - `Keystring` (API Key)
   - `Shared Secret`
5. Salva le credenziali in un posto sicuro

---

## 🔗 Passo 2: Deploy Google Apps Script come Web App

Prima di configurare Etsy, devi pubblicare il tuo Google Apps Script come Web App accessibile pubblicamente.

### 2.1 - Deploy dello Script

1. Apri il tuo Google Apps Script
2. Clicca su **"Deploy"** → **"New deployment"**
3. Configurazione:
   - **Type**: Web app
   - **Description**: Album Poster Generator API v1
   - **Execute as**: Me (il tuo account)
   - **Who has access**: **Anyone** (importante!)
4. Clicca **"Deploy"**
5. **Copia l'URL di deployment** (formato: `https://script.google.com/macros/s/XXXXX/exec`)
6. Salva questo URL - lo userai per:
   - Configurare Etsy webhook
   - Configurare il frontend React (file `.env`)

### 2.2 - Testa il deployment

Prova manualmente con una richiesta GET:

```bash
curl "https://script.google.com/macros/s/YOUR_ID/exec?action=validate-token&token=TEST"
```

Dovresti ricevere una risposta JSON (anche se il token non esiste).

---

## 🎣 Passo 3: Configura Webhook su Etsy

Etsy supporta webhook per vari eventi. Dobbiamo intercettare gli ordini completati.

### Opzione A: Webhook API v3 (Consigliato)

1. Vai su [Etsy API Console](https://www.etsy.com/developers/your-apps)
2. Seleziona la tua app
3. Vai su **"Webhooks"**
4. Crea nuovo webhook:
   - **Event**: `listing.updated` o `receipt.created`
   - **Callback URL**: Il tuo URL Google Apps Script + `?action=etsy-webhook`
     ```
     https://script.google.com/macros/s/YOUR_ID/exec?action=etsy-webhook
     ```
   - **Status**: Active

### Opzione B: Webhook tramite Zapier/Make (Alternativa semplice)

Se Etsy API risulta complessa, puoi usare **Zapier** o **Make.com** per semplificare:

#### Con Zapier:

1. Crea account su [Zapier](https://zapier.com)
2. Crea nuovo Zap:
   - **Trigger**: Etsy → New Order
   - **Action**: Webhooks by Zapier → POST
   - **URL**: Il tuo Google Apps Script URL + `?action=etsy-webhook`
   - **Payload Type**: JSON
   - **Data**:
     ```json
     {
       "receipt_id": "{{receipt_id}}",
       "buyer_email": "{{buyer_email}}",
       "name": "{{buyer_name}}",
       "transaction_id": "{{transaction_id}}"
     }
     ```
3. Testa e attiva lo Zap

#### Con Make.com:

1. Crea account su [Make.com](https://www.make.com)
2. Crea nuovo Scenario:
   - **Trigger**: Etsy → Watch Orders
   - **Action**: HTTP → Make a Request
   - **Method**: POST
   - **URL**: Google Apps Script URL + `?action=etsy-webhook`
   - **Body**: Mappa i campi ordine Etsy

---

## 📝 Passo 4: Configura Product su Etsy

Il tuo prodotto su Etsy dovrebbe essere configurato così:

### Dati Prodotto Consigliati:

- **Titolo**: "Poster Musicale Personalizzato - Alta Qualità - Download Digitale"
- **Categoria**: Arte & Collezionismo → Stampe
- **Tipo**: File digitale (Digital Download)
- **Prezzo**: €15-30 (a tua scelta)
- **Descrizione**:

```
🎵 Crea il tuo poster musicale personalizzato!

Dopo l'acquisto riceverai un link via email per creare il tuo poster unico con:
✅ Qualsiasi album musicale
✅ Personalizzazione completa (colori, font, layout)
✅ Download in altissima risoluzione (pronto per stampa)

📦 COME FUNZIONA:
1. Completa l'ordine
2. Ricevi email con link personalizzato
3. Crea il tuo poster online
4. Scarica il file PNG in HD
5. Stampa dove preferisci!

⚠️ Nota: Il link permette UN SOLO DOWNLOAD. Assicurati di essere soddisfatto prima di scaricare!

🖼️ Perfetto per:
- Decorazione casa
- Regalo per amanti della musica
- Camera da letto / Studio
- Fan di un artista

💬 Supporto: Contattaci per qualsiasi domanda!
```

### Impostazioni Importanti:

- ✅ **Tipo di file**: Digitale
- ✅ **Consegna**: Nessun file allegato (invierai link via email)
- ✅ **Download automatico**: Disabilitato (gestirai tu l'invio)

---

## 🧪 Passo 5: Testa il Sistema

### Test Manuale senza Etsy:

1. Apri Google Apps Script Editor
2. Vai su funzione `testWebhook()`
3. Modifica l'email con la tua email di test:
   ```javascript
   const testData = {
     receipt_id: "TEST" + Date.now(),
     buyer_email: "tuaemail@example.com", // <-- Cambia qui
     name: "Mario Rossi Test",
     transaction_id: "TXN123456"
   };
   ```
4. Clicca **"Run"** → `testWebhook`
5. Controlla:
   - Google Sheet "Orders" → Nuova riga aggiunta
   - Google Sheet "DownloadLinks" → Token generato
   - Email ricevuta con link

### Test con Ordine Etsy Reale:

1. Fai un ordine di test sul tuo shop (o chiedi a un amico)
2. Completa il pagamento
3. Verifica che:
   - ✅ Webhook ricevuto (controlla Apps Script logs)
   - ✅ Ordine salvato in Google Sheet
   - ✅ Token generato
   - ✅ Email inviata al cliente
   - ✅ Link funziona: `https://tuodominio.com/create/TOKEN`

---

## 🚀 Passo 6: Configura Frontend React

Ora devi configurare il frontend per chiamare le API di Google Apps Script.

### 6.1 - Crea file `.env`

Nella root del progetto React, crea `.env`:

```bash
# Google Apps Script deployment URL
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec

# Base URL della tua applicazione (dopo il deploy)
VITE_APP_BASE_URL=https://tuodominio.com
```

### 6.2 - Modifica Home Page

Apri `src/pages/Home.tsx` e aggiorna:

```typescript
const ETSY_SHOP_URL = 'https://www.etsy.com/shop/YOUR_SHOP_NAME'; // <-- Il tuo shop
```

### 6.3 - Deploy Frontend

Opzioni di deploy consigliate (tutte gratuite):

#### Vercel (Consigliato):

```bash
npm install -g vercel
npm run build
vercel --prod
```

#### Netlify:

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

#### Cloudflare Pages:

1. Vai su [dash.cloudflare.com](https://dash.cloudflare.com)
2. Pages → Create a project
3. Connetti repository GitHub
4. Build settings:
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
   - **Environment variables**: Aggiungi `VITE_APPS_SCRIPT_URL` e `VITE_APP_BASE_URL`

---

## 🔐 Sicurezza e Best Practices

### Protezione API:

Anche se Google Apps Script è pubblico, puoi aggiungere validazione:

```javascript
// Nel google-apps-script.js, aggiungi:
const ALLOWED_ORIGINS = [
  'https://tuodominio.com',
  'https://www.tuodominio.com'
];

function doGet(e) {
  const origin = e.parameter.origin;
  if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
    return createResponse(403, { error: 'Forbidden' });
  }
  // ... resto del codice
}
```

### Rate Limiting:

Considera di aggiungere rate limiting per evitare abusi:

```javascript
// Limite: max 10 validazioni per token in 1 ora
const RATE_LIMIT = 10;
```

### Monitoring:

1. Controlla i **logs** di Google Apps Script:
   - Apps Script Editor → Executions
2. Monitora il Google Sheet per ordini/download
3. Imposta **notifiche email** per nuovi ordini

---

## 🐛 Troubleshooting

### Email non arrivano:

- ✅ Verifica che Gmail non abbia bloccato `MailApp`
- ✅ Controlla cartella Spam
- ✅ Verifica quota Gmail: max 100 email/giorno per account gratuito
- ✅ Usa un dominio custom per email professionali

### Webhook non riceve ordini:

- ✅ Verifica URL webhook su Etsy
- ✅ Controlla Apps Script logs (Executions)
- ✅ Testa con `testWebhook()` manualmente
- ✅ Verifica che lo script sia deployato come "Anyone" can access

### Token invalido sul frontend:

- ✅ Controlla `.env` ha URL corretto
- ✅ Verifica CORS: Apps Script dovrebbe accettare tutte le origini
- ✅ Controlla console browser per errori di rete

### Download non blocca il token:

- ✅ Verifica che `markDownloaded` venga chiamato
- ✅ Controlla che la colonna `is_downloaded` sia TRUE nel Sheet
- ✅ Testa con un nuovo token

---

## 📚 Risorse Utili

- [Etsy API Documentation](https://developers.etsy.com/)
- [Google Apps Script Guide](https://developers.google.com/apps-script)
- [Zapier Etsy Integration](https://zapier.com/apps/etsy/integrations)
- [Make.com Etsy](https://www.make.com/en/integrations/etsy)

---

## ✅ Checklist Finale

Prima di andare live:

- [ ] Google Sheet creato e configurato
- [ ] Google Apps Script deployato come Web App
- [ ] Testato webhook con ordine fittizio
- [ ] Email di test ricevuta correttamente
- [ ] Frontend deployato su Vercel/Netlify
- [ ] File `.env` configurato
- [ ] Link `/create/TOKEN` funziona correttamente
- [ ] Download traccia correttamente il token
- [ ] Secondo download viene bloccato
- [ ] Token scaduti/invalidi mostrano errori corretti
- [ ] Prodotto Etsy pubblicato con descrizione chiara
- [ ] Webhook Etsy (o Zapier) configurato e attivo

---

🎉 **Congratulazioni!** Il tuo SaaS è pronto per accettare ordini!
