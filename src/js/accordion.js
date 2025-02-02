// document.querySelectorAll('.accordion-header').forEach(header => {
//     header.addEventListener('click', () => {
//         const content = header.nextElementSibling;
//         const isOpen = header.classList.contains('open');

//         document.querySelectorAll('.accordion-header.open').forEach(openHeader => {
//             openHeader.classList.remove('open');
//             openHeader.nextElementSibling.classList.remove('open');
//             openHeader.nextElementSibling.style.maxHeight = '0';
//         });

//         if (!isOpen) {
//             header.classList.add('open');
//             content.classList.add('open');
//             content.style.maxHeight = content.scrollHeight + 'px';
//         } else {
//             header.classList.remove('open');
//             content.classList.remove('open');
//             content.style.maxHeight = '0';
//         }
//     });
// });

document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const isOpen = header.classList.contains('open');
        const socialLinks = document.querySelector('.social-links');

        // Закриваємо всі відкриті акордеони
        document.querySelectorAll('.accordion-header.open').forEach(openHeader => {
            openHeader.classList.remove('open');
            openHeader.nextElementSibling.classList.remove('open');
            openHeader.nextElementSibling.style.maxHeight = '0';
        });

        if (!isOpen) {
            // Відкриваємо поточний акордеон
            header.classList.add('open');
            content.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 'px';

            // Додаємо вертикальну орієнтацію для соціальних посилань
            socialLinks.classList.add('vertical');
        } else {
            // Закриваємо поточний акордеон
            header.classList.remove('open');
            content.classList.remove('open');
            content.style.maxHeight = '0';

            // Повертаємо соціальні посилання в початковий стан
            socialLinks.classList.remove('vertical');
        }
    });
});
