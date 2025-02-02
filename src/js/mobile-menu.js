
// const burgerMenu = document.querySelector('.burger-menu');
// const mobileMenu = document.querySelector('.mobile-menu');
// const closeMenu = document.querySelector('.close-menu');
// const menuLinks = document.querySelectorAll('.mobile-menu-list a'); // Всі посилання в меню


// burgerMenu.addEventListener('click', () => {
//     mobileMenu.classList.add('open');
// });


// closeMenu.addEventListener('click', () => {
//     mobileMenu.classList.remove('open');
// });


// menuLinks.forEach(link => {
//     link.addEventListener('click', event => {
//         event.preventDefault();
//         const targetId = link.getAttribute('href'); 
//         const targetSection = document.querySelector(targetId);

//         if (targetSection) {

//             mobileMenu.classList.remove('open');

//             targetSection.scrollIntoView({
//                 behavior: 'smooth',
//                 block: 'start', 
//             });
//         }
//     });
// });

const burgerMenu = document.querySelector('.burger-menu');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenu = document.querySelector('.close-menu');
const menuLinks = document.querySelectorAll('.mobile-menu-list a'); // Всі посилання в меню

// Відкриття мобільного меню
burgerMenu.addEventListener('click', () => {
    mobileMenu.classList.add('open');
});

// Закриття мобільного меню
closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
});

// Логіка для кожного пункту меню
menuLinks.forEach(link => {
    link.addEventListener('click', event => {
        const targetId = link.getAttribute('href'); // Отримуємо значення href
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            // Якщо секція існує, скролимо до неї
            event.preventDefault(); // Зупиняємо стандартну поведінку посилання

            // Закриваємо мобільне меню
            mobileMenu.classList.remove('open');

            // Плавний скрол з додатковою перевіркою
            const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth',
            });

            // Додаткова перевірка завершення скролінгу
            setTimeout(() => {
                if (Math.abs(window.scrollY - offsetTop) > 5) {
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth',
                    });
                }
            }, 1000); // Додатковий скрол після 1 секунди
        } else {
            // Якщо секція не знайдена, перенаправляємо користувача
            mobileMenu.classList.remove('open'); // Закриваємо меню
        }
    });
});
