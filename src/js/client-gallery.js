const apiBaseUrl = "http://localhost:5000/api/clients"; 
const clientTitle = decodeURIComponent(window.location.pathname.split("/").slice(-1)[0]);
const heroSection = document.getElementById("hero");
const pinSection = document.getElementById("pin-section");
const gallerySection = document.getElementById("gallery-section");
const pinError = document.getElementById("pin-error");
window.checkPin = checkPin;
window.downloadAll = downloadAll;


// 📌 Fetch client data
async function fetchClientData() {
    try {
        console.log(`🔍 API запит: ${apiBaseUrl}/${clientTitle}/auth`);

        const response = await fetch(`${apiBaseUrl}/${clientTitle}`);
        if (!response.ok) throw new Error("Client not found");

        const data = await response.json();
        document.getElementById("client-name").textContent = data.title;
        document.getElementById("hero-image").src = data.heroImage;

        if (data.gallery.length > 0) {
            window.clientGallery = data.gallery;
        } else {
            document.getElementById("gallery").innerHTML = "<p>No photos available</p>";
        }
    } catch (error) {
        console.error(error);
        heroSection.innerHTML = "<h1>Client not found</h1>";
    }
}

// 📌 Verify PIN before accessing gallery
async function checkPin() {
    const pinCode = document.getElementById("pin-code").value;
    if (!pinCode) {
        pinError.textContent = "Please enter the PIN code";
        return;
    }

    try {
        console.log(`🔍 API запит: ${apiBaseUrl}/${clientTitle}/auth`);
        const response = await fetch(`${apiBaseUrl}/${clientTitle}/auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pinCode })
        });

        const result = await response.json();
        if (response.ok) {
            pinSection.style.display = "none";
            gallerySection.style.display = "block";
            renderGallery();
        } else {
            pinError.textContent = "Wrong PIN code";
        }
    } catch (error) {
        console.error(error);
    }
}

// 📌 Render gallery photos
function renderGallery() {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    if (!window.clientGallery || window.clientGallery.length === 0) {
        gallery.innerHTML = "<p>No photos available</p>";
        return;
    }

    // window.clientGallery.forEach(photoUrl => {
    //     const img = document.createElement("img");
    //     img.className = 'Lazy-client'
    //     img.src = photoUrl;
    //     img.alt = "Client photo";
    //     gallery.appendChild(img);
    // });
    window.clientGallery.forEach(photoUrl => {
        const img = document.createElement("img");
        img.className = 'lazy-client fade-in'; // Додаємо класи для анімації
        img.dataset.src = photoUrl; // Використовуємо data-src для лейзі-лоадінгу
        img.alt = "Client photo";
        gallery.appendChild(img);
    });
      // **Intersection Observer для лейзі-лоадінгу**
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src; // Завантажуємо зображення
                img.classList.add("visible"); // Додаємо клас для анімації
                observer.unobserve(img); // Відключаємо спостереження після завантаження
            }
        });
    }, { rootMargin: "0px 0px 50px 0px", threshold: 0.2 });

    // Додаємо всі фото в обсервер
    document.querySelectorAll(".lazy-client").forEach(img => {
        observer.observe(img);
    });
}

function downloadAll() {
    if (!window.clientGallery || window.clientGallery.length === 0) {
        alert("Немає фото для завантаження!");
        return;
    }

    window.clientGallery.forEach(photoUrl => {
        const link = document.createElement("a");
        link.href = photoUrl;
        link.download = photoUrl.split("/").pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    showReviewModal();
    alert("Завантаження розпочато!");

    
}

function showReviewModal() {
    const modal = document.getElementById("reviewModal");
    if (modal) {
        modal.style.display = "block";
    }
}

// Функція для закриття модального вікна
function closeReviewModal() {
    const modal = document.getElementById("reviewModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// Додаємо обробник подій для кнопки закриття
document.getElementById("closeReviewModal").addEventListener("click", closeReviewModal);


fetchClientData();
