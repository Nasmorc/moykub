// === Настройки ===
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx6tsy4hyZw_iOKlU5bUSEAVjckwY7SYh4zyaVLn5AftRg7T0gztg3K1AdIOUWCL7Nc_Q/exec";
const WEB_APP_SECRET = "MYKUB_SECRET_2025";

// === Создаём overlay для модалок ===
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

// === Универсальная функция модалки ===
function createModal(title, fields, submitText, onSubmit) {
  modalOverlay.innerHTML = `
    <div class="modal" style="background:#000;padding:20px;border-radius:12px;box-shadow:0 0 25px cyan;max-width:400px;width:90%;color:white;">
      <div class="modal-header" style="display:flex;justify-content:space-between;align-items:center;">
        <h3>${title}</h3>
        <span id="closeModal" style="cursor:pointer;font-size:22px;">×</span>
      </div>
      <div class="modal-body">
        ${fields.map(f => `
          <input id="${f.id}" type="${f.type || 'text'}" placeholder="${f.placeholder}" style="display:block;width:100%;margin:8px 0;padding:8px;border-radius:6px;border:none;outline:none;"/>
        `).join("")}
        <button id="submitModal" style="margin-top:10px;width:100%;padding:10px;background:cyan;color:black;font-weight:bold;border:none;border-radius:6px;cursor:pointer;">
          ${submitText}
        </button>
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

// === Отправка данных в Google Apps Script ===
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

// === Модалки ===
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

// === Привязка событий — только после загрузки DOM ===
window.addEventListener("DOMContentLoaded", () => {
  const cubes = document.querySelectorAll(".cube");
  cubes.forEach(cube => {
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
});
