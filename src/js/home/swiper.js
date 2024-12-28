import Swiper from 'swiper';
import 'swiper/css';

const btnPrev = document.querySelector('.swiper-button-prev');
const btnNext = document.querySelector('.swiper-button-next');

const swiper = new Swiper('.swiper', {
  direction: 'horizontal',
    loop: true,
    // autoHeight: false,

     // Default parameters
    slidesPerView: 1,
    breakpoints: {
        768: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 4,
            spaceBetween: 20
        }
    },
});

btnPrev.addEventListener('click', () => {
    swiper.slidePrev();
});
btnNext.addEventListener('click', () => {
    swiper.slideNext();
});