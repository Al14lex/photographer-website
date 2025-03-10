
async function loadApprovedReviews() {
    try {
        const response = await fetch("http://localhost:5000/reviews/approved");
        const reviews = await response.json();

        
        const swiperWrapper = document.getElementById("approvedReviewsSwiper");

        if (!swiperWrapper) {
            return;
        }

        swiperWrapper.innerHTML = ""; 
        if (reviews.length === 0) {
            swiperWrapper.innerHTML = `<p class="no-reviews">No approved reviews</p>`;
            return;
        }

        reviews.forEach(review => {
            const reviewSlide = document.createElement("div");
            reviewSlide.classList.add("swiper-slide");
            reviewSlide.innerHTML = `
                <div class="review-content">
                    <h3 class="review-author">${review.name}</h3>
                    <p class="review-text">${review.message}</p>
                </div>
            `;
            swiperWrapper.appendChild(reviewSlide);
        });

        if (typeof swiper !== "undefined") {
            swiper.update();
        }

    } catch (error) {
        console.error("Error download approved reviews", error);
    }
}

document.addEventListener("DOMContentLoaded", loadApprovedReviews);
