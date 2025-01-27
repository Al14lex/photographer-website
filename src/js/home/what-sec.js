

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
        span.style.transition = `opacity 0.9s ease-out ${index * 0.4}s, transform 0.9s ease-out ${index * 0.4}s`;
        span.innerHTML = line.trim() || "&nbsp;";
        paragraph.appendChild(span);

        if (index < lines.length - 1) {
          const br = document.createElement("br");
          paragraph.appendChild(br);
        }
      }
    });

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: [0.5], 
    };

    function handleIntersect(entries, observer) {
      entries.forEach((entry) => {
        const lines = paragraph.querySelectorAll(".line");

        if (entry.isIntersecting) {
          console.log("Section is visible");

          lines.forEach((line, index) => {
            setTimeout(() => {
              line.style.opacity = "1";
              line.style.transform = "translateY(0)";
            }, index * 300);
          });

          setTimeout(() => {
            title.style.opacity = "1";
            title.style.transform = "translateY(0)";
          }, 200);

          setTimeout(() => {
            link.style.opacity = "1";
            link.style.transform = "translateY(0)";
          }, 1000);
        } else {
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
      });
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    observer.observe(document.querySelector(".photography-content"));
  } else {
    console.error("Required elements not found!");
  }
});
