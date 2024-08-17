// // script.js
// Select DOM elements
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const logoutButton = document.getElementById("logoutButton");
const welcomeMessage = document.getElementById("welcomeMessage");

// Handle user signup
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = signupForm.email.value;
    const password = signupForm.password.value;

    const response = await fetch("http://localhost:5001/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      alert("User registered successfully!");
      window.location.href = "login.html"; // Redirect to login page
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
    }
  });
}

// Handle user login
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    const response = await fetch("http://localhost:5001/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include credentials to send cookies
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      alert("Login successful!");
      window.location.href = "home.html"; // Redirect to home page
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
    }
  });
}

// Handle user logout
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    // Clear the cookie
    document.cookie = "setCookietoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    alert("Logged out successfully!");
    window.location.href = "login.html"; // Redirect to login page
  });
}

// Check if the user is logged in on the home page
if (window.location.pathname === "/home.html") {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("setCookietoken="));
  
  if (!token) {
    alert("You are not logged in. Redirecting to login page.");
    window.location.href = "login.html"; // Redirect to login page if not logged in
  } else {
    welcomeMessage.innerText = "Welcome back!";
  }
}











// // Select DOM elements
// const signupForm = document.getElementById("signupForm");
// const loginForm = document.getElementById("loginForm");
// const logoutButton = document.getElementById("logoutButton");
// const welcomeMessage = document.getElementById("welcomeMessage");
// console.log("dom");
// // Handle user signup
// if (signupForm) {
//   signupForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const email = signupForm.email.value;
//     const password = signupForm.password.value;

//     const response = await fetch("http://localhost:5001/api/users", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     if (response.ok) {
//       alert("User registered successfully!");
//       window.location.href = "login.html"; // Redirect to login page
//     } else {
//       const errorData = await response.json();
//       alert(`Error: ${errorData.message}`);
//     }
//   });
// }

// // Handle user login
// function setCookie(name, value, days) {
//   let expires = "";
//   if (days) {
//     const date = new Date();
//     date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//     expires = "; expires=" + date.toUTCString();
//   }
//   document.cookie = name + "=" + (value || "") + expires + "; path=/";
// }

// if (loginForm) {
//   loginForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const email = loginForm.email.value;
//     const password = loginForm.password.value;

//     const response = await fetch("http://localhost:5001/api/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//     });
//     console.log();

//     if (response.ok) {
//       alert("Login successful!");

//       let data = await response.json();
//       setCookie("setCookietoken", data.token, 7);
//       console.log(">>>>>", data);
//       window.location.href = "home.html";
//     } else {
//       const errorData = await response.json();
//       alert(`Error: ${errorData.message}`);
//     }
//   });
// }

// // Handle user logout
// if (logoutButton) {
//   logoutButton.addEventListener("click", () => {
//     // Clear the cookie
//     document.cookie = "setCookietoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     alert("Logged out successfully!");
//     window.location.href = "login.html"; // Redirect to login page
//   });
// }

// // Check if the user is logged in on the home page
// if (window.location.pathname === "/home.html") {
//   const token = document.cookie
//     .split("; ")
//     .find((row) => row.startsWith("setCookietoken="));
//   if (!token) {
//     alert("You are not logged in. Redirecting to login page.");
//     window.location.href = "login.html"; // Redirect to login page if not logged in
//   } else {
//     welcomeMessage.innerText = "Welcome back!";
//   }
// }
