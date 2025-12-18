// Profile Edit Page Functionality

// Avatar Upload
const avatarPreview = document.getElementById('avatarPreview');
const avatarInput = document.getElementById('avatarInput');
const uploadBtn = document.getElementById('uploadBtn');
const removeBtn = document.getElementById('removeBtn');
const avatarOverlay = document.querySelector('.avatar-preview');

uploadBtn.addEventListener('click', () => {
    avatarInput.click();
});

avatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            avatarPreview.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

avatarOverlay.addEventListener('click', () => {
    avatarInput.click();
});

removeBtn.addEventListener('click', () => {
    avatarPreview.src = 'https://ui-avatars.com/api/?name=User+Name&size=150&background=11293A&color=fff';
    avatarInput.value = '';
});

// Bio Character Counter
const bioTextarea = document.getElementById('bio');
const charCount = document.querySelector('.char-count');

function updateCharCount() {
    const length = bioTextarea.value.length;
    charCount.textContent = `${length} / 500`;
    
    if (length > 500) {
        charCount.style.color = '#dc3545';
    } else {
        charCount.style.color = '#3D4D55';
    }
}

bioTextarea.addEventListener('input', updateCharCount);
updateCharCount();

// Skills Management
const skillsDisplay = document.getElementById('skillsDisplay');
const skillInput = document.getElementById('skillInput');
const addSkillBtn = document.getElementById('addSkillBtn');
const skillsHidden = document.getElementById('skillsHidden');

function updateSkillsHidden() {
    const skills = [];
    document.querySelectorAll('.skill-tag').forEach(tag => {
        const skillText = tag.textContent.replace('×', '').trim();
        skills.push(skillText);
    });
    skillsHidden.value = JSON.stringify(skills);
}

function addSkill(skillName) {
    if (!skillName.trim()) return;
    
    // Check if skill already exists
    const existingSkills = Array.from(document.querySelectorAll('.skill-tag')).map(tag => 
        tag.textContent.replace('×', '').trim().toLowerCase()
    );
    
    if (existingSkills.includes(skillName.toLowerCase())) {
        alert('This skill is already added');
        return;
    }
    
    const skillTag = document.createElement('span');
    skillTag.className = 'skill-tag';
    skillTag.innerHTML = `${skillName}<button type="button" class="remove-skill">&times;</button>`;
    
    skillsDisplay.appendChild(skillTag);
    
    const removeBtn = skillTag.querySelector('.remove-skill');
    removeBtn.addEventListener('click', () => {
        skillTag.remove();
        updateSkillsHidden();
    });
    
    updateSkillsHidden();
}

addSkillBtn.addEventListener('click', () => {
    addSkill(skillInput.value);
    skillInput.value = '';
    skillInput.focus();
});

skillInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addSkill(skillInput.value);
        skillInput.value = '';
    }
});

// Initialize remove buttons for existing skills
document.querySelectorAll('.remove-skill').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.skill-tag').remove();
        updateSkillsHidden();
    });
});

updateSkillsHidden();

// Cancel Button
const cancelBtn = document.getElementById('cancelBtn');
cancelBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to discard changes?')) {
        window.history.back();
    }
});

// Delete Account
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
deleteAccountBtn.addEventListener('click', () => {
    const confirmation = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmation === 'DELETE') {
        alert('Account deletion would be processed here');
        // In production: send DELETE request to /users/:id
    }
});

// Form Validation
const profileForm = document.getElementById('profileForm');
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate required fields
    const fullName = document.getElementById('fullName').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    
    if (!fullName || !username || !email) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Validate bio length
    if (bioTextarea.value.length > 500) {
        alert('Bio must be 500 characters or less');
        return;
    }
    
    // Show success message (in production, this would submit the form)
    alert('Profile updated successfully!');
    // profileForm.submit(); // Uncomment for actual submission
});

// Unsaved Changes Warning
let formChanged = false;

profileForm.addEventListener('input', () => {
    formChanged = true;
});

window.addEventListener('beforeunload', (e) => {
    if (formChanged) {
        e.preventDefault();
        e.returnValue = '';
    }
});

profileForm.addEventListener('submit', () => {
    formChanged = false;
});
