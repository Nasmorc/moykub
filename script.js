const wrapper = document.getElementById("wrapper");

// === Орбиты ===
const orbitSettings = [
  { count: 52, radius: 580, color: "#00fff2", size: 36, direction: 1, speed: 0.0012 }, // внешняя
  { count: 36, radius: 460, color: "#00fff2", size: 44, direction: -1, speed: 0.0009 }, // средняя
  { count: 21, radius: 340, color: "#00fff2", size: 54, direction: 1, speed: 0.0012 }, // внутренняя
];

let cubeNumber = 1;

// === Создаём кубы по орбитам ===
orbitSettings.forEach((orbit, i) => {
  orbit.cubes = []; // сохраняем ссылки на кубы
  for (let j = 0; j < orbit.count; j++) {
    const cube = document.createElement("div");
    cube.classList.add("cube");
    cube.textContent = `#${cubeNumber++}`;

    const angle = (j / orbit.count) * Math.PI * 2;
    cube.dataset.angle = angle; // сохраняем текущий угол

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

// === Анимация вращения героев и орбит ===
function animateScene() {
  // вращаем героев
  heroes.forEach(hero => {
    let angle = parseFloat(hero.element.dataset.angle);
    const x = Math.cos(angle) * heroRadius;
    const y = Math.sin(angle) * heroRadius;
    hero.element.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    hero.element.dataset.angle = angle + heroSpeed;
  });

  // вращаем орбиты
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

  // Радиус самой внешней орбиты
  const maxRadius = Math.max(...orbitSettings.map(o => o.radius));

  // Запас от краёв (в зависимости от экрана)
  const padding = Math.min(availableWidth, availableHeight) * 0.08; // 8% запаса

  // Расчёт масштаба под размер окна
  const scaleByHeight = (availableHeight - padding * 2) / (maxRadius * 2);
  const scaleByWidth = (availableWidth - padding * 2) / (maxRadius * 2);

  // Берём минимальный из двух масштабов — чтобы не вылезло за экран
  const targetScale = Math.min(scaleByHeight, scaleByWidth);
  const finalScale = targetScale * userScale;

  wrapper.style.transform = `translate(-50%, -50%) scale(${finalScale})`;
}

window.addEventListener("resize", scaleScene);
window.addEventListener("load", scaleScene);
scaleScene();

// — Ручное масштабирование колесиком —
window.addEventListener("wheel", (e) => {
  if (e.ctrlKey || e.altKey || e.metaKey) {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    userScale = Math.min(Math.max(userScale + delta, 0.3), 3);
    scaleScene();
  }
}, { passive: false });
