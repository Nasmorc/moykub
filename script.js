const scene = document.getElementById('scene');
const center = document.getElementById('center');
const goodCube = document.getElementById('goodCube');
const heroes = document.querySelectorAll('.hero');

const orbitCount = 4;
const cubesPerOrbit = [16, 20, 26, 32];
const orbitRadiusStep = 150;
let allCubes = [];

// создаем орбиты
for (let o = 0; o < orbitCount; o++) {
  const radius = (o + 2) * orbitRadiusStep;

  const ring = document.createElement('div');
  ring.className = 'orbit-ring';
  ring.style.width = `${radius * 2}px`;
  ring.style.height = `${radius * 2}px`;
  ring.style.left = `calc(50% - ${radius}px)`;
  ring.style.top = `calc(50% - ${radius}px)`;
  scene.appendChild(ring);

  const count = cubesPerOrbit[o];
  for (let i = 0; i < count; i++) {
    const cube = document.createElement('div');
    cube.className = 'cube orbit';
    cube.textContent = `#${i + 1 + allCubes.length}`;
    cube.dataset.angle = (i / count) * Math.PI * 2;
    cube.dataset.radius = radius;
    scene.appendChild(cube);
    allCubes.push(cube);
  }
}

function positionElements() {
  const w = 0;
  const h = 0;

  center.style.left = `${w - 25}px`;
  center.style.top = `${h - 25}px`;

  goodCube.style.left = `${w - 25}px`;
  goodCube.style.top = `${h + 180}px`;

  allCubes.forEach((cube) => {
    const r = +cube.dataset.radius;
    const a = +cube.dataset.angle;
    const x = w + Math.cos(a) * r;
    const y = h + Math.sin(a) * r;
    cube.style.left = `${x}px`;
    cube.style.top = `${y}px`;
  });
}

positionElements();

let angleOffset = 0;
function animateHeroes() {
  const w = 0;
  const h = 0;
  const r = 160;

  heroes.forEach((hero, i) => {
    const angle = angleOffset + (i * (Math.PI * 2)) / heroes.length;
    const x = w + Math.cos(angle) * r;
    const y = h + Math.sin(angle) * r;
    hero.style.left = `${x}px`;
    hero.style.top = `${y}px`;
  });

  angleOffset += 0.007;
  requestAnimationFrame(animateHeroes);
}

animateHeroes();

// масштаб всей сцены
function scaleScene() {
  const sceneEl = document.getElementById("scene");
  const container = document.getElementById("container");

  // получаем реальные размеры содержимого сцены
  const sceneRect = sceneEl.getBoundingClientRect();
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  // учитываем небольшие поля (10%)
  const padding = 0.9;

  // рассчитываем масштаб
  const scaleX = (containerWidth * padding) / sceneRect.width;
  const scaleY = (containerHeight * padding) / sceneRect.height;
  const scale = Math.min(scaleX, scaleY);

  // применяем
  sceneEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

window.addEventListener("resize", scaleScene);
scaleScene();
