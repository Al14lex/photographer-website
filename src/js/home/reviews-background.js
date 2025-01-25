// document.addEventListener("scroll", function () {
//   const background = document.querySelector(".background-photo-rev");
//   const rect = background.getBoundingClientRect();
//   const offset = window.pageYOffset;

//   // Рахуємо нову позицію фону
//   const parallaxOffset = offset * 0.5; // Множник регулює швидкість
//   background.style.backgroundPosition = `center ${parallaxOffset}px`;
// });


document.addEventListener("scroll", function () {
  const backgroundSection = document.querySelector(".background-photo-rev");
  const parallaxBg = document.querySelector(".parallax-bg");
  
  const sectionTop = backgroundSection.getBoundingClientRect().top;
  const sectionHeight = backgroundSection.offsetHeight;

  if (sectionTop < window.innerHeight && sectionTop + sectionHeight > 0) {
    const scrollAmount = window.scrollY - backgroundSection.offsetTop;
    parallaxBg.style.transform = `translateY(${scrollAmount * 0.6}px)`;
  }
});
