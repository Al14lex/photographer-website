document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll(".form-input");

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
});
