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
// async function checkPin() {
//     const pinCode = document.getElementById("pin-code").value;
//     if (!pinCode) {
//         pinError.textContent = "Please enter the PIN code";
//         return;
//     }

//     try {
//         console.log(`🔍 API запит: ${apiBaseUrl}/${clientTitle}/auth`);
//         const response = await fetch(`${apiBaseUrl}/${clientTitle}/auth`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ pinCode })
//         });

//         const result = await response.json();
//         if (response.ok) {
//             pinSection.style.display = "none";
//             gallerySection.style.display = "block";
//         } else {
//             pinError.textContent = "Wrong PIN code";
//         }
//     } catch (error) {
//         console.error(error);
//     }
// }
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

            // 🔥 **Запускаємо анімацію поступово**
            document.querySelectorAll(".lazy-client").forEach((img, index) => {
                setTimeout(() => {
                    img.style.transition = "opacity 1s ease-out, transform 1s ease-out, filter 1s ease-out";
                    img.style.visibility = "visible";
                    img.classList.add("visible");
                    img.style.opacity = "1";
                }, index * 100); // Кожне наступне фото затримується на 150ms
            });

        } else {
            pinError.textContent = "Wrong PIN code";
        }
    } catch (error) {
        console.error(error);
    }
}


// function renderGallery() {
//     const gallery = document.getElementById("gallery");
//     gallery.innerHTML = "";

//     if (!window.clientGallery || window.clientGallery.length === 0) {
//         gallery.innerHTML = "<p>No photos available</p>";
//         return;
//     }

//     window.clientGallery.forEach(photoUrl => {
//         const img = document.createElement("img");
//         img.className = "lazy-client";
//         img.dataset.src = photoUrl;
//         img.alt = "Client photo";
//         img.loading = "lazy";
//         img.style.opacity = "0";

//         gallery.appendChild(img);
//     });

//     const observer = new IntersectionObserver((entries, observer) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 const img = entry.target;
//                 const src = img.dataset.src;

//                 if (src) {
//                     setTimeout(() => {
//                         img.src = src;
//                         img.removeAttribute("data-src");

//                         img.onload = () => {
//                             img.classList.add("visible");
//                             img.style.opacity = "1"; 
//                         };
//                     }, 300); 
//                 }

//                 observer.unobserve(img);
//             }
//         });
//     }, { rootMargin: "150px", threshold: 0.1 });

//     document.querySelectorAll(".lazy-client").forEach(img => observer.observe(img));
// }
function renderGallery() {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    if (!window.clientGallery || window.clientGallery.length === 0) {
        console.error("❌ No images in clientGallery");
        gallery.innerHTML = "<p>No photos available</p>";
        return;
    }

    window.clientGallery.forEach((photoUrl, index) => {
        const imgWrapper = document.createElement("div");
        imgWrapper.className = "client-img-wrapper"; // Новий контейнер для фіксації розміру
        imgWrapper.style.overflow = "hidden";
        imgWrapper.style.height = "100%";
        imgWrapper.style.position = "relative";
        imgWrapper.style.removeProperty("min-height");
        imgWrapper.setAttribute("style", "overflow: hidden; height: 100%; position: relative; min-height: 0 !important;");



        const img = document.createElement("img");
        img.className = "lazy-client";
        img.alt = "Client photo";
        img.loading = "lazy";
        img.style.opacity = "0";
        img.style.visibility = "hidden"; 
        img.style.width = "100%"; 
        img.style.display = "block"; 

        imgWrapper.appendChild(img);
        gallery.appendChild(imgWrapper);

        console.log(`📥 Завантажуємо фото: ${photoUrl}`);

        const preloader = new Image();
        preloader.src = photoUrl;

        preloader.onload = () => {
            console.log(`✅ Фото завантажене: ${photoUrl}`);
            img.src = photoUrl;
            img.style.aspectRatio = `${preloader.width}/${preloader.height}`;
            img.style.visibility = "visible";
        };

        preloader.onerror = () => {
            console.error(`❌ Помилка завантаження зображення: ${photoUrl}`);
        };
    });

    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add("visible"); 
            }
        });
    }, { rootMargin: "100px", threshold: 0.2 });

    document.querySelectorAll(".lazy-client").forEach(img => observer.observe(img));
}

// async function downloadAll() {
//     if (!window.clientGallery || window.clientGallery.length === 0) {
//         alert("No photos to download!");
//         return;
//     }

//     alert("Downloading started! Press Ok to continue and dont close the window until all photos are downloaded.");

//     for (let index = 0; index < window.clientGallery.length; index++) {
//         const photoUrl = window.clientGallery[index];
//         const link = document.createElement("a");
//         link.href = photoUrl;
//         link.download = `photo_${index + 1}.jpg`;

//         try {
//             const response = await fetch(photoUrl);
//             if (!response.ok) throw new Error("Failed to fetch image");
            
//             const blob = await response.blob();
//             const objectUrl = URL.createObjectURL(blob);
//             link.href = objectUrl;

//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);

//             await new Promise(resolve => setTimeout(resolve, 500));  
//         } catch (error) {
//             console.error(`❌ Error downloading ${photoUrl}:`, error);
//             alert(`Error downloading photo ${index + 1}`);
//         }
//     }

//     alert("✅ All photos downloaded!");
// }
async function downloadAll() {
    alert("Downloading started! Press Ok to continue and dont close the window until all photos are downloaded.");
    const progressBar = document.getElementById("download-progress-bar");
    
    // Показуємо одразу
    progressBar.style.display = "block";
    progressBar.style.backgroundColor = "#f5f5f5";
    progressBar.style.width = "10%"; // стартова "візуалізація"

    // Імітація початкового завантаження (плавно збільшуємо, поки не прийде реальний прогрес)
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
        clearInterval(fakeProgressInterval); // зупиняємо фейковий приріст
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
