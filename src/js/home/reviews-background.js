
document.addEventListener("DOMContentLoaded", function () {
    const parallaxBg = document.querySelector(".parallax-bg");
    const backgroundSection = document.querySelector(".background-photo-rev");

    function updateParallax() {
        const sectionTop = backgroundSection.getBoundingClientRect().top;
        const sectionHeight = backgroundSection.offsetHeight;
        const viewportHeight = window.innerHeight;

        if (sectionTop < viewportHeight && sectionTop + sectionHeight > 0) {
            const scrollAmount = window.scrollY - backgroundSection.offsetTop;
            parallaxBg.style.transform = `translateY(${scrollAmount * 0.4}px)`;
        }
    }

    document.addEventListener("scroll", updateParallax);
    window.addEventListener("resize", updateParallax);
    updateParallax();
});
