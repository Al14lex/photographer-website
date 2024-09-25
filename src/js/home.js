//============ підсвічування назви активної сторінки====

const currentPage = window.location.pathname.split("/").pop(); 
const menuLinks = document.querySelectorAll('.nav-list a');

menuLinks.forEach(link => {
  const linkPage = link.getAttribute('href').split("/").pop();

  if (linkPage === currentPage) {
    link.classList.add('active');
  }
});

//=========== модальне вікто при відправці форми========  
const modal = document.getElementById("modal");
const span = document.getElementById ("close");

document.querySelector(".contact-form").onsubmit = function(event) {
    event.preventDefault(); 
    modal.style.display = "block";
    this.reset();
};

span.onclick = function() {
    modal.style.display = "none";
};

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

