(() => {
  "use strict";

  const form = document.getElementById("appointment-form");
  const doctorSelect = document.getElementById("doctor");
  const dateInput = document.getElementById("date");
  const confirmation = document.getElementById("confirmation");
  const confirmationText = document.getElementById("confirmation-text");
  const newRequestButton = document.getElementById("new-request");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("primary-nav");

  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  dateInput.min = localDate;
  document.getElementById("current-year").textContent = String(today.getFullYear());

  // Mobile navigation.
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Doctor card selection.
  document.querySelectorAll(".choose-doctor").forEach(button => {
    button.addEventListener("click", () => {
      const selectedDoctor = button.dataset.doctor;
      doctorSelect.value = selectedDoctor;
      document.querySelectorAll(".doctor-card").forEach(card => card.classList.remove("selected"));
      button.closest(".doctor-card").classList.add("selected");
      document.getElementById("appointment").scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => document.getElementById("department").focus(), 500);
    });
  });

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function showError(id, message) {
    const input = document.getElementById(id);
    const error = document.querySelector('[data-error-for="' + id + '"]');
    if (input) input.classList.toggle("invalid", Boolean(message));
    if (error) error.textContent = message || "";
  }

  function clearErrors() {
    document.querySelectorAll(".error").forEach(el => el.textContent = "");
    document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
  }

  function isValidPhone(phone) {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }

  function validate() {
    clearErrors();
    let valid = true;
    const fullName = document.getElementById("full-name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const department = document.getElementById("department").value;
    const date = dateInput.value;
    const time = document.getElementById("time").value;

    if (fullName.length < 2) { showError("full-name", "Please enter your full name."); valid = false; }
    if (!isValidPhone(phone)) { showError("phone", "Enter a valid phone number (10–15 digits)."); valid = false; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError("email", "Enter a valid email address."); valid = false; }
    if (!department) { showError("department", "Please choose a department."); valid = false; }
    if (!date) { showError("date", "Please choose an appointment date."); valid = false; }
    else if (date < localDate) { showError("date", "Past appointment dates are not allowed."); valid = false; }
    if (!time) { showError("time", "Please choose a preferred time."); valid = false; }

    return valid;
  }

  dateInput.addEventListener("change", () => {
    if (dateInput.value && dateInput.value < localDate) {
      showError("date", "Past appointment dates are not allowed.");
    } else {
      showError("date", "");
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validate()) {
      const firstInvalid = form.querySelector(".invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const name = document.getElementById("full-name").value.trim();
    const department = document.getElementById("department").value;
    const doctor = doctorSelect.value || "Any available doctor";
    const date = dateInput.value;
    const time = document.getElementById("time").value;

    const formattedDate = new Date(date + "T00:00:00").toLocaleDateString(undefined, {
      day: "numeric", month: "long", year: "numeric"
    });

    confirmationText.innerHTML =
      "Thank you, " + escapeHtml(name) + ". Your selected department is " +
      escapeHtml(department) + ", with " + escapeHtml(doctor) + ", on " +
      escapeHtml(formattedDate) + " at " + escapeHtml(time) + ".";

    form.hidden = true;
    confirmation.hidden = false;
    confirmation.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  newRequestButton.addEventListener("click", () => {
    form.reset();
    clearErrors();
    dateInput.min = localDate;
    form.hidden = false;
    confirmation.hidden = true;
    document.querySelectorAll(".doctor-card").forEach(card => card.classList.remove("selected"));
    document.getElementById("full-name").focus();
  });

  // Lightweight entrance animations with graceful fallback.
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add("visible"));
  }
})();