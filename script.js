/* ===== Правка только здесь ✅ ===== */
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx6tsy4hyZw_iOKlU5bUSEAVjckwY7SYh4zyaVLn5AftRg7T0gztg3K1AdIOUWCL7Nc_Q/exec";
const WEB_APP_SECRET = "MYKUB_SECRET_2025";

/* Быстрые селекторы */
const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));

function toast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 1800);
}

function openModal(sel){
  $('#overlay').classList.add('show');
  $(sel).classList.add('show');
}
function closeAll(){
  $('#overlay').classList.remove('show');
  $$('.modal').forEach(m=>m.classList.remove('show'));
}
$('#overlay').addEventListener('click', closeAll);
$$('[data-close]').forEach(x=>x.addEventListener('click', closeAll));

async function post(payload){
  try{
    let r = await fetch(WEB_APP_URL, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if(r.ok) return r.json();
  }catch{}
  
  const fd = new FormData();
  fd.append('payload', JSON.stringify(payload));
  const rr = await fetch(WEB_APP_URL, {method:'POST', body: fd});
  return rr.json();
}

/* ==== ВЕШАЕМ КЛИКИ ПО КУБАМ ==== */
function findCenter(){
  return $$('.cube').find(c => c.textContent.trim().toUpperCase()==='ЦЕНТР');
}
function findGood(){
  return $$('.cube').find(c => c.textContent.trim().includes('КУБ'));
}
function findRent(){
  return $$('.cube').filter(c=>{
    const t=c.textContent.trim();
    return /^\#?\d+$/.test(t) && t!=='ЦЕНТР';
  });
}

setTimeout(()=>{
  const center = findCenter();
  center?.addEventListener('click', ()=>{
    $('#form-auction').reset();
    openModal('#modal-auction');
  });

  const g = findGood();
  g?.addEventListener('click', ()=>{
    $('#form-story').reset();
    openModal('#modal-story');
  });

  findRent().forEach(c=>{
    c.addEventListener('click', ()=>{
      const id = c.textContent.trim().replace('#','');
      $('#form-rent').reset();
      $('#rent-cube').value=id;
      $('#rent-cube-title').textContent='#'+id;
      openModal('#modal-rent');
    });
  });
},700);

/* ====== SUBMITS ====== */
$('#form-rent').addEventListener('submit', async(e)=>{
  e.preventDefault();
  const payload={
    type:'rent', secret:WEB_APP_SECRET,
    cubeId: $('#rent-cube').value,
    name: $('#rent-name').value.trim(),
    contact: $('#rent-contact').value.trim(),
    link: $('#rent-link').value.trim(),
    message: $('#rent-message').value.trim(),
  };
  const r = await post(payload);
  if(r.ok){ closeAll(); toast('Успех ✅'); }
  else toast('Ошибка ❌');
});

$('#form-auction').addEventListener('submit', async(e)=>{
  e.preventDefault();
  const payload={
    type:'auction', secret:WEB_APP_SECRET,
    bid: $('#auction-bid').value.trim(),
    contact: $('#auction-contact').value.trim(),
    link: $('#auction-link').value.trim(),
    comment: $('#auction-comment').value.trim(),
  };
  const r = await post(payload);
  if(r.ok){ closeAll(); toast('Ставка отправлена ✅'); }
  else toast('Ошибка ❌');
});

$('#form-story').addEventListener('submit', async(e)=>{
  e.preventDefault();
  const payload={
    type:'story', secret:WEB_APP_SECRET,
    name: $('#story-name').value.trim(),
    contact: $('#story-contact').value.trim(),
    story: $('#story-text').value.trim(),
  };
  const r = await post(payload);
  if(r.ok){ closeAll(); toast('История отправлена ✅'); }
  else toast('Ошибка ❌');
});

$('#form-hero').addEventListener('submit', async(e)=>{
  e.preventDefault();
  const payload={
    type:'hero', secret:WEB_APP_SECRET,
    heroName: $('#hero-name').value.trim(),
    contact: $('#hero-contact').value.trim(),
    link: $('#hero-link').value.trim(),
    reason: $('#hero-reason').value.trim(),
  };
  const r = await post(payload);
  if(r.ok){ closeAll(); toast('Запись героя ✅'); }
  else toast('Ошибка ❌');
});
