(() => {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const activePageName = location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("#nav-menu a").forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (linkPage === activePageName) {
      link.classList.add("active");
    }
  });
})();
