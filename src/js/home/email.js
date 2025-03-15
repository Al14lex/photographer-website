
const modal = document.getElementById("modal");
const form = document.querySelector(".contact-form");

if (!form) {
    console.error("Form not found!");
} else {
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!validateForm()) {
            console.log("Form is invalid, submission stopped!");
            return;
        }

        const userName = document.getElementById("user_name").value;
        const userEmail = document.getElementById("user_email").value;
        const userPhone = document.getElementById("user_phone").value;
        const message = document.getElementById("message").value;

        console.log("Form submitted!");
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

            console.log("EmailJS Response:", response);

            if (response.status === 200) {
                showModal();
                form.reset();
                resetFieldStyles();
            } else {
                throw new Error("Failed to send email. Please try again later.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });

    const inputs = form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
        input.addEventListener("input", function () {
            validateSingleField(input); 
        });
    });
}

function validateForm() {
    let isValid = true;
    const inputs = form.querySelectorAll("input, textarea");

    clearValidationErrors();

    inputs.forEach((input) => {
        if (!validateSingleField(input)) {
            isValid = false;
        }
    });

    return isValid;
}
function validateSingleField(input) {
    const existingError = input.parentNode.querySelector(".error-message");

    if (existingError) {
        existingError.remove();
    }

    if (input.value.trim() === "") {
    } else if (input.type === "email" && !isValidEmail(input.value)) {
        showError(input, "Please enter a valid email address.");
        return false;
    } else if (input.type === "tel" && !isValidPhone(input.value)) {
        showError(input, "Please enter a valid phone number.");
        return false;
    }

    return true;
}

function showError(input, message) {
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("error-message");
    errorMessage.textContent = message;
    input.parentNode.appendChild(errorMessage);
}

function clearValidationErrors() {
    document.querySelectorAll(".error-message").forEach(error => error.remove());
}

function resetFieldStyles() {
    const inputs = document.querySelectorAll(".form-input, .form-textarea");
    inputs.forEach((input) => {
        input.classList.remove("filled");
        input.style.backgroundColor = "";
        input.style.boxShadow = "";
    });
}

function showModal() {
    if (!modal) {
        console.error("Modal not found!");
        return;
    }
    modal.style.display = "flex";
    setTimeout(() => {
        modal.classList.add("active");
    }, 10);

    setTimeout(() => {
        closeModal();
    }, 5000);
}

function closeModal() {
    modal.classList.remove("active");
    setTimeout(() => {
        modal.style.display = "none";
    }, 500);
}

if (modal) {
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    const re = /^[0-9\-\+\(\)\s]{7,20}$/;
    return re.test(phone);
}
