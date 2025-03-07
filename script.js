/**
 * Configuration initiale
 * Initialisation des variables globales et configuration d'EmailJS
 */
(function () {
  emailjs.init("WtSDctCMaTZG5prkz");
})();

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
 * Gestion du carrousel et des cartes de projets
 */

function initProjectCarousel() {
  const cards = document.querySelectorAll(".project-card");
  const prevBtn = document.querySelector(".control-prev");
  const nextBtn = document.querySelector(".control-next");
  const totalCards = cards.length;
  let currentIndex = 0;
  let isAnimating = false;

  // Création et gestion des indicateurs
  function createIndicators() {
    const indicatorsContainer = document.createElement("div");
    indicatorsContainer.className = "carousel-indicators";

    for (let i = 0; i < totalCards; i++) {
      const indicator = document.createElement("div");
      indicator.className = "carousel-indicator";
      if (i === currentIndex) indicator.classList.add("active");

      indicator.addEventListener("click", () => {
        if (!isAnimating && i !== currentIndex) {
          goToSlide(i);
        }
      });

      indicatorsContainer.appendChild(indicator);
    }

    const carouselControls = document.querySelector(".carousel-controls");
    carouselControls.appendChild(indicatorsContainer);
  }

  function updateIndicators() {
    document
      .querySelectorAll(".carousel-indicator")
      .forEach((indicator, index) => {
        indicator.classList.toggle("active", index === currentIndex);
      });
  }

  function goToSlide(index) {
    if (isAnimating) return;
    isAnimating = true;

    const prevIndex = (index - 1 + totalCards) % totalCards;
    const nextIndex = (index + 1) % totalCards;

    cards.forEach((card) => card.classList.remove("active", "prev", "next"));

    cards[index].classList.add("active");
    cards[prevIndex].classList.add("prev");
    cards[nextIndex].classList.add("next");

    currentIndex = index;
    updateIndicators();

    // Réinitialisation des cartes flippées
    cards.forEach((card) => {
      const content = card.querySelector(".project-content");
      if (content?.classList.contains("flipped")) {
        content.classList.remove("flipped");
      }
    });

    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }

  // Configuration des contrôles
  nextBtn.addEventListener("click", () =>
    goToSlide((currentIndex + 1) % totalCards)
  );
  prevBtn.addEventListener("click", () =>
    goToSlide((currentIndex - 1 + totalCards) % totalCards)
  );

  // Gestion du swipe sur mobile
  let touchStartX = 0;
  const container = document.querySelector(".carousel-container");

  container.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  container.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      diff > 0
        ? goToSlide((currentIndex + 1) % totalCards)
        : goToSlide((currentIndex - 1 + totalCards) % totalCards);
    }
  });

  // Navigation au clavier
  document.addEventListener("keydown", (e) => {
    const section = container.closest("section");
    const isVisible =
      section.getBoundingClientRect().top < window.innerHeight &&
      section.getBoundingClientRect().bottom > 0;

    if (isVisible) {
      if (e.key === "ArrowRight") goToSlide((currentIndex + 1) % totalCards);
      if (e.key === "ArrowLeft")
        goToSlide((currentIndex - 1 + totalCards) % totalCards);
    }
  });

  createIndicators();
  goToSlide(currentIndex);
}

/**
 * SECTION 5: Gestion des Cartes de Projets
 * Animation de retournement des cartes
 */

function initProjectCardFlip() {
  document.querySelectorAll(".project-card").forEach((card) => {
    const projectContent = card.querySelector(".project-content");
    if (projectContent) {
      projectContent.addEventListener("click", () => {
        if (card.classList.contains("active")) {
          projectContent.classList.toggle("flipped");
        }
      });
    }
  });
}

/**
 * SECTION 6: Formulaire de Contact
 * Validation et envoi du formulaire
 */

function isValidEmail(email) {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

function initContactForm() {
  const emailInput = document.getElementById("email");
  const contactForm = document.getElementById("contactForm");

  // Validation de l'email en temps réel
  emailInput.addEventListener("input", function () {
    const emailGroup = this.closest(".form-group");

    if (this.value.length > 0) {
      if (isValidEmail(this.value)) {
        emailGroup.classList.remove("invalid");
        emailGroup.classList.add("valid");
        this.setCustomValidity("");
      } else {
        emailGroup.classList.remove("valid");
        emailGroup.classList.add("invalid");
        this.setCustomValidity("Veuillez entrer une adresse email valide");
      }
    } else {
      emailGroup.classList.remove("valid", "invalid");
      this.setCustomValidity("");
    }
  });

  // Gestion de l'envoi du formulaire
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!isValidEmail(emailInput.value)) {
      emailInput.closest(".form-group").classList.add("invalid");
      emailInput.setCustomValidity("Veuillez entrer une adresse email valide");
      emailInput.reportValidity();
      return;
    }

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;

    const templateParams = {
      from_name: document.getElementById("name").value,
      from_email: emailInput.value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
    };

    emailjs
      .send("service_devv5tf", "template_c1yqywd", templateParams)
      .then(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
        submitBtn.classList.replace("btn-primary", "btn-success");
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.classList.replace("btn-success", "btn-primary");
          submitBtn.disabled = false;
        }, 3000);
      })
      .catch((error) => {
        console.error("Erreur:", error);
        submitBtn.innerHTML =
          '<i class="fas fa-exclamation-triangle"></i> Erreur lors de l\'envoi';
        submitBtn.classList.replace("btn-primary", "btn-danger");

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.classList.replace("btn-danger", "btn-primary");
          submitBtn.disabled = false;
        }, 3000);
      });
  });
}

/**
 * SECTION 7: Initialisation
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
  initProjectCarousel();
  initProjectCardFlip();

  // Initialisation du formulaire
  initContactForm();
});
