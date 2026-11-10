/* VAISHNAVI DWIVEDI PORTFOLIO — script.js */
document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile navigation
  const menuButton = document.getElementById("mobileToggle");
  const menu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  function closeMenu() {
    if (!menuButton || !menu) return;
    menu.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    menuButton.textContent = "☰";
  }

  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      const open = menu.classList.toggle("active");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      menuButton.textContent = open ? "×" : "☰";
    });
    navLinks.forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  // Dark / light theme
  const themeButton = document.getElementById("themeToggle");
  let theme = "dark";
  try {
    const saved = localStorage.getItem("vd_theme");
    if (saved === "dark" || saved === "light") theme = saved;
  } catch (_) {}

  function setTheme(value) {
    document.body.setAttribute("data-theme", value);
    if (themeButton) {
      themeButton.textContent = value === "dark" ? "☼" : "☾";
      themeButton.setAttribute("aria-label", value === "dark" ? "Switch to light theme" : "Switch to dark theme");
      themeButton.title = value === "dark" ? "Switch to light theme" : "Switch to dark theme";
    }
  }
  setTheme(theme);

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      theme = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(theme);
      try { localStorage.setItem("vd_theme", theme); } catch (_) {}
    });
  }

  // Contact form: prepares an email in the visitor's email app.
  const form = document.getElementById("contactForm");
  const notice = document.getElementById("formNotification");
  const portfolioEmail = "vaishnavidwivedi.work@gmail.com";

  if (form && notice) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !subject || !message) {
        notice.className = "form-status error";
        notice.textContent = "Please complete all fields.";
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        notice.className = "form-status error";
        notice.textContent = "Please enter a valid email address.";
        return;
      }

      const body = encodeURIComponent(
        message + "\n\nFrom: " + name + "\nReply email: " + email
      );
      const link = "mailto:" + portfolioEmail +
        "?subject=" + encodeURIComponent(subject) + "&body=" + body;

      notice.className = "form-status success";
      notice.textContent = "Your email app should open with your message prepared. Please send it from there.";
      window.location.href = link;
    });
  }

  // Highlight the navigation link for the section currently in view.
  const sections = document.querySelectorAll("main section[id]");
  function updateActiveLink() {
    let current = "";
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 160) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();

  console.log("Portfolio loaded successfully.");
});
