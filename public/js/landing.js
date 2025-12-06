// ================================================
// DEVCONNECT LANDING PAGE - MAIN FUNCTIONALITY
// Core JavaScript functionality (non-animation)
// ================================================

// ===== DEVELOPER CAROUSEL =====
let currentIndex = 0;
const track = document.querySelector('.carousel-track');
const cards = document.querySelectorAll('.developer-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const cardWidth = 310; // card width + gap

// Calculate visible cards based on screen size
function getVisibleCards() {
    const containerWidth = document.querySelector('.carousel-wrapper')?.offsetWidth || 1200;
    return Math.floor(containerWidth / cardWidth) || 3;
}

function updateCarousel() {
    if (!track) return;
    const offset = -currentIndex * cardWidth;
    
    // Update button states
    if (prevBtn) {
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
    }
    
    const visibleCards = getVisibleCards();
    if (nextBtn) {
        nextBtn.style.opacity = currentIndex >= cards.length - visibleCards ? '0.5' : '1';
        nextBtn.style.cursor = currentIndex >= cards.length - visibleCards ? 'not-allowed' : 'pointer';
    }
    
    if (typeof gsap !== 'undefined') {
        gsap.to(track, {
            x: offset,
            duration: 0.5,
            ease: 'power2.out'
        });
    } else {
        track.style.transform = `translateX(${offset}px)`;
    }
}

nextBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const visibleCards = getVisibleCards();
    if (currentIndex < cards.length - visibleCards) {
        currentIndex++;
        updateCarousel();
    }
});

prevBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
});

// Initialize carousel
if (track && cards.length > 0) {
    updateCarousel();
}

// Auto-play carousel
let autoplayInterval = setInterval(() => {
    const visibleCards = getVisibleCards();
    if (currentIndex < cards.length - visibleCards) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    updateCarousel();
}, 4000);

// Pause autoplay on hover
document.querySelector('.carousel-container')?.addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
});

document.querySelector('.carousel-container')?.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(() => {
        const visibleCards = getVisibleCards();
        if (currentIndex < cards.length - visibleCards) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    }, 4000);
});

// Update on window resize
window.addEventListener('resize', () => {
    updateCarousel();
});

// ===== VIEW PROFILE BUTTONS =====
document.querySelectorAll('.view-profile').forEach(btn => {
    btn.addEventListener('click', () => {
        alert('Please login to view full profile');
    });
});

// ===== JOIN TEAM BUTTONS =====
document.querySelectorAll('.join-team').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = '/login';
    });
});

// ===== MOBILE MENU TOGGLE =====
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');
const navButtons = document.querySelector('.nav-buttons');

mobileToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('active');
    navButtons?.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks?.classList.remove('active');
        navButtons?.classList.remove('active');
    });
});

// ===== SMOOTH SCROLL (FALLBACK FOR NON-GSAP) =====
if (typeof gsap === 'undefined') {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class for glassmorphism effect
    if (currentScroll > 50) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== CONSOLE MESSAGE =====
console.log('🚀 DevConnect Landing Page Loaded');
console.log('👨‍💻 Built by Nitin & Esha');
