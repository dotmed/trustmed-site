document.addEventListener("DOMContentLoaded", () => {
  const routeToggles = document.querySelectorAll(".tm-route-hero__toggle");
  const routeScenes = document.querySelectorAll(".tm-route-hero__scene[data-route-scene]");

  routeToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const target = toggle.dataset.routeView;

      routeToggles.forEach((btn) => {
        const isActive = btn === toggle;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      });

      routeScenes.forEach((scene) => {
        const isMatch = scene.dataset.routeScene === target;
        scene.classList.toggle("is-active", isMatch);
      });
    });
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("meetingForm");
  const success = document.getElementById("formSuccess");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then(() => {
        form.style.display = "none";
        success.style.display = "block";
      })
      .catch(() => {
        alert("Something went wrong. Please try again.");
      });
  });
});