# 🎵 Album Poster Generator - SaaS Setup Complete

## 🚀 Overview

Album Poster Generator è ora un SaaS completo che permette ai clienti di:
1. Acquistare un poster personalizzato su **Etsy**
2. Ricevere un **link unico via email**
3. **Creare** il proprio poster personalizzato online
4. **Scaricare** in alta risoluzione (una sola volta)

---

## 🏗️ Architettura del Sistema

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │ 1. Acquista su Etsy
       ▼
┌─────────────────┐
│  Etsy Webhook   │
└────────┬────────┘
         │ 2. Notifica ordine
         ▼
┌──────────────────────────┐
│  Google Apps Script API  │ ◄─── Frontend React
│  (Serverless Backend)    │
└────────┬─────────────────┘
         │ 3. Salva ordine & genera token
         ▼
┌─────────────────┐
│  Google Sheets  │
│  (Database)     │
└────────┬────────┘
         │ 4. Invia email con link
         ▼
┌────────────────────┐
│  Gmail / MailApp   │
└────────┬───────────┘
         │
         ▼
    Cliente riceve email
         │
         │ 5. Clicca link /create/TOKEN
         ▼
┌───────────────────────┐
│  React Frontend       │
│  (Vercel/Netlify)     │
└───────┬───────────────┘
        │ 6. Valida token
        │ 7. Crea poster
        │ 8. Download (una volta)
        ▼
    Poster scaricato!
```

---

## 📁 Struttura File del Progetto

```
albumPosterGen/
├── src/
│   ├── components/          # Componenti React
│   │   ├── AlbumSearch.tsx
│   │   ├── PosterGenerator.tsx (modificato per tokenMode)
│   │   └── ...
│   ├── pages/               # ✨ NUOVO
│   │   ├── Home.tsx         # Landing page
│   │   └── CreateWithToken.tsx  # Pagina creazione con token
│   ├── services/
│   │   ├── spotifyService.ts
│   │   └── tokenService.ts  # ✨ NUOVO - API calls a Google Apps Script
│   ├── config/
│   │   └── api.ts           # ✨ NUOVO - Config URL API
│   └── ...
├── google-apps-script.js    # ✨ NUOVO - Backend serverless
├── SETUP_GOOGLE_SHEETS.md   # ✨ NUOVO - Guida setup database
├── SETUP_ETSY_WEBHOOK.md    # ✨ NUOVO - Guida integrazione Etsy
├── README_SAAS.md           # ✨ NUOVO - Questo file
├── .env                     # ✨ DA CREARE - Variabili d'ambiente
└── ...
```

---

## 🎯 Flusso Completo Cliente

### 1️⃣ Acquisto su Etsy
Cliente visita il tuo shop Etsy e acquista "Poster Musicale Personalizzato" (€15-30)

### 2️⃣ Ricezione Email Automatica
Dopo l'ordine, riceve email con:
```
🎵 Grazie per il tuo ordine!

Clicca qui per creare il tuo poster:
https://tuodominio.com/create/ABC123XYZ789

⚠️ Importante:
- Puoi scaricare il poster UNA SOLA VOLTA
- Il link scade tra 30 giorni
```

### 3️⃣ Creazione Poster
Cliente clicca il link e arriva su una pagina dove:
- ✅ Token viene validato (chiamata API a Google Apps Script)
- ✅ Può cercare qualsiasi album Spotify
- ✅ Personalizza colori, font, layout, frame, ecc.
- ✅ Vede anteprima in tempo reale

### 4️⃣ Download (Una Sola Volta)
Quando clicca "Download":
- ⚠️ **Conferma**: "Puoi scaricare UNA SOLA VOLTA. Sei sicuro?"
- ✅ Poster scaricato in PNG alta risoluzione
- ✅ Token marcato come "usato" nel database
- 🔒 Link diventa **permanentemente bloccato**

### 5️⃣ Link Bloccato
Se prova a usare di nuovo lo stesso link:
```
❌ Poster già scaricato
Questo link è già stato utilizzato.
Scaricato il: 29/01/2025 14:30

Hai perso il file? Contattaci via email.
```

---

## 🛠️ Setup Completo (Guida Rapida)

### Step 1: Database (Google Sheets)
📖 Segui: [`SETUP_GOOGLE_SHEETS.md`](./SETUP_GOOGLE_SHEETS.md)

1. Crea Google Sheet con 2 fogli:
   - **Orders**: ordini Etsy
   - **DownloadLinks**: token e tracking
2. Installa Google Apps Script (`google-apps-script.js`)
3. Deploy come Web App (pubblico)
4. Salva URL deployment

### Step 2: Integrazione Etsy
📖 Segui: [`SETUP_ETSY_WEBHOOK.md`](./SETUP_ETSY_WEBHOOK.md)

1. Crea app su Etsy Developer Portal
2. Configura webhook (o usa Zapier)
3. Crea prodotto su Etsy
4. Testa con ordine fittizio

### Step 3: Frontend React
1. Crea file `.env`:
   ```bash
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
   VITE_APP_BASE_URL=https://tuodominio.com
   ```

2. Installa dipendenze:
   ```bash
   npm install
   ```

3. Testa in locale:
   ```bash
   npm run dev
   ```

4. Deploy su Vercel/Netlify:
   ```bash
   npm run build
   vercel --prod
   ```

---

## 🔑 File da Configurare

### 1. `.env` (root progetto)
```bash
# Google Apps Script URL (dopo deployment)
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbxXXXXXXX/exec

# URL della tua app deployata
VITE_APP_BASE_URL=https://spotifygen.vercel.app
```

### 2. `src/pages/Home.tsx`
```typescript
// Riga 8: Inserisci il tuo shop Etsy
const ETSY_SHOP_URL = 'https://www.etsy.com/shop/YOUR_SHOP_NAME';
```

### 3. `google-apps-script.js`
```javascript
// Righe 10-15: Configura
const CONFIG = {
  TOKEN_EXPIRY_DAYS: 30,
  BASE_URL: "https://tuodominio.com", // <-- Cambia qui
  EMAIL_FROM: "noreply@tuodominio.com",
  EMAIL_SUBJECT: "🎵 Il tuo Poster Musicale è pronto!",
};
```

---

## 🎨 Funzionalità Implementate

### ✅ Backend (Google Apps Script)
- [x] Ricezione webhook Etsy
- [x] Generazione token univoci (UUID)
- [x] Salvataggio ordini in Google Sheets
- [x] Invio email automatico con link
- [x] API validazione token (GET)
- [x] API tracking download (POST)
- [x] Gestione scadenza token (30 giorni)
- [x] Blocco download dopo il primo utilizzo

### ✅ Frontend (React)
- [x] Landing page con info prodotto
- [x] Routing `/create/:token`
- [x] Validazione token all'ingresso
- [x] UI per stati: valid, used, expired, invalid
- [x] Interfaccia creazione poster completa
- [x] Conferma download con warning
- [x] Chiamata API mark-downloaded dopo export
- [x] Blocco UI dopo primo download
- [x] Messaggi di errore dettagliati

### ✅ Integrazione
- [x] Webhook Etsy → Google Apps Script
- [x] Email automatiche tramite Gmail/MailApp
- [x] Database visivo Google Sheets
- [x] Deploy frontend Vercel/Netlify ready

---

## 🧪 Testing

### Test Backend (Google Apps Script)

1. **Test manuale invio email**:
   ```javascript
   // In Apps Script Editor
   function testWebhook() {
     const testData = {
       receipt_id: "TEST" + Date.now(),
       buyer_email: "tuaemail@test.com",
       name: "Mario Rossi",
       transaction_id: "TXN123"
     };
     handleEtsyWebhook(testData);
   }
   ```

2. **Test validazione token**:
   ```bash
   curl "https://script.google.com/macros/s/YOUR_ID/exec?action=validate-token&token=ABC123"
   ```

### Test Frontend

1. **Modalità demo** (senza token):
   ```
   http://localhost:5173/demo
   ```

2. **Test con token manuale**:
   - Crea token nel Google Sheet manualmente
   - Accedi a: `http://localhost:5173/create/TOKEN`

3. **Test flusso completo**:
   - Ordine reale su Etsy → Email → Link → Crea → Download

---

## 💰 Costi

### ✅ Completamente Gratuito:
- **Google Sheets**: Gratis (15GB spazio)
- **Google Apps Script**: Gratis (quotas generose)
- **Gmail**: Gratis (100 email/giorno)
- **Vercel/Netlify**: Gratis (tier hobby)
- **Etsy**: Solo commissioni vendita (5% + fee transazione)

### 💵 Costi Opzionali:
- **Dominio custom**: ~€10/anno
- **Email professionale**: ~€5/mese (Google Workspace)
- **Etsy Plus**: €8.50/mese (opzionale)

---

## 🚨 Limiti e Considerazioni

### Google Apps Script Quotas:
- ✅ **Email/giorno**: 100 (account gratuito) / 1500 (Google Workspace)
- ✅ **Execution time**: 6 min/execution
- ✅ **Trigger calls/day**: 90

### Scalabilità:
- ✅ **0-100 ordini/giorno**: Perfetto con setup attuale
- ⚠️ **100-1000 ordini/giorno**: Considera upgrade a database vero (Firebase/Supabase)
- ❌ **1000+ ordini/giorno**: Backend dedicato necessario

---

## 🔐 Sicurezza

### Implementato:
- ✅ Token UUID univoci (non indovinabili)
- ✅ Scadenza temporale (30 giorni)
- ✅ Un solo download per token
- ✅ Validazione server-side
- ✅ Salvataggio dati ordine/download

### Best Practices:
- ✅ Non esporre API keys nel frontend
- ✅ Usa HTTPS per tutto
- ✅ Monitora Google Sheet per anomalie
- ✅ Rate limiting opzionale (vedi webhook docs)

---

## 📈 Analytics e Monitoring

### Metriche da Monitorare:

1. **Google Sheets**:
   - Ordini ricevuti
   - Token generati
   - Download completati
   - Token scaduti/non utilizzati

2. **Google Apps Script Logs**:
   - Executions → Vedi successo/fallimento API calls
   - Errori invio email
   - Webhook ricevuti

3. **Etsy Dashboard**:
   - Vendite
   - Recensioni clienti
   - Tassi di conversione

---

## 🎉 Next Steps

Dopo aver completato il setup:

1. ✅ **Testa tutto il flusso** con ordine reale
2. ✅ **Pubblica prodotto su Etsy**
3. ✅ **Promuovi il tuo shop**:
   - Social media
   - Pinterest (ottimo per poster)
   - Reddit (/r/Etsy, /r/Spotify)
   - Instagram/TikTok
4. ✅ **Raccogli feedback** dai primi clienti
5. ✅ **Ottimizza** design email e landing page

---

## 🆘 Support

### Problemi comuni:

- **Email non arrivano**: Controlla quota Gmail (100/giorno)
- **Token invalido**: Verifica `.env` ha URL corretto
- **Webhook non funziona**: Testa con `testWebhook()` manuale
- **Download non blocca**: Controlla che `markDownloaded` venga chiamato

### Risorse:
- [Guida Google Sheets](./SETUP_GOOGLE_SHEETS.md)
- [Guida Etsy Webhook](./SETUP_ETSY_WEBHOOK.md)
- [Documentazione Google Apps Script](https://developers.google.com/apps-script)
- [Etsy Developer Docs](https://developers.etsy.com/)

---

## 📝 License

Questo progetto è privato. Tutti i diritti riservati.

---

**🎵 Buona fortuna con il tuo SaaS Album Poster Generator!** 🚀
