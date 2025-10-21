// ====== Концентрические кольца: 10 колец × 18 кубов = 180 ======
const RINGS = 10, PER_RING = 18, N = RINGS * PER_RING;
const center = { x: 50, y: 50 };
const rMin = 8;        // радиус внутреннего кольца (% от сцены)
const rStep = 3.8;     // расстояние между кольцами (%)
const theta0 = -Math.PI / 2; // старт внизу, дальше по часовой стрелке

// Цены: к центру дороже (внешнее 7 500 ₽ → внутреннее 35 000 ₽)
const priceMin = 7500, priceMax = 35000;
const growth = Math.pow(priceMax / priceMin, 1 / (RINGS - 1));
const priceForRing = (ringIdxFromOuter) =>
  Math.round((priceMin * Math.pow(growth, ringIdxFromOuter)) / 100) * 100;

const layer = document.getElementById('ringsLayer');
const frag = document.createDocumentFragment();
const tooltip = document.getElementById('tooltip');

let id = 1;
// Нумерация: ОТ ЦЕНТРА к краю
for (let ring = RINGS - 1; ring >= 0; ring--) {
  const radius = rMin + ring * rStep;
  const ringIdxFromOuter = (RINGS - 1) - ring; // 0..9 (0 внешний, 9 внутренний)
  const ringPrice = priceForRing(ringIdxFromOuter);

  for (let j = 0; j < PER_RING; j++) {
    const step = (2 * Math.PI) / PER_RING;
    const theta = theta0 - j * step; // по часовой
    const x = center.x + radius * Math.cos(theta);
    const y = center.y + radius * Math.sin(theta);

    const el = document.createElement('button');
    el.className = 'cube';
    el.style.setProperty('--x', x.toFixed(3));
    el.style.setProperty('--y', y.toFixed(3));
    el.dataset.id = id;
    el.textContent = `#${id}`;

    // тултип с ценой
    const tipText = `💰 ${ringPrice.toLocaleString('ru-RU')} ₽/мес`;
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

    el.addEventListener('click', () => openModalForCube(id, ringPrice));

    frag.appendChild(el);
    id++;
  }
}
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
      alert("Заявка отправлена! (Локальный режим)\nМы свяжемся с вами после модерации.");
      closeModal();
    };
  };
}

// ====== Центр и КУБ ДОБРА ======
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
