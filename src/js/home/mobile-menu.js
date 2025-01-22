
const burgerMenu = document.querySelector('.burger-menu');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenu = document.querySelector('.close-menu');
const menuLinks = document.querySelectorAll('.mobile-menu-list a'); // Всі посилання в меню


burgerMenu.addEventListener('click', () => {
    mobileMenu.classList.add('open');
});


closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
});


menuLinks.forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        const targetId = link.getAttribute('href'); 
        const targetSection = document.querySelector(targetId);

        if (targetSection) {

            mobileMenu.classList.remove('open');

            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start', 
            });
        }
    });
});

