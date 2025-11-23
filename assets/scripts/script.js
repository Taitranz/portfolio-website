const navItems = document.querySelectorAll(".portfolio-website-nav .item");
const sections = document.querySelectorAll(".portfolio-website-main .section");

const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
};

function getSectionClass(element) {
    return Array.from(element.classList).find((cls) => cls !== "section");
}

let observer = new IntersectionObserver((entries) => {
    const visibleEntries = entries.filter((entry) => entry.isIntersecting);
    if (!visibleEntries.length) {
        return;
    }

    const mostVisibleEntry = visibleEntries.reduce((maxEntry, currentEntry) =>
        currentEntry.intersectionRatio > maxEntry.intersectionRatio ? currentEntry : maxEntry
    );

    const sectionClass = getSectionClass(mostVisibleEntry.target);
    if (!sectionClass) {
        return;
    }

    navItems.forEach((item) => {
        item.classList.toggle("selected", item.classList.contains(sectionClass));
    });
}, options);

sections.forEach((section) => {
    observer.observe(section);
});

const prefersReducedMotionQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };
const scrollCancelEvents = [
    { type: "wheel", options: { passive: true } },
    { type: "touchstart", options: { passive: true } },
    { type: "touchmove", options: { passive: true } },
    { type: "keydown", options: false },
    { type: "mousedown", options: false },
];

let scrollAnimationFrame = null;
let cancelScrollListener = null;

function addScrollCancelListeners(listener) {
    scrollCancelEvents.forEach(({ type, options }) => window.addEventListener(type, listener, options));
}

function removeScrollCancelListeners(listener) {
    scrollCancelEvents.forEach(({ type, options }) => window.removeEventListener(type, listener, options));
}

function stopActiveScrollAnimation() {
    if (scrollAnimationFrame !== null) {
        cancelAnimationFrame(scrollAnimationFrame);
        scrollAnimationFrame = null;
    }

    if (cancelScrollListener) {
        removeScrollCancelListeners(cancelScrollListener);
        cancelScrollListener = null;
    }
}

function smoothScrollTo(element, duration = 1000) {
    if (!element) return;

    stopActiveScrollAnimation();

    const targetPosition = element.getBoundingClientRect().top + window.scrollY;

    if (prefersReducedMotionQuery.matches) {
        window.scrollTo({ top: targetPosition, behavior: "auto" });
        return;
    }

    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;

    if (Math.abs(distance) < 1) {
        return;
    }

    const minDuration = 250;
    const maxDuration = Math.max(duration, minDuration);
    const distanceInfluence = Math.abs(distance) * 0.5;
    const adjustedDuration = Math.min(maxDuration, Math.max(minDuration, distanceInfluence));

    const easeInOutCubic = (progress) =>
        progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    let startTime = null;

    const step = (timestamp) => {
        if (startTime === null) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / adjustedDuration, 1);
        const easedProgress = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * easedProgress);

        if (progress < 1) {
            scrollAnimationFrame = requestAnimationFrame(step);
        } else {
            stopActiveScrollAnimation();
        }
    };

    cancelScrollListener = () => {
        stopActiveScrollAnimation();
    };

    addScrollCancelListeners(cancelScrollListener);

    scrollAnimationFrame = requestAnimationFrame(step);
}

navItems.forEach((item) => {
    item.addEventListener("click", () => {
        const sectionClass = item.classList[1];
        const section = document.querySelector(`.section.${sectionClass}`);
        if (section) {
            smoothScrollTo(section, 1000);
        }

        navMenu.classList.remove("nav-visible");
        overlay.classList.remove("visible");
        hamburgerMenu.classList.remove("active");
    });
});

const textsForOptions = {
    anyone: ["Hello there, I like", "building software at", "high velocity and", "taking on challenging", "problems."],
    recruiters: ["Hello there, I'm", "looking for opportunities", "where I can have", "high impact and", "ownership."],
    misc: ["Hello there, I’m a", "student looking for", "opportunities to", "apply my skills in", "machine learning."],
};

function updateTexts(option) {
    const textsContainer = document.querySelector(".section.intro .texts");
    textsContainer.innerHTML = "";

    textsForOptions[option].forEach((text) => {
        const h1 = document.createElement("h1");
        h1.textContent = text;
        textsContainer.appendChild(h1);
    });
}

const optionItems = document.querySelectorAll(".options .option");

optionItems.forEach((item) => {
    item.addEventListener("click", () => {
        optionItems.forEach((i) => i.classList.remove("is--active"));
        item.classList.add("is--active");

        const optionClass = item.classList[1];
        updateTexts(optionClass);
    });
});

const defaultActiveOption = document.querySelector(".options .option.is--active").classList[1];
updateTexts(defaultActiveOption);

const hamburgerMenu = document.querySelector(".hamburger-menu-centered");
const navMenu = document.querySelector(".portfolio-website-nav");
const overlay = document.querySelector(".overlay");

hamburgerMenu.addEventListener("click", () => {
    navMenu.classList.toggle("nav-visible");
    overlay.classList.toggle("visible");
    hamburgerMenu.classList.toggle("active"); // Toggle active class
});

// Consolidated window resize listener to deactivate hamburger menu on any resize
window.addEventListener("resize", () => {
    if (hamburgerMenu.classList.contains("active")) {
        hamburgerMenu.classList.remove("active");
        navMenu.classList.remove("nav-visible");
        overlay.classList.remove("visible");
    }
});
