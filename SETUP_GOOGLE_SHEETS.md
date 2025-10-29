# 📊 Setup Google Sheets Database

## Passo 1: Crea il Google Sheet

1. Vai su [Google Sheets](https://sheets.google.com)
2. Crea un nuovo foglio chiamato **"Album Poster Generator Orders"**
3. Crea due fogli (tabs) nel documento:

---

## 📋 Foglio 1: "Orders"

Colonne (riga 1):
```
| A: order_id | B: customer_email | C: customer_name | D: order_date | E: order_status | F: etsy_transaction_id |
```

**Descrizione campi:**
- `order_id`: ID univoco ordine Etsy
- `customer_email`: Email cliente (per inviare link)
- `customer_name`: Nome cliente
- `order_date`: Data ordine (timestamp)
- `order_status`: paid, shipped, cancelled
- `etsy_transaction_id`: ID transazione Etsy

---

## 🔗 Foglio 2: "DownloadLinks"

Colonne (riga 1):
```
| A: token | B: order_id | C: customer_email | D: created_at | E: expires_at | F: is_downloaded | G: downloaded_at | H: poster_data | I: status |
```

**Descrizione campi:**
- `token`: Token univoco (UUID) per il link
- `order_id`: Riferimento all'ordine in "Orders"
- `customer_email`: Email cliente
- `created_at`: Timestamp creazione link
- `expires_at`: Data scadenza (es. 30 giorni)
- `is_downloaded`: TRUE/FALSE se già scaricato
- `downloaded_at`: Timestamp download
- `poster_data`: JSON con dati poster creato (album_id, customization)
- `status`: active, used, expired, invalid

---

## 📝 Esempio Dati

### Orders:
```
order_id          | customer_email        | customer_name | order_date           | order_status | etsy_transaction_id
12345678          | mario@email.com       | Mario Rossi   | 2025-01-15 10:30:00 | paid         | 98765432
```

### DownloadLinks:
```
token              | order_id | customer_email      | created_at           | expires_at           | is_downloaded | downloaded_at | poster_data | status
abc123xyz789       | 12345678 | mario@email.com     | 2025-01-15 10:30:00 | 2025-02-14 23:59:59 | FALSE         |               |             | active
```

---

## 🔧 Passo 2: Configura Permessi

1. Clicca su **"Condividi"** in alto a destra
2. Imposta permessi su **"Chiunque abbia il link può visualizzare"**
3. Copia l'ID del foglio dall'URL:
   ```
   https://docs.google.com/spreadsheets/d/[QUESTO_E_ID]/edit
   ```
4. Salvalo per usarlo nel Google Apps Script

---

## ⚙️ Passo 3: Installa Google Apps Script

1. Nel Google Sheet, vai su **Estensioni** → **Apps Script**
2. Copia il codice da `google-apps-script.js` (prossimo file)
3. Salva il progetto con nome **"Album Poster Generator API"**
4. Configura le variabili d'ambiente

---

## 🎯 Prossimi Passi

Dopo aver creato il foglio:
1. ✅ Installa Apps Script (vedi `google-apps-script.js`)
2. ✅ Configura webhook Etsy
3. ✅ Testa il sistema con ordine fittizio
