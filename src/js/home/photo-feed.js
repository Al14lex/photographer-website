
document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector(".image-wrapper");
    const images = document.querySelectorAll(".image-wrapper img");
    const totalImages = images.length;

    for (let i = 0; i < totalImages; i++) {
        const clone = images[i].cloneNode(true);
        wrapper.appendChild(clone);
    }

    let observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    wrapper.style.animationPlayState = "running"; 
                } else {
                    wrapper.style.animationPlayState = "paused"; 
                }
            });
        },
        { threshold: 0 }
    );

    observer.observe(wrapper);

});
