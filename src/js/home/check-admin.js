
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(function () {
        const logo = document.getElementById("logo");
        if (!logo) {
          console.log("Логотип не знайдено!");
          return;
        }
        const adminPassword = "Taranenko1421";

        logo.addEventListener("click", function (event) {
          event.preventDefault();

          let enteredPassword = localStorage.getItem("adminAccess");
          console.log("Отриманий пароль з localStorage:", enteredPassword);

          if (enteredPassword !== adminPassword) {
            let userInput = prompt("Enter admin password:");
            if (userInput === adminPassword) {
              localStorage.setItem("adminAccess", adminPassword);
              alert("Access granted! Click on the logo again to enter.");
            } else {
              alert("Access denied!");
            }
          } else {
            console.log("✅ Перенаправляємо на адмінку...");
            window.location.href = "/admin_review_page.html";
          }
        });
      }, 1000);
    });
