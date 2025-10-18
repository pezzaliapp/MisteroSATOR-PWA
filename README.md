# 🌀 Il Mistero del SATOR — Quadrato Magico (PWA)

**Ideato e sviluppato da Alessandro Pezzali — pezzaliAPP (© 2025)**

> “Il SATOR non è solo un enigma. È un invito a leggere il mondo in ogni direzione.”

---

## 📖 Cos'è
Un gioco-esperienza ispirato al *Quadrato Magico* più famoso: **SATOR AREPO TENET OPERA ROTAS**.  
Palindromo perfetto: le cinque parole si leggono uguali in orizzontale e in verticale.

L’app è una **Progressive Web App** (PWA) *offline-ready* pensata per unire storia, logica e contemplazione.

---

## 🎮 Modalità di gioco
- **Quadrato** — scambia righe/colonne per ripristinare il quadrato perfetto.  
- **Lettere** — scambia due lettere (swap per-cella) come in un puzzle.  
- **Enigma** — evidenzia la croce TENET e, con **AΩ**, tutte le A e O (alfa/omega).  
- **Libero** — manipola senza vincoli; prova **Ruota 90°** per la rotazione dell’intera griglia.

**v2.3 Desk layout**: su desktop il pannello informativo è **a sinistra** e il gioco **a destra**, tutto visibile senza scroll.  
Su smartphone l’interfaccia è ottimizzata in colonna.

---

## 🧠 Breve storia del SATOR
Il quadrato SATOR è attestato a **Pompei** (I sec.), ricorre in **manoscritti medievali** e in vari edifici sacri europei.  
Interpretazioni celebri: lettura cristiana con **PATER NOSTER** e le lettere **A/Ω**, croce centrale sulla N;  
altre ipotesi spaziano da simboliche a cabalistiche. L’app rende **interattiva** questa eredità culturale.

---

## ⚙️ Struttura tecnica
- **Zero framework**: HTML5 + CSS3 + JavaScript puro
- **Service Worker**: cache-first con auto-aggiornamento
- **PWA installabile** su iOS/Android/macOS
- **Responsive**: griglia con `clamp()` e `dvh`, touch-target ≥48px

**File principali**
```
index.html, styles.css, app.js, sw.js, manifest.webmanifest,
icons/icon-192.png, icons/icon-512.png,
README.md, readme.html, LICENSE
```

---

## 🚀 Come si gioca (rapido)
1. **Mescola** la griglia.  
2. In **Quadrato** seleziona due righe (o due colonne) per scambiarle (**toggle Righe/Colonne**).  
3. In **Lettere** tocca due celle per scambiarle.  
4. Usa **Hint** per evidenziare righe/colonne corrette.  
5. **Controlla** per verificare la soluzione; il timer e le mosse sono tracciati.

---

## 🪪 Crediti & Licenza
© 2025 **Alessandro Pezzali — pezzaliAPP**  
Rilasciato con licenza **Creative Commons BY‑NC‑SA 4.0** (vedi `LICENSE`).

> Il design, la logica algoritmica e l’impianto narrativo sono opere originali tutelate (L. 633/41 — Italia).

---

## 🌐 Link
- Sito: https://www.alessandropezzali.it  
- GitHub: https://github.com/pezzaliapp  
- Autore Amazon: https://www.amazon.it/stores/Alessandro-Pezzali/author/B0FL13X4YR
