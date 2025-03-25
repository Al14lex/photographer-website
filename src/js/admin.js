import imageCompression from 'browser-image-compression';

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Admin page loaded");

  const isAdminPage = document.body.id === "admin";
  if (!isAdminPage) return;

  const clientForm = document.getElementById("clientForm");
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

  let heroFile = null;
  let galleryFiles = [];

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 4000,
      useWebWorker: true,
      initialQuality: 0.95,
    };
    try {
      const compressed = await imageCompression(file, options);
      return new File([compressed], file.name || "compressed.jpg", { type: file.type });
    } catch (err) {
      console.error("Compression error:", err);
      return file;
    }
  };

  const updateFileInput = () => {
    const dt = new DataTransfer();
    galleryFiles.forEach((file, idx) => {
      if (!(file instanceof File)) {
        file = new File([file], file.name || `compressed_${idx}.jpg`, { type: "image/jpeg" });
      }
      dt.items.add(file);
    });
    galleryInput.files = dt.files;
  };

  const renderGalleryPreview = () => {
    galleryPreview.innerHTML = "";
    galleryFiles.forEach((file, idx) => {
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
      removeBtn.onclick = () => {
        galleryFiles.splice(idx, 1);
        updateFileInput();
        renderGalleryPreview();
      };

      galleryPreview.appendChild(img);
      galleryPreview.appendChild(removeBtn);
    });
  };

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
    const compressed = await Promise.all(newFiles.map(compressImage));
    galleryFiles = [...galleryFiles, ...compressed];
    updateFileInput();
    renderGalleryPreview();
  });

  clientForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    progressBar.value = 0;
    progressBar.style.display = "block";

    const title = document.getElementById("title").value.trim().replace(/\.+$/, "");
    const pinCode = document.getElementById("pinCode").value.trim();

    if (!title || !heroFile || galleryFiles.length === 0 || !pinCode) {
      alert("Please fill in all fields!");
      return;
    }

    const slug = generateSlug(title);

    try {
      const uploadPromises = galleryFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("gallery", file);

        //   const res = await fetch("https://api.aleksandraphoto.com/upload", {
          const res = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error(`Upload failed for ${file.name}`);

        const data = await res.json();
        progressBar.value += 100 / galleryFiles.length;
        return data.galleryUrls[0];
      });

      const galleryUrls = await Promise.all(uploadPromises);

      const heroFormData = new FormData();
      heroFormData.append("heroImage", heroFile);
        // const heroRes = await fetch("https://api.aleksandraphoto.com/upload", {
          const heroRes = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: heroFormData,
      });
      if (!heroRes.ok) throw new Error("Hero image upload failed");

      const { heroImageUrl } = await heroRes.json();

      const clientData = { title,  slug, heroImage: heroImageUrl, gallery: galleryUrls, pinCode };
        // const createRes = await fetch("https://api.aleksandraphoto.com/api/clients", {
          const createRes = await fetch("http://localhost:5000/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });

      if (!createRes.ok) {
        console.error("❌ Error response:", await createRes.text());
        throw new Error("Client creation failed");
      }

      const result = await createRes.json();
        //   const clientUrl = `https://api.aleksandraphoto.com/gallery/${slug}`;
      const clientUrl = `http://localhost:5000/gallery/${slug}`;
        
      clientUrlInput.value = clientUrl;
      copyUrlBtn.style.display = "block";

      alert("Client successfully created!");

      setTimeout(() => {
        progressBar.value = 100;
        heroPreview.innerHTML = "";
        galleryPreview.innerHTML = "";
        galleryFiles = [];
      }, 500);
    } catch (err) {
      console.error("❌ Error:", err);
      alert("An error occurred while creating the client");
    } finally {
      progressBar.style.display = "none";
    }
  });

  copyUrlBtn.addEventListener("click", () => {
    clientUrlInput.select();
    navigator.clipboard.writeText(clientUrlInput.value)
        .then(() => alert("Link copied!"))
        .catch((err) => console.error("Error copying:", err));
       clientForm.reset()
  });
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
            // loadReviews();
        } catch (error) {
            console.error("❌ Review delete error:", error);
        }
    };
} else {
    console.log("It is not admin page, admin.js not implemented.");
}