// GSAP Animations for Register Page

// Main card animation
gsap.from('.register-card', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
});

// Form groups stagger animation
gsap.from('.form-group', {
    duration: 0.8,
    y: 30,
    opacity: 0,
    stagger: 0.1,
    ease: 'power2.out',
    delay: 0.3
});

// Button entrance animation
gsap.fromTo('.btn-register', 
    {
        scale: 0.9,
        opacity: 0
    },
    {
        duration: 0.8,
        scale: 1,
        opacity: 1,
        ease: 'back.out(1.7)',
        delay: 0.8
    }
);

// Login link animation
gsap.from('.login-link', {
    duration: 0.6,
    opacity: 0,
    y: 20,
    delay: 1
});

// Form input focus animations
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
        gsap.to(this, {
            duration: 0.3,
            scale: 1.02,
            ease: 'power2.out'
        });
    });

    input.addEventListener('blur', function() {
        gsap.to(this, {
            duration: 0.3,
            scale: 1,
            ease: 'power2.out'
        });
    });
});

// Button hover animation
const registerBtn = document.querySelector('.btn-register');
if (registerBtn) {
    registerBtn.addEventListener('mouseenter', function() {
        gsap.to(this, {
            duration: 0.3,
            scale: 1.05,
            ease: 'power2.out',
            opacity: 1
        });
    });

    registerBtn.addEventListener('mouseleave', function() {
        gsap.to(this, {
            duration: 0.3,
            scale: 1,
            ease: 'power2.out',
            opacity: 1
        });
    });
}

// Form submission animation
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        gsap.to('.register-card', {
            duration: 0.5,
            scale: 0.95,
            opacity: 0.8,
            ease: 'power2.in'
        });
    });
}
