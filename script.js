// Получаем сцену и контейнер
const scene = document.getElementById("scene");
const totalCubes = 125;
const orbits = 3;
const cubesPerOrbit = Math.ceil(totalCubes / orbits);
const baseRadius = 180;
const radiusStep = 100;

// Создаём орбиты с кубами
for (let i = 0; i < orbits; i++) {
  const radius = baseRadius + i * radiusStep;
  for (let j = 0; j < cubesPerOrbit; j++) {
    const cube = document.createElement("div");
    cube.classList.add("cube");
    cube.textContent = `#${i * cubesPerOrbit + j + 1}`;
    scene.appendChild(cube);

    const angle = (j / cubesPerOrbit) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    cube.style.transform = `translate(${x}px, ${y}px)`;
  }
}

// Центральный куб
const centerCube = document.createElement("div");
centerCube.classList.add("cube", "center");
centerCube.textContent = "ЦЕНТР";
scene.appendChild(centerCube);

// Куб добра
const goodCube = document.createElement("div");
goodCube.classList.add("cube", "good");
goodCube.textContent = "КУБ ДОБРА";
scene.appendChild(goodCube);

// Герои
const heroes = [];
for (let i = 1; i <= 3; i++) {
  const hero = document.createElement("div");
  hero.classList.add("cube", "hero");
  hero.textContent = `Герой ${i}`;
  scene.appendChild(hero);
  heroes.push(hero);
}

// Анимация движения героев вокруг центра
let angleOffset = 0;
function animateHeroes() {
  angleOffset += 0.01;
  const heroRadius = baseRadius - 40;

  heroes.forEach((hero, index) => {
    const angle = angleOffset + (index * Math.PI * 2) / heroes.length;
    const x = Math.cos(angle) * heroRadius;
    const y = Math.sin(angle) * heroRadius;
    hero.style.transform = `translate(${x}px, ${y}px)`;
  });

  centerCube.style.transform = `translate(-50%, -50%)`;
  goodCube.style.transform = `translate(-50%, 140px)`;

  requestAnimationFrame(animateHeroes);
}
animateHeroes();

// Масштабирование сцены при изменении размера окна
function scaleScene() {
  const sceneEl = document.getElementById("scene");
  const container = document.getElementById("container");

  const availableWidth = container.clientWidth;
  const availableHeight = container.clientHeight;
  const padding = 0.9;

  const maxRadius = baseRadius + (orbits - 1) * radiusStep;
  const neededSize = maxRadius * 2.5;

  const scaleX = (availableWidth * padding) / neededSize;
  const scaleY = (availableHeight * padding) / neededSize;
  const scale = Math.min(scaleX, scaleY);

  sceneEl.style.left = "50%";
  sceneEl.style.top = "50%";
  sceneEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

window.addEventListener("resize", scaleScene);
scaleScene();
