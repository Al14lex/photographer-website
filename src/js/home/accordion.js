document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling; // Знайти відповідний список
        const isOpen = header.classList.contains('open');

        // Закрити всі інші акордеони
        document.querySelectorAll('.accordion-header.open').forEach(openHeader => {
            openHeader.classList.remove('open');
            openHeader.nextElementSibling.classList.remove('open');
            openHeader.nextElementSibling.style.maxHeight = '0';
        });

        // Відкрити або закрити поточний акордеон
        if (!isOpen) {
            header.classList.add('open');
            content.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 'px'; // Розкрити до висоти контенту
        } else {
            header.classList.remove('open');
            content.classList.remove('open');
            content.style.maxHeight = '0';
        }
    });
});
