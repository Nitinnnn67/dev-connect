// GSAP Animations for Project Dashboard

gsap.registerPlugin(ScrollTrigger);

// Header Animation
gsap.fromTo('.dashboard-header',
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

gsap.fromTo('.project-info',
    { 
        opacity: 0,
        x: -30
    },
    { 
        opacity: 1,
        x: 0,
        duration: 0.5,
        delay: 0.2,
        ease: 'power2.out'
    }
);

gsap.fromTo('.header-actions',
    { 
        opacity: 0,
        x: 30
    },
    { 
        opacity: 1,
        x: 0,
        duration: 0.5,
        delay: 0.3,
        ease: 'power2.out'
    }
);

// Stat Cards Animation
gsap.fromTo('.stat-card',
    { 
        opacity: 0,
        y: 40,
        scale: 0.95
    },
    { 
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.4,
        ease: 'back.out(1.3)'
    }
);

// Content Cards Animation
gsap.fromTo('.content-main .content-card',
    { 
        opacity: 0,
        x: -30
    },
    { 
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.15,
        delay: 0.6,
        ease: 'power2.out'
    }
);

// Sidebar Cards Animation
gsap.fromTo('.content-sidebar .content-card',
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

// Task Items Animation
gsap.fromTo('.task-item',
    { 
        opacity: 0,
        x: -20
    },
    { 
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.08,
        delay: 1,
        ease: 'power2.out'
    }
);

// Circular Progress Animation
const progressCircle = document.querySelector('.progress-fill');
if (progressCircle) {
    gsap.fromTo(progressCircle,
        {
            strokeDashoffset: 534
        },
        {
            strokeDashoffset: 347,
            duration: 1.5,
            delay: 1.2,
            ease: 'power2.out'
        }
    );
}

// Progress Text Animation
gsap.fromTo('.progress-text',
    {
        textContent: 0
    },
    {
        textContent: 65,
        duration: 1.5,
        delay: 1.2,
        ease: 'power2.out',
        snap: { textContent: 1 },
        onUpdate: function() {
            const value = Math.round(this.targets()[0].textContent);
            this.targets()[0].textContent = value + '%';
        }
    }
);

// Activity Timeline Animation
gsap.fromTo('.activity-item',
    { 
        opacity: 0,
        x: -20
    },
    { 
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.activity-timeline',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        ease: 'power2.out'
    }
);

// Milestone Progress Animation
document.querySelectorAll('.milestone-bar').forEach((bar, index) => {
    const width = bar.style.width;
    gsap.fromTo(bar,
        {
            width: '0%'
        },
        {
            width: width,
            duration: 1,
            delay: 1.5 + (index * 0.2),
            ease: 'power2.out'
        }
    );
});

// Stat Card Hover Animation
document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        gsap.to(this, {
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        gsap.to(this.querySelector('.stat-icon'), {
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
        
        gsap.to(this.querySelector('.stat-icon'), {
            rotation: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Filter Button Animation
document.querySelectorAll('.filter-btn').forEach(btn => {
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

// Task Checkbox Animation
document.querySelectorAll('.task-checkbox input').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const label = this.nextElementSibling;
        
        if (this.checked) {
            gsap.fromTo(label,
                { scale: 0.8 },
                { 
                    scale: 1,
                    duration: 0.3,
                    ease: 'back.out(1.7)'
                }
            );
        }
    });
});

// Modal Animation
const modal = document.getElementById('addTaskModal');
const modalContent = document.querySelector('.modal-content');

if (modal) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (modal.classList.contains('active')) {
                    gsap.fromTo(modal,
                        { opacity: 0 },
                        { 
                            opacity: 1,
                            duration: 0.3,
                            ease: 'power2.out'
                        }
                    );
                    
                    gsap.fromTo(modalContent,
                        { 
                            scale: 0.9,
                            y: 30
                        },
                        { 
                            scale: 1,
                            y: 0,
                            duration: 0.3,
                            ease: 'back.out(1.4)'
                        }
                    );
                }
            }
        });
    });
    
    observer.observe(modal, { attributes: true });
}

// Team Member Hover
document.querySelectorAll('.team-member').forEach(member => {
    member.addEventListener('mouseenter', function() {
        gsap.to(this, {
            x: 5,
            duration: 0.2,
            ease: 'power2.out'
        });
        
        gsap.to(this.querySelector('img'), {
            scale: 1.1,
            duration: 0.2,
            ease: 'power2.out'
        });
    });
    
    member.addEventListener('mouseleave', function() {
        gsap.to(this, {
            x: 0,
            duration: 0.2,
            ease: 'power2.out'
        });
        
        gsap.to(this.querySelector('img'), {
            scale: 1,
            duration: 0.2,
            ease: 'power2.out'
        });
    });
});

// Quick Link Hover
document.querySelectorAll('.quick-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        gsap.to(this, {
            x: 5,
            duration: 0.2,
            ease: 'power2.out'
        });
        
        gsap.to(this.querySelector('i'), {
            scale: 1.2,
            rotation: 5,
            duration: 0.2,
            ease: 'power2.out'
        });
    });
    
    link.addEventListener('mouseleave', function() {
        gsap.to(this, {
            x: 0,
            duration: 0.2,
            ease: 'power2.out'
        });
        
        gsap.to(this.querySelector('i'), {
            scale: 1,
            rotation: 0,
            duration: 0.2,
            ease: 'power2.out'
        });
    });
});

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

// Action Button Hover
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        gsap.to(this, {
            scale: 1.1,
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

// Pulse Animation for Overdue Tasks
document.querySelectorAll('.task-item.overdue').forEach(task => {
    gsap.to(task, {
        boxShadow: '0 0 20px rgba(220, 53, 69, 0.3)',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
});

// Online Status Pulse
document.querySelectorAll('.member-status.online').forEach(status => {
    gsap.to(status, {
        scale: 1.3,
        opacity: 0.7,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
});
