/*
 * This file should contain code for the following tasks:
 * 1. Create a new account.
 * 2. Sign in an existing account.
 * 3. Redirect a user to chat.html once they are logged in/signed up.
 */

var signupForm = document.getElementById("signup-form");
var signupName = document.getElementById("signup-name");
var signupEmail = document.getElementById("signup-email");
var signupPassword = document.getElementById("signup-password");
var signupPasswordConfirm = document.getElementById("signup-password-confirm");
var signupError = document.getElementById("signup-error");
var loginError = document.getElementById("login-error");
var firebaseError = document.getElementById("firebase-error");

signupForm.addEventListener("submit", function(e) {
    e.preventDefault();

    signupError.classList.remove("active");

    var displayNameVar = signupName.value;
    var email = signupEmail.value;
    var password = signupPassword.value;
    var passwordConfirm = signupPasswordConfirm.value;
    var photoURLVar = "https://www.gravatar.com/avatar/" + md5(email);

    console.log(displayNameVar);
    console.log(email);
    console.log(password);
    console.log(passwordConfirm);

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
                photoURL: photoURLVar
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

var loginForm = document.getElementById("login-form");
var loginEmail = document.getElementById("login-email");
var loginPassword = document.getElementById("login-password");
var loginButton = document.getElementById("login-button");

loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    var email = loginEmail.value;
    var password = loginPassword.value;

    console.log(email);
    console.log(password);

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

firebase.auth().onAuthStateChanged(function(user) {
    if (user){
        console.log("signed in");

        var database = firebase.database();

        var testRef = database.ref("test");
        testRef.on("value", function(snapshot){
            var val = snapshot.val();

            console.log(val);
        });

        database.ref("mainchat2").set("Hello all");
    }else {
        console.log("signed out");
    }
});
