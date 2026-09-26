document.addEventListener("DOMContentLoaded", function () {

  /* =================================================
     SIDEBAR NAVIGATION (active state)
  ================================================= */
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") {
        e.preventDefault();
      }
      navLinks.forEach(function (item) { item.classList.remove("active"); });
      this.classList.add("active");
      closeSidebar();
    });
  });

  /* =================================================
     MOBILE SIDEBAR TOGGLE
  ================================================= */
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const menuBtn = document.getElementById("menuBtn");

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("open");
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", openSidebar);
  }
  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

  /* =================================================
     LIVE SIMULATION SWITCH
  ================================================= */
  const simSwitch = document.getElementById("simSwitch");
  if (simSwitch) {
    simSwitch.addEventListener("click", function () {
      const isOn = this.classList.toggle("on");
      this.setAttribute("aria-pressed", isOn ? "true" : "false");
    });
  }

  /* =================================================
     ANIMATE CONTRIBUTION BARS ON LOAD
  ================================================= */
  const bars = document.querySelectorAll(".sdg-bar-fill");
  bars.forEach(function (bar) {
    const target = bar.style.width;
    bar.style.width = "0%";
    requestAnimationFrame(function () {
      setTimeout(function () {
        bar.style.transition = "width .8s ease";
        bar.style.width = target;
      }, 60);
    });
  });

});