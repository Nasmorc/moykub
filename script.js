/**********************
 *  КОНСТАНТЫ
 **********************/
const WEB_APP_URL   = "https://script.google.com/macros/s/AKfycbx6tsy4hyZw_iOKlU5bUSEAVjckwY7SYh4zyaVLn5AftRg7T0gztg3K1AdIOUWCL7Nc_Q/exec";
// ВНИМАНИЕ: это тот самый “секрет” — он должен 1-в-1 совпадать с константой SECRET в твоём Apps Script
const WEB_APP_SECRET = "MYKUB_SECRET_2025";

/*
  — Не трогаю твою отрисовку сцены: предполагаю, что где-то дальше внизу у тебя создаются кубы,
    у обычных кубов есть click → openRent(cubeId), у центра click → openAuction(), у Куба Добра click → openStory().

  Если этих вызовов ещё нет — просто привяжи:
    centerCubeEl.addEventListener('click', openAuction);
    goodCubeEl.addEventListener('click', openStory);
    обычныйКуб.addEventListener('click', () => openRent(number));
*/

/**********************
 *  УНИВЕРСАЛЬНОЕ ОКНО
 **********************/
const modal    = document.getElementById('modal');
const modalBox = modal.querySelector('.modal__content');
const modalTitle = document.getElementById('modal-title');
const toast    = document.getElementById('toast');

const formRent    = document.getElementById('form-rent');
const formStory   = document.getElementById('form-story');
const formAuction = document.getElementById('form-auction');

function showToast(msg, ok=true){
  toast.textContent = msg;
  toast.classList.remove('hidden','ok','err');
  toast.classList.add(ok ? 'ok' : 'err');
}

function clearToast(){
  toast.classList.add('hidden');
  toast.textContent = '';
}

function showModal(which){
  // показать только нужную форму
  formRent.classList.add('hidden');
  formStory.classList.add('hidden');
  formAuction.classList.add('hidden');

  clearToast();
  modal.classList.add('show');

  if(which === 'rent')   formRent.classList.remove('hidden');
  if(which === 'story')  formStory.classList.remove('hidden');
  if(which === 'auction')formAuction.classList.remove('hidden');
}

function closeModal(){
  modal.classList.remove('show');
  clearToast();
}

// закрытие: крестик, фон, Escape
document.getElementById('modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{
  if(e.target.dataset.close !== undefined) closeModal();
});
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && modal.classList.contains('show')) closeModal();
});

/**********************
 * ОТКРЫТИЯ МОДАЛОК
 **********************/
function openRent(cubeId){
  modalTitle.textContent = `Заявка на аренду #${cubeId}`;
  document.getElementById('rent-cubeId').value = cubeId;
  document.getElementById('rent-name').value = '';
  document.getElementById('rent-contact').value = '';
  document.getElementById('rent-link').value = '';
  document.getElementById('rent-message').value = '';
  showModal('rent');
}

function openStory(){
  modalTitle.textContent = 'КУБ ДОБРА';
  document.getElementById('story-name').value = '';
  document.getElementById('story-contact').value = '';
  document.getElementById('story-text').value = '';
  showModal('story');
}

function openAuction(){
  modalTitle.textContent = '💎 Аукцион центрального куба';
  document.getElementById('auction-bid').value = '';
  document.getElementById('auction-contact').value = '';
  document.getElementById('auction-link').value = '';
  document.getElementById('auction-comment').value = '';
  showModal('auction');
}

/**********************
 * ОТПРАВКА НА СЕРВЕР (в один формат)
 **********************/
async function sendToSheet(payload){
  // Apps Script у нас читает данные из параметра payload (URL-encoded JSON)
  const params = new URLSearchParams();
  params.set('payload', JSON.stringify(payload));

  // НИЖЕ — method: POST (но важен именно параметр payload)
  const res = await fetch(WEB_APP_URL, {
    method: 'POST',
    headers: {'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},
    body: params.toString()
  });

  const data = await res.json().catch(()=>({ok:false,error:'bad_json'}));
  return data;
}

/**********************
 * ХЕНДЛЕРЫ ФОРМ
 **********************/
formRent.addEventListener('submit', async (e)=>{
  e.preventDefault();
  clearToast();

  const cubeId  = (document.getElementById('rent-cubeId').value || '').toString().replace('#','');
  const name    = document.getElementById('rent-name').value.trim();
  const contact = document.getElementById('rent-contact').value.trim();
  const link    = document.getElementById('rent-link').value.trim();
  const message = document.getElementById('rent-message').value.trim();

  if(!cubeId || !name || !contact){
    showToast('Заполни номер куба, имя и контакт.', false); return;
  }

  const payload = {
    type: 'rent',
    secret: WEB_APP_SECRET,
    cubeId, name, contact, link, message
  };

  try{
    const r = await sendToSheet(payload);
    if(r.ok){
      showToast('Заявка отправлена. Спасибо!');
      setTimeout(closeModal, 800);
    }else{
      showToast('Ошибка: ' + (r.error || 'unknown'), false);
    }
  }catch(err){
    showToast('Сеть: не удалось связаться с сервером.', false);
  }
});

formStory.addEventListener('submit', async (e)=>{
  e.preventDefault();
  clearToast();

  const name    = document.getElementById('story-name').value.trim();
  const contact = document.getElementById('story-contact').value.trim();
  const story   = document.getElementById('story-text').value.trim();

  if(!name || !contact || !story){
    showToast('Имя, контакт и история обязательны.', false); return;
  }

  const payload = {
    type: 'story',
    secret: WEB_APP_SECRET,
    name, contact, story
  };

  try{
    const r = await sendToSheet(payload);
    if(r.ok){
      showToast('История отправлена. Спасибо!');
      setTimeout(closeModal, 800);
    }else{
      showToast('Ошибка: ' + (r.error || 'unknown'), false);
    }
  }catch(err){
    showToast('Сеть: не удалось связаться с сервером.', false);
  }
});

formAuction.addEventListener('submit', async (e)=>{
  e.preventDefault();
  clearToast();

  const bid     = document.getElementById('auction-bid').value.trim();
  const contact = document.getElementById('auction-contact').value.trim();
  const link    = document.getElementById('auction-link').value.trim();
  const comment = document.getElementById('auction-comment').value.trim();

  if(!bid || !contact){
    showToast('Нужны ставка и контакт.', false); return;
  }

  const payload = {
    type: 'auction',
    secret: WEB_APP_SECRET,
    bid, contact, link, comment
  };

  try{
    const r = await sendToSheet(payload);
    if(r.ok){
      showToast('Ставка принята! Удачи в аукционе.');
      setTimeout(closeModal, 800);
    }else{
      showToast('Ошибка: ' + (r.error || 'unknown'), false);
    }
  }catch(err){
    showToast('Сеть: не удалось связаться с сервером.', false);
  }
});

/********************************************
 * НИЖЕ — пример привязки кликов (если нужно)
 ********************************************/
/*
// пример: при создании обычных кубов
document.querySelectorAll('.cube.rent').forEach(el=>{
  el.addEventListener('click', ()=>{
    openRent(el.dataset.cubeId); // где data-cube-id проставляешь при генерации
  });
});

// центральный куб:
document.getElementById('center-cube').addEventListener('click', openAuction);

// куб добра:
document.getElementById('good-cube').addEventListener('click', openStory);
*/
