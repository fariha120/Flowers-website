
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  import {
   getAuth,
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
//   import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
 
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
  // -------------
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

//   const analytics = getAnalytics(app);
  const auth = getAuth(app);

  //---------------------------------
  // Signup Function
    function signup() {
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    // Check if both fields are filled
    if (email === "" || password === "") {
      alert("Please fill out both email and password fields.");
      return;
    }
  
    // Optional: Add more password validation (e.g., length, special characters)
    if (password.length < 6) {
      alert("Password should be at least 6 characters long.");
      return;
    }
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User signed up successfully
        const user = userCredential.user;
        console.log("User signed up:", user);
        alert("Sign up successful! Welcome, " + user.email);
        window.location.pathname = "signin.html";
      })
      .catch((error) => {
        // Handle sign-up errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error signing up:", errorCode, errorMessage);
  
        // Display a user-friendly error message
        alert("Error: " + errorMessage);
      });
  }
  
  // Attach event listener to button
  document.getElementById("signupButton")?.addEventListener("click", signup);
  
  function signin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    // Check if both fields are filled
    if (email === "" || password === "") {
      alert("Please fill out both email and password fields.");
      return;
    }
  
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Signed in successfully: ", user);
        alert("Logged in...");
        sessionStorage.setItem("user", user.email);
        window.location.href = "./home.html";

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
      });
  }
  
  document.getElementById("loginButton")?.addEventListener("click", signin);
  
// ---------------------

  const uploadForm = document.getElementById('uploadForm');
const imageInput = document.getElementById('imageInput');
const gallery = document.getElementById('gallery');

// Firebase Storage and Firestore references
const storageRef = firebase.storage().ref();
const db = firebase.firestore();


// Image upload event
uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const file = imageInput.files[0];
    const fileRef = storageRef.child('images/' + file.name);

    // Upload image to Firebase Storage
    fileRef.put(file).then((snapshot) => {
        fileRef.getDownloadURL().then((url) => {
            // Save image URL to Firestore
            db.collection('images').add({
                imageUrl: url,
                userId: firebase.auth().currentUser.uid
            });
            displayImage(url);
        });
    });
});

// Display image in gallery
function displayImage(url) {
    const imgElement = document.createElement('img');
    imgElement.src = url;
    imgElement.width = 100;
    imgElement.height = 100;
    gallery.appendChild(imgElement);
}

// Fetch and display existing images on load
db.collection('images')
  .where("userId", "==", firebase.auth().currentUser.uid)
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          displayImage(doc.data().imageUrl);
      });
  });
  
