/***** 1) КОНСТАНТЫ И УТИЛИТЫ *****/
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx6tsy4hyZw_iOKlU5bUSEAVjckwY7SYh4zyaVLn5AftRg7T0gztg3K1AdIOUWCL7Nc_Q/exec";
const WEB_APP_SECRET = "MYKUB_SECRET_2025";

const wrapper = document.getElementById("wrapper");

// Уведомление (внизу экрана)
function showNotify(text) {
  let box = document.getElementById("notify");
  if (!box) {
    box = document.createElement("div");
    box.id = "notify";
    document.body.appendChild(box);
  }
  box.textContent = text;
  box.classList.add("show");
  setTimeout(() => box.classList.remove("show"), 3000);
}

// Отправка в Google Sheets без CORS (form-urlencoded)
async function postToSheets(type, payload) {
  const data = { type, secret: WEB_APP_SECRET, ...payload };
  const body = new URLSearchParams({ payload: JSON.stringify(data) }).toString();

  const res  = await fetch(WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body
  });

  const text = await res.text();
  try { return JSON.parse(text); }
  catch { return { ok: false, error: "Некорректный ответ сервера" }; }
}

// Вспомогательно: создать модалку по id, если её нет
function ensureModal(id, innerHtml) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("div");
    el.id = id;
    el.className = "modal";
    el.innerHTML = `
      <div class="modal-content">
        <span class="close" data-close="${id}">&times;</span>
        ${innerHtml}
      </div>
    `;
    document.body.appendChild(el);
    // обработчики закрытия
    el.querySelector(`[data-close="${id}"]`).addEventListener("click", () => el.classList.remove("show"));
    window.addEventListener("click", (e) => { if (e.target === el) el.classList.remove("show"); });
  }
  return el;
}
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("show");
}

/***** 2) СЦЕНА: ОРБИТЫ, ЦЕНТР, КУБ ДОБРА, ГЕРОИ *****/

// Настройки орбит (как у тебя было, с анимацией)
const orbitSettings = [
  { count: 52, radius: 580, color: "#00fff2", size: 36, direction: 1,  speed: 0.0012 }, // внешняя
  { count: 36, radius: 460, color: "#00fff2", size: 44, direction: -1, speed: 0.0009 }, // средняя
  { count: 22, radius: 360, color: "#00fff2", size: 54, direction: 1,  speed: 0.0011 }, // внутренняя (22 чтобы заполнить разрыв)
];

let cubeNumber = 1;
orbitSettings.forEach((orbit) => {
  orbit.cubes = [];
  for (let j = 0; j < orbit.count; j++) {
    const cube = document.createElement("div");
    cube.classList.add("cube");
    cube.textContent = `#${cubeNumber++}`;
    cube.dataset.type = "common";

    const angle = (j / orbit.count) * Math.PI * 2;
    cube.dataset.angle = angle;

    Object.assign(cube.style, {
      position: "absolute",
      left: "50%", top: "50%",
      width: `${orbit.size}px`, height: `${orbit.size}px`,
      fontSize: `${Math.max(10, orbit.size * 0.38)}px`,
      borderColor: orbit.color,
      boxShadow: `0 0 ${orbit.size * 0.9}px ${orbit.color}`,
      transition: "transform 0.25s ease, box-shadow 0.25s ease",
    });

    cube.addEventListener("mouseenter", () => {
      cube.style.transform += " scale(1.18)";
      cube.style.boxShadow = `0 0 ${orbit.size * 1.6}px ${orbit.color}`;
    });
    cube.addEventListener("mouseleave", () => {
      cube.style.boxShadow = `0 0 ${orbit.size * 0.9}px ${orbit.color}`;
    });

    // Клик по номерному кубу → форма аренды
    cube.addEventListener("click", () => openRentModal(cube.textContent.replace("#","")));

    wrapper.appendChild(cube);
    orbit.cubes.push(cube);
  }
});

// Центральный куб (аукцион)
const centerCube = document.createElement("div");
centerCube.classList.add("cube");
centerCube.textContent = "ЦЕНТР";
centerCube.dataset.type = "center";
Object.assign(centerCube.style, {
  width: "120px", height: "120px", fontSize: "18px",
  borderColor: "#ff00ff",
  boxShadow: "0 0 25px #ff00ff, 0 0 40px #ff00ff",
  position: "absolute", left: "50%", top: "50%",
  transform: "translate(-50%, -50%)", zIndex: "10",
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
});
centerCube.addEventListener("mouseenter", () => {
  centerCube.style.transform = "translate(-50%, -50%) scale(1.12)";
  centerCube.style.boxShadow = "0 0 60px #ff00ff, 0 0 90px #ff00ff";
});
centerCube.addEventListener("mouseleave", () => {
  centerCube.style.transform = "translate(-50%, -50%) scale(1)";
  centerCube.style.boxShadow = "0 0 25px #ff00ff, 0 0 40px #ff00ff";
});
centerCube.addEventListener("click", () => openAuctionModal()); // аукцион
wrapper.appendChild(centerCube);

// Куб Добра (под центром, статичен)
const goodCube = document.createElement("div");
goodCube.classList.add("cube");
goodCube.textContent = "КУБ ДОБРА";
goodCube.dataset.type = "good";
Object.assign(goodCube.style, {
  width: "84px", height: "84px", fontSize: "14px",
  borderColor: "#00ff00",
  boxShadow: "0 0 25px #00ff00",
  position: "absolute", left: "50%", top: "calc(50% + 150px)",
  transform: "translateX(-50%)", zIndex: "9",
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
});
goodCube.addEventListener("mouseenter", () => {
  goodCube.style.transform = "translateX(-50%) scale(1.1)";
  goodCube.style.boxShadow = "0 0 50px #00ff00, 0 0 90px #00ff00";
});
goodCube.addEventListener("mouseleave", () => {
  goodCube.style.transform = "translateX(-50%) scale(1)";
  goodCube.style.boxShadow = "0 0 25px #00ff00";
});
goodCube.addEventListener("click", () => openStoryModal());
wrapper.appendChild(goodCube);

// Герои месяца (3 куба вокруг центра, берут ссылки из data.json)
const defaultHeroes = [
  { label: "Герой 1", link: "#" },
  { label: "Герой 2", link: "#" },
  { label: "Герой 3", link: "#" },
];
let heroesData = defaultHeroes.slice();

async function loadHeroes() {
  try {
    const res = await fetch("data.json", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.heroes)) heroesData = json.heroes;
    }
  } catch {}
}
loadHeroes().finally(buildHeroes);

const heroes = [];
const heroRadius = 250;
const heroSpeed  = 0.008;

function buildHeroes() {
  const positionsDeg = [210, 330, 90]; // 8, 4, 12 часов
  for (let i = 0; i < 3; i++) {
    const hero = document.createElement("div");
    hero.classList.add("cube");
    hero.textContent = heroesData[i]?.label || `Герой ${i+1}`;
    hero.dataset.type = "hero";
    Object.assign(hero.style, {
      width: "72px", height: "72px", fontSize: "13px",
      borderColor: "#ff00ff",
      boxShadow: "0 0 20px #ff00ff",
      position: "absolute", left: "50%", top: "50%",
      transition: "transform 0.25s ease, box-shadow 0.25s ease",
      cursor: "pointer"
    });
    hero.dataset.angle = (positionsDeg[i] * Math.PI) / 180;

    // клик — открыть ссылку героя
    const link = heroesData[i]?.link || "#";
    hero.addEventListener("click", (e) => {
      e.stopPropagation();
      if (link && link !== "#") window.open(link, "_blank", "noopener");
    });

    wrapper.appendChild(hero);
    heroes.push(hero);
  }
}

/***** 3) АНИМАЦИЯ И АВТОМАСШТАБ *****/
function animateScene() {
  // герои
  heroes.forEach(hero => {
    let angle = parseFloat(hero.dataset.angle);
    const x = Math.cos(angle) * heroRadius;
    const y = Math.sin(angle) * heroRadius;
    hero.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    hero.dataset.angle = angle + heroSpeed;
  });

  // орбиты
  orbitSettings.forEach(orbit => {
    orbit.cubes.forEach(cube => {
      let angle = parseFloat(cube.dataset.angle);
      angle += orbit.speed * orbit.direction;
      cube.dataset.angle = angle;
      const x = Math.cos(angle) * orbit.radius;
      const y = Math.sin(angle) * orbit.radius;
      cube.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
  });

  requestAnimationFrame(animateScene);
}
animateScene();

// Автомасштаб под экран
let userScale = 1;
function scaleScene() {
  const container = document.getElementById("container");
  const W = container.clientWidth;
  const H = container.clientHeight;
  const maxRadius = Math.max(...orbitSettings.map(o => o.radius));
  const padding = Math.min(W, H) * 0.08;
  const sH = (H - padding * 2) / (maxRadius * 2);
  const sW = (W - padding * 2) / (maxRadius * 2);
  const targetScale = Math.min(sH, sW);
  wrapper.style.transform = `translate(-50%, -50%) scale(${targetScale * userScale})`;
}
window.addEventListener("resize", scaleScene);
window.addEventListener("load", scaleScene);
scaleScene();
window.addEventListener("wheel", (e) => {
  if (e.ctrlKey || e.altKey || e.metaKey) {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    userScale = Math.min(Math.max(userScale + delta, 0.3), 3);
    scaleScene();
  }
}, { passive: false });

/***** 4) ФОРМЫ: АРЕНДА, КУБ ДОБРА, АУКЦИОН *****/

// Аренда (по клику на номерной куб)
function openRentModal(cubeId) {
  const html = `
    <h2 id="rentTitle">Заявка на аренду #${cubeId}</h2>
    <form id="rentForm">
      <input type="text" id="rentCube" value="#${cubeId}" readonly />
      <input type="text" id="rentName" placeholder="Ваше имя" required />
      <input type="text" id="rentContact" placeholder="Контакт (Telegram / Email)" required />
      <textarea id="rentMsg" placeholder="Комментарий (по желанию)"></textarea>
      <button type="submit" class="modal-btn">Отправить заявку</button>
    </form>
  `;
  const modal = ensureModal("rentModal", html);
  openModal("rentModal");

  const form = modal.querySelector("#rentForm");
  form.onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
      cubeId:  String(cubeId),
      name:    modal.querySelector("#rentName").value.trim(),
      contact: modal.querySelector("#rentContact").value.trim(),
      message: modal.querySelector("#rentMsg").value.trim(),
    };
    try {
      const r = await postToSheets("rent", payload);
      if (r.ok) {
        modal.classList.remove("show");
        showNotify("✅ Заявка на аренду отправлена!");
        form.reset();
      } else showNotify("❌ Ошибка отправки: " + (r.error || ""));
    } catch {
      showNotify("⚠️ Не удалось связаться с сервером.");
    }
  };
}

// Куб Добра (форма истории)
function openStoryModal() {
  const html = `
    <h2>💚 Расскажи о своей ситуации</h2>
    <p>Мы читаем каждую историю. Напиши, что случилось, и как тебе можно помочь.</p>
    <form id="storyForm">
      <input type="text" id="storyName" placeholder="Твоё имя" required />
      <input type="text" id="storyContact" placeholder="Контакт (Telegram / Email)" required />
      <textarea id="storyText" placeholder="Опиши свою ситуацию..." required></textarea>
      <button type="submit" class="modal-btn">Отправить</button>
    </form>
  `;
  const modal = ensureModal("storyModal", html);
  openModal("storyModal");

  const form = modal.querySelector("#storyForm");
  form.onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name:    modal.querySelector("#storyName").value.trim(),
      contact: modal.querySelector("#storyContact").value.trim(),
      story:   modal.querySelector("#storyText").value.trim(),
    };
    try {
      const r = await postToSheets("story", payload);
      if (r.ok) {
        modal.classList.remove("show");
        showNotify("✅ История отправлена. Спасибо за доверие!");
        form.reset();
      } else showNotify("❌ Ошибка отправки: " + (r.error || ""));
    } catch {
      showNotify("⚠️ Не удалось связаться с сервером.");
    }
  };
}

// === Аукцион (модалка + отправка) ===
function openAuctionModal() {
  const html = `
    <h2>💎 Аукцион центрального куба</h2>
    <p>Укажи свою ставку и контакт. Победитель получает центр на месяц.</p>
    <form id="auctionForm">
      <input type="number" id="auctionAmount" placeholder="Ставка (₽)" required />
      <input type="text"   id="auctionContact" placeholder="Контакт (Telegram / Email)" required />
      <textarea id="auctionComment" placeholder="Комментарий (необязательно)"></textarea>
      <button type="submit" class="modal-btn">Сделать ставку</button>
    </form>
  `;
  const modal = ensureModal("auctionModal", html);
  openModal("auctionModal");

  const form = modal.querySelector("#auctionForm");
  form.onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
      amount:  modal.querySelector("#auctionAmount").value.trim(),
      contact: modal.querySelector("#auctionContact").value.trim(),
      comment: modal.querySelector("#auctionComment").value.trim(),
    };
    if (!payload.amount || !payload.contact) {
      showNotify("⚠️ Укажи сумму и контакт!");
      return;
    }
    try {
      const r = await postToSheets("auction", payload);
      if (r.ok) {
        modal.classList.remove("show");
        showNotify("✅ Ставка отправлена!");
        form.reset();
      } else {
        showNotify("❌ Ошибка отправки: " + (r.error || ""));
      }
    } catch {
      showNotify("⚠️ Не удалось связаться с сервером.");
    }
  };
}
