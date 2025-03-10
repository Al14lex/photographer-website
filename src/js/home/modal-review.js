document.addEventListener("DOMContentLoaded", function () {
    const openModalBtns = document.getElementsByClassName("openReviewModal"); 
    const reviewModal = document.getElementById("reviewModal");
    const closeReviewModal = document.getElementById("closeReviewModal");
    const reviewForm = document.getElementById("reviewForm");
    const thankYouModal = document.getElementById("thankYouReviewModal");
    const closeThankYouModal = document.getElementById("closeThankYouReviewModal");

    function openModal(modal) {
        if (modal) {
            modal.style.display = "flex";
            setTimeout(() => {
                modal.classList.add("active");
            }, 10);
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove("active");
            setTimeout(() => {
                modal.style.display = "none";
            }, 500);
        }
    }

    Array.from(openModalBtns).forEach(button => {
        button.addEventListener("click", function () {
            openModal(reviewModal);
        });
    });

    if (closeReviewModal) {
        closeReviewModal.addEventListener("click", function () {
            closeModal(reviewModal);
        });
    }

    if (closeThankYouModal) {
        closeThankYouModal.addEventListener("click", function () {
            closeModal(thankYouModal);
        });
    }

    if (thankYouModal) {
        thankYouModal.addEventListener("click", function (event) {
            if (event.target === thankYouModal) {
                closeModal(thankYouModal);
            }
        });
    }

    if (reviewForm) {
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
                    console.error("Error sending review");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });
    }
});
