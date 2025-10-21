// ====== Геометрия золотой спирали (r = a + b * theta) ======
const N = 180;
const theta0 = -Math.PI / 2; // старт снизу по центру
const step = 0.25;           // равномерный шаг по углу — ровные витки
const a = 8;                 // базовый радиус
const b = 6.2;               // шаг радиуса
const center = { x: 50, y: 50 };

// Цены по экспоненте от края к центру: 7 500 → 35 000 ₽
const priceMin = 7500, priceMax = 35000;
const growth = Math.pow(priceMax / priceMin, 1 / (N - 1));

const priceByIdx = (innerIdx) => {
  const price = priceMin * Math.pow(growth, (N - 1) - innerIdx);
  return Math.round(price / 100) * 100;
};

// Строим точки так, чтобы #1 был С СНАРУЖИ снизу и дальше по часовой к центру
const points = Array.from({ length: N }, (_, i) => {
  const k = (N - 1) - i;             // внешний → внутренний
  const theta = theta0 - step * k;   // по часовой
  const r = a + b * (k + 1);
  const x = center.x + r * Math.cos(theta);
  const y = center.y + r * Math.sin(theta);
  return { x, y };
});

const cubes = points.map((p, i) => ({ id: i + 1, ...p }));

// ====== Рендер спирали ======
const layer = document.getElementById('spiralLayer');
const frag = document.createDocumentFragment();
const tooltip = document.getElementById('tooltip');

cubes.forEach((c, idx) => {
  const el = document.createElement('button');
  el.className = 'cube';
  el.style.setProperty('--x', c.x.toFixed(3));
  el.style.setProperty('--y', c.y.toFixed(3));
  el.dataset.id = c.id;
  el.textContent = `#${c.id}`;

  const price = priceByIdx(idx);
  const tipText = `💰 ${price.toLocaleString('ru-RU')} ₽/мес`;

  function showTip(evt){
    tooltip.textContent = tipText;
    const rect = evt.currentTarget.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width/2 + window.scrollX}px`;
    tooltip.style.top  = `${rect.top - 8 + window.scrollY}px`;
    tooltip.classList.remove('hidden');
  }
  function moveTip(evt){
    const rect = evt.currentTarget.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width/2 + window.scrollX}px`;
    tooltip.style.top  = `${rect.top - 8 + window.scrollY}px`;
  }
  function hideTip(){ tooltip.classList.add('hidden'); }

  el.addEventListener('mouseenter', showTip);
  el.addEventListener('mousemove', moveTip);
  el.addEventListener('mouseleave', hideTip);
  el.addEventListener('touchstart', (e)=>{ showTip(e); setTimeout(hideTip, 1200); }, {passive:true});

  el.addEventListener('click', () => openModalForCube(c.id, price));

  frag.appendChild(el);
});
layer.appendChild(frag);

// ====== Модалка ======
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

// ====== Клики по Центру и КУБУ ДОБРА ======
document.querySelector('.cube.center')?.addEventListener('click', () => {
  modalContent.innerHTML = `
    <h3>Центральный куб</h3>
    <p>Аукцион ежемесячной аренды. Оставьте ставку и контактные данные.</p>
    <div class="field"><label>Ставка (₽)</label><input placeholder="Например, 120 000" /></div>
    <div class="field"><label>Контакты</label><input placeholder="+7 ... или @username" /></div>
    <div class="row">
      <button class="btn secondary" onclick="closeModal()">Отмена</button>
      <button class="btn" onclick="alert('Ставка отправлена (заглушка)'); closeModal();">Отправить ставку</button>
    </div>
  `;
  modal.classList.remove('hidden');
});

document.getElementById('cubeGood')?.addEventListener('click', () => {
  modalContent.innerHTML = `
    <h3>КУБ ДОБРА — Подать заявку</h3>
    <div class="field"><label>Заголовок проблемы</label><input placeholder="Коротко о проблеме" /></div>
    <div class="field"><label>Описание</label><textarea rows="4" placeholder="Что случилось и какая помощь нужна"></textarea></div>
    <div class="field"><label>Ссылка / Контакты</label><input placeholder="Сайт, соцсеть или телефон" /></div>
    <div class="row">
      <button class="btn secondary" onclick="closeModal()">Отмена</button>
      <button class="btn" onclick="alert('Заявка отправлена (заглушка)'); closeModal();">Отправить</button>
    </div>
  `;
  modal.classList.remove('hidden');
});
