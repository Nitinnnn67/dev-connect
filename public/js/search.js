// Search Page JavaScript

// Search functionality
const searchInput = document.getElementById('searchInput');
const searchBtn = document.querySelector('.search-btn');
const filterTabs = document.querySelectorAll('.filter-tab');
const resultCards = document.querySelectorAll('.result-card');
const projectsResults = document.getElementById('projectsResults');
const usersResults = document.getElementById('usersResults');
const noResults = document.getElementById('noResults');

let currentFilter = 'all';

// Search on button click
searchBtn.addEventListener('click', performSearch);

// Search on Enter key
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Real-time search as user types
searchInput.addEventListener('input', debounce(filterResults, 300));

// Filter tabs
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Update active tab
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Get filter type
        currentFilter = tab.dataset.type;
        
        // Filter results
        filterResults();
        
        // Animate filter change
        gsap.fromTo('.result-card',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
        );
    });
});

// Perform search
function performSearch() {
    const query = searchInput.value.trim();
    
    if (query) {
        // In production, this would make an API call
        console.log('Searching for:', query);
        
        // Simulate search with animation
        gsap.fromTo('.result-card',
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.2)' }
        );
        
        // Update URL with query parameter (optional)
        const url = new URL(window.location);
        url.searchParams.set('query', query);
        window.history.pushState({}, '', url);
    }
}

// Filter results based on current filter and search query
function filterResults() {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;
    
    resultCards.forEach(card => {
        const cardType = card.dataset.type;
        const cardText = card.textContent.toLowerCase();
        
        // Check if card matches filter and search query
        const matchesFilter = currentFilter === 'all' || cardType === currentFilter;
        const matchesSearch = !query || cardText.includes(query);
        
        if (matchesFilter && matchesSearch) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update results sections visibility
    const visibleProjects = document.querySelectorAll('.project-card[style="display: flex;"]').length;
    const visibleUsers = document.querySelectorAll('.user-card[style="display: flex;"]').length;
    
    if (currentFilter === 'all' || currentFilter === 'projects') {
        projectsResults.style.display = visibleProjects > 0 ? 'block' : 'none';
    } else {
        projectsResults.style.display = 'none';
    }
    
    if (currentFilter === 'all' || currentFilter === 'users') {
        usersResults.style.display = visibleUsers > 0 ? 'block' : 'none';
    } else {
        usersResults.style.display = 'none';
    }
    
    // Show/hide no results message
    if (visibleCount === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }
    
    // Update results count
    updateResultsCount(visibleCount);
}

// Update results count
function updateResultsCount(count) {
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        resultsCount.textContent = `Found ${count} result${count !== 1 ? 's' : ''}`;
    }
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Card hover effects
resultCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        gsap.to(this, {
            y: -5,
            boxShadow: '0 8px 24px rgba(17, 41, 58, 0.12)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    card.addEventListener('mouseleave', function() {
        gsap.to(this, {
            y: 0,
            boxShadow: '0 2px 8px rgba(17, 41, 58, 0.08)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Focus search input on page load
window.addEventListener('load', () => {
    searchInput.focus();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        searchInput.value = '';
        searchInput.blur();
        filterResults();
    }
});

// Initialize
filterResults();

console.log('Search page initialized');
