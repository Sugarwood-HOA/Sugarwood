(function () {
  "use strict";

  var toggle = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-site-nav]");

  function closeMenu() {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    nav.setAttribute("data-open", "false");
    document.body.classList.remove("nav-open");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
      nav.setAttribute("data-open", String(!open));
      document.body.classList.toggle("nav-open", !open);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
        toggle.focus();
      }
    });

    window.matchMedia("(min-width: 1161px)").addEventListener("change", closeMenu);
  }

  // Every subject currently goes to the board address. Add a route-specific
  // address to `cc` later to copy another volunteer or committee automatically.
  var defaultEmail = "sugarwoodboard@sugarwood.org";
  var contactRoutes = {
    maintenance: { label: "Maintenance Issues", to: defaultEmail, cc: "" },
    keycard: { label: "Keycard Issues", to: defaultEmail, cc: "" },
    grill: { label: "Grill Area Reservation", to: defaultEmail, cc: "" },
    stingrays: { label: "Stingrays", to: defaultEmail, cc: "" },
    permit: { label: "Building Permit", to: defaultEmail, cc: "" },
    pool: { label: "Pool / Recreation Area", to: defaultEmail, cc: "" },
    website: { label: "Website Issue", to: defaultEmail, cc: "" },
    general: { label: "General Inquiry", to: defaultEmail, cc: "" }
  };

  var contactForm = document.querySelector("[data-contact-form]");
  var contactStatus = document.querySelector("[data-contact-status]");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      var data = new FormData(contactForm);
      var route = contactRoutes[data.get("subject")] || contactRoutes.general;
      var body = [
        "Name: " + data.get("name"),
        "Email: " + data.get("email"),
        "Subject: " + route.label,
        "",
        data.get("message")
      ].join("\n");
      var params = new URLSearchParams({
        subject: "Sugarwood HOA: " + route.label,
        body: body
      });

      if (route.cc) params.set("cc", route.cc);
      if (contactStatus) contactStatus.textContent = "Your email application should open with this message ready to review and send.";
      window.location.href = "mailto:" + route.to + "?" + params.toString();
    });
  }

  window.__SUGARWOOD_READY__ = true;
})();
