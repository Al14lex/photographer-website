document.addEventListener("DOMContentLoaded", function () {
    const openModalBtn = document.getElementById("openReviewModal");
    const reviewModal = document.getElementById("reviewModal");
    const closeReviewModal = document.getElementById("closeReviewModal");
    const reviewForm = document.getElementById("reviewForm");
    const thankYouModal = document.getElementById("thankYouReviewModal");
    const closeThankYouModal = document.getElementById("closeThankYouReviewModal");

    function openModal(modal) {
        modal.style.display = "flex";
        setTimeout(() => {
            modal.classList.add("active");
        }, 10);
    }

    function closeModal(modal) {
        modal.classList.remove("active");
        setTimeout(() => {
            modal.style.display = "none";
        }, 500); 
    }

    openModalBtn.addEventListener("click", function () {
        openModal(reviewModal);
    });

    closeReviewModal.addEventListener("click", function () {
        closeModal(reviewModal);
    });

    closeThankYouModal.addEventListener("click", function () {
        closeModal(thankYouModal);
    });

    thankYouModal.addEventListener("click", function (event) {
        if (event.target === thankYouModal) {
            closeModal(thankYouModal);
        }
    });

    reviewForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const name = document.getElementById("reviewName").value;
        const message = document.getElementById("reviewText").value;

        try {
            const response = await fetch("http://localhost:5000/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, message })
            });

            if (response.ok) {

                setTimeout(() => {
                    openModal(thankYouModal);
                }, 300);

                setTimeout(() => {
                    closeModal(reviewModal);
                }, 1000);

                reviewForm.reset();

                setTimeout(() => closeModal(thankYouModal), 4000);
            } else {
                console.error("Помилка надсилання відгуку");
            }
        } catch (error) {
            console.error("Помилка:", error);
        }
    });
});
