/* Il Mistero del SATOR — PWA game logic — v1.0 */
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
  const btnInstall = document.getElementById('btnInstall');

  let grid = [];          // 5x5 lettere
  let axis = 'row';       // row | col — modalità scambio
  let mode = 'quadrato';  // quadrato | enigma | libero
  let firstPick = null;
  let moves = 0;
  let startTs = Date.now();
  let timerId = 0;

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
  const clone = (m)=>m.map(r=>r.slice());
  const makeSquare = ()=>WORDS.map(w=>w.split(''));
  const rotate90 = (m)=>m[0].map((_,i)=>m.map(r=>r[i]).reverse());
  const transpose = (m)=>m[0].map((_,i)=>m.map(r=>r[i]));
  const isSator = (m)=>{
    for(let r=0;r<SIZE;r++){
      const row = m[r].join('');
      const col = m.map(rr=>rr[r]).join('');
      if (row !== WORDS[r] || col !== WORDS[r]) return false;
    }
    return true;
  };
  const toStr = (m)=>m.map(r=>r.join('')).join('\n');

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
          // evidenzia N centrale e palindromi TENET
          if (x===2 && y===2) d.classList.add('hint');
          if (WORDS[2][x]===grid[y][x] && (y===2 || x===2)) d.classList.add('pal');
        }
        boardEl.appendChild(d);
      });
    });
    if (hints && mode==='quadrato'){
      // evidenzia se una riga o colonna è corretta
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
    const rows=[0,1,2,3,4].sort(()=>Math.random()-.5);
    const cols=[0,1,2,3,4].sort(()=>Math.random()-.5);
    const out = Array.from({length:5},()=>Array(5).fill(''));
    for(let y=0;y<5;y++) for(let x=0;x<5;x++) out[y][x] = m[rows[y]][cols[x]];
    return out;
  }

  function reset(){
    grid = makeSquare();
    moves = 0; movesEl.textContent = moves;
    startTs = Date.now(); clearInterval(timerId); timerId = setInterval(tick,1000); tick();
    render(false);
  }

  function setMode(m){
    mode = m; modeLabel.textContent = m[0].toUpperCase()+m.slice(1);
    modeButtons.forEach(b=>b.classList.toggle('active', b.dataset.mode===m));
    render(false);
  }

  function swapAxis(){
    axis = axis==='row' ? 'col' : 'row';
    btnAxis.textContent = axis==='row' ? 'Righe' : 'Colonne';
  }

  function selectCell(e){
    const t = e.target;
    if (!t.classList.contains('cell')) return;
    // in modalità swap, scegli estremi della riga/colonna da scambiare
    const x = +t.dataset.x, y=+t.dataset.y;
    const key = axis==='row' ? y : x;

    if (firstPick===null){
      firstPick = key;
      markSelection(key);
    } else if (firstPick === key){
      clearSelection(); firstPick=null;
    } else {
      // esegui swap tra firstPick e key su axis
      if (axis==='row'){
        const tmp = grid[firstPick]; grid[firstPick]=grid[key]; grid[key]=tmp;
      } else {
        for(let r=0;r<5;r++){ const tmp=grid[r][firstPick]; grid[r][firstPick]=grid[r][key]; grid[r][key]=tmp; }
      }
      moves++; movesEl.textContent = moves; firstPick=null; clearSelection(); render(true);
      if (isSator(grid)){
        clearInterval(timerId);
        setTimeout(()=>alert(`🎉 Quadrato Magico ripristinato!\nMosse: ${moves}\nTempo:\u0020${timeEl.textContent}`), 50);
      }
    }
  }
  function markSelection(key){
    [...boardEl.children].forEach((c,idx)=>{
      const y=Math.floor(idx/5), x=idx%5;
      if ((axis==='row' && y===key) || (axis==='col' && x===key)) c.classList.add('sel');
    });
  }
  function clearSelection(){
    [...boardEl.children].forEach(c=>c.classList.remove('sel'));
  }

  // --- Buttons ---
  btnShuffle.addEventListener('click', ()=>{ grid=shuffleMatrix(grid); render(false); });
  btnHint.addEventListener('click', ()=>render(true));
  btnAxis.addEventListener('click', swapAxis);
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
  grid = shuffleMatrix(grid); render(false);
})();