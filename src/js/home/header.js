let lastScrollTop = 0;
const header = document.querySelector('.header');
const heroSection = document.querySelector('.hero'); 

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const heroHeight = heroSection.offsetHeight / 2; 

  if (scrollTop > lastScrollTop && scrollTop > heroHeight) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
});


// =============== active page ====================
const currentPage = window.location.pathname.split("/").pop(); 
const menuLinks = document.querySelectorAll('.nav-list a');

menuLinks.forEach(link => {
  const linkPage = link.getAttribute('href').split("/").pop();

  if (linkPage === currentPage) {
    link.classList.add('active');
  }
});