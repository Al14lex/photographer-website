const wrapper = document.querySelector('.image-wrapper');
const images = document.querySelectorAll('.image-wrapper img');
const totalImages = images.length;

for (let i = 0; i < totalImages; i++) {
    const clone = images[i].cloneNode(true);
    wrapper.appendChild(clone);
}

let isScrolling = false;

function checkScroll() {
    const rect = wrapper.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;

    if (inViewport && !isScrolling) {
        isScrolling = true;
        wrapper.style.animationPlayState = 'running';
    } else if (!inViewport) {
        isScrolling = false;
        wrapper.style.animationPlayState = 'paused';
    }
}

window.addEventListener('scroll', checkScroll);
window.addEventListener('resize', checkScroll);
