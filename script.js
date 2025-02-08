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
  const container = document.querySelector(".carousel-container");
  const cards = document.querySelectorAll(".project-card");
  const prevBtn = document.querySelector(".control-prev");
  const nextBtn = document.querySelector(".control-next");

  let currentPosition = 0;
  const totalCards = cards.length;

  function updateCarousel() {
    cards.forEach((card, index) => {
      let position = (index - currentPosition + totalCards) % totalCards;
      card.dataset.position = position;

      // Réinitialiser le flip de toutes les cartes
      const content = card.querySelector(".project-content");
      if (content) {
        content.classList.remove("flipped");
      }
    });
  }

  function moveNext() {
    currentPosition = (currentPosition + 1) % totalCards;
    updateCarousel();
  }

  function movePrev() {
    currentPosition = (currentPosition - 1 + totalCards) % totalCards;
    updateCarousel();
  }

  // Event listeners
  nextBtn.addEventListener("click", moveNext);
  prevBtn.addEventListener("click", movePrev);

  // Swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  container.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX) moveNext();
    if (touchEndX > touchStartX) movePrev();
  });
}
// --------------------------------------------------------------------------

// --------------------------------------------------------------------------
// Gestion du flip des cartes projets
function initProjectCardFlip() {
  const cards = document.querySelectorAll(".project-card");

  cards.forEach((card) => {
    const projectContent = card.querySelector(".project-content");
    if (projectContent) {
      projectContent.addEventListener("click", () => {
        // Vérifier si la carte est active (position 0)
        if (card.dataset.position === "0") {
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
  handleSectionTransitions();
  initProjectCarousel();
  initProjectCardFlip();
});
