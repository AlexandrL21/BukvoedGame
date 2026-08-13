(() => {
  "use strict";

  const LEVELS = [
    {word:"КОТ",clue:"Домашнее животное, которое ловит мышей.",category:"Слово по определению",zone:"Главный книжный зал",size:12,speed:390,distractors:2,obstacles:4},
    {word:"ДОМ",clue:"Здание, в котором живут люди.",category:"Слово по определению",zone:"Главный книжный зал",size:12,speed:380,distractors:2,obstacles:5},
    {word:"ЛЕС",clue:"Большая территория, покрытая деревьями.",category:"Слово по определению",zone:"Главный книжный зал",size:12,speed:370,distractors:3,obstacles:6},
    {word:"КНИГА",clue:"Её читают, перелистывая страницы.",category:"Слово по определению",zone:"Главный книжный зал",size:13,speed:360,distractors:3,obstacles:7},
    {word:"ШКОЛА",clue:"Место, где дети учатся и получают знания.",category:"Слово по определению",zone:"Главный книжный зал",size:13,speed:350,distractors:3,obstacles:8},
    {word:"УЧЕНИК",clue:"Человек, который учится в школе.",category:"Слово по определению",zone:"Проходы между стеллажами",size:14,speed:340,distractors:3,obstacles:10},
    {word:"СМЕЛЫЙ",clue:"Синоним слова «храбрый».",category:"Синонимы",zone:"Проходы между стеллажами",size:14,speed:335,distractors:4,obstacles:11},
    {word:"ГОРЯЧИЙ",clue:"Антоним слова «холодный».",category:"Антонимы",zone:"Проходы между стеллажами",size:14,speed:330,distractors:4,obstacles:12},
    {word:"МОСКВА",clue:"Столица России.",category:"Слово по определению",zone:"Проходы между стеллажами",size:15,speed:325,distractors:4,obstacles:13},
    {word:"МОЛОКО",clue:"Белый напиток, который получают от коровы.",category:"Словарные слова",zone:"Проходы между стеллажами",size:15,speed:320,distractors:4,obstacles:14},
    {word:"РАСТЕНИЕ",clue:"Живой организм, который обычно растёт в почве и получает энергию от света.",category:"Слово по определению",zone:"Старый книжный архив",size:16,speed:315,distractors:4,obstacles:16},
    {word:"ПРАЗДНИК",clue:"День, который отмечают в честь важного события.",category:"Словарные слова",zone:"Старый книжный архив",size:16,speed:310,distractors:5,obstacles:17},
    {word:"ПОГОДА",clue:"Состояние атмосферы в определённом месте и в определённое время.",category:"Словарные слова",zone:"Старый книжный архив",size:16,speed:305,distractors:5,obstacles:18},
    {word:"ДОБРЫЙ",clue:"Антоним слова «злой».",category:"Антонимы",zone:"Старый книжный архив",size:16,speed:300,distractors:5,obstacles:19},
    {word:"БИБЛИОТЕКА",clue:"Место, где хранятся книги и их можно взять для чтения.",category:"Слово по определению",zone:"Старый книжный архив",size:17,speed:295,distractors:5,obstacles:20},
    {word:"ПУТЕШЕСТВИЕ",clue:"Поездка или передвижение в далёкие места.",category:"Слово по определению",zone:"Большой читальный зал",size:18,speed:290,distractors:5,obstacles:20},
    {word:"АККУРАТНЫЙ",clue:"Человек, который соблюдает порядок и делает всё тщательно.",category:"Слово по определению",zone:"Большой читальный зал",size:18,speed:285,distractors:6,obstacles:21},
    {word:"КОЛЛЕКТИВ",clue:"Группа людей, объединённых общей работой или деятельностью.",category:"Слово по определению",zone:"Большой читальный зал",size:18,speed:280,distractors:6,obstacles:22},
    {word:"ВОКЗАЛ",clue:"Здание, где пассажиры ожидают поезд или другой транспорт.",category:"Словарные слова",zone:"Большой читальный зал",size:18,speed:275,distractors:6,obstacles:23},
    {word:"ЭНЦИКЛОПЕДИЯ",clue:"Издание, содержащее сведения по разным областям знаний.",category:"Слово по определению",zone:"Большой читальный зал",size:19,speed:270,distractors:6,obstacles:24}
  ];
  const ALPHABET = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".split("");
  const $ = id => document.getElementById(id);
  const canvas = $("gameCanvas");
  const ctx = canvas.getContext("2d");
  const ui = {
    zone:$("zoneLabel"),level:$("levelNumber"),stars:$("levelStars"),category:$("categoryLabel"),clue:$("clueText"),word:$("wordDisplay"),
    lives:$("livesDisplay"),score:$("scoreDisplay"),errors:$("errorsDisplay"),hint:$("hintBtn"),hintText:$("hintText"),eraser:$("eraserCard"),eraserText:$("eraserText"),
    progress:$("progressFill"),progressText:$("progressText"),zoneProgress:$("zoneProgress"),status:$("statusText"),pauseOverlay:$("pauseOverlay"),
    intro:$("introModal"),levelModal:$("levelModal"),levelGrid:$("levelGrid"),result:$("resultModal"),resultEmoji:$("resultEmoji"),resultEyebrow:$("resultEyebrow"),
    resultTitle:$("resultTitle"),resultWord:$("resultWord"),resultStars:$("resultStars"),resultText:$("resultText"),next:$("nextLevelBtn"),sound:$("soundBtn"),pause:$("pauseBtn"),toast:$("toast")
  };
  const SAVE_KEY = "bukvoed-save-v1";
  const state = {levelIndex:0,level:LEVELS[0],snake:[],direction:{x:1,y:0},nextDirection:{x:1,y:0},letters:[],obstacles:[],collected:0,lives:3,errors:0,score:0,hintAvailable:true,hintUntil:0,eraserAvailable:true,started:false,paused:false,finished:false,resultWon:false,timer:null,muted:false,animType:"",animStart:0,animUntil:0,save:loadSave()};

  function loadSave(){
    try{const d=JSON.parse(localStorage.getItem(SAVE_KEY)||"{}");return{unlocked:Math.max(1,Math.min(LEVELS.length,d.unlocked||1)),stars:d.stars||{},bestScores:d.bestScores||{},introSeen:!!d.introSeen};}
    catch{return{unlocked:1,stars:{},bestScores:{},introSeen:false};}
  }
  function persist(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state.save));}catch{}}
  function key(p){return `${p.x},${p.y}`;} function eq(a,b){return a.x===b.x&&a.y===b.y;}
  function seededRandom(seed){let t=seed+0x6D2B79F5;return()=>{t+=0x6D2B79F5;let r=t;r=Math.imul(r^r>>>15,r|1);r^=r+Math.imul(r^r>>>7,r|61);return((r^r>>>14)>>>0)/4294967296;};}

  function resetLevel(index=state.levelIndex){
    stopLoop();
    index = Math.max(0, Math.min(index, state.save.unlocked - 1, LEVELS.length - 1));
    state.levelIndex=index; state.level=LEVELS[index]; state.collected=0; state.lives=3; state.errors=0; state.score=0;
    state.hintAvailable=true; state.hintUntil=0; state.eraserAvailable=true; state.started=false; state.paused=false; state.finished=false; state.resultWon=false; state.animType=""; state.animStart=0; state.animUntil=0;
    state.direction={x:1,y:0}; state.nextDirection={x:1,y:0}; buildObstacles(); resetSnake(); spawnLetters(); refreshUI(); draw(); ui.pauseOverlay.classList.add("hidden"); setStatus("Найди первую букву слова.");
  }

  function resetSnake(){
    const size=state.level.size, len=Math.min(3+state.collected,Math.max(3,Math.floor(size/2))), y=Math.floor(size/2), headX=Math.max(len,Math.floor(size*.35));
    state.snake=[]; for(let i=0;i<len;i++)state.snake.push({x:headX-i,y}); state.direction={x:1,y:0};state.nextDirection={x:1,y:0};
  }

  function buildObstacles(){
    const {size,obstacles}=state.level, rand=seededRandom((state.levelIndex+1)*9137), blocked=new Set(), safeY=Math.floor(size/2), safe=new Set();
    for(let x=0;x<Math.floor(size*.45)+3;x++){safe.add(`${x},${safeY}`);safe.add(`${x},${safeY-1}`);safe.add(`${x},${safeY+1}`);}
    let tries=0; while(blocked.size<obstacles&&tries<4000){tries++;const x=Math.floor(rand()*size),y=Math.floor(rand()*size),k=`${x},${y}`;if(safe.has(k))continue;blocked.add(k);if(largestFreeComponent(blocked,size)<size*size-blocked.size-4)blocked.delete(k);}
    state.obstacles=[...blocked].map(s=>{const [x,y]=s.split(",").map(Number);return{x,y};});
  }

  function largestFreeComponent(blocked,size){
    const seen=new Set();let best=0;
    for(let y=0;y<size;y++)for(let x=0;x<size;x++){const k=`${x},${y}`;if(blocked.has(k)||seen.has(k))continue;let count=0,q=[{x,y}];seen.add(k);while(q.length){const p=q.shift();count++;for(const d of [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}]){const n={x:p.x+d.x,y:p.y+d.y},nk=key(n);if(n.x<0||n.y<0||n.x>=size||n.y>=size||blocked.has(nk)||seen.has(nk))continue;seen.add(nk);q.push(n);}}best=Math.max(best,count);}return best;
  }

  function reachableCells(){
    const size=state.level.size, blocked=new Set(state.obstacles.map(key));state.snake.slice(1).forEach(p=>blocked.add(key(p)));
    const start=state.snake[0],q=[start],seen=new Set([key(start)]),out=[];while(q.length){const p=q.shift();for(const d of [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}]){const n={x:p.x+d.x,y:p.y+d.y},nk=key(n);if(n.x<0||n.y<0||n.x>=size||n.y>=size||blocked.has(nk)||seen.has(nk))continue;seen.add(nk);q.push(n);out.push(n);}}return out;
  }

  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function randomDistractor(used){const target=state.level.word[state.collected],pool=ALPHABET.filter(c=>c!==target&&!used.has(c));return pool[Math.floor(Math.random()*pool.length)]||"Я";}

  function spawnLetters(){
    const needed=state.level.word[state.collected];if(!needed)return;const occupied=new Set([...state.obstacles.map(key),...state.snake.map(key)]),available=shuffle(reachableCells().filter(p=>!occupied.has(key(p))));state.letters=[];if(!available.length)return;
    state.letters.push({...available.shift(),char:needed,correct:true});const count=Math.min(state.level.distractors,available.length),used=new Set([needed]);for(let i=0;i<count;i++){const ch=randomDistractor(used);used.add(ch);state.letters.push({...available.shift(),char:ch,correct:false});}
  }

  function setDirection(x,y){if(state.finished||state.paused)return;if(state.direction.x+x===0&&state.direction.y+y===0)return;if(!state.started){state.started=true;startLoop();}state.nextDirection={x,y};}
  function tick(){
    if(state.paused||state.finished||!state.started)return;state.direction=state.nextDirection;const h=state.snake[0],next={x:h.x+state.direction.x,y:h.y+state.direction.y};
    if(isCollision(next)){loseLife("Столкновение! Буквоед возвращается на безопасное место.");return;}
    const idx=state.letters.findIndex(l=>l.x===next.x&&l.y===next.y),letter=idx>=0?state.letters[idx]:null;state.snake.unshift(next);
    if(letter){if(letter.char===state.level.word[state.collected])collectCorrect(letter);else{state.snake.pop();collectWrong(letter);}}else state.snake.pop();draw();
  }
  function isCollision(p){const s=state.level.size;if(p.x<0||p.y<0||p.x>=s||p.y>=s)return true;if(state.obstacles.some(o=>eq(o,p)))return true;if(state.snake.some(v=>eq(v,p)))return true;return false;}

  function triggerAnimation(type,duration){
    state.animType=type;
    state.animStart=performance.now();
    state.animUntil=state.animStart+duration;
  }

  function collectCorrect(letter){
    state.collected++;
    state.score+=100;
    triggerAnimation("bite",380);
    beep(620,.05);
    toast(`Верно: ${letter.char}`);
    if(state.collected>=state.level.word.length){
      winLevel();
      return;
    }
    spawnLetters();
    refreshUI();
    setStatus(`Верно. Теперь найди букву «${state.level.word[state.collected]}».`);
  }

  function collectWrong(letter){
    state.errors++;
    triggerAnimation("error",480);
    beep(170,.09);
    if(state.eraserAvailable){
      state.eraserAvailable=false;
      toast(`Ластик спас жизнь: «${letter.char}» не подходит`);
      setStatus("Ластик сработал автоматически. Нужная буква не изменилась.");
    }else{
      state.lives--;
      toast(`Ошибка: «${letter.char}» не подходит`);
      setStatus(`Неверная буква. Осталось жизней: ${state.lives}.`);
    }
    state.letters=state.letters.filter(l=>l!==letter);
    if(!state.letters.some(l=>l.char===state.level.word[state.collected])||state.letters.length<2)spawnLetters();
    refreshUI();
    if(state.lives<=0)loseLevel();
  }

  function loseLife(message){
    state.errors++;
    state.lives--;
    triggerAnimation("error",520);
    beep(130,.12);
    refreshUI();
    if(state.lives<=0){
      loseLevel();
      return;
    }
    stopLoop();
    state.started=false;
    resetSnake();
    spawnLetters();
    setStatus(`${message} Осталось жизней: ${state.lives}.`);
    toast("Потеряна жизнь");
  }

  function useHint(){if(!state.hintAvailable||state.finished)return;state.hintAvailable=false;state.hintUntil=performance.now()+3200;refreshUI();setStatus(`Подсказка: ищи букву «${state.level.word[state.collected]}».`);beep(800,.07);}

  function winLevel(){
    state.finished=true;
    state.resultWon=true;
    stopLoop();
    triggerAnimation("victory",950);
    const stars=Math.max(1,3-Math.min(2,state.errors));
    state.score+=500+state.lives*100;
    const k=String(state.levelIndex);
    state.save.stars[k]=Math.max(state.save.stars[k]||0,stars);
    state.save.bestScores[k]=Math.max(state.save.bestScores[k]||0,state.score);
    state.save.unlocked=Math.max(state.save.unlocked,Math.min(LEVELS.length,state.levelIndex+2));
    persist();
    refreshUI();
    beep(880,.08);
    setTimeout(()=>beep(1040,.08),100);
    setTimeout(()=>beep(1280,.12),210);
    setTimeout(()=>{if(state.finished&&state.resultWon)showResult(true,stars);},900);
  }

  function loseLevel(){
    state.finished=true;
    state.resultWon=false;
    stopLoop();
    triggerAnimation("defeat",850);
    setTimeout(()=>{if(state.finished&&!state.resultWon)showResult(false,0);},800);
  }

  function showResult(won,stars){
    state.resultWon = won;
    ui.next.hidden = !won;
    ui.result.classList.remove("hidden");ui.resultEmoji.textContent=won?"✨":"📚";ui.resultEyebrow.textContent=won?"Слово восстановлено":"Попробуем ещё раз";ui.resultTitle.textContent=won?"Отличная работа!":"Буквы снова рассыпались";ui.resultWord.textContent=won?state.level.word:state.level.word.slice(0,state.collected)+"…";ui.resultStars.textContent=won?"★".repeat(stars)+"☆".repeat(3-stars):"☆☆☆";ui.resultText.textContent=won?`Ты восстановил слово и получил ${state.score} очков. Ошибок: ${state.errors}.`:`Жизни закончились. Собрано букв: ${state.collected} из ${state.level.word.length}.`;ui.next.textContent=state.levelIndex===LEVELS.length-1?"К карте уровней":"Следующий уровень";
  }

  function togglePause(force){if(state.finished)return;state.paused=typeof force==="boolean"?force:!state.paused;ui.pauseOverlay.classList.toggle("hidden",!state.paused);ui.pause.textContent=state.paused?"▶":"Ⅱ";if(state.paused)stopLoop();else if(state.started)startLoop();}
  function startLoop(){stopLoop();state.timer=setInterval(tick,state.level.speed);} function stopLoop(){if(state.timer){clearInterval(state.timer);state.timer=null;}}

  function refreshUI(){
    const l=state.level;ui.zone.textContent=l.zone;ui.level.textContent=state.levelIndex+1;ui.category.textContent=l.category;ui.clue.textContent=l.clue;ui.word.innerHTML="";[...l.word].forEach((ch,i)=>{const c=document.createElement("span");c.className="word-cell"+(i<state.collected?" filled":"");c.textContent=i<state.collected?ch:"";ui.word.appendChild(c);});
    ui.lives.textContent="❤".repeat(Math.max(0,state.lives))+"♡".repeat(Math.max(0,3-state.lives));ui.score.textContent=state.score;ui.errors.textContent=state.errors;ui.hint.disabled=!state.hintAvailable;ui.hintText.textContent=state.hintAvailable?"1 раз за уровень":"Использована";ui.eraser.classList.toggle("used",!state.eraserAvailable);ui.eraserText.textContent=state.eraserAvailable?"Готов спасти от ошибки":"Уже использован";
    const completed=Object.keys(state.save.stars).filter(k=>state.save.stars[k]>0).length;ui.progress.style.width=`${completed/LEVELS.length*100}%`;ui.progressText.textContent=`${completed} из ${LEVELS.length} уровней`;ui.zoneProgress.textContent=`Зал ${Math.floor(state.levelIndex/5)+1}/4`;const best=state.save.stars[String(state.levelIndex)]||0;ui.stars.textContent="★".repeat(best)+"☆".repeat(3-best);buildLevelGrid();
  }
  function buildLevelGrid(){ui.levelGrid.innerHTML="";LEVELS.forEach((lvl,i)=>{const b=document.createElement("button"),unlocked=i<state.save.unlocked,stars=state.save.stars[String(i)]||0;b.className="level-btn"+(!unlocked?" locked":"")+(i===state.levelIndex?" current":"");b.disabled=!unlocked;b.innerHTML=`<span>${i+1}</span><small>${unlocked?"★".repeat(stars)+"☆".repeat(3-stars):"🔒"}</small>`;b.onclick=()=>{if(!unlocked)return;ui.levelModal.classList.add("hidden");resetLevel(i);};ui.levelGrid.appendChild(b);});}
  function setStatus(t){ui.status.textContent=t;} function toast(t){ui.toast.textContent=t;ui.toast.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>ui.toast.classList.remove("show"),1500);}

  function draw(){
    const {size,zone}=state.level,w=canvas.width,cell=w/size,now=performance.now();
    const zoneIndex=Math.floor(state.levelIndex/5);
    const localLevel=state.levelIndex%5;
    const palettes=[
      {top:"#e1bf84",bottom:"#a97850",grid:"rgba(82,49,28,.13)",border:"#6e452c"},
      {top:"#c9a46e",bottom:"#76513a",grid:"rgba(65,42,29,.15)",border:"#513423"},
      {top:"#9f876c",bottom:"#57483d",grid:"rgba(42,35,30,.18)",border:"#40332b"},
      {top:"#e6c992",bottom:"#a47750",grid:"rgba(76,49,28,.12)",border:"#725034"}
    ];
    const pal=palettes[zoneIndex]||palettes[0];

    ctx.clearRect(0,0,w,w);
    const g=ctx.createLinearGradient(0,0,0,w);g.addColorStop(0,pal.top);g.addColorStop(1,pal.bottom);ctx.fillStyle=g;ctx.fillRect(0,0,w,w);
    drawZoneBackdrop(w,zoneIndex,localLevel,cell);

    ctx.strokeStyle=pal.grid;ctx.lineWidth=1;
    for(let i=0;i<=size;i++){
      ctx.beginPath();ctx.moveTo(i*cell,0);ctx.lineTo(i*cell,w);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,i*cell);ctx.lineTo(w,i*cell);ctx.stroke();
    }

    state.obstacles.forEach((o,i)=>drawObstacle(o,cell,zoneIndex,i));
    state.letters.forEach(l=>drawLetter(l,cell,now));
    drawSnake(cell,now);
    drawZoneForeground(w,zoneIndex,localLevel);
  }

  function drawZoneBackdrop(w,zoneIndex,localLevel,cell){
    ctx.save();
    if(zoneIndex===0) drawMainHall(w,localLevel);
    else if(zoneIndex===1) drawShelfAisles(w,localLevel);
    else if(zoneIndex===2) drawOldArchive(w,localLevel);
    else drawReadingHall(w,localLevel);
    ctx.restore();
  }

  function drawMainHall(w,localLevel){
    // Парадный зал: высокий книжный фонд, ковёр и тёплые люстры.
    ctx.save();
    ctx.globalAlpha=.20;
    ctx.fillStyle="#493020";
    for(const x of [0,w*.76]){
      ctx.fillRect(x,0,w*.24,w);
      for(let y=w*.03;y<w*.92;y+=w*.13){
        ctx.fillStyle="#5a3825";ctx.fillRect(x,y,w*.24,w*.025);
        for(let bx=x+w*.02;bx<x+w*.22;bx+=w*.035){
          const colors=["#7b3f38","#31584e","#a0723d","#4a5772"];
          ctx.fillStyle=colors[(Math.floor((bx+y)/12)+localLevel)%colors.length];
          ctx.fillRect(bx,y-w*.055,w*.024,w*.055);
        }
      }
    }
    ctx.globalAlpha=.17;
    ctx.fillStyle=localLevel<3?"#8c2f2f":"#426a4d";
    roundRect(w*.30,w*.08,w*.40,w*.84,w*.035);ctx.fill();
    ctx.globalAlpha=.34;ctx.strokeStyle="#f5df9b";ctx.lineWidth=w*.006;
    for(const x of [w*.38,w*.62]){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,w*.08);ctx.stroke();ctx.fillStyle="#f0cb69";ctx.beginPath();ctx.arc(x,w*.10,w*.025,0,Math.PI*2);ctx.fill();}
    // По мере прохождения всё меньше разбросанных книг.
    const fallen=5-localLevel;
    ctx.globalAlpha=.28;
    for(let i=0;i<fallen;i++){const x=w*(.27+i*.11),y=w*(.18+(i%2)*.62);ctx.save();ctx.translate(x,y);ctx.rotate((i%2?-.18:.22));ctx.fillStyle=i%2?"#7c3e39":"#3c6258";ctx.fillRect(-w*.035,-w*.012,w*.07,w*.024);ctx.restore();}
    ctx.restore();
  }

  function drawShelfAisles(w,localLevel){
    // Узкие длинные проходы между высокими стеллажами.
    ctx.save();ctx.globalAlpha=.24;
    const shelfW=w*.13;
    for(const x of [w*.02,w*.22,w*.65,w*.85]){
      ctx.fillStyle="#4b3021";ctx.fillRect(x,0,shelfW,w);
      for(let y=w*.025;y<w;y+=w*.105){
        ctx.fillStyle="#68442d";ctx.fillRect(x,y,shelfW,w*.018);
        for(let bx=x+w*.01;bx<x+shelfW-w*.01;bx+=w*.025){
          ctx.fillStyle=((Math.floor((bx+y)/10)+localLevel)%3===0)?"#355c53":"#81433e";
          ctx.fillRect(bx,y-w*.047,w*.017,w*.047);
        }
      }
    }
    ctx.globalAlpha=.13;ctx.fillStyle="#ead7aa";
    roundRect(w*.39,0,w*.21,w,w*.02);ctx.fill();
    // Библиотечные указатели меняются от уровня к уровню.
    ctx.globalAlpha=.38;ctx.fillStyle="#efe1bc";ctx.fillRect(w*.405,w*.04,w*.18,w*.055);
    ctx.fillStyle="#5e4431";ctx.font=`700 ${Math.floor(w*.025)}px system-ui`;ctx.textAlign="center";ctx.fillText(`СТЕЛЛАЖ ${localLevel+1}`,w*.495,w*.076);
    // Зелёные лампы в проходах.
    ctx.globalAlpha=.28;for(const y of [w*.25,w*.72]){ctx.fillStyle="#365c49";roundRect(w*.455,y,w*.08,w*.025,w*.01);ctx.fill();ctx.fillStyle="#eadb91";ctx.fillRect(w*.49,y+w*.025,w*.01,w*.055);}
    ctx.restore();
  }

  function drawOldArchive(w,localLevel){
    // Архив: темнее, коробки, пыль, старые документы и паутина.
    ctx.save();ctx.globalAlpha=.22;
    ctx.fillStyle="#3e342d";for(const x of [0,w*.79])ctx.fillRect(x,0,w*.21,w);
    ctx.strokeStyle="#d5c4a0";ctx.lineWidth=w*.003;ctx.globalAlpha=.15;
    for(let i=0;i<4;i++){
      const ox=(i%2)*w*.82+w*.04, oy=(Math.floor(i/2))*w*.62+w*.08;
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.quadraticCurveTo(ox+w*.08,oy+w*.02,ox+w*.14,oy+w*.10);ctx.stroke();
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.quadraticCurveTo(ox+w*.02,oy+w*.08,ox+w*.14,oy+w*.10);ctx.stroke();
    }
    ctx.globalAlpha=.23;
    for(let i=0;i<5+localLevel;i++){
      const x=((i*137+localLevel*53)%90+5)/100*w,y=((i*83+localLevel*31)%88+6)/100*w;
      ctx.fillStyle="#d9c59c";ctx.beginPath();ctx.arc(x,y,w*(.0025+(i%3)*.001),0,Math.PI*2);ctx.fill();
    }
    // Архивные коробки по краям.
    for(let i=0;i<3;i++){
      ctx.globalAlpha=.27;ctx.fillStyle="#8a6846";roundRect(w*(.02+i*.055),w*(.72+i*.045),w*.08,w*.065,w*.008);ctx.fill();
      ctx.fillStyle="#d6c198";ctx.fillRect(w*(.04+i*.055),w*(.745+i*.045),w*.038,w*.012);
    }
    // По мере восстановления становится чуть светлее.
    ctx.globalAlpha=.05+.025*localLevel;ctx.fillStyle="#f1dca7";ctx.fillRect(0,0,w,w);
    ctx.restore();
  }

  function drawReadingHall(w,localLevel){
    // Большой читальный зал: окна, длинные столы, лампы и светлый паркет.
    ctx.save();ctx.globalAlpha=.22;
    for(const x of [w*.06,w*.36,w*.66]){
      ctx.fillStyle="#d7c89b";roundRect(x,w*.025,w*.24,w*.15,w*.02);ctx.fill();
      ctx.fillStyle="#7690a1";roundRect(x+w*.015,w*.04,w*.21,w*.12,w*.015);ctx.fill();
      ctx.strokeStyle="#e9e0c1";ctx.lineWidth=w*.006;ctx.beginPath();ctx.moveTo(x+w*.12,w*.04);ctx.lineTo(x+w*.12,w*.16);ctx.stroke();
    }
    ctx.globalAlpha=.18;ctx.fillStyle="#6b472e";
    for(const y of [w*.31,w*.66]){roundRect(w*.18,y,w*.64,w*.075,w*.018);ctx.fill();for(const x of [w*.28,w*.48,w*.68]){ctx.fillStyle="#315c48";roundRect(x,y-w*.045,w*.08,w*.025,w*.01);ctx.fill();ctx.fillStyle="#d5bd70";ctx.fillRect(x+w*.035,y-w*.02,w*.01,w*.02);ctx.fillStyle="#6b472e";}}
    // В поздних уровнях читальный зал постепенно выглядит восстановленным.
    ctx.globalAlpha=.10+.025*localLevel;ctx.fillStyle="#fff0bc";ctx.fillRect(0,0,w,w);
    ctx.globalAlpha=.18;ctx.fillStyle="#8b3f35";roundRect(w*.40,w*.20,w*.20,w*.58,w*.03);ctx.fill();
    ctx.restore();
  }

  function drawZoneForeground(w,zoneIndex,localLevel){
    ctx.save();
    // Небольшая атмосферная рамка по зонам, не перекрывающая поле.
    if(zoneIndex===2){ctx.globalAlpha=.10;const g=ctx.createRadialGradient(w/2,w/2,w*.20,w/2,w/2,w*.70);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"#1f1915");ctx.fillStyle=g;ctx.fillRect(0,0,w,w);}
    if(zoneIndex===3){ctx.globalAlpha=.07;ctx.fillStyle="#fff3c8";ctx.fillRect(0,0,w,w);}
    ctx.restore();
  }

  function drawObstacle(o,c,zoneIndex,index){
    const x=o.x*c,y=o.y*c,p=c*.10;
    ctx.save();
    if(zoneIndex===0){
      // Упавшая стопка книг.
      ctx.shadowColor="rgba(45,29,18,.22)";ctx.shadowBlur=c*.10;ctx.shadowOffsetY=c*.06;
      const colors=["#7c403b","#31594f","#ba8346"];
      for(let i=0;i<3;i++){ctx.fillStyle=colors[(index+i)%colors.length];roundRect(x+p*(1+i*.35),y+c*(.24+i*.18),c*.72-i*c*.06,c*.16,c*.04);ctx.fill();}
    } else if(zoneIndex===1){
      // Выступающий край книжного стеллажа.
      ctx.fillStyle="#4d3122";roundRect(x+p,y+p,c-p*2,c-p*2,c*.08);ctx.fill();
      ctx.fillStyle="#765039";ctx.fillRect(x+c*.16,y+c*.20,c*.68,c*.10);ctx.fillRect(x+c*.16,y+c*.48,c*.68,c*.10);ctx.fillRect(x+c*.16,y+c*.75,c*.68,c*.08);
      ctx.fillStyle="#9b4d45";ctx.fillRect(x+c*.22,y+c*.30,c*.10,c*.18);ctx.fillStyle="#3f675a";ctx.fillRect(x+c*.36,y+c*.28,c*.11,c*.20);ctx.fillStyle="#c18d47";ctx.fillRect(x+c*.52,y+c*.32,c*.09,c*.16);
    } else if(zoneIndex===2){
      // Архивная коробка со старой этикеткой.
      ctx.shadowColor="rgba(20,15,12,.25)";ctx.shadowBlur=c*.08;ctx.fillStyle="#806247";roundRect(x+p,y+p,c-p*2,c-p*2,c*.08);ctx.fill();
      ctx.strokeStyle="#564334";ctx.lineWidth=Math.max(1,c*.035);ctx.stroke();ctx.fillStyle="#d8c69e";roundRect(x+c*.26,y+c*.38,c*.48,c*.22,c*.03);ctx.fill();ctx.fillStyle="#6f5a45";ctx.fillRect(x+c*.34,y+c*.46,c*.32,c*.035);
    } else {
      // Стол/кресло читального зала.
      ctx.fillStyle="#70492f";roundRect(x+c*.10,y+c*.30,c*.80,c*.35,c*.08);ctx.fill();ctx.fillRect(x+c*.20,y+c*.62,c*.09,c*.25);ctx.fillRect(x+c*.70,y+c*.62,c*.09,c*.25);
      ctx.fillStyle="#2f5c48";roundRect(x+c*.36,y+c*.12,c*.28,c*.12,c*.05);ctx.fill();ctx.fillStyle="#d5bd70";ctx.fillRect(x+c*.485,y+c*.24,c*.03,c*.12);
    }
    ctx.restore();
  }

  function drawLetter(l,c,now){const x=l.x*c+c/2,y=l.y*c+c/2,h=l.correct&&now<state.hintUntil,s=c*(h?.82+Math.sin(now/120)*.05:.75);ctx.save();ctx.translate(x,y);if(h){ctx.shadowColor="#fff39a";ctx.shadowBlur=26;ctx.fillStyle="rgba(255,246,151,.55)";ctx.beginPath();ctx.arc(0,0,c*.48,0,Math.PI*2);ctx.fill();}ctx.shadowColor="rgba(54,33,19,.22)";ctx.shadowBlur=8;ctx.shadowOffsetY=4;ctx.fillStyle="#fff1bc";roundRect(-s/2,-s/2,s,s,c*.14);ctx.fill();ctx.shadowColor="transparent";ctx.lineWidth=Math.max(2,c*.04);ctx.strokeStyle="#a97b43";ctx.stroke();ctx.fillStyle="#493122";ctx.font=`900 ${Math.floor(c*.46)}px system-ui`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(l.char,0,2);ctx.restore();}
  function drawSnake(c,now){
    const animActive=state.animType&&now<state.animUntil;
    const animType=animActive?state.animType:"";
    const progress=animActive?Math.min(1,(now-state.animStart)/Math.max(1,state.animUntil-state.animStart)):1;
    const moving=state.started&&!state.paused&&!state.finished;
    const f=state.direction;
    const side={x:-f.y,y:f.x};

    let globalShake=0,globalLift=0,globalScale=1;
    if(animType==="error"){
      globalShake=Math.sin(progress*Math.PI*8)*(1-progress)*c*.13;
    }else if(animType==="victory"){
      globalLift=-Math.abs(Math.sin(progress*Math.PI*4))*c*.22;
      globalScale=1+Math.sin(progress*Math.PI*4)*.07;
    }else if(animType==="defeat"){
      globalLift=progress*c*.10;
    }

    const headBase=state.snake[0];
    if(!headBase)return;

    for(let i=state.snake.length-1;i>=0;i--){
      const p=state.snake[i];
      const phase=now/145-i*.72;
      const wave=(moving?Math.sin(phase)*c*.055:Math.sin(now/520-i*.55)*c*.018);
      const idleBob=Math.sin(now/420+i*.35)*c*.012;

      let x=p.x*c+c/2+side.x*wave+side.x*globalShake;
      let y=p.y*c+c/2+side.y*wave+side.y*globalShake+idleBob+globalLift;

      if(animType==="defeat")y+=Math.min(i,6)*c*.018*progress;

      let r=c*(i===0?.39:.34)*globalScale;
      if(animType==="bite"&&i===0)r*=1+Math.sin(progress*Math.PI)*.16;

      ctx.save();
      ctx.shadowColor="rgba(36,63,33,.20)";
      ctx.shadowBlur=5;
      ctx.shadowOffsetY=3;

      if(animType==="error")ctx.fillStyle=i===0?"#b96d64":(i%2?"#a97b70":"#9d6860");
      else if(animType==="defeat")ctx.fillStyle=i===0?"#778471":(i%2?"#879280":"#707c6b");
      else ctx.fillStyle=i===0?"#79a96d":(i%2?"#8ab77b":"#6fa264");

      ctx.beginPath();
      ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fill();

      if(i>0){
        ctx.shadowColor="transparent";
        ctx.globalAlpha=.18;
        ctx.fillStyle="#eff6d9";
        ctx.beginPath();
        ctx.arc(x-r*.25,y-r*.28,r*.24,0,Math.PI*2);
        ctx.fill();
        ctx.globalAlpha=1;
      }

      if(i===0){
        ctx.shadowColor="transparent";
        const eyeOffset=c*.13;
        const blinkPhase=now%3600;
        const blinking=blinkPhase>3250&&blinkPhase<3380&&animType!=="victory";
        const sad=animType==="defeat";
        const surprised=animType==="error";

        for(const sign of [-1,1]){
          const ex=x+f.x*c*.12+side.x*eyeOffset*sign;
          const ey=y+f.y*c*.12+side.y*eyeOffset*sign;

          if(blinking||sad){
            ctx.strokeStyle="#2f261f";
            ctx.lineWidth=Math.max(2,c*.035);
            ctx.beginPath();
            ctx.moveTo(ex-side.x*c*.055,ey-side.y*c*.055);
            ctx.lineTo(ex+side.x*c*.055,ey+side.y*c*.055);
            ctx.stroke();
          }else{
            ctx.fillStyle="#fff";
            ctx.beginPath();
            ctx.ellipse(ex,ey,c*.086,surprised?c*.10:c*.086,0,0,Math.PI*2);
            ctx.fill();
            ctx.fillStyle="#2f261f";
            ctx.beginPath();
            ctx.arc(ex+f.x*c*.022,ey+f.y*c*.022,c*.035,0,Math.PI*2);
            ctx.fill();
          }
        }

        // Рот строится напрямую по векторам направления.
        // f — направление движения головы, side — перпендикуляр к нему.
        // Поэтому и позиция, и форма рта действительно меняются при каждом повороте.
        const mouthCenter = {
          x: x + f.x*c*.23,
          y: y + f.y*c*.23
        };

        const mouthPoint = (forwardOffset, sideOffset) => ({
          x: mouthCenter.x + f.x*forwardOffset + side.x*sideOffset,
          y: mouthCenter.y + f.y*forwardOffset + side.y*sideOffset
        });

        ctx.lineWidth=Math.max(2,c*.028);
        ctx.strokeStyle="#3f2c23";
        ctx.fillStyle="#563024";
        ctx.lineCap="round";

        if(animType==="bite"){
          // Открытый рот: эллипс вытянут поперёк направления движения.
          const open=Math.max(.10,Math.sin(progress*Math.PI));
          const rx=c*.07 + c*.035*open;
          const ry=c*.04 + c*.065*open;

          ctx.save();
          ctx.translate(mouthCenter.x,mouthCenter.y);
          ctx.rotate(Math.atan2(f.y,f.x));
          ctx.beginPath();
          ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2);
          ctx.fill();
          ctx.restore();

          // Частицы вылетают именно вперёд от рта.
          for(let k=0;k<3;k++){
            const spread=(k-1)*c*.07;
            const travel=c*(.10+.14*progress);
            const p=mouthPoint(travel,spread*(1+progress*.4));
            ctx.fillStyle=k%2?"#f5d980":"#fff0b5";
            ctx.beginPath();
            ctx.arc(p.x,p.y,c*.025*(1-progress*.5),0,Math.PI*2);
            ctx.fill();
          }

        }else if(animType==="error"){
          // Круглый рот удивления расположен спереди головы.
          ctx.beginPath();
          ctx.arc(mouthCenter.x,mouthCenter.y,c*.07,0,Math.PI*2);
          ctx.stroke();

        }else{
          // Улыбка/грусть строятся тремя точками относительно направления головы.
          const halfWidth = animType==="victory" ? c*.13 : c*.10;
          const start = mouthPoint(0,-halfWidth);
          const end   = mouthPoint(0, halfWidth);

          let curve;
          if(animType==="defeat"){
            // Грустный изгиб — центр рта уходит назад, к голове.
            curve = mouthPoint(-c*.08,0);
          }else if(animType==="victory"){
            // Большая улыбка — центр изгиба направлен вперёд.
            curve = mouthPoint(c*.10,0);
          }else{
            // Обычная лёгкая улыбка.
            curve = mouthPoint(c*.065,0);
          }

          ctx.beginPath();
          ctx.moveTo(start.x,start.y);
          ctx.quadraticCurveTo(curve.x,curve.y,end.x,end.y);
          ctx.stroke();

          if(animType==="defeat"){
            // Слеза находится сбоку от лица и тоже рассчитывается через side/f.
            const tear = {
              x: x + side.x*c*.19 - f.x*c*.03,
              y: y + side.y*c*.19 - f.y*c*.03
            };
            ctx.save();
            ctx.translate(tear.x,tear.y);
            ctx.rotate(Math.atan2(f.y,f.x));
            ctx.fillStyle="#8fc4dc";
            ctx.beginPath();
            ctx.ellipse(0,0,c*.025,c*.055,0,0,Math.PI*2);
            ctx.fill();
            ctx.restore();
          }
        }
      }
      ctx.restore();
    }

    if(animType==="victory"){
      const hx=headBase.x*c+c/2;
      const hy=headBase.y*c+c/2+globalLift;
      ctx.save();
      for(let k=0;k<7;k++){
        const a=k/7*Math.PI*2+progress*Math.PI*2;
        const rr=c*(.48+.32*progress);
        ctx.globalAlpha=1-progress*.55;
        ctx.fillStyle=k%2?"#f4c75b":"#fff0a0";
        ctx.font=`900 ${Math.floor(c*.22)}px system-ui`;
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillText("★",hx+Math.cos(a)*rr,hy+Math.sin(a)*rr);
      }
      ctx.restore();
    }
  }

  function roundRect(x,y,w,h,r){r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}

  let audioCtx=null;function beep(freq=440,duration=.06){if(state.muted)return;try{audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type="sine";o.frequency.value=freq;g.gain.setValueAtTime(.045,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration);}catch{}}
  function openLevels(){if(!state.finished)togglePause(true);buildLevelGrid();ui.levelModal.classList.remove("hidden");}function closeLevels(){ui.levelModal.classList.add("hidden");if(!state.finished)togglePause(false);}
  function handleKey(e){const code=e.code,map={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0]};if(map[code]){e.preventDefault();setDirection(...map[code]);}else if(code==="Space"){e.preventDefault();togglePause();}}

  document.addEventListener("keydown",handleKey);document.querySelectorAll("[data-dir]").forEach(b=>b.addEventListener("pointerdown",()=>{const d=b.dataset.dir;if(d==="up")setDirection(0,-1);if(d==="down")setDirection(0,1);if(d==="left")setDirection(-1,0);if(d==="right")setDirection(1,0);}));
  $("startBtn").onclick=()=>{
    ui.intro.classList.add("hidden");
    const continueLevel=Math.max(0,Math.min(LEVELS.length-1,state.save.unlocked-1));
    resetLevel(continueLevel);
  };
  $("introLevelsBtn").onclick=()=>{
    ui.intro.classList.add("hidden");
    buildLevelGrid();
    ui.levelModal.classList.remove("hidden");
  };$("levelsBtn").onclick=openLevels;$("closeLevelsBtn").onclick=closeLevels;$("pauseBtn").onclick=()=>togglePause();$("resumeBtn").onclick=()=>togglePause(false);ui.hint.onclick=useHint;ui.sound.onclick=()=>{state.muted=!state.muted;ui.sound.textContent=state.muted?"🔇":"🔊";};
  $("replayBtn").onclick=()=>{ui.result.classList.add("hidden");resetLevel(state.levelIndex);};ui.next.onclick=()=>{if(!state.resultWon)return;ui.result.classList.add("hidden");if(state.levelIndex<LEVELS.length-1)resetLevel(state.levelIndex+1);else openLevels();};ui.levelModal.addEventListener("click",e=>{if(e.target===ui.levelModal)closeLevels();});window.addEventListener("resize",draw);

  function renderLoop(){
    draw();
    requestAnimationFrame(renderLoop);
  }

  resetLevel(0);
  const continueLevel=Math.max(0,Math.min(LEVELS.length-1,state.save.unlocked-1));
  $("startBtn").textContent=continueLevel>0 ? `Продолжить — уровень ${continueLevel+1}` : "Начать восстановление";
  requestAnimationFrame(renderLoop);
})();
