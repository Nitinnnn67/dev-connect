// GSAP Animations for Profile Edit Page

// Page Header Animation
gsap.fromTo('.page-header',
    { 
        opacity: 0,
        y: -30
    },
    { 
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
    }
);

// Avatar Section Animation
gsap.fromTo('.avatar-preview',
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

gsap.fromTo('.avatar-controls',
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

// Edit Cards Animation
const editCards = document.querySelectorAll('.edit-main .edit-card');
gsap.fromTo(editCards,
    { 
        opacity: 0,
        y: 30
    },
    { 
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.15,
        delay: 0.6,
        ease: 'power2.out'
    }
);

// Sidebar Cards Animation
const sidebarCards = document.querySelectorAll('.edit-sidebar .edit-card');
gsap.fromTo(sidebarCards,
    { 
        opacity: 0,
        x: 30
    },
    { 
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.15,
        delay: 0.8,
        ease: 'power2.out'
    }
);

// Form Input Focus Animation
const formInputs = document.querySelectorAll('input, textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        gsap.to(this, {
            scale: 1.02,
            duration: 0.2,
            ease: 'power2.out'
        });
    });
    
    input.addEventListener('blur', function() {
        gsap.to(this, {
            scale: 1,
            duration: 0.2,
            ease: 'power2.out'
        });
    });
});

// Toggle Switch Animation
const toggleSwitches = document.querySelectorAll('.toggle-switch input');
toggleSwitches.forEach(toggle => {
    toggle.addEventListener('change', function() {
        const slider = this.nextElementSibling;
        
        if (this.checked) {
            gsap.to(slider, {
                backgroundColor: '#11293A',
                duration: 0.3,
                ease: 'power2.out'
            });
        } else {
            gsap.to(slider, {
                backgroundColor: '#E1E4E8',
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    });
});

// Skill Tag Add Animation
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.classList && node.classList.contains('skill-tag')) {
                gsap.fromTo(node,
                    { 
                        scale: 0,
                        opacity: 0
                    },
                    { 
                        scale: 1,
                        opacity: 1,
                        duration: 0.3,
                        ease: 'back.out(1.7)'
                    }
                );
            }
        });
    });
});

const skillsDisplay = document.getElementById('skillsDisplay');
if (skillsDisplay) {
    observer.observe(skillsDisplay, { childList: true });
}

// Button Hover Animations
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        gsap.to(this, {
            scale: 1.05,
            duration: 0.2,
            ease: 'power2.out'
        });
    });
    
    btn.addEventListener('mouseleave', function() {
        gsap.to(this, {
            scale: 1,
            duration: 0.2,
            ease: 'power2.out'
        });
    });
});

// Back Button Special Animation
const backBtn = document.querySelector('.back-btn');
if (backBtn) {
    backBtn.addEventListener('mouseenter', function() {
        gsap.to(this.querySelector('i'), {
            x: -4,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    backBtn.addEventListener('mouseleave', function() {
        gsap.to(this.querySelector('i'), {
            x: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
}

// Form Submit Animation
const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
        const submitBtn = document.querySelector('button[type="submit"]');
        
        gsap.to(submitBtn, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
    });
}
