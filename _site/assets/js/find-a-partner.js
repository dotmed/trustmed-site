document.addEventListener("DOMContentLoaded", () => {
  initSmoothAnchors();
  initRevealObserver();
  initPartnerFilters();
  initPartnerModal();
  initSolutionPanel();
});

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (event) {
      const href = this.getAttribute("href");
      const target = document.querySelector(href);

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
  } else {
    reveals.forEach((item) => item.classList.add("is-visible"));
  }
}

function initMobileNav() {
  const topbar = document.getElementById("tmTopbar");
  const menuToggle = document.querySelector(".tm-menu-toggle");
  const mobileNav = document.getElementById("tmMobileNav");

  if (!topbar || !menuToggle || !mobileNav) return;

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

function initPartnerFilters() {
  const filters = document.querySelectorAll(".tm-filter");
  const cards = document.querySelectorAll(".tm-partner-card");
  const selectedCategoryInput = document.getElementById("selectedCategoryInput");

  if (!filters.length || !cards.length) return;

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const target = filter.dataset.filter || "all";

      filters.forEach((btn) => btn.classList.remove("is-active"));
      filter.classList.add("is-active");

      cards.forEach((card) => {
        const category = card.dataset.category;
        const shouldShow = target === "all" || category === target;
        card.classList.toggle("is-hidden", !shouldShow);
      });

      if (selectedCategoryInput) {
        selectedCategoryInput.value = target === "all" ? "" : target;
      }
    });
  });
}

function initPartnerModal() {
  const modal = document.getElementById("partnerModal");
  const closeBtn = document.getElementById("closePartnerModal");
  const overlay = modal?.querySelector(".tm-modal__overlay");
  const cards = document.querySelectorAll(".tm-partner-card");
  const introBtn = document.getElementById("requestIntroFromModal");

  const modalLogo = document.getElementById("modalLogo");
  const modalPreferredBadge = document.getElementById("modalPreferredBadge");
  const modalLogoWrap = modalLogo?.closest(".tm-modal-logo");
  const modalName = document.getElementById("modalPartnerName");
  const modalType = document.getElementById("modalPartnerType");
  const modalWebsite = document.getElementById("modalPartnerWebsite");
  const modalDescription = document.getElementById("modalPartnerDescription");
  const modalTags = document.getElementById("modalPartnerTags");
  const modalFit = document.getElementById("modalPartnerFit");

  const selectedPartnerInput = document.getElementById("selectedPartnerInput");
  const selectedCategoryInput = document.getElementById("selectedCategoryInput");

  if (
    !modal ||
    !closeBtn ||
    !overlay ||
    !cards.length ||
    !introBtn ||
    !modalName ||
    !modalType ||
    !modalDescription ||
    !modalTags
  ) {
    return;
  }

  const getCardLogo = (card) => {
    const dataLogo = card.dataset.logo?.trim();
    if (dataLogo) return dataLogo;

    const cardImg = card.querySelector(".tm-partner-logo img, img");
    if (cardImg) {
      const src = cardImg.getAttribute("src");
      if (src && src.trim()) return src.trim();
    }

    return "img/partners/placeholder.png";
  };

  const getCardLogoTheme = (card) => {
    return (card.dataset.logoTheme || "light").trim();
  };

  const applyModalLogoTheme = (theme) => {
    if (!modalLogoWrap) return;

    modalLogoWrap.classList.remove("tm-modal-logo--dark", "tm-modal-logo--mid");

    if (theme === "dark") {
      modalLogoWrap.classList.add("tm-modal-logo--dark");
    } else if (theme === "mid") {
      modalLogoWrap.classList.add("tm-modal-logo--mid");
    }
  };

  const setPreferredBadge = (isPreferred) => {
    if (!modalPreferredBadge) return;
    modalPreferredBadge.style.display = isPreferred ? "inline-flex" : "none";
  };

  const openModal = (card) => {
    const activePartner = card.dataset.partner || "";
    const activeCategory = card.dataset.category || "";
    const website = card.dataset.website || "";

    const activeLogo = getCardLogo(card);
    const activeLogoTheme = getCardLogoTheme(card);
    const isPreferred =
      card.hasAttribute("data-preferred") &&
      (card.dataset.preferred || "").trim().toLowerCase() === "true";
    const description = card.dataset.description || "";
    const fit = card.dataset.fit || "";
    const tags = (card.dataset.tags || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

      // Set website link
  if (modalWebsite) {
    if (website) {
      modalWebsite.href = website;
      modalWebsite.style.display = "inline-flex";
    } else {
      modalWebsite.style.display = "none";
    }
  }

    if (modalLogo) {
      modalLogo.src = activeLogo;
      modalLogo.alt = activePartner ? `${activePartner} logo` : "Partner logo";
      modalLogo.style.display = "";
    }

    applyModalLogoTheme(activeLogoTheme);
    setPreferredBadge(isPreferred);

    modalName.textContent = activePartner;
    modalType.textContent = getDisplayCategory(activeCategory);
    modalDescription.textContent = description;
    modalTags.innerHTML = tags
      .map((tag) => `<span class="tm-tag">${tag}</span>`)
      .join("");

    if (modalFit) {
      modalFit.textContent = fit;
      modalFit.style.display = fit ? "" : "none";
    }

    if (selectedPartnerInput) selectedPartnerInput.value = activePartner;
    if (selectedCategoryInput) selectedCategoryInput.value = activeCategory;

    modal.classList.add("is-visible");
    modal.setAttribute("aria-hidden", "false");
  };

  const closeModal = () => {
    modal.classList.remove("is-visible");
    modal.setAttribute("aria-hidden", "true");
    setPreferredBadge(false);
  };

  setPreferredBadge(false);

  cards.forEach((card) => {
    const trigger = card.querySelector(".tm-partner-card__cta");
    if (!trigger) return;

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openModal(card);
    });
  });

  introBtn.addEventListener("click", () => {
    closeModal();
    const formSection = document.getElementById("partner-form");
    formSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-visible")) {
      closeModal();
    }
  });
}

function initSolutionPanel() {
  const pills = document.querySelectorAll(".tm-solution-pill");
  const detailLabel = document.querySelector(".tm-solution-detail__label");
  const detailText = document.querySelector(".tm-solution-detail__text");
  const selectedCategoryInput = document.getElementById("selectedCategoryInput");

  if (!pills.length || !detailLabel || !detailText) return;

  const solutionCopy = {
    migration: {
      label: "Migration",
      text: "Support provider changes, stack transitions, and downstream continuity without rebuilding every connection from scratch.",
      filter: "all"
    },
    l4: {
      label: "L4 / Serialization",
      text: "Work with partners that help generate, manage, and support regulated product data tied to downstream exchange.",
      filter: "l4"
    },
    inventory: {
      label: "Inventory Management",
      text: "Connect inventory and product movement data to the broader network with greater consistency and less manual coordination.",
      filter: "all"
    },
    wms: {
      label: "WMS",
      text: "Support warehouse workflows and downstream partner communication through more structured and dependable data movement.",
      filter: "all"
    },
    erp: {
      label: "ERP",
      text: "Connect core enterprise data into the broader supply chain environment without tightly coupling every downstream relationship.",
      filter: "all"
    },
    consulting: {
      label: "Solution Design & Consulting",
      text: "Work with partners that help define the right deployment model, onboarding path, and broader network strategy.",
      filter: "consulting"
    },
    credentialing: {
      label: "Credentialing / Identity",
      text: "Support trusted participation through identity verification, access confidence, and secure ecosystem coordination.",
      filter: "credentialing"
    }
  };

  const showSolution = (key) => {
    const item = solutionCopy[key];
    if (!item) return;

    pills.forEach((pill) => {
      pill.classList.toggle("is-active", pill.dataset.solution === key);
    });

    detailLabel.textContent = item.label;
    detailText.textContent = item.text;

    if (selectedCategoryInput) {
      selectedCategoryInput.value = item.filter === "all" ? "" : item.filter;
    }
  };

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      showSolution(pill.dataset.solution);
    });
  });

  showSolution("migration");
}

function getDisplayCategory(category) {
  switch (category) {
    case "l4":
      return "L4";
    case "consulting":
      return "Consulting";
    case "credentialing":
      return "Credentialing";
    default:
      return "Partner";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("partnerMatchForm");
  const success = document.getElementById("partnerMatchSuccess");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    })
      .then(() => {
        form.style.display = "none";
        if (success) success.style.display = "block";
      })
      .catch(() => {
        alert("Something went wrong. Please try again.");
      });
  });
});