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
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.swiper-slide');
    const prevButton = document.querySelector('.swiper-button-prev');
    const nextButton = document.querySelector('.swiper-button-next');
    let currentIndex = 0;
    let startX = 0; // Для відстеження початкової позиції свайпу
    let isDragging = false; // Статус того, чи відбувається свайп

    // Функція для оновлення видимих слайдів
    function updateSlides() {
        const slidesToShow = getSlidesToShow();
        slides.forEach(slide => slide.style.display = 'none');

        for (let i = 0; i < slidesToShow; i++) {
            const index = (currentIndex + i) % slides.length;
            slides[index].style.display = 'block';
        }
    }

    // Функція для отримання кількості слайдів в залежності від розміру вікна
    function getSlidesToShow() {
        if (window.innerWidth < 768) {
            return 2; // Мобільна версія
        } else if (window.innerWidth < 1024) {
            return 3; // Планшетна версія
        } else {
            return 4; // Десктопна версія
        }
    }

    // Обробник для кнопки "вліво"
    prevButton.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length; // Зменшуємо індекс
        updateSlides(); // Оновлюємо слайди
    });

    // Обробник для кнопки "вправо"
    nextButton.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % slides.length; // Збільшуємо індекс
        updateSlides(); // Оновлюємо слайди
    });

    // Обробник для прокрутки колеса миші
    window.addEventListener('wheel', function(event) {
        event.preventDefault(); // Запобігаємо стандартному поведінці прокрутки
        if (event.deltaY > 0) {
            nextButton.click(); // Прокрутка вниз - наступний слайд
        } else {
            prevButton.click(); // Прокрутка вгору - попередній слайд
        }
    });

    // Обробники подій для сенсорних екранів
    const swiperContainer = document.querySelector('.swiper');
    
    swiperContainer.addEventListener('touchstart', function(event) {
        startX = event.touches[0].clientX; // Запам'ятовуємо початкову позицію
        isDragging = true; // Встановлюємо статус свайпу
    });

    swiperContainer.addEventListener('touchmove', function(event) {
        if (!isDragging) return; // Якщо не свайпимо, нічого не робимо
        const currentX = event.touches[0].clientX;
        const diffX = startX - currentX;

        // Якщо свайп вліво або вправо
        if (Math.abs(diffX) > 50) { // Досить великий свайп
            if (diffX > 0) {
                nextButton.click(); // Свайп вліво - наступний слайд
            } else {
                prevButton.click(); // Свайп вправо - попередній слайд
            }
            isDragging = false; // Зупиняємо свайп
        }
    });

    swiperContainer.addEventListener('touchend', function() {
        isDragging = false; // Закриваємо статус свайпу
    });

    // Оновлюємо слайди при першому завантаженні
    updateSlides();

    // Оновлюємо слайди при зміні розміру вікна
    window.addEventListener('resize', updateSlides);
});


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

