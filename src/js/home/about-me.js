document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.querySelector('.about-container');
    const aboutImg = document.querySelector('.about-img');
    const aboutTextLines = document.querySelectorAll('.about-content p');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    aboutSection.classList.add('visible');
                    aboutImg.classList.add('visible');
                    aboutTextLines.forEach((line, index) => {
                        setTimeout(() => {
                            line.classList.add('line-visible');
                        }, index * 150); // По рядках з затримкою
                    });
                } else {
                    aboutSection.classList.remove('visible');
                    aboutImg.classList.remove('visible');
                    aboutTextLines.forEach((line) => {
                        line.classList.remove('line-visible');
                    });
                }
            });
        },
        {
            threshold: 0.5,
        }
    );

    observer.observe(aboutSection);
});

