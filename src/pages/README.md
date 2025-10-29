# 📁 Pages Structure

Struttura scalabile delle pagine per supportare diversi tipi di poster.

## 🎯 Struttura Attuale

```
pages/
├── Home.tsx                    # Landing page principale
└── album/
    ├── AlbumCreator.tsx        # Generatore album (senza token)
    └── AlbumCreateWithToken.tsx # Generatore album (con token)
```

## ➕ Come Aggiungere un Nuovo Tipo di Poster

### 1. Abilita il tipo in `config/posterTypes.ts`

```typescript
movie: {
  id: 'movie',
  name: 'Movie',
  enabled: true, // Cambia da false a true
  // ... altri campi
}
```

### .Attiva le route in `main.tsx`

```typescript
// Decommenta e implementa:
<Route path="/movie" element={<MovieCreator />} />
<Route path="/movie/create/:token" element={<MovieCreateWithToken />} />
```

### 3. Crea la struttura di pagine

Crea una nuova cartella `pages/movie/` con:
- `MovieCreator.tsx` - Pagina per creare poster (senza token)
- `MovieCreateWithToken.tsx` - Pagina per creare poster (con token)

Puoi copiare la struttura di `album/` come riferimento.

### 4. Implementa i componenti specifici

- Crea `components/MovieSearch.tsx` per cercare film
- Crea `components/MoviePosterGenerator.tsx` per generare il poster
- Crea i relativi servizi in `services/movieService.ts`

## 📝 Note

- Le route legacy `/music` e `/create/:token` sono mantenute per backward compatibility
- Ogni tipo di poster ha la sua cartella dedicata per mantenere il codice organizzato
- I tipi generici sono definiti in `types/poster.ts` per facilitare l'estensione


