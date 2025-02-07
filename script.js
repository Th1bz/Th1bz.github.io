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

//Section à propos ------------------------------------------------------------
// Gestion des animations au scroll
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Fonction pour initialiser les animations
function initScrollAnimations() {
  const elements = document.querySelectorAll(".fade-in");
  let animatedElements = new Set(); // Pour suivre les éléments déjà animés

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animatedElements.has(entry.target)) {
          entry.target.classList.add("visible");
          animatedElements.add(entry.target); // Marque l'élément comme animé
          // observer.unobserve(entry.target); // Optionnel : arrête l'observation après la première animation
        }
      });
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }
  );

  elements.forEach((el) => observer.observe(el));
}

// Fonction pour gérer la transition entre les sections
function handleSectionTransitions() {
  const sections = document.querySelectorAll("section");
  let currentSection = 0;
  let isMobile = window.innerWidth <= 991.98;

  window.addEventListener("resize", () => {
    isMobile = window.innerWidth <= 991.98;
  });

  window.addEventListener("scroll", () => {
    if (isMobile) return; // Désactive l'effet sur mobile

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const viewHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight
      );

      if (rect.top >= -viewHeight / 2 && rect.top <= viewHeight / 2) {
        section.style.opacity = "1";
        currentSection = index;
      } else {
        section.style.opacity = "0.7";
      }
    });
  });
}

// Ajouter la classe fade-in aux éléments à animer
function addFadeInClass() {
  const elementsToAnimate = document.querySelectorAll(
    ".skill-item, .about-text, .section-title, .skills-title"
  );
  elementsToAnimate.forEach((el) => {
    el.classList.add("fade-in");
  });
}

// Création des points lumineux
function createGridPoints() {
  const heroSection = document.querySelector(".hero");
  const gridPoints = document.createElement("div");
  gridPoints.className = "grid-points";

  // Création de la grille de base
  const gridBackground = document.createElement("div");
  gridBackground.className = "hero-background";
  const grid = document.createElement("div");
  grid.className = "grid";
  const gridOverlay = document.createElement("div");
  gridOverlay.className = "grid-overlay";

  gridBackground.appendChild(grid);
  gridBackground.appendChild(gridOverlay);
  heroSection.insertBefore(gridBackground, heroSection.firstChild);

  // Ajout des points lumineux
  for (let i = 0; i < 20; i++) {
    const point = document.createElement("div");
    point.className = "point";
    point.style.left = Math.random() * 100 + "%";
    point.style.top = Math.random() * 100 + "%";
    point.style.animationDelay = Math.random() * 3 + "s";
    gridPoints.appendChild(point);
  }

  gridBackground.appendChild(gridPoints);
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  createGridPoints();
  addFadeInClass();
  initScrollAnimations();
  handleSectionTransitions();
});
