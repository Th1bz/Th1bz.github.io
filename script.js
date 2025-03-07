/**
 * Configuration initiale
 * Initialisation des variables globales
 */

// Import des modules externes
import { initContactForm } from "./js/contact.js";
import { initProjectCarousel, initProjectCardFlip } from "./js/carrousel.js";
import { initPortfolio } from "./js/portfolio.js";

let lastScrollTop = 0;
const navbar = document.querySelector(".navbar");

/**
 * SECTION 1: Gestion de la Navigation
 * Comprend la gestion de la navbar et du smooth scroll
 */

// Gestion de l'apparence et de l'animation de la navbar lors du scroll
function handleNavbarScroll() {
  const currentScrollTop = window.scrollY;
  const metaThemeColor = document.querySelector("meta[name=theme-color]");

  // Gestion de l'apparence
  if (currentScrollTop > 50) {
    navbar.classList.add("scrolled");
    metaThemeColor.setAttribute("content", "#14142880");
  } else {
    navbar.classList.remove("scrolled");
    metaThemeColor.setAttribute("content", "#0A0A1F");
  }

  // Gestion de l'animation
  if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
    navbar.classList.add("hide");
  } else {
    navbar.classList.remove("hide");
  }

  lastScrollTop = currentScrollTop;
}

// Configuration du smooth scroll pour la navigation
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      // Fermeture du menu mobile
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse.classList.contains("show")) {
        document.querySelector(".navbar-toggler").click();
      }

      // Animation de scroll
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
}

/**
 * SECTION 2: Animations au Scroll
 * Gestion des animations d'apparition des éléments
 */

// Configuration de l'observateur d'intersection
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

// Initialisation des animations au scroll
function initScrollAnimations() {
  const elements = document.querySelectorAll(".fade-in");
  let animatedElements = new Set();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animatedElements.has(entry.target)) {
        entry.target.classList.add("visible");
        animatedElements.add(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach((el) => observer.observe(el));
}

// Préparation des éléments pour l'animation
function addFadeInClass() {
  const elementsToAnimate = document.querySelectorAll(
    ".skill-item, .about-text, .section-title, .skills-title"
  );
  elementsToAnimate.forEach((el) => el.classList.add("fade-in"));
}

/**
 * SECTION 3: Animation de l'Hero Section
 * Création et gestion de la grille de points lumineux
 */

function createGridPoints() {
  const heroSection = document.querySelector(".hero");
  const gridPoints = document.createElement("div");
  gridPoints.className = "grid-points";

  // Structure de la grille
  const gridBackground = document.createElement("div");
  gridBackground.className = "hero-background";
  const grid = document.createElement("div");
  grid.className = "grid";
  const gridOverlay = document.createElement("div");
  gridOverlay.className = "grid-overlay";

  // Assemblage des éléments
  gridBackground.appendChild(grid);
  gridBackground.appendChild(gridOverlay);
  heroSection.insertBefore(gridBackground, heroSection.firstChild);

  // Création des points animés
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

/**
 * SECTION 4: Carrousel de Projets
 * (Déplacé vers js/carrousel.js)
 */

/**
 * SECTION 5: Formulaire de Contact
 * (Déplacé vers js/contact.js)
 */

/**
 * SECTION 6: Initialisation
 * Point d'entrée principal de l'application
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialisation de la navigation
  window.addEventListener("scroll", handleNavbarScroll);
  initSmoothScroll();

  // Initialisation des animations
  createGridPoints();
  addFadeInClass();
  initScrollAnimations();

  // Initialisation des projets
  (async () => {
    try {
      console.log("Démarrage de l'initialisation des modules...");
      await initProjectCarousel();
      initProjectCardFlip();
      await initPortfolio(); // Initialisation de la section portfolio détaillé
      console.log("Tous les modules ont été initialisés avec succès");
    } catch (error) {
      console.error("Erreur lors de l'initialisation des modules:", error);
    }
  })();

  // Initialisation du formulaire
  initContactForm();
});
