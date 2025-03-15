document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Admin page loaded");

    const clientForm = document.getElementById("clientForm");
    const heroImageInput = document.getElementById("heroImage");
    const galleryInput = document.getElementById("gallery");
    const heroPreview = document.getElementById("heroPreview");
    const galleryPreview = document.getElementById("galleryPreview");
    const copyUrlBtn = document.getElementById("copyUrlBtn");

    if (clientForm) {
        setupClientForm();
    }

    function setupClientForm() {
        let heroFile = null;
        let galleryFiles = [];

        heroImageInput.addEventListener("change", function () {
            heroPreview.innerHTML = "";
            if (this.files.length > 0) {
                heroFile = this.files[0];
                const img = document.createElement("img");
                img.src = URL.createObjectURL(heroFile);
                img.style.maxWidth = "150px";
                img.style.marginTop = "10px";
                heroPreview.appendChild(img);
            }
        });

        galleryInput.addEventListener("change", function () {
            const newFiles = Array.from(this.files);
            galleryFiles = [...galleryFiles, ...newFiles];

            updateFileInput();
            renderGalleryPreview();
        });

        function updateFileInput() {
            const dataTransfer = new DataTransfer();
            galleryFiles.forEach(file => dataTransfer.items.add(file));
            galleryInput.files = dataTransfer.files;
        }

        function renderGalleryPreview() {
            galleryPreview.innerHTML = "";
            galleryFiles.forEach((file, index) => {
                const img = document.createElement("img");
                img.src = URL.createObjectURL(file);
                img.style.maxWidth = "100px";
                img.style.margin = "5px";
                img.style.borderRadius= "8px"

                const removeBtn = document.createElement("button");
                removeBtn.textContent = "x";
                removeBtn.style.padding = "7px"
                removeBtn.style.lineHeight = "0.5"
                removeBtn.style.margin = "0 5px 0 0";
                removeBtn.style.color = "red";
                removeBtn.onclick = function () {
                    galleryFiles.splice(index, 1);
                    updateFileInput();
                    renderGalleryPreview();
                };

                galleryPreview.appendChild(img);
                galleryPreview.appendChild(removeBtn);
            });
        }

        clientForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const title = document.getElementById("title").value.trim();
            const pinCode = document.getElementById("pinCode").value.trim();

            if (!title || !heroFile || galleryFiles.length === 0 || !pinCode) {
                alert("Please fill in all fields!");
                return;
            }

            try {
                const formData = new FormData();
                formData.append("heroImage", heroFile);
                galleryFiles.forEach(file => formData.append("gallery", file));

                const uploadResponse = await fetch("https://api.aleksandraphoto.com/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!uploadResponse.ok) throw new Error("Error uploading photos");
                const uploadData = await uploadResponse.json();

                const clientData = {
                    title,
                    heroImage: uploadData.heroImageUrl,
                    gallery: uploadData.galleryUrls,
                    pinCode,
                };

                const createClientResponse = await fetch("https://api.aleksandraphoto.com/api/clients", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(clientData),
                });

                const result = await createClientResponse.json();
                console.log("Received client URL:", result.clientUrl);

                if (createClientResponse.ok) {
                    alert("Client successfully created!");

                    setTimeout(() => {
                        const clientUrlInput = document.getElementById("clientUrl");
                        if (clientUrlInput) {
                            clientUrlInput.value = result.clientUrl;
                        } else {
                            console.error("clientUrl field not found in DOM!");
                        }
                    }, 100);

                    copyUrlBtn.style.display = "block";

                    setTimeout(() => {
                        clientForm.reset();
                        document.getElementById("clientUrl").value = result.clientUrl; 
                    }, 500);

                    heroPreview.innerHTML = "";
                    galleryPreview.innerHTML = "";
                    galleryFiles = [];
                } else {
                    alert("Помилка: " + result.message);
                }
            } catch (error) {
                console.error("Error creating client:", error);
                alert("An error occurred while creating the client");
            }
        });

        copyUrlBtn.addEventListener("click", function () {
            try {
                const clientUrlInput = document.getElementById("clientUrl");
                clientUrlInput.select();
                navigator.clipboard.writeText(clientUrlInput.value)
                    .then(() => alert("Link copied!"))
                    .catch(err => console.error("Error copying:", err));
            } catch (err) {
                console.error("Error copying:", err);
            }
        });
    }
});


//=================================== REVIEWS ==============================

if (document.getElementById("reviewList") && document.getElementById("approvedReviewList")) {

    document.addEventListener("DOMContentLoaded", function () {

        const reviewList = document.getElementById("reviewList");
        const approvedList = document.getElementById("approvedReviewList");

        if (!reviewList || !approvedList) {
            console.error("❌ Error: reviewList or approvedReviewList not found!");
            return;
        }

        console.log("✅ Elements found, loading reviews...");
        loadReviews();
    });

    async function loadReviews() {
        const reviewList = document.getElementById("reviewList");
        const approvedList = document.getElementById("approvedReviewList");

        if (!reviewList || !approvedList) {
            console.error("❌ Error: reviewList or approvedReviewList not found!");
            return;
        }

        reviewList.innerHTML = "";
        approvedList.innerHTML = "";

        try {
            const response = await fetch("https://api.aleksandraphoto.com/reviews");
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
            console.error("❌ Loading reviews error:", error);
            reviewList.innerHTML = `<p class="error-message">Failed to load reviews.</p>`;
            approvedList.innerHTML = `<p class="error-message">Failed to load reviews.</p>`;
        }
    }

    window.approveReview = async function (id) {
        try {
            await fetch(`https://api.aleksandraphoto.com/reviews/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "approved" })
            });
            loadReviews();
        } catch (error) {
            console.error("❌ Review approval error:", error);
        }
    };

    window.rejectReview = async function (id) {
        try {
            await fetch(`https://api.aleksandraphoto.com/reviews/${id}`, {
                method: "DELETE"
            });
            loadReviews();
        } catch (error) {
            console.error("❌ Review delete error:", error);
        }
    };

    window.deleteReview = async function (id) {
        try {
            await fetch(`https://api.aleksandraphoto.com/reviews/${id}`, {
                method: "DELETE"
            });
            loadReviews();
        } catch (error) {
            console.error("❌ Review delete error:", error);
        }
    };
} else {
    console.log("It is not admin page, admin.js not implemented.");
}