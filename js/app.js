/*
Description: This file contains scripts for building navigation, handling transitions and animations, scrolling functionalities amongst other smaller functions.
Author: Yaseen AlGailani
*/

window.addEventListener("load", init);

function init() {
  // Mobile navigation expand/collapse functionality
  const navListToggle = document.getElementById("nav-list-toggle");
  const nav = document.getElementById("nav");
  const navList = document.getElementById("nav-list");
  const backdrop = document.getElementById("backdrop");
  const backToTop = document.getElementById("back-to-top");
  const header = document.getElementById("about-playspace");
  const allSections = document.querySelectorAll("main section, header");
  let prevScrollY = 0;

  buildNav();

  /**
   * @description toggle navigation list in mobile view
   */
  function toggleNavList() {
    navListToggle.classList.toggle("expanded");
    if (backdrop.classList.contains("hidden")) {
      backdrop.classList.add("transition");
      navList.classList.add("transition");
      backdrop.clientHeight;
      navList.classList.remove("hidden");
      backdrop.classList.remove("hidden");
      document.body.classList.add("has-backdrop");
    } else {
      backdrop.classList.add("transition");
      navList.classList.add("transition");
      navList.classList.add("hidden");
      backdrop.classList.add("hidden");
      document.body.classList.remove("has-backdrop");
    }
    backdrop.addEventListener("transitionend", function () {
      backdrop.classList.remove("transition");
    });
  }
  navListToggle.addEventListener("click", toggleNavList);

  /**
   * @description nav to appear on scrolling up
   */
  function fixedNavHandler() {
    if (window.scrollY < prevScrollY && window.scrollY > 50) {
      if (!nav.classList.contains("fixed")) {
        header.style["margin-top"] = nav.clientHeight + "px";
        nav.classList.add("fixed");
      }
    } else {
      header.style["margin-top"] = null;
      nav.classList.contains("fixed") && nav.classList.remove("fixed");
    }
    prevScrollY = scrollY;
  }
  window.addEventListener("scroll", fixedNavHandler);

  // Scroll to section  - assign an event lister to each nav item
  for (let a of navList.querySelectorAll("a")) {
    a.addEventListener("click", (e) => {
      document.body.classList.remove("has-backdrop");
      let scrollPos =
        document.querySelector("#" + a.dataset.ref).getBoundingClientRect()
          .top +
        window.scrollY -
        navList.clientHeight;
      scrollToSection(e, scrollPos);
    });
  }

  // Back-to-top button
  backToTop.addEventListener("click", function () {
    smoothScrollTo(0);
  });

  document.addEventListener("scroll", function () {
    backToTop.hidden = window.scrollY < document.documentElement.clientHeight;
  });

  /**
   * @description trigger active section check
   */
  findActiveSection();
  window.addEventListener("scroll", () => {
    findActiveSection(header, navList);
  });

  function scrollToSection(e, scrollPos) {
    e.preventDefault();
    backdrop.classList.add("hidden");
    navList.classList.add("hidden");
    navListToggle.classList.remove("expanded");

    smoothScrollTo(scrollPos);
  }

  /**
   * @description find active section
   */
  function findActiveSection() {
    for (let element of allSections) {
      if (isInView(element)) {
        activeSectionHandler(element);
      }
    }
    if (window.scrollY <= header.clientHeight / 3) {
      activeSectionHandler(header, navList);
    }
  }

  /**
   * @description kickstart slide transitions update navigation status
   * @param {node} element
   */
  function activeSectionHandler(element) {
    let navItem = navList.querySelector(
      'a[data-ref="' + element.id + '"]'
    ).parentElement;

    if (!element.classList.contains("active")) {
      allSections.forEach((section) => {
        section.classList.remove("active");
      });
      element.classList.add("active");
    }

    if (!navItem.classList.contains("active")) {
      navList.querySelectorAll("li").forEach((li) => {
        li.classList.remove("active");
      });
      navItem.classList.add("active");
    }

    for (let child of element.querySelectorAll(
      ".slide-right-group, .slide-left-group, .slide-up-group"
    )) {
      slideHandler(child);
    }
  }

  /**
   * @description build navigation list based on existing sections
   */
  function buildNav() {
    let fragment = document.createDocumentFragment();
    document.querySelectorAll("header, main section").forEach((element) => {
      let li = document.createElement("li");
      li.innerHTML = `<a data-ref="${element.id}">${parseKebabCase(
        element.id
      )}</a>`;
      fragment.append(li);
    });
    navList.appendChild(fragment);
  }
}
/**
 * @description determins if element is within range of focus of the viewport
 * @param {node} element
 * @returns {boolean}
 */
function isInView(element) {
  let elemMidPoint =
    element.getBoundingClientRect().top + element.clientHeight / 2;
  let html = document.documentElement;
  return (
    (elemMidPoint < (html.clientHeight * 5) / 6 &&
      elemMidPoint > html.clientHeight / 6) ||
    (element.getBoundingClientRect().top <= html.clientHeight / 3 &&
      element.getBoundingClientRect().bottom >= html.clientHeight)
  );
}

function parseKebabCase(id) {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * @description Applies smooth scrolling across browsers with native support and others without
 * @param {number} destination
 */

function smoothScrollTo(destination) {
  //check if browser supports smooth scroll
  if (window.CSS.supports("scroll-behavior", "smooth")) {
    window.scrollTo({ top: destination, behavior: "smooth" });
  } else {
    const pace = 200;
    let prevTimestamp = performance.now();
    let currentPos = window.scrollY;

    function step(timestamp) {
      let remainingDistance =
        currentPos < destination
          ? destination - currentPos
          : currentPos - destination;
      let stepDuration = timestamp - prevTimestamp;
      let numOfSteps = pace / stepDuration;
      let stepLength = remainingDistance / numOfSteps;

      currentPos =
        currentPos < destination
          ? currentPos + stepLength
          : currentPos - stepLength;
      window.scrollTo({ top: currentPos });
      prevTimestamp = timestamp;

      if (Math.floor(remainingDistance) >= 1)
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
}

/**
 * @description handles section slide transitions
 * @param {node} slideGroup
 */
function slideHandler(slideGroup) {
  if (slideGroup && slideGroup.classList.contains("hidden")) {
    let delay = 0;
    for (let element of slideGroup.children) {
      element.classList.add("slide-transition");
      element.style["transition-delay"] = 0.1 * ++delay + "s";
      element.addEventListener("transitionend", function () {
        this.classList.remove("slide-transition");
        this.style["transition-delay"] = null;
      });
    }
    slideGroup.classList.remove("hidden");
  }
}
