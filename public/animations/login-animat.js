// GSAP Animations for Login Page

// Animate Card Entry
gsap.fromTo('.login-card',
    { 
        opacity: 0, 
        y: 50,
        scale: 0.95
    },
    { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out'
    }
);

// Animate Brand Section
gsap.fromTo('.brand-icon',
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

gsap.fromTo('.brand-name',
    { 
        opacity: 0,
        y: -20
    },
    { 
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.5,
        ease: 'power2.out'
    }
);

// Animate Header
gsap.fromTo('.login-header',
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

// Animate Form Groups
gsap.fromTo('.input-group',
    { 
        opacity: 0,
        x: -20
    },
    { 
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.6,
        ease: 'power2.out'
    }
);

// Animate Form Options
gsap.fromTo('.form-options',
    { 
        opacity: 0
    },
    { 
        opacity: 1,
        duration: 0.5,
        delay: 0.9,
        ease: 'power2.out'
    }
);

// Animate Login Button
gsap.fromTo('.btn-login',
    { 
        opacity: 0,
        scale: 0.9
    },
    { 
        opacity: 1,
        scale: 1,
        duration: 0.5,
        delay: 1,
        ease: 'back.out(1.7)'
    }
);

// Animate Divider
gsap.fromTo('.divider',
    { 
        opacity: 0,
        scaleX: 0
    },
    { 
        opacity: 1,
        scaleX: 1,
        duration: 0.5,
        delay: 1.1,
        ease: 'power2.out'
    }
);

// Animate Social Buttons
gsap.fromTo('.social-btn',
    { 
        opacity: 0,
        y: 20
    },
    { 
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 1.2,
        ease: 'power2.out'
    }
);

// Animate Footer
gsap.fromTo('.form-footer',
    { 
        opacity: 0
    },
    { 
        opacity: 1,
        duration: 0.5,
        delay: 1.4,
        ease: 'power2.out'
    }
);

// Animate Floating Shapes
gsap.fromTo('.floating-shape',
    { 
        opacity: 0,
        scale: 0
    },
    { 
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'elastic.out(1, 0.5)'
    }
);

// Input Focus Animations
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
        gsap.to(this.closest('.input-group'), {
            scale: 1.02,
            duration: 0.2,
            ease: 'power2.out'
        });
    });
    
    input.addEventListener('blur', function() {
        gsap.to(this.closest('.input-group'), {
            scale: 1,
            duration: 0.2,
            ease: 'power2.out'
        });
    });
});
