
const modalBook = document.getElementById("bookingModal");
const closeModalBtn = document.querySelector(".booking-close");
const priceButtons = document.querySelectorAll(".price-button");
const shootingTypeElement = document.getElementById("shootingType");
const modalThanks = document.getElementById("modal-thanks"); 
const bookingForm = document.querySelector(".contact-form"); 


priceButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const priceItem = this.closest(".price-item");
    const shootingType = priceItem.querySelector(".price-title").textContent;

    shootingTypeElement.textContent = shootingType;

    // Відкриваємо модальне вікно бронювання плавно
    modalBook.classList.add("show");
  });
});

// 🔹 Закриття модального вікна бронювання при натисканні "×"
closeModalBtn.addEventListener("click", function () {
  closeModalBooking();
});

// 🔹 Закриття вікна бронювання при кліку поза ним
window.addEventListener("click", function (event) {
  if (event.target === modalBook) {
    closeModalBooking();
  }
});

// 🔹 Закриття модального вікна бронювання з плавною анімацією
function closeModalBooking() {
  modalBook.classList.remove("show");
}

// 🔹 Обробка форми бронювання
bookingForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const userName = document.getElementById("user_name").value;
  const userEmail = document.getElementById("user_email").value;
  const userPhone = document.getElementById("user_phone").value;
  const message = document.getElementById("message").value;

  console.log("📩 Form submitted!");
  console.log("User Name:", userName);
  console.log("User Email:", userEmail);
  console.log("User Phone:", userPhone);
  console.log("Message:", message);

  try {
    const response = await emailjs.send("service_i8bcmth", "template_1fpbo2w", {
      user_name: userName,
      user_email: userEmail,
      user_phone: userPhone,
      message: message,
    });

    console.log("✅ EmailJS Response:", response);

    if (response.status === 200) {
      bookingForm.reset();
      showModalThankYou();
    
  
      setTimeout(() => {
        modalBook.classList.remove("show");
      }, 800); 
    } else {
      throw new Error("❌ Failed to send email. Please try again later.");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
});

// 🔹 Функція показу модального вікна подяки
function showModalThankYou() {
  if (modalThanks) {
    console.log("✅ Показуємо модальне вікно подяки");

    // Робимо його видимим поступово
    modalThanks.style.display = "flex";
    setTimeout(() => {
      modalThanks.classList.add("active");
    }, 50);

    // Автоматично закриваємо через 4 секунди
    setTimeout(() => {
      closeModalThankYou();
    }, 4000);
  } else {
    console.error("❌ Помилка: modalThanks не знайдено");
  }
}

// 🔹 Функція закриття модального вікна подяки
function closeModalThankYou() {
  if (modalThanks) {
    modalThanks.classList.remove("active");

    setTimeout(() => {
      modalThanks.style.display = "none"; // Приховуємо після анімації
    }, 500);
  }
}

// 🔹 Закриття модального вікна подяки при кліку поза ним
if (modalThanks) {
  modalThanks.addEventListener("click", function (event) {
    if (event.target === modalThanks) {
      closeModalThankYou();
    }
  });
}
