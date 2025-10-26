// === Настройки ===
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx6tsy4hyZw_iOKlU5bUSEAVjckwY7SYh4zyaVLn5AftRg7T0gztg3K1AdIOUWCL7Nc_Q/exec";
const WEB_APP_SECRET = "MYKUB_SECRET_2025";

// === Модалки ===
const modalOverlay = document.createElement("div");
modalOverlay.id = "modalOverlay";
modalOverlay.style.cssText = `
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  display: none; justify-content: center; align-items: center;
  z-index: 999;
`;
document.body.appendChild(modalOverlay);

function closeModal() {
  modalOverlay.style.display = "none";
  modalOverlay.innerHTML = "";
}

// === Универсальная функция для создания формы ===
function createModal(title, fields, submitText, onSubmit) {
  modalOverlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>${title}</h3>
        <span id="closeModal" style="cursor:pointer;float:right;font-size:20px;">×</span>
      </div>
      <div class="modal-body">
        ${fields.map(f => `
          <input id="${f.id}" type="${f.type || 'text'}" placeholder="${f.placeholder}" style="display:block;width:100%;margin:8px 0;padding:8px;"/>
        `).join("")}
        <button id="submitModal" class="modal-button">${submitText}</button>
      </div>
    </div>
  `;
  modalOverlay.style.display = "flex";

  document.getElementById("closeModal").onclick = closeModal;
  document.getElementById("submitModal").onclick = async () => {
    const data = {};
    for (const f of fields) data[f.id] = document.getElementById(f.id).value.trim();
    await onSubmit(data);
  };
}

// === Отправка данных ===
async function sendData(payload) {
  try {
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, secret: WEB_APP_SECRET })
    });
    const json = await res.json();
    if (json.ok) {
      alert("✅ Заявка успешно отправлена!");
      closeModal();
    } else {
      alert("Ошибка: " + json.error);
    }
  } catch (e) {
    alert("⚠️ Не удалось связаться с сервером.");
  }
}

// === Модалка аренды куба ===
function openRentModal(cubeId) {
  createModal(
    `Заявка на аренду ${cubeId}`,
    [
      { id: "name", placeholder: "Имя" },
      { id: "contact", placeholder: "Контакт (телеграм / телефон)" },
      { id: "message", placeholder: "Комментарий" },
      { id: "link", placeholder: "Ссылка (опционально)" },
    ],
    "Отправить заявку",
    (data) => sendData({ type: "rent", cubeId, ...data })
  );
}

// === Модалка Куба Добра ===
function openStoryModal() {
  createModal(
    "💚 Куб Добра — поделись историей",
    [
      { id: "name", placeholder: "Имя" },
      { id: "contact", placeholder: "Контакт" },
      { id: "story", placeholder: "Твоя история" },
      { id: "link", placeholder: "Ссылка (опционально)" },
    ],
    "Отправить историю",
    (data) => sendData({ type: "story", ...data })
  );
}

// === Модалка аукциона ===
function openAuctionModal() {
  createModal(
    "💎 Аукцион центрального куба",
    [
      { id: "bid", placeholder: "Ставка (₽)" },
      { id: "contact", placeholder: "Контакт (телеграм / телефон)" },
      { id: "link", placeholder: "Ссылка (опционально)" },
    ],
    "Сделать ставку",
    (data) => sendData({ type: "auction", ...data })
  );
}

// === Привязка кликов ===
document.querySelectorAll(".cube").forEach(cube => {
  cube.addEventListener("click", () => {
    const text = cube.textContent.trim();

    if (text === "КУБ ДОБРА") {
      openStoryModal();
    } else if (text === "ЦЕНТР") {
      openAuctionModal();
    } else if (text.startsWith("Герой")) {
      alert("Этот куб занят героем месяца 💫");
    } else {
      openRentModal(text);
    }
  });
});
