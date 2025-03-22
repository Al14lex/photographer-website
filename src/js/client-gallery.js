const apiBaseUrl = "https://api.aleksandraphoto.com/api/clients";
// const apiBaseUrl = "http://localhost:5000/api/clients";

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
        const response = await fetch(`${apiBaseUrl}/${clientTitle}`);
        if (!response.ok) throw new Error("Client not found");

        const data = await response.json();
        document.getElementById("client-name").textContent = data.title;
        const heroImage = document.getElementById("hero-image");
        heroImage.src = data.heroImage;

        // 🎯 Отримуємо посилання на модалку
        const pinModal = document.getElementById("pin-section");
        pinModal.style.opacity = "0"; // тимчасово приховуємо

        const tempImage = new Image();
        tempImage.src = data.heroImage;
        tempImage.onload = () => {
            pinModal.style.backgroundImage = `
                linear-gradient(rgba(191, 168, 146, 0.3), rgba(191, 168, 146, 0.3)),
                url(${data.heroImage})
            `;
            pinModal.style.backgroundSize = "cover";
            pinModal.style.backgroundPosition = "center";
            pinModal.style.backgroundRepeat = "no-repeat";

            // 💥 Показуємо після готовності фону
            setTimeout(() => {
                pinModal.style.opacity = "1";
            }, 50);
        };

        // Галерея
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

function observeVisibleImages() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      const img = entry.target;
      if (entry.isIntersecting) {
        img.classList.add("visible");
        obs.unobserve(img); // більше не спостерігаємо
      }
    });
  }, {
    rootMargin: "100px",
    threshold: 0.1,
  });

  document.querySelectorAll(".lazy-client").forEach(img => {
    observer.observe(img);
  });
}


async function checkPin() {
  const pinCode = document.getElementById("pin-code").value;
  if (!pinCode) {
    pinError.textContent = "Please enter the PIN code";
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/${clientTitle}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinCode })
    });

   if (response.ok) {
  pinSection.classList.add("fade-out");

  setTimeout(() => {
    pinSection.style.display = "none";

    // Активуємо observer тільки після закриття модалки
    observeVisibleImages();
  }, 500);
}
  } catch (error) {
    console.error(error);
  }
}
function makeImagesVisible() {
  const images = document.querySelectorAll(".lazy-client");
  images.forEach((img, index) => {
    setTimeout(() => {
      img.classList.add("visible");
    }, index * 100); // кожне фото затримка 100мс
  });
}

function renderGallery() {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    if (!window.clientGallery || window.clientGallery.length === 0) {
        gallery.innerHTML = "<p>No photos available</p>";
        return;
    }

    window.clientGallery.forEach((photoUrl) => {
        const imgWrapper = document.createElement("div");
        imgWrapper.className = "client-img-wrapper";

        const img = document.createElement("img");
        img.className = "lazy-client"; // клас для анімації
        img.alt = "Client photo";
        img.loading = "lazy";
        img.src = photoUrl;

        imgWrapper.appendChild(img);
        gallery.appendChild(imgWrapper);
    });
}


async function downloadAll() {
    alert("Downloading started! Press Ok to continue and dont close the window until all photos are downloaded.");
    const progressBar = document.getElementById("download-progress-bar");
    
    progressBar.style.display = "block";
    progressBar.style.backgroundColor = "#f5f5f5";
    progressBar.style.width = "10%"; 

    let fakeProgress = 10;
    const fakeProgressInterval = setInterval(() => {
        if (fakeProgress < 60) {
            fakeProgress += 1;
            progressBar.style.width = `${fakeProgress}%`;
        }
    }, 200);

    const xhr = new XMLHttpRequest();
    const zipUrl = `https://api.aleksandraphoto.com/api/download-zip/${clientTitle}`;
    // const zipUrl = `http://localhost:5000/api/download-zip/${clientTitle}`;

    xhr.open("GET", zipUrl, true);
    xhr.responseType = "blob";

    xhr.onprogress = function (event) {
        clearInterval(fakeProgressInterval); 
        if (event.lengthComputable) {
            const percent = (event.loaded / event.total) * 100;
            progressBar.style.width = `${percent}%`;
        }
    };

    xhr.onload = function () {
        clearInterval(fakeProgressInterval);
        if (xhr.status === 200) {
            const blob = new Blob([xhr.response], { type: "application/zip" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${clientTitle}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            progressBar.style.width = "100%";
            setTimeout(() => {
                progressBar.style.display = "none";
                progressBar.style.width = "0%";
            }, 2000);
            alert("✅ All photos downloaded!");
        } else {
            progressBar.style.backgroundColor = "red";
            alert("❌ Failed to download ZIP.");
        }
    };

    xhr.onerror = function () {
        clearInterval(fakeProgressInterval);
        progressBar.style.backgroundColor = "red";
        alert("❌ Error during ZIP download.");
    };

    xhr.send();
}



fetchClientData();
