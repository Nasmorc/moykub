const scene = document.getElementById('scene');
const center = document.getElementById('center');
const goodCube = document.getElementById('goodCube');
const heroes = document.querySelectorAll('.hero');

let allCubes = [];

function buildScene() {
  scene.innerHTML = '';
  scene.appendChild(center);
  scene.appendChild(goodCube);
  heroes.forEach(h => scene.appendChild(h));
  allCubes = [];

  const width = window.innerWidth;
  const height = window.innerHeight;
  const base = Math.min(width, height);

  const orbitCount = 4;
  const cubesPerOrbit = [16, 20, 26, 32];
  const orbitRadiusStep = base / 10; // адаптивно
  const cubeSize = base / 30;

  // размеры кубов и центра
  document.querySelectorAll('.cube').forEach(cube => {
    cube.style.width = `${cubeSize}px`;
    cube.style.height = `${cubeSize}px`;
    cube.style.fontSize = `${cubeSize / 4}px`;
  });
  center.style.width = `${cubeSize * 2}px`;
  center.style.height = `${cubeSize * 2}px`;

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

  positionElements();
}

function positionElements() {
  const w = window.innerWidth / 2;
  const h = window.innerHeight / 2;

  center.style.left = `${w - center.offsetWidth / 2}px`;
  center.style.top = `${h - center.offsetHeight / 2}px`;

  const goodOffset = Math.min(window.innerWidth, window.innerHeight) / 6;
  goodCube.style.left = `${w - goodCube.offsetWidth / 2}px`;
  goodCube.style.top = `${h + goodOffset}px`;

  allCubes.forEach((cube) => {
    const r = +cube.dataset.radius;
    const a = +cube.dataset.angle;
    const x = w + Math.cos(a) * r;
    const y = h + Math.sin(a) * r;
    cube.style.left = `${x}px`;
    cube.style.top = `${y}px`;
  });
}

let angleOffset = 0;
function animateHeroes() {
  const w = window.innerWidth / 2;
  const h = window.innerHeight / 2;
  const r = Math.min(window.innerWidth, window.innerHeight) / 8; // адаптивная орбита героев

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
window.addEventListener('resize', buildScene);
buildScene();
