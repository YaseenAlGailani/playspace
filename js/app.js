/*
Description: This file contains scripts for building navigation, handling transitions and animations, scrolling functionalities amongst other smaller functions.
Author: Yaseen AlGailani
*/

window.addEventListener('load', init);

function init() {

    // Mobile navigation expand/collapse functionality
    const navListToggle = document.getElementById('nav-list-toggle');
    const nav = document.getElementById('nav');
    const navList = document.getElementById('nav-list');
    const backdrop = document.getElementById('backdrop');
    const backToTop = document.getElementById('back-to-top');
    const header = document.getElementById('about-playspace');
    let prevScrollY = 0;

    buildNav(navList);

    // toggle navigation list in mobile view
    navListToggle.addEventListener('click', function () {
        navListToggle.classList.toggle('expanded')

        if (backdrop.classList.contains('hidden')) {
            backdrop.classList.add('transition');
            navList.classList.add('transition');
            backdrop.clientHeight;
            navList.classList.remove('hidden');
            backdrop.classList.remove('hidden');
        } else {
            backdrop.classList.add('transition');
            navList.classList.add('transition');
            navList.classList.add('hidden');
            backdrop.classList.add('hidden');
        }
        backdrop.addEventListener('transitionend', function () {
            backdrop.classList.remove('transition');
        });
    });

    // nav to appear on scrolling up
    window.addEventListener('scroll', function () {
        if (window.scrollY < prevScrollY && window.scrollY > 50) {
            if (!nav.classList.contains('fixed')) {
                header.style['margin-top'] = nav.clientHeight + 'px';
                nav.classList.add('fixed');
            }
        } else {
            header.style['margin-top'] = null;
            nav.classList.contains('fixed') && nav.classList.remove('fixed');
        }
        prevScrollY = scrollY;
    });

    // Scroll to section 
    for (let a of navList.querySelectorAll('a')) {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            backdrop.classList.add('hidden');
            navList.classList.add('hidden');
            navListToggle.classList.remove('expanded');

            let scrollPos = document.querySelector(a.href.match(/#(.)*/g)[0]).getBoundingClientRect().top + window.scrollY - navList.clientHeight;
            smoothScrollTo(scrollPos);
        });
    }

    // Back-to-top button
    backToTop.addEventListener('click', function () {
        smoothScrollTo(0);
    });

    document.addEventListener('scroll', function () {
        backToTop.hidden = window.scrollY < document.documentElement.clientHeight;
    });

    // trigger active section check
    checkActiveSection(header, navList);
    window.addEventListener('scroll', () => {
        checkActiveSection(header, navList)
    });
}

// find active section
function checkActiveSection(header, navList) {
    for (let element of document.querySelectorAll('main section, header')) {
        if (isInView(element)) {
            activeSectionHandler(element, navList);
        }
    }
    if (window.scrollY <= header.clientHeight/2) {
        activeSectionHandler(header, navList);
    }
}

//return true if the passed element is currently within the range of focus in the viewport
function isInView(element) {
    let elemMidPoint = element.getBoundingClientRect().top + (element.clientHeight / 2);
    let html = document.documentElement;
    return (elemMidPoint < html.clientHeight * 5 / 6 &&
        elemMidPoint > html.clientHeight / 6) || (element.getBoundingClientRect().top <= html.clientHeight/3 && element.getBoundingClientRect().bottom >= html.clientHeight);
}

//build navigation list based on existing sections
function buildNav(navList) {
    let fragment = document.createDocumentFragment();
    document.querySelectorAll('header, main section').forEach((element) => {
        let li = document.createElement('li');
        console.log('id: ' + element.id)
        li.innerHTML = `<a href="#${element.id}">${parseID(element.id)}</a>`;
        fragment.append(li);
    });
    navList.appendChild(fragment);
}

function parseID(id) {
    return id.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Apply smooth scrolling across browsers with native support and others without
function smoothScrollTo(destination) {
    //check if browser supports smooth scroll
    if (window.CSS.supports('scroll-behavior', 'smooth')) {
        window.scrollTo({ top: destination, behavior: 'smooth' });
    } else {
        const pace = 200;
        let prevTimestamp = performance.now();
        let currentPos = window.scrollY;

        function step(timestamp) {
            let remainingDistance = currentPos < destination ? destination - currentPos : currentPos - destination;
            let stepDuration = timestamp - prevTimestamp;
            let numOfSteps = pace / stepDuration;
            let stepLength = remainingDistance / numOfSteps;

            currentPos = currentPos < destination ? currentPos + stepLength : currentPos - stepLength;
            window.scrollTo({ top: currentPos });
            prevTimestamp = timestamp;

            if (Math.floor(remainingDistance) >= 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    }
}

// handle kickstart slide transitions update navigation status
function activeSectionHandler(element, navList) {
    for (let child of element.querySelectorAll('.slide-right-group, .slide-left-group, .slide-up-group')) {
        slideHandler(child);
    }
    navList.querySelectorAll('li').forEach((li) => { li.classList.remove('active') });
    navList.querySelector('a[href="#' + element.id + '"]').parentElement.classList.add('active');
}

// handle section slide transitions
function slideHandler(slideGroup) {
    if (slideGroup && slideGroup.classList.contains('hidden')) {
        let delay = 0;
        for (let element of slideGroup.children) {
            element.classList.add('slide-transition');
            element.style['transition-delay'] = 0.1 * ++delay + "s";
            element.addEventListener('transitionend', function () {
                this.classList.remove('slide-transition');
                this.style['transition-delay'] = null;
            });
        }
        slideGroup.classList.remove('hidden');
    }
}
