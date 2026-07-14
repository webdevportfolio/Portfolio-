document.addEventListener("DOMContentLoaded", () => {
    // Smooth scrolling for navigation links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
});

// Your Google Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzvXtZmtU9gTEIOeDBK8pN3sS21vNitYBtxO7Xn4PFxuSjAvKHHS4k1eEoiw-5FET5e/exec";

// 1. Fetch and display reviews instantly when page loads (with Cache-Buster)
async function loadReviews() {
    const container = document.getElementById("dynamic-reviews");
    if (!container) return;
    
    try {
        const freshUrl = `${SCRIPT_URL}?t=${Date.now()}`;
        const response = await fetch(freshUrl);
        const reviews = await response.json();
        
        container.innerHTML = "";
        
        if (reviews.length === 0) {
            container.innerHTML = `<p style="color:#666; grid-column: 1/-1;">No reviews yet. Be the first!</p>`;
            return;
        }

        reviews.forEach(item => {
            const card = document.createElement("div");
            card.className = "review-card";
            card.innerHTML = `
                <p class="review-text">"${item.review}"</p>
                <h4 class="client-name">— ${item.name}</h4>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error("Error loading reviews:", err);
    }
}

// 2. Submit reviews (Guarantees Google saves it FIRST, then shows it instantly)
document.getElementById("review-form")?.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById("review-name");
    const contentInput = document.getElementById("review-content");
    const submitBtn = this.querySelector(".review-submit-btn");
    
    const submittedName = nameInput.value;
    const submittedReview = contentInput.value;
    
    const payload = {
        name: submittedName,
        review: submittedReview
    };
    
    submitBtn.innerText = "SUBMITTING...";
    submitBtn.disabled = true;

    try {
        // First: Send data to Google Sheet (the exact fetch that worked before)
        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors", 
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify(payload)
        });

        // Second: Clear form inputs
        nameInput.value = "";
        contentInput.value = "";
        submitBtn.innerText = "SUBMIT REVIEW";
        submitBtn.disabled = false;

        // Third: Show the review card on screen instantly so they don't have to reload
        const container = document.getElementById("dynamic-reviews");
        if (container) {
            if (container.innerHTML.includes("No reviews yet")) {
                container.innerHTML = "";
            }
            
            const newCard = document.createElement("div");
            newCard.className = "review-card";
            newCard.innerHTML = `
                <p class="review-text">"${submittedReview}"</p>
                <h4 class="client-name">— ${submittedName}</h4>
            `;
            // Slide it directly to the top
            container.insertBefore(newCard, container.firstChild);
        }
        
    } catch (err) {
        console.error("Submission failed:", err);
        submitBtn.innerText = "SUBMIT REVIEW";
        submitBtn.disabled = false;
    }
});

// Run loadReviews automatically when the window loads
document.addEventListener("DOMContentLoaded", loadReviews);
