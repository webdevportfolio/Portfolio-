
// 1. Smooth Scrolling for Anchor Links (#services, #reviews, etc.)
document.addEventListener("DOMContentLoaded", () => {
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

// 2. WhatsApp Direct Redirect Function
function startProjectWhatsApp() {
    const phoneNumber = "2348029913798"; 
    const templateMessage = "Hey MRWEBDEV! 👋 I checked out your portfolio and I'd like to start a web design project.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(templateMessage)}`;
    
    window.open(whatsappUrl, '_blank');
}

// 3. Google Apps Script Web App URL for Reviews
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzvXtZmtU9gTEIOeDBK8pN3sS21vNitYBtxO7Xn4PFxuSjAvKHHS4k1eEoiw-5FET5e/exec";

// Fetch and display reviews on page load
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

// 4. Submit Reviews Event Listener
document.getElementById("review-form")?.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById("review-name");
    const contentInput = document.getElementById("review-content");
    const submitBtn = this.querySelector(".review-submit-btn");
    
    const submittedName = nameInput.value;
    const submittedReview = contentInput.value;
    
    const payload = {
        sheetId: "14DtygzLcwGVk_LcTUxA9ff4ZPDoJVD5JjpMeqnjJ43s",
        name: submittedName,
        review: submittedReview
    };
    
    submitBtn.innerText = "SUBMITTING...";
    submitBtn.disabled = true;

    try {
        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors", 
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify(payload)
        });

        // Clear form inputs
        nameInput.value = "";
        contentInput.value = "";
        submitBtn.innerText = "SUBMIT REVIEW";
        submitBtn.disabled = false;

        // Show the new review card immediately
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
            container.insertBefore(newCard, container.firstChild);
        }
        
    } catch (err) {
        console.error("Submission failed:", err);
        submitBtn.innerText = "SUBMIT REVIEW";
        submitBtn.disabled = false;
    }
});

// Run loadReviews automatically when DOM is ready
document.addEventListener("DOMContentLoaded", loadReviews);
