# 🌀 Il Mistero del SATOR — Quadrato Magico (PWA)

**Ideato e sviluppato da Alessandro Pezzali — pezzaliAPP (© 2025)**  
PWA educativa e ludica ispirata al Quadrato Magico **SATOR AREPO TENET OPERA ROTAS**.  
Funziona offline, è installabile su iOS/Android/macOS ed è ottimizzata per touch e desktop.

---

## 📷 Panoramica
Il SATOR è un palindromo perfetto di cinque parole e cinque lettere ciascuna, leggibile in orizzontale e verticale.  
Questa app rende interattivo l’enigma con quattro modalità di gioco/esplorazione.

---

## 🎮 Istruzioni di gioco (precise)

### Modalità **Quadrato** (scambio **righe/colonne**)
1. **Seleziona righe**: clicca una cella in una riga → la riga si evidenzia; clicca una cella di **un’altra riga** → le **due righe si scambiano**.  
2. **Passa alle colonne**: usa il toggle **Righe/Colonne** e ripeti lo scambio sulle colonne.  
3. **Obiettivo**: righe **e** colonne devono leggere, nell’ordine:

SATOR
AREPO
TENET
OPERA
ROTAS

4. **Consiglio strategico**: fissa prima **TENET** al centro; poi sistema le restanti con scambi minimi.

### Modalità **Lettere** (swap **per-cella**)
- Tocca una cella (si evidenzia), poi tocca la seconda cella → le **due lettere si scambiano**.  
- L’obiettivo resta identico a Quadrato.

### Modalità **Enigma** (contemplativa)
- Evidenzia la **croce TENET** (orizzontale e verticale) e la **N centrale**.  
- Con il tasto **AΩ** si evidenziano tutte le **A** e **O** (Alfa/Omega).  
- Non ha condizione di vittoria: è una vista simbolica/storica.

### Modalità **Libero**
- Swap per-cella **senza vincoli**.  
- Tasto **Ruota 90°** per ruotare **l’intera griglia**.

**Strumenti comuni**
- **Mescola**: rimescola le lettere.  
- **Hint**: evidenzia righe/colonne già corrette.  
- **Controlla**: verifica se il quadrato è perfetto.  
- **Reset**: riparte dal quadrato originale.  
- HUD mostra **tempo**, **mosse** e **modalità**.

---

## 📱 Layout & Accessibilità
- **Desktop “desk unico”**: pannello info a **sinistra**, griglia a **destra**; nessun taglio (footer sticky).  
- **Mobile**: layout a colonna, touch-target ≥ 48 px, font scalati con `clamp()`.  
- Griglia con `aspect-ratio: 1/1`, `svh` per altezze affidabili, supporto a schermi piccoli e landscape.

---

## 🧠 Storia (in breve)
Il quadrato SATOR è attestato a **Pompei** (I sec.), ricorre in **manoscritti medievali** e in vari edifici sacri.  
Lettura cristiana: **PATER NOSTER** con **A/Ω** (Alfa/Omega) e croce sulla **N** centrale; esistono altre interpretazioni simboliche.

---

## ⚙️ Stack & struttura
- **HTML5 + CSS3 + JavaScript (vanilla)** — zero framework.  
- **Service Worker** cache-first con auto-update.  
- **Manifest PWA**, icone maskable.  

/ (root)
index.html
styles.css
app.js
sw.js
manifest.webmanifest
/icons
icon-192.png
icon-512.png
/docs
README.html
CREDITS.html
CHANGELOG.html
README.md
readme.html
LICENSE
CREDITS.md
CHANGELOG.md

### Avvio locale (statico)
- Serve **qualsiasi** server statico (es. `python -m http.server` o “Go Live” in VS Code).  
- Apri `http://localhost:8000/` → il SW si attiva, l’app funziona anche **offline** dopo il primo caricamento.  
- **Hard refresh** dopo ogni deploy per aggiornare la cache (SW).

---

## 🪪 Licenza & proprietà intellettuale
© 2025 **Alessandro Pezzali — pezzaliAPP**  
Distribuito con **Creative Commons BY-NC-SA 4.0**.  
Il **titolo**, il **concept**, il **design**, gli **asset** e la **logica di gioco** sono **proprietà intellettuale** dell’autore e rimangono tutelati.  
Vedi il file **`LICENSE`** per i termini completi (uso non commerciale, attribuzione obbligatoria, share-alike).

---

## 👤 Autore & link
- Sito: <https://www.alessandropezzali.it>  
- GitHub: <https://github.com/pezzaliapp>  
- Documentazione formattata: `readme.html`

---

## 🗒️ Changelog (estratto)
- **v2.4.4**: pulizia UX (brand testuale, pulsanti documentazione), fix link.  
- **v2.4.3**: istruzioni dettagliate, pagine HTML docs, licenza rivista.  
- **v2.4.1**: fix desktop (no tagli), logo → poi rimosso.  
- **v2.4**: About modal, CREDITS/CHANGELOG.  
- **v2.3**: layout a due colonne (desk).  
- **v2.2**: responsive & touch.  
- **v2.1**: Enigma (AΩ) + Ruota 90°.  
- **v2.0**: Quadrato + Lettere.  
- **v1.0**: prima release.
