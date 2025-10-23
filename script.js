const scene = document.getElementById('scene');

// Настройки орбит
const orbitCount = 5; // количество орбит
const cubesPerOrbit = [8, 12, 16, 20, 24]; // кубов на каждой орбите
const orbitRadiusStep = 80; // расстояние между орбитами

// Создаём центр
const center = document.createElement('div');
center.className = 'cube center';
center.textContent = 'ЦЕНТР';
scene.appendChild(center);

// Добавляем Куб Добра под центром
const goodCube = document.createElement('div');
goodCube.className = 'cube good';
goodCube.textContent = 'КУБ ДОБРА';
scene.appendChild(goodCube);

// Создаём орбиты
let allCubes = [];
for (let o = 0; o < orbitCount; o++) {
  const orbit = [];
  const radius = (o + 1) * orbitRadiusStep;
  const count = cubesPerOrbit[o];
  for (let i = 0; i < count; i++) {
    const cube = document.createElement('div');
    cube.className = 'cube orbit';
    cube.textContent = `#${i + 1 + allCubes.length}`;
    const angle = (i / count) * Math.PI * 2;
    cube.dataset.angle = angle;
    cube.dataset.radius = radius;
    scene.appendChild(cube);
    orbit.push(cube);
  }
  allCubes.push(orbit);
}

// Центрируем сцену
function positionElements() {
  const w = window.innerWidth / 2;
  const h = window.innerHeight / 2;

  center.style.left = `${w - 25}px`;
  center.style.top = `${h - 25}px`;

  goodCube.style.left = `${w - 40}px`;
  goodCube.style.top = `${h + 120}px`;

  allCubes.forEach((orbit, index) => {
    orbit.forEach((cube) => {
      const radius = +cube.dataset.radius;
      const angle = +cube.dataset.angle;
      const x = w + Math.cos(angle) * radius;
      const y = h + Math.sin(angle) * radius;
      cube.style.left = `${x}px`;
      cube.style.top = `${y}px`;
    });
  });
}

// Анимация вращения
let rotation = 0;
function animate() {
  rotation += 0.002; // скорость вращения
  const w = window.innerWidth / 2;
  const h = window.innerHeight / 2;

  allCubes.forEach((orbit, index) => {
    orbit.forEach((cube, i) => {
      const radius = +cube.dataset.radius;
      const angle = +cube.dataset.angle + rotation * (index % 2 === 0 ? 1 : -1);
      const x = w + Math.cos(angle) * radius;
      const y = h + Math.sin(angle) * radius;
      cube.style.left = `${x}px`;
      cube.style.top = `${y}px`;
    });
  });

  requestAnimationFrame(animate);
}

positionElements();
animate();
window.addEventListener('resize', positionElements);
