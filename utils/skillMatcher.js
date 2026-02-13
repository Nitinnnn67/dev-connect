/**
 * Skill Matching Algorithm for Dev-Connect
 * Provides intelligent matching between user skills and project requirements
 */

/**
 * Skill synonyms and related technologies
 * Helps match similar skills even with different naming conventions
 */
const skillSynonyms = {
    'javascript': ['js', 'ecmascript', 'es6', 'es2015'],
    'typescript': ['ts'],
    'react': ['reactjs', 'react.js'],
    'vue': ['vuejs', 'vue.js'],
    'angular': ['angularjs', 'angular.js'],
    'node': ['nodejs', 'node.js'],
    'express': ['expressjs', 'express.js'],
    'mongodb': ['mongo'],
    'postgresql': ['postgres', 'psql'],
    'python': ['py'],
    'c++': ['cpp', 'cplusplus'],
    'c#': ['csharp', 'cs'],
    'react native': ['reactnative'],
    'machine learning': ['ml', 'machinelearning'],
    'artificial intelligence': ['ai'],
    'css': ['css3'],
    'html': ['html5'],
    'mysql': ['my-sql'],
    'next': ['nextjs', 'next.js'],
    'nuxt': ['nuxtjs', 'nuxt.js'],
};

/**
 * Related skills - technologies that often go together
 * Used for suggesting users who have complementary skills
 */
const relatedSkills = {
    'react': ['redux', 'react router', 'next', 'jsx'],
    'vue': ['vuex', 'vue router', 'nuxt'],
    'angular': ['rxjs', 'typescript', 'ngrx'],
    'node': ['express', 'npm', 'javascript'],
    'express': ['node', 'mongodb', 'mongoose'],
    'mongodb': ['mongoose', 'express', 'node'],
    'postgresql': ['sql', 'sequelize'],
    'python': ['django', 'flask', 'fastapi'],
    'django': ['python', 'postgresql'],
    'flask': ['python'],
    'docker': ['kubernetes', 'devops'],
    'kubernetes': ['docker', 'devops'],
    'aws': ['cloud', 'devops'],
    'azure': ['cloud', 'devops'],
    'gcp': ['google cloud', 'cloud', 'devops'],
};

/**
 * Normalize skill string for comparison
 * Converts to lowercase, removes special characters, and trims whitespace
 */
function normalizeSkill(skill) {
    if (!skill) return '';
    return skill.toLowerCase().trim().replace(/[^a-z0-9+#\s]/g, '');
}

/**
 * Check if two skills match (exact or synonym match)
 * @param {string} skill1 - First skill to compare
 * @param {string} skill2 - Second skill to compare
 * @returns {object} - { matches: boolean, weight: number }
 */
function skillsMatch(skill1, skill2) {
    const normalized1 = normalizeSkill(skill1);
    const normalized2 = normalizeSkill(skill2);
    
    // Exact match
    if (normalized1 === normalized2) {
        return { matches: true, weight: 1.0 };
    }
    
    // Check synonyms
    for (const [key, synonyms] of Object.entries(skillSynonyms)) {
        const allVariants = [key, ...synonyms];
        const has1 = allVariants.includes(normalized1);
        const has2 = allVariants.includes(normalized2);
        
        if (has1 && has2) {
            return { matches: true, weight: 0.9 }; // Synonym match
        }
    }
    
    // Partial match (one contains the other)
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
        return { matches: true, weight: 0.6 };
    }
    
    return { matches: false, weight: 0 };
}

/**
 * Check if a skill is related to another skill
 * @param {string} skill1 - First skill
 * @param {string} skill2 - Second skill
 * @returns {boolean} - True if skills are related
 */
function areSkillsRelated(skill1, skill2) {
    const normalized1 = normalizeSkill(skill1);
    const normalized2 = normalizeSkill(skill2);
    
    // Check if skill2 is in skill1's related skills
    const related1 = relatedSkills[normalized1] || [];
    if (related1.some(s => normalizeSkill(s) === normalized2)) {
        return true;
    }
    
    // Check reverse
    const related2 = relatedSkills[normalized2] || [];
    if (related2.some(s => normalizeSkill(s) === normalized1)) {
        return true;
    }
    
    return false;
}

/**
 * Calculate match score between user skills and project requirements
 * @param {Array<string>} userSkills - Array of user's skills
 * @param {Array<string>} requiredSkills - Array of project's required skills
 * @returns {object} - Detailed match information
 */
function calculateSkillMatch(userSkills, requiredSkills) {
    if (!requiredSkills || requiredSkills.length === 0) {
        return {
            percentage: 0,
            matchedSkills: [],
            missingSkills: [],
            relatedSkills: [],
            totalRequired: 0,
            totalMatched: 0,
            weightedScore: 0
        };
    }
    
    if (!userSkills || userSkills.length === 0) {
        return {
            percentage: 0,
            matchedSkills: [],
            missingSkills: requiredSkills,
            relatedSkills: [],
            totalRequired: requiredSkills.length,
            totalMatched: 0,
            weightedScore: 0
        };
    }
    
    const matchedSkills = [];
    const missingSkills = [];
    const relatedSkillsFound = [];
    let weightedScore = 0;
    
    // Check each required skill
    for (const requiredSkill of requiredSkills) {
        let bestMatch = { matches: false, weight: 0, userSkill: null };
        
        // Find best matching user skill
        for (const userSkill of userSkills) {
            const match = skillsMatch(requiredSkill, userSkill);
            if (match.matches && match.weight > bestMatch.weight) {
                bestMatch = { ...match, userSkill };
            }
        }
        
        if (bestMatch.matches) {
            matchedSkills.push({
                required: requiredSkill,
                matched: bestMatch.userSkill,
                weight: bestMatch.weight
            });
            weightedScore += bestMatch.weight;
        } else {
            // Check for related skills
            let hasRelated = false;
            for (const userSkill of userSkills) {
                if (areSkillsRelated(requiredSkill, userSkill)) {
                    relatedSkillsFound.push({
                        required: requiredSkill,
                        related: userSkill
                    });
                    weightedScore += 0.3; // Related skill weight
                    hasRelated = true;
                    break;
                }
            }
            
            if (!hasRelated) {
                missingSkills.push(requiredSkill);
            }
        }
    }
    
    // Calculate percentage
    const maxScore = requiredSkills.length;
    const percentage = Math.round((weightedScore / maxScore) * 100);
    
    return {
        percentage: Math.min(percentage, 100), // Cap at 100%
        matchedSkills,
        missingSkills,
        relatedSkills: relatedSkillsFound,
        totalRequired: requiredSkills.length,
        totalMatched: matchedSkills.length,
        weightedScore: parseFloat(weightedScore.toFixed(2))
    };
}

/**
 * Get recommended projects for a user based on their skills
 * @param {object} user - User object with skills array
 * @param {Array<object>} projects - Array of project objects
 * @param {number} minMatchPercentage - Minimum match percentage (default: 30)
 * @returns {Array<object>} - Sorted array of projects with match scores
 */
function getRecommendedProjects(user, projects, minMatchPercentage = 30) {
    if (!user || !user.skills || user.skills.length === 0) {
        return [];
    }
    
    const projectsWithScores = projects.map(project => {
        const matchInfo = calculateSkillMatch(user.skills, project.requiredSkills);
        
        return {
            project,
            matchInfo,
            ...matchInfo // Spread match info for easier access
        };
    });
    
    // Filter by minimum match percentage and sort by score
    return projectsWithScores
        .filter(p => p.percentage >= minMatchPercentage)
        .sort((a, b) => {
            // Primary sort: percentage
            if (b.percentage !== a.percentage) {
                return b.percentage - a.percentage;
            }
            // Secondary sort: weighted score
            return b.weightedScore - a.weightedScore;
        });
}

/**
 * Get recommended users for a project based on required skills
 * @param {object} project - Project object with requiredSkills array
 * @param {Array<object>} users - Array of user objects
 * @param {number} minMatchPercentage - Minimum match percentage (default: 40)
 * @returns {Array<object>} - Sorted array of users with match scores
 */
function getRecommendedUsers(project, users, minMatchPercentage = 40) {
    if (!project || !project.requiredSkills || project.requiredSkills.length === 0) {
        return [];
    }
    
    const usersWithScores = users.map(user => {
        const matchInfo = calculateSkillMatch(user.skills, project.requiredSkills);
        
        return {
            user,
            matchInfo,
            ...matchInfo // Spread match info for easier access
        };
    });
    
    // Filter by minimum match percentage and sort by score
    return usersWithScores
        .filter(u => u.percentage >= minMatchPercentage)
        .sort((a, b) => {
            // Primary sort: percentage
            if (b.percentage !== a.percentage) {
                return b.percentage - a.percentage;
            }
            // Secondary sort: weighted score
            return b.weightedScore - a.weightedScore;
        });
}

/**
 * Get skill match badge/label based on percentage
 * @param {number} percentage - Match percentage
 * @returns {object} - Badge info with label and color
 */
function getMatchBadge(percentage) {
    if (percentage >= 90) {
        return { label: 'Excellent Match', color: 'success', icon: '🎯' };
    } else if (percentage >= 70) {
        return { label: 'Great Match', color: 'primary', icon: '⭐' };
    } else if (percentage >= 50) {
        return { label: 'Good Match', color: 'info', icon: '👍' };
    } else if (percentage >= 30) {
        return { label: 'Fair Match', color: 'warning', icon: '✓' };
    } else {
        return { label: 'Low Match', color: 'secondary', icon: '−' };
    }
}

module.exports = {
    calculateSkillMatch,
    getRecommendedProjects,
    getRecommendedUsers,
    getMatchBadge,
    skillsMatch,
    areSkillsRelated,
    normalizeSkill
};
