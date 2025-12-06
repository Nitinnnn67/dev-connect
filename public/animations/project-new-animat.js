// GSAP Animations for Create Project Page

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

// Main Form Cards Animation
const mainCards = document.querySelectorAll('.form-main .form-card');
gsap.fromTo(mainCards,
    { 
        opacity: 0,
        x: -30
    },
    { 
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.3,
        ease: 'power2.out'
    }
);

// Sidebar Cards Animation
const sidebarCards = document.querySelectorAll('.form-sidebar .form-card');
gsap.fromTo(sidebarCards,
    { 
        opacity: 0,
        x: 30
    },
    { 
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.5,
        ease: 'power2.out'
    }
);

// Form Actions Animation
gsap.fromTo('.form-actions',
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

// Back Button Animation
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

// Form Input Focus Animations
const formInputs = document.querySelectorAll('input, select, textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        gsap.to(this, {
            scale: 1.01,
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

// Tech/Skill Tag Add Animation
const techObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.classList && (node.classList.contains('tech-tag') || node.classList.contains('skill-tag'))) {
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

const techDisplay = document.getElementById('techDisplay');
const skillsDisplay = document.getElementById('skillsDisplay');

if (techDisplay) {
    techObserver.observe(techDisplay, { childList: true });
}

if (skillsDisplay) {
    techObserver.observe(skillsDisplay, { childList: true });
}

// Quick Add Button Hover
document.querySelectorAll('.quick-tech-btn, .quick-skill-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        gsap.to(this, {
            scale: 1.05,
            duration: 0.2,
            ease: 'back.out(1.7)'
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

// Image Preview Animation
const imagePreview = document.getElementById('imagePreview');
if (imagePreview) {
    imagePreview.addEventListener('mouseenter', function() {
        gsap.to(this, {
            scale: 1.02,
            borderColor: '#B58863',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    imagePreview.addEventListener('mouseleave', function() {
        gsap.to(this, {
            scale: 1,
            borderColor: '#E1E4E8',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
}

// Button Animations
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        gsap.to(this, {
            scale: 1.03,
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

// Form Submit Animation
const projectForm = document.getElementById('projectForm');
if (projectForm) {
    projectForm.addEventListener('submit', function(e) {
        const submitBtn = document.querySelector('.btn-large');
        
        gsap.to(submitBtn, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
        
        // Loading animation
        gsap.to(submitBtn.querySelector('i'), {
            rotation: 360,
            duration: 0.6,
            ease: 'power2.inOut'
        });
    });
}

// Tips Card Pulse Animation
const tipsCard = document.querySelector('.tips-card');
if (tipsCard) {
    gsap.to(tipsCard, {
        boxShadow: '0 0 30px rgba(181, 136, 99, 0.3)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

// Tips List Items Fade In
const tipsItems = document.querySelectorAll('.tips-list li');
gsap.fromTo(tipsItems,
    { 
        opacity: 0,
        x: -20
    },
    { 
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.1,
        delay: 1,
        ease: 'power2.out'
    }
);

// Card Title Icon Rotation on Hover
document.querySelectorAll('.card-title').forEach(title => {
    const icon = title.querySelector('i');
    if (icon) {
        title.addEventListener('mouseenter', function() {
            gsap.to(icon, {
                rotation: 360,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    }
});
