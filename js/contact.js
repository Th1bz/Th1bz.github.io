/**
 * Formulaire de Contact
 * Module de gestion du formulaire de contact et validation de l'email
 */

function isValidEmail(email) {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

/**
 * Initialise le formulaire de contact avec validation et envoi via PHP
 */
function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  const emailInput = document.getElementById("email");

  // Validation email en temps réel
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

  // Soumission du formulaire
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!isValidEmail(emailInput.value)) {
      emailInput.closest(".form-group").classList.add("invalid");
      emailInput.setCustomValidity("Veuillez entrer une adresse email valide");
      emailInput.reportValidity();
      return;
    }

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;

    const formData = new FormData(this);

    fetch("contact.php", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        submitBtn.innerHTML = data.success
          ? '<i class="fas fa-check"></i> Message envoyé !'
          : '<i class="fas fa-exclamation-triangle"></i> Erreur lors de l\'envoi';
        submitBtn.classList.replace("btn-primary", data.success ? "btn-success" : "btn-danger");

        if (data.success) contactForm.reset();

        document.querySelectorAll(".form-group").forEach(group => group.classList.remove("valid", "invalid"));

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.classList.replace(data.success ? "btn-success" : "btn-danger", "btn-primary");
          submitBtn.disabled = false;
        }, 3000);
      })
      .catch(err => {
        console.error(err);
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erreur réseau';
        submitBtn.classList.replace("btn-primary", "btn-danger");
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.classList.replace("btn-danger", "btn-primary");
          submitBtn.disabled = false;
        }, 3000);
      });
  });
}

// Export
export { isValidEmail, initContactForm };
