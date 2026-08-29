/**
 * Learn Socratian
 * Global interactions shared by public-facing pages.
 *
 * Keep this file focused on site-wide behaviour. Page-specific features should
 * live in their own modules when they are introduced.
 */

const SELECTORS = Object.freeze({
  siteHeader: "[data-site-header]",
  menuToggle: "[data-menu-toggle]",
  primaryNavigation: "[data-primary-navigation]",
  submenu: "[data-submenu]",
  submenuToggle: "[data-submenu-toggle]",
  submenuPanel: "[data-submenu-panel]",
  currentYear: "[data-current-year]",
});

const CLASSES = Object.freeze({
  menuOpen: "menu-open",
  open: "is-open",
  scrolled: "is-scrolled",
});

const BREAKPOINTS = Object.freeze({
  desktopNavigation: "(min-width: 62rem)",
});

const FOCUSABLE_ELEMENTS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

async function loadSharedHeader() {
  const headerPlaceholder = document.getElementById("site-header");

  if (!headerPlaceholder) {
    return;
  }

  try {
    const response = await fetch("/components/header.html", {
  cache: "no-store"
});

    if (!response.ok) {
      throw new Error(`Could not load header: ${response.status}`);
    }

    const headerMarkup = await response.text();
    headerPlaceholder.outerHTML = headerMarkup;
    
  } catch (error) {
    console.error("Error loading shared header:", error);
  }
}


async function loadSharedFooter() {
  const footerPlaceholder = document.getElementById("site-footer");

  if (!footerPlaceholder) {
    return;
  }

  try {
    const response = await fetch("/components/footer.html");

    if (!response.ok) {
      throw new Error(`Could not load footer: ${response.status}`);
    }

    footerPlaceholder.innerHTML = await response.text();
  } catch (error) {
    console.error("Error loading shared footer:", error);
  }
}



/**
 * Return focusable, visible descendants of an element.
 * @param {Element} container
 * @returns {HTMLElement[]}
 */
function getFocusableElements(container) {
  return [...container.querySelectorAll(FOCUSABLE_ELEMENTS)].filter((element) => {
    return element instanceof HTMLElement && element.getClientRects().length > 0;
  });
}

/**
 * Set the footer year without requiring annual maintenance.
 */
function initializeCurrentYear() {
  const year = String(new Date().getFullYear());

  document.querySelectorAll(SELECTORS.currentYear).forEach((element) => {
    element.textContent = year;
  });
}

/**
 * Add a restrained shadow only after the page begins scrolling.
 */
function initializeStickyHeader() {
  const siteHeader = document.querySelector(SELECTORS.siteHeader);

  if (!(siteHeader instanceof HTMLElement)) {
    return;
  }

  let ticking = false;

  const updateHeader = () => {
    siteHeader.classList.toggle(CLASSES.scrolled, window.scrollY > 12);
    ticking = false;
  };

  const requestHeaderUpdate = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateHeader);
  };

  updateHeader();
  window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
}

/**
 * Manage the primary navigation and its responsive focus behaviour.
 */
function initializePrimaryNavigation() {
  const menuToggle = document.querySelector(SELECTORS.menuToggle);
  const navigation = document.querySelector(SELECTORS.primaryNavigation);

  if (!(menuToggle instanceof HTMLButtonElement) || !(navigation instanceof HTMLElement)) {
    return;
  }

  const desktopNavigation = window.matchMedia(BREAKPOINTS.desktopNavigation);
  let previouslyFocusedElement = null;

  const isMenuOpen = () => menuToggle.getAttribute("aria-expanded") === "true";

  const closeSubmenus = () => {
    navigation.querySelectorAll(SELECTORS.submenu).forEach((submenu) => {
      submenu.classList.remove(CLASSES.open);

      const toggle = submenu.querySelector(SELECTORS.submenuToggle);
      if (toggle instanceof HTMLButtonElement) {
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  };

  const openMenu = () => {
    previouslyFocusedElement = document.activeElement;
    menuToggle.setAttribute("aria-expanded", "true");
    navigation.classList.add(CLASSES.open);
    document.body.classList.add(CLASSES.menuOpen);
    navigation.removeAttribute("inert");

    const firstFocusableElement = getFocusableElements(navigation)[0];
    firstFocusableElement?.focus();
  };

  const closeMenu = ({ restoreFocus = true } = {}) => {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove(CLASSES.open);
    document.body.classList.remove(CLASSES.menuOpen);
    closeSubmenus();

    if (!desktopNavigation.matches) {
      navigation.setAttribute("inert", "");
    }

    if (restoreFocus && previouslyFocusedElement instanceof HTMLElement) {
      previouslyFocusedElement.focus();
    }

    previouslyFocusedElement = null;
  };

  const synchronizeNavigationMode = (event) => {
    if (event.matches) {
      navigation.removeAttribute("inert");
      navigation.classList.remove(CLASSES.open);
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove(CLASSES.menuOpen);
      closeSubmenus();
      previouslyFocusedElement = null;
      return;
    }

    if (!isMenuOpen()) {
      navigation.setAttribute("inert", "");
    }
  };

  menuToggle.addEventListener("click", () => {
    if (isMenuOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navigation.addEventListener("click", (event) => {
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null;

    if (link && !desktopNavigation.matches && !link.closest(SELECTORS.submenuToggle)) {
      closeMenu({ restoreFocus: false });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !isMenuOpen() || desktopNavigation.matches) {
      return;
    }

    event.preventDefault();
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || !isMenuOpen() || desktopNavigation.matches) {
      return;
    }

    const focusableElements = [menuToggle, ...getFocusableElements(navigation)];
    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });

  desktopNavigation.addEventListener("change", synchronizeNavigationMode);
  synchronizeNavigationMode(desktopNavigation);

  return { closeMenu, desktopNavigation };
}

/**
 * Manage accessible Courses submenu behaviour on mouse, touch and keyboard.
 */
function initializeSubmenus() {
  const submenus = [...document.querySelectorAll(SELECTORS.submenu)];

  if (submenus.length === 0) {
    return;
  }

  const desktopNavigation = window.matchMedia(BREAKPOINTS.desktopNavigation);

  const setSubmenuState = (submenu, shouldOpen) => {
    const toggle = submenu.querySelector(SELECTORS.submenuToggle);

    submenu.classList.toggle(CLASSES.open, shouldOpen);

    if (toggle instanceof HTMLButtonElement) {
      toggle.setAttribute("aria-expanded", String(shouldOpen));
    }
  };

  const closeAllSubmenus = (exception = null) => {
    submenus.forEach((submenu) => {
      if (submenu !== exception) {
        setSubmenuState(submenu, false);
      }
    });
  };

  submenus.forEach((submenu) => {
    const toggle = submenu.querySelector(SELECTORS.submenuToggle);
    const panel = submenu.querySelector(SELECTORS.submenuPanel);

    if (!(toggle instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
      return;
    }

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const shouldOpen = toggle.getAttribute("aria-expanded") !== "true";

      closeAllSubmenus(submenu);
      setSubmenuState(submenu, shouldOpen);

      if (shouldOpen && !desktopNavigation.matches) {
        const firstLink = panel.querySelector("a[href]");
        firstLink?.focus({ preventScroll: true });
      }
    });

    submenu.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        event.preventDefault();
        event.stopPropagation();
        setSubmenuState(submenu, false);
        toggle.focus();
      }

      if (event.key === "ArrowDown" && document.activeElement === toggle) {
        event.preventDefault();
        setSubmenuState(submenu, true);
        panel.querySelector("a[href]")?.focus();
      }
    });

    submenu.addEventListener("focusout", (event) => {
      if (!desktopNavigation.matches) {
        return;
      }

      const nextFocusedElement = event.relatedTarget;
      if (!(nextFocusedElement instanceof Node) || !submenu.contains(nextFocusedElement)) {
        setSubmenuState(submenu, false);
      }
    });
  });

  document.addEventListener("click", (event) => {
    const clickedElement = event.target;
    if (!(clickedElement instanceof Node) || !submenus.some((submenu) => submenu.contains(clickedElement))) {
      closeAllSubmenus();
    }
  });

  desktopNavigation.addEventListener("change", () => closeAllSubmenus());
}

/**
 * Start site-wide functionality after the document is ready.
 */
async function initializeApp() {
  document.documentElement.classList.add("has-js");

  await loadSharedHeader();

  initializeCurrentYear();
  initializeStickyHeader();
  initializePrimaryNavigation();
  initializeSubmenus();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp, { once: true });
} else {
  initializeApp();
}
