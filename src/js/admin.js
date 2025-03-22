
import imageCompression from 'browser-image-compression';

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Admin page loaded");

    const isAdminPage = document.body.id === 'admin';
    if (!isAdminPage) {
        console.log("❌ Not admin page, script won't run.");
        return;
    }

    const clientForm = document.getElementById("clientForm");
    if (!clientForm) {
        console.error("❌ Error: clientForm element not found!");
        return;
    }
    const heroImageInput = document.getElementById("heroImage");
    const galleryInput = document.getElementById("gallery");
    const heroPreview = document.getElementById("heroPreview");
    const galleryPreview = document.getElementById("galleryPreview");
    const copyUrlBtn = document.getElementById("copyUrlBtn");
    const clientUrlInput = document.getElementById("clientUrl");

    const progressBar = document.createElement("progress");
    progressBar.style.width = "100%";
    progressBar.max = 100;
    progressBar.value = 0;
    clientForm.appendChild(progressBar);

    if (clientForm) {
        setupClientForm();
    }

    async function compressImage(file) {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 4000,
            useWebWorker: true,
            initialQuality: 0.95
        };

        try {
            const compressedBlob = await imageCompression(file, options);
            if (compressedBlob.size === 0) {
                console.error("❌ Compression failed: Blob size is 0");
                return file;
            }
            return new File([compressedBlob], file.name || "compressed.jpg", { type: file.type });
        } catch (error) {
            console.error("Image compression error:", error);
            return file;
        }
    }

    function setupClientForm() {
        let heroFile = null;
        let galleryFiles = [];

        heroImageInput.addEventListener("change", async function () {
            heroPreview.innerHTML = "";
            if (this.files.length > 0) {
                heroFile = await compressImage(this.files[0]);
                const img = document.createElement("img");
                img.src = URL.createObjectURL(heroFile);
                img.style.maxWidth = "150px";
                img.style.marginTop = "10px";
                heroPreview.appendChild(img);
            }
        });

        galleryInput.addEventListener("change", async function () {
            const newFiles = Array.from(this.files);
            const compressedFiles = await Promise.all(newFiles.map(file => compressImage(file)));
            galleryFiles = [...galleryFiles, ...compressedFiles];
            updateFileInput();
            renderGalleryPreview();
        });

        function updateFileInput() {
            const dataTransfer = new DataTransfer();
            galleryFiles.forEach((file, index) => {
                if (!(file instanceof File)) {
                    console.warn(`⚠️ Converting Blob to File: ${file.name}`);
                    file = new File([file], file.name || `compressed_${index}.jpg`, { type: "image/jpeg" });
                }
                dataTransfer.items.add(file);
            });
            galleryInput.files = dataTransfer.files;
        }

        function renderGalleryPreview() {
            galleryPreview.innerHTML = "";
            galleryFiles.forEach((file, index) => {
                const img = document.createElement("img");
                img.src = URL.createObjectURL(file);
                img.style.maxWidth = "70px";
                img.style.margin = "5px";
                img.style.borderRadius = "8px";

                const removeBtn = document.createElement("button");
                removeBtn.textContent = "x";
                removeBtn.style.padding = "7px";
                removeBtn.style.lineHeight = "0.5";
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
            progressBar.value = 0;
            progressBar.style.display = "block";

            const title = document.getElementById("title").value.trim();
            const pinCode = document.getElementById("pinCode").value.trim();

            if (!title || !heroFile || galleryFiles.length === 0 || !pinCode) {
                alert("Please fill in all fields!");
                return;
            }

            try {
                console.log("🟢 Починаємо завантаження...");
                
                const uploadPromises = galleryFiles.map(async (file, index) => {
                    const formData = new FormData();
                    formData.append("gallery", file);

                    const response = await fetch("https://api.aleksandraphoto.com/upload", {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) throw new Error(`Upload failed for ${file.name}`);

                    const uploadData = await response.json();
                    progressBar.value += (100 / galleryFiles.length);
                    return uploadData.galleryUrls[0];
                });

                const uploadedGalleryUrls = await Promise.all(uploadPromises);

                const heroFormData = new FormData();
                heroFormData.append("heroImage", heroFile);
                const heroResponse = await fetch("https://api.aleksandraphoto.com/upload", {
                    method: "POST",
                    body: heroFormData,
                });

                if (!heroResponse.ok) throw new Error("Hero image upload failed");

                const heroUploadData = await heroResponse.json();

                const clientData = {
                    title,
                    heroImage: heroUploadData.heroImageUrl,
                    gallery: uploadedGalleryUrls,
                    pinCode,
                };

                const createClientResponse = await fetch("https://api.aleksandraphoto.com/api/clients", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(clientData),
                });

                if (!createClientResponse.ok) {
                    console.error("❌ Error response:", await createClientResponse.text());
                    throw new Error("Client creation failed");
                }

                const result = await createClientResponse.json();
                console.log("✅ Received client URL:", result.clientUrl);
                clientUrlInput.value = result.clientUrl;
                copyUrlBtn.style.display = "block";

                alert("Client successfully created!");

                setTimeout(() => {
                    progressBar.value = 100;
                    heroPreview.innerHTML = "";
                    galleryPreview.innerHTML = "";
                    galleryFiles = [];
                }, 500);

            } catch (error) {
                console.error("❌ Error:", error);
                alert("An error occurred while creating the client");
            } finally {
                progressBar.style.display = "none";
            }
        });

        copyUrlBtn.addEventListener("click", function () {
            clientUrlInput.select();
            navigator.clipboard.writeText(clientUrlInput.value)
                .then(() => alert("Link copied!"))
                .catch(err => console.error("Error copying:", err));
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