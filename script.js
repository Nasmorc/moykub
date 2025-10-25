// Получаем сцену
const scene = document.getElementById("scene");

// Настройки орбит (каждую можно регулировать отдельно)
const orbitSettings = [
  { count: 20, radius: 220, color: "#00fff2" }, // внутренняя
  { count: 36, radius: 380, color: "#00fff2" }, // средняя
  { count: 52, radius: 580, color: "#00fff2" }  // внешняя
];

// Создаём орбиты
orbitSettings.forEach((orbit, i) => {
  for (let j = 0; j < orbit.count; j++) {
    const cube = document.createElement("div");
    cube.classList.add("cube");
    cube.textContent = `#${j + 1 + (i * 50)}`;

    // Позиционирование кубов
    const angle = (j / orbit.count) * Math.PI * 2;
    const x = Math.cos(angle) * orbit.radius;
    const y = Math.sin(angle) * orbit.radius;

    cube.style.transform = `translate(${x}px, ${y}px)`;
    cube.style.borderColor = orbit.color;

    scene.appendChild(cube);
  }
});

// --- Центральные элементы ---
function createCenterCube(label, color, offsetY = 0) {
  const cube = document.createElement("div");
  cube.classList.add("cube");
  cube.textContent = label;
  cube.style.borderColor = color;
  cube.style.transform = `translate(0px, ${offsetY}px)`;
  cube.style.boxShadow = `0 0 20px ${color}`;
  scene.appendChild(cube);
}

// Центр и герои
createCenterCube("ЦЕНТР", "#ff00ff");
createCenterCube("Герой 1", "#ff00ff", 100);
createCenterCube("Герой 2", "#ff00ff", -100);
createCenterCube("Герой 3", "#ff00ff", 0);
createCenterCube("КУБ ДОБРА", "#00ff00", 180);

// --- Масштабирование ---
function scaleScene() {
  const sceneEl = document.getElementById("scene");
  const container = document.getElementById("container");

  const availableWidth = container.clientWidth;
  const availableHeight = container.clientHeight;

  const maxRadius = Math.max(...orbitSettings.map(o => o.radius));
  const neededSize = maxRadius * 2.5;

  const scaleX = (availableWidth * 0.9) / neededSize;
  const scaleY = (availableHeight * 0.9) / neededSize;
  const scale = Math.min(scaleX, scaleY);

  sceneEl.style.left = "50%";
  sceneEl.style.top = "50%";
  sceneEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

window.addEventListener("resize", scaleScene);
scaleScene();
