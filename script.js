// === URL и секрет Google Apps Script ===
const WEB_APP_URL   = "https://script.google.com/macros/s/AKfycbx6tsy4hyZw_iOKlU5bUSEAVjckwY7SYh4zyaVLn5AftRg7T0gztg3K1AdIOUWCL7Nc_Q/exec";
const WEB_APP_SECRET = "MYKUB_SECRET_2025";

// === Глобальные элементы ===
const wrapper = document.getElementById("wrapper");
const scene = document.getElementById("scene");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const closeModal = document.querySelector(".close");

// === Модальное окно ===
closeModal.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => {
  if (e.target === modal) modal.style.display = "none";
});

// === Сообщение на экране ===
function showToast(msg) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

// === Отправка заявки ===
async function postToSheets(type, payload) {
  const data = { type, secret: WEB_APP_SECRET, ...payload };
  const body = new URLSearchParams({ payload: JSON.stringify(data) }).toString();

  const res = await fetch(WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body,
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { ok: false, error: "Некорректный ответ сервера" };
  }
}

// === Создание кубов ===
function createCubes() {
  const total = 110;
  const radius = 200;
  const centerX = 0, centerY = 0;

  for (let i = 1; i <= total; i++) {
    const cube = document.createElement("div");
    cube.className = "cube";
    cube.textContent = `#${i}`;
    cube.dataset.id = i;

    const angle = (i / total) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    cube.style.transform = `translate(${x}px, ${y}px)`;
    cube.addEventListener("click", () => openRentModal(i));

    scene.appendChild(cube);
  }

  // центр, герой и куб добра
  const centerCube = document.createElement("div");
  centerCube.className = "cube center";
  centerCube.textContent = "ЦЕНТР";
  scene.appendChild(centerCube);

  const heroCube = document.createElement("div");
  heroCube.className = "cube hero";
  heroCube.textContent = "ГЕРОЙ";
  heroCube.addEventListener("click", openHeroModal);
  scene.appendChild(heroCube);

  const goodCube = document.createElement("div");
  goodCube.className = "cube good";
  goodCube.textContent = "КУБ ДОБРА";
  goodCube.addEventListener("click", openGoodModal);
  scene.appendChild(goodCube);
}

// === Модалка аренды ===
function openRentModal(cubeId) {
  modal.style.display = "block";
  modalTitle.textContent = `Заявка на аренду #${cubeId}`;
  modalDescription.innerHTML = `
    <form id="rentForm" class="neon-form">
      <input type="text" id="rentCube" value="#${cubeId}" readonly />
      <input type="text" id="rentName" placeholder="Имя" required />
      <input type="text" id="rentContact" placeholder="Контакт (телеграм/телефон)" required />
      <textarea id="rentMessage" placeholder="Комментарий"></textarea>
      <button type="submit">Отправить заявку</button>
    </form>
  `;

  document.getElementById("rentForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      cubeId,
      name: document.getElementById("rentName").value.trim(),
      contact: document.getElementById("rentContact").value.trim(),
      message: document.getElementById("rentMessage").value.trim(),
    };
    try {
      const r = await postToSheets("rent", payload);
      if (r.ok) {
        showToast("✅ Заявка на аренду отправлена!");
        modal.style.display = "none";
      } else {
        showToast("⚠️ Ошибка: " + (r.error || "неизвестная"));
      }
    } catch {
      showToast("⚠️ Не удалось связаться с сервером.");
    }
  });
}

// === Модалка Куба Добра ===
function openGoodModal() {
  modal.style.display = "block";
  modalTitle.textContent = "История для Куба Добра";
  modalDescription.innerHTML = `
    <form id="goodForm" class="neon-form">
      <input type="text" id="goodName" placeholder="Имя" required />
      <input type="text" id="goodContact" placeholder="Контакт (телеграм/телефон)" required />
      <textarea id="goodStory" placeholder="Опиши ситуацию, в чем нужна помощь" required></textarea>
      <button type="submit">Отправить историю</button>
    </form>
  `;

  document.getElementById("goodForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      name: document.getElementById("goodName").value.trim(),
      contact: document.getElementById("goodContact").value.trim(),
      story: document.getElementById("goodStory").value.trim(),
    };
    try {
      const r = await postToSheets("story", payload);
      if (r.ok) {
        showToast("✅ История отправлена в Куб Добра!");
        modal.style.display = "none";
      } else {
        showToast("⚠️ Ошибка: " + (r.error || "неизвестная"));
      }
    } catch {
      showToast("⚠️ Не удалось связаться с сервером.");
    }
  });
}

// === Модалка Героя ===
function openHeroModal() {
  modal.style.display = "block";
  modalTitle.textContent = "Предложить Героя месяца";
  modalDescription.innerHTML = `
    <form id="heroForm" class="neon-form">
      <input type="text" id="heroName" placeholder="Имя героя" required />
      <input type="text" id="heroContact" placeholder="Контакт (телеграм/телефон)" required />
      <textarea id="heroReason" placeholder="Почему он достоин звания Героя?" required></textarea>
      <button type="submit">Отправить заявку</button>
    </form>
  `;

  document.getElementById("heroForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      heroName: document.getElementById("heroName").value.trim(),
      contact: document.getElementById("heroContact").value.trim(),
      reason: document.getElementById("heroReason").value.trim(),
    };
    try {
      const r = await postToSheets("hero", payload);
      if (r.ok) {
        showToast("✅ Герой предложен!");
        modal.style.display = "none";
      } else {
        showToast("⚠️ Ошибка: " + (r.error || "неизвестная"));
      }
    } catch {
      showToast("⚠️ Не удалось связаться с сервером.");
    }
  });
}

// === Инициализация ===
createCubes();
