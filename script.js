const SCENE = document.getElementById('scene');

// ==== Орбиты и кубы ====
const rings = [
  { cls:'r1', R: '12vmin', n:18 },
  { cls:'r2', R: '16vmin', n:22 },
  { cls:'r3', R: '20vmin', n:27 },
  { cls:'r4', R: '24vmin', n:32 },
  { cls:'r5', R: '28vmin', n:38 },
  { cls:'r6', R: '32vmin', n:43 },
];

function placeRing({cls,R,n}, startIndex=1){
  const ring = document.createElement('div');
  ring.className = cls;
  SCENE.appendChild(ring);
  for(let i=0;i<n;i++){
    const a = (i/n)*2*Math.PI - Math.PI/2;
    const cube = document.createElement('div');
    cube.className = 'cube';
    cube.textContent = `#${startIndex+i}`;
    cube.style.left = `calc(50% + ${R} * ${Math.cos(a)})`;
    cube.style.top = `calc(50% + ${R} * ${Math.sin(a)})`;
    ring.appendChild(cube);
  }
  return startIndex + n;
}

let idx = 1;
for(const r of rings) idx = placeRing(r, idx);

// ==== Центр ====
const center = document.createElement('div');
center.className = 'cube center';
center.innerHTML = 'ЦЕНТР<br><small>аукцион аренды</small>';
center.style.left = '50%';
center.style.top = '50%';
SCENE.appendChild(center);

// ==== Герои ====
const heroes = document.createElement('div');
heroes.className = 'heroes';
SCENE.appendChild(heroes);

const RH = '9.5vmin';
['ГЕРОЙ','ГЕРОЙ','ГЕРОЙ'].forEach((t,i)=>{
  const a = i*(2*Math.PI/3) - Math.PI/2;
  const h = document.createElement('div');
  h.className = 'cube hero';
  h.innerHTML = `КУБ<br>${t}<br><small>1 месяц</small>`;
  h.style.left = `calc(50% + ${RH} * ${Math.cos(a)})`;
  h.style.top  = `calc(50% + ${RH} * ${Math.sin(a)})`;
  heroes.appendChild(h);
});

// ==== Куб Добра ====
const goodCube = document.getElementById('good-cube');

// ==== Модальное окно ====
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close');
const form = document.getElementById('request-form');
const successMsg = document.getElementById('success');

// открыть
goodCube.addEventListener('click', () => {
  modal.style.display = 'block';
});

// закрыть
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  successMsg.classList.add('hidden');
  form.style.display = 'block';
  form.reset();
});

// отправка формы
form.addEventListener('submit', (e) => {
  e.preventDefault();
  form.style.display = 'none';
  successMsg.classList.remove('hidden');
});

// закрытие по клику вне окна
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    successMsg.classList.add('hidden');
    form.style.display = 'block';
    form.reset();
  }
});
