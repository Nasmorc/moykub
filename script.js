/*************************************************
 * КОНФИГ API
 *************************************************/
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx6tsy4hyZw_iOKlU5bUSEAVjckwY7SYh4zyaVLn5AftRg7T0gztg3K1AdIOUWCL7Nc_Q/exec"; // ← твой актуальный /exec
const WEB_APP_SECRET = "MYKUB_SECRET_2025";

/*************************************************
 * БАЗОВАЯ СЦЕНА (минимально — только клики)
 *************************************************/
const wrapper = document.getElementById("wrapper");
const scene = document.getElementById("scene");

// Пара орбит как пример (оставил твою структуру чисел)
const orbitSettings = [
  { count: 60, radius: 600, size: 36 }, // внешняя
  { count: 44, radius: 480, size: 42 }, // средняя
  { count: 26, radius: 360, size: 52 }, // внутренняя
];

let cubeNumber = 1;

// Создаём орбиты с кубами
orbitSettings.forEach((orbit) => {
  for (let j = 0; j < orbit.count; j++) {
    const cube = document.createElement("div");
    cube.className = "cube";
    cube.textContent = `#${cubeNumber}`;
    cube.dataset.type = "rent";          // тип: обычная аренда
    cube.dataset.cubeId = cubeNumber;    // номер для формы

    placeOnOrbit(cube, orbit.radius, j, orbit.count);
    setCubeStyle(cube, orbit.size);
    scene.appendChild(cube);

    cubeNumber++;
  }
});

// Центральный куб — АУКЦИОН
const centerCube = document.createElement("div");
centerCube.className = "cube cube--center";
centerCube.textContent = "ЦЕНТР";
centerCube.dataset.type = "auction";
centerCube.style.left = "50%";
centerCube.style.top = "50%";
centerCube.style.transform = "translate(-50%, -50%)";
scene.appendChild(centerCube);

// Куб Добра
const goodCube = document.createElement("div");
goodCube.className = "cube cube--good";
goodCube.textContent = "КУБ ДОБРА";
goodCube.dataset.type = "story";
goodCube.style.left = "50%";
goodCube.style.top = "calc(50% + 170px)";
goodCube.style.transform = "translateX(-50%)";
scene.appendChild(goodCube);

// геометрия
function placeOnOrbit(el, radius, idx, total) {
  const angle = (idx / total) * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  el.style.left = "50%";
  el.style.top = "50%";
  el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
}

function setCubeStyle(cube, size) {
  cube.style.width = `${size}px`;
  cube.style.height = `${size}px`;
  cube.style.fontSize = `${Math.round(size * 0.38)}px`;
}

/*************************************************
 * МОДАЛКИ
 *************************************************/
const modal = document.getElementById("modal");
const modalDialog = modal.querySelector(".modal__dialog");

// формы
const formRent    = document.getElementById("form-rent");
const formStory   = document.getElementById("form-story");
const formAuction = document.getElementById("form-auction");
const statusBox   = document.getElementById("modal-status");
const statusTitle = document.getElementById("status-title");
const statusText  = document.getElementById("status-text");

const rentCubeInput  = document.getElementById("rent-cube");
const rentCubeLabel  = document.getElementById("rent-cube-label");

// делегирование кликов по сцене
scene.addEventListener("click", (e) => {
  const cube = e.target.closest(".cube");
  if (!cube) return;

  const type = cube.dataset.type;
  if (type === "rent") {
    openModal("rent", { cubeId: cube.dataset.cubeId || "" });
  } else if (type === "story") {
    openModal("story");
  } else if (type === "auction") {
    openModal("auction");
  }
});

// открытие
function openModal(kind, data = {}) {
  hideAllForms();

  if (kind === "rent") {
    rentCubeInput.value = data.cubeId || "";
    rentCubeLabel.textContent = data.cubeId ? `#${data.cubeId}` : "";
    formRent.hidden = false;
  }
  if (kind === "story") {
    formStory.hidden = false;
  }
  if (kind === "auction") {
    formAuction.hidden = false;
  }

  statusBox.hidden = true;

  modal.setAttribute("aria-hidden", "false");
  modal.classList.add("show");
}

// закрытие
function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  hideAllForms();
}

function hideAllForms() {
  formRent.hidden = true;
  formStory.hidden = true;
  formAuction.hidden = true;
  statusBox.hidden = true;
}

// крестики и фон
modal.addEventListener("click", (e) => {
  if (e.target === modal || e.target.hasAttribute("data-close")) {
    closeModal();
  }
});
modalDialog.addEventListener("click", (e) => e.stopPropagation());

/*************************************************
 * ОТПРАВКА ФОРМ
 *************************************************/
formRent.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    type: "rent",
    secret: WEB_APP_SECRET,
    cubeId: (document.getElementById("rent-cube").value || "").trim(),
    name: (document.getElementById("rent-name").value || "").trim(),
    contact: (document.getElementById("rent-contact").value || "").trim(),
    link: (document.getElementById("rent-link").value || "").trim(),
    message: (document.getElementById("rent-msg").value || "").trim()
  };
  await postPayload(payload, "Заявка отправлена!", "Мы свяжемся с вами.");
});

formStory.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    type: "story",
    secret: WEB_APP_SECRET,
    name: (document.getElementById("story-name").value || "").trim(),
    contact: (document.getElementById("story-contact").value || "").trim(),
    link: (document.getElementById("story-link").value || "").trim(),
    story: (document.getElementById("story-text").value || "").trim()
  };
  await postPayload(payload, "История отправлена!", "Спасибо, мы обязательно прочтём.");
});

formAuction.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    type: "auction",
    secret: WEB_APP_SECRET,
    bid: Number(document.getElementById("auction-bid").value || 0),
    contact: (document.getElementById("auction-contact").value || "").trim(),
    link: (document.getElementById("auction-link").value || "").trim(),
    comment: (document.getElementById("auction-comment").value || "").trim()
  };
  await postPayload(payload, "Ставка принята!", "Удачи в аукционе!");
});

// отправка
async function postPayload(payload, okTitle, okText) {
  try {
    const params = new URLSearchParams();
    params.set("payload", JSON.stringify(payload));

    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: params.toString()
    });

    const data = await res.json().catch(() => ({}));
    if (data && data.ok) {
      showStatus(okTitle, okText);
    } else {
      const msg = (data && data.error) ? String(data.error) : "Ошибка отправки";
      showStatus("Ошибка", msg);
    }
  } catch (err) {
    showStatus("Ошибка сети", "Не удалось связаться с сервером.");
  }
}

function showStatus(title, text) {
  hideAllForms();
  statusTitle.textContent = title;
  statusText.textContent  = text;
  statusBox.hidden = false;
}

/*************************************************
 * МАСШТАБИРОВАНИЕ (как у тебя)
 *************************************************/
let userScale = 1;
function scaleScene() {
  const cont = document.getElementById("container");
  const w = cont.clientWidth;
  const h = cont.clientHeight;
  const maxR = 600; // радиус внешней орбиты
  const padding = Math.min(w, h) * 0.08;
  const sH = (h - padding * 2) / (maxR * 2);
  const sW = (w - padding * 2) / (maxR * 2);
  const s = Math.min(sH, sW) * userScale;
  wrapper.style.transform = `translate(-50%, -50%) scale(${s})`;
}
window.addEventListener("resize", scaleScene);
window.addEventListener("load", scaleScene);
scaleScene();
