const scene = document.getElementById('scene');
const center = document.getElementById('center');
const goodCube = document.getElementById('goodCube');
const heroes = document.querySelectorAll('.hero');

const orbitCount = 4;
const cubesPerOrbit = [16, 20, 26, 32];
let allCubes = [];

function createCubes() {
  allCubes = [];
  document.querySelectorAll('.orbit').forEach(el => el.remove());

  const orbitRadiusStep = 150;
  for (let o = 0; o < orbitCount; o++) {
    const radius = (o + 2) * orbitRadiusStep;
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
}

function positionElements() {
  // Ставим центр в 0:0 внутри сцены
  const w = 0;
  const h = 0;

  center.style.left = `${w - 45}px`;
  center.style.top = `${h - 45}px`;

  goodCube.style.left = `${w - 35}px`;
  goodCube.style.top = `${h + 220}px`;

  allCubes.forEach(cube => {
    const r = +cube.dataset.radius;
    const a = +cube.dataset.angle;
    const x = w + Math.cos(a) * r;
    const y = h + Math.sin(a) * r;
    cube.style.left = `${x}px`;
    cube.style.top = `${y}px`;
  });
}

function scaleScene() {
  const sceneEl = document.getElementById('scene');
  const container = document.getElementById('container');

  // Считаем масштаб и применяем, сохраняя центр
  const baseWidth = 1600;
  const baseHeight = 900;
  const scaleX = container.clientWidth / baseWidth;
  const scaleY = container.clientHeight / baseHeight;
  const scale = Math.min(scaleX, scaleY);

  // Центрируем сцену по окну
  const offsetX = container.clientWidth / 2;
  const offsetY = container.clientHeight / 2;
  sceneEl.style.left = `${offsetX}px`;
  sceneEl.style.top = `${offsetY}px`;
  sceneEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

function animateHeroes() {
  const r = 180;
  let angleOffset = 0;

  function rotate() {
    heroes.forEach((hero, i) => {
      const angle = angleOffset + (i * (Math.PI * 2)) / heroes.length;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      hero.style.left = `${x}px`;
      hero.style.top = `${y}px`;
    });

    angleOffset += 0.006;
    requestAnimationFrame(rotate);
  }

  rotate();
}

window.addEventListener('resize', () => {
  scaleScene();
});

createCubes();
positionElements();
scaleScene();
animateHeroes();
