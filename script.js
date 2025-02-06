// Ajouter une classe active à la navbar lors du scroll
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Animation smooth scroll pour les liens de navigation
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// // Création des particules
// function createParticles() {
//   const particlesContainer = document.createElement("div");
//   particlesContainer.id = "particles";
//   document.body.appendChild(particlesContainer);

//   for (let i = 0; i < 50; i++) {
//     const particle = document.createElement("div");
//     particle.className = "particle";
//     particle.style.left = Math.random() * 100 + "vw";
//     particle.style.top = Math.random() * 100 + "vh";
//     particle.style.animationDuration = Math.random() * 20 + 10 + "s";
//     particle.style.animationDelay = Math.random() * 5 + "s";
//     particlesContainer.appendChild(particle);
//   }
// }

// Configuration des particules
const PARTICLE_CONFIG = {
  count: 75, // Plus de particules
  sizeMin: 1,
  sizeMax: 3,
  speedMin: 15,
  speedMax: 25,
  opacityMin: 0.3,
  opacityMax: 0.8,
  distanceMin: 50,
  distanceMax: 150,
};

function createParticles() {
  const particlesContainer = document.createElement("div");
  particlesContainer.id = "particles";
  document.body.appendChild(particlesContainer);

  for (let i = 0; i < PARTICLE_CONFIG.count; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Position aléatoire
    particle.style.left = Math.random() * 100 + "vw";
    particle.style.top = Math.random() * 100 + "vh";

    // Taille aléatoire
    const size =
      Math.random() * (PARTICLE_CONFIG.sizeMax - PARTICLE_CONFIG.sizeMin) +
      PARTICLE_CONFIG.sizeMin;
    particle.style.width = size + "px";
    particle.style.height = size + "px";

    // Opacité aléatoire
    const opacity =
      Math.random() *
        (PARTICLE_CONFIG.opacityMax - PARTICLE_CONFIG.opacityMin) +
      PARTICLE_CONFIG.opacityMin;
    particle.style.opacity = opacity;

    // Distance de déplacement aléatoire
    const distance =
      Math.random() *
        (PARTICLE_CONFIG.distanceMax - PARTICLE_CONFIG.distanceMin) +
      PARTICLE_CONFIG.distanceMin;
    particle.style.setProperty("--move-distance", `${distance}px`);

    // Vitesse aléatoire
    const speed =
      Math.random() * (PARTICLE_CONFIG.speedMax - PARTICLE_CONFIG.speedMin) +
      PARTICLE_CONFIG.speedMin;
    particle.style.animationDuration = speed + "s";

    // Délai aléatoire
    particle.style.animationDelay = Math.random() * -speed + "s";

    particlesContainer.appendChild(particle);
  }
}

// Animation plus complexe
const particleStyles = document.createElement("style");
particleStyles.textContent = `
  @keyframes moveParticle {
      0% {
          transform: translate(0, 0) rotate(0deg);
          opacity: 0;
      }
      10% {
          opacity: var(--opacity);
      }
      90% {
          opacity: var(--opacity);
      }
      100% {
          transform: translate(
              calc(var(--move-distance) * cos(45deg)),
              calc(var(--move-distance) * -sin(45deg))
          ) rotate(360deg);
          opacity: 0;
      }
  }
`;
document.head.appendChild(particleStyles);

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  createParticles();
});
