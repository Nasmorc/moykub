const TOTAL_CUBES = 180;
const center = { x: 50, y: 50 };
const a = 5, b = 0.3, thetaStep = 0.2, theta0 = Math.PI / 2;
const layer = document.getElementById('ringsLayer') || (() => {
  const el = document.createElement('div');
  el.id='ringsLayer'; el.className='stage';
  document.body.appendChild(el);
  return el;
})();
const frag = document.createDocumentFragment();

for (let i = 0; i < TOTAL_CUBES; i++) {
  const theta = theta0 + i * thetaStep;
  const r = a + b * theta;
  const x = center.x + r * Math.cos(theta);
  const y = center.y + r * Math.sin(theta);

  const cube = document.createElement('div');
  cube.className = 'cube fade';
  cube.style.left = `${x}%`;
  cube.style.top = `${y}%`;
  cube.style.position = 'absolute';
  cube.textContent = `#${i+1}`;
  cube.addEventListener('click', () => {
    cube.classList.add('flash');
    setTimeout(()=>cube.classList.remove('flash'),1000);
  });
  frag.appendChild(cube);
}
layer.appendChild(frag);

// вращение
let angle = 0, isMoving=false;
function rotate(){
  layer.style.transform=`rotate(${angle}deg)`;
  if(isMoving){ angle+=0.2; requestAnimationFrame(rotate); }
}
document.addEventListener('mousemove',()=>{ if(!isMoving){isMoving=true; layer.classList.remove('stop'); rotate();}});
document.addEventListener('touchstart',()=>{ if(!isMoving){isMoving=true; layer.classList.remove('stop'); rotate();}});
document.addEventListener('mouseleave',()=>{isMoving=false;layer.classList.add('stop');});
document.addEventListener('touchend',()=>{isMoving=false;layer.classList.add('stop');});
