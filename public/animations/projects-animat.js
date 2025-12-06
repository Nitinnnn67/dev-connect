// GSAP Animations for Projects Page

gsap.registerPlugin(ScrollTrigger);

// Header Animation
gsap.fromTo('.projects-header',
    { 
        opacity: 0,
        y: -50
    },
    { 
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    }
);

gsap.fromTo('.header-text h1',
    { 
        opacity: 0,
        x: -30
    },
    { 
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: 0.3,
        ease: 'power2.out'
    }
);

gsap.fromTo('.header-text p',
    { 
        opacity: 0,
        x: -30
    },
    { 
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: 0.4,
        ease: 'power2.out'
    }
);

gsap.fromTo('.header-content .btn',
    { 
        opacity: 0,
        scale: 0.8
    },
    { 
        opacity: 1,
        scale: 1,
        duration: 0.5,
        delay: 0.5,
        ease: 'back.out(1.7)'
    }
);

// Search Bar Animation
gsap.fromTo('.search-bar',
    { 
        opacity: 0,
        y: 30,
        scale: 0.95
    },
    { 
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: 0.6,
        ease: 'back.out(1.4)'
    }
);

// Filters Animation
gsap.fromTo('.filters-container',
    { 
        opacity: 0,
        y: 20
    },
    { 
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0.8,
        ease: 'power2.out'
    }
);

// Filter Buttons Stagger
gsap.fromTo('.filter-btn',
    { 
        opacity: 0,
        scale: 0.8
    },
    { 
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.05,
        delay: 0.9,
        ease: 'back.out(1.7)'
    }
);

// Project Cards Animation
gsap.fromTo('.project-card',
    { 
        opacity: 0,
        y: 40
    },
    { 
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 1,
        ease: 'power2.out'
    }
);

// Scroll-triggered animations for cards that are off-screen
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
    if (index > 5) { // Only for cards after the first 6
        gsap.fromTo(card,
            {
                opacity: 0,
                y: 40
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }
});

// Hover Animation for Project Cards
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        gsap.to(this, {
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        gsap.to(this.querySelector('.project-icon'), {
            rotation: 5,
            scale: 1.1,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
    });
    
    card.addEventListener('mouseleave', function() {
        gsap.to(this, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        gsap.to(this.querySelector('.project-icon'), {
            rotation: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// View Button Arrow Animation
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        gsap.to(this.querySelector('i'), {
            x: 4,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    btn.addEventListener('mouseleave', function() {
        gsap.to(this.querySelector('i'), {
            x: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Filter Button Active Animation
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        gsap.fromTo(this,
            { scale: 0.95 },
            { 
                scale: 1,
                duration: 0.2,
                ease: 'back.out(1.7)'
            }
        );
    });
});

// Search Input Focus Animation
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('focus', function() {
    gsap.to(this.parentElement, {
        scale: 1.02,
        borderColor: '#11293A',
        boxShadow: '0 6px 24px rgba(17, 41, 58, 0.12)',
        duration: 0.3,
        ease: 'power2.out'
    });
});

searchInput.addEventListener('blur', function() {
    gsap.to(this.parentElement, {
        scale: 1,
        borderColor: '#E1E4E8',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        duration: 0.3,
        ease: 'power2.out'
    });
});

// Dropdown Animation
const dropdownBtn = document.querySelector('.dropdown-btn');
const dropdownContent = document.querySelector('.dropdown-content');

if (dropdownBtn && dropdownContent) {
    dropdownBtn.addEventListener('click', function() {
        const isActive = this.parentElement.classList.contains('active');
        
        if (isActive) {
            gsap.fromTo(dropdownContent,
                { 
                    opacity: 0,
                    y: -10,
                    display: 'block'
                },
                { 
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                }
            );
        }
    });
}

// Status Badge Pulse Animation
document.querySelectorAll('.status-badge').forEach(badge => {
    if (badge.classList.contains('status-recruiting')) {
        gsap.to(badge, {
            scale: 1.05,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
});

// Empty State Animation
const emptyState = document.getElementById('emptyState');
if (emptyState) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'style') {
                if (emptyState.style.display === 'block') {
                    gsap.fromTo(emptyState,
                        { 
                            opacity: 0,
                            y: 20
                        },
                        { 
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            ease: 'power2.out'
                        }
                    );
                }
            }
        });
    });
    
    observer.observe(emptyState, { attributes: true });
}

// Tech Tag Hover Animation
document.querySelectorAll('.tech-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        gsap.to(this, {
            scale: 1.1,
            backgroundColor: '#11293A',
            color: '#fff',
            duration: 0.2,
            ease: 'power2.out'
        });
    });
    
    tag.addEventListener('mouseleave', function() {
        gsap.to(this, {
            scale: 1,
            backgroundColor: '#F8F9FA',
            color: '#11293A',
            duration: 0.2,
            ease: 'power2.out'
        });
    });
});
