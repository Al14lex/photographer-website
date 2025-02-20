document.addEventListener("DOMContentLoaded", async function () {
    async function loadReviews() {
        let reviewContainer = document.querySelector(".swiper-wrapper");
        if (!reviewContainer) return;

        try {
            const response = await fetch("http://localhost:5000/reviews/approved");
            const reviews = await response.json();

            reviewContainer.innerHTML = "";

            if (reviews.length === 0) {
                reviewContainer.innerHTML = `<p class="no-reviews">No approved reviews yet.</p>`;
                return;
            }

            reviews.forEach(review => {
                let slide = document.createElement("div");
                slide.classList.add("swiper-slide");
                slide.innerHTML = `<div class="review-content">
                    <h3 class="review-author">${review.name}</h3>
                    <p class="review-text">${review.message}</p>
                </div>`;
                reviewContainer.appendChild(slide);
            });
        } catch (error) {
            console.error("Помилка завантаження відгуків:", error);
            reviewContainer.innerHTML = `<p class="error-message">Failed to load reviews.</p>`;
        }
    }

    loadReviews();
});
