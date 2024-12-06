
const navItems = document.querySelectorAll('.portfolio-website-nav .item');
const sections = document.querySelectorAll('.portfolio-website-main .section');

const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

let observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionClass = entry.target.classList[1];
            navItems.forEach(item => {
                item.classList.toggle('selected', item.classList.contains(sectionClass));
            });
        }
    });
}, options);

sections.forEach(section => {
    observer.observe(section);
});

function smoothScrollTo(element, duration) {
    const targetPosition = element.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
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
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const sectionClass = item.classList[1];
        const section = document.querySelector(`.section.${sectionClass}`);
        if (section) {
            smoothScrollTo(section, 1000);
        }

        navMenu.classList.remove('nav-visible');
        overlay.classList.remove('visible');
        hamburgerMenu.classList.remove('active'); 
    });
});

const textsForOptions = {
    anyone: [
        "Hello there, I’m a",
        "student passionate about",
        "using machine",
        "learning to better",
        "the human experience."
    ],
    recruiters: [
        "Hello there, I’m a",
        "student looking for",
        "opportunities to",
        "apply my skills in",
        "machine learning."
    ]
};

function updateTexts(option) {
    const textsContainer = document.querySelector('.section.intro .texts');
    textsContainer.innerHTML = '';

    textsForOptions[option].forEach(text => {
        const h1 = document.createElement('h1');
        h1.textContent = text;
        textsContainer.appendChild(h1);
    });
}

const optionItems = document.querySelectorAll('.options .option');

optionItems.forEach(item => {
    item.addEventListener('click', () => {
        optionItems.forEach(i => i.classList.remove('is--active'));
        item.classList.add('is--active');

        const optionClass = item.classList[1];
        updateTexts(optionClass);
    });
});

const defaultActiveOption = document.querySelector('.options .option.is--active').classList[1];
updateTexts(defaultActiveOption);

const hamburgerMenu = document.querySelector('.hamburger-menu-centered');
const navMenu = document.querySelector('.portfolio-website-nav');
const overlay = document.querySelector('.overlay');

hamburgerMenu.addEventListener('click', () => {
    navMenu.classList.toggle('nav-visible');
    overlay.classList.toggle('visible');
    hamburgerMenu.classList.toggle('active'); // Toggle active class
});

// Consolidated window resize listener to deactivate hamburger menu on any resize
window.addEventListener('resize', () => {
    if (hamburgerMenu.classList.contains('active')) {
        hamburgerMenu.classList.remove('active');
        navMenu.classList.remove('nav-visible');
        overlay.classList.remove('visible');
    }
});