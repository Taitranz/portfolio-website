// JavaScript to toggle 'selected' class on navigation items based on scroll position
const navItems = document.querySelectorAll('.portfolio-website-nav .item');
const sections = document.querySelectorAll('.portfolio-website-main .section');

const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.6
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
        navItems.forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');

        const sectionClass = item.classList[1];
        const section = document.querySelector(`.section.${sectionClass}`);
        if (section) {
            // Replace scrollIntoView with smoothScrollTo and set duration (e.g., 1000ms)
            smoothScrollTo(section, 1000);
        }
    });
});


// Define the texts for each option
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

// Function to update the texts based on the active option
function updateTexts(option) {
    const textsContainer = document.querySelector('.section.intro .texts');
    textsContainer.innerHTML = ''; // Clear existing texts

    textsForOptions[option].forEach(text => {
        const h1 = document.createElement('h1');
        h1.textContent = text;
        textsContainer.appendChild(h1);
    });
}

const optionItems = document.querySelectorAll('.options .option');

// Add click event listener to each option
optionItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove 'is--active' from all options
        optionItems.forEach(i => i.classList.remove('is--active'));

        // Add 'is--active' to the clicked option
        item.classList.add('is--active');

        // Update texts based on the active option
        const optionClass = item.classList[1];
        updateTexts(optionClass);
    });
});

// Initialize texts for the default active option
const defaultActiveOption = document.querySelector('.options .option.is--active').classList[1];
updateTexts(defaultActiveOption);




