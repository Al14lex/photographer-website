
document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".lazy");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;

                if (src) {
                    img.src = src;
                    img.removeAttribute("data-src");
                    
                    img.onload = () => {
                        img.classList.add("loaded");
                    };
                }

                observer.unobserve(img);
            }
        });
    }, { rootMargin: "100px", threshold: 0.3 });

    images.forEach(img => observer.observe(img));
});
