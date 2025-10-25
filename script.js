const scene = document.getElementById("scene");
const wrapper = document.getElementById("wrapper");

const orbitSettings = [
  { count: 20, radius: 220, color: "#00fff2" },
  { count: 36, radius: 380, color: "#00fff2" },
  { count: 52, radius: 580, color: "#00fff2" }
];

// Создаём орбиты
orbitSettings.forEach((orbit, i) => {
  for (let j = 0; j < orbit.count; j++) {
    const cube = document.createElement("div");
    cube.classList.add("cube");
    cube.textContent = `#${j + 1 + (i * 50)}`;

    const angle = (j / orbit.count) * Math.PI * 2;
    const x = Math.cos(angle) * orbit.radius;
    const y = Math.sin(angle) * orbit.radius;

    cube.style.transform = `translate(${x}px, ${y}px)`;
    cube.style.borderColor = orbit.color;

    scene.appendChild(cube);
  }
});

// Центральные кубы
function createCenterCube(label, color, offsetY = 0) {
  const cube = document.createElement("div");
  cube.classList.add("cube");
  cube.textContent = label;
  cube.style.borderColor = color;
  cube.style.transform = `translate(0px, ${offsetY}px)`;
  cube.style.boxShadow = `0 0 20px ${color}`;
  scene.appendChild(cube);
}

createCenterCube("ЦЕНТР", "#ff00ff");
createCenterCube("Герой 1", "#ff00ff", 100);
createCenterCube("Герой 2", "#ff00ff", -100);
createCenterCube("Герой 3", "#ff00ff", 0);
createCenterCube("КУБ ДОБРА", "#00ff00", 180);

// Масштабирование
let userScale = 1;

function scaleScene() {
  const container = document.getElementById("container");
  const availableWidth = container.clientWidth;
  const availableHeight = container.clientHeight;

  const maxRadius = Math.max(...orbitSettings.map(o => o.radius));
  const neededSize = maxRadius * 2.5;

  const scaleX = (availableWidth * 0.9) / neededSize;
  const scaleY = (availableHeight * 0.9) / neededSize;
  const baseScale = Math.min(scaleX, scaleY);

  const totalScale = baseScale * userScale;

  // Масштабируем теперь wrapper, а не саму сцену
  wrapper.style.transform = `translate(-50%, -50%) scale(${totalScale})`;
}

window.addEventListener("resize", scaleScene);
scaleScene();

// Колёсико для зума
window.addEventListener("wheel", (e) => {
  if (e.ctrlKey || e.altKey || e.metaKey) {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    userScale = Math.min(Math.max(userScale + delta, 0.2), 5);
    scaleScene();
  }
}, { passive: false });
