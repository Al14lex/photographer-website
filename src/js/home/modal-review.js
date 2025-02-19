document.addEventListener("DOMContentLoaded", function () {
    const openModalBtn = document.getElementById("openReviewModal");
    const reviewModal = document.getElementById("reviewModal");
    const closeReviewModal = document.getElementById("closeReviewModal");
    const reviewForm = document.getElementById("reviewForm");
    const thankYouModal = document.getElementById("thankYouReviewModal");
    const closeThankYouModal = document.getElementById("closeThankYouReviewModal");
    const reviewContainer = document.querySelector(".swiper-wrapper");
    
    // Відкриття модального вікна
    openModalBtn.addEventListener("click", function () {
        reviewModal.style.display = "block";
    });

    // Закриття модального вікна
    closeReviewModal.addEventListener("click", function () {
        reviewModal.style.display = "none";
    });

    // Закриття вікна "Дякую"
    closeThankYouModal.addEventListener("click", function () {
        thankYouModal.style.display = "none";
    });

    // Збереження відгуку в localStorage
    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("reviewName").value;
        const text = document.getElementById("reviewText").value;
        
        let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
        reviews.push({ name, text, approved: false });
        localStorage.setItem("reviews", JSON.stringify(reviews));
        
        reviewModal.style.display = "none";
        thankYouModal.style.display = "block";
        reviewForm.reset();
    });

    // Функція рендеру схвалених відгуків
    function renderReviews() {
        reviewContainer.innerHTML = "";
        let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
        reviews.forEach(review => {
            if (review.approved) {
                const reviewSlide = document.createElement("div");
                reviewSlide.classList.add("swiper-slide");
                reviewSlide.innerHTML = `
                    <div class="review-content">
                        <h3 class="review-author">${review.name}</h3>
                        <p class="review-text">${review.text}</p>
                    </div>
                `;
                reviewContainer.appendChild(reviewSlide);
            }
        });
    }

    renderReviews(); // Завантаження схвалених відгуків

    // Адмін-модерація у консолі браузера
    window.showPendingReviews = function () {
        let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
        console.table(reviews);
    }

    window.approveReview = function (index) {
        let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
        if (reviews[index]) {
            reviews[index].approved = true;
            localStorage.setItem("reviews", JSON.stringify(reviews));
            renderReviews();
        }
    }

    window.rejectReview = function (index) {
        let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
        reviews.splice(index, 1);
        localStorage.setItem("reviews", JSON.stringify(reviews));
    }

    console.log("Використовуйте showPendingReviews() у консолі для перегляду відгуків.");
    console.log("Використовуйте approveReview(index) для схвалення та rejectReview(index) для видалення.");
});
