// ---------------------------
// Client-side form validation
// ---------------------------

// Validate the signup form
function validateSignupForm(event) {
    event.preventDefault();

    const collegeId = document.getElementById("collegeId").value.trim();
    const studentName = document.getElementById("studentName").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!collegeId || !studentName || !username || !password) {
        alert("Please fill out all fields.");
        return false;
    }

    if (username === studentName) {
        alert("Username should not be similar to your real name.");
        return false;
    }

    // Submit the form (or send to backend via AJAX if needed)
    document.getElementById("signupForm").submit();
}

// Validate the login form
function validateLoginForm(event) {
    event.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!username || !password) {
        alert("Please enter both username and password.");
        return false;
    }

    // Send the login request to the backend
    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            // Save the token to localStorage
            localStorage.setItem("token", data.token);

            // Redirect to the homepage or another page after login
            window.location.href = "/";  // Example: redirect to homepage
        } else {
            alert(data.message || "Login failed. Please try again.");
        }
    })
    .catch((error) => {
        console.error("Error logging in:", error);
    });
}

// ---------------------------
// Rating Submission
// ---------------------------

function submitRating(event) {
    event.preventDefault();

    const collegeName = document.getElementById("collegeName").value.trim();
    const ratings = {
        campus: document.getElementById("campusRating").value,
        placement: document.getElementById("placementRating").value,
        faculty: document.getElementById("facultyRating").value,
        library: document.getElementById("libraryRating").value,
        hostel: document.getElementById("hostelRating").value,
        food: document.getElementById("foodRating").value,
        infrastructure: document.getElementById("infrastructureRating").value,
        culturalEvents: document.getElementById("culturalEventsRating").value,
        sports: document.getElementById("sportsRating").value,
        labs: document.getElementById("labsRating").value,
    };
    const review = document.getElementById("review").value.trim();

    if (!collegeName) {
        alert("Please enter a college name.");
        return false;
    }

    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to submit a rating.");
        return false;
    }

    // Send data to the backend via AJAX
    fetch("/rate", {  // Ensure you're using the correct endpoint
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,  // Add the token in the Authorization header
        },
        body: JSON.stringify({ collegeName, ratings, review }), // Send the college name, ratings, and review
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            alert("Rating submitted successfully!");
            window.location.href = "/"; // Redirect to the homepage
        } else {
            alert(data.message || "Something went wrong.");
        }
    })
    .catch((error) => {
        console.error("Error submitting rating:", error);
    });
}

// ---------------------------
// Fetch and Display College Ratings
// ---------------------------

function fetchCollegeRatings() {
    fetch("/colleges")
        .then((response) => response.json())
        .then((colleges) => {
            console.log("Fetched colleges:", colleges);  // Log the fetched colleges

            const collegesContainer = document.getElementById("collegesContainer");

            if (!collegesContainer) return;

            colleges.forEach((college) => {
                const collegeElement = document.createElement("div");
                collegeElement.classList.add("college");

                // Display college name
                const collegeNameElement = document.createElement("h3");
                collegeNameElement.textContent = college.collegeName;
                collegeElement.appendChild(collegeNameElement);

                // Display college ratings
                const ratingsElement = document.createElement("ul");

                // Loop through all ratings for each college
                college.ratings.forEach((rating) => {
                    // Display the username who submitted the rating
                    const usernameElement = document.createElement("li");
                    usernameElement.textContent = `Rated by: ${rating.username}`; // Add the username
                    ratingsElement.appendChild(usernameElement);

                    // Display each rating category and its value
                    Object.entries(rating.ratings).forEach(([category, ratingValue]) => {
                        const ratingElement = document.createElement("li");
                        ratingElement.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)}: ${ratingValue}`;
                        ratingsElement.appendChild(ratingElement);
                    });

                    // Display the review left by the student
                    const reviewElement = document.createElement("p");
                    reviewElement.textContent = `Review: ${rating.review}`;
                    collegeElement.appendChild(reviewElement);
                });

                // Append the ratings to the college element
                collegeElement.appendChild(ratingsElement);

                // Append the college element to the container
                collegesContainer.appendChild(collegeElement);
            });
        })
        .catch((error) => {
            console.error("Error fetching college ratings:", error);
        });
}

// ---------------------------
// Attach event listeners
// ---------------------------

document.addEventListener("DOMContentLoaded", () => {
    // Signup form
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", validateSignupForm);
    }

    // Login form
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", validateLoginForm);
    }

    // Rating form
    const ratingForm = document.getElementById("ratingForm");
    if (ratingForm) {
        ratingForm.addEventListener("submit", submitRating);
    }

    // Fetch and display college ratings
    fetchCollegeRatings();
});
