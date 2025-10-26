const wrapper = document.getElementById("wrapper");

// === Настройки орбит ===
// внешний → внутренний
const orbitSettings = [
  { count: 52, radius: 580, color: "#00fff2", size: 36 }, // внешняя
  { count: 36, radius: 460, color: "#00fff2", size: 44 }, // средняя — увеличили радиус
  { count: 21, radius: 340, color: "#00fff2", size: 54 }, // внутренняя — увеличили радиус
];

let cubeNumber = 1;

// === Создаём орбиты ===
orbitSettings.forEach((orbit) => {
  for (let j = 0; j < orbit.count; j++) {
    const cube = document.createElement("div");
    cube.classList.add("cube");

    cube.textContent = `#${cubeNumber}`;
    cubeNumber++;

    const angle = (j / orbit.count) * Math.PI * 2;
    const x = Math.cos(angle) * orbit.radius;
    const y = Math.sin(angle) * orbit.radius;

    cube.style.position = "absolute";
    cube.style.left = "50%";
    cube.style.top = "50%";
    cube.style.width = `${orbit.size}px`;
    cube.style.height = `${orbit.size}px`;
    cube.style.fontSize = `${orbit.size * 0.4}px`;
    cube.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    cube.style.borderColor = orbit.color;
    cube.style.boxShadow = `0 0 ${orbit.size * 0.9}px ${orbit.color}`;
    wrapper.appendChild(cube);
  }
});

// === Центральный куб ===
const centerCube = document.createElement("div");
centerCube.classList.add("cube");
centerCube.textContent = "ЦЕНТР";
centerCube.style.width = "110px"; // было 90
centerCube.style.height = "110px";
centerCube.style.fontSize = "18px";
centerCube.style.borderColor = "#ff00ff";
centerCube.style.boxShadow = "0 0 25px #ff00ff, 0 0 40px #ff00ff";
centerCube.style.position = "absolute";
centerCube.style.left = "50%";
centerCube.style.top = "50%";
centerCube.style.transform = "translate(-50%, -50%)";
centerCube.style.zIndex = "10";
wrapper.appendChild(centerCube);

// === Куб Добра ===
const goodCube = document.createElement("div");
goodCube.classList.add("cube");
goodCube.textContent = "КУБ ДОБРА";
goodCube.style.width = "80px";
goodCube.style.height = "80px";
goodCube.style.fontSize = "14px";
goodCube.style.borderColor = "#00ff00";
goodCube.style.boxShadow = "0 0 25px #00ff00";
goodCube.style.position = "absolute";
goodCube.style.left = "50%";
goodCube.style.top = "calc(50% + 140px)";
goodCube.style.transform = "translateX(-50%)";
goodCube.style.zIndex = "9";
wrapper.appendChild(goodCube);

// === Герои ===
const heroes = [
  { label: "Герой 1", baseAngle: 270 },
  { label: "Герой 2", baseAngle: 30 },
  { label: "Герой 3", baseAngle: 210 }
];

const heroRadius = 180; // чуть дальше
const heroSpeed = 0.008;

heroes.forEach(hero => {
  const cube = document.createElement("div");
  cube.classList.add("cube");
  cube.textContent = hero.label;
  cube.style.width = "70px";
  cube.style.height = "70px";
  cube.style.fontSize = "13px";
  cube.style.borderColor = "#ff00ff";
  cube.style.boxShadow = "0 0 20px #ff00ff";
  cube.style.position = "absolute";
  cube.style.left = "50%";
  cube.style.top = "50%";
  cube.dataset.angle = (hero.baseAngle * Math.PI) / 180;
  wrapper.appendChild(cube);
  hero.element = cube;
});

// === Анимация вращения героев ===
function animateHeroes() {
  heroes.forEach(hero => {
    let angle = parseFloat(hero.element.dataset.angle);
    const x = Math.cos(angle) * heroRadius;
    const y = Math.sin(angle) * heroRadius;
    hero.element.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    hero.element.dataset.angle = angle + heroSpeed;
  });
  requestAnimationFrame(animateHeroes);
}
animateHeroes();

// === Масштабирование ===
let userScale = 1;

function scaleScene() {
  const container = document.getElementById("container");
  const availableWidth = container.clientWidth;
  const availableHeight = container.clientHeight;

  const maxRadius = Math.max(...orbitSettings.map(o => o.radius)) + 250;
  const neededSize = maxRadius * 2.6;

  const scaleX = (availableWidth * 0.9) / neededSize;
  const scaleY = (availableHeight * 0.9) / neededSize;
  const baseScale = Math.min(scaleX, scaleY);

  const totalScale = baseScale * userScale;
  wrapper.style.transform = `translate(-50%, -50%) scale(${totalScale})`;
}

window.addEventListener("resize", scaleScene);
scaleScene();

window.addEventListener("wheel", (e) => {
  if (e.ctrlKey || e.altKey || e.metaKey) {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    userScale = Math.min(Math.max(userScale + delta, 0.2), 5);
    scaleScene();
  }
}, { passive: false });
