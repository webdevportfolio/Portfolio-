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
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzvXtZmtU9gTEIOeDBK8pN3sS21vNitYBtxO7Xn4PFxuSjAvKHHS4k1eEoiw-5FET5e/exec";

// 1. Fetch and display reviews instantly when page loads
async function loadReviews() {
    const container = document.getElementById("dynamic-reviews");
    if (!container) return;
    
    try {
        const response = await fetch(SCRIPT_URL);
        const reviews = await response.json();
        
        // Clear old placeholders
        container.innerHTML = "";
        
        if (reviews.length === 0) {
            container.innerHTML = `<p style="color:#666; grid-column: 1/-1;">No reviews yet. Be the first!</p>`;
            return;
        }

        // Inject data from Google Sheet
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

// 2. Handle instant review submissions
document.getElementById("review-form")?.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById("review-name");
    const contentInput = document.getElementById("review-content");
    const submitBtn = this.querySelector(".review-submit-btn");
    
    const payload = {
        name: nameInput.value,
        review: contentInput.value
    };
    
    submitBtn.innerText = "SUBMITTING...";
    submitBtn.disabled = true;

    try {
        // We use text/plain to bypass the browser's CORS pre-flight checks, 
        // allowing e.postData.contents to parse the JSON string perfectly.
        await fetch(SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(payload),
            redirect: "follow"
        });

        // Clear the form fields immediately
        nameInput.value = "";
        contentInput.value = "";
        submitBtn.innerText = "SUBMIT REVIEW";
        submitBtn.disabled = false;
        
        // Refresh the review wall live on screen
        setTimeout(loadReviews, 1500); 
        
    } catch (err) {
        console.error("Submission failed:", err);
        submitBtn.innerText = "SUBMIT REVIEW";
        submitBtn.disabled = false;
    }
});
