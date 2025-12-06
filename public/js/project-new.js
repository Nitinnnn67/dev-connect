// Create Project Page Functionality

// Character Counter for Description
const descriptionTextarea = document.getElementById('description');
const charCount = document.querySelector('.char-count');

function updateCharCount() {
    const length = descriptionTextarea.value.length;
    charCount.textContent = `${length} / 2000`;
    
    if (length > 2000) {
        charCount.style.color = '#dc3545';
    } else {
        charCount.style.color = '#3D4D55';
    }
}

descriptionTextarea.addEventListener('input', updateCharCount);
updateCharCount();

// Technology Stack Management
const techDisplay = document.getElementById('techDisplay');
const techInput = document.getElementById('techInput');
const addTechBtn = document.getElementById('addTechBtn');
const techHidden = document.getElementById('techHidden');

function updateTechHidden() {
    const technologies = [];
    document.querySelectorAll('.tech-tag').forEach(tag => {
        const techText = tag.textContent.replace('×', '').trim();
        technologies.push(techText);
    });
    techHidden.value = JSON.stringify(technologies);
}

function addTechnology(techName) {
    if (!techName.trim()) return;
    
    // Check if technology already exists
    const existingTech = Array.from(document.querySelectorAll('.tech-tag')).map(tag => 
        tag.textContent.replace('×', '').trim().toLowerCase()
    );
    
    if (existingTech.includes(techName.toLowerCase())) {
        alert('This technology is already added');
        return;
    }
    
    const techTag = document.createElement('span');
    techTag.className = 'tech-tag';
    techTag.innerHTML = `${techName}<button type="button" class="remove-tech">&times;</button>`;
    
    techDisplay.appendChild(techTag);
    
    const removeBtn = techTag.querySelector('.remove-tech');
    removeBtn.addEventListener('click', () => {
        techTag.remove();
        updateTechHidden();
    });
    
    updateTechHidden();
}

addTechBtn.addEventListener('click', () => {
    addTechnology(techInput.value);
    techInput.value = '';
    techInput.focus();
});

techInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTechnology(techInput.value);
        techInput.value = '';
    }
});

// Quick Add Technology Buttons
document.querySelectorAll('.quick-tech-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tech = btn.getAttribute('data-tech');
        addTechnology(tech);
    });
});

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

// Quick Add Skill Buttons
document.querySelectorAll('.quick-skill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const skill = btn.getAttribute('data-skill');
        addSkill(skill);
    });
});

// Image Upload
const projectImage = document.getElementById('projectImage');
const imagePreview = document.getElementById('imagePreview');
const uploadImageBtn = document.getElementById('uploadImageBtn');

uploadImageBtn.addEventListener('click', () => {
    projectImage.click();
});

imagePreview.addEventListener('click', () => {
    projectImage.click();
});

projectImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.innerHTML = `<img src="${event.target.result}" alt="Project Image">`;
        };
        reader.readAsDataURL(file);
    }
});

// Save Draft
const saveDraftBtn = document.getElementById('saveDraftBtn');
saveDraftBtn.addEventListener('click', () => {
    const formData = new FormData(document.getElementById('projectForm'));
    formData.append('isDraft', 'true');
    
    // In production, save to localStorage or send to server
    localStorage.setItem('projectDraft', JSON.stringify(Object.fromEntries(formData)));
    alert('Draft saved successfully!');
});

// Load Draft on Page Load
window.addEventListener('DOMContentLoaded', () => {
    const draft = localStorage.getItem('projectDraft');
    if (draft && confirm('You have a saved draft. Would you like to load it?')) {
        const draftData = JSON.parse(draft);
        
        // Populate form fields
        Object.keys(draftData).forEach(key => {
            const field = document.querySelector(`[name="${key}"]`);
            if (field && field.type !== 'file') {
                if (field.type === 'checkbox') {
                    field.checked = draftData[key] === 'on';
                } else {
                    field.value = draftData[key];
                }
            }
        });
        
        // Load technologies
        if (draftData.techStack) {
            try {
                const techs = JSON.parse(draftData.techStack);
                techs.forEach(tech => addTechnology(tech));
            } catch (e) {}
        }
        
        // Load skills
        if (draftData.requiredSkills) {
            try {
                const skills = JSON.parse(draftData.requiredSkills);
                skills.forEach(skill => addSkill(skill));
            } catch (e) {}
        }
        
        updateCharCount();
    }
});

// Form Validation
const projectForm = document.getElementById('projectForm');
projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate required fields
    const projectName = document.getElementById('projectName').value.trim();
    const tagline = document.getElementById('tagline').value.trim();
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value;
    const teamSize = document.getElementById('teamSize').value;
    const duration = document.getElementById('duration').value;
    const status = document.getElementById('status').value;
    const difficulty = document.getElementById('difficulty').value;
    const goals = document.getElementById('goals').value.trim();
    
    if (!projectName || !tagline || !description || !category || 
        !teamSize || !duration || !status || !difficulty || !goals) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Validate description length
    if (description.length > 2000) {
        alert('Description must be 2000 characters or less');
        return;
    }
    
    // Check if at least one technology is added
    const techs = Array.from(document.querySelectorAll('.tech-tag'));
    if (techs.length === 0) {
        alert('Please add at least one technology');
        return;
    }
    
    // Check if at least one skill is added
    const skills = Array.from(document.querySelectorAll('.skill-tag'));
    if (skills.length === 0) {
        alert('Please add at least one required skill or role');
        return;
    }
    
    // Clear draft from localStorage
    localStorage.removeItem('projectDraft');
    
    // Show success message (in production, this would submit the form)
    alert('Project created successfully!');
    // projectForm.submit(); // Uncomment for actual submission
    
    // Redirect to projects page
    // window.location.href = '/projects';
});

// Unsaved Changes Warning
let formChanged = false;

projectForm.addEventListener('input', () => {
    formChanged = true;
});

window.addEventListener('beforeunload', (e) => {
    if (formChanged) {
        e.preventDefault();
        e.returnValue = '';
    }
});

projectForm.addEventListener('submit', () => {
    formChanged = false;
});
