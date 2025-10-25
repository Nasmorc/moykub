const scene = document.getElementById("scene");
const container = document.getElementById("container");

const cubeCount = 125;
const orbitCount = 3;
const orbitSpacing = 120;
const cubes = [];

const heroes = [];
let maxRadius = orbitCount * orbitSpacing;

// === Создание орбит ===
for (let i = 1; i <= orbitCount; i++) {
  const ring = document.createElement("div");
  ring.className = "orbit-ring";
  const radius = i * orbitSpacing;
  ring.style.width = `${radius * 2}px`;
  ring.style.height = `${radius * 2}px`;
  ring.style.left = "50%";
  ring.style.top = "50%";
  scene.appendChild(ring);
}

// === Центральный куб ===
const centerCube = document.createElement("div");
centerCube.className = "cube";
centerCube.id = "center";
centerCube.innerText = "ЦЕНТР";
scene.appendChild(centerCube);

// === Куб добра ===
const goodCube = document.createElement("div");
goodCube.className = "cube";
goodCube.id = "goodCube";
goodCube.innerText = "КУБ\nДОБРА";
scene.appendChild(goodCube);

// === Герои ===
for (let i = 1; i <= 3; i++) {
  const hero = document.createElement("div");
  hero.className = "cube hero";
  hero.innerText = `Герой ${i}`;
  scene.appendChild(hero);
  heroes.push(hero);
}

// === Основные кубы ===
for (let i = 1; i <= cubeCount; i++) {
  const cube = document.createElement("div");
  cube.className = "cube";
  cube.innerText = `#${i}`;
  scene.appendChild(cube);
  cubes.push(cube);
}

// === Расположение кубов по орбитам ===
function arrangeCubes() {
  const orbitAngles = [0, 0, 0];
  const cubesPerOrbit = Math.ceil(cubeCount / orbitCount);

  cubes.forEach((cube, i) => {
    const orbitIndex = Math.floor(i / cubesPerOrbit);
    const radius = (orbitIndex + 1) * orbitSpacing;
    const angle = (orbitAngles[orbitIndex] += (2 * Math.PI) / cubesPerOrbit);
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    cube.style.left = `calc(50% + ${x}px)`;
    cube.style.top = `calc(50% + ${y}px)`;
  });

  // Центр и Куб Добра
  centerCube.style.left = "50%";
  centerCube.style.top = "50%";

  goodCube.style.left = "50%";
  goodCube.style.top = `calc(50% + ${orbitSpacing * 1.1}px)`;
}

// === Масштабирование сцены под экран ===
function scaleScene() {
  const availableWidth = container.clientWidth;
  const availableHeight = container.clientHeight;
  const padding = 0.9; // немного отступов

  const neededSize = maxRadius * 2.5;
  const scaleX = (availableWidth * padding) / neededSize;
  const scaleY = (availableHeight * padding) / neededSize;
  const scale = Math.min(scaleX, scaleY);

  scene.style.left = "50%";
  scene.style.top = "50%";
  scene.style.transform = `translate(-50%, -50%) scale(${scale})`;

  // Центрируем надписи обратно (не масштабируем)
  const titleEl = document.querySelector("h1");
  const subtitleEl = document.querySelector(".subtitle");

  if (titleEl && subtitleEl) {
    const inverseScale = 1 / scale; // обратный масштаб
    titleEl.style.transform = `scale(${inverseScale})`;
    subtitleEl.style.transform = `scale(${inverseScale})`;
  }
}

// === Анимация героев вокруг центра ===
function animateHeroes() {
  const time = Date.now() * 0.001;
  const radius = orbitSpacing * 1.5;

  heroes.forEach((hero, i) => {
    const angle = time + (i * (2 * Math.PI)) / heroes.length;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    hero.style.left = `calc(50% + ${x}px)`;
    hero.style.top = `calc(50% + ${y}px)`;
  });

  requestAnimationFrame(animateHeroes);
}

// === Инициализация ===
arrangeCubes();
scaleScene();
animateHeroes();

window.addEventListener("resize", scaleScene);
