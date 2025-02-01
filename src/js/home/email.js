
// document.querySelector(".contact-form").addEventListener("submit", async function (event) {
//   event.preventDefault();

//   const userName = document.getElementById("user_name").value;
//   const userEmail = document.getElementById("user_email").value;
//   const message = document.getElementById("message").value;

//   try {
//     const response = await emailjs.send("service_i8bcmth", "template_1fpbo2w", {
//       user_name: userName,
//       user_email: userEmail,
//       message: message,
//     });

//     if (response.status === 200) {
//       alert("Your message was sent successfully!");
//       document.querySelector(".contact-form").reset();
//     } else {
//       throw new Error("Failed to send email. Please try again later.");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     alert("There was an error sending your message. Please try again later.");
//   }
// });

document.querySelector(".contact-form").addEventListener("submit", function (event) {
  event.preventDefault(); // Зупиняємо стандартну поведінку форми

  // Отримуємо значення з полів за допомогою правильних селекторів
  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const message = document.querySelector("#message").value.trim();

  // Виводимо дані для перевірки
  console.log("Name:", name || "No data");
  console.log("Email:", email || "No data");
  console.log("Message:", message || "No data");

  // Показуємо користувачу зібрані дані
  alert(`Collected Data:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
});
