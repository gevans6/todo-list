/*
 * This file contains code to:
 * 1. Create a new account
 * 2. Sign in to an existing account
 * 3. Redirects to todo.html
 */

// Initial variable declaration for sign up
var signupForm = document.getElementById("signup-form");
var signupName = document.getElementById("signup-name");
var signupEmail = document.getElementById("signup-email");
var signupPassword = document.getElementById("signup-password");
var signupPasswordConfirm = document.getElementById("signup-password-confirm");
var signupError = document.getElementById("signup-error");
var loginError = document.getElementById("login-error");
var firebaseError = document.getElementById("firebase-error");

// Sign up form
signupForm.addEventListener("submit", function(e) {
    e.preventDefault();

    signupError.classList.remove("active");

    var displayNameVar = signupName.value;
    var email = signupEmail.value;
    var password = signupPassword.value;
    var passwordConfirm = signupPasswordConfirm.value;

    if (password !== passwordConfirm){
        signupError.textContent = "Passwords do not match";
        signupError.classList.add("active");
    } else {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(user) {
            // Send verification email
            user.sendEmailVerification();
        
            // Update their display name and profile picture
            // displayName, photoURL
            user.updateProfile({
                displayName: displayNameVar,
            }).then(function() {
            // Update successful.
            }, function(error) {
                // Error with firebase API
                firebaseError.innerText = "Error connecting with firebase API";
                firebaseError.classList.add("active");
            });
            // Redirect to  chat page
            window.location.href = "todo.html";
        })
        .catch(function(error) {
            signupError.textContent = error.message;
            signupError.classList.add("active");
        });
    }
});

// Initial variable declaration for login
var loginForm = document.getElementById("login-form");
var loginEmail = document.getElementById("login-email");
var loginPassword = document.getElementById("login-password");
var loginButton = document.getElementById("login-button");

// Login form
loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    var email = loginEmail.value;
    var password = loginPassword.value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function() {
        console.log("Logged in successfully");
        
        window.location.href = "todo.html"
    })
    .catch(function(error) {
        loginError.textContent = error.message;
        loginError.classList.add("active");
    });
});

// Signs user in and initializes database
firebase.auth().onAuthStateChanged(function(user) {
    if (user){
        console.log("signed in");

        var database = firebase.database();

        var testRef = database.ref("test");
        testRef.on("value", function(snapshot){
            var val = snapshot.val();

            console.log(val);
        });

        database.ref("mainchat").set("Hello all");
    }else {
        console.log("signed out");
    }
});
