
const modal = document.getElementById("modal");
const form = document.querySelector(".contact-form");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const userName = document.getElementById("user_name").value;
  const userEmail = document.getElementById("user_email").value;
  const userPhone = document.getElementById("user_phone").value;
  const message = document.getElementById("message").value;

  console.log("Form submitted!");
  console.log("User Name:", userName);
  console.log("User Email:", userEmail);
   console.log("User Phone:", userPhone);
  console.log("Message:", message);

  try {
    const response = await emailjs.send("service_i8bcmth", "template_1fpbo2w", {
      user_name: userName,
      user_email: userEmail,
      user_phone: userPhone,
      message: message,
    });

    console.log("EmailJS Response:", response);

    if (response.status === 200) {
      showModal(); 
      form.reset();
      resetFieldStyles();
    } else {
      throw new Error("Failed to send email. Please try again later.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
function resetFieldStyles() {
  const inputs = document.querySelectorAll(".form-input");
  inputs.forEach((input) => {
    input.classList.remove("filled"); 
    input.style.backgroundColor = "";
    input.style.boxShadow = ""; 
  });
}
function showModal() {
  modal.style.display = "flex";
  setTimeout(() => {
    modal.classList.add("active"); 
  }, 10);

  setTimeout(() => {
    closeModal();
  }, 5000); 
}

function closeModal() {
  modal.classList.remove("active"); 

  setTimeout(() => {
    modal.style.display = "none"; 
  }, 500);
}

modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModal();
  }
});
