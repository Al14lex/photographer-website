document.addEventListener("DOMContentLoaded", function () {
    function loadReviews() {
        let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
        let reviewContainer = document.querySelector(".swiper-wrapper");
        if (!reviewContainer) return;

        reviewContainer.innerHTML = ""; 

        reviews.forEach(review => {
            if (review.approved) {
                let slide = document.createElement("div");
                slide.classList.add("swiper-slide");
                slide.innerHTML = `<div class="review-content">
                    <h3 class="review-author">${review.name}</h3>
                    <p class="review-text">${review.text}</p>
                </div>`;
                reviewContainer.appendChild(slide);
            }
        });
    }
    loadReviews();
});
