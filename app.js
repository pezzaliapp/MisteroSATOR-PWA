/* Il Mistero del SATOR — PWA game logic — v2.1 */
(function(){
  'use strict';

  const WORDS = ['SATOR','AREPO','TENET','OPERA','ROTAS'];
  const SIZE = 5;
  const boardEl = document.getElementById('board');
  const timeEl = document.getElementById('time');
  const movesEl = document.getElementById('moves');
  const modeButtons = Array.from(document.querySelectorAll('button.tab'));
  const modeLabel = document.getElementById('modeLabel');
  const btnSwap = document.getElementById('swap');
  const btnCheck = document.getElementById('check');
  const btnReset = document.getElementById('reset');
  const btnShuffle = document.getElementById('shuffle');
  const btnHint = document.getElementById('hint');
  const btnAxis = document.getElementById('toggleAxis');
  const btnRotate = document.getElementById('btnRotate');
  const btnAO = document.getElementById('btnAO');
  const btnInstall = document.getElementById('btnInstall');

  let grid = [];          // 5x5 lettere
  let axis = 'row';       // row | col — modalità scambio (Quadrato)
  let mode = 'quadrato';  // quadrato | lettere | enigma | libero
  let firstPick = null;   // riga/colonna o cella a seconda della modalità
  let moves = 0;
  let startTs = Date.now();
  let timerId = 0;
  let showAO = false;     // evidenzia A e O (Alfa/Omega) in Enigma

  // --- PWA SW ---
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
  }
  // install prompt
  let deferredPrompt=null;
  window.addEventListener('beforeinstallprompt', (e)=>{
    e.preventDefault(); deferredPrompt = e; btnInstall.hidden=false;
  });
  btnInstall.addEventListener('click', async ()=>{
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice; deferredPrompt=null; btnInstall.hidden=true;
  });

  // --- Helpers ---
  const makeSquare = ()=>WORDS.map(w=>w.split(''));
  const isSator = (m)=>{
    for(let r=0;r<SIZE;r++){
      const row = m[r].join('');
      const col = m.map(rr=>rr[r]).join('');
      if (row !== WORDS[r] || col !== WORDS[r]) return false;
    }
    return true;
  };
  const rotate90 = (m)=> m[0].map((_,i)=>m.map(r=>r[i]).reverse());

  function pad(n){return String(n).padStart(2,'0')}
  function tick(){
    const s = Math.floor((Date.now()-startTs)/1000);
    timeEl.textContent = `${pad(Math.floor(s/60))}:${pad(s%60)}`;
  }

  function render(hints=false){
    boardEl.innerHTML='';
    grid.forEach((row,y)=>{
      row.forEach((ch,x)=>{
        const d = document.createElement('div');
        d.className='cell';
        d.textContent = ch;
        d.dataset.x = x; d.dataset.y = y;
        if (mode==='enigma'){
          // N centrale
          if (x===2 && y===2) d.classList.add('hint');
          // croce TENET
          if (y===2 || x===2){
            const letter = grid[y][x];
            if ((y===2 && WORDS[2][x]===letter) || (x===2 && WORDS[y][2]===letter))
              d.classList.add('pal');
          }
          if (showAO && (ch==='A' || ch==='O')) d.classList.add('ao');
        }
        boardEl.appendChild(d);
      });
    });
    if (hints && (mode==='quadrato' || mode==='lettere')){
      for(let i=0;i<SIZE;i++){
        const row = grid[i].join('');
        const col = grid.map(r=>r[i]).join('');
        if (row===WORDS[i]) highlightRow(i);
        if (col===WORDS[i]) highlightCol(i);
      }
    }
  }
  function highlightRow(i){
    [...boardEl.children].forEach((c,idx)=>{
      if (Math.floor(idx/5)===i) c.classList.add('hint');
    });
  }
  function highlightCol(i){
    [...boardEl.children].forEach((c,idx)=>{
      if (idx%5===i) c.classList.add('hint');
    });
  }

  function shuffleMatrix(m){
    const flat = m.flat();
    for(let i=flat.length-1;i>0;i--){ const j=(Math.random()* (i+1))|0; [flat[i],flat[j]]=[flat[j],flat[i]]; }
    const out = Array.from({length:5},()=>Array(5).fill(''));
    for(let y=0,k=0;y<5;y++) for(let x=0;x<5;x++,k++) out[y][x]=flat[k];
    return out;
  }

  function reset(){
    grid = makeSquare();
    moves = 0; movesEl.textContent = moves;
    startTs = Date.now(); clearInterval(timerId); timerId = setInterval(tick,1000); tick();
    render(false);
  }

  function setUIVisibility(){
    const rowToggle = document.getElementById('rowModeToggle');
    const swapBtn   = document.getElementById('swap');
    // mostra i tool extra in tutte le modalità; ma solo in Quadrato ha senso Axis/Swap
    if (mode==='quadrato'){
      btnAxis.style.display = 'inline-block';
      swapBtn.style.display = 'inline-block';
    } else {
      btnAxis.style.display = 'none';
      swapBtn.style.display = 'none';
    }
  }

  function setMode(m){
    mode = m; modeLabel.textContent = m[0].toUpperCase()+m.slice(1);
    modeButtons.forEach(b=>b.classList.toggle('active', b.dataset.mode===m));
    firstPick=null; clearSelection(); setUIVisibility();
    render(false);
  }

  function swapAxis(){
    axis = axis==='row' ? 'col' : 'row';
    btnAxis.textContent = axis==='row' ? 'Righe' : 'Colonne';
  }

  function selectCell(e){
    const t = e.target;
    if (!t.classList.contains('cell')) return;
    const x = +t.dataset.x, y=+t.dataset.y;

    if (mode==='quadrato'){
      // scegli riga/colonna
      const key = axis==='row' ? y : x;
      if (firstPick===null){
        firstPick = key; markSelection(key);
      } else if (firstPick === key){
        clearSelection(); firstPick=null;
      } else {
        if (axis==='row'){
          const tmp = grid[firstPick]; grid[firstPick]=grid[key]; grid[key]=tmp;
        } else {
          for(let r=0;r<5;r++){ const tmp=grid[r][firstPick]; grid[r][firstPick]=grid[r][key]; grid[r][key]=tmp; }
        }
        moves++; movesEl.textContent = moves; firstPick=null; clearSelection(); render(true);
        if (isSator(grid)){ clearInterval(timerId); setTimeout(()=>alert(`🎉 Quadrato Magico ripristinato!\nMosse: ${moves}\nTempo:\u0020${timeEl.textContent}`), 50); }
      }
      return;
    }

    if (mode==='lettere' || mode==='libero'){
      // swap lettera-lettera (in Libero non c'è vittoria)
      if (firstPick===null){
        firstPick = {x,y};
        [...boardEl.children].forEach((c,idx)=>{
          const yy=Math.floor(idx/5), xx=idx%5;
          if (xx===x && yy===y) c.classList.add('sel');
        });
      } else {
        const a = firstPick; firstPick=null;
        const tmp = grid[a.y][a.x]; grid[a.y][a.x] = grid[y][x]; grid[y][x]=tmp;
        moves++; movesEl.textContent = moves; clearSelection(); render(true);
        if (mode==='lettere' && isSator(grid)){ clearInterval(timerId); setTimeout(()=>alert(`🎉 Quadrato Magico ricomposto!\nMosse: ${moves}\nTempo:\u0020${timeEl.textContent}`), 50); }
      }
      return;
    }
    // enigma: nessuna azione oltre alla selezione visiva
  }

  function markSelection(key){
    [...boardEl.children].forEach((c,idx)=>{
      const y=Math.floor(idx/5), x=idx%5;
      if ((axis==='row' && y===key) || (axis==='col' && x===key)) c.classList.add('sel');
    });
  }
  function clearSelection(){
    [...boardEl.children].forEach(c=>c.classList.remove('sel','ao','pal','hint','sel'));
  }

  // --- Buttons ---
  btnShuffle.addEventListener('click', ()=>{ grid=shuffleMatrix(grid); render(false); });
  btnHint.addEventListener('click', ()=>render(true));
  btnAxis.addEventListener('click', swapAxis);
  btnRotate.addEventListener('click', ()=>{ grid = rotate90(grid); moves++; movesEl.textContent=moves; render(true); });
  btnAO.addEventListener('click', ()=>{ showAO = !showAO; render(true); });
  btnSwap.addEventListener('click', ()=>{ firstPick=null; clearSelection(); });
  btnCheck.addEventListener('click', ()=>{
    const ok = isSator(grid);
    alert(ok ? '✅ È un Quadrato Magico perfetto.' : '❌ Ancora no: righe e colonne devono formare SATOR/AREPO/TENET/OPERA/ROTAS.');
  });
  btnReset.addEventListener('click', reset);
  modeButtons.forEach(b=>b.addEventListener('click', ()=>setMode(b.dataset.mode)));

  boardEl.addEventListener('click', selectCell);

  // --- Init ---
  reset();
  // mescola leggermente per iniziare
  grid = shuffleMatrix(grid); render(false); setUIVisibility();
})();