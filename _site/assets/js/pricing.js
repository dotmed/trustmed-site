document.addEventListener("DOMContentLoaded", () => {
  setupEstimator();
  setupSolutionSelector();
  setupGeneralMeetingForm();
  setupMeetingFormSubmission();
  setupArchitectForm();
  setupArchitectFormSubmission();
});

function setupEstimator() {
  const partnerCount = document.getElementById("partnerCount");
  const partnerCountValue = document.getElementById("partnerCountValue");
  const needsTransform = document.getElementById("needsTransform");
  const needsRouting = document.getElementById("needsRouting");
  const hasStack = document.getElementById("hasStack");

  const profileName = document.getElementById("profileName");
  const priceRange = document.getElementById("priceRange");
  const profileSummary = document.getElementById("profileSummary");
  const profileRecommendation = document.getElementById("profileRecommendation");
  const profileActions = document.getElementById("profileActions");

  if (!partnerCount) return;

  const buildActions = (stack, profile) => {
    const primaryLabel =
      profile === "Emerging Network"
        ? "Request Pricing Guidance"
        : profile === "Growing Network"
        ? "Request a Scoped Estimate"
        : "Talk to Trust.med";

    const primaryHref = "/contact";

    if (stack === "partial" || stack === "none") {
      return `
        <a href="/find-a-partner" class="tm-btn tm-btn--secondary">Find a Partner</a>
        <a href="${primaryHref}" class="tm-btn tm-btn--primary">${primaryLabel}</a>
      `;
    }

    return `
      <a href="${primaryHref}" class="tm-btn tm-btn--primary">${primaryLabel}</a>
    `;
  };

  const updateEstimator = () => {
    const partners = Number(partnerCount.value);
    const transform = Number(needsTransform.value);
    const routing = Number(needsRouting.value);
    const stack = hasStack.value;

    partnerCountValue.textContent = String(partners);

    let score = 0;

    if (partners <= 15) {
      score += 1;
    } else if (partners <= 75) {
      score += 3;
    } else if (partners <= 200) {
      score += 5;
    } else {
      score += 7;
    }

    score += transform * 2;
    score += routing * 2;

    if (stack === "partial") {
      score += 1;
    } else if (stack === "none") {
      score += 2;
    }

    let profile = "";
    let range = "";
    let summary = "";
    let recommendation = "";

    if (score <= 4) {
      profile = "Emerging Network";
      range = "$299 – $1,200 / month";
      summary = "Smaller footprint with lighter routing needs.";
    } else if (score <= 10) {
      profile = "Growing Network";
      range = "$2,500 – $6,000 / month";
      summary = "Moderate scale with added routing or transformation needs.";
    } else {
      profile = "Complex Network";
      range = "$10,000 – $20,000 / month";
      summary = "Higher orchestration, advanced routing, or more demanding delivery design.";
    }

    if (stack === "full") {
      recommendation = "Best fit for a direct Trust.med deployment.";
    } else if (stack === "partial") {
      recommendation =
        "A direct deployment will work, but a partner path may create a more efficient commercial path.";
    } else {
      recommendation = "A partner-led path is likely the best fit during a new stack or migration.";
    }

    profileName.textContent = profile;
    priceRange.textContent = range;
    profileSummary.textContent = summary;
    profileRecommendation.textContent = recommendation;
    profileActions.innerHTML = buildActions(stack, profile);
  };

  [partnerCount, needsTransform, needsRouting, hasStack].forEach((field) => {
    field.addEventListener("input", updateEstimator);
    field.addEventListener("change", updateEstimator);
  });

  updateEstimator();
}

function setupSolutionSelector() {
  const cards = document.querySelectorAll(".tm-solution-card");
  const title = document.getElementById("solutionSelectionTitle");
  const summary = document.getElementById("solutionSelectionSummary");
  const tags = document.getElementById("solutionTags");
  const note = document.getElementById("solutionPanelNote");

  if (!cards.length || !title || !summary || !tags || !note) return;

  const fallbackCopy = {
    routing: {
      label: "Routing",
      summary: "You want to separate network connectivity from the rest of your supply chain stack.",
      note: "This usually points to a design conversation around routing control, partner onboarding, and stack separation."
    },
    "multi-send": {
      label: "Multi-Send",
      summary: "You need one message to reach multiple destinations without rebuilding the flow each time.",
      note: "This usually points to one-to-many delivery design, endpoint management, and simplified downstream distribution."
    },
    aggregation: {
      label: "CMO Aggregation",
      summary: "You need multiple upstream feeds combined into one managed inbound path.",
      note: "This usually points to consolidation logic, partner normalization, and controlled downstream delivery."
    },
    "drop-ship": {
      label: "Drop Ship",
      summary: "You need to support delivery patterns that do not follow the standard downstream route.",
      note: "This usually points to exception routing, alternate endpoint logic, and nonstandard fulfillment paths."
    },
    "rules-routing": {
      label: "Rules Routing",
      summary: "You need routing decisions driven by business logic and partner-specific conditions.",
      note: "This suggests a more tailored network design where delivery paths are shaped by business rules and partner conditions."
    },
    "timestamp-correction": {
      label: "Time Stamp Correction",
      summary: "You need event timing normalized when source data arrives out of sequence.",
      note: "This points to a workflow that may require normalization logic before downstream delivery can happen cleanly."
    },
    transformation: {
      label: "Data Transformation",
      summary: "You need data reshaped for different downstream partners.",
      note: "This usually points to message transformation, partner-specific output requirements, and cleaner downstream exchange."
    },
    "3pl-loop": {
      label: "3PL Loop",
      summary: "You need data to move out, return with updates, and continue downstream.",
      note: "This suggests a more dynamic network design that includes nonstandard or return-oriented delivery paths."
    },
    migration: {
      label: "Migration",
      summary: "You are changing providers and want to avoid locking networking into the new stack.",
      note: "This points to a solution design focused on provider change, stack separation, and long-term network control."
    },
    "custom-solutions": {
      label: "Custom Solutions",
      summary: "You have a workflow that does not fit a standard pattern and need a tailored routing and connection design.",
      note: "This usually points to unique operational rules, custom partner requirements, or edge-case supply chain workflows."
    }
  };

  const getCardMeta = (card) => {
    const key = card.dataset.solution;
    const fallback = fallbackCopy[key] || {
      label: "Selected Challenge",
      summary: "Select a challenge to shape the right solution conversation.",
      note: "We’ll use your selected challenges to guide the next conversation."
    };

    const rawTags = card.dataset.tags
      ? card.dataset.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [fallback.label];

    return {
      key,
      label:
        card.querySelector(".tm-solution-card__eyebrow")?.textContent.trim() ||
        fallback.label,
      title: card.dataset.title || fallback.title || "Focused Need",
      summary: card.dataset.summary || fallback.summary,
      note: card.dataset.note || fallback.note,
      tags: rawTags
    };
  };

  const buildTitle = (selectedMeta) => {
    if (!selectedMeta.length) return "Focused Need";
    if (selectedMeta.length === 1) return selectedMeta[0].title || "Focused Need";
    if (selectedMeta.length === 2) return "Combined Needs";
    return "Complex Needs";
  };

  const buildSummary = (selectedMeta) => {
    if (!selectedMeta.length) return "Select at least one challenge to shape the conversation.";
    if (selectedMeta.length === 1) return selectedMeta[0].summary;
    if (selectedMeta.length === 2) {
      return "You are solving two related connectivity challenges across the same supply chain environment.";
    }
    return "You are solving multiple network connectivity challenges across the same supply chain environment.";
  };

  const buildNote = (selectedMeta) => {
    if (!selectedMeta.length) {
      return "Select at least one challenge to frame the right solution conversation.";
    }

    const selectedKeys = selectedMeta.map((item) => item.key);

    if (selectedKeys.includes("migration") && selectedKeys.includes("routing")) {
      return "This points to a solution design focused on provider change, stack separation, and long-term network control.";
    }

    if (selectedKeys.includes("aggregation") && selectedKeys.includes("transformation")) {
      return "This usually points to a more advanced design conversation around orchestration, normalization, and partner-specific delivery.";
    }

    if (selectedKeys.includes("rules-routing")) {
      return "This suggests a more tailored network design where delivery paths are shaped by business rules and partner conditions.";
    }

    if (selectedKeys.includes("timestamp-correction")) {
      return "This points to a workflow that may require normalization logic before downstream delivery can happen cleanly.";
    }

    if (selectedKeys.includes("3pl-loop") || selectedKeys.includes("drop-ship")) {
      return "This suggests a more dynamic network design that includes nonstandard or return-oriented delivery paths.";
    }

    if (selectedKeys.includes("custom-solutions") && selectedMeta.length === 1) {
      return selectedMeta[0].note;
    }

    if (selectedMeta.length >= 3) {
      return "This is a strong case for a scoped architecture review with a solution architect.";
    }

    return selectedMeta[0].note;
  };

  const updateSelection = () => {
    const selectedCards = Array.from(cards).filter((card) =>
      card.classList.contains("is-selected")
    );

    const selectedMeta = selectedCards.map(getCardMeta);

    title.textContent = buildTitle(selectedMeta);
    summary.textContent = buildSummary(selectedMeta);

    const allTags = [...new Set(selectedMeta.flatMap((item) => item.tags))];

    tags.innerHTML = allTags.length
      ? allTags.map((label) => `<span class="tm-solution-tag">${label}</span>`).join("")
      : `<span class="tm-solution-tag">Routing</span>`;

    note.textContent = buildNote(selectedMeta);
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("is-selected");
      updateSelection();
    });
  });

  updateSelection();
}

function setupArchitectForm() {
  const openBtn = document.getElementById("openArchitectForm");
  const closeBtn = document.getElementById("closeArchitectForm");
  const modal = document.getElementById("architectModal");
  const overlay = modal?.querySelector(".tm-modal__overlay");

  const challengesField = document.getElementById("selectedChallengesInput");
  const summaryField = document.getElementById("solutionSummaryInput");
  const tagsField = document.getElementById("solutionTagsInput");
  const form = document.getElementById("architectForm");
  const success = document.getElementById("architectFormSuccess");

  if (!openBtn || !closeBtn || !modal || !challengesField || !summaryField || !tagsField) {
    return;
  }

  const closeModal = () => {
    modal.classList.remove("is-visible");
    modal.setAttribute("aria-hidden", "true");
  };

  openBtn.addEventListener("click", () => {
    const selectedCards = Array.from(
      document.querySelectorAll(".tm-solution-card.is-selected")
    );

    const challenges = selectedCards
      .map((card) => {
        const eyebrow = card.querySelector(".tm-solution-card__eyebrow");
        return eyebrow ? eyebrow.textContent.trim() : "";
      })
      .filter(Boolean);

    const summaryText =
      document.getElementById("solutionSelectionSummary")?.textContent.trim() || "";

    const tags = Array.from(
      document.querySelectorAll("#solutionTags .tm-solution-tag")
    ).map((tag) => tag.textContent.trim());

    challengesField.value = challenges.join(", ");
    summaryField.value = summaryText;
    tagsField.value = tags.join(", ");

    if (form) {
      form.reset();
      form.style.display = "block";
      challengesField.value = challenges.join(", ");
      summaryField.value = summaryText;
      tagsField.value = tags.join(", ");
    }

    if (success) {
      success.style.display = "none";
    }

    modal.classList.add("is-visible");
    modal.setAttribute("aria-hidden", "false");
  });

  closeBtn.addEventListener("click", closeModal);
  if (overlay) overlay.addEventListener("click", closeModal);
}

function setupGeneralMeetingForm() {
  const modal = document.getElementById("meetingModal");
  const closeBtn = document.getElementById("closeMeetingForm");
  const overlay = modal?.querySelector(".tm-modal__overlay");
  const requestTypeField = document.getElementById("meetingRequestType");
  const form = document.getElementById("meetingForm");
  const success = document.getElementById("meetingFormSuccess");

  if (!modal || !closeBtn || !requestTypeField) return;

  const openers = [
    { id: "openMeetingFormHero", requestType: "Hero Meeting Request" },
    { id: "openMeetingFormEstimate", requestType: "Scoped Estimate Request" },
    { id: "openMeetingFormComplex", requestType: "Complex Network Scoping Meeting" }
  ];

  const closeModal = () => {
    modal.classList.remove("is-visible");
    modal.setAttribute("aria-hidden", "true");
  };

  openers.forEach(({ id, requestType }) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener("click", () => {
      requestTypeField.value = requestType;

      if (form) {
        form.reset();
        form.style.display = "block";
        requestTypeField.value = requestType;
      }

      if (success) {
        success.style.display = "none";
      }

      modal.classList.add("is-visible");
      modal.setAttribute("aria-hidden", "false");
    });
  });

  closeBtn.addEventListener("click", closeModal);
  if (overlay) overlay.addEventListener("click", closeModal);
}

function setupMeetingFormSubmission() {
  const form = document.getElementById("meetingForm");
  const success = document.getElementById("meetingFormSuccess");

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
}

function setupArchitectFormSubmission() {
  const form = document.getElementById("architectForm");
  const success = document.getElementById("architectFormSuccess");

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
}

window.addEventListener("pageshow", () => {
  const architectForm = document.getElementById("architectForm");
  const meetingForm = document.getElementById("meetingForm");
  const architectSuccess = document.getElementById("architectFormSuccess");
  const meetingSuccess = document.getElementById("meetingFormSuccess");

  architectForm?.reset();
  meetingForm?.reset();

  if (architectForm) architectForm.style.display = "block";
  if (meetingForm) meetingForm.style.display = "block";
  if (architectSuccess) architectSuccess.style.display = "none";
  if (meetingSuccess) meetingSuccess.style.display = "none";
});