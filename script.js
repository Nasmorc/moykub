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

  const scale = Math.min(window.innerWidth, window.innerHeight) / 1000;
  const orbitRadiusStep = 140 * scale;

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
  const w = window.innerWidth / 2;
  const h = window.innerHeight / 2;

  const scale = Math.min(window.innerWidth, window.innerHeight) / 1000;

  const centerSize = 110 * scale;
  const goodSize = 90 * scale;

  center.style.width = `${centerSize}px`;
  center.style.height = `${centerSize}px`;
  center.style.lineHeight = `${centerSize}px`;
  center.style.left = `${w - centerSize / 2}px`;
  center.style.top = `${h - centerSize / 2}px`;

  goodCube.style.width = `${goodSize}px`;
  goodCube.style.height = `${goodSize}px`;
  goodCube.style.lineHeight = `${goodSize}px`;
  goodCube.style.left = `${w - goodSize / 2}px`;
  goodCube.style.top = `${h + 220 * scale}px`;

  allCubes.forEach(cube => {
    const r = +cube.dataset.radius;
    const a = +cube.dataset.angle;
    const x = w + Math.cos(a) * r;
    const y = h + Math.sin(a) * r;
    cube.style.left = `${x}px`;
    cube.style.top = `${y}px`;
  });
}

function animateHeroes() {
  const w = window.innerWidth / 2;
  const h = window.innerHeight / 2;
  const scale = Math.min(window.innerWidth, window.innerHeight) / 1000;
  const r = 180 * scale;

  let angleOffset = 0;
  function rotate() {
    heroes.forEach((hero, i) => {
      const angle = angleOffset + (i * (Math.PI * 2)) / heroes.length;
      const x = w + Math.cos(angle) * r;
      const y = h + Math.sin(angle) * r;
      hero.style.left = `${x}px`;
      hero.style.top = `${y}px`;
    });

    angleOffset += 0.006;
    requestAnimationFrame(rotate);
  }
  rotate();
}

window.addEventListener('resize', () => {
  createCubes();
  positionElements();
});

createCubes();
positionElements();
animateHeroes();
