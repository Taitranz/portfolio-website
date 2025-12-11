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

const easeInOutExpo = (t) => {
    if (t === 0 || t === 1) return t;
    return t < 0.5
        ? Math.pow(2, 20 * t - 10) / 2
        : (2 - Math.pow(2, -20 * t + 10)) / 2;
};

function smoothScrollTo(element, duration = 800) {
    if (!element) return;
    if (prefersReducedMotionQuery.matches || duration <= 0) {
        element.scrollIntoView({ behavior: "auto", block: "start" });
        return;
    }

    const startY = window.scrollY;
    const targetY = element.getBoundingClientRect().top + startY;
    const distance = targetY - startY;
    const startTime = performance.now();

    const step = (now) => {
        const elapsed = Math.min((now - startTime) / duration, 1);
        const eased = easeInOutExpo(elapsed);
        window.scrollTo({ top: startY + distance * eased });
        if (elapsed < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
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
    resume: {
        title: "Check out my",
        tagline: `
            <div style="display: flex; gap: 20px; margin-top: 10px; flex-wrap: wrap;">
                <a href="assets/Resume/Tai_Tran_Software_Engineer_Resume.pdf" target="_blank" style="text-decoration: underline; cursor: pointer;">Technical Resume</a>
                <a href="assets/Resume/Tai_Tran_Non_Technical_Resume.pdf" target="_blank" style="text-decoration: underline; cursor: pointer;">Non-Technical Resume</a>
            </div>
        `,
        isHtml: true
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

        const taglineEl = document.createElement(content.isHtml ? "div" : "p");
        taglineEl.className = "tagline";
        taglineEl.innerHTML = content.tagline;
        textsContainer.appendChild(taglineEl);
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
