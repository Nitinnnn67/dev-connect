// Projects Page Functionality

const projectsGrid = document.getElementById('projectsGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sortSelect');
const emptyState = document.getElementById('emptyState');
const dropdownBtn = document.querySelector('.dropdown-btn');
const filterDropdown = document.querySelector('.filter-dropdown');

// Get all project cards
const allProjects = Array.from(document.querySelectorAll('.project-card'));

// Current filter state
let currentStatusFilter = 'all';
let currentSearchQuery = '';
let currentTechFilters = [];

// Toggle Dropdown
dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    filterDropdown.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!filterDropdown.contains(e.target)) {
        filterDropdown.classList.remove('active');
    }
});

// Technology Filter Checkboxes
const techCheckboxes = document.querySelectorAll('.dropdown-content input[type="checkbox"]');
techCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        currentTechFilters = Array.from(techCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value.toLowerCase());
        filterProjects();
    });
});

// Status Filter Buttons
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentStatusFilter = button.getAttribute('data-filter');
        filterProjects();
    });
});

// Search Input
searchInput.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value.toLowerCase();
    filterProjects();
});

// Sort Select
sortSelect.addEventListener('change', () => {
    sortProjects();
});

// Filter Projects Function
function filterProjects() {
    let visibleCount = 0;
    
    allProjects.forEach(card => {
        const status = card.getAttribute('data-status');
        const tags = card.getAttribute('data-tags').toLowerCase();
        const title = card.querySelector('.project-title').textContent.toLowerCase();
        const description = card.querySelector('.project-description').textContent.toLowerCase();
        
        // Status filter
        let statusMatch = currentStatusFilter === 'all' || status === currentStatusFilter;
        
        // Search filter
        let searchMatch = currentSearchQuery === '' || 
                         title.includes(currentSearchQuery) || 
                         description.includes(currentSearchQuery) ||
                         tags.includes(currentSearchQuery);
        
        // Technology filter
        let techMatch = currentTechFilters.length === 0 || 
                       currentTechFilters.some(tech => tags.includes(tech));
        
        // Show/hide card
        if (statusMatch && searchMatch && techMatch) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show/hide empty state
    if (visibleCount === 0) {
        emptyState.style.display = 'block';
        projectsGrid.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        projectsGrid.style.display = 'grid';
    }
}

// Sort Projects Function
function sortProjects() {
    const sortValue = sortSelect.value;
    const visibleProjects = allProjects.filter(card => card.style.display !== 'none');
    
    let sortedProjects = [...visibleProjects];
    
    switch(sortValue) {
        case 'recent':
            // Keep original order (most recent first)
            sortedProjects.reverse();
            break;
            
        case 'popular':
            sortedProjects.sort((a, b) => {
                const starsA = parseInt(a.querySelector('.fa-star').nextSibling.textContent.trim());
                const starsB = parseInt(b.querySelector('.fa-star').nextSibling.textContent.trim());
                return starsB - starsA;
            });
            break;
            
        case 'members':
            sortedProjects.sort((a, b) => {
                const membersA = parseInt(a.querySelector('.fa-users').nextSibling.textContent.split('/')[0]);
                const membersB = parseInt(b.querySelector('.fa-users').nextSibling.textContent.split('/')[0]);
                return membersB - membersA;
            });
            break;
            
        case 'alphabetical':
            sortedProjects.sort((a, b) => {
                const titleA = a.querySelector('.project-title').textContent;
                const titleB = b.querySelector('.project-title').textContent;
                return titleA.localeCompare(titleB);
            });
            break;
    }
    
    // Re-append sorted cards
    sortedProjects.forEach(card => {
        projectsGrid.appendChild(card);
    });
}

// Project Card Click Analytics (optional)
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const projectCard = e.target.closest('.project-card');
        const projectTitle = projectCard.querySelector('.project-title').textContent;
        console.log(`Viewing project: ${projectTitle}`);
        // Could send analytics here
    });
});

// Highlight matched search terms (optional enhancement)
function highlightSearchTerm(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Clear all filters button (optional)
function createClearFiltersButton() {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'filter-btn';
    clearBtn.innerHTML = '<i class="fas fa-times"></i> Clear Filters';
    clearBtn.style.display = 'none';
    
    clearBtn.addEventListener('click', () => {
        // Reset all filters
        currentStatusFilter = 'all';
        currentSearchQuery = '';
        currentTechFilters = [];
        
        // Reset UI
        filterButtons.forEach(btn => btn.classList.remove('active'));
        filterButtons[0].classList.add('active'); // First button (All)
        searchInput.value = '';
        techCheckboxes.forEach(cb => cb.checked = false);
        sortSelect.value = 'recent';
        
        // Re-filter
        filterProjects();
        sortProjects();
        
        clearBtn.style.display = 'none';
    });
    
    return clearBtn;
}

// Show/hide clear filters button based on active filters
function updateClearButton() {
    const hasActiveFilters = currentStatusFilter !== 'all' || 
                            currentSearchQuery !== '' || 
                            currentTechFilters.length > 0;
    
    // Add clear button logic here if needed
}

// Initialize
filterProjects();
