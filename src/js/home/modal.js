const modal = document.querySelector(".modal");
const form = document.querySelector(".contact-form");

form.onsubmit = function(event) {
    event.preventDefault();
    showModal();
    this.reset();
};

function showModal() {
    modal.style.display = "flex"; 
    setTimeout(() => {
        modal.style.opacity = "1";
    }, 10); 

    setTimeout(closeModal, 4000);
}

function closeModal() {
    modal.style.opacity = "0"; 
    setTimeout(() => {
        modal.style.display = "none"; 
    }, 500); 
}

modal.addEventListener("click", function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

modal.addEventListener("touchstart", function(event) {
    if (event.target === modal) {
        closeModal();
    }
});
