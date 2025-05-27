function scrollToSection(sectionId) {
  const targetElement = document.getElementById(sectionId);

  if (targetElement) {
    const navHeight = document.querySelector("nav").offsetHeight;
    const elementPosition = targetElement.offsetTop;
    const offsetPosition = elementPosition - navHeight - 20;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    targetElement.classList.add("section-highlight");
    setTimeout(() => {
      targetElement.classList.remove("section-highlight");
    }, 2000);

    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
    }

    console.log(`Navegando para seção: ${sectionId}`);
  } else {
    console.warn(`Seção não encontrada: ${sectionId}`);
  }
}

function smoothScrollTo(targetPosition, duration = 1000) {
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 AquaGuard - Sistema de navegação inicializado!");

  setupNavigationLinks();

  setupActionButtons();

  setupActiveSection();

  setupScrollSpy();
});

function setupNavigationLinks() {
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      scrollToSection(targetId);

      navLinks.forEach((l) => l.classList.remove("nav-active"));
      this.classList.add("nav-active");
    });
  });

  const footerLinks = document.querySelectorAll('footer a[href^="#"]');
  footerLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      scrollToSection(targetId);
    });
  });

  console.log(
    `✅ Configurados ${navLinks.length + footerLinks.length} links de navegação`
  );
}

function setupActionButtons() {
  const actionButtons = document.querySelectorAll(
    'button[onclick*="scrollToSection"]'
  );
  actionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const onclickAttr = this.getAttribute("onclick");
      if (onclickAttr) {
        const match = onclickAttr.match(/scrollToSection$$'([^']+)'$$/);
        if (match) {
          scrollToSection(match[1]);
        }
      }
    });
  });

  console.log(`✅ Configurados ${actionButtons.length} botões de ação`);
}

function setupActiveSection() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  function updateActiveSection() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => link.classList.remove("nav-active"));

        const activeLink = document.querySelector(
          `nav a[href="#${sectionId}"]`
        );
        if (activeLink) {
          activeLink.classList.add("nav-active");
        }
      }
    });
  }

  let ticking = false;
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateActiveSection);
      ticking = true;
      setTimeout(() => {
        ticking = false;
      }, 100);
    }
  }

  window.addEventListener("scroll", requestTick);
  console.log("✅ Sistema de seção ativa configurado");
}

function setupScrollSpy() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-visible");

        const sectionId = entry.target.getAttribute("id");
        triggerSectionAnimations(sectionId);
      }
    });
  }, observerOptions);

  const sections = document.querySelectorAll("section[id]");
  sections.forEach((section) => observer.observe(section));

  console.log(`✅ Scroll spy configurado para ${sections.length} seções`);
}

function triggerSectionAnimations(sectionId) {
  switch (sectionId) {
    case "dashboard":
      animateDashboardCards();
      break;
    case "community":
      animateCommunityForm();
      break;
    case "gamification":
      animateGamificationElements();
      break;
    case "about":
      animateAboutSection();
      break;
  }
}

function animateDashboardCards() {
  const cards = document.querySelectorAll("#dashboard .card-hover");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.transform = "translateY(0) scale(1)";
      card.style.opacity = "1";
    }, index * 100);
  });
}

function animateCommunityForm() {
  const form = document.querySelector("#community-form");
  if (form) {
    form.classList.add("animate-fade-in-up");
  }
}

function animateGamificationElements() {
  const badges = document.querySelectorAll("#gamification .card-hover");
  badges.forEach((badge, index) => {
    setTimeout(() => {
      badge.style.transform = "scale(1) rotate(0deg)";
      badge.style.opacity = "1";
    }, index * 50);
  });
}

function animateAboutSection() {
  const elements = document.querySelectorAll("#about .card-hover");
  elements.forEach((element) => {
    element.classList.add("animate-slide-in");
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function scrollToNextSection() {
  const currentSection = getCurrentSection();
  const sections = ["home", "dashboard", "community", "gamification", "about"];
  const currentIndex = sections.indexOf(currentSection);

  if (currentIndex < sections.length - 1) {
    scrollToSection(sections[currentIndex + 1]);
  }
}

function getCurrentSection() {
  const sections = document.querySelectorAll("section[id]");
  const scrollPosition = window.scrollY + 100;

  for (let section of sections) {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      return section.getAttribute("id");
    }
  }

  return "home";
}

document.addEventListener("keydown", function (e) {
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        scrollToTop();
        break;
      case "ArrowDown":
        e.preventDefault();
        scrollToNextSection();
        break;
      case "1":
        e.preventDefault();
        scrollToSection("home");
        break;
      case "2":
        e.preventDefault();
        scrollToSection("dashboard");
        break;
      case "3":
        e.preventDefault();
        scrollToSection("community");
        break;
      case "4":
        e.preventDefault();
        scrollToSection("gamification");
        break;
      case "5":
        e.preventDefault();
        scrollToSection("about");
        break;
    }
  }
});

window.scrollToSection = scrollToSection;
window.scrollToTop = scrollToTop;
window.scrollToNextSection = scrollToNextSection;

console.log("🌊 AquaGuard Navigation System - Totalmente carregado!");
