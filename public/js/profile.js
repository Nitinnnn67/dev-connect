// Profile Page Functionality

// Tab Switching
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Avatar Edit Button
const avatarEditBtn = document.querySelector('.avatar-edit-btn');
if (avatarEditBtn) {
    avatarEditBtn.addEventListener('click', () => {
        // Create file input dynamically
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    document.querySelector('.profile-avatar').src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
        
        fileInput.click();
    });
}

// Share Button
const shareBtn = document.querySelector('.btn-secondary');
if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
        const profileUrl = window.location.href;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check out my DevConnect profile',
                    url: profileUrl
                });
            } catch (err) {
                console.log('Share canceled');
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(profileUrl).then(() => {
                alert('Profile URL copied to clipboard!');
            });
        }
    });
}

// Skill Tag Interactions
const skillTags = document.querySelectorAll('.skill-tag');
skillTags.forEach(tag => {
    tag.addEventListener('click', () => {
        tag.style.transform = 'scale(0.95)';
        setTimeout(() => {
            tag.style.transform = 'scale(1)';
        }, 100);
    });
});
