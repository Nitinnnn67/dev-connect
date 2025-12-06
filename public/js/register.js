// Skills Management
const skillsInput = document.getElementById('skillsInput');
const skillsTags = document.getElementById('skillsTags');
const skillsHidden = document.getElementById('skillsHidden');
let skills = [];

if (skillsInput) {
    skillsInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const skill = this.value.trim();
            if (skill && !skills.includes(skill)) {
                skills.push(skill);
                updateSkillsTags();
                this.value = '';
            }
        }
    });
}

function updateSkillsTags() {
    if (skillsTags) {
        skillsTags.innerHTML = '';
        skills.forEach(skill => {
            const tag = document.createElement('div');
            tag.className = 'skill-tag';
            tag.innerHTML = `
                ${skill}
                <span class="remove-skill" onclick="removeSkill('${skill}')">×</span>
            `;
            skillsTags.appendChild(tag);
        });
    }
    if (skillsHidden) {
        skillsHidden.value = JSON.stringify(skills);
    }
}

function removeSkill(skill) {
    skills = skills.filter(s => s !== skill);
    updateSkillsTags();
}

// Password Toggle
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}
