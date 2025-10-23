const scene = document.getElementById('scene');
const center = document.getElementById('center');
const goodCube = document.getElementById('goodCube');
const heroes = document.querySelectorAll('.hero');

// Параметры орбит
const orbitCount = 5;
const cubesPerOrbit = [8, 12, 16, 20, 24];
const orbitRadiusStep = 90;
let allCubes = [];

// Создание орбит
for (let o = 0; o < orbitCount; o++) {
  const count = cubesPerOrbit[o];
  const radius = (o + 1) * orbitRadiusStep;
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
  const w = window.innerWidth / 2;
  const h = window.innerHeight / 2;

  center.style.left = `${w - 40}px`;
  center.style.top = `${h - 40}px`;

  goodCube.style.left = `${w - 35}px`;
  goodCube.style.top = `${h + 130}px`;

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

// Анимация героев месяца
let angleOffset = 0;
function animateHeroes() {
  const w = window.innerWidth / 2;
  const h = window.innerHeight / 2;
  const r = 120;

  heroes.forEach((hero, i) => {
    const angle = angleOffset + (i * (Math.PI * 2)) / heroes.length;
    const x = w + Math.cos(angle) * r;
    const y = h + Math.sin(angle) * r;
    hero.style.left = `${x}px`;
    hero.style.top = `${y}px`;
  });

  angleOffset += 0.01;
  requestAnimationFrame(animateHeroes);
}

animateHeroes();
window.addEventListener('resize', positionElements);
