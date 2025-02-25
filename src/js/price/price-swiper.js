document.addEventListener("DOMContentLoaded", function () {
  new Swiper(".price-swiper", {
    effect: "fade", 
    fadeEffect: {
      crossFade: true, 
    },
    loop: true, 
    autoplay: {
      delay: 3000, 
      disableOnInteraction: false, 
    },
    allowTouchMove: false, 
  });
});
