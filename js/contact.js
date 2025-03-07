/**
 * Formulaire de Contact
 * Module de gestion du formulaire de contact et validation de l'email
 */

// Initialisation d'EmailJS
(function () {
  emailjs.init("WtSDctCMaTZG5prkz");
})();

/**
 * Valide le format d'une adresse email
 * @param {string} email - L'adresse email à valider
 * @returns {boolean} - True si l'email est valide, sinon False
 */
function isValidEmail(email) {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

/**
 * Initialise le formulaire de contact avec validation et envoi
 */
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

// Exporter les fonctions pour utilisation dans d'autres fichiers
export { isValidEmail, initContactForm };
