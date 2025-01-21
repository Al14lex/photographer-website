const burgerMenu = document.querySelector('.burger-menu');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenu = document.querySelector('.close-menu');

burgerMenu.addEventListener('click', () => {
    mobileMenu.classList.add('open');
});

closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
});
