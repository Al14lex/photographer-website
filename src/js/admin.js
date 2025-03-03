
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Admin page loaded");

    const clientForm = document.getElementById("clientForm");
    const heroImageInput = document.getElementById("heroImage");
    const galleryInput = document.getElementById("gallery");
    const heroPreview = document.getElementById("heroPreview");
    const galleryPreview = document.getElementById("galleryPreview");

    if (clientForm) {
        console.log("✅ Елементи для клієнтів знайдено, додаємо обробники...");
        setupClientForm();
    }

    function setupClientForm() {
        let heroFile = null;
        let galleryFiles = [];

        // 📌 Показує прев’ю головного фото
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

        // 📌 Додаємо нові фото до галереї, не втрачаючи попередні
        galleryInput.addEventListener("change", function () {
            const newFiles = Array.from(this.files);
            galleryFiles = [...galleryFiles, ...newFiles]; // Об'єднуємо масиви

            updateFileInput(); // Оновлюємо input файлів
            renderGalleryPreview(); // Перемальовуємо прев’ю
        });

        // 📌 Оновлення input після змін у масиві файлів
        function updateFileInput() {
            const dataTransfer = new DataTransfer();
            galleryFiles.forEach(file => dataTransfer.items.add(file));
            galleryInput.files = dataTransfer.files;
        }

        // 📌 Оновлення відображення галереї
        function renderGalleryPreview() {
            galleryPreview.innerHTML = "";
            galleryFiles.forEach((file, index) => {
                const img = document.createElement("img");
                img.src = URL.createObjectURL(file);
                img.style.maxWidth = "100px";
                img.style.margin = "5px";

                const removeBtn = document.createElement("button");
                removeBtn.textContent = "❌";
                removeBtn.style.marginLeft = "5px";
                removeBtn.onclick = function () {
                    galleryFiles.splice(index, 1);
                    updateFileInput();
                    renderGalleryPreview();
                };

                galleryPreview.appendChild(img);
                galleryPreview.appendChild(removeBtn);
            });
        }

        // 📌 Відправлення форми клієнта
        clientForm.addEventListener("submit", async function (event) {
            event.preventDefault(); 

            const title = document.getElementById("title").value.trim();
            const pinCode = document.getElementById("pinCode").value.trim();

            if (!title || !heroFile || galleryFiles.length === 0 || !pinCode) {
                alert("Будь ласка, заповніть усі поля!");
                return;
            }

            try {
                // 📌 Завантажуємо фото на сервер
                const formData = new FormData();
                formData.append("heroImage", heroFile);
                galleryFiles.forEach(file => formData.append("gallery", file));

                const uploadResponse = await fetch("http://localhost:5000/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!uploadResponse.ok) throw new Error("Помилка завантаження фото");
                const uploadData = await uploadResponse.json();

                // 📌 Відправляємо дані клієнта в базу
                const clientData = {
                    title,
                    heroImage: uploadData.heroImageUrl, 
                    gallery: uploadData.galleryUrls, 
                    pinCode,
                };

                console.log("DEBUG: Дані перед відправкою в бекенд:", clientData);
                const createClientResponse = await fetch("http://localhost:5000/api/clients", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(clientData),
                });

                const result = await createClientResponse.json();
                if (createClientResponse.ok) {
                    alert("Клієнт успішно створений!");
                    clientForm.reset();
                    heroPreview.innerHTML = "";
                    galleryPreview.innerHTML = "";
                    galleryFiles = []; // Очищаємо масив файлів
                } else {
                    alert("Помилка: " + result.message);
                }
            } catch (error) {
                console.error("❌ Помилка:", error);
                alert("Сталася помилка при створенні клієнта.");
            }
        });
    }
});


//=================================== REVIEWS ==============================
    async function loadReviews() {
        reviewList.innerHTML = "";
        approvedList.innerHTML = "";

        try {
            const response = await fetch("http://localhost:5001/reviews");
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
            console.error("❌ Помилка завантаження відгуків:", error);
            reviewList.innerHTML = `<p class="error-message">Failed to load reviews.</p>`;
            approvedList.innerHTML = `<p class="error-message">Failed to load reviews.</p>`;
        }
    }

    window.approveReview = async function (id) {
        try {
            await fetch(`http://localhost:5001/reviews/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "approved" })
            });
            loadReviews();
        } catch (error) {
            console.error("❌ Помилка схвалення відгуку:", error);
        }
    };

    window.rejectReview = async function (id) {
        try {
            await fetch(`http://localhost:5001/reviews/${id}`, {
                method: "DELETE"
            });
            loadReviews();
        } catch (error) {
            console.error("❌ Помилка видалення відгуку:", error);
        }
    };
        window.deleteReview = async function (id) {
        try {
            await fetch(`http://localhost:5001/reviews/${id}`, {
                method: "DELETE"
            });
            loadReviews();
        } catch (error) {
            console.error("❌ Помилка видалення відгуку:", error);
        }
    };
