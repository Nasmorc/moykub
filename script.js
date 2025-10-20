// Параметры спирали (золотая / архимедова): r = a + b * theta
const N = 180;                   // количество кубов
const theta0 = -Math.PI / 2;     // старт снизу
const step = 0.25;               // шаг угла (по часовой — уменьшаем theta)
const a = 6;                     // базовый радиус
const b = 5.6;                   // шаг радиуса (подобрано, чтобы все влезли)
const center = { x: 50, y: 50 }; // центр сцены (%)

// Цены по экспоненте от края к центру: 7 500 → 35 000 ₽
const priceMin = 7500, priceMax = 35000;
const growth = Math.pow(priceMax / priceMin, 1 / (N - 1));

function priceByIndex(iFromOuter) {
  // Индекс 0..N-1 от края к центру
  const price = priceMin * Math.pow(growth, (N - 1) - iFromOuter);
  return Math.round(price / 100) * 100;
}

// Узлы спирали (уникальные, без дублей)
const points = Array.from({ length: N }, (_, i) => {
  const theta = theta0 - step * i; // по часовой
  const r = a + b * (i + 1);
  const x = center.x + r * Math.cos(theta);
  const y = center.y + r * Math.sin(theta);
  return { x, y };
});

// Нумерация: #1 внизу снаружи → по часовой к центру → #180 возле центра
const cubes = points.map((p, idx) => ({
  id: idx + 1,
  x: p.x,
  y: p.y
}));

// Рендер
const layer = document.getElementById('spiralLayer');
const frag = document.createDocumentFragment();

cubes.forEach((c, idx) => {
  const btn = document.createElement('button');
  btn.className = 'cube';
  btn.style.setProperty('--x', c.x.toFixed(3));
  btn.style.setProperty('--y', c.y.toFixed(3));
  btn.dataset.id = c.id;
  btn.title = `Куб #${c.id} — ${priceByIndex(idx).toLocaleString('ru-RU')} ₽/мес`;
  btn.textContent = `#${c.id}`;
  btn.addEventListener('click', () => openModalForCube(c.id, priceByIndex(idx)));
  frag.appendChild(btn);
});

layer.appendChild(frag);

// Модалка (общая)
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

function closeModal(){
  modal.classList.add('hidden');
  modalContent.innerHTML = '';
}

function openModalForCube(id, price){
  modalContent.innerHTML = `
    <h3>Куб #${id}</h3>
    <p>Цена аренды: <strong>${price.toLocaleString('ru-RU')} ₽/мес</strong></p>
    <div class="row">
      <button class="btn" id="btnMore">Подробнее</button>
      <button class="btn" id="btnRent">Арендовать</button>
    </div>
  `;
  modal.classList.remove('hidden');

  document.getElementById('btnMore').onclick = () => {
    modalContent.innerHTML = `
      <h3>Куб #${id} — подробности</h3>
      <p>Уникальный номер: <strong>${id}</strong>. Чем ближе к центру — тем дороже.</p>
      <button class="btn secondary" id="btnBack">Назад</button>
    `;
    document.getElementById('btnBack').onclick = () => openModalForCube(id, price);
  };

  document.getElementById('btnRent').onclick = () => {
    modalContent.innerHTML = `
      <h3>Заявка на аренду — Куб #${id}</h3>
      <div class="field">
        <label>Имя / Компания</label>
        <input id="f_name" placeholder="Как к вам обращаться?" />
      </div>
      <div class="field">
        <label>Телефон / Telegram</label>
        <input id="f_phone" placeholder="+7 ... или @username" />
      </div>
      <div class="field">
        <label>Комментарий</label>
        <textarea id="f_msg" rows="3" placeholder="Ссылка, логотип, пожелания..."></textarea>
      </div>
      <div class="row">
        <button class="btn secondary" id="btnCancel">Отмена</button>
        <button class="btn" id="btnSend">Отправить заявку</button>
      </div>
    `;
    document.getElementById('btnCancel').onclick = () => openModalForCube(id, price);
    document.getElementById('btnSend').onclick = () => {
      const payload = {
        cube: id,
        name: document.getElementById('f_name').value.trim(),
        contact: document.getElementById('f_phone').value.trim(),
        comment: document.getElementById('f_msg').value.trim(),
        price
      };
      console.log("Заявка (локально):", payload);
      alert("Заявка отправлена! (Локальный режим)\\nМы свяжемся с вами после модерации.");
      closeModal();
    };
  };
}

// Клик по Центру / Добру (заглушки)
document.querySelector('.cube.center')?.addEventListener('click', () => {
  modalContent.innerHTML = `
    <h3>Центральный куб</h3>
    <p>Аукцион ежемесячной аренды. Оставьте ставку и контактные данные.</p>
    <div class="field"><label>Ставка (₽)</label><input placeholder="Например, 120 000" /></div>
    <div class="field"><label>Контакты</label><input placeholder="+7 ... или @username" /></div>
    <button class="btn" onclick="alert('Ставка отправлена (заглушка)');">Отправить ставку</button>
  `;
  modal.classList.remove('hidden');
});

document.querySelector('.cube.good')?.addEventListener('click', () => {
  modalContent.innerHTML = `
    <h3>КУБ ДОБРА — Подать заявку</h3>
    <div class="field"><label>Заголовок проблемы</label><input placeholder="Коротко о проблеме" /></div>
    <div class="field"><label>Описание</label><textarea rows="4" placeholder="Что случилось и какая помощь нужна"></textarea></div>
    <div class="field"><label>Ссылка / Контакты</label><input placeholder="Сайт, соцсеть или телефон" /></div>
    <button class="btn" onclick="alert('Заявка отправлена (заглушка)');">Отправить</button>
  `;
  modal.classList.remove('hidden');
});
