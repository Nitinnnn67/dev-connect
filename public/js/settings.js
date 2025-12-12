// Settings Page JavaScript

// Elements
const navItems = document.querySelectorAll('.nav-item');
const settingsPanels = document.querySelectorAll('.settings-panel');
const themeOptions = document.querySelectorAll('.theme-option');
const toggleSwitches = document.querySelectorAll('.toggle-switch input');

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const section = item.dataset.section;
        
        // Update active nav item
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Show corresponding panel
        settingsPanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id === `${section}-panel`) {
                panel.classList.add('active');
                
                // Animate panel entrance
                gsap.fromTo(panel,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                );
            }
        });
        
        // Update URL hash
        window.history.pushState({}, '', `#${section}`);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Theme selection
themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        themeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        const theme = option.dataset.theme;
        applyTheme(theme);
        
        // Save to localStorage
        localStorage.setItem('theme', theme);
        
        // Animation
        gsap.fromTo(option,
            { scale: 0.95 },
            { scale: 1, duration: 0.3, ease: 'back.out(1.5)' }
        );
    });
});

// Apply theme
function applyTheme(theme) {
    // In production, this would apply actual theme changes
    console.log('Applying theme:', theme);
    
    if (theme === 'dark') {
        // Apply dark theme classes
        document.body.classList.add('dark-theme');
    } else if (theme === 'light') {
        document.body.classList.remove('dark-theme');
    } else {
        // Auto mode - detect system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
}

// Toggle switches
toggleSwitches.forEach(toggle => {
    toggle.addEventListener('change', function() {
        const item = this.closest('.toggle-item');
        const title = item.querySelector('h4').textContent;
        
        if (this.checked) {
            console.log(`${title}: Enabled`);
        } else {
            console.log(`${title}: Disabled`);
        }
        
        // Save to localStorage
        const settingKey = title.toLowerCase().replace(/\s+/g, '_');
        localStorage.setItem(settingKey, this.checked);
        
        // Animation
        gsap.fromTo(this.nextElementSibling,
            { backgroundColor: this.checked ? 'var(--surface-variant)' : 'var(--success-color)' },
            { duration: 0.3, ease: 'power2.out' }
        );
    });
});

// Form submissions
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted');
    });
});

// Save Changes buttons
const saveButtons = document.querySelectorAll('.btn-primary');
saveButtons.forEach(btn => {
    if (btn.textContent.includes('Save')) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Show loading state
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            btn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 1500);
            }, 1000);
        });
    }
});

// Delete Account button
const deleteAccountBtn = document.querySelector('.btn-danger');
if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', () => {
        const confirmation = prompt('Type "DELETE" to confirm account deletion:');
        
        if (confirmation === 'DELETE') {
            if (confirm('Are you absolutely sure? This action cannot be undone.')) {
                console.log('Account deletion confirmed');
                // In production, handle account deletion
                alert('Account deletion initiated. You will receive a confirmation email.');
            }
        } else if (confirmation !== null) {
            alert('Confirmation failed. Account not deleted.');
        }
    });
}

// Enable 2FA button
const enable2FABtn = document.querySelector('.security-status .btn-primary');
if (enable2FABtn) {
    enable2FABtn.addEventListener('click', () => {
        alert('Two-Factor Authentication setup will be available soon!');
        // In production, open 2FA setup modal
    });
}

// Revoke Session buttons
const revokeButtons = document.querySelectorAll('.session-item .btn-secondary-small');
revokeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        if (confirm('Revoke this session?')) {
            const sessionItem = this.closest('.session-item');
            
            gsap.to(sessionItem, {
                opacity: 0,
                x: 50,
                height: 0,
                marginBottom: 0,
                duration: 0.4,
                ease: 'power2.in',
                onComplete: () => {
                    sessionItem.remove();
                }
            });
        }
    });
});

// Integration buttons
const connectButtons = document.querySelectorAll('.integration-item .btn-primary-small');
connectButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const integration = this.closest('.integration-item');
        const name = integration.querySelector('h4').textContent;
        
        // Simulate OAuth flow
        console.log(`Connecting to ${name}...`);
        
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        this.disabled = true;
        
        setTimeout(() => {
            integration.classList.add('connected');
            integration.querySelector('.integration-info p').textContent = `Connected as @johndoe123`;
            this.textContent = 'Disconnect';
            this.classList.remove('btn-primary-small');
            this.classList.add('btn-secondary-small');
            this.disabled = false;
            
            // Animation
            gsap.fromTo(integration,
                { scale: 1.05, backgroundColor: 'rgba(40, 167, 69, 0.1)' },
                { scale: 1, backgroundColor: 'rgba(40, 167, 69, 0.05)', duration: 0.5, ease: 'power2.out' }
            );
        }, 1500);
    });
});

const disconnectButtons = document.querySelectorAll('.integration-item.connected .btn-secondary-small');
disconnectButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const integration = this.closest('.integration-item');
        const name = integration.querySelector('h4').textContent;
        
        if (confirm(`Disconnect from ${name}?`)) {
            integration.classList.remove('connected');
            integration.querySelector('.integration-info p').textContent = integration.querySelector('.integration-info p').textContent.split('Connected')[0].trim();
            this.textContent = 'Connect';
            this.classList.remove('btn-secondary-small');
            this.classList.add('btn-primary-small');
        }
    });
});

// Upgrade to Pro button
const upgradeBtn = document.querySelector('.plan-info .btn-primary');
if (upgradeBtn) {
    upgradeBtn.addEventListener('click', () => {
        alert('Upgrade to Pro - Coming soon!');
        // In production, open pricing modal or redirect to checkout
    });
}

// Clear Cache button
const clearCacheBtn = document.querySelector('.btn-secondary');
if (clearCacheBtn && clearCacheBtn.textContent.includes('Clear Cache')) {
    clearCacheBtn.addEventListener('click', function() {
        if (confirm('Clear all cached data?')) {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Clearing...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> Cache Cleared!';
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-trash"></i> Clear Cache';
                    this.disabled = false;
                }, 1500);
            }, 1000);
        }
    });
}

// Request Data Export button
const exportBtn = document.querySelector('.settings-card:has(h3:contains("Export Data")) .btn-secondary');
if (exportBtn) {
    exportBtn.addEventListener('click', function() {
        if (confirm('Request a copy of your data? You will receive a download link via email.')) {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            this.disabled = true;
            
            setTimeout(() => {
                alert('Data export requested! You will receive an email with a download link within 24 hours.');
                this.innerHTML = '<i class="fas fa-download"></i> Request Data Export';
                this.disabled = false;
            }, 2000);
        }
    });
}

// Regenerate API Key button
const regenerateBtn = document.querySelector('.api-key-group .btn-secondary-small');
if (regenerateBtn) {
    regenerateBtn.addEventListener('click', function() {
        if (confirm('Regenerate API key? Your current key will be invalidated.')) {
            const input = this.previousElementSibling;
            const newKey = 'sk_test_' + Math.random().toString(36).substring(2, 15);
            
            gsap.to(input, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    input.value = newKey;
                    gsap.to(input, { opacity: 1, duration: 0.2 });
                }
            });
        }
    });
}

// Load theme from localStorage
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeOption = document.querySelector(`[data-theme="${savedTheme}"]`);
    if (themeOption) {
        themeOption.click();
    }
    
    // Load URL hash
    const hash = window.location.hash.substring(1);
    if (hash) {
        const navItem = document.querySelector(`[data-section="${hash}"]`);
        if (navItem) {
            navItem.click();
        }
    }
});

// Unsaved changes warning
let hasUnsavedChanges = false;

document.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('change', () => {
        hasUnsavedChanges = true;
    });
});

saveButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        hasUnsavedChanges = false;
    });
});

window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const activePanel = document.querySelector('.settings-panel.active');
        const saveBtn = activePanel.querySelector('.btn-primary');
        if (saveBtn && saveBtn.textContent.includes('Save')) {
            saveBtn.click();
        }
    }
});

// Animation for settings cards
const settingsCards = document.querySelectorAll('.settings-card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            gsap.fromTo(entry.target,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
            );
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

settingsCards.forEach(card => observer.observe(card));

console.log('Settings page initialized');
