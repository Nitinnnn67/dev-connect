// ================================================
// DEVCONNECT LANDING PAGE ANIMATIONS
// All GSAP animations for the landing page
// ================================================

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// ===== NAVBAR ANIMATIONS =====
gsap.from('.navbar', {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

// ===== HERO SECTION ANIMATIONS =====
const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTimeline
    .from('.hero-heading', {
        opacity: 0,
        y: 50,
        duration: 0.8
    })
    .from('.heading-line', {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
    }, '-=0.6')
    .from('.hero-subheading', {
        opacity: 0,
        y: 30,
        duration: 0.8
    }, '-=0.4')
    .from('.hero-buttons', {
        opacity: 0,
        y: 30,
        duration: 0.8
    }, '-=0.4')
    .from('.hero-stats', {
        opacity: 0,
        y: 30,
        duration: 0.8
    }, '-=0.4');

// Floating Cards Animation
gsap.from('.dev-card', {
    opacity: 0,
    scale: 0.8,
    y: 50,
    duration: 1,
    stagger: 0.2,
    delay: 0.5,
    ease: 'back.out(1.2)'
});

// Continuous floating animation for dev cards
gsap.to('.card-1', {
    y: -20,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
});

gsap.to('.card-2', {
    y: -15,
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 0.3
});

gsap.to('.card-3', {
    y: -18,
    duration: 2.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 0.6
});

// Network nodes animation
gsap.to('.node', {
    scale: 1.5,
    opacity: 0.5,
    duration: 2,
    repeat: -1,
    yoyo: true,
    stagger: 0.3,
    ease: 'sine.inOut'
});

// Parallax effect for hero background
gsap.to('.hero-background', {
    y: 100,
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

// ===== WHY SECTION ANIMATIONS =====
// Ensure elements are visible first
gsap.set('.why-section .section-title', { opacity: 1 });
gsap.set('.why-card', { opacity: 1 });

gsap.from('.why-section .section-title', {
    scrollTrigger: {
        trigger: '.why-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
});

gsap.from('.why-card', {
    scrollTrigger: {
        trigger: '.why-section',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    y: 100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
});

// ===== FEATURES SECTION ANIMATIONS =====
// Ensure elements are visible first
gsap.set('.features .section-title', { opacity: 1 });
gsap.set('.features .section-subtitle', { opacity: 1 });
gsap.set('.feature-card', { opacity: 1 });

gsap.from('.features .section-title', {
    scrollTrigger: {
        trigger: '.features',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
});

gsap.from('.features .section-subtitle', {
    scrollTrigger: {
        trigger: '.features',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
    delay: 0.2,
    ease: 'power3.out'
});

gsap.from('.feature-card', {
    scrollTrigger: {
        trigger: '.features',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    y: 80,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
});

// ===== HOW IT WORKS ANIMATIONS =====
// Ensure elements are visible first
gsap.set('.how-it-works .section-title', { opacity: 1 });
gsap.set('.how-it-works .section-subtitle', { opacity: 1 });
gsap.set('.timeline-step', { opacity: 1 });

gsap.from('.how-it-works .section-title', {
    scrollTrigger: {
        trigger: '.how-it-works',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
});

gsap.from('.how-it-works .section-subtitle', {
    scrollTrigger: {
        trigger: '.how-it-works',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
    delay: 0.2,
    ease: 'power3.out'
});

gsap.from('.timeline-step', {
    scrollTrigger: {
        trigger: '.how-it-works',
        start: 'top 60%',
        toggleActions: 'play none none reverse'
    },
    y: 100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
});

// Animate timeline line
gsap.from('.timeline-line', {
    scrollTrigger: {
        trigger: '.timeline',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    scaleX: 0,
    duration: 1.5,
    ease: 'power3.out'
});

// ===== DEVELOPER CAROUSEL ANIMATIONS =====
// Ensure elements are visible first
gsap.set('.developer-carousel .section-title', { opacity: 1 });
gsap.set('.developer-carousel .section-subtitle', { opacity: 1 });
gsap.set('.carousel-container', { opacity: 1 });
gsap.set('.developer-card', { opacity: 1 });

gsap.from('.developer-carousel .section-title', {
    scrollTrigger: {
        trigger: '.developer-carousel',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
});

gsap.from('.developer-carousel .section-subtitle', {
    scrollTrigger: {
        trigger: '.developer-carousel',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
    delay: 0.2,
    ease: 'power3.out'
});

// Carousel container fade in
gsap.from('.carousel-container', {
    scrollTrigger: {
        trigger: '.developer-carousel',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 50,
    duration: 0.8
});

// Scale in animation for developer cards on first view
gsap.from('.developer-card', {
    scrollTrigger: {
        trigger: '.carousel-track',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    scale: 0.8,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'back.out(1.5)'
});

// ===== TRENDING TEAMS ANIMATIONS =====
// Ensure elements are visible first
gsap.set('.trending-teams .section-title', { opacity: 1 });
gsap.set('.trending-teams .section-subtitle', { opacity: 1 });
gsap.set('.team-card', { opacity: 1 });

gsap.from('.trending-teams .section-title', {
    scrollTrigger: {
        trigger: '.trending-teams',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
});

gsap.from('.trending-teams .section-subtitle', {
    scrollTrigger: {
        trigger: '.trending-teams',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
    delay: 0.2,
    ease: 'power3.out'
});

// Animate team cards from left and right
const teamCards = gsap.utils.toArray('.team-card');

teamCards.forEach((card) => {
    const direction = card.classList.contains('team-left') ? -100 : 100;
    
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        x: direction,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
});

// ===== CTA SECTION ANIMATIONS =====
gsap.from('.cta-content', {
    scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out'
});

// Parallax effect for CTA background
gsap.to('.cta-background', {
    y: -50,
    scrollTrigger: {
        trigger: '.cta-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    }
});

// ===== NAVBAR SCROLL EFFECT =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        gsap.to('.navbar', {
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            boxShadow: '0 2px 30px rgba(0, 0, 0, 0.1)',
            duration: 0.3
        });
    } else {
        gsap.to('.navbar', {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 2px 20px rgba(0, 0, 0, 0.05)',
            duration: 0.3
        });
    }
    
    lastScroll = currentScroll;
});

// ===== MOBILE MENU ANIMATION =====
const mobileToggle = document.querySelector('.mobile-toggle');

mobileToggle?.addEventListener('click', () => {
    const spans = mobileToggle.querySelectorAll('span');
    const isOpen = document.querySelector('.nav-links')?.classList.contains('active');
    
    if (isOpen) {
        gsap.to(spans[0], { rotation: 45, y: 8, duration: 0.3 });
        gsap.to(spans[1], { opacity: 0, duration: 0.3 });
        gsap.to(spans[2], { rotation: -45, y: -8, duration: 0.3 });
    } else {
        gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
        gsap.to(spans[1], { opacity: 1, duration: 0.3 });
        gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
    }
});

// ===== STATS COUNTER ANIMATION =====
const statNumbers = document.querySelectorAll('.stat-number');

statNumbers.forEach(stat => {
    const target = stat.textContent;
    const isPercentage = target.includes('%');
    const numericValue = parseInt(target.replace(/[^0-9]/g, ''));
    
    gsap.from(stat, {
        scrollTrigger: {
            trigger: '.hero-stats',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        textContent: 0,
        duration: 2,
        ease: 'power1.out',
        snap: { textContent: 1 },
        onUpdate: function() {
            const current = Math.ceil(this.targets()[0].textContent);
            if (isPercentage) {
                stat.textContent = current + '%';
            } else if (numericValue >= 1000) {
                stat.textContent = (current / 1000).toFixed(0) + 'K+';
            } else {
                stat.textContent = current + '+';
            }
        }
    });
});

// ===== SMOOTH SCROLL WITH GSAP =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: target,
                    offsetY: 80
                },
                ease: 'power3.inOut'
            });
        }
    });
});

// ===== INTERSECTION OBSERVER =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

console.log('✨ DevConnect Animations Loaded');
