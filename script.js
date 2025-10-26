// === URL и секрет Google Apps Script ===
const WEB_APP_URL   = "https://script.google.com/macros/s/AKfycbyefseEIon_KCKUwvq05tCq2-tUtfx1Np49yUEaCI8dhudGisUEL-RfXEffhTFEx6_rKg/exec";
const WEB_APP_SECRET = "MYKUB_SECRET_2025";

const wrapper = document.getElementById("wrapper");

// === Орбиты ===
const orbitSettings = [
  { count: 52, radius: 580, color: "#00fff2", size: 36, direction: 1,  speed: 0.0012 }, // внешняя
  { count: 36, radius: 460, color: "#00fff2", size: 44, direction: -1, speed: 0.0009 }, // средняя
  { count: 21, radius: 340, color: "#00fff2", size: 54, direction: 1,  speed: 0.0012 }, // внутренняя
];

let cubeNumber = 1;

// === Создаём кубы по орбитам ===
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
      fontSize: `${orbit.size * 0.4}px`,
      borderColor: orbit.color,
      boxShadow: `0 0 ${orbit.size * 0.9}px ${orbit.color}`,
      transition: "transform 0.25s ease, box-shadow 0.25s ease",
    });

    cube.addEventListener("mouseenter", () => {
      cube.style.transform += " scale(1.25)";
      cube.style.boxShadow = `0 0 ${orbit.size * 1.8}px ${orbit.color}`;
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

// === Центральный куб ===
const centerCube = document.createElement("div");
centerCube.classList.add("cube");
centerCube.textContent = "ЦЕНТР";
centerCube.dataset.type = "center";
Object.assign(centerCube.style, {
  width: "110px", height: "110px", fontSize: "18px",
  borderColor: "#ff00ff",
  boxShadow: "0 0 25px #ff00ff, 0 0 40px #ff00ff",
  position: "absolute", left: "50%", top: "50%",
  transform: "translate(-50%, -50%)", zIndex: "10",
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
wrapper.appendChild(centerCube);

// При клике по центру — пока просто показываем инфо (позже: аукцион)
centerCube.addEventListener("click", () => {
  showInfoModal(
    "ЦЕНТР",
    "Центральный куб участвует в аукционе (скоро). Следи за новостями!",
    "Ок",
    () => closeInfoModal()
  );
});

// === Куб Добра ===
const goodCube = document.createElement("div");
goodCube.classList.add("cube");
goodCube.textContent = "КУБ ДОБРА";
goodCube.dataset.type = "good";
Object.assign(goodCube.style, {
  width: "80px", height: "80px", fontSize: "14px",
  borderColor: "#00ff00",
  boxShadow: "0 0 25px #00ff00",
  position: "absolute", left: "50%", top: "calc(50% + 150px)",
  transform: "translateX(-50%)", zIndex: "9",
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
});
goodCube.addEventListener("mouseenter", () => {
  goodCube.style.transform = "translateX(-50%) scale(1.15)";
  goodCube.style.boxShadow = "0 0 50px #00ff00, 0 0 90px #00ff00";
});
goodCube.addEventListener("mouseleave", () => {
  goodCube.style.transform = "translateX(-50%) scale(1)";
  goodCube.style.boxShadow = "0 0 25px #00ff00";
});
wrapper.appendChild(goodCube);

// Клик по «КУБ ДОБРА» → форма истории
goodCube.addEventListener("click", () => openStoryModal());

// === Герои (вращаются вокруг центра) ===
const heroes = [
  { label: "Герой 1", baseAngle: 210 },
  { label: "Герой 2", baseAngle: 330 },
  { label: "Герой 3", baseAngle: 90  },
];
const heroRadius = 250;
const heroSpeed  = 0.008;

heroes.forEach(hero => {
  const cube = document.createElement("div");
  cube.classList.add("cube");
  cube.textContent = hero.label;
  cube.dataset.type = "hero";
  Object.assign(cube.style, {
    width: "70px", height: "70px", fontSize: "13px",
    borderColor: "#ff00ff",
    boxShadow: "0 0 20px #ff00ff",
    position: "absolute", left: "50%", top: "50%",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  });
  cube.dataset.angle = (hero.baseAngle * Math.PI) / 180;

  cube.addEventListener("mouseenter", () => {
    cube.style.transform += " scale(1.2)";
    cube.style.boxShadow = "0 0 50px #ff00ff, 0 0 80px #ff00ff";
  });
  cube.addEventListener("mouseleave", () => {
    cube.style.boxShadow = "0 0 20px #ff00ff";
  });

  wrapper.appendChild(cube);
  hero.element = cube;
});

// === Анимация вращения ===
function animateScene() {
  // герои
  heroes.forEach(hero => {
    let angle = parseFloat(hero.element.dataset.angle);
    const x = Math.cos(angle) * heroRadius;
    const y = Math.sin(angle) * heroRadius;
    hero.element.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    hero.element.dataset.angle = angle + heroSpeed;
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

// === Авто-масштаб ===
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

// === Инфо-модалка (если понадобится показать текст и кнопку) ===
const infoModal = document.getElementById("modal");
const infoTitle = document.getElementById("modal-title");
const infoDesc  = document.getElementById("modal-description");
const infoAct   = document.getElementById("modal-action");
const closeInfo = document.getElementById("closeInfo");

function showInfoModal(title, html, actionText, onAction) {
  infoTitle.textContent = title;
  infoDesc.innerHTML = html;
  infoAct.textContent = actionText || "Ок";
  infoAct.onclick = () => { onAction && onAction(); };
  infoModal.classList.add("show");
}
function closeInfoModal(){ infoModal.classList.remove("show"); }
closeInfo.addEventListener("click", closeInfoModal);
window.addEventListener("click", (e)=>{ if(e.target===infoModal) closeInfoModal(); });

// === Ненавязчивое уведомление ===
function showNotify(text) {
  const box = document.getElementById("notify");
  box.textContent = text;
  box.classList.add("show");
  setTimeout(() => box.classList.remove("show"), 3000);
}

// === Формы: КУБ ДОБРА ===
const storyModal = document.getElementById("storyModal");
const closeStory = document.getElementById("closeStory");
const storyForm  = document.getElementById("storyForm");

function openStoryModal(){ storyModal.classList.add("show"); }
closeStory.addEventListener("click", () => storyModal.classList.remove("show"));
window.addEventListener("click", (e) => { if (e.target === storyModal) storyModal.classList.remove("show"); });

storyForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    secret: WEB_APP_SECRET,
    type:   "story",
    name:   document.getElementById("storyName").value.trim(),
    contact:document.getElementById("storyContact").value.trim(),
    story:  document.getElementById("storyText").value.trim(),
    extra:  "site"
  };
  try {
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json().catch(()=>({ok:false}));
    if (json.ok) {
      storyModal.classList.remove("show");
      storyForm.reset();
      showNotify("✅ История отправлена. Спасибо за доверие!");
    } else {
      showNotify("❌ Ошибка отправки. Попробуйте позже.");
    }
  } catch {
    showNotify("⚠️ Не удалось связаться с сервером.");
  }
});

// === Формы: АРЕНДА КУБА ===
const rentModal = document.getElementById("rentModal");
const closeRent = document.getElementById("closeRent");
const rentForm  = document.getElementById("rentForm");
const rentCubeI = document.getElementById("rentCube");

function openRentModal(cubeId){
  document.getElementById("rentTitle").textContent = `Заявка на аренду #${cubeId}`;
  rentCubeI.value = `#${cubeId}`;
  rentModal.classList.add("show");
}
closeRent.addEventListener("click", () => rentModal.classList.remove("show"));
window.addEventListener("click", (e) => { if (e.target === rentModal) rentModal.classList.remove("show"); });

rentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    secret:  WEB_APP_SECRET,
    type:    "rent",
    cubeId:  rentCubeI.value.replace("#",""),
    name:    document.getElementById("rentName").value.trim(),
    contact: document.getElementById("rentContact").value.trim(),
    message: document.getElementById("rentMsg").value.trim(),
    extra:   "site"
  };
  try {
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json().catch(()=>({ok:false}));
    if (json.ok) {
      rentModal.classList.remove("show");
      rentForm.reset();
      showNotify("✅ Заявка на аренду отправлена!");
    } else {
      showNotify("❌ Ошибка отправки. Попробуйте позже.");
    }
  } catch {
    showNotify("⚠️ Не удалось связаться с сервером.");
  }
});
