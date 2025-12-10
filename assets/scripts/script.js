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

function smoothScrollTo(element) {
    if (!element) return;

    const targetPosition = element.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotionQuery.matches ? "auto" : "smooth",
    });
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
    anyone: {
        title: "Hello there, I like",
        tagline: "building software at<br>high velocity and<br>taking on challenging<br>problems.",
    },
    recruiters: {
        title: "Looking for",
        tagline: "opportunities with<br>high development velocity,<br>high impact,<br>and high ownership.",
    },
};

function updateTexts(option) {
    const textsContainer = document.querySelector(".section.intro .texts");
    textsContainer.innerHTML = "";

    const content = textsForOptions[option];
    if (content) {
        const h1 = document.createElement("h1");
        h1.textContent = content.title;
        textsContainer.appendChild(h1);

        const p = document.createElement("p");
        p.className = "tagline";
        p.innerHTML = content.tagline;
        textsContainer.appendChild(p);
    }
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
