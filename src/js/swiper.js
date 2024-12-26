import Swiper from 'swiper';
import 'swiper/css';

const btnPrev = document.querySelector('.swiper-button-prev');
const btnNext = document.querySelector('.swiper-button-next');

const swiper = new Swiper('.swiper', {
  direction: 'horizontal',
    loop: true,

    autoHeight: true,

     // Default parameters
  slidesPerView: 1,
  // Responsive breakpoints
    breakpoints: {

        // when window width is >= 480px
        768: {
            slidesPerView: 2,
            spaceBetween: 20
        },
        // when window width is >= 640px
        1024: {
            slidesPerView: 4,
            spaceBetween: 20
        }
    },
    // centerInsufficientSlides: true,
    // centeredSlides:true,
});

btnPrev.addEventListener('click', () => {
    swiper.slidePrev();
});
btnNext.addEventListener('click', () => {
    swiper.slideNext();
});