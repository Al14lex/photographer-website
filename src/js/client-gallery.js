// const apiBaseUrl = "https://api.aleksandraphoto.com/api/clients";
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
        console.log(`🔍 API запит: ${apiBaseUrl}/${clientTitle}`);

        const response = await fetch(`${apiBaseUrl}/${clientTitle}`);
        if (!response.ok) throw new Error("Client not found");

        const data = await response.json();
        console.log("Отримані дані клієнта:", data);
        document.getElementById("client-name").textContent = data.title;
        document.getElementById("hero-image").src = data.heroImage;

        if (data.gallery.length > 0) {
            window.clientGallery = data.gallery;
            renderGallery();
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
        } else {
            pinError.textContent = "Wrong PIN code";
        }
    } catch (error) {
        console.error(error);
    }
}

function renderGallery() {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    if (!window.clientGallery || window.clientGallery.length === 0) {
        gallery.innerHTML = "<p>No photos available</p>";
        return;
    }

    window.clientGallery.forEach(photoUrl => {
        const img = document.createElement("img");
        img.className = "lazy-client";
        img.dataset.src = photoUrl;
        img.alt = "Client photo";
        img.loading = "lazy";
        img.style.opacity = "0";

        gallery.appendChild(img);
    });

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;

                if (src) {
                    setTimeout(() => {
                        img.src = src;
                        img.removeAttribute("data-src");

                        img.onload = () => {
                            img.classList.add("visible");
                            img.style.opacity = "1"; 
                        };
                    }, 300); 
                }

                observer.unobserve(img);
            }
        });
    }, { rootMargin: "150px", threshold: 0.1 });

    document.querySelectorAll(".lazy-client").forEach(img => observer.observe(img));
}

async function downloadAll() {
    if (!window.clientGallery || window.clientGallery.length === 0) {
        alert("No photos to download!");
        return;
    }

    alert("Downloading started! Press Ok to continue and dont close the window until all photos are downloaded.");

    for (let index = 0; index < window.clientGallery.length; index++) {
        const photoUrl = window.clientGallery[index];
        const link = document.createElement("a");
        link.href = photoUrl;
        link.download = `photo_${index + 1}.jpg`;

        try {
            const response = await fetch(photoUrl);
            if (!response.ok) throw new Error("Failed to fetch image");
            
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            link.href = objectUrl;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            await new Promise(resolve => setTimeout(resolve, 500));  
        } catch (error) {
            console.error(`❌ Error downloading ${photoUrl}:`, error);
            alert(`Error downloading photo ${index + 1}`);
        }
    }

    alert("✅ All photos downloaded!");
}

fetchClientData();
