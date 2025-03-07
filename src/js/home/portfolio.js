document.addEventListener("DOMContentLoaded", () => {
    const portfolioItems = document.querySelectorAll(".portfolio-item");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    setTimeout(() => {
                        entry.target.querySelector(".portfolio-img").classList.add("color");
                    }, 800);
                } else {
                    setTimeout(() => {
                        entry.target.classList.remove("visible");
                    entry.target.querySelector(".portfolio-img").classList.remove("color");
                    }, 800);
                    // entry.target.classList.remove("visible");
                    // entry.target.querySelector(".portfolio-img").classList.remove("color");
                }
            });
        },
        { threshold: 0.3 } 
    );

    portfolioItems.forEach((item) => observer.observe(item));
});
