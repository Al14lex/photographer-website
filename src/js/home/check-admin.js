
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    const logos = document.querySelectorAll(".logo-click"); 

    if (!logos.length) {
      console.log("❌ Logo not found!");
      return;
    }

    const adminPassword = "Taranenko1421";
    logos.forEach((logo) => {
      logo.addEventListener("click", function (event) {
        event.preventDefault(); 

        let enteredPassword = localStorage.getItem("adminAccess");
        console.log("Getted password from localStorage:", enteredPassword);

        if (enteredPassword !== adminPassword) {
          let userInput = prompt("Enter admin password:");
          if (userInput === adminPassword) {
            localStorage.setItem("adminAccess", adminPassword);
            alert("Access granted! Click on the logo again to enter.");
          } else {
            alert("Access denied!");
          }
        } else {
          console.log("✅ Send to admin...");
          window.location.href = "/admin_review_page.html";
        }
      });
    });
  }, 1000);
});
