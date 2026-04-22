document.addEventListener("DOMContentLoaded", () => {
  initSmoothAnchors();
  initRevealObserver();
  initMobileNav();
  initNewsletterModal();
});

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function initRevealObserver() {
  const reveals = document.querySelectorAll(".tm-reveal");
  if (!reveals.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    reveals.forEach((item) => observer.observe(item));
    return;
  }

  reveals.forEach((item) => item.classList.add("is-visible"));
}

function initMobileNav() {
  const topbar = document.getElementById("tmTopbar");
  const menuToggle = document.querySelector(".tm-menu-toggle");
  const mobileNav = document.getElementById("tmMobileNav");

  if (!topbar || !menuToggle || !mobileNav) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = topbar.classList.toggle("is-menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      topbar.classList.remove("is-menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    });
  });

  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    const isMobile = window.innerWidth <= 640;
    const currentScrollY = window.scrollY;
    const isMenuOpen = topbar.classList.contains("is-menu-open");

    if (!isMobile || isMenuOpen) {
      topbar.classList.remove("is-hidden-mobile");
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY > 120 && currentScrollY > lastScrollY) {
      topbar.classList.add("is-hidden-mobile");
    } else {
      topbar.classList.remove("is-hidden-mobile");
    }

    lastScrollY = currentScrollY;
  });
}

function initNewsletterModal() {
  const modal = document.getElementById("newsletter-modal");
  const mount = document.getElementById("newsletter-modal-mount");

  if (!modal || !mount) return;

  const openButtons = document.querySelectorAll("[data-open-newsletter]");
  const closeButtons = document.querySelectorAll("[data-close-newsletter]");

function buildEmbed() {
  const isMobile = window.innerWidth <= 768;
  const iframeWidth = isMobile ? "100%" : "766px";
  const iframeHeight = isMobile ? 820 : 320;

  mount.innerHTML = `
    <iframe
      src="https://subscribe-forms.beehiiv.com/c71e074a-8a4a-48a4-8304-ddb800177d60"
      class="beehiiv-embed"
      data-test-id="beehiiv-embed"
      frameborder="0"
      scrolling="auto"
      style="width: ${iframeWidth}; height: ${iframeHeight}px; margin: 0; border-radius: 0 !important; background-color: transparent; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); max-width: 100%;"
      title="Subscribe to The Connection">
    </iframe>
  `;
}
  function openModal() {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("has-newsletter-modal-open");

    if (!mount.querySelector("iframe")) {
      buildEmbed();
    }
  }

  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("has-newsletter-modal-open");

    // Remove the iframe so every open is a fresh, stable mount
    mount.innerHTML = "";
  }

  openButtons.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}