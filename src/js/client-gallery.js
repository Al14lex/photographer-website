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
enableModalView();
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

  // Відкриття модального вікна з потрібною позицією
  galleryPhotos.forEach((img, index) => {
    img.addEventListener("click", () => {
      currentIndex = index;
      renderSliderImages();
      modal.classList.remove("hide");
      modal.classList.add("show");
      sliderTrack.style.transform = `translateX(-${currentIndex * 100}vw)`;
    });
  });

  function renderSliderImages() {
    sliderTrack.innerHTML = "";
    window.clientGallery.forEach((url) => {
      const slide = document.createElement("div");
      slide.className = "slider-image";
      const image = document.createElement("img");
      image.src = url;
      image.alt = "Full photo";
      slide.appendChild(image);
      sliderTrack.appendChild(slide);
    });
  }

  const closeModal = () => {
    modal.classList.remove("show");
    modal.classList.add("hide");
    setTimeout(() => {
      sliderTrack.innerHTML = ""; // очистити DOM
    }, 400);
  };

  closeBtn.onclick = closeModal;
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") swipeTo(currentIndex - 1);
    if (e.key === "ArrowRight") swipeTo(currentIndex + 1);
  });

  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  // Свайп логіка
  let touchStartX = 0;
  let touchEndX = 0;

  sliderTrack.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  sliderTrack.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) < 50) return;

    if (diff < 0) {
      swipeTo(currentIndex + 1); // свайп вліво
    } else {
      swipeTo(currentIndex - 1); // свайп вправо
    }
  }

  function swipeTo(index) {
    if (index < 0 || index >= window.clientGallery.length) return;
    currentIndex = index;
    sliderTrack.style.transform = `translateX(-${currentIndex * 100}vw)`;
  }
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
