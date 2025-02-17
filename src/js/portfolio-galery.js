document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".lazy");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute("data-src");

                if (!src) return;

                img.src = src;
                img.removeAttribute("data-src"); 
                img.onload = () => {
                    img.classList.add("loaded"); 
                    img.classList.add("visible"); 
                };

                observer.unobserve(img); 
            }
        });
    }, { threshold: 0.5 });

    images.forEach((img) => observer.observe(img));
});
