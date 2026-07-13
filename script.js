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

// Your deployment URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyOAT0XMt8mSLp42azMl4yllY0Jr-GyEMQeLxtUNdrlpJy-Q60r5dSX09lgWWo-Ld5L/exec";

// 1. Fetch and display reviews instantly when page loads
async function loadReviews() {
    const container = document.getElementById("dynamic-reviews");
    if (!container) return;
    
    try {
        const response = await fetch(SCRIPT_URL);
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

// 2. Handle instant review submissions using text stream routing
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
        // mode: "no-cors" forces a simple request, hiding custom headers from strict pre-flight blocks
        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify(payload)
        });

        // Clear the form fields immediately
        nameInput.value = "";
        contentInput.value = "";
        submitBtn.innerText = "SUBMIT REVIEW";
        submitBtn.disabled = false;
        
        // Refresh the review wall live on screen after a short delay
        setTimeout(loadReviews, 1500); 
        
    } catch (err) {
        console.error("Submission failed:", err);
        submitBtn.innerText = "SUBMIT REVIEW";
        submitBtn.disabled = false;
    }
});

// Run it immediately on page load
document.addEventListener("DOMContentLoaded", loadReviews);
