const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyefseEIon_KCKUwvq05tCq2-tUtfx1Np49yUEaCI8dhudGisUEL-RfXEffhTFEx6_rKg/exec";

const wrapper = document.getElementById("wrapper");

// === Орбиты ===
const orbitSettings = [
  { count: 52, radius: 580, color: "#00fff2", size: 36, direction: 1, speed: 0.0012 }, // внешняя
  { count: 36, radius: 460, color: "#00fff2", size: 44, direction: -1, speed: 0.0009 }, // средняя
  { count: 21, radius: 340, color: "#00fff2", size: 54, direction: 1, speed: 0.0012 }, // внутренняя
];

let cubeNumber = 1;

// === Создаём кубы по орбитам ===
orbitSettings.forEach((orbit) => {
  orbit.cubes = [];
  for (let j = 0; j < orbit.count; j++) {
    const cube = document.createElement("div");
    cube.classList.add("cube");
    cube.textContent = `#${cubeNumber++}`;
    cube.dataset.type = "common"; // тип куба (для цвета модалки)

    const angle = (j / orbit.count) * Math.PI * 2;
    cube.dataset.angle = angle;

    Object.assign(cube.style, {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: `${orbit.size}px`,
      height: `${orbit.size}px`,
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
wrapper.appendChild(centerCube);

// === Куб Добра ===
const goodCube = document.createElement("div");
goodCube.classList.add("cube");
goodCube.textContent = "КУБ ДОБРА";
goodCube.dataset.type = "good";
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
goodCube.addEventListener("mouseenter", () => {
  goodCube.style.transform = "translateX(-50%) scale(1.15)";
  goodCube.style.boxShadow = "0 0 50px #00ff00, 0 0 90px #00ff00";
});
goodCube.addEventListener("mouseleave", () => {
  goodCube.style.transform = "translateX(-50%) scale(1)";
  goodCube.style.boxShadow = "0 0 25px #00ff00";
});
wrapper.appendChild(goodCube);

// === Герои ===
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
  cube.dataset.type = "hero";
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

// === Умное масштабирование ===
let userScale = 1;

function scaleScene() {
  const container = document.getElementById("container");
  const availableWidth = container.clientWidth;
  const availableHeight = container.clientHeight;
  const maxRadius = Math.max(...orbitSettings.map(o => o.radius));
  const padding = Math.min(availableWidth, availableHeight) * 0.08;
  const scaleByHeight = (availableHeight - padding * 2) / (maxRadius * 2);
  const scaleByWidth = (availableWidth - padding * 2) / (maxRadius * 2);
  const targetScale = Math.min(scaleByHeight, scaleByWidth);
  const finalScale = targetScale * userScale;
  wrapper.style.transform = `translate(-50%, -50%) scale(${finalScale})`;
}
window.addEventListener("resize", scaleScene);
window.addEventListener("load", scaleScene);
scaleScene();

// === Ручное масштабирование колесиком ===
window.addEventListener("wheel", (e) => {
  if (e.ctrlKey || e.altKey || e.metaKey) {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    userScale = Math.min(Math.max(userScale + delta, 0.3), 3);
    scaleScene();
  }
}, { passive: false });

// === Плавное появление сцены ===
window.addEventListener("load", () => {
  const wrapper = document.getElementById("scene-wrapper");
  setTimeout(() => wrapper.classList.add("loaded"), 200);
});

// === Модальное окно для кубов ===
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const closeModal = document.querySelector(".close");

let cubeData = {}; // сюда загрузим JSON

// Загружаем данные из data.json
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    cubeData = data;
    console.log("✅ Данные о кубах загружены");
  })
  .catch(err => console.error("❌ Ошибка загрузки JSON:", err));

// === Функция открытия модалки ===
function showModal(title, description, actionText) {
  modalTitle.textContent = title;
  modalDescription.innerHTML = `${description}<br><br><button class="modal-btn">${actionText}</button>`;
  modal.classList.add("show");
}

// === Обработчики кликов на кубы ===
document.addEventListener("click", (e) => {
  const cube = e.target.closest(".cube");
  if (!cube) return;

  const text = cube.textContent.trim();

  // Центральный куб
  if (text === "ЦЕНТР") {
    const d = cubeData.center;
    showModal(d.title, d.description, d.action);
    return;
  }

  // Куб Добра
  if (text === "КУБ ДОБРА") {
    const d = cubeData.good;
    showModal(d.title, d.description, d.action);
    return;
  }

  // Кубы героев
  if (text.includes("Герой")) {
    const index = parseInt(text.replace(/\D/g, ""), 10) - 1;
    const d = cubeData.heroes[index] || cubeData.heroes[0];
    showModal(d.title, d.description, d.action);
    return;
  }

  // Остальные (обычные орбиты)
  const d = cubeData.orbitCubes;
  showModal(
    `${d.title}${text.replace("#", "")}`,
    `${d.description}<br>Стоимость: ${d.price}`,
    d.action
  );
});

// === Закрытие модалки ===
closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
});
window.addEventListener("click", (event) => {
  if (event.target === modal) modal.classList.remove("show");
});

// === Отправка данных в Google Sheets ===
function sendDataToGoogle(data) {
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then(() => {
    showNotify("✅ Заявка успешно отправлена!");
  })
  .catch((error) => {
    console.error("Ошибка отправки:", error);
    alert("❌ Произошла ошибка при отправке данных.");
  });
}
// === Обработка кликов по кнопке внутри модалки ===
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-btn")) {
    const cubeTitle = document.getElementById("modal-title").textContent;
    const cubeDescription = document.getElementById("modal-description").textContent;

    sendDataToGoogle({
      cube: cubeTitle,
      description: cubeDescription,
      timestamp: new Date().toISOString(),
    });

    modal.classList.remove("show");
  }
});
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
