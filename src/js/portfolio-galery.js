document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".lazy");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute("data-src");

                if (!src) return;

                // Завантажуємо фото
                img.src = src;
                img.removeAttribute("data-src"); // Видаляємо data-src після завантаження
                
                img.onload = () => {
                    img.classList.add("loaded"); // Фото плавно з'являється
                    img.classList.add("visible"); // Запускається анімація
                };

                observer.unobserve(img); // Відключаємо спостереження після завантаження
            }
        });
    }, { threshold: 0.5 });

    images.forEach((img) => observer.observe(img));
});
