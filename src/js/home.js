
    const modal = document.getElementById("modal");
    const span = document.getElementById("close");

    document.querySelector(".contact-form").onsubmit = function(event) {
        event.preventDefault(); 
        modal.style.display = "block";
        this.reset();
    };

    span.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

