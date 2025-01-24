

document.addEventListener("DOMContentLoaded", function () {
  const paragraph = document.querySelector(".photography-description");
  const title = document.querySelector(".photography-title");
  const link = document.querySelector(".photography-link");

  if (paragraph && title && link) {
    const text = paragraph.innerHTML; 
    const lines = text.split("<br>"); 
    paragraph.innerHTML = ""; 

    lines.forEach((line, index) => {
      if (line.trim()) {
        const span = document.createElement("span");
        span.className = "line";
        span.style.opacity = "0";
        span.style.transform = "translateY(20px)";
        span.style.transition = `opacity 0.9s ease-out ${index * 0.2}s, transform 0.9s ease-out ${index * 0.2}s`;
        span.innerHTML = line.trim() || "&nbsp;"; 
        paragraph.appendChild(span);

        if (index < lines.length - 1) {
          const br = document.createElement("br");
          paragraph.appendChild(br);
        }
      }
    });

    let isVisible = false;

    function handleScroll() {
      const rect = paragraph.getBoundingClientRect();
      const lines = paragraph.querySelectorAll(".line");

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        if (!isVisible) {
          isVisible = true; 
          console.log("Section is visible");

          lines.forEach((line, index) => {
            setTimeout(() => {
              line.style.opacity = "1";
              line.style.transform = "translateY(0)";
              console.log(
                `Line ${index} styles applied:`,
                line.style.opacity,
                line.style.transform
              );
            }, index * 300); 
          });

          setTimeout(() => {
            title.style.opacity = "1";
            title.style.transform = "translateY(0)";
          }, 200); 

          setTimeout(() => {
            link.style.opacity = "1";
            link.style.transform = "translateY(0)";
          }, 900); 
        }
      } else {
        if (isVisible) {
          isVisible = false; 
          console.log("Section is hidden");

          lines.forEach((line) => {
            line.style.opacity = "0";
            line.style.transform = "translateY(20px)";
          });

         title.style.opacity = "0";
          title.style.transform = "translateY(20px)";

          link.style.opacity = "0";
          link.style.transform = "translateY(20px)";
        }
      }
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); 
  } else {
    console.error("Required elements not found!");
  }
});

