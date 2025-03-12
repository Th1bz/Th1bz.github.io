/**
 * Carrousel de Projets
 * Module de gestion du carrousel et des cartes de projets
 */

import { generateProjectCarousel, loadProjects } from "./projectsManager.js";

/**
 * Initialise le carrousel de projets avec navigation et gestion des événements
 */
async function initProjectCarousel() {
  // Générer le HTML du carrousel depuis les données JSON
  await generateProjectCarousel("carousel-container");

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

    // Si nous avons plus de 6 projets, nous utilisons une approche différente
    if (totalCards > 6) {
      // Créer seulement les indicateurs pour le projet actuel, précédent et suivant
      // et ajouter des marqueurs pour indiquer qu'il y a d'autres projets
      for (let i = 0; i < totalCards; i++) {
        // N'afficher que les indicateurs pour le projet actuel, les 2 précédents et les 2 suivants
        if (
          i === currentIndex ||
          i === (currentIndex - 1 + totalCards) % totalCards ||
          i === (currentIndex - 2 + totalCards) % totalCards ||
          i === (currentIndex + 1) % totalCards ||
          i === (currentIndex + 2) % totalCards
        ) {
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
      }
    } else {
      // Approche standard pour moins de 10 projets
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
    }

    const carouselControls = document.querySelector(".carousel-controls");

    // Vérifier si le conteneur d'indicateurs existe déjà
    const indicatorsWrapper = document.querySelector(".indicators-wrapper");
    if (indicatorsWrapper) {
      // Si le wrapper existe, on remplace juste son contenu
      indicatorsWrapper.innerHTML = "";
      indicatorsWrapper.appendChild(indicatorsContainer);
    } else {
      // Sinon, on crée une nouvelle div pour contenir les indicateurs
      const newIndicatorsWrapper = document.createElement("div");
      newIndicatorsWrapper.className = "indicators-wrapper";
      newIndicatorsWrapper.appendChild(indicatorsContainer);

      // Ajouter cette div après les boutons de navigation
      const projectSection = document.querySelector("#projets");
      projectSection
        .querySelector(".carousel-controls")
        .after(newIndicatorsWrapper);
    }
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
      if (content) {
        content.classList.remove("flipped");
      }
    });

    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }

  // Configuration des contrôles
  if (prevBtn && nextBtn) {
    nextBtn.addEventListener("click", () =>
      goToSlide((currentIndex + 1) % totalCards)
    );
    prevBtn.addEventListener("click", () =>
      goToSlide((currentIndex - 1 + totalCards) % totalCards)
    );
  }

  // Gestion du swipe sur mobile
  let touchStartX = 0;
  const container = document.querySelector(".carousel-container");

  if (container) {
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
  }

  // Initialiser les indicateurs seulement si nous avons des cartes
  if (cards.length > 0) {
    createIndicators();
    goToSlide(currentIndex);
  }
}

/**
 * Initialise l'animation de retournement des cartes de projets
 */
function initProjectCardFlip() {
  // Utiliser un setTimeout pour s'assurer que le DOM est complètement chargé
  setTimeout(() => {
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
    console.log("Initialisation des cartes à retournement terminée");
  }, 500);
}

// Exporter les fonctions pour utilisation dans d'autres fichiers
export { initProjectCarousel, initProjectCardFlip };
