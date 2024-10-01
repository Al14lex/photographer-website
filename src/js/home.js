//============ підсвічування назви активної сторінки====

const currentPage = window.location.pathname.split("/").pop(); 
const menuLinks = document.querySelectorAll('.nav-list a');

menuLinks.forEach(link => {
  const linkPage = link.getAttribute('href').split("/").pop();

  if (linkPage === currentPage) {
    link.classList.add('active');
  }
});
// ==============прихвування хедера=========
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

//===========мобільне меню=============
const burgerMenu = document.querySelector('.burger-menu');
const navList = document.querySelector('.nav-list');

burgerMenu.addEventListener('click', () => {
  navList.classList.toggle('active');
});

// ===================SEC WHAT AM I PHOTOGRAPHING=============
const wrapper = document.querySelector('.image-wrapper');
const images = document.querySelectorAll('.image-wrapper img');
const totalImages = images.length;

for (let i = 0; i < totalImages; i++) {
    const clone = images[i].cloneNode(true);
    wrapper.appendChild(clone);
}

let isScrolling = false;

function checkScroll() {
    const rect = wrapper.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;

    if (inViewport && !isScrolling) {
        isScrolling = true;
        wrapper.style.animationPlayState = 'running';
    } else if (!inViewport) {
        isScrolling = false;
        wrapper.style.animationPlayState = 'paused';
    }
}

window.addEventListener('scroll', checkScroll);
window.addEventListener('resize', checkScroll);

//=========== модальне вікто при відправці форми========  
const modal = document.getElementById("modal");
const span = document.getElementById ("close");

document.querySelector(".contact-form").onsubmit = function(event) {
    event.preventDefault(); 
    modal.style.display = "block";
    this.reset();
};

span.onclick = function() {
    modal.style.display = "none";
};

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

