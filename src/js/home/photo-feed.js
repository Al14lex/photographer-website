document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector(".image-wrapper");
    const images = document.querySelectorAll(".image-wrapper img");
    const totalImages = images.length;

    for (let i = 0; i < totalImages; i++) {
        const clone = images[i].cloneNode(true);
        wrapper.appendChild(clone);
    }

    images.forEach(img => {
        if (!img.complete) {
            img.loading = "eager"; 
            img.fetchPriority = "high"; 
            img.src = img.src; 
        }
    });

    let observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                wrapper.style.animationPlayState = "running"; 
            });
        },
        { threshold: 0 }
    );

    observer.observe(wrapper);
});
