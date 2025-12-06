// GSAP Animations for Profile Page

// Profile Header Animation
gsap.fromTo('.header-background',
    { 
        scaleY: 0,
        transformOrigin: 'top'
    },
    { 
        scaleY: 1,
        duration: 0.6,
        ease: 'power3.out'
    }
);

gsap.fromTo('.profile-avatar',
    { 
        scale: 0,
        rotation: -180
    },
    { 
        scale: 1,
        rotation: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'back.out(1.7)'
    }
);

gsap.fromTo('.profile-info',
    { 
        opacity: 0,
        x: -30
    },
    { 
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: 0.5,
        ease: 'power2.out'
    }
);

gsap.fromTo('.profile-actions .btn',
    { 
        opacity: 0,
        y: 20
    },
    { 
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.7,
        ease: 'power2.out'
    }
);

// Stats Animation
gsap.fromTo('.stat-item',
    { 
        opacity: 0,
        y: 30
    },
    { 
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.8,
        ease: 'power2.out'
    }
);

// Sidebar Cards Animation
gsap.fromTo('.sidebar-card',
    { 
        opacity: 0,
        x: -30
    },
    { 
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 1,
        ease: 'power2.out'
    }
);

// Tabs Animation
gsap.fromTo('.profile-tabs',
    { 
        opacity: 0,
        y: 20
    },
    { 
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 1.2,
        ease: 'power2.out'
    }
);

// Project Cards Animation
gsap.fromTo('.project-card',
    { 
        opacity: 0,
        y: 30
    },
    { 
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 1.4,
        ease: 'power2.out'
    }
);

// Hover Animations
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        gsap.to(this, {
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    card.addEventListener('mouseleave', function() {
        gsap.to(this, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Skill Tag Hover Effect
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        gsap.to(this, {
            scale: 1.1,
            duration: 0.2,
            ease: 'back.out(1.7)'
        });
    });
    
    tag.addEventListener('mouseleave', function() {
        gsap.to(this, {
            scale: 1,
            duration: 0.2,
            ease: 'power2.out'
        });
    });
});

// Activity Items Animation (when tab is switched)
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setTimeout(() => {
            const activeContent = document.querySelector('.tab-content.active');
            const items = activeContent.querySelectorAll('.activity-item, .project-card');
            
            gsap.fromTo(items,
                { 
                    opacity: 0,
                    y: 20
                },
                { 
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: 'power2.out'
                }
            );
        }, 100);
    });
});
