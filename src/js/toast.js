document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll(".contact-form, .review-contact-form");

    forms.forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); 
            
            let isValid = true;
            const inputs = form.querySelectorAll("input, textarea");

            inputs.forEach(input => {
    if (input.value.trim() === "") {
        showToast(`The field "${input.placeholder}" cannot be empty.`);
        isValid = false;
    } else if (input.type === "email" && !isValidEmail(input.value)) {
        showToast("Please enter a valid email address.");
        isValid = false;
    } else if (input.type === "tel" && !isValidPhone(input.value)) {
        showToast("Please enter a valid phone number.");
        isValid = false;
    }
});


            if (isValid) {
                form.submit(); 
            }
        });
    });

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function isValidPhone(phone) {
        const re = /^[0-9\-\+\(\)\s]{7,20}$/; 
        return re.test(phone);
    }

    function showToast(message) {
        const toastContainer = document.getElementById("toastContainer");
        const toast = document.createElement("div");
        toast.classList.add("toast");
        toast.textContent = message;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
});
