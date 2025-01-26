document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.querySelector('.about-container');
    const aboutImg = document.querySelector('.about-img');
    const aboutImgBec = document.querySelector('.about-bec-img');
    const aboutHeader = document.querySelector('.about-content h2');
    const aboutTextLines = document.querySelectorAll('.about-text .line');
    const aboutLink = document.querySelector('.about-link');
    const aboutTitle = document.querySelector('.about-title');
    const aboutTitle2 = document.querySelector('.about-title2'); // Додали

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    aboutSection.classList.add('visible');
                    
                    setTimeout(() => {
                        aboutImg.classList.add('visible');
                        aboutImgBec.classList.add('visible');
                        aboutTitle.classList.add('visible');
                    }, 300);

                    setTimeout(() => {
                        aboutTitle2.classList.add('visible'); // Показуємо заголовок 2
                    }, 400);

                    aboutTextLines.forEach((line, index) => {
                        setTimeout(() => {
                            line.classList.add('line-visible');
                        }, 600 + index * 200);
                    });

                    setTimeout(() => {
                        aboutLink.classList.add('visible');
                    }, 1200);
                } else {
                    aboutSection.classList.remove('visible');
                    aboutImg.classList.remove('visible');
                    aboutImgBec.classList.remove('visible');
                    aboutTitle.classList.remove('visible');
                    aboutTitle2.classList.remove('visible'); // Ховаємо заголовок 2
                    aboutTextLines.forEach((line) => {
                        line.classList.remove('line-visible');
                    });
                    aboutLink.classList.remove('visible');
                }
            });
        },
        {
            threshold: 0.4,
        }
    );

    observer.observe(aboutSection);
});
