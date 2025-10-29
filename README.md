# Spotify Album Poster Generator

Una piattaforma web che permette di creare e scaricare poster professionali degli album di Spotify.

## Caratteristiche

- Ricerca album tramite le API di Spotify
- **3 formati poster professionali**:
  - 18" × 24" (rapporto 3:4)
  - 20" × 30" (rapporto 2:3)
  - 24" × 36" (rapporto 2:3)
- **Layout ottimizzato**: 60% immagine album, 40% contenuto informativo
- **Artwork a dimensione piena**: Immagine della copertina mostrata completamente con ombra
- **Layout a due colonne**: tracce a sinistra, palette colori + info a destra
- **Palette di colori orizzontale**: 5 quadratini colorati uno accanto all'altro estratti automaticamente
- **Data formattata**: Visualizzazione leggibile (es. "15 JANUARY 2024")
- **Lista completa delle tracce** con numerazione
- **Padding uniforme**: Margini consistenti su tutto il poster
- Download in PNG ad alta risoluzione (fino a 384 DPI)
- Design professionale pronto per la stampa
- Interfaccia intuitiva e moderna
- Completamente responsive

## Setup

### 1. Installa le dipendenze

```bash
npm install
```

### 2. Configura le credenziali Spotify

1. Vai su [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crea una nuova app (o usa una esistente)
3. Copia il **Client ID** e il **Client Secret**
4. Apri il file `.env` e inserisci le credenziali:

```env
VITE_SPOTIFY_CLIENT_ID=il_tuo_client_id
VITE_SPOTIFY_CLIENT_SECRET=il_tuo_client_secret
```

### 3. Avvia il server di sviluppo

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

## Come Usare

1. **Cerca un album**: Digita il nome dell'album che vuoi nel campo di ricerca
2. **Seleziona l'album**: Clicca sull'album desiderato dalla lista dei risultati
3. **Scegli la dimensione**: Seleziona il formato poster desiderato
4. **Scegli la qualità**: Seleziona la qualità del download (Good, High, o Ultra)
5. **Scarica**: Clicca su "Download" per salvare il poster in PNG ad alta risoluzione

## Formati Poster Disponibili

Tre formati professionali ottimizzati per la stampa:

- **18" × 24"** (46×61cm) - Rapporto 3:4
  - Formato classico versatile, ideale per stampe di qualità
  - Default selezionato

- **20" × 30"** (51×76cm) - Rapporto 2:3
  - Formato grande, perfetto per poster da parete

- **24" × 36"** (61×91cm) - Rapporto 2:3
  - Formato extra-large per un impatto visivo massimo

Tutti i formati mantengono proporzioni standardizzate per la stampa professionale.

## Layout del Poster

Il poster è diviso in due sezioni principali:

### Sezione Superiore (60% altezza)
- **Copertina dell'album**: Immagine a dimensione piena con ombra
- Padding uniforme su tutti i lati
- Mantiene le proporzioni originali dell'artwork

### Sezione Inferiore (40% altezza)
Layout a due colonne:

**Colonna Sinistra:**
- Lista completa delle tracce con numerazione
- Font ottimizzato per leggibilità

**Colonna Destra:**
- Palette di 5 colori estratti dall'artwork (orizzontale)
- Titolo album e artista
- Data di uscita formattata (es. "15 JANUARY 2024")
- Numero di tracce e durata totale
- Copyright/Label

## Qualità di Export

- **Good (~192 DPI)**: Buona per visualizzazione web
- **High (~288 DPI)**: Ottima per stampa di piccole dimensioni (consigliata)
- **Ultra (~384 DPI)**: Massima qualità per stampa professionale

## Comandi Disponibili

```bash
# Avvia il server di sviluppo
npm run dev

# Build per produzione
npm run build

# Preview della build di produzione
npm run preview

# Lint del codice
npm run lint
```

## Tecnologie Utilizzate

- **React 19 + TypeScript**: Framework UI con type safety
- **Vite**: Build tool veloce e moderno
- **Spotify Web API**: Per recuperare dati degli album e tracce
- **ColorThief**: Estrazione automatica della palette di colori
- **html2canvas**: Generazione delle immagini ad alta risoluzione
- **Axios**: Gestione chiamate API

## Struttura del Progetto

```
src/
├── components/               # Componenti React
│   ├── AlbumSearch.tsx      # Componente di ricerca album
│   ├── AlbumSearch.css      # Stili per la ricerca
│   ├── PosterGenerator.tsx  # Componente per generare e scaricare poster
│   └── PosterGenerator.css  # Stili per il poster
├── services/                # Servizi per API
│   └── spotifyService.ts    # Gestione chiamate Spotify API
├── types/                   # Definizioni TypeScript
│   └── spotify.ts           # Tipi per le risposte Spotify
├── utils/                   # Utilità
│   ├── colorExtractor.ts    # Estrazione palette colori e formatting
│   └── exportPoster.ts      # Utility per export PNG ad alta risoluzione
├── App.tsx                  # Componente principale
├── App.css                  # Stili globali app
├── index.css                # Stili base
└── main.tsx                 # Entry point
```

## Note

- Assicurati di NON committare il file `.env` con le tue credenziali
- Le credenziali Spotify sono utilizzate in modalità Client Credentials (server-to-server)
- Le immagini degli album sono soggette ai termini di servizio di Spotify
