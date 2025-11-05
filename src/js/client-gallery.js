const apiBaseUrl = "https://api.aleksandraphoto.com/api/clients";
// const apiBaseUrl = "http://localhost:5000/api/clients";
// const apiBaseUrl = `http://${window.location.hostname}:5000/api/clients`;


const clientSlug = decodeURIComponent(window.location.pathname.split("/").slice(-1)[0]).toLowerCase();
const heroSection = document.getElementById("hero");
const pinSection = document.getElementById("pin-section");
const gallerySection = document.getElementById("gallery-section");
const pinError = document.getElementById("pin-error");


window.checkPin = checkPin;
window.downloadAll = downloadAll;

// 📌 Fetch client data
async function fetchClientData() {
  document.body.classList.add("no-scroll");
  try {
    const response = await fetch(`${apiBaseUrl}/${clientSlug}`, {
      cache: "no-store"
    });

    if (!response.ok) throw new Error("Client not found");

    const data = await response.json();
    console.log("📦 Client data received:", data);

  const createdAt = new Date(data.createdAt);
const expirationDate = new Date(createdAt);
expirationDate.setMonth(createdAt.getMonth() + 3); 

function updateExpirationTimer() {
  const now = new Date();
  const diff = expirationDate - now;

  if (diff <= 0) {
    document.getElementById("expirationTimer").innerText = "Expired";
    return;
  }

  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  let display = "";

  if (totalDays >= 60) {
  display = "3 months";
} else if (totalDays >= 30) {
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;
  display = `${months} month${months === 1 ? "" : "s"}${days > 0 ? ` ${days} day${days === 1 ? "" : "s"}` : ""}`;
} else if (totalDays >= 15) {
  const days = totalDays % 30;
  display = `1 month ${days} day${days === 1 ? "" : "s"}`;
} else {
  display = `${totalDays} day${totalDays === 1 ? "" : "s"}`;
}

  document.getElementById("expirationTimer").innerText = display;
}

updateExpirationTimer();
    setInterval(updateExpirationTimer, 3600000); 
    
    document.getElementById("client-name").textContent = data.title;
    const heroImage = document.getElementById("hero-image");
    heroImage.src = data.heroImage;

    const tempImage = new Image();
    tempImage.src = data.heroImage;
    tempImage.onload = () => {
      pinSection.style.backgroundImage = `
        linear-gradient(rgba(191, 168, 146, 0.3), rgba(191, 168, 146, 0.3)),
        url(${data.heroImage})
      `;
      pinSection.style.backgroundSize = "cover";
      pinSection.style.backgroundPosition = "center";
      pinSection.style.backgroundRepeat = "no-repeat";

      setTimeout(() => {
        pinSection.style.opacity = "1";
      }, 50);
    };

    if (data.gallery.length > 0) {
      window.clientGallery = data.gallery;
      renderGallery();
    } else {
      document.getElementById("gallery").innerHTML = "<p>No photos available</p>";
    }
  } catch (error) {
    console.error("❌ Fetch client data error:", error);
    heroSection.innerHTML = "<h1>Client not found</h1>";
    document.body.innerHTML = `
      <div style="padding: 2rem; font-family: sans-serif; text-align: center;">
        <h1>Oops... Something went wrong 😞</h1>
        <p>We couldn't load the gallery right now. Please try again later.</p>
      </div>
    `;
  }
 
}

function checkPin() {
  const pinCode = document.getElementById("pin-code").value;

  if (!pinCode) {
    pinError.textContent = "Please enter the PIN code";
    return;
  }

  fetch(`${apiBaseUrl}/${clientSlug}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pinCode })
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 403) {
          pinError.textContent = "Wrong PIN code";
        }
        return;
      }

      pinSection.classList.add("fade-out");
      setTimeout(() => {
    pinSection.style.display = "none";
    observeVisibleImages();
}, 600);

      document.body.classList.remove("no-scroll");
    })
    .catch((error) => {
      console.error(error);
      pinError.textContent = "Network error. Try again later.";
    });
}

function observeVisibleImages() {
  const images = document.querySelectorAll(".gallery-photo");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "100px",
    threshold: 0.3
  });

  images.forEach(img => observer.observe(img));
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
    img.className = "gallery-photo";
    img.alt = "Client photo";
    img.src = photoUrl;

    imgWrapper.appendChild(img);
    gallery.appendChild(imgWrapper);
  });

  // ⏳ Гарантуємо, що DOM вже оновлений перед викликом enableModalView
  requestAnimationFrame(() => {
    enableModalView();
  });

  // Або:
  // setTimeout(() => enableModalView(), 0);
}



// function enableModalView() {
//   const modal = document.getElementById("photoModal");
//   const modalImg = document.getElementById("modalImage");
//   const closeBtn = document.querySelector(".close-modal");

//   document.querySelectorAll(".gallery-photo").forEach((img) => {
//     img.addEventListener("click", () => {
//       modalImg.src = img.src;
//       modal.classList.add("show");
//       modal.classList.remove("hide");
//     });
//   });

//   const closeModal = () => {
//     modal.classList.add("hide");
//     modal.classList.remove("show");
//     setTimeout(() => {
//       modalImg.src = ""; 
//     }, 400); 
//   };

//   closeBtn.onclick = closeModal;

//   window.addEventListener("keydown", (e) => {
//     if (e.key === "Escape") {
//       closeModal();
//     }
//   });

//   modal.onclick = (e) => {
//     if (e.target === modal) {
//       closeModal();
//     }
//   };
// }
let currentIndex = 0;

function enableModalView() {
  const modal = document.getElementById("photoModal");
  const sliderTrack = document.getElementById("sliderTrack");
  const closeBtn = document.querySelector(".close-modal");
  const galleryPhotos = document.querySelectorAll(".gallery-photo");
  let currentIndex = 0;

  function buildSlides() {
    sliderTrack.innerHTML = "";

    window.clientGallery.forEach((url) => {
      const slide = document.createElement("div");
      slide.className = "slider-image";

      const image = document.createElement("img");
      image.src = url;

      // 🧼 Гарантовано НЕ додаємо gallery-photo!
      // і явно скидаємо можливі стилі
      image.className = "";
      image.style.opacity = "1";
      image.style.visibility = "visible";
      image.style.filter = "none";
      image.style.transform = "none";
      image.style.display = "block";

      slide.appendChild(image);
      sliderTrack.appendChild(slide);
    });

    // 🔧 оновлюємо ширину слайдера
    sliderTrack.style.width = `${window.clientGallery.length * 100}vw`;
  }

  function openModal(index) {
    currentIndex = index;
    buildSlides();
    modal.classList.add("show");
    modal.classList.remove("hide");
    document.body.classList.add("no-scroll");
    sliderTrack.style.transform = `translateX(-${currentIndex * 100}vw)`;
  }

  function closeModal() {
    modal.classList.remove("show");
    modal.classList.add("hide");
    document.body.classList.remove("no-scroll");
  }

  function goTo(i) {
    currentIndex = i;
    sliderTrack.style.transform = `translateX(-${currentIndex * 100}vw)`;
  }

  // Стрілки клавіатури
  window.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("show")) return;
    if (e.key === "ArrowRight" && currentIndex < window.clientGallery.length - 1) goTo(currentIndex + 1);
    if (e.key === "ArrowLeft" && currentIndex > 0) goTo(currentIndex - 1);
    if (e.key === "Escape") closeModal();
  });

  // Ресайз
  window.addEventListener("resize", () => {
    if (modal.classList.contains("show")) goTo(currentIndex);
  });

  // Клік по фото
  galleryPhotos.forEach((img, index) => {
    img.onclick = () => openModal(index);
  });

  // Закриття
  closeBtn.onclick = closeModal;
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };

  // Swipe
  let startX = 0;
  sliderTrack.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  sliderTrack.addEventListener("touchmove", (e) => {
    e.preventDefault(); // блокує прокрутку сторінки під модалкою
  }, { passive: false });

  sliderTrack.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) < 50) return;
    if (diff < 0 && currentIndex < window.clientGallery.length - 1) currentIndex++;
    if (diff > 0 && currentIndex > 0) currentIndex--;
    goTo(currentIndex);
  });
}



async function downloadAll() {
  alert("📥 Downloading started! Don’t close the page until all photos are downloaded.");

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

  try {
    const zipUrl = `https://api.aleksandraphoto.com/api/download-zip/${clientSlug}`;
    // const zipUrl = `http://localhost:5000/api/download-zip/${clientSlug}`;


    setTimeout(() => {
      clearInterval(fakeProgressInterval);
      progressBar.style.width = "100%";
      window.location.href = zipUrl;
    }, 1500);

    setTimeout(() => {
      progressBar.style.display = "none";
      progressBar.style.width = "0%";
      alert("✅ All photos downloaded!");
    }, 6000); 
  } catch (error) {
    clearInterval(fakeProgressInterval);
    progressBar.style.backgroundColor = "red";
    alert("❌ Error downloading photos. Try again later.");
  }
}

fetchClientData();
