/**
 * Module de gestion des projets
 * Permet de charger et manipuler les données des projets depuis un fichier JSON
 */

// Cache des projets chargés
let projectsData = null;

/**
 * Charge les données des projets depuis le fichier JSON
 * @returns {Promise<Array>} Les données des projets
 */
async function loadProjects() {
  if (projectsData !== null) {
    return projectsData;
  }

  try {
    // Utilisation d'un chemin relatif au document actuel pour compatibilité GitHub Pages
    const jsonPath = new URL("../data/projects.json", import.meta.url).href;
    const response = await fetch(jsonPath);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    projectsData = await response.json();
    return projectsData;
  } catch (error) {
    console.error("Erreur lors du chargement des projets:", error);
    return [];
  }
}

/**
 * Génère le HTML pour un projet individuel
 * @param {Object} project - Les données du projet
 * @param {string} className - Classe CSS additionnelle
 * @returns {string} Le HTML du projet
 */
function generateProjectHTML(project, className = "") {
  // Gestion du bouton désactivé
  const buttonState = project.status === "disabled" ? "disabled" : "";

  return `
    <div class="project-card ${className}" data-id="${project.id}">
      <div class="project-content">
        <img src="${project.image}" alt="${project.title}" loading="lazy" />
        <div class="project-info">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-tech">
            ${project.technologies
              .map((tech) => `<span>${tech}</span>`)
              .join("")}
          </div>
          <a href="${project.url}" 
             class="btn btn-primary mt-3" 
             target="_blank" 
             rel="noopener noreferrer"
             ${buttonState}
          >Voir le projet</a>
        </div>
      </div>
    </div>
  `;
}

/**
 * Génère le carrousel de projets et l'insère dans le container spécifié
 * @param {string} containerId - L'ID du container HTML
 */
async function generateProjectCarousel(containerId = "carousel-container") {
  try {
    const projects = await loadProjects();

    if (!projects || projects.length === 0) {
      throw new Error("Aucun projet trouvé");
    }

    const container = document.querySelector(`.${containerId}`);
    if (!container) {
      throw new Error(`Container "${containerId}" non trouvé`);
    }

    // Vider le container existant
    container.innerHTML = "";

    // Pour le premier affichage, définir les positions
    const totalProjects = projects.length;
    const activeIndex = 0;
    const prevIndex = (totalProjects - 1) % totalProjects;
    const nextIndex = 1 % totalProjects;

    // Générer le HTML pour chaque projet avec la classe appropriée
    projects.forEach((project, index) => {
      let className = "";

      if (index === activeIndex) className = "active";
      else if (index === prevIndex) className = "prev";
      else if (index === nextIndex) className = "next";

      container.innerHTML += generateProjectHTML(project, className);
    });
  } catch (error) {
    console.error("Erreur lors de la génération du carrousel:", error);
  }
}

/**
 * Filtre les projets par catégorie
 * @param {string} category - La catégorie à filtrer
 * @returns {Promise<Array>} Les projets filtrés
 */
async function filterProjectsByCategory(category) {
  const projects = await loadProjects();

  if (category === "all") {
    return projects;
  }

  return projects.filter((project) => project.category === category);
}

// Exporter les fonctions pour utilisation dans d'autres fichiers
export { loadProjects, generateProjectCarousel, filterProjectsByCategory };
