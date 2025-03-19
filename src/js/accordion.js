
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const isOpen = header.classList.contains('open');
        const socialLinks = document.querySelector('.social-links');

        document.querySelectorAll('.accordion-header.open').forEach(openHeader => {
            openHeader.classList.remove('open');
            openHeader.nextElementSibling.classList.remove('open');
            openHeader.nextElementSibling.style.maxHeight = '0';
        });

        if (!isOpen) {
            header.classList.add('open');
            content.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 'px';

            socialLinks.classList.add('vertical');
        } else {

            header.classList.remove('open');
            content.classList.remove('open');
            content.style.maxHeight = '0';

            socialLinks.classList.remove('vertical');
        }
    });
});