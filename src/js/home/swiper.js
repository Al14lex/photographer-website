import Swiper from 'swiper';
import 'swiper/css';
import { Pagination, Mousewheel } from 'swiper/modules';
import 'swiper/css/pagination';


const swiper = new Swiper('.swiper', {
  modules: [Pagination, Mousewheel],
    direction: 'horizontal',
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        dynamicBullets: true,
    },
    loop: true,
    mousewheel: {
        invert: true, 
    },

     // Default parameters
    slidesPerView: 1,
    breakpoints: {
        768: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 20
        }
    },
});

