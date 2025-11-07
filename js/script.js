const canvas = document.getElementById('network-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;
const mouse = { x: null, y: null, radius: 120 };

// Define o número de partículas conforme o tamanho da tela
let numberOfParticles;
if (window.innerWidth < 600) {
  numberOfParticles = 90; // telas pequenas → menos partículas
} else if (window.innerWidth < 992) {
  numberOfParticles = 100; // tablets
} else {
  numberOfParticles = 100; // desktop padrão
}

// ======== Classe Partícula ========
class Particle {
  constructor(x, y, dirX, dirY, size, color) {
    this.x = x;
    this.y = y;
    this.dirX = dirX;
    this.dirY = dirY;
    this.size = size;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    // rebater nas bordas
    if (this.x > canvas.width || this.x < 0) this.dirX = -this.dirX;
    if (this.y > canvas.height || this.y < 0) this.dirY = -this.dirY;

    // mover
    this.x += this.dirX;
    this.y += this.dirY;

    // interação com o mouse (somente em telas grandes)
    if (window.innerWidth > 768 && mouse.x && mouse.y) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius) {
        this.x += (dx / distance) * 3;
        this.y += (dy / distance) * 3;
      }
    }
    this.draw();
  }
}

// ======== Conexão entre partículas ========
function connect() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let dist =
        (particlesArray[a].x - particlesArray[b].x) ** 2 +
        (particlesArray[a].y - particlesArray[b].y) ** 2;

      if (dist < (canvas.width / 7) * (canvas.height / 7)) {
        let opacity = 1 - dist / 20000;
        ctx.strokeStyle = 'rgba(255,255,255,' + opacity + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

// ======== Inicialização ========
function init() {
  particlesArray = [];
  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 2 + 1;
    let x = Math.random() * (innerWidth - size * 2);
    let y = Math.random() * (innerHeight - size * 2);
    let dirX = Math.random() * 0.4 - 0.2;
    let dirY = Math.random() * 0.4 - 0.2;
    let color = 'rgba(255,255,255,0.8)';
    particlesArray.push(new Particle(x, y, dirX, dirY, size, color));
  }
}

// ======== Animação ========
function animate() {
  requestAnimationFrame(animate);

  // desenha o gradiente no fundo
  let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#082555');
  gradient.addColorStop(0.5, '#24449c');
  gradient.addColorStop(1, '#14208d');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // partículas
  for (let particle of particlesArray) {
    particle.update();
  }

  connect();
}

// ======== Eventos ========
window.addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

window.addEventListener('mousemove', e => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener('mouseout', () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

// ======== Inicializa tudo ========
init();
animate();
