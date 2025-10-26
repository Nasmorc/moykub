// === URL и секрет Google Apps Script ===
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx6tsy4hyZw_iOKlU5bUSEAVjckwY7SYh4zyaVLn5AftRg7T0gztg3K1AdIOUWCL7Nc_Q/exec";
const WEB_APP_SECRET = "MYKUB_SECRET_2025";

const wrapper = document.getElementById("wrapper");

// === Орбиты ===
const orbitSettings = [
  { count: 52, radius: 580, color: "#00fff2", size: 36, direction: 1, speed: 0.0012 },
  { count: 36, radius: 460, color: "#00fff2", size: 44, direction: -1, speed: 0.0009 },
  { count: 21, radius: 340, color: "#00fff2", size: 54, direction: 1, speed: 0.0012 },
];

let cubeNumber = 1;

// === Создаём кубы ===
orbitSettings.forEach((orbit) => {
  orbit.cubes = [];
  for (let j = 0; j < orbit.count; j++) {
    const cube = document.createElement("div");
    cube.classList.add("cube");
    cube.textContent = `#${cubeNumber++}`;

    const angle = (j / orbit.count) * Math.PI * 2;
    cube.dataset.angle = angle;

    cube.style.position = "absolute";
    cube.style.left = "50%";
    cube.style.top = "50%";
    cube.style.width = `${orbit.size}px`;
    cube.style.height = `${orbit.size}px`;
    cube.style.fontSize = `${orbit.size * 0.4}px`;
    cube.style.borderColor = orbit.color;
    cube.style.boxShadow = `0 0 ${orbit.size * 0.9}px ${orbit.color}`;
    cube.style.transition = "transform 0.25s ease, box-shadow 0.25s ease";

    cube.addEventListener("mouseenter", () => {
      cube.style.transform += " scale(1.25)";
      cube.style.boxShadow = `0 0 ${orbit.size * 1.8}px ${orbit.color}`;
    });
    cube.addEventListener("mouseleave", () => {
      cube.style.boxShadow = `0 0 ${orbit.size * 0.9}px ${orbit.color}`;
    });

    cube.addEventListener("click", () => openRentModal(cube.textContent));

    wrapper.appendChild(cube);
    orbit.cubes.push(cube);
  }
});

// === Центральный куб ===
const centerCube = document.createElement("div");
centerCube.classList.add("cube");
centerCube.textContent = "ЦЕНТР";
Object.assign(centerCube.style, {
  width: "110px",
  height: "110px",
  fontSize: "18px",
  borderColor: "#ff00ff",
  boxShadow: "0 0 25px #ff00ff, 0 0 40px #ff00ff",
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: "10",
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
});
centerCube.addEventListener("mouseenter", () => {
  centerCube.style.transform = "translate(-50%, -50%) scale(1.15)";
  centerCube.style.boxShadow = "0 0 60px #ff00ff, 0 0 90px #ff00ff";
});
centerCube.addEventListener("mouseleave", () => {
  centerCube.style.transform = "translate(-50%, -50%) scale(1)";
  centerCube.style.boxShadow = "0 0 25px #ff00ff, 0 0 40px #ff00ff";
});
centerCube.addEventListener("click", openAuctionModal);
wrapper.appendChild(centerCube);

// === Куб Добра ===
const goodCube = document.createElement("div");
goodCube.classList.add("cube");
goodCube.textContent = "КУБ ДОБРА";
Object.assign(goodCube.style, {
  width: "80px",
  height: "80px",
  fontSize: "14px",
  borderColor: "#00ff00",
  boxShadow: "0 0 25px #00ff00",
  position: "absolute",
  left: "50%",
  top: "calc(50% + 150px)",
  transform: "translateX(-50%)",
  zIndex: "9",
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
});
goodCube.addEventListener("click", openStoryModal);
wrapper.appendChild(goodCube);

// === Герои месяца ===
const heroes = [
  { label: "Герой 1", baseAngle: 210 },
  { label: "Герой 2", baseAngle: 330 },
  { label: "Герой 3", baseAngle: 90 },
];
const heroRadius = 250;
const heroSpeed = 0.008;

heroes.forEach(hero => {
  const cube = document.createElement("div");
  cube.classList.add("cube");
  cube.textContent = hero.label;
  Object.assign(cube.style, {
    width: "70px",
    height: "70px",
    fontSize: "13px",
    borderColor: "#ff00ff",
    boxShadow: "0 0 20px #ff00ff",
    position: "absolute",
    left: "50%",
    top: "50%",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  });
  cube.dataset.angle = (hero.baseAngle * Math.PI) / 180;
  wrapper.appendChild(cube);
  hero.element = cube;
});

// === Анимация ===
function animateScene() {
  heroes.forEach(hero => {
    let angle = parseFloat(hero.element.dataset.angle);
    const x = Math.cos(angle) * heroRadius;
    const y = Math.sin(angle) * heroRadius;
    hero.element.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    hero.element.dataset.angle = angle + heroSpeed;
  });

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

// === Модальные окна ===
function ensureModal(id, innerHTML) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("div");
    el.id = id;
    el.className = "modal";
    el.innerHTML = `<div class="modal-content"><span class="close" data-close="${id}">&times;</span>${innerHTML}</div>`;
    document.body.appendChild(el);
  }
  el.querySelector(`[data-close="${id}"]`).onclick = () => el.classList.remove("show");
  el.onclick = (e) => { if (e.target === el) el.classList.remove("show"); };
  return el;
}
function openModal(id) { document.getElementById(id)?.classList.add("show"); }
function showNotify(text) {
  const n = document.createElement("div");
  n.className = "notify";
  n.textContent = text;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 2500);
}

// === Универсальная отправка в Sheets ===
async function postToSheets(type, data) {
  const body = new URLSearchParams({
    ...data,
    type,
    secret: WEB_APP_SECRET,
  });
  const res = await fetch(WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body,
  });
  return res.json();
}

// === Модалки ===
function openRentModal(cubeId) {
  const html = `
    <h2>Аренда ${cubeId}</h2>
    <form id="rentForm">
      <input type="text" id="rentName" placeholder="Имя" required />
      <input type="text" id="rentContact" placeholder="Контакт" required />
      <textarea id="rentMessage" placeholder="Комментарий (необязательно)"></textarea>
      <button type="submit" class="modal-btn">Отправить заявку</button>
    </form>`;
  const modal = ensureModal("rentModal", html);
  openModal("rentModal");

  modal.querySelector("#rentForm").onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
      cubeId,
      name: modal.querySelector("#rentName").value.trim(),
      contact: modal.querySelector("#rentContact").value.trim(),
      message: modal.querySelector("#rentMessage").value.trim(),
    };
    const res = await postToSheets("rent", payload);
    if (res.ok) {
      modal.classList.remove("show");
      showNotify("✅ Заявка отправлена!");
    } else {
      showNotify("❌ Ошибка: " + (res.error || ""));
    }
  };
}

function openStoryModal() {
  const html = `
    <h2>💚 Куб Добра</h2>
    <p>Опиши коротко свою ситуацию, мы попробуем помочь.</p>
    <form id="storyForm">
      <input type="text" id="storyName" placeholder="Имя" required />
      <input type="text" id="storyContact" placeholder="Контакт" required />
      <textarea id="storyText" placeholder="Опиши свою историю" required></textarea>
      <button type="submit" class="modal-btn">Отправить</button>
    </form>`;
  const modal = ensureModal("storyModal", html);
  openModal("storyModal");

  modal.querySelector("#storyForm").onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: modal.querySelector("#storyName").value.trim(),
      contact: modal.querySelector("#storyContact").value.trim(),
      story: modal.querySelector("#storyText").value.trim(),
    };
    const res = await postToSheets("story", payload);
    if (res.ok) {
      modal.classList.remove("show");
      showNotify("✅ История отправлена!");
    } else {
      showNotify("❌ Ошибка: " + (res.error || ""));
    }
  };
}

// === Аукцион ===
function openAuctionModal() {
  const html = `
    <h2>💎 Аукцион центрального куба</h2>
    <p>Укажи ставку и контакт. Победитель получает куб на месяц.</p>
    <form id="auctionForm">
      <input type="number" id="auctionAmount" placeholder="Ставка (₽)" required />
      <input type="text" id="auctionContact" placeholder="Контакт (Telegram / Email)" required />
      <textarea id="auctionComment" placeholder="Комментарий (необязательно)"></textarea>
      <button type="submit" class="modal-btn">Сделать ставку</button>
    </form>`;
  const modal = ensureModal("auctionModal", html);
  openModal("auctionModal");

  modal.querySelector("#auctionForm").onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
      amount: modal.querySelector("#auctionAmount").value.trim(),
      contact: modal.querySelector("#auctionContact").value.trim(),
      comment: modal.querySelector("#auctionComment").value.trim(),
    };
    const res = await postToSheets("auction", payload);
    if (res.ok) {
      modal.classList.remove("show");
      showNotify("✅ Ставка отправлена!");
    } else {
      showNotify("❌ Ошибка: " + (res.error || ""));
    }
  };
}
