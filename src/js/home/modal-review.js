document.addEventListener("DOMContentLoaded", function () {
    const openModalBtn = document.getElementById("openReviewModal");
    const reviewModal = document.getElementById("reviewModal");
    const closeReviewModal = document.getElementById("closeReviewModal");
    const reviewForm = document.getElementById("reviewForm");
    const thankYouModal = document.getElementById("thankYouReviewModal");
    const closeThankYouModal = document.getElementById("closeThankYouReviewModal");

    openModalBtn.addEventListener("click", function () {
        reviewModal.style.display = "block";
    });

    closeReviewModal.addEventListener("click", function () {
        reviewModal.style.display = "none";
    });

    closeThankYouModal.addEventListener("click", function () {
        thankYouModal.style.display = "none";
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
                reviewModal.style.display = "none";
                thankYouModal.style.display = "block";
                reviewForm.reset();
            } else {
                console.error("Помилка надсилання відгуку");
            }
        } catch (error) {
            console.error("Помилка:", error);
        }
    });
});
