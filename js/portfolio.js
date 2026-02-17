/**
 * Module de gestion du portfolio détaillé
 * Permet de filtrer et afficher les projets par catégorie
 */

import { loadProjects } from "./projectsManager.js";

let visibleItems = 6; // Nombre d'éléments visibles initialement
let currentCategory = "all"; // Catégorie active par défaut
let expandedCard = null; // Carte actuellement agrandie

/**
 * Initialise la section portfolio
 */
async function initPortfolio() {
  console.log("Initialisation du portfolio...");
  try {
    await generatePortfolioItems();
    setupFilterButtons();
    setupLoadMoreButton();
    setupCardExpansion(); // Remplacé setupModalDetails

    // Appliquer le filtre "none" dès l'initialisation
    filterProjects("all");

    // Sélectionner visuellement le bouton "none" par défaut
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-filter") === "all") {
        btn.classList.add("active");
      }
    });

    console.log("Portfolio initialisé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'initialisation du portfolio:", error);
  }
}

/**
 * Génère les éléments du portfolio à partir des données des projets
 */
async function generatePortfolioItems() {
  try {
    const projects = await loadProjects();
    console.log("Projets chargés pour le portfolio:", projects);

    if (!projects || projects.length === 0) {
      console.error("Aucun projet trouvé pour le portfolio");
      return;
    }

    const portfolioContainer = document.getElementById("portfolio-items");

    if (!portfolioContainer) {
      console.error("Container 'portfolio-items' non trouvé");
      return;
    }

    // Vider le conteneur existant
    portfolioContainer.innerHTML = "";

    // Trier les projets par ID décroissant (les plus récents en premier)
    const sortedProjects = [...projects].sort((a, b) => b.id - a.id);

    // Exemple d'implementation de projet
    const portfolioHTML = sortedProjects
      .map((project, index) => {
        // Déterminer si l'élément doit être visible ou caché initialement
        const isVisible = index < visibleItems;

        // On s'assure que la catégorie est définie et correspond à nos filtres
        let projectCategory = project.category || "web";

        // Convertir les catégories du JSON en catégories utilisées par les filtres
        if (projectCategory === "application") projectCategory = "app";
        if (projectCategory === "template") projectCategory = "web";

        console.log(
          `Projet ${project.id}: Catégorie '${project.category}' convertie en '${projectCategory}'`
        );

        return `
        <div class="col-md-6 col-lg-4 portfolio-item ${
          isVisible ? "" : "hidden"
        }" 
             data-category="${projectCategory}" 
             data-id="${project.id}">
          <div class="portfolio-card">
            <div class="portfolio-img">
              <img src="${project.image}" alt="${
          project.title
        }" class="img-fluid">
              <div class="portfolio-overlay">
                <div class="portfolio-buttons">
                  <a href="#" class="view-details" data-id="${project.id}">
                    <i class="fas fa-eye"></i>
                  </a>
                </div>
              </div>
            </div>
            <div class="portfolio-info">
              <h4 class="portfolio-title">${project.title}</h4>
              <p class="portfolio-category">${getCategoryName(
                projectCategory
              )}</p>
              <div class="portfolio-tech">
                ${project.technologies
                  .slice(0, 3)
                  .map((tech) => `<span>${tech}</span>`)
                  .join("")}
                ${
                  project.technologies.length > 3
                    ? `<span>+${project.technologies.length - 3}</span>`
                    : ""
                }
              </div>
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    portfolioContainer.innerHTML = portfolioHTML;
    console.log(`${sortedProjects.length} projets générés dans le portfolio`);
  } catch (error) {
    console.error(
      "Erreur lors de la génération des éléments du portfolio:",
      error
    );
  }
}

/**
 * Configure les boutons de filtrage
 */
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Mise à jour de l'état actif des boutons
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Filtrage des projets
      currentCategory = this.getAttribute("data-filter");
      filterProjects(currentCategory);

      // Réinitialiser le nombre d'éléments visibles
      visibleItems = 6;
    });
  });
}

/**
 * Filtre les projets par catégorie
 * @param {string} category - La catégorie à filtrer
 */
function filterProjects(category) {
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  let visibleCount = 0;
  const portfolioSection = document.getElementById("portfolio");
  const portfolioContainer = document.getElementById("portfolio-items");

  // Si la catégorie est "none", on cache tous les projets et on affiche un message
  if (category === "none") {
    portfolioItems.forEach((item) => item.classList.add("hidden"));

    // Vérifier si le message d'accueil existe déjà
    if (!document.querySelector(".portfolio-welcome")) {
      // Créer un contenu alternatif
      const welcomeHtml = `
        <div class="portfolio-welcome text-center py-5">
          <div class="welcome-icon mb-4">
            <i class="fas fa-folder-open fa-4x"></i>
          </div>
          <h3 class="mb-3">Découvrez mes réalisations</h3>
          <p class="mb-4">Sélectionnez une catégorie ci-dessus pour explorer mes projets</p>
        </div>
      `;

      // Insérer le contenu avant les éléments du portfolio
      portfolioContainer.insertAdjacentHTML("beforebegin", welcomeHtml);

      // Ajouter des écouteurs d'événements aux boutons guides
      document.querySelectorAll(".guide-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const filterValue = this.getAttribute("data-filter");

          // Trouver et cliquer sur le bouton de filtre correspondant dans les filtres
          document
            .querySelector(
              `.filter-buttons .filter-btn[data-filter="${filterValue}"]`
            )
            .click();
        });
      });
    } else {
      // Afficher le message s'il existe déjà
      document.querySelector(".portfolio-welcome").style.display = "block";
    }

    // Masquer le bouton "Voir plus"
    const loadMoreBtn = document.getElementById("load-more");
    loadMoreBtn.style.display = "none";
    return;
  }

  // Pour les autres catégories, cacher le message d'accueil s'il existe
  const welcomeMessage = document.querySelector(".portfolio-welcome");
  if (welcomeMessage) {
    welcomeMessage.style.display = "none";
  }

  // Pour les autres catégories, restaurer la hauteur normale
  portfolioSection.classList.remove("reduced-height");

  portfolioItems.forEach((item) => {
    const itemCategory = item.getAttribute("data-category");

    // Afficher tous les éléments ou uniquement ceux de la catégorie sélectionnée
    const shouldBeVisible =
      (category === "all" || itemCategory === category) &&
      visibleCount < visibleItems;

    if (shouldBeVisible) {
      item.classList.remove("hidden");
      visibleCount++;
    } else {
      item.classList.add("hidden");
    }
  });

  // Afficher ou masquer le bouton "Voir plus" selon le nombre d'éléments
  updateLoadMoreButton(category);
}

/**
 * Met à jour l'état du bouton "Voir plus"
 * @param {string} category - La catégorie actuelle
 */
function updateLoadMoreButton(category) {
  const loadMoreBtn = document.getElementById("load-more");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  // Compter le nombre total d'éléments dans la catégorie actuelle
  let totalInCategory = 0;
  portfolioItems.forEach((item) => {
    const itemCategory = item.getAttribute("data-category");
    if (category === "all" || itemCategory === category) {
      totalInCategory++;
    }
  });

  // Masquer le bouton si tous les éléments sont déjà visibles
  if (visibleItems >= totalInCategory) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "inline-flex";
  }
}

/**
 * Configure l'agrandissement des cartes de projet
 */
function setupCardExpansion() {
  console.log("Configuration de l'agrandissement des cartes...");

  // Ajouter des listeners pour les boutons de détails avec délégation d'événements
  document.addEventListener("click", function (e) {
    console.log("Clic détecté sur:", e.target, "Classe:", e.target.className);

    // Vérifier si le clic est sur l'icône ou le lien
    const viewDetailsButton = e.target.closest(".view-details");
    const isIconClick =
      e.target.classList.contains("fa-eye") ||
      e.target.classList.contains("fas");

    if (viewDetailsButton || isIconClick) {
      console.log("Bouton view-details cliqué!");
      e.preventDefault();
      e.stopPropagation();

      // Trouver le bouton view-details le plus proche
      const detailsButton =
        e.target.closest(".view-details") ||
        e.target.parentElement.closest(".view-details");

      if (!detailsButton) {
        console.error("Impossible de trouver le bouton view-details");
        return;
      }

      const projectId = detailsButton.getAttribute("data-id");
      console.log("Bouton de détails cliqué pour le projet ID:", projectId);

      if (projectId) {
        toggleCardExpansion(projectId);
      } else {
        console.error(
          "Impossible de trouver l'ID du projet dans le bouton de détails"
        );
      }
    }
  });

  // Fermer la carte agrandie au clic à l'extérieur
  document.addEventListener("click", function (e) {
    if (
      expandedCard &&
      !expandedCard.contains(e.target) &&
      !e.target.closest(".view-details") &&
      !e.target.closest(".portfolio-details")
    ) {
      closeExpandedCard();
    }
  });

  // Fermer la carte agrandie avec la touche Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && expandedCard) {
      closeExpandedCard();
    }
  });

  console.log("Configuration de l'agrandissement des cartes terminée");
}

/**
 * Bascule l'agrandissement d'une carte de projet
 * @param {string} projectId - L'ID du projet à agrandir/réduire
 */
async function toggleCardExpansion(projectId) {
  try {
    const projects = await loadProjects();
    const numericProjectId = parseInt(projectId, 10);
    const project = projects.find((p) => p.id === numericProjectId);

    if (!project) {
      throw new Error(`Projet avec ID ${projectId} non trouvé`);
    }

    const cardElement = document.querySelector(
      `.portfolio-item[data-id="${projectId}"]`
    );

    if (!cardElement) {
      throw new Error(`Carte du projet ${projectId} non trouvée`);
    }

    // Si une carte est déjà agrandie, la fermer d'abord
    if (expandedCard && expandedCard !== cardElement) {
      closeExpandedCard();
    }

    // Si la carte cliquée est déjà agrandie, la fermer
    if (cardElement.classList.contains("expanded")) {
      closeExpandedCard();
      return;
    }

    // Agrandir la carte
    expandCard(cardElement, project);
  } catch (error) {
    console.error("Erreur lors de l'agrandissement de la carte:", error);
  }
}

/**
 * Agrandit une carte de projet avec les détails
 * @param {HTMLElement} cardElement - L'élément de la carte à agrandir
 * @param {Object} project - Les données du projet
 */
function expandCard(cardElement, project) {
  // Fermer toute carte précédemment agrandie
  if (expandedCard) {
    closeExpandedCard();
  }

  const portfolioCard = cardElement.querySelector(".portfolio-card");
  if (!portfolioCard) {
    console.error("Élément .portfolio-card non trouvé dans :", cardElement);
    return;
  }

  // Créer le contenu détaillé
  const detailedContent = createDetailedContent(project);

  // Ajouter la classe expanded et le contenu détaillé
  cardElement.classList.add("expanded");
  portfolioCard.appendChild(detailedContent);

  // Marquer cette carte comme agrandie
  expandedCard = cardElement;

  // Faire défiler vers la carte agrandie
  setTimeout(() => {
    cardElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 300);
}

/**
 * Vérifie si une URL vidéo est valide
 * @param {string} videoUrl - L'URL de la vidéo à vérifier
 * @returns {boolean} True si l'URL est valide, false sinon
 */
function isValidVideoUrl(videoUrl) {
  // Vérifier que videoUrl existe, n'est pas vide, et n'est pas égal à "#"
  if (!videoUrl || typeof videoUrl !== "string") {
    return false;
  }

  const trimmedUrl = videoUrl.trim();

  // Rejeter les valeurs invalides
  if (trimmedUrl === "" || trimmedUrl === "#") {
    return false;
  }

  // Accepter les URLs qui semblent valides (commencent par "assets/", "http://", "https://", ou "/")
  return (
    trimmedUrl.startsWith("assets/") ||
    trimmedUrl.startsWith("http://") ||
    trimmedUrl.startsWith("https://") ||
    trimmedUrl.startsWith("/")
  );
}

/**
 * Crée le contenu détaillé pour une carte agrandie
 * @param {Object} project - Les données du projet
 * @returns {HTMLElement} L'élément contenant les détails
 */
function createDetailedContent(project) {
  const detailedContent = document.createElement("div");
  detailedContent.className = "portfolio-details";

  // Déterminer si on affiche une vidéo ou une image
  const hasValidVideo = isValidVideoUrl(project.videoUrl);

  // Créer le contenu HTML des détails
  detailedContent.innerHTML = `
    <div class="details-overlay">
      <button class="close-details" aria-label="Fermer les détails">
        <i class="fas fa-times"></i>
      </button>
      <div class="details-content">
        <div class="details-header">
          <h3 class="details-title">${project.title}</h3>
          <div class="details-meta">
            <span class="details-category">${getCategoryName(
              project.category || "web"
            )}</span>
            <span class="details-client">${
              project.client || "Projet personnel"
            }</span>
            <span class="details-date">${project.date || "Non spécifié"}</span>
          </div>
        </div>
        
        <div class="details-body">
          <div class="details-gallery">
            ${
              hasValidVideo
                ? `
              <video class="details-video" controls autoplay muted loop playsinline>
                <source src="${project.videoUrl}" type="video/mp4">
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            `
                : `
              <img src="${project.image}" class="details-image" alt="${project.title}">
            `
            }
          </div>
          
          <div class="details-info-grid">
            <div class="details-description">
              <h4>Description</h4>
              <p>${project.fullDescription || project.description}</p>
            </div>
            
            <div class="details-info">
              <div class="details-technologies">
                <h4>Technologies</h4>
                <div class="details-tech-tags">
                  ${project.technologies
                    .map((tech) => `<span>${tech}</span>`)
                    .join("")}
                </div>
              </div>
              
              <div class="details-links">
                ${
                  project.url && project.status !== "disabled"
                    ? `
                  <a href="${project.url}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-external-link-alt"></i> Voir le site
                  </a>
                `
                    : ""
                }
                ${
                  project.github
                    ? `
                  <a href="${project.github}" class="btn btn-outline-primary details-link" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-github"></i> Voir le code
                  </a>
                `
                    : ""
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Ajouter l'écouteur pour fermer les détails
  detailedContent
    .querySelector(".close-details")
    .addEventListener("click", (e) => {
      e.stopPropagation();
      closeExpandedCard();
    });

  return detailedContent;
}

/**
 * Ferme la carte actuellement agrandie
 */
function closeExpandedCard() {
  if (expandedCard) {
    const detailsElement = expandedCard.querySelector(".portfolio-details");
    if (detailsElement) {
      detailsElement.remove();
    }
    expandedCard.classList.remove("expanded");
    expandedCard = null;
  }
}

/**
 * Configure le bouton "Voir plus"
 */
function setupLoadMoreButton() {
  const loadMoreBtn = document.getElementById("load-more");

  loadMoreBtn.addEventListener("click", function () {
    // Augmenter le nombre d'éléments visibles
    visibleItems += 3;

    // Mettre à jour l'affichage
    filterProjects(currentCategory);
  });
}

/**
 * Convertit le code de catégorie en nom lisible
 * @param {string} categoryCode - Le code de la catégorie
 * @returns {string} Le nom lisible de la catégorie
 */
function getCategoryName(categoryCode) {
  const categories = {
    web: "Site Web",
    app: "Application",
    ecommerce: "E-commerce",
    design: "Design UI/UX",
    template: "Site Web",
  };

  return categories[categoryCode] || "Projet";
}

export { initPortfolio };
