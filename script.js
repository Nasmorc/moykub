const scene = document.getElementById('scene');
const center = document.getElementById('center');
const goodCube = document.getElementById('goodCube');
const heroes = document.querySelectorAll('.hero');

const orbitCount = 4; // было 5
const cubesPerOrbit = [14, 18, 22, 28];
const orbitRadiusStep = 130;
let allCubes = [];

for (let o = 0; o < orbitCount; o++) {
  const radius = (o + 1) * orbitRadiusStep;

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
  const w = window.innerWidth / 2;
  const h = window.innerHeight / 2;

  center.style.left = `${w - 45}px`;
  center.style.top = `${h - 45}px`;

  goodCube.style.left = `${w - 35}px`;
  goodCube.style.top = `${h + 170}px`;

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

// анимация героев
let angleOffset = 0;
function animateHeroes() {
  const w = window.innerWidth / 2;
  const h = window.innerHeight / 2;
  const r = 140; // орбита героев (центр чистый)

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
window.addEventListener('resize', positionElements);
