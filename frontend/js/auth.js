document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       PASSWORD SHOW / HIDE
    ========================================= */

    const toggleButtons =
        document.querySelectorAll(".password-toggle");

    toggleButtons.forEach(button => {

        button.addEventListener("click", () => {

            const targetId =
                button.getAttribute("data-target");

            const passwordInput =
                document.getElementById(targetId);

            if (passwordInput.type === "password") {

                passwordInput.type = "text";
                button.textContent = "Hide";

            } else {

                passwordInput.type = "password";
                button.textContent = "Show";

            }

        });

    });


    /* =========================================
       LOGIN
    ========================================= */

    const loginForm =
        document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const email =
                document.getElementById("loginEmail").value.trim();

            const password =
                document.getElementById("loginPassword").value;

            if (!email || !password) {
                alert("Please enter your email and password.");
                return;
            }

            /*
             * FRONTEND DEMO ONLY
             * Backend authentication will be connected later.
             */

            window.location.href = "dashboard.html";

        });

    }


    /* =========================================
       SIGNUP
    ========================================= */

    const signupForm =
        document.getElementById("signupForm");

    if (signupForm) {

        signupForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const name =
                document.getElementById("fullName").value.trim();

            const email =
                document.getElementById("signupEmail").value.trim();

            const password =
                document.getElementById("signupPassword").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            const role =
                document.getElementById("userRole").value;

            const terms =
                document.getElementById("terms").checked;


            if (!name || !email || !password || !confirmPassword) {

                alert("Please fill in all required fields.");
                return;

            }


            if (password.length < 6) {

                alert("Password must contain at least 6 characters.");
                return;

            }


            if (password !== confirmPassword) {

                alert("Passwords do not match.");
                return;

            }


            if (!role) {

                alert("Please select your role.");
                return;

            }


            if (!terms) {

                alert("Please accept the Terms & Privacy Policy.");
                return;

            }


            /*
             * FRONTEND DEMO ONLY
             * Real registration will be connected
             * with backend API later.
             */

            alert(
                `Welcome, ${name}! Your Guardian account has been created.`
            );

            window.location.href = "login.html";

        });

    }

});