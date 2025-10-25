const scene = document.getElementById("scene");
const center = document.getElementById("center");
const goodCube = document.getElementById("goodCube");
const heroes = document.querySelectorAll(".hero");

let allCubes = [];

function createCubes() {
  allCubes = [];
  document.querySelectorAll(".orbit").forEach(el => el.remove());

  // --- создаём орбиты ---
  const orbitCount = 3;
  const cubesPerOrbit = [16, 24, 32];
  const orbitRadiusStep = 180;

  for (let o = 0; o < orbitCount; o++) {
    const radius = (o + 1.8) * orbitRadiusStep;
    const count = cubesPerOrbit[o];

    for (let i = 0; i < count; i++) {
      const cube = document.createElement("div");
      cube.className = "cube orbit";
      cube.textContent = `#${i + 1 + allCubes.length}`;
      cube.dataset.angle = (i / count) * Math.PI * 2;
      cube.dataset.radius = radius;
      scene.appendChild(cube);
      allCubes.push(cube);
    }
  }
}

// позиционируем центр, Куб Добра и орбиты
function positionElements() {
  const cx = 0;
  const cy = 0;

  // центр — в середине сцены
  center.style.left = `${cx - 40}px`;
  center.style.top = `${cy - 40}px`;

  // Куб Добра — ниже центра
  goodCube.style.left = `${cx - 35}px`;
  goodCube.style.top = `${cy + 160}px`;

  // орбиты
  allCubes.forEach(cube => {
    const r = +cube.dataset.radius;
    const a = +cube.dataset.angle;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    cube.style.left = `${x}px`;
    cube.style.top = `${y}px`;
  });
}

// анимация вращения 3 героев
function animateHeroes() {
  const orbitRadius = 120;
  let angleOffset = 0;

  function rotate() {
    heroes.forEach((hero, i) => {
      const angle = angleOffset + (i * (Math.PI * 2)) / heroes.length;
      const x = Math.cos(angle) * orbitRadius;
      const y = Math.sin(angle) * orbitRadius;
      hero.style.left = `${x}px`;
      hero.style.top = `${y}px`;
    });

    angleOffset += 0.01;
    requestAnimationFrame(rotate);
  }

  rotate();
}

// адаптивное масштабирование
function scaleScene() {
  const sceneEl = document.getElementById("scene");
  const container = document.getElementById("container");

  const scaleX = container.clientWidth / 1600;
  const scaleY = container.clientHeight / 900;
  const scale = Math.min(scaleX, scaleY);

  sceneEl.style.left = "50%";
  sceneEl.style.top = "50%";
  sceneEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

window.addEventListener("resize", scaleScene);

createCubes();
positionElements();
scaleScene();
animateHeroes();
