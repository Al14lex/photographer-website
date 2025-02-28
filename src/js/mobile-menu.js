
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu-list a');

    burgerMenu.addEventListener('click', () => {
        mobileMenu.classList.add('open');
    });

    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', event => {
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                event.preventDefault();

                mobileMenu.classList.remove('open');

                const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth',
                });
                setTimeout(() => {
                    if (Math.abs(window.scrollY - offsetTop) > 5) {
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth',
                        });
                    }
                }, 1000);
            } else {
                mobileMenu.classList.remove('open');
            }
        });
    });
