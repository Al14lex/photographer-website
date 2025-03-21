import Swiper from 'swiper';
// import 'swiper/css';
import { Pagination} from 'swiper/modules';
import 'swiper/css/pagination';

window.addEventListener('load', () => {
    setTimeout(() => {
        const swiper = new Swiper('.swiper', {
            modules: [Pagination],
            direction: 'horizontal',
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
                dynamicBullets: true,
            },
            loop: true,
            slidesPerView: 1,
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 18,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
            },
        });
 }, 600);
});

// import Swiper from 'swiper/bundle'; 
// // import { Pagination} from 'swiper/modules';
// // import 'swiper/css/pagination';


// window.addEventListener('load', () => {
//     const swiper = new Swiper('.swiper', {
//     // modules: [Pagination],
//     direction: 'horizontal',
//     slidesPerView: 1,
//     spaceBetween: 0, 
//     loop: true,
//     pagination: {
//       el: '.swiper-pagination',
//       type: 'bullets',
//       dynamicBullets: true,
//       clickable: true,
//     },
//     breakpoints: {
//       768: {
//         slidesPerView: 2,
//         spaceBetween: 20,
//       },
//       1024: {
//         slidesPerView: 3,
//         spaceBetween: 20,
//       },
//     },
//   });
// });

