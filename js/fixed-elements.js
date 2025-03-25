// Gestion des liens sociaux fixes
document.addEventListener("DOMContentLoaded", () => {
  const socialLinks = document.querySelector(".social-links-fixed");
  let lastScrollTop = 0;
  let isScrolling = false;
  let scrollTimeout;

  window.addEventListener("scroll", () => {
    if (!isScrolling) {
      isScrolling = true;
      socialLinks.classList.add("hidden");
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      socialLinks.classList.remove("hidden");
    }, 550);
  });
});
