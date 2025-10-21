// ====== Конфигурация ======
const TOTAL_CUBES = 180;
const center = { x: 50, y: 50 };
const a = 6;             // старт радиуса
const b = 0.25;          // коэффициент расширения
const thetaStep = 0.2;   // шаг угла (чем меньше, тем плотнее)
const theta0 = Math.PI / 2; // начинаем снизу и идём по часовой

const priceMin = 7500;
const priceMax = 35000;

// ====== Расчёт цен ======
const growth = Math.pow(priceMax / priceMin, 1 / (TOTAL_CUBES - 1));
const priceForIndex = (i) =>
  Math.round((priceMin * Math.pow(growth, i)) / 100) * 100;

const layer = document.getElementById('ringsLayer');
const frag = document.createDocumentFragment();
const tooltip = document.getElementById('tooltip');

// ====== Расположение кубов ======
for (let i = 0; i < TOTAL_CUBES; i++) {
  const theta = theta0 + i * thetaStep;
  const r = a + b * theta;
  const x = center.x + r * Math.cos(theta);
  const y = center.y + r * Math.sin(theta);
  const price = priceForIndex(TOTAL_CUBES - i - 1);

  const el = document.createElement('button');
  el.className = 'cube';
  el.style.setProperty('--x', x.toFixed(3));
  el.style.setProperty('--y', y.toFixed(3));
  el.dataset.id = i + 1;
  el.textContent = `#${i + 1}`;

  const tipText = `💰 ${price.toLocaleString('ru-RU')} ₽/мес`;

  el.addEventListener('mouseenter', (evt) => {
    tooltip.textContent = tipText;
    const rect = evt.currentTarget.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
    tooltip.style.top = `${rect.top - 8 + window.scrollY}px`;
    tooltip.classList.remove('hidden');
  });

  el.addEventListener('mousemove', (evt) => {
    const rect = evt.currentTarget.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
    tooltip.style.top = `${rect.top - 8 + window.scrollY}px`;
  });

  el.addEventListener('mouseleave', () => tooltip.classList.add('hidden'));
  el.addEventListener('click', () => openModalForCube(i + 1, price));
  frag.appendChild(el);
}
layer.appendChild(frag);

// ====== Модалка ======
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

function closeModal() {
  modal.classList.add('hidden');
  modalContent.innerHTML = '';
}

function openModalForCube(id, price) {
  modalContent.innerHTML = `
    <h3>Куб #${id}</h3>
    <p>Цена аренды: <strong>${price.toLocaleString('ru-RU')} ₽/мес</strong></p>
    <div class="row">
      <button class="btn" id="btnRent">Арендовать</button>
    </div>
  `;
  modal.classList.remove('hidden');

  document.getElementById('btnRent').onclick = () => {
    modalContent.innerHTML = `
      <h3>Аренда куба #${id}</h3>
      <div class="field">
        <label>Имя / Компания</label>
        <input id="f_name" placeholder="Как к вам обращаться?" />
      </div>
      <div class="field">
        <label>Контакты</label>
        <input id="f_phone" placeholder="+7 ... или @username" />
      </div>
      <div class="field">
        <label>Комментарий</label>
        <textarea id="f_msg" rows="3" placeholder="Ссылка или текст"></textarea>
      </div>
      <div class="row">
        <button class="btn secondary" id="btnCancel">Отмена</button>
        <button class="btn" id="btnSend">Отправить</button>
      </div>
    `;
    document.getElementById('btnCancel').onclick = () => openModalForCube(id, price);
    document.getElementById('btnSend').onclick = () => {
      alert(`Заявка на куб #${id} отправлена (демо)`);
      closeModal();
    };
  };
}

// ====== Куб Добра ======
document.getElementById('cubeGood')?.addEventListener('click', () => {
  modalContent.innerHTML = `
    <h3>КУБ ДОБРА — Подать заявку</h3>
    <div class="field"><label>Проблема</label><input placeholder="Коротко о проблеме" /></div>
    <div class="field"><label>Описание</label><textarea rows="4"></textarea></div>
    <div class="field"><label>Контакты</label><input placeholder="@telegram или телефон" /></div>
    <div class="row">
      <button class="btn secondary" onclick="closeModal()">Отмена</button>
      <button class="btn" onclick="alert('Заявка отправлена'); closeModal();">Отправить</button>
    </div>
  `;
  modal.classList.remove('hidden');
});
