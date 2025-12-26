// Search Page JavaScript

// Search functionality
const searchInput = document.getElementById('searchInput');
const searchBtn = document.querySelector('.search-btn');
const filterTabs = document.querySelectorAll('.filter-tab');

// Get current filter from URL
const urlParams = new URLSearchParams(window.location.search);
let currentFilter = urlParams.get('filter') || 'all';

// Set active filter tab based on URL
filterTabs.forEach(tab => {
    if (tab.dataset.type === currentFilter) {
        tab.classList.add('active');
    } else {
        tab.classList.remove('active');
    }
});

// Search on button click
if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
}

// Search on Enter key
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Filter tabs
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const query = searchInput ? searchInput.value.trim() : '';
        const filter = tab.dataset.type;
        
        // Redirect with new filter
        if (query) {
            window.location.href = `/search?query=${encodeURIComponent(query)}&filter=${filter}`;
        } else {
            // Update active tab without redirect if no query
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = filter;
        }
    });
});

// Perform search
function performSearch() {
    const query = searchInput.value.trim();
    
    if (query) {
        // Redirect to search with query
        window.location.href = `/search?query=${encodeURIComponent(query)}&filter=${currentFilter}`;
    }
}

// Debounce function for performance
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
