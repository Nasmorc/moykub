// ====== Настройки ======
const WEB_APP_URL   = "https://script.google.com/macros/s/AKfycbx6tsy4hyZw_iOKlU5bUSEAVjckwY7SYh4zyaVLn5AftRg7T0gztg3K1AdIOUWCL7Nc_Q/exec"; // <- ВАША ссылка от Google Apps Script
const WEB_APP_SECRET = "MYKUB_SECRET_2025"; // <- Должен совпадать с SECRET в Apps Script

// ====== Небольшая утилита ======
function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

function showToast(text, isError=false){
  const t = $('#toast');
  t.style.display = 'block';
  t.textContent = (isError ? 'Ошибка: ' : '') + text;
  t.style.background = isError ? 'rgba(220,60,60,.95)' : 'rgba(0,200,180,.95)';
  clearTimeout(t._tm);
  t._tm = setTimeout(()=> t.style.display = 'none', 4000);
}

// ====== Модалки: show/hide ======
const overlay = $('#overlay');
function showModal(id){
  // скрыть все модалки сначала
  $all('.modal').forEach(m => m.style.display = 'none');
  const m = document.getElementById(id);
  if (!m) return;
  m.style.display = 'block';
  overlay.style.display = 'block';
  // scroll to top of modal (если нужно)
  m.scrollTop = 0;
}
function hideAllModals(){
  $all('.modal').forEach(m => m.style.display = 'none');
  overlay.style.display = 'none';
}

// закрытие крестиком
document.addEventListener('click', function(e){
  if (e.target.matches('.modal-close')) {
    hideAllModals();
  }
});

// закрытие кликом по overlay
overlay.addEventListener('click', hideAllModals);

// если нажали Escape
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape') hideAllModals();
});

// ====== Отправка в Google Apps Script ======
async function postToServer(payload){
  try {
    payload.secret = WEB_APP_SECRET;
    const res = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('postToServer error', err);
    return { ok:false, error: String(err) };
  }
}

// ====== Обработчики отправки каждой формы ======
document.getElementById('rent-send').addEventListener('click', async () => {
  const cube = $('#rent-cube').value;
  const name = $('#rent-name').value.trim();
  const contact = $('#rent-contact').value.trim();
  const link = $('#rent-link').value.trim();
  const comment = $('#rent-comment').value.trim();

  if (!cube || !name || !contact) {
    showToast('Заполните номер куба, имя и контакт', true);
    return;
  }

  const payload = {
    type: 'rent',
    cubeId: cube,
    name, contact, message: comment, link
  };

  showToast('Отправка...');
  const r = await postToServer(payload);
  if (r && r.ok) {
    showToast('Заявка отправлена');
    hideAllModals();
  } else {
    showToast(r && r.error ? r.error : 'Server error', true);
  }
});

// Auction
document.getElementById('auction-send').addEventListener('click', async () => {
  const bid = $('#auction-bid').value.trim();
  const contact = $('#auction-contact').value.trim();
  const link = $('#auction-link').value.trim();
  const comment = $('#auction-comment').value.trim();

  if (!bid || !contact) {
    showToast('Укажите ставку и контакт', true);
    return;
  }

  const payload = {
    type: 'auction',
    bid: bid,
    contact,
    link,
    comment
  };

  showToast('Отправка ставки...');
  const r = await postToServer(payload);
  if (r && r.ok) {
    showToast('Ставка принята');
    hideAllModals();
  } else {
    showToast(r && r.error ? r.error : 'Server error', true);
  }
});

// Story (Куб добра)
document.getElementById('story-send').addEventListener('click', async () => {
  const name = $('#story-name').value.trim();
  const contact = $('#story-contact').value.trim();
  const link = $('#story-link').value.trim();
  const story = $('#story-text').value.trim();

  if (!name || !contact || !story) {
    showToast('Заполните имя, контакт и историю', true);
    return;
  }

  const payload = {
    type: 'story',
    name, contact, story, link
  };

  showToast('Отправка...');
  const r = await postToServer(payload);
  if (r && r.ok) {
    showToast('История отправлена');
    hideAllModals();
  } else {
    showToast(r && r.error ? r.error : 'Server error', true);
  }
});

// Hero
document.getElementById('hero-send').addEventListener('click', async () => {
  const heroName = $('#hero-name').value.trim();
  const contact = $('#hero-contact').value.trim();
  const link = $('#hero-link').value.trim();
  const reason = $('#hero-reason').value.trim();

  if (!heroName || !contact) {
    showToast('Заполните имя героя и контакт', true);
    return;
  }

  const payload = {
    type: 'hero',
    heroName,
    contact,
    link,
    reason
  };

  showToast('Отправка...');
  const r = await postToServer(payload);
  if (r && r.ok) {
    showToast('Заявка отправлена');
    hideAllModals();
  } else {
    showToast(r && r.error ? r.error : 'Server error', true);
  }
});

// ====== Внешние вызовы: открытие модалок ======
// Предполагаем, что кубы в DOM имеют:
// - orbit-кубы: class "cube" и data-id с номером (#90 -> 90)
// - центральный куб: id="center-cube"
// - куб добра: id="good-cube"
// - герои: class "hero-cube" и data-hero-index или data-link и data-label
// Ниже — делегируем клики по document и открываем нужную модалку.

// У тебя уже есть механизм рендера кубов — здесь просто перехват клика
document.addEventListener('click', function(e){
  const el = e.target.closest && e.target.closest('.cube, .hero-cube, #center-cube, #good-cube');
  if (!el) return;

  // Если это герой и у него ссылка — переходим по ссылке (если занят),
  // иначе открываем форму "hero"
  if (el.classList.contains('hero-cube')) {
    const link = el.dataset.link;
    const label = el.dataset.label || 'Герой';
    if (link && link.length) {
      // если установлен внешний профиль — переходим
      window.open(link, '_blank');
      return;
    } else {
      // открыть форму для предложения героя
      $('#hero-name').value = label;
      showModal('modal-hero');
      return;
    }
  }

  // Куб центра: открыть аукцион
  if (el.id === 'center-cube' || el.id === 'center') {
    // очистим поля
    $('#auction-bid').value = '';
    $('#auction-contact').value = '';
    $('#auction-link').value = '';
    $('#auction-comment').value = '';
    showModal('modal-auction');
    return;
  }

  // Куб добра
  if (el.id === 'good-cube' || el.id === 'good') {
    $('#story-name').value = '';
    $('#story-contact').value = '';
    $('#story-link').value = '';
    $('#story-text').value = '';
    showModal('modal-story');
    return;
  }

  // орбитальный куб — открыть аренду
  if (el.classList.contains('cube')) {
    const cubeId = el.dataset.id || el.textContent || '';
    $('#rent-cube').value = cubeId.replace('#','').trim();
    $('#rent-cube-label').textContent = ' #' + $('#rent-cube').value;
    $('#rent-name').value = '';
    $('#rent-contact').value = '';
    $('#rent-link').value = '';
    $('#rent-comment').value = '';
    showModal('modal-rent');
    return;
  }
});

// на случай, если DOM-кубы у тебя имеют другую структуру — напиши мне, я подправлю селекторы.

// ====== Инициализация ======
(function init(){
  // просто убедиться, что элементы есть
  if (!overlay) console.warn('Overlay not found');
  // скрыть все модалки
  hideAllModals();
})();
