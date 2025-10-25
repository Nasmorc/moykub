const scene = document.getElementById("scene");
const wrapper = document.getElementById("wrapper");

const orbitSettings = [
  { count: 20, radius: 220, color: "#00fff2" },
  { count: 36, radius: 380, color: "#00fff2" },
  { count: 52, radius: 580, color: "#00fff2" }
];

// === Создание орбит ===
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

// === Центральный куб ===
const centerCube = document.createElement("div");
centerCube.classList.add("cube");
centerCube.textContent = "ЦЕНТР";
centerCube.style.width = "80px";
centerCube.style.height = "80px";
centerCube.style.fontSize = "14px";
centerCube.style.borderColor = "#ff00ff";
centerCube.style.boxShadow = "0 0 25px #ff00ff, 0 0 40px #ff00ff";
centerCube.style.zIndex = "10";
scene.appendChild(centerCube);

// === Куб Добра (чуть ниже) ===
const goodCube = document.createElement("div");
goodCube.classList.add("cube");
goodCube.textContent = "КУБ ДОБРА";
goodCube.style.width = "60px";
goodCube.style.height = "60px";
goodCube.style.fontSize = "12px";
goodCube.style.borderColor = "#00ff00";
goodCube.style.boxShadow = "0 0 20px #00ff00";
goodCube.style.transform = `translate(0px, 130px)`;
goodCube.style.zIndex = "9";
scene.appendChild(goodCube);

// === Герои (вращаются вокруг центра) ===
const heroes = [
  { label: "Герой 1", angle: 0 },
  { label: "Герой 2", angle: 120 },
  { label: "Герой 3", angle: 240 }
];

const heroRadius = 150; // орбита героев
const heroSpeed = 0.01; // скорость вращения

heroes.forEach((hero) => {
  const cube = document.createElement("div");
  cube.classList.add("cube");
  cube.textContent = hero.label;
  cube.style.width = "50px";
  cube.style.height = "50px";
  cube.style.fontSize = "11px";
  cube.style.borderColor = "#ff00ff";
  cube.style.boxShadow = "0 0 15px #ff00ff";
  cube.dataset.angle = hero.angle;
  scene.appendChild(cube);
  hero.element = cube;
});

// === Анимация вращения героев ===
function animateHeroes() {
  heroes.forEach((hero) => {
    const angle = parseFloat(hero.element.dataset.angle);
    const x = Math.cos(angle) * heroRadius;
    const y = Math.sin(angle) * heroRadius;
    hero.element.style.transform = `translate(${x}px, ${y}px)`;
    hero.element.dataset.angle = angle + heroSpeed;
  });
  requestAnimationFrame(animateHeroes);
}
animateHeroes();

// === Масштабирование сцены ===
let userScale = 1;

function scaleScene() {
  const container = document.getElementById("container");
  const availableWidth = container.clientWidth;
  const availableHeight = container.clientHeight;

  const maxRadius = Math.max(...orbitSettings.map(o => o.radius)) + 200;
  const neededSize = maxRadius * 2.5;

  const scaleX = (availableWidth * 0.9) / neededSize;
  const scaleY = (availableHeight * 0.9) / neededSize;
  const baseScale = Math.min(scaleX, scaleY);

  const totalScale = baseScale * userScale;
  wrapper.style.transform = `translate(-50%, -50%) scale(${totalScale})`;
}

window.addEventListener("resize", scaleScene);
scaleScene();

window.addEventListener("wheel", (e) => {
  if (e.ctrlKey || e.altKey || e.metaKey) {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    userScale = Math.min(Math.max(userScale + delta, 0.2), 5);
    scaleScene();
  }
}, { passive: false });
