/**
 * Module de gestion du portfolio détaillé
 * Permet de filtrer et afficher les projets par catégorie
 */

import { loadProjects } from "./projectsManager.js";

let visibleItems = 6; // Nombre d'éléments visibles initialement
let currentCategory = "all"; // Catégorie active par défaut

/**
 * Initialise la section portfolio
 */
async function initPortfolio() {
  console.log("Initialisation du portfolio...");
  try {
    await generatePortfolioItems();
    setupFilterButtons();
    setupLoadMoreButton();
    setupModalDetails();
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

    // Exemple d'implementation de projet
    const portfolioHTML = projects
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
                  ${
                    project.url && project.status !== "disabled"
                      ? `<a href="${project.url}" target="_blank" class="view-live">
                      <i class="fas fa-external-link-alt"></i>
                    </a>`
                      : ""
                  }
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
    console.log(`${projects.length} projets générés dans le portfolio`);
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
 * Configure les modals de détails des projets
 */
function setupModalDetails() {
  // Ajouter des listeners pour les boutons de détails
  document.addEventListener("click", function (e) {
    if (e.target.closest(".view-details")) {
      e.preventDefault();
      const projectId = e.target
        .closest(".view-details")
        .getAttribute("data-id");
      showProjectDetails(projectId);
    }
  });
}

/**
 * Affiche les détails d'un projet dans une modal
 * @param {string} projectId - L'ID du projet à afficher
 */
async function showProjectDetails(projectId) {
  try {
    const projects = await loadProjects();
    const project = projects.find((p) => p.id === projectId);

    if (!project) {
      throw new Error(`Projet avec ID ${projectId} non trouvé`);
    }

    // Remplir la modal avec les détails du projet
    const modal = document.getElementById("projectModal");
    const modalTitle = modal.querySelector(".project-title");
    const modalCategory = modal.querySelector(".project-category");
    const modalClient = modal.querySelector(".project-client");
    const modalDate = modal.querySelector(".project-date");
    const modalDescription = modal.querySelector(".project-description");
    const modalTechTags = modal.querySelector(".tech-tags");
    const modalLiveLink = modal.querySelector(".project-live-link");
    const modalCodeLink = modal.querySelector(".project-code-link");
    const modalGallery = modal.querySelector(".project-gallery");

    // Remplir les champs de la modal
    modalTitle.textContent = project.title;
    modalCategory.textContent = getCategoryName(project.category || "web");
    modalClient.textContent = project.client || "Projet personnel";
    modalDate.textContent = project.date || "Non spécifié";
    modalDescription.innerHTML = project.fullDescription || project.description;

    // Technologies
    modalTechTags.innerHTML = project.technologies
      .map((tech) => `<span>${tech}</span>`)
      .join("");

    // Liens
    if (project.url) {
      modalLiveLink.href = project.url;
      modalLiveLink.style.display = "inline-block";
    } else {
      modalLiveLink.style.display = "none";
    }

    if (project.github) {
      modalCodeLink.href = project.github;
      modalCodeLink.style.display = "inline-block";
    } else {
      modalCodeLink.style.display = "none";
    }

    // Galerie d'images
    modalGallery.innerHTML = `<img src="${project.image}" class="img-fluid w-100" alt="${project.title}">`;

    // Afficher la modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
  } catch (error) {
    console.error("Erreur lors de l'affichage des détails du projet:", error);
  }
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
