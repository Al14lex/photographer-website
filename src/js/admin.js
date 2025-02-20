async function loadReviews() {
    const reviewList = document.getElementById("reviewList");
    const approvedList = document.getElementById("approvedReviewList");

    reviewList.innerHTML = "";
    approvedList.innerHTML = "";

    try {
        const response = await fetch("http://localhost:5000/reviews");
        const reviews = await response.json();

        if (reviews.length === 0) {
            reviewList.innerHTML = `<p class="no-reviews">No pending reviews.</p>`;
            approvedList.innerHTML = `<p class="no-reviews">No approved reviews.</p>`;
            return;
        }

        reviews.forEach((review) => {
            const reviewItem = document.createElement("div");
            reviewItem.classList.add("review-item");

            if (review.status === "pending") {
                reviewItem.innerHTML = `
                    <p><strong>${review.name}</strong></p>
                    <p>${review.message}</p>
                    <div class="review-buttons">
                        <button class="approve-btn" onclick="approveReview('${review._id}')">Approve</button>
                        <button class="reject-btn" onclick="rejectReview('${review._id}')">Reject</button>
                    </div>
                `;
                reviewList.appendChild(reviewItem);
            } else {
                reviewItem.innerHTML = `
                    <p><strong>Name: "${review.name}"</strong></p>
                    <p>Comment: "${review.message}"</p>
                    <div class="review-buttons">
                        <button class="delete-btn" onclick="deleteReview('${review._id}')">Delete</button>
                    </div>
                `;
                approvedList.appendChild(reviewItem);
            }
        });
    } catch (error) {
        console.error("Помилка завантаження відгуків:", error);
        reviewList.innerHTML = `<p class="error-message">Failed to load reviews.</p>`;
        approvedList.innerHTML = `<p class="error-message">Failed to load reviews.</p>`;
    }
}

async function approveReview(id) {
    try {
        await fetch(`http://localhost:5000/reviews/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "approved" })
        });
        loadReviews();
    } catch (error) {
        console.error("Помилка схвалення відгуку:", error);
    }
}

async function rejectReview(id) {
    try {
        await fetch(`http://localhost:5000/reviews/${id}`, {
            method: "DELETE"
        });
        loadReviews();
    } catch (error) {
        console.error("Помилка видалення відгуку:", error);
    }
}

async function deleteReview(id) {
    try {
        await fetch(`http://localhost:5000/reviews/${id}`, {
            method: "DELETE"
        });
        loadReviews();
    } catch (error) {
        console.error("Помилка видалення відгуку:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadReviews);
