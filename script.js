/***** 0) НАСТРОЙКИ *****/
const WEB_APP_URL   = "https://script.google.com/macros/s/AKfycbyRycNIb8G5-LRFLbcDSUoQ3l_5YSbocf8wFRC7IiEaWLZNioetisj70liDefbs8DTbqw/exec";
const WEB_APP_SECRET = "MYKUB_SECRET_2025";

const wrapper = document.getElementById("wrapper");

/***** Уведомления *****/
function showNotify(text) {
  let box = document.getElementById("notify");
  if (!box) {
    box = document.createElement("div");
    box.id = "notify";
    box.style.cssText = `
      position:fixed;left:50%;bottom:32px;transform:translateX(-50%);
      padding:14px 18px;border-radius:10px;background:rgba(0,0,0,.8);
      color:#0ff;font-weight:600;box-shadow:0 0 20px #0ff;z-index:2000;
      opacity:0;transition:.25s;pointer-events:none;
    `;
    document.body.appendChild(box);
  }
  box.textContent = text;
  box.style.opacity = "1";
  setTimeout(() => (box.style.opacity = "0"), 2500);
}

/***** Отправка в Google Sheets (без CORS) *****/
async function postToSheets(type, payload) {
  const data = { type, secret: WEB_APP_SECRET, ...payload };
  const body = new URLSearchParams({ payload: JSON.stringify(data) }).toString();

  const res = await fetch(WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body
  });

  // Возможен text/plain – аккуратно парсим
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { ok:false, error:"Некорректный ответ сервера" }; }
}

/***** Генератор модалки (универсальный и стабильный) *****/
function ensureModal(id, innerHtml) {
  let el = document.getElementById(id);

  // создаём, если нет
  if (!el) {
    el = document.createElement("div");
    el.id = id;
    el.className = "modal";
    el.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(6px);
      display:none;align-items:center;justify-content:center;z-index:1500;
    `;
    el.innerHTML = `
      <div class="modal-content" style="
        position:relative;max-width:520px;width:92%;padding:26px 28px;border-radius:16px;
        background:rgba(0,0,0,.9);border:2px solid cyan;box-shadow:0 0 25px cyan, inset 0 0 25px cyan;
        color:#fff;text-align:left">
        <span class="close" style="
          position:absolute;right:16px;top:10px;font-size:28px;color:cyan;cursor:pointer;">&times;</span>
        ${innerHtml}
      </div>
    `;
    document.body.appendChild(el);

    // обработчик крестика
    el.querySelector(".close").addEventListener("click", () => closeModal(id));
    // закрытие по клику вне окна
    el.addEventListener("click", (e) => {
      if (e.target === el) closeModal(id);
    });
  } else {
    // если модалка уже есть — просто обновляем содержимое
    el.querySelector(".modal-content").innerHTML = `
      <span class="close" style="
        position:absolute;right:16px;top:10px;font-size:28px;color:cyan;cursor:pointer;">&times;</span>
      ${innerHtml}
    `;
    el.querySelector(".close").addEventListener("click", () => closeModal(id));
  }

  return el;
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("show"), (el.style.display = "flex");
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove("show");
    el.style.display = "none";
  }
}

/***** 1) СЦЕНА *****/
const orbitSettings = [
  { count: 52, radius: 580, color: "#00fff2", size: 36, direction:  1, speed: 0.0012 }, // внешняя
  { count: 36, radius: 460, color: "#00fff2", size: 44, direction: -1, speed: 0.0009 }, // средняя
  { count: 22, radius: 360, color: "#00fff2", size: 54, direction:  1, speed: 0.0011 }, // внутренняя
];

let cubeNumber = 1;
orbitSettings.forEach(orbit => {
  orbit.cubes = [];
  for (let j = 0; j < orbit.count; j++) {
    const cube = document.createElement("div");
    cube.className = "cube";
    cube.textContent = `#${cubeNumber++}`;
    cube.dataset.type = "common";

    const angle = (j / orbit.count) * Math.PI * 2;
    cube.dataset.angle = angle;

    Object.assign(cube.style, {
      position: "absolute", left: "50%", top: "50%",
      width: `${orbit.size}px`, height: `${orbit.size}px`,
      fontSize: `${Math.max(10, orbit.size * .38)}px`,
      border: `2px solid ${orbit.color}`, borderRadius: "12px",
      boxShadow: `0 0 ${orbit.size*0.9}px ${orbit.color}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: orbit.color, background: "transparent", cursor: "pointer",
      transition: "transform .25s, box-shadow .25s"
    });

    cube.addEventListener("mouseenter", () => {
      cube.style.transform += " scale(1.18)";
      cube.style.boxShadow = `0 0 ${orbit.size*1.6}px ${orbit.color}`;
    });
    cube.addEventListener("mouseleave", () => {
      cube.style.boxShadow = `0 0 ${orbit.size*0.9}px ${orbit.color}`;
    });

    cube.addEventListener("click", () => openRentModal(cube.textContent.replace("#","")));

    wrapper.appendChild(cube);
    orbit.cubes.push(cube);
  }
});

// центр — аукцион
const centerCube = document.createElement("div");
centerCube.className = "cube";
centerCube.textContent = "ЦЕНТР";
Object.assign(centerCube.style, {
  position: "absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)",
  width:"120px", height:"120px", border:"2px solid #ff00ff", borderRadius:"14px",
  display:"flex", alignItems:"center", justifyContent:"center",
  color:"#ff00ff", fontSize:"18px", boxShadow:"0 0 25px #ff00ff,0 0 40px #ff00ff",
  cursor:"pointer", zIndex:10, transition:"transform .25s, box-shadow .25s"
});
centerCube.addEventListener("mouseenter", () => {
  centerCube.style.transform = "translate(-50%,-50%) scale(1.12)";
  centerCube.style.boxShadow = "0 0 60px #ff00ff, 0 0 90px #ff00ff";
});
centerCube.addEventListener("mouseleave", () => {
  centerCube.style.transform = "translate(-50%,-50%)";
  centerCube.style.boxShadow = "0 0 25px #ff00ff, 0 0 40px #ff00ff";
});
centerCube.addEventListener("click", openAuctionModal);
wrapper.appendChild(centerCube);

// Куб Добра
const goodCube = document.createElement("div");
goodCube.className = "cube";
goodCube.textContent = "КУБ ДОБРА";
Object.assign(goodCube.style, {
  position:"absolute", left:"50%", top:"calc(50% + 150px)", transform:"translateX(-50%)",
  width:"84px", height:"84px", border:"2px solid #00ff00", borderRadius:"12px",
  display:"flex", alignItems:"center", justifyContent:"center", color:"#00ff00",
  boxShadow:"0 0 25px #00ff00", cursor:"pointer", zIndex:9,
  transition:"transform .25s, box-shadow .25s"
});
goodCube.addEventListener("mouseenter", () => {
  goodCube.style.transform = "translateX(-50%) scale(1.1)";
  goodCube.style.boxShadow  = "0 0 50px #00ff00, 0 0 90px #00ff00";
});
goodCube.addEventListener("mouseleave", () => {
  goodCube.style.transform = "translateX(-50%)";
  goodCube.style.boxShadow  = "0 0 25px #00ff00";
});
goodCube.addEventListener("click", openStoryModal);
wrapper.appendChild(goodCube);

/***** Герои (берём подписи/ссылки из data.json при наличии) *****/
const defaultHeroes = [
  { label: "Герой 1", link: "#" },
  { label: "Герой 2", link: "#" },
  { label: "Герой 3", link: "#" },
];
let heroesData = defaultHeroes.slice();
(async () => {
  try {
    const r = await fetch("data.json", { cache: "no-store" });
    if (r.ok) {
      const j = await r.json();
      if (Array.isArray(j.heroes)) heroesData = j.heroes;
    }
  } catch {}
  buildHeroes();
})();

const heroes = [];
const heroRadius = 250;
const heroSpeed  = 0.008;

function buildHeroes() {
  const positionsDeg = [210, 330, 90];
  for (let i = 0; i < 3; i++) {
    const hero = document.createElement("div");
    hero.className = "cube";
    hero.textContent = heroesData[i]?.label || `Герой ${i+1}`;
    Object.assign(hero.style, {
      position:"absolute", left:"50%", top:"50%",
      width:"72px", height:"72px", border:"2px solid #ff00ff", borderRadius:"12px",
      display:"flex", alignItems:"center", justifyContent:"center",
      color:"#ff00ff", boxShadow:"0 0 20px #ff00ff", cursor:"pointer",
      transition:"transform .25s, box-shadow .25s"
    });
    hero.dataset.angle = (positionsDeg[i]*Math.PI)/180;

    const link = heroesData[i]?.link || "#";
    hero.addEventListener("click", (e) => {
      e.stopPropagation();
      if (link && link !== "#") window.open(link, "_blank", "noopener");
    });

    wrapper.appendChild(hero);
    heroes.push(hero);
  }
}

/***** Анимация *****/
function animateScene() {
  heroes.forEach(h => {
    const a = parseFloat(h.dataset.angle);
    const x = Math.cos(a)*heroRadius;
    const y = Math.sin(a)*heroRadius;
    h.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    h.dataset.angle = a + heroSpeed;
  });

  orbitSettings.forEach(o => {
    o.cubes.forEach(c => {
      let a = parseFloat(c.dataset.angle);
      a += o.speed * o.direction;
      c.dataset.angle = a;
      const x = Math.cos(a)*o.radius;
      const y = Math.sin(a)*o.radius;
      c.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
  });

  requestAnimationFrame(animateScene);
}
animateScene();

/***** Автомасштаб *****/
let userScale = 1;
function scaleScene() {
  const container = document.getElementById("container");
  const W = container.clientWidth;
  const H = container.clientHeight;
  const maxR = Math.max(...orbitSettings.map(o => o.radius));
  const pad = Math.min(W,H)*0.08;
  const sH = (H - pad*2) / (maxR*2);
  const sW = (W - pad*2) / (maxR*2);
  const s  = Math.min(sH, sW);
  wrapper.style.transform = `translate(-50%, -50%) scale(${s*userScale})`;
}
window.addEventListener("resize", scaleScene);
window.addEventListener("load", scaleScene);
scaleScene();
window.addEventListener("wheel", (e) => {
  if (e.ctrlKey || e.altKey || e.metaKey) {
    e.preventDefault();
    const d = -e.deltaY*0.001;
    userScale = Math.min(Math.max(userScale + d, 0.3), 3);
    scaleScene();
  }
},{passive:false});

/***** 2) ФОРМЫ *****/

/** Аренда куба (номерной) — добавлено поле "ссылка" */
function openRentModal(cubeId) {
  const html = `
    <h2 style="margin:0 0 10px">Заявка на аренду #${cubeId}</h2>
    <form id="rentForm" style="display:grid;gap:10px">
      <input type="text" id="rentCube" value="#${cubeId}" readonly />
      <input type="text" id="rentName" placeholder="Ваше имя" required />
      <input type="text" id="rentContact" placeholder="Контакт (Telegram / Email)" required />
      <input type="text" id="rentLink" placeholder="Ссылка (что размещаем)" />
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
      link:    modal.querySelector("#rentLink").value.trim(),
      message: modal.querySelector("#rentMsg").value.trim(),
    };
    try {
      const r = await postToSheets("rent", payload);
      if (r.ok) {
        closeModal("rentModal"); form.reset();
        showNotify("✅ Заявка на аренду отправлена!");
      } else showNotify("❌ Ошибка: " + (r.error || ""));
    } catch { showNotify("⚠️ Не удалось связаться с сервером"); }
  };
}

/** Куб Добра (история) — добавлено поле "ссылка" */
function openStoryModal() {
  const html = `
    <h2 style="margin:0 0 10px">💚 Расскажи о своей ситуации</h2>
    <p style="margin:0 0 12px">Мы читаем каждую историю. Напиши, что случилось, и как тебе можно помочь.</p>
    <form id="storyForm" style="display:grid;gap:10px">
      <input type="text" id="storyName" placeholder="Твоё имя" required />
      <input type="text" id="storyContact" placeholder="Контакт (Telegram / Email)" required />
      <input type="text" id="storyLink" placeholder="Ссылка (если есть)" />
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
      link:    modal.querySelector("#storyLink").value.trim(),
      story:   modal.querySelector("#storyText").value.trim(),
    };
    try {
      const r = await postToSheets("story", payload);
      if (r.ok) {
        closeModal("storyModal"); form.reset();
        showNotify("✅ История отправлена. Спасибо!");
      } else showNotify("❌ Ошибка: " + (r.error || ""));
    } catch { showNotify("⚠️ Не удалось связаться с сервером"); }
  };
}

/** Аукцион центра — добавлено поле "ссылка" */
function openAuctionModal() {
  const html = `
    <h2 style="margin:0 0 10px">💎 Аукцион центрального куба</h2>
    <p style="margin:0 0 12px">Укажи ставку и контакт. Победитель получает центр на месяц.</p>
    <form id="auctionForm" style="display:grid;gap:10px">
      <input type="number" id="auctionAmount" placeholder="Ставка (₽)" required />
      <input type="text"   id="auctionContact" placeholder="Контакт (Telegram / Email)" required />
      <input type="text"   id="auctionLink" placeholder="Ссылка (что размещаем)" />
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
      link:    modal.querySelector("#auctionLink").value.trim(),
      comment: modal.querySelector("#auctionComment").value.trim(),
    };

    if (!payload.amount || !payload.contact) {
      showNotify("⚠️ Укажи ставку и контакт"); 
      return;
    }

    try {
      console.log("Отправка ставки:", payload);
      const r = await postToSheets("auction", payload);
      console.log("Ответ от сервера:", r);
      if (r.ok) {
        closeModal("auctionModal"); 
        form.reset();
        showNotify("✅ Ставка отправлена!");
      } else {
        showNotify("❌ Ошибка: " + (r.error || "Неизвестно"));
      }
    } catch (err) {
      console.error("Ошибка при отправке аукциона:", err);
      showNotify("⚠️ Не удалось связаться с сервером");
    }
  };
} // ←←← ВОТ ЭТОЙ СКОБКИ НЕ ХВАТАЛО

/***** Обновление внешнего вида занятых кубов *****/
async function markBusyCubes() {
  try {
    const res = await fetch(WEB_APP_URL);
    const data = await res.json();
    console.log("Запрос занятых кубов:", data);

    data.forEach(item => {
      const cubeEl = [...document.querySelectorAll(".cube")].find(el => {
        const num = el.textContent.replace(/[^0-9]/g, "").trim();
        return num == item.cube;
      });
      if (!cubeEl) return;

      // помечаем занятым и подменяем фон
      cubeEl.classList.add("busy");
      if (item.photo) {
        cubeEl.style.setProperty("background-image", `url(${item.photo})`, "important");
      }
      // подсказка (имя + описание)
      const tip = [item.name, item.desc].filter(Boolean).join(" — ");
      if (tip) cubeEl.setAttribute("data-tip", tip);
    });

  } catch (err) {
    console.error("Ошибка при обновлении кубов:", err);
  }
}

// запускаем после отрисовки сцены
window.addEventListener("load", markBusyCubes);
