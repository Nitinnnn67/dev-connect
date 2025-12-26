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
    techHidden.value = technologies.join(',');
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
    skillsHidden.value = skills.join(',');
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

// Form Validation
const projectForm = document.getElementById('projectForm');
projectForm.addEventListener('submit', (e) => {
    // Validate required fields
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const teamSize = document.getElementById('teamSize').value;
    const duration = document.getElementById('duration').value.trim();
    
    if (!title || !description || !teamSize || !duration) {
        e.preventDefault();
        alert('Please fill in all required fields');
        return false;
    }
    
    // Validate description length
    if (description.length < 50) {
        e.preventDefault();
        alert('Description must be at least 50 characters');
        return false;
    }
    
    if (description.length > 2000) {
        e.preventDefault();
        alert('Description must be 2000 characters or less');
        return false;
    }
    
    // Check if at least one technology is added
    const techs = Array.from(document.querySelectorAll('.tech-tag'));
    if (techs.length === 0) {
        e.preventDefault();
        alert('Please add at least one technology');
        return false;
    }
    
    // Check if at least one skill is added
    const skills = Array.from(document.querySelectorAll('.skill-tag'));
    if (skills.length === 0) {
        e.preventDefault();
        alert('Please add at least one required skill or role');
        return false;
    }
    
    // Disable submit button to prevent double submission
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
    
    formChanged = false;
    return true;
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
