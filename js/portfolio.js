/**
 * Module de gestion du portfolio détaillé
 * Permet de filtrer et afficher les projets par catégorie
 */

import { loadProjects } from "./projectsManager.js";

let visibleItems = 6; // Nombre d'éléments visibles initialement
let currentCategory = "none"; // Catégorie active par défaut

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

    // Appliquer le filtre "none" dès l'initialisation
    filterProjects("none");

    // Sélectionner visuellement le bouton "none" par défaut
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-filter") === "none") {
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
      const detailsButton = e.target.closest(".view-details");
      const projectId = detailsButton.getAttribute("data-id");
      console.log("Bouton de détails cliqué pour le projet ID:", projectId);

      if (projectId) {
        showProjectDetails(projectId);
      } else {
        console.error(
          "Impossible de trouver l'ID du projet dans le bouton de détails"
        );
      }
    }
  });

  // Listener pour fermer la modal au clic à l'extérieur
  document.addEventListener("click", function (e) {
    const modal = document.getElementById("projectModal");
    const modalDialog = modal?.querySelector(".modal-dialog");

    // Vérifier si la modal est ouverte et si le clic est en dehors de la modal
    if (
      modal &&
      modal.classList.contains("show") &&
      modalDialog &&
      !modalDialog.contains(e.target)
    ) {
      // S'assurer que le clic n'est pas sur un élément à l'intérieur de la modal,
      // ni sur un lien, ni sur le bouton d'ouverture
      if (
        !e.target.closest(".modal-content") &&
        !e.target.closest(".view-details") &&
        !e.target.closest("a") &&
        e.target.tagName.toLowerCase() !== "a"
      ) {
        closeProjectModal();
      }
    }
  });

  // Listener pour fermer la modal au scroll
  let scrollTimeout;
  window.addEventListener("scroll", function () {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(function () {
      const modal = document.getElementById("projectModal");
      // Ne pas fermer la modal si l'utilisateur interagit avec un lien ou un bouton
      if (
        modal &&
        modal.classList.contains("show") &&
        document.activeElement.tagName.toLowerCase() !== "a" &&
        document.activeElement.tagName.toLowerCase() !== "button"
      ) {
        closeProjectModal();
      }
    }, 150); // Délai court pour éviter de fermer immédiatement au petit scroll
  });
}

/**
 * Affiche les détails d'un projet dans une modal
 * @param {string} projectId - L'ID du projet à afficher
 */
async function showProjectDetails(projectId) {
  try {
    const projects = await loadProjects();
    console.log("Type de projectId:", typeof projectId, "Valeur:", projectId);
    console.log(
      "Projets disponibles:",
      projects.map((p) => `ID ${p.id} (${typeof p.id})`).join(", ")
    );

    // Convertir l'ID en nombre pour la comparaison (car il vient d'un attribut HTML)
    const numericProjectId = parseInt(projectId, 10);
    const project = projects.find((p) => p.id === numericProjectId);

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

    // Liens - Corriger et mettre à jour les liens
    if (project.url && project.status !== "disabled") {
      modalLiveLink.href = project.url;
      modalLiveLink.style.display = "inline-block";
      modalLiveLink.target = "_blank"; // S'assurer que le lien s'ouvre dans un nouvel onglet
      modalLiveLink.rel = "noopener noreferrer"; // Sécurité pour les liens externes

      // Retirer les écouteurs d'événements existants qui pourraient interférer
      const newLiveLink = modalLiveLink.cloneNode(true);
      modalLiveLink.parentNode.replaceChild(newLiveLink, modalLiveLink);

      // S'assurer que le lien est actif
      console.log("Lien live configuré:", project.url);
    } else {
      modalLiveLink.style.display = "none";
    }

    if (project.github) {
      modalCodeLink.href = project.github;
      modalCodeLink.style.display = "inline-block";
      modalCodeLink.target = "_blank";
      modalCodeLink.rel = "noopener noreferrer";

      // Retirer les écouteurs d'événements existants qui pourraient interférer
      const newCodeLink = modalCodeLink.cloneNode(true);
      modalCodeLink.parentNode.replaceChild(newCodeLink, modalCodeLink);

      // S'assurer que le lien est actif
      console.log("Lien GitHub configuré:", project.github);
    } else {
      modalCodeLink.style.display = "none";
    }

    // Galerie d'images
    modalGallery.innerHTML = `<img src="${project.image}" class="img-fluid w-100" alt="${project.title}">`;

    // Supprimer le backdrop existant s'il existe
    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());

    // Afficher la modal avec backdrop static (ne ferme pas au clic extérieur)
    const modalInstance = new bootstrap.Modal(modal, {
      backdrop: false,
      keyboard: true,
      focus: true,
    });

    // Si la modal est déjà ouverte, la fermer d'abord
    if (modal.classList.contains("show")) {
      const oldModal = bootstrap.Modal.getInstance(modal);
      if (oldModal) oldModal.hide();
    }

    modalInstance.show();

    // Nettoyer les classes ajoutées par Bootstrap
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";

    // Ajouter des gestionnaires d'événements pour les liens
    addLinkEventHandlers();
  } catch (error) {
    console.error("Erreur lors de l'affichage des détails du projet:", error);
  }
}

/**
 * Ajoute des gestionnaires d'événements pour les liens dans la modal
 * afin de s'assurer qu'ils fonctionnent correctement
 */
function addLinkEventHandlers() {
  // Récupérer tous les liens dans la modal
  const modal = document.getElementById("projectModal");
  const links = modal.querySelectorAll("a[href]");

  links.forEach((link) => {
    // Retirer les écouteurs d'événements existants
    const newLink = link.cloneNode(true);
    link.parentNode.replaceChild(newLink, link);

    // Ajouter le nouvel écouteur d'événements
    newLink.addEventListener("click", function (event) {
      // Empêcher la propagation de l'événement pour éviter
      // que d'autres gestionnaires n'interfèrent
      event.stopPropagation();

      // Si c'est un lien externe (commence par http ou https)
      if (this.href.startsWith("http")) {
        // Permet l'ouverture normale du lien dans un nouvel onglet
        console.log("Lien externe cliqué:", this.href);
        return true;
      }
    });
  });
}

/**
 * Ferme la modal de projet
 */
function closeProjectModal() {
  const modal = document.getElementById("projectModal");
  if (modal) {
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }

    // Nettoyer les classes et styles ajoutés par Bootstrap
    setTimeout(() => {
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }, 300);
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
