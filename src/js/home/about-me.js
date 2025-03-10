
document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.querySelector('.about-container');
    if (!aboutSection) {
        console.error('Section .about-container not found.');
        return;
    }

    const aboutImg = document.querySelector('.about-img');
    const aboutImgBec = document.querySelector('.about-bec-img');
    const aboutTextLines = document.querySelectorAll('.about-text .line');
    const aboutLink = document.querySelector('.about-link');
    const aboutTitle = document.querySelector('.about-title');
    const aboutTitle2 = document.querySelector('.about-title2'); 

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    aboutSection.classList.add('visible');

                    setTimeout(() => {
                        if (aboutImg) aboutImg.classList.add('visible');
                        if (aboutImgBec) aboutImgBec.classList.add('visible');
                        if (aboutTitle) aboutTitle.classList.add('visible');
                    }, 300);

                    setTimeout(() => {
                        if (aboutTitle2) aboutTitle2.classList.add('visible'); 
                    }, 400);

                    aboutTextLines.forEach((line, index) => {
                        setTimeout(() => {
                            if (line) line.classList.add('line-visible');
                        }, 600 + index * 200);
                    });

                    setTimeout(() => {
                        if (aboutLink) aboutLink.classList.add('visible');
                    }, 1200);
                } else {
                    aboutSection.classList.remove('visible');

                    if (aboutImg) aboutImg.classList.remove('visible');
                    if (aboutImgBec) aboutImgBec.classList.remove('visible');
                    if (aboutTitle) aboutTitle.classList.remove('visible');
                    if (aboutTitle2) aboutTitle2.classList.remove('visible');

                    aboutTextLines.forEach((line) => {
                        if (line) line.classList.remove('line-visible');
                    });

                    if (aboutLink) aboutLink.classList.remove('visible');
                }
            });
        },
        {
            threshold: 0.4,
        }
    );

    observer.observe(aboutSection);
});
