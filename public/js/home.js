// Home Page Functionality

// Animate stat numbers on scroll
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const isPercentage = finalValue.includes('%');
                const numValue = parseInt(finalValue);
                
                let current = 0;
                const increment = numValue / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= numValue) {
                        target.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(current) + (isPercentage ? '%' : '');
                    }
                }, 20);
                
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    animateStats();
});

// Quick action cards interaction
document.querySelectorAll('.action-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.action-icon');
        icon.style.transform = 'rotate(10deg) scale(1.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.action-icon');
        icon.style.transform = 'rotate(0deg) scale(1)';
    });
});
