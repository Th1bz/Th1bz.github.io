// Import des modules externes
import { initContactForm } from "./contact.js";
import { initProjectCarousel, initProjectCardFlip } from "./carrousel.js";
import { initPortfolio } from "./portfolio.js";

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

// Fermeture de la navbar au clic à côté
function initNavbarClickOutside() {
  const navbar = document.querySelector(".navbar");
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  // Écouteur d'événement sur le document
  document.addEventListener("click", function (event) {
    // Vérifier si la navbar est ouverte
    if (navbarCollapse.classList.contains("show")) {
      // Vérifier si le clic n'est pas dans la navbar ou sur le bouton toggle
      const isClickInsideNavbar = navbar.contains(event.target);
      const isClickOnToggler = navbarToggler.contains(event.target);

      // Si le clic est à l'extérieur de la navbar et pas sur le bouton toggle
      if (!isClickInsideNavbar && !isClickOnToggler) {
        // Fermer la navbar
        navbarToggler.click();
      }
    }
  });

  // Empêcher la propagation des clics à l'intérieur de la navbar
  navbar.addEventListener("click", function (event) {
    event.stopPropagation();
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
 * Création de la grille  cyberpunk
 */

function createGrid() {
  const heroSection = document.querySelector(".hero");

  // Structure de la grille
  const gridBackground = document.createElement("div");
  gridBackground.className = "hero-background";
  const grid = document.createElement("div");
  grid.className = "grid";

  // Assemblage des éléments
  gridBackground.appendChild(grid);
  heroSection.insertBefore(gridBackground, heroSection.firstChild);
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
  initNavbarClickOutside();

  // Initialisation des animations
  createGrid();
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
