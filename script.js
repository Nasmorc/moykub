/* ================== КОНФИГ по отправке ================== */
const WEB_APP_URL    = "https://script.google.com/macros/s/AKfycbx6tsy4hyZw_iOKlU5bUSEAVjckwY7SYh4zyaVLn5AftRg7T0gztg3K1AdIOUWCL7Nc_Q/exec";
const WEB_APP_SECRET = "MYKUB_SECRET_2025";

/* универсальная отправка в Apps Script (payload в form-urlencoded) */
async function postToGAS(payload){
  const body = "payload="+encodeURIComponent(JSON.stringify(payload));
  const res = await fetch(WEB_APP_URL,{
    method:"POST",
    headers:{ "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8" },
    body
  });
  return res.json();
}

/* ================== СЦЕНА / ОТРИСОВКА ================== */
const container = document.getElementById("container");

async function loadData(){
  const res = await fetch("data.json?"+Date.now());
  return res.json();
}

function polarToXY(cx, cy, radius, angleRad){
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad)
  };
}

function createCube(text, className){
  const d = document.createElement("div");
  d.className = "cube "+className;
  d.textContent = text;
  return d;
}

function toast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"), 2200);
}

function buildScene(data){
  container.innerHTML = "";
  const scene = document.createElement("div");
  scene.className = "scene";
  container.appendChild(scene);

  // три орбиты
  const r1 = document.createElement("div"); r1.className="ring r1";
  const r2 = document.createElement("div"); r2.className="ring r2";
  const r3 = document.createElement("div"); r3.className="ring r3";
  scene.append(r1,r2,r3);

  const cx = 450, cy = 450; // центр сцены
  const count = data.orbitCubes?.count || 110;

  // наружная орбита (#1..#110)
  for(let i=0;i<count;i++){
    const a = (i / count) * Math.PI*2 - Math.PI/2;
    const {x,y} = polarToXY(cx, cy, 430, a);
    const d = createCube(`#${i+1}`, "orb");
    d.style.left = (x-27)+"px";
    d.style.top  = (y-27)+"px";
    // клик → аренда
    d.addEventListener("click", ()=> openRentModal(i+1));
    scene.appendChild(d);
  }

  // внутренняя орбита: 3 героя
  const heroLabels = data.heroes?.map(h=>h.label) || ["Герой 1","Герой 2","Герой 3"];
  const heroAngles = [ -Math.PI/6, Math.PI/2, Math.PI*5/6 ]; // условно 3 точки
  heroLabels.forEach((label, idx)=>{
    const {x,y} = polarToXY(cx, cy, 230, heroAngles[idx] || 0);
    const d = createCube(label, "hero");
    d.style.left = (x-40)+"px";
    d.style.top  = (y-30)+"px";
    d.addEventListener("click", ()=> openHeroModal());
    scene.appendChild(d);
  });

  // центр
  const center = createCube("ЦЕНТР", "center cube-center");
  center.style.left = (cx-70)+"px";
  center.style.top  = (cy-70)+"px";
  center.addEventListener("click", ()=> openAuctionModal());
  scene.appendChild(center);

  // куб добра
  const good = createCube("КУБ ДОБРА", "good");
  const gd = polarToXY(cx, cy, 300, Math.PI/2);
  good.style.left = (gd.x-50)+"px";
  good.style.top  = (gd.y-34)+"px";
  good.addEventListener("click", ()=> openStoryModal());
  scene.appendChild(good);
}

/* ================== МОДАЛКИ (открыть/закрыть) ================== */
const overlayEl = document.getElementById("overlay");

function openModal(modal){
  modal?.classList.add("show");
  overlayEl?.classList.add("show");
}
function closeModal(modal){
  modal?.classList.remove("show");
  overlayEl?.classList.remove("show");
}
overlayEl.addEventListener("click", ()=> {
  document.querySelectorAll(".modal.show").forEach(m=>closeModal(m));
});
document.addEventListener("keydown", (e)=>{
  if(e.key==="Escape"){
    document.querySelectorAll(".modal.show").forEach(m=>closeModal(m));
  }
});
document.querySelectorAll(".modal .close,[data-close]").forEach(btn=>{
  btn.addEventListener("click", (e)=> closeModal(e.target.closest(".modal")));
});

/* ===== конкретные открытия ===== */
function openRentModal(num){
  document.getElementById("rent-cube").value = num;
  document.getElementById("rent-title").textContent = `Заявка на аренду #${num}`;
  openModal(document.getElementById("modal-rent"));
}
function openAuctionModal(){
  openModal(document.getElementById("modal-auction"));
}
function openStoryModal(){
  openModal(document.getElementById("modal-story"));
}
function openHeroModal(){
  openModal(document.getElementById("modal-hero"));
}

/* ================== ОТПРАВКИ ФОРМ ================== */
// Аренда
document.getElementById("rent-form").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const cubeId   = document.getElementById("rent-cube").value.trim();
  const name     = document.getElementById("rent-name").value.trim();
  const contact  = document.getElementById("rent-contact").value.trim();
  const link     = document.getElementById("rent-link").value.trim();
  const message  = document.getElementById("rent-comment").value.trim();
  if(!cubeId || !contact){ toast("Укажите куб и контакт"); return; }
  try{
    const r = await postToGAS({ type:"rent", secret:WEB_APP_SECRET, cubeId, name, contact, link, message });
    if(r.ok){
      toast("Заявка отправлена!");
      e.target.reset(); closeModal(document.getElementById("modal-rent"));
    }else{
      toast("Ошибка: "+(r.error||"неизвестно"));
    }
  }catch(err){ toast("Сеть недоступна"); }
});

// Аукцион
document.getElementById("auction-form").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const bid     = document.getElementById("auction-bid").value.trim();
  const contact = document.getElementById("auction-contact").value.trim();
  const link    = document.getElementById("auction-link").value.trim();
  const comment = document.getElementById("auction-comment").value.trim();
  if(!bid || !contact){ toast("Ставка и контакт обязательны"); return; }
  try{
    const r = await postToGAS({ type:"auction", secret:WEB_APP_SECRET, bid, contact, link, comment });
    if(r.ok){
      toast("Ставка отправлена!");
      e.target.reset(); closeModal(document.getElementById("modal-auction"));
    }else{
      toast("Ошибка: "+(r.error||"неизвестно"));
    }
  }catch(err){ toast("Сеть недоступна"); }
});

// История
document.getElementById("story-form").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const name    = document.getElementById("story-name").value.trim();
  const contact = document.getElementById("story-contact").value.trim();
  const link    = document.getElementById("story-link").value.trim();
  const story   = document.getElementById("story-text").value.trim();
  if(!contact || !story){ toast("Контакт и история обязательны"); return; }
  try{
    const r = await postToGAS({ type:"story", secret:WEB_APP_SECRET, name, contact, link, story });
    if(r.ok){
      toast("История отправлена!");
      e.target.reset(); closeModal(document.getElementById("modal-story"));
    }else{
      toast("Ошибка: "+(r.error||"неизвестно"));
    }
  }catch(err){ toast("Сеть недоступна"); }
});

// Герой
document.getElementById("hero-form").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const heroName = document.getElementById("hero-name").value.trim();
  const from     = document.getElementById("hero-from").value.trim();
  const contact  = document.getElementById("hero-contact").value.trim();
  const reason   = document.getElementById("hero-reason").value.trim();
  if(!heroName || !contact){ toast("Имя героя и контакт обязательны"); return; }
  try{
    const r = await postToGAS({ type:"hero", secret:WEB_APP_SECRET, heroName, from, contact, reason });
    if(r.ok){
      toast("Отправлено!");
      e.target.reset(); closeModal(document.getElementById("modal-hero"));
    }else{
      toast("Ошибка: "+(r.error||"неизвестно"));
    }
  }catch(err){ toast("Сеть недоступна"); }
});

/* ================== СТАРТ ================== */
loadData().then(buildScene).catch(()=>{
  // если data.json не найден — всё равно построим дефолт
  buildScene({ orbitCubes:{count:110}, heroes:[{label:"Герой 1"},{label:"Герой 2"},{label:"Герой 3"}] });
});
