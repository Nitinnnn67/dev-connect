// GSAP Animations for Home Page

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Hero Section Animations
gsap.fromTo('.hero-title',
    { 
        opacity: 0,
        y: 50
    },
    { 
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    }
);

gsap.fromTo('.hero-subtitle',
    { 
        opacity: 0,
        y: 30
    },
    { 
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out'
    }
);

gsap.fromTo('.hero-buttons .btn',
    { 
        opacity: 0,
        y: 20
    },
    { 
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.4,
        ease: 'power2.out'
    }
);

// Floating Cards Animation
gsap.fromTo('.floating-card',
    { 
        opacity: 0,
        scale: 0,
        rotation: -180
    },
    { 
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.6,
        ease: 'back.out(1.7)'
    }
);

// Stats Cards Animation (on scroll)
gsap.fromTo('.stat-card',
    { 
        opacity: 0,
        y: 50
    },
    { 
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.stats-section',
            start: 'top 80%'
        }
    }
);

// Action Cards Animation (on scroll)
gsap.fromTo('.action-card',
    { 
        opacity: 0,
        y: 30
    },
    { 
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.quick-actions-section',
            start: 'top 80%'
        }
    }
);

// Section Headers Animation (on scroll)
gsap.utils.toArray('.section-header').forEach(header => {
    gsap.fromTo(header,
        { 
            opacity: 0,
            y: 30
        },
        { 
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: header,
                start: 'top 85%'
            }
        }
    );
});

// Activity Section Animation (on scroll)
gsap.fromTo('.activity-empty',
    { 
        opacity: 0,
        scale: 0.9
    },
    { 
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.activity-section',
            start: 'top 80%'
        }
    }
);

// Hover effect for action icons
document.querySelectorAll('.action-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        gsap.to(this, {
            scale: 1.1,
            rotation: 10,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
    });
    
    icon.addEventListener('mouseleave', function() {
        gsap.to(this, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});
