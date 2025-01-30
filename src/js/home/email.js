document.addEventListener('DOMContentLoaded', () => {
  emailjs.init('w78d87LS8NmzMC5tY');

    const form = document.querySelector('.contact-form');
    console.log(form);

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const userName = document.getElementById('user_name').value;
    const userEmail = document.getElementById('user_email').value;
    const userMessage = document.getElementById('message').value;

    console.log('User Name:', userName);
    console.log('User Email:', userEmail);
    console.log('User Message:', userMessage);

    if (!userName || !userEmail || !userMessage) {
      alert('Please fill in all fields.');
      return;
    }

    emailjs
      .send('service_i8bcmth', 'template_1fpbo2w', {
        user_name: userName,
        user_email: userEmail,
        message: userMessage,
      })
      .then(() => {
        alert('Thank you! Your message has been sent.');
        form.reset();
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        alert('Oops! Something went wrong. Please try again.');
      });
  });
});
