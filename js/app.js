/*
Table of contents

- Mobile navigation expand/collapse functionality
- nav to appear on scrolling up
- Scroll to section 
- Back-to-top button
- section acive state
- smoothScrollTo function for smooth scrolling accross different browsers

*/


document.addEventListener('DOMContentLoaded', init);

function init() {

    // Mobile navigation expand/collapse functionality
    const navListToggle = document.getElementById('nav-list-toggle');
    const nav = document.getElementById('nav');
    const navList = document.getElementById('nav-list');
    const backdrop = document.getElementById('backdrop');
    const backToTop = document.getElementById('back-to-top');
    const header = document.getElementById('about');
    let prevScrollY = 0;

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
            console.log('hi');
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

            let scrollPos = document.querySelector(a.href.match(/#(.)*/g)[0]).getBoundingClientRect().top + window.scrollY;
            smoothScrollTo(scrollPos);
        })
    }


    // Back-to-top button
    backToTop.addEventListener('click', function () {
        smoothScrollTo(0);
    });

    document.addEventListener('scroll', function () {
        backToTop.hidden = window.scrollY < document.documentElement.clientHeight;
    });


    // section acive state
    window.addEventListener('scroll', function () {
        for (let element of document.querySelectorAll('main section, header')) {
            element.querySelector('.section-content').getBoundingClientRect().top < document.documentElement.clientHeight*2/3 &&
                element.querySelector('.section-content').getBoundingClientRect().bottom > document.documentElement.clientHeight/3 ?
                navList.querySelector('a[href="#' + element.id + '"]').parentElement.classList.add('active') :
                navList.querySelector('a[href="#' + element.id + '"]').parentElement.classList.remove('active');
        }
    });
}

/**
* @description apply smooth scrolling across browsers with native support and others without.
* @param {number} destination - the scroll-to postion.
*/

function smoothScrollTo(destination) {
    //check if browser supports smooth scroll
    if (window.CSS.supports('scroll-behavior', 'smooth')) {
        window.scrollTo({ top: destination, behavior: 'smooth' });
    } else {
        const pace = 200;
        let prevTimestamp = performance.now();
        let currentPos = window.scrollY;
        // @param: timestamp is a "DOMHightResTimeStamp", check on MDN
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