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

// =======================свайпер====================

// document.addEventListener('DOMContentLoaded', function () {
//   const slides = document.querySelectorAll('.swiper-slide');
//   const wrapper = document.querySelector('.swiper-wrapper');
//   const prevButton = document.querySelector('.swiper-button-prev');
//   const nextButton = document.querySelector('.swiper-button-next');
//   let currentIndex = 1; // Починаємо з першого слайда (з урахуванням клонів)
//   let isDragging = false;
//   let startX = 0;
//   let currentX = 0;

//   // Клонування слайдів
//   const firstClone = slides[0].cloneNode(true);
//   const lastClone = slides[slides.length - 1].cloneNode(true);
//   wrapper.appendChild(firstClone); // Додаємо перший слайд в кінець
//   wrapper.insertBefore(lastClone, slides[0]); // Додаємо останній слайд на початок

//   // Оновлення позиції слайдів
//   const updateSlides = (instant = false) => {
//     const offset = -currentIndex * 100; // Розрахунок зміщення
//     wrapper.style.transition = instant ? 'none' : 'transform 0.3s ease-in-out';
//     wrapper.style.transform = `translateX(${offset}%)`;
//   };

//   // Обробка кінцевих положень для циклічності
//   const handleTransitionEnd = () => {
//     const totalSlides = slides.length + 2; // Ураховуємо клони
//     if (currentIndex === 0) {
//       currentIndex = totalSlides - 2; // Переходимо на останній реальний слайд
//       updateSlides(true);
//     } else if (currentIndex === totalSlides - 1) {
//       currentIndex = 1; // Переходимо на перший реальний слайд
//       updateSlides(true);
//     }
//   };

//   // Додати слухач події для завершення анімації
//   wrapper.addEventListener('transitionend', handleTransitionEnd);

//   // Клік на кнопку "назад"
//   prevButton.addEventListener('click', function () {
//     currentIndex--;
//     updateSlides();
//   });

//   // Клік на кнопку "вперед"
//   nextButton.addEventListener('click', function () {
//     currentIndex++;
//     updateSlides();
//   });

//   // Початок свайпа
//   wrapper.addEventListener('touchstart', function (e) {
//     startX = e.touches[0].clientX;
//     isDragging = true;
//     wrapper.style.transition = 'none'; // Вимикаємо анімацію
//   });

//   // Перетягування свайпа
//   wrapper.addEventListener('touchmove', function (e) {
//     if (!isDragging) return;
//     currentX = e.touches[0].clientX;
//     const deltaX = currentX - startX;
//     const offset = -currentIndex * 100 + (deltaX / wrapper.offsetWidth) * 100;
//     wrapper.style.transform = `translateX(${offset}%)`;
//   });

//   // Завершення свайпа
//   wrapper.addEventListener('touchend', function (e) {
//     if (!isDragging) return;
//     isDragging = false;
//     const deltaX = currentX - startX;
//     wrapper.style.transition = 'transform 0.3s ease-in-out';

//     if (Math.abs(deltaX) > 50) {
//       // Якщо свайп значний, змінюємо слайд
//       if (deltaX > 0) {
//         currentIndex--;
//       } else {
//         currentIndex++;
//       }
//     }
//     updateSlides();
//   });

//   // Встановлення початкової позиції
//   updateSlides(true);
// });





//=========== модальне вікто при відправці форми========  
// const modal = document.getElementById("modal");
// const span = document.getElementById ("close");

// document.querySelector(".contact-form").onsubmit = function(event) {
//     event.preventDefault(); 
//     modal.style.display = "block";
//     this.reset();
// };

// span.onclick = function() {
//     modal.style.display = "none";
// };

// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// };

