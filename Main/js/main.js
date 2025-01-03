const baseUrl = config.Server_API;

const loginPopupButton = document.querySelector(".btn-login-popup");
const mdloginPopupButton = document.querySelector(".md-btn-login-popup");
const popupWrapper = document.querySelector(".popup-wrapper");
const closeIcon = document.querySelector(".icon-close");
const registerLink = document.querySelector(".register-link");
const loginLink = document.querySelector(".login-link");

mdloginPopupButton.addEventListener("click", () => {
  popupWrapper.classList.add("active-popup");
});

loginPopupButton.addEventListener("click", () => {
  popupWrapper.classList.add("active-popup");
});

closeIcon.addEventListener("click", () => {
  popupWrapper.classList.remove("active-popup");
});

registerLink.addEventListener("click", (e) => {
  e.preventDefault();
  popupWrapper.classList.add("active");
});

loginLink.addEventListener("click", (e) => {
  e.preventDefault();
  popupWrapper.classList.remove("active");
});

const handleAuth = (event) => {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("Please fill in both email and password.");
    return;
  }

  const userData = { email, password };

  axios
    .post(`${baseUrl}auth`, userData)
    .then((response) => {
      const { message, isAuth, name } = response.data;
      if (isAuth) {
        alert(`Success: ${message}`);
        localStorage.setItem("UserName", name);
        window.location.href = "../Tiled-Game/gameCanvas.html";
      } else {
        alert(`Error: ${message}`);
      }
    })
    .catch((error) => {
      console.error("Error during authentication:", error);
      alert("An error occurred. Please try again.");
    });
};

const handleRegister = (event) => {
  event.preventDefault();

  const username = document.getElementById("register-username").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  if (!username || !email || !password) {
    alert("Please fill in all the fields.");
    return;
  }

  const newUser = { username, email, password };

  axios
    .post(`${baseUrl}add`, { User: newUser })
    .then((response) => {
      alert("Registration successful! Please log in.");
    })
    .catch((error) => {
      console.error("Error during registration:", error);
      alert("An error occurred during registration. Please try again.");
    });
};

document.getElementById("login-form").addEventListener("submit", handleAuth);
document
  .getElementById("register-form")
  .addEventListener("submit", handleRegister);
