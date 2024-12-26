const burgerMenu = document.querySelector('.burger-menu');
const navList = document.querySelector('.nav-list');

burgerMenu.addEventListener('click', () => {
  navList.classList.toggle('active');
});
