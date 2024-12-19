import Swiper from 'swiper';
import 'swiper/css';
import { Navigation} from 'swiper/modules';
import 'swiper/css/navigation';

const swiper = new Swiper('.swiper', {
  modules: [Navigation],
  direction: 'horizontal',
    loop: true,
  
    navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
    },
    
    autoHeight: true,

     // Default parameters
  slidesPerView: 1,
  spaceBetween: 10,
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
    centerInsufficientSlides: true,
    centeredSlides:true,
});