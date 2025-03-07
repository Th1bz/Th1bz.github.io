// Ajouter une classe active à la navbar lors du scroll
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  const metaThemeColor = document.querySelector("meta[name=theme-color]");

  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
    metaThemeColor.setAttribute("content", "#14142880"); // Version plus opaque
  } else {
    navbar.classList.remove("scrolled");
    metaThemeColor.setAttribute("content", "#0A0A1F"); // Version normale
  }
});

// Animation smooth scroll pour les liens de navigation et fermeture du menu mobile
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    // Fermer le menu mobile si ouvert
    const navbarCollapse = document.querySelector(".navbar-collapse");
    if (navbarCollapse.classList.contains("show")) {
      document.querySelector(".navbar-toggler").click();
    }

    // Scroll vers la section
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

// Ajouter la classe fade-in aux éléments à animer
function addFadeInClass() {
  const elementsToAnimate = document.querySelectorAll(
    ".skill-item, .about-text, .section-title, .skills-title"
  );
  elementsToAnimate.forEach((el) => {
    el.classList.add("fade-in");
  });
}
// --------------------------------------------------------------------------

// --------------------------------------------------------------------------
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
// --------------------------------------------------------------------------

// --------------------------------------------------------------------------
// Gestion du carrousel de projets
function initProjectCarousel() {
  const cards = document.querySelectorAll(".project-card");
  const prevBtn = document.querySelector(".control-prev");
  const nextBtn = document.querySelector(".control-next");

  // Nombre total de cartes
  const totalCards = cards.length;

  // Variable pour suivre l'index actuel
  let currentIndex = 0;

  // Variable pour empêcher les clics rapides
  let isAnimating = false;

  // Fonction pour créer les indicateurs
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

    // Ajouter les indicateurs dans le conteneur des contrôles
    const carouselControls = document.querySelector(".carousel-controls");
    carouselControls.appendChild(indicatorsContainer);
  }

  // Fonction pour mettre à jour les indicateurs
  function updateIndicators() {
    const indicators = document.querySelectorAll(".carousel-indicator");
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentIndex);
    });
  }

  // Fonction pour aller à une diapositive spécifique
  function goToSlide(index) {
    if (isAnimating) return;
    isAnimating = true;

    // Calculer les nouveaux indices
    const prevIndex = (index - 1 + totalCards) % totalCards;
    const nextIndex = (index + 1) % totalCards;

    // Supprimer toutes les classes
    cards.forEach((card) => {
      card.classList.remove("active", "prev", "next");
    });

    // Appliquer les nouvelles classes
    cards[index].classList.add("active");
    cards[prevIndex].classList.add("prev");
    cards[nextIndex].classList.add("next");

    // Mettre à jour l'index actuel
    currentIndex = index;

    // Mettre à jour les indicateurs
    updateIndicators();

    // Réinitialiser le flip si nécessaire
    cards.forEach((card) => {
      const content = card.querySelector(".project-content");
      if (content && content.classList.contains("flipped")) {
        content.classList.remove("flipped");
      }
    });

    // Réactiver les animations après leur fin
    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }

  // Fonction pour aller à la diapositive suivante
  function goToNext() {
    goToSlide((currentIndex + 1) % totalCards);
  }

  // Fonction pour aller à la diapositive précédente
  function goToPrev() {
    goToSlide((currentIndex - 1 + totalCards) % totalCards);
  }

  // Ajouter les écouteurs d'événements
  nextBtn.addEventListener("click", goToNext);
  prevBtn.addEventListener("click", goToPrev);

  // Support du swipe sur mobile
  let touchStartX = 0;
  const container = document.querySelector(".carousel-container");

  container.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  container.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  });

  // Navigation au clavier
  document.addEventListener("keydown", (e) => {
    if (
      container.closest("section").getBoundingClientRect().top <
        window.innerHeight &&
      container.closest("section").getBoundingClientRect().bottom > 0
    ) {
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    }
  });

  // Créer les indicateurs de position
  createIndicators();

  // Initialisation - s'assurer que les classes sont correctement définies
  goToSlide(currentIndex);
}

// Gestion du flip des cartes projets
function initProjectCardFlip() {
  const cards = document.querySelectorAll(".project-card");

  cards.forEach((card) => {
    const projectContent = card.querySelector(".project-content");
    if (projectContent) {
      projectContent.addEventListener("click", () => {
        // Vérifier si la carte est active
        if (card.classList.contains("active")) {
          projectContent.classList.toggle("flipped");
        }
      });
    }
  });
}
// --------------------------------------------------------------------------

// --------------------------------------------------------------------------
// Initialisation de EmailJS avec votre clé publique
(function () {
  emailjs.init("WtSDctCMaTZG5prkz");
})();

// Validation de l'email
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Gestion de la validation de l'email en temps réel
document.getElementById("email").addEventListener("input", function () {
  const emailInput = this;
  const emailGroup = emailInput.closest(".form-group");

  if (emailInput.value.length > 0) {
    if (isValidEmail(emailInput.value)) {
      emailGroup.classList.remove("invalid");
      emailGroup.classList.add("valid");
      emailInput.setCustomValidity("");
    } else {
      emailGroup.classList.remove("valid");
      emailGroup.classList.add("invalid");
      emailInput.setCustomValidity("Veuillez entrer une adresse email valide");
    }
  } else {
    emailGroup.classList.remove("valid", "invalid");
    emailInput.setCustomValidity("");
  }
});

// Gestion du formulaire de contact
document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Vérification de l'email avant l'envoi
    const emailInput = document.getElementById("email");
    if (!isValidEmail(emailInput.value)) {
      emailInput.closest(".form-group").classList.add("invalid");
      emailInput.setCustomValidity("Veuillez entrer une adresse email valide");
      emailInput.reportValidity();
      return;
    }

    // Afficher l'indicateur de chargement
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;

    // Préparation des paramètres
    const templateParams = {
      from_name: document.getElementById("name").value,
      from_email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
    };

    // Envoi de l'email
    emailjs.send("service_devv5tf", "template_c1yqywd", templateParams).then(
      function () {
        // Succès
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
        submitBtn.classList.remove("btn-primary");
        submitBtn.classList.add("btn-success");

        // Réinitialiser le formulaire
        document.getElementById("contactForm").reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.classList.remove("btn-success");
          submitBtn.classList.add("btn-primary");
          submitBtn.disabled = false;
        }, 3000);
      },
      function (error) {
        // Erreur
        console.error("Erreur:", error);
        submitBtn.innerHTML =
          '<i class="fas fa-exclamation-triangle"></i> Erreur lors de l\'envoi';
        submitBtn.classList.remove("btn-primary");
        submitBtn.classList.add("btn-danger");

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.classList.remove("btn-danger");
          submitBtn.classList.add("btn-primary");
          submitBtn.disabled = false;
        }, 3000);
      }
    );
  });
// --------------------------------------------------------------------------

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  createGridPoints();
  addFadeInClass();
  initScrollAnimations();
  initProjectCarousel();
  initProjectCardFlip();
});
