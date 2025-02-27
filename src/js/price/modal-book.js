
document.addEventListener("DOMContentLoaded", function () {
    const modalBook = document.getElementById("bookingModal");
    const closeModalBtn = document.querySelector(".booking-close");
    const priceButtons = document.querySelectorAll(".price-button");
    const shootingTypeElement = document.getElementById("shootingType");
    const modalThanks = document.getElementById("modal-thanks"); 
    const bookingForm = document.querySelector(".contact-form"); 
    const inputs = document.querySelectorAll(".form-input, .form-textarea");

    let selectedShootingType = ""; 

    function checkInputFilled(input) {
        if (input.value.trim() !== "") {
            input.classList.add("filled");
            input.style.backgroundColor = "rgb(199, 175, 152)";
            input.style.boxShadow = "0 0 0px 1000px rgb(199, 175, 152) inset"; 
        } else {
            input.classList.remove("filled");
            input.style.backgroundColor = "";
            input.style.boxShadow = "";
        }
    }

    inputs.forEach((input) => {
        checkInputFilled(input);
        input.addEventListener("input", () => checkInputFilled(input));
        input.addEventListener("change", () => checkInputFilled(input));
    });

    setTimeout(() => {
        inputs.forEach((input) => {
            checkInputFilled(input);
            input.dispatchEvent(new Event("input"));
        });
    }, 300);

    function openModal(modal) {
        modal.style.display = "flex";
        setTimeout(() => {
            modal.classList.add("show");
        }, 10);
    }

    function closeModal(modal) {
        modal.classList.remove("show");
        setTimeout(() => {
            modal.style.display = "none";
        }, 1000); 
    }

    priceButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const priceItem = this.closest(".price-item");
            selectedShootingType = priceItem.querySelector(".price-title").textContent; 
            shootingTypeElement.textContent = selectedShootingType; 

            openModal(modalBook);
        });
    });

    closeModalBtn.addEventListener("click", function () {
        closeModal(modalBook);
    });

    window.addEventListener("click", function (event) {
        if (event.target === modalBook) {
            closeModal(modalBook);
        }
    });

    bookingForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const userName = document.getElementById("user_name").value;
        const userEmail = document.getElementById("user_email").value;
        const userPhone = document.getElementById("user_phone").value;
        const message = document.getElementById("message").value;

        console.log("📩 Form submitted!");
        console.log("Shooting Type:", selectedShootingType); 
        console.log("User Name:", userName);
        console.log("User Email:", userEmail);
        console.log("User Phone:", userPhone);
        console.log("Message:", message);

        try {
            const response = await emailjs.send("service_i8bcmth", "template_hkl0yzr", {
                shooting_type: selectedShootingType, 
                user_name: userName,
                user_email: userEmail,
                user_phone: userPhone,
                message: message,
            });

            console.log("✅ EmailJS Response:", response);

            if (response.status === 200) {
                bookingForm.reset();
                resetFieldStyles();
                showModalThankYou();

                setTimeout(() => {
                    closeModal(modalBook);
                }, 800);
            } else {
                throw new Error("❌ Failed to send email. Please try again later.");
            }
        } catch (error) {
            console.error("❌ Error:", error);
        }
    });

    function resetFieldStyles() {
        inputs.forEach((input) => {
            input.classList.remove("filled");
            input.style.backgroundColor = "";
            input.style.boxShadow = "";
        });
    }

    function showModalThankYou() {
        if (modalThanks) {
            console.log("✅ Показуємо модальне вікно подяки");

            modalThanks.style.display = "flex";
            setTimeout(() => {
                modalThanks.classList.add("active");
            }, 50);

            setTimeout(() => {
                closeModalThankYou();
            }, 4000);
        } else {
            console.error("❌ Помилка: modalThanks не знайдено");
        }
    }

    function closeModalThankYou() {
        if (modalThanks) {
            modalThanks.classList.remove("active");

            setTimeout(() => {
                modalThanks.style.display = "none"; 
            }, 600); 
        }
    }

    if (modalThanks) {
        modalThanks.addEventListener("click", function (event) {
            if (event.target === modalThanks) {
                closeModalThankYou();
            }
        });
    }
});
